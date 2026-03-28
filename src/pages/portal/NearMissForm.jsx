import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { AlertTriangle } from "lucide-react";
import { StepIndicator, FormField, inputCls, selectCls, textareaCls } from "../../components/FormWizard";

const STEPS = ["Event Details", "Close Call Details", "Review & Submit"];

const NAVY = "#0f2d52";


export default function NearMissForm() {
  const { submitCase, saveDraft, user, drafts } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);

  const draftKey = searchParams.get("draft");
  const draftData = draftKey ? drafts.find((d) => d.draftId === draftKey) : null;

  const [form, setForm] = useState({
    employeeName: draftData?.employeeName ?? user?.name ?? "",
    managerName: draftData?.managerName ?? user?.manager ?? "",
    shift: draftData?.shift ?? "",
    position: draftData?.position ?? user?.position ?? "",
    incidentDate: draftData?.incidentDate ?? "",
    incidentTime: draftData?.incidentTime ?? "",
    incidentLocation: draftData?.incidentLocation ?? "",
    whatHappened: draftData?.whatHappened ?? "",
    potentialHarm: draftData?.potentialHarm ?? "",
    whatStopped: draftData?.whatStopped ?? "",
    witnessPresent: draftData?.witnessPresent ?? "",
    witnessName: draftData?.witnessName ?? "",
  });

  const [stepErrors, setStepErrors] = useState([]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validateStep(s) {
    if (s === 0) {
      const missing = [];
      if (!form.employeeName.trim()) missing.push("Employee Name");
      if (!form.managerName.trim()) missing.push("Manager Name");
      if (!form.shift) missing.push("Shift");
      if (!form.position.trim()) missing.push("Position");
      if (!form.incidentDate) missing.push("Date of Event");
      if (!form.incidentTime) missing.push("Time of Event");
      if (!form.incidentLocation.trim()) missing.push("Location");
      return missing;
    }
    if (s === 1) {
      const missing = [];
      if (!form.whatHappened.trim()) missing.push("What happened / What almost occurred?");
      if (!form.potentialHarm.trim()) missing.push("What was the potential harm?");
      if (!form.whatStopped.trim()) missing.push("What stopped the harm from occurring?");
      return missing;
    }
    return [];
  }

  function handleNext() {
    const missing = validateStep(step);
    if (missing.length > 0) { setStepErrors(missing); return; }
    setStepErrors([]);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function handleBack() { setStepErrors([]); setStep((s) => Math.max(s - 1, 0)); }

  function handleSaveDraft() {
    saveDraft({ ...form, injuryType: "Near Miss" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleSubmit() {
    for (let s = 0; s < STEPS.length - 1; s++) {
      const missing = validateStep(s);
      if (missing.length > 0) { setStepErrors(missing); setStep(s); return; }
    }
    const newCase = submitCase({
      employeeName: form.employeeName,
      managerName: form.managerName,
      shift: form.shift,
      position: form.position,
      incidentDate: form.incidentDate,
      incidentTime: form.incidentTime,
      incidentLocation: form.incidentLocation,
      injuryType: "Near Miss",
      injuryDescription: form.whatHappened,
      symptoms: form.potentialHarm,
      medicalEvaluation: false,
      medicalDiagnosis: "",
      nearMissDetails: {
        whatStopped: form.whatStopped,
        witnessPresent: form.witnessPresent,
        witnessName: form.witnessName,
      },
    });
    navigate(`/portal/cases/${newCase.id}?submitted=true`);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-xl mx-auto px-4 py-8">
        <Link to="/portal" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-5 transition-colors">
          ← My Reports
        </Link>

        {/* Header */}
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0"><AlertTriangle size={20} aria-hidden="true" className="text-amber-600" /></div>
          <div>
            <h1 className="text-xl font-semibold text-slate-800">Near Miss Report</h1>
            <p className="text-sm text-slate-500 mt-0.5">A "good catch" — no injury occurred, but something could have gone wrong.</p>
          </div>
        </div>

        {/* Good catch callout */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 flex gap-3 items-start">
          <span className="text-amber-500 shrink-0 mt-0.5">💡</span>
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Examples:</strong> Catching a wrong medication dosage before administration, identifying an incorrect patient armband, or stopping a wrong-site procedure just in time. Reporting these helps prevent future harm.
          </p>
        </div>

        <StepIndicator current={step} total={STEPS.length} steps={STEPS} />

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">

          {/* Step 1 — Event Details */}
          {step === 0 && (
            <>
              <FormField label="Employee Name" required>
                <input className={inputCls} value={form.employeeName} onChange={(e) => update("employeeName", e.target.value)} />
              </FormField>
              <FormField label="Manager Name" required>
                <input className={inputCls} value={form.managerName} onChange={(e) => update("managerName", e.target.value)} />
              </FormField>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Date of Event" required>
                  <input type="date" className={inputCls} value={form.incidentDate} onChange={(e) => update("incidentDate", e.target.value)} />
                </FormField>
                <FormField label="Time of Event" required>
                  <input type="time" className={inputCls} value={form.incidentTime} onChange={(e) => update("incidentTime", e.target.value)} />
                </FormField>
              </div>
              <FormField label="Location" required hint="e.g. Room 214, Medication Room, East Wing Corridor">
                <input className={inputCls} value={form.incidentLocation} onChange={(e) => update("incidentLocation", e.target.value)} placeholder="Where did this occur?" />
              </FormField>
            </>
          )}

          {/* Step 2 — Close Call Details */}
          {step === 1 && (
            <>
              <FormField label="What happened / What almost occurred?" required hint="Describe the close call in detail.">
                <textarea
                  rows={4}
                  className={textareaCls}
                  value={form.whatHappened}
                  onChange={(e) => update("whatHappened", e.target.value)}
                  placeholder="e.g. I noticed the medication label listed 500mg instead of 50mg before administering to the patient..."
                />
              </FormField>
              <FormField label="What was the potential harm if not caught?" required hint="Describe what could have happened to the patient or staff.">
                <textarea
                  rows={3}
                  className={textareaCls}
                  value={form.potentialHarm}
                  onChange={(e) => update("potentialHarm", e.target.value)}
                  placeholder="e.g. A 10x overdose could have caused serious cardiac complications..."
                />
              </FormField>
              <FormField label="What stopped the harm from occurring?" required hint="What action, process, or person caught this in time?">
                <textarea
                  rows={3}
                  className={textareaCls}
                  value={form.whatStopped}
                  onChange={(e) => update("whatStopped", e.target.value)}
                  placeholder="e.g. I cross-checked the physician's order against the eMAR before drawing up the medication..."
                />
              </FormField>
              <FormField label="Was a witness present?">
                <div className="flex gap-3 mt-1">
                  {["yes", "no"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => update("witnessPresent", v)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors
                        ${form.witnessPresent === v ? "bg-teal-600 text-white border-teal-600" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                    >
                      {v === "yes" ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </FormField>
              {form.witnessPresent === "yes" && (
                <FormField label="Witness name">
                  <input className={inputCls} value={form.witnessName} onChange={(e) => update("witnessName", e.target.value)} placeholder="Name of witness" />
                </FormField>
              )}
            </>
          )}

          {/* Step 3 — Review */}
          {step === 2 && (
            <>
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Review your report before submitting</h3>
              <div className="space-y-3 text-sm">
                {[
                  ["Employee", form.employeeName],
                  ["Manager", form.managerName],
                  ["Shift", form.shift],
                  ["Position", form.position],
                  ["Date & Time", `${form.incidentDate} at ${form.incidentTime}`],
                  ["Location", form.incidentLocation],
                  ["Report Type", "Near Miss"],
                  ["What happened", form.whatHappened],
                  ["Potential harm", form.potentialHarm],
                  ["What stopped it", form.whatStopped],
                  ...(form.witnessPresent === "yes" ? [["Witness", form.witnessName || "Not named"]] : []),
                ].map(([label, val]) => (
                  <div key={label} className="flex gap-3 border-b border-slate-50 pb-2">
                    <span className="text-slate-400 w-32 shrink-0">{label}</span>
                    <span className="text-slate-700">{val || <span className="italic text-slate-300">Not provided</span>}</span>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mt-5">
                <p className="text-xs text-amber-700">
                  <strong>Thank you for your good catch.</strong> Submitting this report creates a case and generates a case number. Your report will be reviewed by your administrator.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Validation errors */}
        {stepErrors.length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 mb-4" role="alert">
            <p className="text-sm font-medium text-rose-700 mb-1">Please complete the required fields:</p>
            <ul className="list-disc list-inside space-y-0.5">
              {stepErrors.map((e) => <li key={e} className="text-xs text-rose-600">{e}</li>)}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-3">
          <button onClick={handleSaveDraft} className="text-sm text-slate-500 hover:text-teal-600 font-medium transition-colors">
            {saved ? "✓ Saved!" : "Save draft"}
          </button>
          <div className="flex gap-3">
            {step > 0 && (
              <button onClick={handleBack} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 font-medium transition-colors">
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button onClick={handleNext} className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm">
                Continue
              </button>
            ) : (
              <button onClick={handleSubmit} className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm">
                Submit Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
