import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import StatusBadge from "../../components/StatusBadge";
import { Printer, Bot, Sparkles, AlertTriangle } from "lucide-react";

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
      <h2 className="text-sm font-semibold text-slate-700 mb-4 pb-3 border-b border-slate-100">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="mb-3">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-slate-700">{value || <span className="text-slate-400 italic">Not provided</span>}</p>
    </div>
  );
}

export default function CaseDetail() {
  const { id } = useParams();
  const { cases, updateCase, addNote, reviewers } = useApp();
  const c = cases.find((x) => x.id === id);
  const [reviewerVal, setReviewerVal] = useState("");
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewSaved, setReviewSaved] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteRequiresAction, setNoteRequiresAction] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  if (!c) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-500">Case not found.</p>
        <Link to="/admin/cases" className="text-teal-600 text-sm mt-2 block hover:underline">← Back to cases</Link>
      </div>
    </div>
  );

  const submittedAt = new Date(c.submittedAt).toLocaleString();

  function handleAssignReviewer() {
    if (!reviewerVal) return;
    setReviewSaving(true);
    updateCase(c.id, { reviewer: reviewerVal, reviewStatus: "In Review" }, `Reviewer assigned: ${reviewerVal}`);
    setReviewSaving(false);
    setReviewSaved(true);
    setTimeout(() => setReviewSaved(false), 3000);
    // Email notification to employee
    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "reviewer_assigned", caseData: { ...c, reviewer: reviewerVal } }),
    }).catch(() => {});
  }

  function handleMarkReviewed() {
    updateCase(c.id, { reviewStatus: "Reviewed" }, "Status updated to Reviewed");
    // Email notification to employee
    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "case_reviewed", caseData: c }),
    }).catch(() => {});
  }

  function handleCloseCase() {
    updateCase(c.id, { caseStatus: "Closed" }, "Case closed");
  }

  function handleAddNote() {
    if (!noteText.trim()) return;
    addNote(c.id, noteText.trim(), noteRequiresAction);
    setNoteText("");
    setNoteRequiresAction(false);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <Link to="/admin/cases" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-3 transition-colors print:hidden">← All Cases</Link>
            <h1 className="text-2xl font-semibold text-slate-800">{c.id}</h1>
            <p className="text-sm text-slate-500 mt-1">Submitted by {c.submittedBy} · {submittedAt}</p>
          </div>
          <div className="flex items-start gap-3">
            <button
              onClick={() => window.print()}
              className="print:hidden flex items-center gap-1.5 text-sm font-medium text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
            >
              <Printer size={14} aria-hidden="true" /> Print / PDF
            </button>
            <div className="flex gap-2">
              <StatusBadge status={c.caseStatus} />
              <StatusBadge status={c.reviewStatus} />
            </div>
          </div>
        </div>

        {/* Status row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Workers Comp", status: c.workersCompStatus },
            { label: "OSHA 300", status: c.osha300Status },
            { label: "OSHA 301", status: c.osha301Status },
            { label: "Employee Status", status: c.employeeStatus },
          ].map(({ label, status }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 p-3 text-center">
              <p className="text-xs text-slate-500 mb-1">{label}</p>
              <StatusBadge status={status} />
            </div>
          ))}
        </div>

        {/* AI Triage */}
        {c.triage && (
          <div
            aria-live="polite"
            className={`rounded-2xl border p-5 mb-6 ${
              c.triage.severity === "high"
                ? "bg-red-50 border-red-200"
                : c.triage.severity === "medium"
                ? "bg-amber-50 border-amber-200"
                : "bg-green-50 border-green-100"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Bot size={16} aria-hidden="true" className="text-slate-500 shrink-0" />
              <h2 className="text-sm font-semibold text-slate-800">AI Triage Analysis</h2>
              <span className="text-xs text-slate-500 ml-auto">Powered by n8n + Claude</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                c.triage.severity === "high"
                  ? "bg-red-100 text-red-700"
                  : c.triage.severity === "medium"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {c.triage.severity === "high" && <span aria-hidden="true">▲</span>}
                {c.triage.severity === "medium" && <span aria-hidden="true">◆</span>}
                {c.triage.severity === "low" && <span aria-hidden="true">●</span>}
                {c.triage.severity} severity
              </span>
              {c.triage.oshaRecordable && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-orange-100 text-orange-700">
                  OSHA Recordable
                </span>
              )}
            </div>
            <p className="text-sm text-slate-700 mb-3">{c.triage.summary}</p>
            {c.triage.actions?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Recommended Actions</p>
                <ul className="space-y-1.5">
                  {c.triage.actions.map((action, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-600">
                      <span className="text-slate-400 shrink-0 mt-0.5">→</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Incident Report */}
        <Section title="Incident Report">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <Field label="Employee Name" value={c.employeeName} />
            <Field label="Manager Name" value={c.managerName} />
            <Field label="Position" value={c.position} />
            <Field label="Shift" value={c.shift} />
            <Field label="Incident Date" value={c.incidentDate} />
            <Field label="Incident Time" value={c.incidentTime} />
            <Field label="Incident Location" value={c.incidentLocation} />
            <Field label="Injury Type" value={c.injuryType} />
          </div>
          <div className="mt-2">
            <Field label="Injury Description" value={c.injuryDescription} />
            <Field label="Medical Symptoms" value={c.symptoms} />
            <Field label="Medical Evaluation" value={c.medicalEvaluation ? "Yes" : "No"} />
            {c.medicalEvaluation && <Field label="Medical Diagnosis" value={c.medicalDiagnosis} />}
          </div>
        </Section>

        {/* OSHA 301 */}
        <Section title="OSHA 301 — Injury and Illness Incident Report">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="text-sm text-slate-600 mb-1">
                The full OSHA 301 form is pre-filled from this incident report. Use the AI draft feature to auto-complete the 4 required narrative sections, then print or save as PDF.
              </p>
              <p className="text-xs text-slate-400">
                Status: <span className={`font-semibold ${c.osha301Status === "Completed" ? "text-teal-600" : "text-amber-600"}`}>{c.osha301Status}</span>
                {c.osha301Status !== "Completed" && (
                  <span className="ml-2 text-slate-400">· Due within 7 days of incident</span>
                )}
              </p>
            </div>
            <Link
              to={`/admin/cases/${c.id}/osha-301`}
              className="shrink-0 inline-flex items-center gap-2 bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors shadow-sm print:hidden"
            >
              <Sparkles size={14} aria-hidden="true" /> Open OSHA 301 Form →
            </Link>
          </div>
          {c.osha301Status !== "Completed" && (
            <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 text-xs text-amber-800 flex gap-2 items-start">
              <AlertTriangle size={14} aria-hidden="true" className="shrink-0 mt-0.5" />
              <span>OSHA Form 301 must be completed within 7 calendar days of receiving notice that a recordable case occurred. Open the form to generate AI-drafted narrative fields and print/download for your records.</span>
            </div>
          )}
        </Section>

        {/* OSHA 300 link */}
        <Section title="OSHA 300 — Log of Work-Related Injuries">
          <p className="text-sm text-slate-500 mb-3">This case contributes to the facility OSHA 300 log. View the full log across all records.</p>
          <Link to="/admin/osha300" className="inline-block bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
            View OSHA 300 Log →
          </Link>
        </Section>

        {/* Workers Comp */}
        <Section title="Workers' Compensation Form">
          {c.workersCompStatus === "Completed" ? (
            <div className="flex items-center gap-2 text-sm text-teal-700">
              <span>✓</span><span>Workers' comp form submitted.</span>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-3">
                {c.workersCompStatus === "Pending"
                  ? "Workers' comp form is pending completion."
                  : "If medical attention was required, a workers' compensation form must be completed."}
              </p>
              <Link
                to={`/admin/workers-comp/${c.id}`}
                className="inline-block bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                {c.workersCompStatus === "Pending" ? "Complete Workers' Comp Form →" : "Start Workers' Comp Form →"}
              </Link>
            </>
          )}
        </Section>

        {/* Review & Assignment */}
        <Section title="Review & Assignment">
          <div className="mb-4">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Review Status</p>
            <div className="flex items-center gap-3">
              <StatusBadge status={c.reviewStatus} />
              {c.reviewStatus !== "Reviewed" && (
                <button
                  onClick={handleMarkReviewed}
                  className="text-xs text-teal-600 hover:text-teal-800 font-medium underline"
                >
                  Mark as Reviewed
                </button>
              )}
              {c.caseStatus !== "Closed" && (
                <button
                  onClick={handleCloseCase}
                  className="text-xs text-slate-400 hover:text-slate-700 font-medium underline"
                >
                  Close Case
                </button>
              )}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Assigned Reviewer</p>
            {c.reviewer ? (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-xs font-semibold text-teal-700">
                  {c.reviewer.split(" ").map((n) => n[0]).join("")}
                </div>
                <span className="text-sm text-slate-700 font-medium">{c.reviewer}</span>
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">Unassigned</p>
            )}
          </div>

          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-medium text-slate-500 mb-2">
              {c.reviewer ? "Reassign reviewer" : "Assign a reviewer"}
            </p>
            <div className="flex gap-2">
              <select
                value={reviewerVal}
                onChange={(e) => setReviewerVal(e.target.value)}
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
              >
                <option value="">Select reviewer…</option>
                {reviewers.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <button
                onClick={handleAssignReviewer}
                disabled={!reviewerVal || reviewSaving}
                className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 disabled:opacity-40 transition-colors"
              >
                {reviewSaved ? "✓ Assigned" : "Assign"}
              </button>
            </div>
          </div>

          {c.expectedReturn && <Field label="Expected Return Date" value={c.expectedReturn} />}
        </Section>

        {/* Admin Notes */}
        <Section title="Notes to Employee">
          {/* Existing notes */}
          {(c.notes || []).length > 0 && (
            <div className="space-y-2 mb-4">
              {[...c.notes].reverse().map((n) => (
                <div key={n.id} className={`rounded-xl p-3 text-sm border ${n.requiresAction && !n.dismissed ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-100"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-slate-700">{n.text}</p>
                    {n.requiresAction && !n.dismissed && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">Action requested</span>
                    )}
                    {n.dismissed && (
                      <span className="text-[10px] text-slate-400 shrink-0">Resolved</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{n.by} · {new Date(n.at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add new note */}
          <div className="space-y-2">
            <textarea
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Leave a note for the employee about this case…"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white resize-none"
            />
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={noteRequiresAction}
                  onChange={(e) => setNoteRequiresAction(e.target.checked)}
                  className="rounded"
                />
                Request action from employee
              </label>
              <button
                onClick={handleAddNote}
                disabled={!noteText.trim()}
                className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 disabled:opacity-40 transition-colors"
              >
                {noteSaved ? "✓ Sent" : "Send Note"}
              </button>
            </div>
          </div>
        </Section>

        {/* Audit Trail */}
        <Section title="Audit Trail">
          {(!c.auditTrail || c.auditTrail.length === 0) ? (
            <p className="text-sm text-slate-400 italic">No activity recorded.</p>
          ) : (
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
          )}
        </Section>
      </div>
    </div>
  );
}
