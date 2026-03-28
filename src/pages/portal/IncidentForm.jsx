import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

function FormCoach({ description, injuryType, location, shift, onApply }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [used, setUsed] = useState(new Set());
  const [error, setError] = useState(null);

  async function fetchSuggestions() {
    if (!description || description.trim().length < 10) return;
    setLoading(true);
    setSuggestions([]);
    setUsed(new Set());
    setError(null);
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, injuryType, location, shift }),
      });
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      if (!data.suggestions || data.suggestions.length === 0) {
        setError("No suggestions — try adding more detail to your description.");
      }
    } catch (err) {
      console.error("FormCoach error:", err);
      setError("Couldn't reach the AI server. Make sure the API server is running.");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }

  function apply(suggestion, i) {
    onApply(suggestion);
    setUsed((prev) => new Set([...prev, i]));
  }

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={fetchSuggestions}
        disabled={loading || !description || description.trim().length < 10}
        className="flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-800 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <span className="inline-block w-3 h-3 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
            Reviewing your description…
          </>
        ) : (
          <>✨ Get writing tips</>
        )}
      </button>

      {error && (
        <p className="mt-2 text-xs text-rose-500">{error}</p>
      )}

      {suggestions.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Click to add — then fill in the blanks:</p>
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => apply(s, i)}
              disabled={used.has(i)}
              className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-all flex items-start gap-2
                ${used.has(i)
                  ? "bg-teal-50 border-teal-200 text-teal-600 opacity-60 cursor-default"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700"
                }`}
            >
              <span className="shrink-0 mt-0.5">{used.has(i) ? "✓" : "＋"}</span>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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

export default function IncidentForm() {
  const { submitCase, saveDraft, user } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    employeeName: user?.name || "",
    managerName: user?.manager || "",
    shift: "",
    position: user?.position || "",
    employeeAddress: user?.address || "",
    employeeCityStateZip: user ? `${user.city || ""}, ${user.state || ""} ${user.zip || ""}`.trim().replace(/^,\s*/, "") : "",
    dateOfBirth: user?.dateOfBirth || "",
    dateHired: user?.dateHired || "",
    gender: user?.gender || "",
    incidentDate: "",
    incidentTime: "",
    incidentLocation: "",
    injuryType: "",
    injuryDescription: "",
    symptoms: "",
    medicalEvaluation: "",
    medicalDiagnosis: "",
  });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleNext() { setStep((s) => Math.min(s + 1, STEPS.length - 1)); }
  function handleBack() { setStep((s) => Math.max(s - 1, 0)); }

  function handleSaveDraft() {
    saveDraft(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleSubmit() {
    const newCase = submitCase({ ...form, medicalEvaluation: form.medicalEvaluation === "yes" });
    navigate(`/portal/cases/${newCase.id}?submitted=true`);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-xl mx-auto px-4 py-8">
        <Link to="/portal" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-5 transition-colors">
          ← My Reports
        </Link>
        <h1 className="text-xl font-semibold text-slate-800 mb-1">New Incident Report</h1>
        <p className="text-sm text-slate-500 mb-6">Please complete all required fields. You can save and return at any time.</p>

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
                <FormField label="Event Date" required>
                  <input type="date" className={inputCls} value={form.incidentDate} onChange={(e) => update("incidentDate", e.target.value)} />
                </FormField>
                <FormField label="Event Time" required>
                  <input type="time" className={inputCls} value={form.incidentTime} onChange={(e) => update("incidentTime", e.target.value)} />
                </FormField>
              </div>
              <div className="mt-2 mb-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 pb-2 border-b border-slate-100">Employee Profile <span className="normal-case font-normal text-slate-400">— auto-filled from HR record, edit if needed</span></p>
              </div>
              <FormField label="Home Address" hint="Street address">
                <input className={inputCls} value={form.employeeAddress} onChange={(e) => update("employeeAddress", e.target.value)} placeholder="Street address" />
              </FormField>
              <FormField label="City, State, ZIP">
                <input className={inputCls} value={form.employeeCityStateZip} onChange={(e) => update("employeeCityStateZip", e.target.value)} placeholder="City, State ZIP" />
              </FormField>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField label="Date of Birth">
                  <input type="date" className={inputCls} value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} />
                </FormField>
                <FormField label="Date Hired">
                  <input type="date" className={inputCls} value={form.dateHired} onChange={(e) => update("dateHired", e.target.value)} />
                </FormField>
                <FormField label="Gender">
                  <select className={selectCls} value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                    <option value="">Select…</option>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                  </select>
                </FormField>
              </div>
              <div className="mt-4 mb-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 pb-2 border-b border-slate-100">Incident Details</p>
              </div>
              <FormField label="Incident Location" required hint="e.g. Room 214, Corridor East Wing, Dining Room">
                <input className={inputCls} value={form.incidentLocation} onChange={(e) => update("incidentLocation", e.target.value)} placeholder="Where did this occur?" />
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

              {form.injuryType === "Illness" && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4 text-xs text-amber-800">
                  <strong>Illness report:</strong> Include onset date, symptoms, and any suspected work-related exposure in the description below.
                </div>
              )}
              {form.injuryType === "Property Damage" && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4 text-xs text-amber-800">
                  <strong>Property damage report:</strong> Describe what was damaged, estimated value if known, and how the damage occurred.
                </div>
              )}
              <FormField
                label={form.injuryType === "Property Damage" ? "Damage Description" : "Incident Description"}
                required
                hint="Describe what happened and how it occurred."
              >
                <textarea
                  rows={4}
                  className={textareaCls}
                  value={form.injuryDescription}
                  onChange={(e) => update("injuryDescription", e.target.value)}
                  placeholder={
                    form.injuryType === "Property Damage"
                      ? "e.g. Medical cart struck wall during patient transport, denting the cart frame..."
                      : form.injuryType === "Illness"
                      ? "e.g. Developed respiratory symptoms after prolonged exposure to cleaning chemicals..."
                      : "e.g. Back strain while assisting patient transfer without mechanical lift..."
                  }
                />
              </FormField>
              <FormCoach
                description={form.injuryDescription}
                injuryType={form.injuryType}
                location={form.incidentLocation}
                shift={form.shift}
                onApply={(suggestion) =>
                  update("injuryDescription", form.injuryDescription + (form.injuryDescription.endsWith(" ") || form.injuryDescription === "" ? "" : " ") + suggestion + " ")
                }
              />
              <FormField label={form.injuryType === "Property Damage" ? "Items Involved / Estimated Value" : "Medical Symptoms"} required={form.injuryType !== "Property Damage"}>
                <textarea
                  rows={3}
                  className={textareaCls}
                  value={form.symptoms}
                  onChange={(e) => update("symptoms", e.target.value)}
                  placeholder={
                    form.injuryType === "Property Damage"
                      ? "e.g. Medical supply cart, estimated replacement value $450..."
                      : "e.g. Lower back pain, limited range of motion..."
                  }
                />
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
                  <textarea
                    rows={3}
                    className={textareaCls}
                    value={form.medicalDiagnosis}
                    onChange={(e) => update("medicalDiagnosis", e.target.value)}
                    placeholder="Enter diagnosis as provided..."
                  />
                </FormField>
              )}

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4">
                <p className="text-xs text-blue-700">
                  <strong>Note:</strong> If you required medical attention or are requesting time off, your administrator will initiate a Workers' Compensation form.
                </p>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Review your report before submitting</h3>
              <div className="space-y-3 text-sm">
                {[
                  ["Employee", form.employeeName],
                  ["Manager", form.managerName],
                  ["Shift", form.shift],
                  ["Position", form.position],
                  ["Address", form.employeeAddress],
                  ["City, State, ZIP", form.employeeCityStateZip],
                  ["Date of Birth", form.dateOfBirth],
                  ["Date Hired", form.dateHired],
                  ["Gender", form.gender],
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
              <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 mt-5">
                <p className="text-xs text-teal-700">
                  Submitting this form creates a case and generates a case number. A timestamp will be recorded automatically.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleSaveDraft}
            className="text-sm text-slate-500 hover:text-teal-600 font-medium transition-colors"
          >
            {saved ? "✓ Saved!" : "Save draft"}
          </button>
          <div className="flex gap-3">
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
                onClick={handleSubmit}
                className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm"
              >
                Submit Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
