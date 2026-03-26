import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const STEPS = ["Employee Info", "Incident Details", "Injury & Treatment", "Review & Submit"];

function StepIndicator({ current, total, labels }) {
  return (
    <div className="flex items-start gap-1 mb-8 overflow-x-auto pb-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-1 shrink-0">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors
              ${i < current ? "bg-teal-600 text-white" : i === current ? "bg-teal-600 text-white ring-4 ring-teal-100" : "bg-slate-100 text-slate-400"}`}>
              {i < current ? "✓" : i + 1}
            </div>
            <span className="text-xs text-slate-400 whitespace-nowrap hidden sm:block">{labels[i]}</span>
          </div>
          {i < total - 1 && <div className={`h-0.5 w-8 mt-3.5 ${i < current ? "bg-teal-600" : "bg-slate-200"}`} />}
        </div>
      ))}
    </div>
  );
}

function Field({ label, required, hint, children }) {
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

const inp = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white";
const sel = inp;
const ta = `${inp} resize-none`;

export default function WorkersCompForm() {
  const { caseId } = useParams();
  const { cases, user } = useApp();
  const navigate = useNavigate();
  const sourceCase = cases.find((c) => c.id === caseId);

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    // Employee Info
    employeeName: sourceCase?.employeeName || user?.name || "",
    gender: "",
    birthDate: "",
    ssn: "",
    maritalStatus: "",
    homeAddress: "",
    personalPhone: "",
    hireDate: "",
    jobType: sourceCase?.position || user?.position || "",
    workPhone: "",
    // Incident
    managerName: sourceCase?.managerName || "",
    managerPhone: "",
    incidentDate: sourceCase?.incidentDate || "",
    incidentTime: sourceCase?.incidentTime || "",
    reportDate: new Date().toISOString().split("T")[0],
    incidentLocation: sourceCase?.incidentLocation || "",
    incidentType: sourceCase?.injuryType || "",
    incidentDescription: sourceCase?.injuryDescription || "",
    witnesses: "",
    activitiesPrior: "",
    // Injury
    injuryType: sourceCase?.injuryType || "",
    injuryDescription: sourceCase?.injuryDescription || "",
    bodyParts: "",
    treatedBefore: "",
    requestingTreatment: "",
    physicianName: "",
    physicianPhone: "",
    timeOffStart: "",
    timeOffEnd: "",
  });

  function set(field, val) {
    setForm((p) => ({ ...p, [field]: val }));
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-teal-600 text-2xl">✓</span>
          </div>
          <h2 className="text-lg font-semibold text-slate-800 mb-1">Workers' Comp Form Submitted</h2>
          <p className="text-sm text-slate-500 mb-2">Linked to case <strong>{caseId}</strong></p>
          <p className="text-xs text-slate-400 mb-6">Submitted {new Date().toLocaleString()}</p>
          <button
            onClick={() => navigate(user?.role === "admin" ? `/admin/cases/${caseId}` : `/portal/cases/${caseId}`)}
            className="w-full bg-teal-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            Back to Case
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="mb-6">
          <span className="text-xs text-slate-400">Linked to case: <strong>{caseId}</strong></span>
          <h1 className="text-xl font-semibold text-slate-800 mt-1">Workers' Compensation Form</h1>
          <p className="text-sm text-slate-500 mt-0.5">Complete all required fields. Employee info is pre-filled where available.</p>
        </div>

        <StepIndicator current={step} total={STEPS.length} labels={STEPS} />

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">

          {/* Step 0 — Employee Info */}
          {step === 0 && (
            <>
              <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 mb-5 text-xs text-teal-700">
                Fields marked with HR are typically pre-filled from the HR database in production.
              </div>
              <Field label="Employee Name" required>
                <input className={inp} value={form.employeeName} onChange={(e) => set("employeeName", e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Gender" required>
                  <select className={sel} value={form.gender} onChange={(e) => set("gender", e.target.value)}>
                    <option value="">Select</option>
                    <option>Male</option><option>Female</option><option>Non-binary</option><option>Prefer not to say</option>
                  </select>
                </Field>
                <Field label="Date of Birth" required>
                  <input type="date" className={inp} value={form.birthDate} onChange={(e) => set("birthDate", e.target.value)} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="SSN (last 4 digits)" hint="For verification only">
                  <input className={inp} maxLength={4} placeholder="XXXX" value={form.ssn} onChange={(e) => set("ssn", e.target.value)} />
                </Field>
                <Field label="Marital Status">
                  <select className={sel} value={form.maritalStatus} onChange={(e) => set("maritalStatus", e.target.value)}>
                    <option value="">Select</option>
                    <option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
                  </select>
                </Field>
              </div>
              <Field label="Home Address" required>
                <input className={inp} value={form.homeAddress} onChange={(e) => set("homeAddress", e.target.value)} placeholder="Street, City, State, ZIP" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Personal Phone">
                  <input className={inp} value={form.personalPhone} onChange={(e) => set("personalPhone", e.target.value)} />
                </Field>
                <Field label="Work Phone">
                  <input className={inp} value={form.workPhone} onChange={(e) => set("workPhone", e.target.value)} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Hire Date">
                  <input type="date" className={inp} value={form.hireDate} onChange={(e) => set("hireDate", e.target.value)} />
                </Field>
                <Field label="Job Type / Position">
                  <input className={inp} value={form.jobType} onChange={(e) => set("jobType", e.target.value)} />
                </Field>
              </div>
            </>
          )}

          {/* Step 1 — Incident Details */}
          {step === 1 && (
            <>
              <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 mb-5 text-xs text-teal-700">
                Fields pre-filled from the linked incident report.
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Manager Name" required>
                  <input className={inp} value={form.managerName} onChange={(e) => set("managerName", e.target.value)} />
                </Field>
                <Field label="Manager Phone">
                  <input className={inp} value={form.managerPhone} onChange={(e) => set("managerPhone", e.target.value)} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Date of Incident" required>
                  <input type="date" className={inp} value={form.incidentDate} onChange={(e) => set("incidentDate", e.target.value)} />
                </Field>
                <Field label="Time of Incident">
                  <input type="time" className={inp} value={form.incidentTime} onChange={(e) => set("incidentTime", e.target.value)} />
                </Field>
              </div>
              <Field label="Date Incident Reported">
                <input type="date" className={inp} value={form.reportDate} onChange={(e) => set("reportDate", e.target.value)} />
              </Field>
              <Field label="Incident Location" required>
                <input className={inp} value={form.incidentLocation} onChange={(e) => set("incidentLocation", e.target.value)} />
              </Field>
              <Field label="Incident Type">
                <select className={sel} value={form.incidentType} onChange={(e) => set("incidentType", e.target.value)}>
                  <option value="">Select</option>
                  <option>Musculoskeletal</option><option>Needlestick</option><option>Slip / Fall</option>
                  <option>Near Miss</option><option>Burn</option><option>Exposure</option><option>Other</option>
                </select>
              </Field>
              <Field label="Incident Description" required hint="Describe what happened in detail.">
                <textarea rows={4} className={ta} value={form.incidentDescription} onChange={(e) => set("incidentDescription", e.target.value)} />
              </Field>
              <Field label="Witnesses" hint="List names of any witnesses present.">
                <input className={inp} value={form.witnesses} onChange={(e) => set("witnesses", e.target.value)} placeholder="e.g. Jane Smith, RN" />
              </Field>
              <Field label="Activities performed prior to incident" hint="What were you doing just before the incident occurred?">
                <textarea rows={3} className={ta} value={form.activitiesPrior} onChange={(e) => set("activitiesPrior", e.target.value)} />
              </Field>
            </>
          )}

          {/* Step 2 — Injury & Treatment */}
          {step === 2 && (
            <>
              <Field label="Injury Type">
                <input className={inp} value={form.injuryType} onChange={(e) => set("injuryType", e.target.value)} />
              </Field>
              <Field label="Injury Description">
                <textarea rows={3} className={ta} value={form.injuryDescription} onChange={(e) => set("injuryDescription", e.target.value)} />
              </Field>
              <Field label="Parts of body affected" required hint="e.g. Lower back, right shoulder, left hand">
                <input className={inp} value={form.bodyParts} onChange={(e) => set("bodyParts", e.target.value)} />
              </Field>
              <Field label="Have you ever been treated for a similar injury?" required>
                <div className="flex gap-3 mt-1">
                  {["Yes", "No"].map((v) => (
                    <button key={v} type="button" onClick={() => set("treatedBefore", v)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors
                        ${form.treatedBefore === v ? "bg-teal-600 text-white border-teal-600" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Are you requesting medical treatment at this time?" required>
                <div className="flex gap-3 mt-1">
                  {["Yes", "No"].map((v) => (
                    <button key={v} type="button" onClick={() => set("requestingTreatment", v)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors
                        ${form.requestingTreatment === v ? "bg-teal-600 text-white border-teal-600" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </Field>
              {form.requestingTreatment === "Yes" && (
                <>
                  <Field label="Physician / Healthcare Provider Name">
                    <input className={inp} value={form.physicianName} onChange={(e) => set("physicianName", e.target.value)} />
                  </Field>
                  <Field label="Physician Phone">
                    <input className={inp} value={form.physicianPhone} onChange={(e) => set("physicianPhone", e.target.value)} />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Time off from" hint="If requesting leave">
                      <input type="date" className={inp} value={form.timeOffStart} onChange={(e) => set("timeOffStart", e.target.value)} />
                    </Field>
                    <Field label="Time off to">
                      <input type="date" className={inp} value={form.timeOffEnd} onChange={(e) => set("timeOffEnd", e.target.value)} />
                    </Field>
                  </div>
                </>
              )}
            </>
          )}

          {/* Step 3 — Review */}
          {step === 3 && (
            <>
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Review before submitting</h3>
              <div className="space-y-2 text-sm">
                {[
                  ["Employee", form.employeeName],
                  ["Date of Birth", form.birthDate],
                  ["Home Address", form.homeAddress],
                  ["Job Type", form.jobType],
                  ["Manager", form.managerName],
                  ["Incident Date", `${form.incidentDate} at ${form.incidentTime}`],
                  ["Location", form.incidentLocation],
                  ["Incident Type", form.incidentType],
                  ["Body Parts Affected", form.bodyParts],
                  ["Treated before?", form.treatedBefore],
                  ["Requesting treatment?", form.requestingTreatment],
                  ...(form.requestingTreatment === "Yes" ? [["Physician", form.physicianName]] : []),
                  ...(form.timeOffStart ? [["Time off", `${form.timeOffStart} – ${form.timeOffEnd}`]] : []),
                ].map(([label, val]) => (
                  <div key={label} className="flex gap-3 border-b border-slate-50 pb-2">
                    <span className="text-slate-400 w-40 shrink-0">{label}</span>
                    <span className="text-slate-700">{val || <span className="italic text-slate-300">—</span>}</span>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mt-5">
                <p className="text-xs text-amber-700">
                  This form contains sensitive personal information. It will be securely stored and accessible only to authorized administrators and HR personnel.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-sm text-slate-400 hover:text-slate-600">Cancel</button>
          <div className="flex gap-3">
            {step > 0 && (
              <button onClick={() => setStep((s) => s - 1)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 font-medium transition-colors">
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep((s) => s + 1)}
                className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm">
                Continue
              </button>
            ) : (
              <button onClick={handleSubmit}
                className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm">
                Submit Form
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
