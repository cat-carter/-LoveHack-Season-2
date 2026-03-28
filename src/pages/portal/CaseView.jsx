import { useParams, useSearchParams, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import StatusBadge from "../../components/StatusBadge";
import { Printer, Pencil } from "lucide-react";

export default function CaseView() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const justSubmitted = searchParams.get("submitted") === "true";
  const { cases, dismissNote } = useApp();
  const c = cases.find((x) => x.id === id);
  const pendingNotes = (c?.notes || []).filter((n) => n.requiresAction && !n.dismissed);
  const allNotes = (c?.notes || []).filter((n) => !n.requiresAction);

  if (!c) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-500">Case not found.</p>
        <Link to="/portal" className="text-teal-600 text-sm mt-2 block hover:underline">← My Reports</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-xl mx-auto px-4 py-8">

        <Link to="/portal" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-5 transition-colors">
          ← My Reports
        </Link>

        {/* Action-required banner from admin */}
        {pendingNotes.map((n) => (
          <div key={n.id} className="bg-amber-50 border border-amber-300 rounded-2xl p-4 mb-4 flex items-start gap-3">
            <span className="text-amber-500 text-xl shrink-0">💬</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-800">Action requested by your administrator</p>
              <p className="text-sm text-amber-700 mt-1">{n.text}</p>
              <p className="text-xs text-amber-500 mt-1.5">{n.by} · {new Date(n.at).toLocaleString()}</p>
            </div>
            <button
              onClick={() => dismissNote(c.id, n.id)}
              className="text-xs font-semibold text-amber-600 hover:text-amber-800 border border-amber-300 rounded-lg px-3 py-1.5 shrink-0 transition-colors"
            >
              Mark resolved
            </button>
          </div>
        ))}

        {/* Submission confirmation banner */}
        {justSubmitted && (
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 mb-6 text-center">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-teal-600 text-xl">✓</span>
            </div>
            <h2 className="text-base font-semibold text-teal-800">Report Submitted</h2>
            <p className="text-sm text-teal-600 mt-1">Your case number is <strong>{c.id}</strong></p>
            <p className="text-xs text-teal-500 mt-1">Submitted {new Date(c.submittedAt).toLocaleString()}</p>
          </div>
        )}

        {/* Status notification banners */}
        {!justSubmitted && c.reviewer && c.reviewStatus !== "Reviewed" && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-blue-600 text-xs">👤</span>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Your report has been assigned</p>
              <p className="text-xs text-blue-600 mt-0.5"><strong>{c.reviewer}</strong> has been assigned to review your report.</p>
            </div>
          </div>
        )}
        {!justSubmitted && c.reviewStatus === "Reviewed" && (
          <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-teal-600 text-xs">✓</span>
            </div>
            <div>
              <p className="text-sm font-medium text-teal-800">Your report has been reviewed</p>
              <p className="text-xs text-teal-600 mt-0.5">
                {c.reviewer ? `Reviewed by ${c.reviewer}.` : "Your report has been reviewed."} No further action is needed from you at this time.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">{c.id}</h1>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <StatusBadge status={c.caseStatus} />
            <StatusBadge status={c.reviewStatus} />
          </div>
        </div>

        {/* Status cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white border border-slate-200 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-1">Workers Comp</p>
            <StatusBadge status={c.workersCompStatus} />
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-1">Employee Status</p>
            <StatusBadge status={c.employeeStatus} />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-sm">
          {[
            ["Injury Type", c.injuryType],
            ["Date & Time", `${c.incidentDate} at ${c.incidentTime}`],
            ["Location", c.incidentLocation],
            ["Shift", c.shift],
            ["Description", c.injuryDescription],
            ["Symptoms", c.symptoms],
            ["Medical Evaluation", c.medicalEvaluation ? "Yes" : "No"],
            ...(c.medicalEvaluation && c.medicalDiagnosis ? [["Diagnosis", c.medicalDiagnosis]] : []),
            ["Reviewed by", c.reviewer || "Pending assignment"],
          ].map(([label, val]) => (
            <div key={label} className="flex gap-3 border-b border-slate-50 pb-2 last:border-0">
              <span className="text-slate-400 w-36 shrink-0">{label}</span>
              <span className="text-slate-700">{val}</span>
            </div>
          ))}
        </div>

        {/* Activity / Audit Trail */}
        {c.auditTrail && c.auditTrail.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mt-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Activity</h2>
            <div className="space-y-0">
              {[...c.auditTrail].reverse().map((entry, i) => (
                <div key={i} className="flex gap-3 py-2.5 border-b border-slate-50 last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{entry.action}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {entry.by} · {new Date(entry.at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes from administrator */}
        {allNotes.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mt-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Notes from your administrator</h2>
            <div className="space-y-3">
              {[...allNotes].reverse().map((n) => (
                <div key={n.id} className="flex gap-3 py-2.5 border-b border-slate-50 last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{n.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{n.by} · {new Date(n.at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          {c.reviewStatus === "Pending" && (
            <Link
              to={`/portal/cases/${c.id}/edit`}
              className="flex items-center justify-center gap-2 w-full py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Pencil size={14} aria-hidden="true" /> Edit Report
            </Link>
          )}
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 w-full py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors print:hidden"
          >
            <Printer size={14} aria-hidden="true" /> Print / Save as PDF
          </button>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs text-blue-700">
              Your report is being reviewed. You will be notified if additional information is needed. Contact your administrator with any questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
