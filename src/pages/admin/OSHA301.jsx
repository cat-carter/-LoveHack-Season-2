import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Printer, Sparkles, RefreshCw } from "lucide-react";

const NAVY = "#0f2d52";

function FormRow({ label, value, wide }) {
  return (
    <div className={`flex flex-col gap-0.5 ${wide ? "col-span-2" : ""}`}>
      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
      <div className="border-b border-slate-300 pb-1 min-h-[22px]">
        <span className="text-sm text-slate-800">{value || <span className="text-slate-300">—</span>}</span>
      </div>
    </div>
  );
}

function NarrativeField({ label, questionNum, value, onChange, aiDrafted }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-slate-700 mb-1">
        {questionNum}. {label}
        {aiDrafted && (
          <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-teal-600 bg-teal-50 border border-teal-200 rounded-full px-2 py-0.5 print:hidden">
            <Sparkles size={9} aria-hidden="true" /> AI drafted
          </span>
        )}
      </label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none print:border-slate-400 print:focus:ring-0"
        placeholder="Click 'Generate AI Drafts' to auto-fill, or type here…"
      />
    </div>
  );
}

export default function OSHA301() {
  const { id } = useParams();
  const { cases, updateCase } = useApp();
  const c = cases.find((x) => x.id === id);

  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [genError, setGenError] = useState(null);
  const [saved, setSaved] = useState(false);

  const [narratives, setNarratives] = useState(
    c?.osha301Narratives || { q1: "", q2: "", q3: "", q4: "" }
  );

  if (!c) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500">Case not found.</p>
          <Link to="/admin/cases" className="text-teal-600 text-sm mt-2 block hover:underline">← Back to cases</Link>
        </div>
      </div>
    );
  }

  function handleSave() {
    updateCase(id, { osha301Status: "Completed", osha301Narratives: narratives }, "OSHA 301 completed");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function generateNarratives() {
    setGenerating(true);
    setGenError(null);
    try {
      const res = await fetch("/api/osha-narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseData: c }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setNarratives({
        q1: data.q1 || "",
        q2: data.q2 || "",
        q3: data.q3 || "",
        q4: data.q4 || "",
      });
      setGenerated(true);
    } catch (err) {
      setGenError("Couldn't reach the AI server. Make sure the API server is running.");
      console.error(err);
    } finally {
      setGenerating(false);
    }
  }

  const submittedDate = new Date(c.submittedAt).toLocaleDateString();

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white">

      {/* Screen-only toolbar */}
      <div className="print:hidden bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link
            to={`/admin/cases/${c.id}`}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← {c.id}
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-semibold text-slate-700">OSHA Form 301</span>
        </div>
        <div className="flex items-center gap-3">
          {genError && (
            <p className="text-xs text-rose-500">{genError}</p>
          )}
          {!generated ? (
            <button
              onClick={generateNarratives}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {generating ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Claude is drafting…
                </>
              ) : (
                <><Sparkles size={14} aria-hidden="true" /> Generate AI Drafts</>
              )}
            </button>
          ) : (
            <button
              onClick={generateNarratives}
              disabled={generating}
              className="flex items-center gap-2 px-3 py-1.5 border border-teal-200 text-teal-700 text-xs font-medium rounded-lg hover:bg-teal-50 disabled:opacity-50 transition-colors"
            >
              {generating ? "Regenerating…" : <><RefreshCw size={11} aria-hidden="true" /> Regenerate</>}
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-900 transition-colors"
          >
            {saved ? "✓ Saved" : "Save & Complete"}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Printer size={14} aria-hidden="true" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Form body */}
      <div className="max-w-4xl mx-auto px-4 py-8 print:px-0 print:py-0 print:max-w-none">
        <div className="bg-white shadow-sm rounded-2xl print:shadow-none print:rounded-none overflow-hidden">

          {/* Official header — navy band */}
          <div className="px-8 pt-6 pb-5 print:px-6" style={{ background: "#0f2d52" }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold text-blue-200 uppercase tracking-widest mb-1.5">
                  U.S. Department of Labor · Occupational Safety and Health Administration
                </p>
                <h1 className="text-2xl font-black text-white leading-tight">Form 301</h1>
                <h2 className="text-sm font-semibold text-blue-100 mt-0.5">Injuries and Illnesses Incident Report</h2>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] text-blue-300">OMB No. 1218-0176</p>
                <p className="text-[10px] text-blue-300 mt-0.5">
                  Case No. <strong className="text-white">{c.id}</strong>
                </p>
                <p className="text-[10px] text-blue-300 mt-2 max-w-[180px] text-right leading-relaxed">
                  Information about the employee and the case must be kept confidential.
                </p>
              </div>
            </div>
          </div>
          {/* Statutory notice */}
          <div className="px-8 py-3 bg-slate-50 border-b-2 border-slate-800 print:px-6">
            <p className="text-[11px] text-slate-600 leading-relaxed">
              This Injury and Illness Incident Report is one of the first forms you must fill out when a recordable work-related injury or illness has occurred. Together with the Log of Work-Related Injuries and Illnesses and the accompanying Summary, these forms help the employer and OSHA develop a picture of the extent and character of work-related incidents at a specific establishment.
            </p>
          </div>

          <div className="px-8 py-6 print:px-6 space-y-8">

            {/* Part A — Employer Information */}
            <section>
              <h3 className="text-[11px] font-black uppercase tracking-widest text-white bg-slate-700 px-3 py-1.5 rounded mb-4 print:bg-slate-800">
                Part A — Information about the Employer
              </h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <FormRow label="1. Establishment name" value="Sunrise Nursing & Rehabilitation" wide />
                <FormRow label="2. Street address" value="400 Wellness Blvd" />
                <FormRow label="3. City, State, ZIP" value="Springfield, IL 62701" />
                <FormRow label="4. Industry description" value="Skilled Nursing Care Facility" />
                <FormRow label="5. Standard Industrial Classification (SIC)" value="8051" />
                <FormRow label="6. NAICS Code" value="623110" />
              </div>
            </section>

            {/* Part B — Employee Information */}
            <section>
              <h3 className="text-[11px] font-black uppercase tracking-widest text-white bg-slate-700 px-3 py-1.5 rounded mb-4 print:bg-slate-800">
                Part B — Information about the Employee
              </h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <FormRow label="7. Full name" value={c.employeeName} wide />
                <FormRow label="8. Street address" value={c.employeeAddress || "142 Maple Street"} />
                <FormRow label="9. City, State, ZIP" value={c.employeeCityStateZip || "Springfield, IL 62701"} />
                <FormRow label="10. Date of birth" value={c.dateOfBirth || "1985-04-22"} />
                <FormRow label="11. Date hired" value={c.dateHired || "2022-06-15"} />
                <FormRow label="12. Sex" value={c.gender || "Female"} />
              </div>
            </section>

            {/* Part C — Health Care Professional */}
            <section>
              <h3 className="text-[11px] font-black uppercase tracking-widest text-white bg-slate-700 px-3 py-1.5 rounded mb-4 print:bg-slate-800">
                Part C — Information about the Physician or Other Health Care Professional
              </h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <FormRow label="13. Name of physician or other HCP" value={c.medicalEvaluation ? "Dr. E. Nguyen" : "N/A — No medical evaluation"} wide />
                <FormRow label="14. If treatment was given away from the worksite, where was it?" value={c.medicalEvaluation ? "St. Mary's Occupational Health, 100 Hospital Dr, Springfield, IL" : "N/A"} wide />
                <FormRow label="15. Was employee treated in an emergency room?" value={c.medicalEvaluation ? "No" : "N/A"} />
                <FormRow label="16. Was employee hospitalized overnight as an in-patient?" value="No" />
              </div>
            </section>

            {/* Part D — Case Description */}
            <section>
              <div className="flex items-center justify-between mb-4 gap-3">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-white bg-slate-700 px-3 py-1.5 rounded print:bg-slate-800">
                  Part D — Information about the Case
                </h3>
                {!generated && (
                  <button
                    onClick={generateNarratives}
                    disabled={generating}
                    className="print:hidden flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-800 disabled:opacity-50 transition-colors"
                  >
                    {generating ? "Generating…" : <><Sparkles size={12} aria-hidden="true" /> AI draft these fields</>}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                <FormRow label="17. Date of injury or illness" value={c.incidentDate} />
                <FormRow label="18. Time employee began work" value={`${c.shift} shift`} />
                <FormRow label="19. Time of event (AM/PM)" value={c.incidentTime} />
                <FormRow label="20. If the employee died, when did death occur?" value="N/A" />
              </div>

              <NarrativeField
                questionNum="21"
                label="What was the employee doing just before the incident occurred? Describe the activity, as well as the tools, equipment, or material the employee was using."
                value={narratives.q1}
                onChange={(v) => setNarratives((p) => ({ ...p, q1: v }))}
                aiDrafted={generated && narratives.q1}
              />
              <NarrativeField
                questionNum="22"
                label="What happened? Tell us how the injury occurred."
                value={narratives.q2}
                onChange={(v) => setNarratives((p) => ({ ...p, q2: v }))}
                aiDrafted={generated && narratives.q2}
              />
              <NarrativeField
                questionNum="23"
                label="What was the injury or illness? Tell us the part of the body that was affected and how it was affected."
                value={narratives.q3}
                onChange={(v) => setNarratives((p) => ({ ...p, q3: v }))}
                aiDrafted={generated && narratives.q3}
              />
              <NarrativeField
                questionNum="24"
                label="What object or substance directly harmed the employee? (e.g., concrete floor, chlorine, radial arm saw)"
                value={narratives.q4}
                onChange={(v) => setNarratives((p) => ({ ...p, q4: v }))}
                aiDrafted={generated && narratives.q4}
              />
            </section>

            {/* Part E — Signatures */}
            <section>
              <h3 className="text-[11px] font-black uppercase tracking-widest text-white bg-slate-700 px-3 py-1.5 rounded mb-4 print:bg-slate-800">
                Part E — Completed by
              </h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <FormRow label="25. Name of person completing this form" value={c.submittedBy} />
                <FormRow label="26. Title" value="Administrator" />
                <FormRow label="27. Phone number" value="217-555-0192" />
                <FormRow label="28. Date completed" value={submittedDate} />
              </div>
            </section>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 leading-relaxed print:mt-8">
              <p>
                <strong>Voluntary Protection Program Participation Notice.</strong> Voluntary Protection Program (VPP) participant sites may submit any OSHA Form 300 data for posting purposes only — not for any compliance or penalty action. This form is not a citation and has no standing in adjudicatory proceedings.
              </p>
              <p className="mt-1">
                Public reporting burden for this collection of information is estimated to average 14 minutes per response. You are not required to respond to the collection of information unless it displays a currently valid OMB control number. OSHA Form 301 (Rev. 01/2004).
              </p>
              <p className="mt-2 font-medium text-slate-500">
                Generated by IncidentIQ · {new Date().toLocaleDateString()} · Sunrise Nursing & Rehabilitation
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          textarea { border: 1px solid #94a3b8 !important; background: white !important; }
        }
      `}</style>
    </div>
  );
}
