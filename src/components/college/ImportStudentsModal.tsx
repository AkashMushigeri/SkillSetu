'use client';

/**
 * Bulk student import — deliberately not wired to anything.
 *
 * What this component used to do, and why it is now inert:
 *
 *   - `handleFileSelect` recorded `e.target.files[0].name` and never read the
 *     file. Nothing was uploaded, parsed, or validated.
 *   - The "Import Preview" panel was a hardcoded "248 students / 120 CSE /
 *     64 AIML / 40 ECE / 24 EEE" block, shown for any file at all.
 *   - `handleConfirmImport` waited 600ms and then called `importStudents(248)`,
 *     which incremented `profile.totalStudents` in memory and reported
 *     "profiles & skill scores updated" without writing a single row.
 *
 * It could not simply be pointed at an API. A student in this architecture is a
 * `users` row with a real `firebase_uid`, and that UID is what the auth
 * middleware maps every request through. Creating student rows from a CSV would
 * manufacture accounts with no Firebase identity, which would then fail
 * `requireAuth` with `registration_required` — a roster of people who cannot
 * sign in.
 *
 * Making this real means picking a model, which is a product decision rather
 * than a migration one:
 *
 *   1. Invite/claim — the college uploads USNs, invited students claim their
 *      record on first sign-in, and `users.college_id` is set at that point.
 *   2. Roster-only CSV — academic records (USN, department, year, CGPA) are
 *      imported into a pending roster keyed by email, then matched to a signed-in
 *      student. This needs a table for unmatched rows.
 *   3. Direct creation — needs a provisioning flow that is explicitly not
 *      allowed under the current architecture.
 *
 * Until one of those is chosen, the button explains that instead of pretending.
 * The `recommendInternship` action in the same portal did get a real
 * implementation, because it needed no new model: it writes `notifications` rows
 * against students who already exist.
 */

import React from 'react';
import { FileSpreadsheet, X, Info } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportStudentsModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Bulk Student Import</h2>
              <p className="text-xs text-slate-500">Not available until a student claim flow exists.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-2 text-xs text-slate-700">
              <p className="font-bold text-slate-900">This import was previously a no-op.</p>
              <p>
                It accepted a file without reading it, previewed a hardcoded set of 248 student records for
                any file, and reported that profiles and skill scores had been updated while writing nothing.
                That has been removed rather than left in place.
              </p>
              <p>
                A real import cannot be built on the current model: every account needs a genuine Firebase
                identity, so a CSV cannot create students who are able to sign in. The portal roster now
                lists students who have signed up and affiliated with this college.
              </p>
              <p className="text-slate-600">
                The likely path forward is an invite or claim flow, where uploaded records are matched to a
                signed-in student rather than created for them.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
