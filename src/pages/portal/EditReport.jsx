import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const STEPS = ["Incident Details", "Injury Information", "Medical Evaluation", "Review & Submit"];

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors
            ${i < current ? "bg-teal-600 text-white" : i === current ? "bg-teal-600 text-white ring-4 ring-teal-100" : "bg-slate-100 text-slate-400"}`}>
            {i < current ? "✓" : i + 1}
          </div>
          {i < total - 1 && <div className={`flex-1 h-0.5 w-8 ${i < current ? "bg-teal-600" : "bg-slate-200"}`} />}
        </div>
      ))}
      <span className="ml-2 text-xs text-slate-500 font-medium">{STEPS[current]}</span>
    </div>
  );
}

function FormField({ label, required, children, hint }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white";
const selectCls = inputCls;
const textareaCls = `${inputCls} resize-none`;

export default function EditReport() {
  const { id } = useParams();
  const { cases, updateCase } = useApp();
  const navigate = useNavigate();
  const c = cases.find((x) => x.id === id);
  const [step, setStep] = useState(0);

  const [form, setForm] = useState(c ? {
    employeeName: c.employeeName || "",
    managerName: c.managerName || "",
    shift: c.shift || "",
    position: c.position || "",
    incidentDate: c.incidentDate || "",
    incidentTime: c.incidentTime || "",
    incidentLocation: c.incidentLocation || "",
    injuryType: c.injuryType || "",
    injuryDescription: c.injuryDescription || "",
    symptoms: c.symptoms || "",
    medicalEvaluation: c.medicalEvaluation ? "yes" : "no",
    medicalDiagnosis: c.medicalDiagnosis || "",
  } : {});

  if (!c) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-500">Case not found.</p>
        <Link to="/portal" className="text-teal-600 text-sm mt-2 block hover:underline">← My Reports</Link>
      </div>
    </div>
  );

  // If already reviewed, editing is locked
  if (c.reviewStatus !== "Pending") {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-xl mx-auto px-4 py-8">
          <Link to={`/portal/cases/${id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-5 transition-colors">
            ← Back to {id}
          </Link>
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Report Locked</h2>
            <p className="text-sm text-slate-500">
              This report has been reviewed and can no longer be edited. Contact your administrator if changes are needed.
            </p>
            <Link
              to={`/portal/cases/${id}`}
              className="mt-6 inline-block bg-teal-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors"
            >
              View Report
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleNext() { setStep((s) => Math.min(s + 1, STEPS.length - 1)); }
  function handleBack() { setStep((s) => Math.max(s - 1, 0)); }

  function handleSave() {
    const updates = {
      ...form,
      medicalEvaluation: form.medicalEvaluation === "yes",
    };
    updateCase(id, updates, "Report edited by employee");
    navigate(`/portal/cases/${id}`);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-xl mx-auto px-4 py-8">
        <Link to={`/portal/cases/${id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-5 transition-colors">
          ← Back to {id}
        </Link>

        <div className="flex items-start gap-3 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">Edit Report</h1>
            <p className="text-sm text-slate-500 mt-0.5">{id} · Changes are logged. Editing locks once reviewed.</p>
          </div>
          <span className="ml-auto shrink-0 text-xs bg-amber-100 text-amber-700 font-semibold px-2.5 py-1 rounded-full">Pending Review</span>
        </div>

        <StepIndicator current={step} total={STEPS.length} />

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">

          {step === 0 && (
            <>
              <FormField label="Employee Name" required>
                <input className={inputCls} value={form.employeeName} onChange={(e) => update("employeeName", e.target.value)} />
              </FormField>
              <FormField label="Manager Name" required>
                <input className={inputCls} value={form.managerName} onChange={(e) => update("managerName", e.target.value)} />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Shift" required>
                  <select className={selectCls} value={form.shift} onChange={(e) => update("shift", e.target.value)}>
                    <option value="">Select shift</option>
                    <option>Day</option>
                    <option>Evening</option>
                    <option>Night</option>
                  </select>
                </FormField>
                <FormField label="Position" required>
                  <input className={inputCls} value={form.position} onChange={(e) => update("position", e.target.value)} />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Event Date" required>
                  <input type="date" className={inputCls} value={form.incidentDate} onChange={(e) => update("incidentDate", e.target.value)} />
                </FormField>
                <FormField label="Event Time" required>
                  <input type="time" className={inputCls} value={form.incidentTime} onChange={(e) => update("incidentTime", e.target.value)} />
                </FormField>
              </div>
              <FormField label="Incident Location" required>
                <input className={inputCls} value={form.incidentLocation} onChange={(e) => update("incidentLocation", e.target.value)} />
              </FormField>
            </>
          )}

          {step === 1 && (
            <>
              <FormField label="Incident / Injury Type" required>
                <select className={selectCls} value={form.injuryType} onChange={(e) => update("injuryType", e.target.value)}>
                  <option value="">Select type</option>
                  <optgroup label="Physical Injury">
                    <option>Musculoskeletal</option>
                    <option>Needlestick</option>
                    <option>Slip / Fall</option>
                    <option>Burn</option>
                    <option>Exposure</option>
                  </optgroup>
                  <optgroup label="Other Incident">
                    <option>Illness</option>
                    <option>Property Damage</option>
                    <option>Near Miss</option>
                    <option>Other</option>
                  </optgroup>
                </select>
              </FormField>
              <FormField
                label={form.injuryType === "Property Damage" ? "Damage Description" : "Incident Description"}
                required
                hint="Describe what happened and how it occurred."
              >
                <textarea rows={4} className={textareaCls} value={form.injuryDescription} onChange={(e) => update("injuryDescription", e.target.value)} />
              </FormField>
              <FormField label={form.injuryType === "Property Damage" ? "Items Involved / Estimated Value" : "Medical Symptoms"}>
                <textarea rows={3} className={textareaCls} value={form.symptoms} onChange={(e) => update("symptoms", e.target.value)} />
              </FormField>
            </>
          )}

          {step === 2 && (
            <>
              <FormField label="Did you receive a medical evaluation?" required>
                <div className="flex gap-3 mt-1">
                  {["yes", "no"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => update("medicalEvaluation", v)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors
                        ${form.medicalEvaluation === v ? "bg-teal-600 text-white border-teal-600" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                    >
                      {v === "yes" ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </FormField>
              {form.medicalEvaluation === "yes" && (
                <FormField label="Medical Diagnosis" hint="If provided by a physician or healthcare professional">
                  <textarea rows={3} className={textareaCls} value={form.medicalDiagnosis} onChange={(e) => update("medicalDiagnosis", e.target.value)} />
                </FormField>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Review your changes before saving</h3>
              <div className="space-y-3 text-sm">
                {[
                  ["Employee", form.employeeName],
                  ["Manager", form.managerName],
                  ["Shift", form.shift],
                  ["Position", form.position],
                  ["Date & Time", `${form.incidentDate} at ${form.incidentTime}`],
                  ["Location", form.incidentLocation],
                  ["Injury Type", form.injuryType],
                  ["Description", form.injuryDescription],
                  ["Symptoms", form.symptoms],
                  ["Medical Evaluation", form.medicalEvaluation === "yes" ? "Yes" : "No"],
                  ...(form.medicalEvaluation === "yes" ? [["Diagnosis", form.medicalDiagnosis]] : []),
                ].map(([label, val]) => (
                  <div key={label} className="flex gap-3 border-b border-slate-50 pb-2">
                    <span className="text-slate-400 w-32 shrink-0">{label}</span>
                    <span className="text-slate-700">{val || <span className="italic text-slate-300">Not provided</span>}</span>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mt-5">
                <p className="text-xs text-amber-800">
                  Saving will update your case record and log this edit in the case audit trail.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 font-medium transition-colors"
            >
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
