/**
 * src/lib/realtimeNotifications.ts
 * ------------------------------------------------------------------
 * Multi-device real-time push notification service for SkillSetu.
 *
 * Combines:
 *  1. Firestore `onSnapshot` for multi-device real-time sync across
 *     different laptops, browsers, or mobile devices.
 *  2. Dual-channel fallback to `syncBridge.ts` (localStorage + CustomEvent)
 *     so offline / emulator / network failure modes never stall the UI.
 *  3. Self-contained synthetic audio chimes via the Web Audio API
 *     (no external .mp3 asset dependencies required).
 * ------------------------------------------------------------------
 */

import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  publishNotification,
  SyncNotification,
  isBrowser,
} from '@/lib/syncBridge';

export interface RealtimeNotification extends SyncNotification {
  recipientUid?: string;
  createdAtMillis?: number;
}

function isRealtimeNotification(value: unknown): value is RealtimeNotification {
  if (!value || typeof value !== 'object') return false;
  const notification = value as Partial<RealtimeNotification>;
  return typeof notification.id === 'string' &&
    (notification.target === 'student' || notification.target === 'industry' || notification.target === 'college') &&
    typeof notification.title === 'string' &&
    typeof notification.message === 'string' &&
    typeof notification.time === 'string' &&
    typeof notification.read === 'boolean';
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Play a gentle, professional Web Audio chime for incoming notifications.
 * Self-contained: generates tones via oscillator without external media assets.
 */
export function playNotificationChime(type: 'notification' | 'offer' | 'interview' = 'notification') {
  if (!isBrowser()) return;

  try {
    const audioWindow = window as Window & { webkitAudioContext?: typeof AudioContext };
    const AudioContextClass = window.AudioContext || audioWindow.webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    gain.connect(ctx.destination);
    osc.connect(gain);

    if (type === 'offer') {
      // Pleasant three-tone ascending chord (Major triad)
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.24); // G5

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.start(now);
      osc.stop(now + 0.52);
    } else {
      // Gentle two-tone notification chime (D5 -> A5)
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880.0, now + 0.1); // A5

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.start(now);
      osc.stop(now + 0.36);
    }

    // Clean up audio context
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 1000);
  } catch (err) {
    // Audio synthesis failure is non-fatal
    console.debug('[AudioChime] Audio playback notice:', err);
  }
}

/**
 * Publish a real-time notification to Firestore and the local sync bus.
 */
export async function publishRealtimeNotification(
  notification: Omit<RealtimeNotification, 'id' | 'time'> & { id?: string }
): Promise<string> {
  const notifId = notification.id || `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const timeFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const payload: RealtimeNotification = {
    ...notification,
    id: notifId,
    time: timeFormatted,
    createdAtMillis: Date.now(),
  };

  // 1. Dual-channel dispatch: write to local sync bus immediately
  try {
    publishNotification(payload);
    // Dispatch a payload-carrying event for the same-tab fast-path so that
    // chimes + toasts work even when Firestore/emulators are offline.
    if (isBrowser()) {
      window.dispatchEvent(new CustomEvent('skillsetu:notification', { detail: payload }));
    }
  } catch (err) {
    console.debug('[RealtimeNotifications] syncBridge broadcast notice:', err);
  }

  // 2. Write to Firestore if connected
  if (db) {
    try {
      const colRef = collection(db, 'notifications');
      await addDoc(colRef, {
        ...payload,
        createdAt: serverTimestamp(),
      });
      console.log(`[RealtimeNotifications] Synced notification to Firestore for [${payload.target}]: ${payload.title}`);
    } catch (err: unknown) {
      console.info('[RealtimeNotifications] Firestore write notice (relying on syncBridge):', errorMessage(err));
    }
  }

  return notifId;
}

/**
 * Subscribe to real-time notifications for a given sector target ('student' | 'industry' | 'college').
 * Listens to Firestore `onSnapshot` AND local syncBridge events simultaneously.
 */
export function subscribeToRealtimeNotifications(
  targetSector: 'student' | 'industry' | 'college',
  onNotificationReceived: (notification: RealtimeNotification, isLivePush: boolean) => void,
  recipientUid?: string
): () => void {
  let isSubscribed = true;
  const subscriptionStartTime = Date.now();
  const seenIds = new Set<string>();

  // 1. Listen to Firestore onSnapshot
  let firestoreUnsub: (() => void) | null = null;

  if (db) {
    try {
      const notifsRef = collection(db, 'notifications');
      const q = query(
        notifsRef,
        where('target', 'in', [targetSector, 'all']),
        orderBy('createdAt', 'desc'),
        limit(20)
      );

      firestoreUnsub = onSnapshot(
        q,
        (snapshot) => {
          if (!isSubscribed) return;

          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const data = change.doc.data() as RealtimeNotification;
              const notifId = data.id || change.doc.id;

              if (seenIds.has(notifId)) return;
              seenIds.add(notifId);

              // If targeted to a specific UID, check match
              if (data.recipientUid && recipientUid && data.recipientUid !== recipientUid) {
                return;
              }

              const isLivePush = (data.createdAtMillis || Date.now()) > subscriptionStartTime - 3000;
              if (isLivePush) {
                playNotificationChime(data.type === 'offer' ? 'offer' : 'notification');
              }

              onNotificationReceived({ ...data, id: notifId }, isLivePush);
            }
          });
        },
        (error) => {
          console.info('[RealtimeNotifications] Firestore snapshot notice (falling back to syncBridge):', error.message);
          if (firestoreUnsub) {
            firestoreUnsub();
          }
        }
      );
    } catch (err: unknown) {
      console.info('[RealtimeNotifications] Firestore subscription init notice:', errorMessage(err));
    }
  }

  // 2. Listen to local syncBridge events (for cross-tab or offline environments)
  const handleStorageOrCustomSync = (event: Event) => {
    if (!isSubscribed) return;
    const detail = (event as CustomEvent<unknown>).detail;

    // Dedicated payload event from publishRealtimeNotification (same-tab fast-path)
    if (event.type === 'skillsetu:notification') {
      if (isRealtimeNotification(detail) && detail.target === targetSector) {
        const notif = detail;
        if (!seenIds.has(notif.id)) {
          seenIds.add(notif.id);
          playNotificationChime(notif.type === 'offer' ? 'offer' : 'notification');
          onNotificationReceived(notif, true);
        }
      }
      return;
    }

    // Legacy syncBridge envelope event (cross-tab localStorage fallback)
    if (event.type === 'skillsetu:sync') {
      const envelope = detail && typeof detail === 'object'
        ? detail as { domain?: unknown; payload?: unknown }
        : null;
      if (envelope?.domain === 'notifications' && isRealtimeNotification(envelope.payload)) {
        const notif = envelope.payload;
        if (notif.target === targetSector) {
          if (!seenIds.has(notif.id)) {
            seenIds.add(notif.id);
            playNotificationChime(notif.type === 'offer' ? 'offer' : 'notification');
            onNotificationReceived(notif, true);
          }
        }
      }
    }
  };

  if (isBrowser()) {
    window.addEventListener('skillsetu:notification', handleStorageOrCustomSync);
    window.addEventListener('skillsetu:sync', handleStorageOrCustomSync);
  }

  // Return unsubscription cleanup
  return () => {
    isSubscribed = false;
    if (firestoreUnsub) {
      firestoreUnsub();
    }
    if (isBrowser()) {
      window.removeEventListener('skillsetu:notification', handleStorageOrCustomSync);
      window.removeEventListener('skillsetu:sync', handleStorageOrCustomSync);
    }
  };
}
