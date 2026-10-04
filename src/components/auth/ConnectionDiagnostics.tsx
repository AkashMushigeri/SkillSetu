'use client';

/**
 * Connection diagnostics for the Neon + Render path.
 *
 * Signup registration is deliberately best-effort, so a broken backend produces
 * no visible symptom: the account is created and nothing is written. This panel
 * makes that failure legible by probing the backend from the browser, and it also
 * reports CORS specifically, since a blocked origin returns 403 before any real
 * work happens and is otherwise indistinguishable from a network error.
 *
 * It probes two independent things:
 *   1. Render   - the HTTP service itself (GET /health)
 *   2. Neon     - the database, which can only be reached through Render
 */

import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { backendBaseUrl } from '@/lib/backendApi';

type ProbeState = 'pending' | 'ok' | 'error';

interface ProbeResult {
  state: ProbeState;
  label: string;
  detail: string;
}

interface HealthPayload {
  status?: string;
  database?: string;
  firebase?: string;
  uptimeSeconds?: number;
}

/** Render's free tier sleeps, so a cold start can take 30-60s. */
const PROBE_TIMEOUT_MS = 20_000;

function classifyNetworkError(e: unknown): string {
  if (e instanceof Error) {
    if (e.name === 'AbortError') return `timed out after ${PROBE_TIMEOUT_MS / 1000}s`;
    return e.message;
  }
  return 'unknown network error';
}

async function probeRender(base: string): Promise<ProbeResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  try {
    const res = await fetch(`${base}/health`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    const text = await res.text();
    let body: HealthPayload = {};
    try {
      body = text ? (JSON.parse(text) as HealthPayload) : {};
    } catch {
      // Non-JSON body (gateway page); the status check below still applies.
    }

    if (res.status === 403) {
      return {
        state: 'error',
        label: 'CORS blocked',
        detail:
          "Render rejected this origin. Add this site's domain to the ALLOWED_ORIGINS secret on Render, then restart the service.",
      };
    }

    if (!res.ok) {
      return {
        state: 'error',
        label: `HTTP ${res.status}`,
        detail: String(body.status ?? text ?? res.statusText).slice(0, 200),
      };
    }

    return {
      state: 'ok',
      label: 'Connected',
      detail: `status=${body.status ?? 'unknown'} · firebase=${body.firebase ?? 'unknown'} · up ${body.uptimeSeconds ?? 0}s`,
    };
  } catch (e) {
    // A cross-origin fetch rejected by CORS surfaces as an opaque TypeError, so
    // the message alone cannot tell CORS apart from a genuine outage.
    const detail = classifyNetworkError(e);
    const looksLikeCors =
      e instanceof TypeError && /failed to fetch|networkerror|load failed/i.test(detail);
    return {
      state: 'error',
      label: looksLikeCors ? 'Unreachable or CORS blocked' : 'Unreachable',
      detail: looksLikeCors
        ? `${detail} — the service is unreachable, OR this origin is not in Render's ALLOWED_ORIGINS.`
        : detail,
    };
  } finally {
    clearTimeout(timer);
  }
}

/** Neon has no browser-reachable endpoint, so it is judged via Render's own DB ping. */
function probeNeonFromHealth(health: HealthPayload | null): ProbeResult {
  if (!health) {
    return {
      state: 'error',
      label: 'Unknown',
      detail: 'Unreachable via Render, so the database state cannot be read.',
    };
  }
  if (health.database === 'up') {
    return {
      state: 'ok',
      label: 'Connected',
      detail: 'Render reports database=up (SELECT 1 succeeded against Neon).',
    };
  }
  return {
    state: 'error',
    label: health.database ? `database=${health.database}` : 'Unreported',
    detail:
      'Render could not reach Neon. Check the DATABASE_URL secret on Render and that the Neon branch is awake.',
  };
}

function Row({ result }: { result: ProbeResult }) {
  return (
    <div className="flex items-start gap-2 py-1">
      {result.state === 'pending' ? (
        <Loader2 className="w-4 h-4 mt-0.5 shrink-0 animate-spin text-slate-400" />
      ) : result.state === 'ok' ? (
        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
      ) : (
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
      )}
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-800">
          {result.label}
          <span className="sr-only">: </span>
        </p>
        <p className="text-[11px] text-slate-500 break-words">{result.detail}</p>
      </div>
    </div>
  );
}

export default function ConnectionDiagnostics() {
  const base = backendBaseUrl();
  const [health, setHealth] = useState<HealthPayload | null>(null);
  const [render, setRender] = useState<ProbeResult>({
    state: 'pending',
    label: 'Checking...',
    detail: 'Waiting for the first probe.',
  });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!base) {
      setHealth(null);
      setRender({
        state: 'error',
        label: 'Not configured',
        detail:
          'NEXT_PUBLIC_API_URL is not set, so signup skips the Neon write entirely. Set it on this Vercel project and redeploy.',
      });
      return;
    }

    let cancelled = false;
    setRender({ state: 'pending', label: 'Checking...', detail: `Probing ${base}/health` });

    void (async () => {
      const result = await probeRender(base);
      let payload: HealthPayload | null = null;
      if (result.state === 'ok') {
        try {
          const res = await fetch(`${base}/health`, { headers: { Accept: 'application/json' } });
          payload = (await res.json()) as HealthPayload;
        } catch {
          payload = null;
        }
      }
      if (cancelled) return;
      setHealth(payload);
      setRender(result);
    })();

    return () => {
      cancelled = true;
    };
  }, [base, nonce]);

  const neon = probeNeonFromHealth(health);

  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Backend diagnostics
        </p>
        <button
          type="button"
          onClick={() => setNonce((n) => n + 1)}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Re-check</span>
        </button>
      </div>

      <p className="text-[11px] text-slate-500 mb-1.5 break-all">
        {base ? `Target: ${base}` : 'Target: not set (NEXT_PUBLIC_API_URL missing)'}
      </p>

      <div className="border-t border-slate-200 pt-1.5">
        <p className="text-[11px] font-bold text-slate-700">Render API</p>
        <Row result={render} />
      </div>

      <div className="border-t border-slate-200 pt-1.5 mt-1">
        <p className="text-[11px] font-bold text-slate-700">Neon database</p>
        <Row result={neon} />
      </div>

      <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
        Signup writes to Neon through the Render API. If either row is red, new accounts
        are still created in Firebase but no row is written to PostgreSQL.
      </p>
    </div>
  );
}