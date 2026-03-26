import { useParams, useSearchParams, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import StatusBadge from "../../components/StatusBadge";

export default function CaseView() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const justSubmitted = searchParams.get("submitted") === "true";
  const { cases } = useApp();
  const c = cases.find((x) => x.id === id);

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

        {/* Confirmation banner */}
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

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <Link to="/portal" className="text-xs text-slate-400 hover:text-teal-600 mb-2 block">← My Reports</Link>
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

        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs text-blue-700">
            Your report is being reviewed. You will be notified if additional information is needed. Contact your administrator with any questions.
          </p>
        </div>
      </div>
    </div>
  );
}
