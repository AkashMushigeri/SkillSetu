'use client';

/**
 * Admin review queue for industry/college role requests.
 *
 * The backend contract (`backend/src/routes/roleRequests.ts`):
 *  - `GET  /api/role-requests`          admin-only, oldest first
 *  - `POST /api/role-requests/:id/approve` transactional: role change +
 *    organization link + decision commit together
 *  - `POST /api/role-requests/:id/reject`  transactional; a not-yet-active
 *    applicant falls back to a working student account
 *
 * Access is decided by the PostgreSQL role from `/api/auth/me`. Anyone
 * else gets an explicit denial card rather than a redirect, so a
 * curious student cannot bounce through the onboarding guard.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  roleRequests,
  type RoleRequest,
} from '@/lib/domainApi';
import { ApiError } from '@/lib/apiClient';
import {
  AlertCircle,
  Building2,
  Check,
  Loader2,
  RefreshCw,
  School,
  ShieldCheck,
  X,
} from 'lucide-react';

type QueueStatus = RoleRequest['status'];

const STATUS_TABS: Array<{ value: QueueStatus; label: string }> = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const SNAPSHOT_LABELS: Record<string, string> = {
  name: 'Name',
  code: 'Code',
  website: 'Website',
  city: 'City',
  state: 'State',
  industry: 'Industry',
  about: 'About',
  logoUrl: 'Logo',
};

function formatDate(value: string | null | undefined) {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

export default function AdminRoleRequestsPage() {
  const { loading, identity } = useAuth();
  const [status, setStatus] = useState<QueueStatus>('pending');
  const [requests, setRequests] = useState<RoleRequest[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setError(null);
    // DEBUG: trace every queue fetch — visible in browser devtools console.
    console.log('[role-requests] load → GET /api/role-requests', { status });
    try {
      const res = await roleRequests.list(status);
      // DEBUG: confirm what the backend actually returned (empty array vs error).
      console.log('[role-requests] load ← 200 OK', {
        status,
        count: res.requests?.length ?? 0,
        requests: res.requests,
      });
      setRequests(res.requests);
    } catch (err) {
      // DEBUG: full error shape — status/code/requestId distinguish
      // 401 (token), 403 (role not admin) and 5xx (backend) failures.
      if (err instanceof ApiError) {
        console.error('[role-requests] load ← ApiError', {
          status,
          httpStatus: err.status,
          code: err.code,
          message: err.message,
          requestId: err.requestId,
        });
      } else {
        console.error('[role-requests] load ← unexpected error', { status, err });
      }
      setRequests([]);
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not load role requests. Check your connection and try again.'
      );
    }
  }, [status]);

  useEffect(() => {
    // DEBUG: why the queue did or did not load for this session.
    console.log('[role-requests] identity check', {
      role: identity?.role,
      userId: identity?.userId,
      email: identity?.email,
      status: identity?.status,
    });
    if (identity?.role === 'admin') {
      void load();
    } else {
      console.warn('[role-requests] fetch skipped: identity.role is not admin');
    }
  }, [identity?.role, load]);

  const act = async (
    req: RoleRequest,
    fn: (id: string, opts: { decisionNote?: string }) => Promise<unknown>,
    verb: string
  ) => {
    setActingId(req.id);
    setError(null);
    // DEBUG: trace the approve/reject call and its outcome.
    console.log(`[role-requests] ${verb} → POST /api/role-requests/${req.id}/${verb.toLowerCase()}`, {
      requestId: req.id,
      note: notes[req.id]?.trim() || undefined,
    });
    try {
      const note = notes[req.id]?.trim();
      const result = await fn(req.id, { ...(note ? { decisionNote: note } : {}) });
      console.log(`[role-requests] ${verb} ← success`, { requestId: req.id, result });
      setRequests((prev) =>
        prev ? prev.filter((r) => r.id !== req.id) : prev
      );
      setNotes((prev) => {
        const next = { ...prev };
        delete next[req.id];
        return next;
      });
    } catch (err) {
      if (err instanceof ApiError) {
        console.error(`[role-requests] ${verb} ← ApiError`, {
          requestId: req.id,
          httpStatus: err.status,
          code: err.code,
          message: err.message,
        });
      } else {
        console.error(`[role-requests] ${verb} ← unexpected error`, {
          requestId: req.id,
          err,
        });
      }
      setError(
        err instanceof ApiError
          ? err.message
          : `${verb} failed. Check your connection and try again.`
      );
    } finally {
      setActingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EFF6FA] via-[#E4EFF7] to-[#D9EAF5] dark:from-[#0b131e] dark:via-[#0f172a] dark:to-[#08131d] flex flex-col items-center justify-center text-slate-900 dark:text-white p-4">
        <Loader2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-spin mb-4" />
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
          Loading role requests...
        </p>
      </div>
    );
  }

  if (identity?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EFF6FA] via-[#E4EFF7] to-[#D9EAF5] dark:from-[#0b131e] dark:via-[#0f172a] dark:to-[#08131d] flex flex-col items-center justify-center text-slate-900 dark:text-white p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-8 text-center shadow-xl">
          <ShieldCheck className="w-10 h-10 text-slate-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Admin access required</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Role requests are reviewed by SkillSetu administrators. Your
            account does not have that permission.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFF6FA] via-[#E4EFF7] to-[#D9EAF5] dark:from-[#0b131e] dark:via-[#0f172a] dark:to-[#08131d] text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:px-10 lg:py-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-slate-200/80 dark:border-slate-800/80 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Role Requests
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Review industry and college access requests. Approval links the
              organization and activates the requested role in one transaction.
            </p>
          </div>
          <button
            onClick={() => void load()}
            type="button"
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-xs transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </header>

        <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 mb-6 shadow-xs">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatus(tab.value)}
              type="button"
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                status === tab.value
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-2.5 rounded-2xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-800 dark:text-red-300"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {requests === null ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 animate-spin mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Loading {status} requests...
            </p>
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 p-12 text-center">
            <Check className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
            <p className="font-semibold">No {status} role requests</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {status === 'pending'
                ? 'New industry and college requests will appear here.'
                : `Decided requests will appear here once ${status}.`}
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {requests.map((req) => {
              const RoleIcon =
                req.requestedRole === 'industry' ? Building2 : School;
              const isPending = req.status === 'pending';
              return (
                <li
                  key={req.id}
                  className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/95 p-6 shadow-xl shadow-blue-950/5 dark:shadow-black/40"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-teal to-brand-emerald flex items-center justify-center shadow-md shadow-brand-teal/20 shrink-0">
                        <RoleIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {String(req.organizationSnapshot?.name ?? 'Unnamed organization')}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {req.applicant.email || 'No email on file'} · requested{' '}
                          <span className="font-semibold">{req.requestedRole}</span>{' '}
                          access · {formatDate(req.createdAt)}
                        </div>
                      </div>
                    </div>
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-[11px] font-semibold">
                        Pending review
                      </span>
                    )}
                  </div>

                  <dl className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                    {Object.entries(req.organizationSnapshot || {})
                      .filter(([, value]) => value !== null && value !== undefined && value !== '')
                      .map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <dt className="text-slate-400 dark:text-slate-500 shrink-0">
                            {SNAPSHOT_LABELS[key] || key}:
                          </dt>
                          <dd className="text-slate-700 dark:text-slate-300 break-words">
                            {String(value)}
                          </dd>
                        </div>
                      ))}
                  </dl>

                  {req.reason && (
                    <blockquote className="mt-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
                      {req.reason}
                    </blockquote>
                  )}

                  {!isPending && (
                    <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                      {req.status === 'approved'
                        ? `Approved ${formatDate(req.reviewedAt)}`
                        : `Rejected ${formatDate(req.reviewedAt)}`}
                      {req.decisionNote ? ` — ${req.decisionNote}` : ''}
                    </div>
                  )}

                  {isPending && (
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                        Decision note (optional, shown to the applicant)
                      </label>
                      <input
                        type="text"
                        value={notes[req.id] || ''}
                        onChange={(e) =>
                          setNotes((prev) => ({ ...prev, [req.id]: e.target.value }))
                        }
                        maxLength={2000}
                        placeholder="Why was this approved or rejected?"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 mb-3"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => void act(req, roleRequests.approve, 'Approval')}
                          disabled={actingId !== null}
                          type="button"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-sm transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => void act(req, roleRequests.reject, 'Rejection')}
                          disabled={actingId !== null}
                          type="button"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-red-700 dark:text-red-300 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                        {actingId === req.id && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 ml-1">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Processing...
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
