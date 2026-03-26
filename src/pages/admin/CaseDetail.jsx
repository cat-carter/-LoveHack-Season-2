import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import StatusBadge from "../../components/StatusBadge";

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
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-slate-700">{value || <span className="text-slate-300 italic">Not provided</span>}</p>
    </div>
  );
}

export default function CaseDetail() {
  const { id } = useParams();
  const { cases, updateCase, reviewers } = useApp();
  const c = cases.find((x) => x.id === id);
  const [reviewerVal, setReviewerVal] = useState("");
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewSaved, setReviewSaved] = useState(false);

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
  }

  function handleMarkReviewed() {
    updateCase(c.id, { reviewStatus: "Reviewed" }, "Status updated to Reviewed");
  }

  function handleCloseCase() {
    updateCase(c.id, { caseStatus: "Closed" }, "Case closed");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <Link to="/admin/cases" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-3 transition-colors">← All Cases</Link>
            <h1 className="text-2xl font-semibold text-slate-800">{c.id}</h1>
            <p className="text-sm text-slate-500 mt-1">Submitted by {c.submittedBy} · {submittedAt}</p>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={c.caseStatus} />
            <StatusBadge status={c.reviewStatus} />
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
              <p className="text-xs text-slate-400 mb-1">{label}</p>
              <StatusBadge status={status} />
            </div>
          ))}
        </div>

        {/* Incident Report */}
        <Section title="Incident Report">
          <div className="grid grid-cols-2 gap-x-8">
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

        {/* OSHA 301 – auto-populated */}
        <Section title="OSHA 301 — Individual Case Record (Auto-populated)">
          <div className="bg-teal-50 border border-teal-100 rounded-lg px-4 py-2 mb-4 text-xs text-teal-700">
            Fields auto-populated from incident report submission.
          </div>
          <div className="grid grid-cols-2 gap-x-8">
            <Field label="Case Number" value={c.id} />
            <Field label="Date of Injury" value={c.incidentDate} />
            <Field label="Time Employee Began Work" value={`${c.shift} shift`} />
            <Field label="Time of Event" value={c.incidentTime} />
            <Field label="Employee Full Name" value={c.employeeName} />
            <Field label="Date Hired" value="2022-06-15" />
            <Field label="Date of Birth" value="1985-04-22" />
            <Field label="Gender" value="Female" />
          </div>
          <Field label="What was the employee doing just before the incident?" value={c.injuryDescription} />
          <Field label="What happened?" value={c.injuryDescription} />
          <Field label="What was the injury or illness?" value={c.symptoms} />
          <Field label="What object or substance directly harmed the employee?" value="Patient body weight / transfer without lift equipment" />
          <Field label="Physician / Health Care Professional" value={c.medicalEvaluation ? "Dr. E. Nguyen — St. Mary's Occupational Health" : "Not applicable"} />
          <Field label="Was employee treated in an emergency room?" value={c.medicalEvaluation ? "No" : "N/A"} />
          <Field label="Was employee hospitalized overnight?" value="No" />
          <div className="grid grid-cols-2 gap-x-8 mt-2">
            <Field label="Completed by" value={c.submittedBy} />
            <Field label="Date Completed" value={c.incidentDate} />
          </div>
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
