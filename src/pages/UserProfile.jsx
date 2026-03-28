import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { Shield } from "lucide-react";

const NAVY = "#0f2d52";

const ADMIN_PROFILE = {
  email: "j.okafor@sunrisenursing.org",
  phone: "(617) 555-0182",
  department: "Administration & Risk Management",
  facility: "Sunrise Nursing & Rehabilitation",
  location: "Boston, MA",
  joined: "August 2019",
  certifications: ["OSHA 30-Hour General Industry", "Certified Safety Professional (CSP)", "Workers' Comp Case Manager"],
  responsibilities: ["Incident review & case management", "OSHA 300/301 recordkeeping", "Workers' comp coordination", "Safety culture development"],
};

const STAFF_PROFILE = {
  email: "m.santos@sunrisenursing.org",
  phone: "(617) 555-0147",
  department: "Nursing — East Wing",
  facility: "Sunrise Nursing & Rehabilitation",
  location: "Boston, MA",
  joined: "March 2022",
  certifications: ["Certified Nursing Assistant (CNA)", "CPR / First Aid", "Safe Patient Handling Level 2"],
  responsibilities: ["Patient care & daily living assistance", "Mobility & transfer support", "Vital signs monitoring", "Incident documentation"],
};

function StatCard({ value, label, color = NAVY }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
      <p className="text-3xl font-black" style={{ color }}>{value}</p>
      <p className="text-xs text-slate-500 mt-1 font-medium">{label}</p>
    </div>
  );
}

export default function UserProfile() {
  const { user, cases } = useApp();

  if (!user) return null;

  const isAdmin = user.role === "admin";
  const profile = isAdmin ? ADMIN_PROFILE : STAFF_PROFILE;

  const [editing, setEditing] = useState(false);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [savedPhone, setSavedPhone] = useState(profile.phone);
  const [savedEmail, setSavedEmail] = useState(profile.email);
  const [profileSaved, setProfileSaved] = useState(false);

  function handleStartEdit() {
    setEditPhone(savedPhone);
    setEditEmail(savedEmail);
    setEditing(true);
  }

  function handleCancel() {
    setEditPhone(savedPhone);
    setEditEmail(savedEmail);
    setEditing(false);
  }

  function handleSaveProfile() {
    setSavedPhone(editPhone);
    setSavedEmail(editEmail);
    setEditing(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  }
  const backPath = isAdmin ? "/admin" : "/portal";
  const backLabel = isAdmin ? "Dashboard" : "My Reports";

  // Stats
  const myCases = isAdmin
    ? cases.filter((c) => c.reviewer === user.name)
    : cases.filter((c) => c.submittedBy === user.name);

  const openCount = myCases.filter((c) => c.caseStatus === "Open").length;
  const closedCount = myCases.filter((c) => c.caseStatus === "Closed").length;
  const pendingReview = isAdmin
    ? cases.filter((c) => c.reviewStatus === "Pending").length
    : 0;

  const recent = [...myCases]
    .sort((a, b) => {
      const aTrail = a.auditTrail || [];
      const bTrail = b.auditTrail || [];
      const aLast = aTrail.length ? aTrail[aTrail.length - 1].at : a.submittedAt;
      const bLast = bTrail.length ? bTrail[bTrail.length - 1].at : b.submittedAt;
      return new Date(bLast) - new Date(aLast);
    })
    .slice(0, 5);

  const initials = user.name.split(" ").map((w) => w[0]).join("");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 fade-in">

        {/* Back link */}
        <Link to={backPath} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          ← Back to {backLabel}
        </Link>

        {/* Hero card */}
        <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 mb-6">
          {/* Banner */}
          <div className="h-28" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1e6091 100%)` }} />

          {/* Avatar + name */}
          <div className="bg-white px-6 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div
                className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-2xl font-black text-white"
                style={{ background: NAVY }}
              >
                {initials}
              </div>
              <span
                className="text-xs font-bold px-3 py-1.5 rounded-full text-white mb-1"
                style={{ background: isAdmin ? "#0d9488" : "#1e6091" }}
              >
                {isAdmin ? "Administrator" : "Frontline Staff"}
              </span>
            </div>

            <h1 className="text-2xl font-black text-slate-800">{user.name}</h1>
            <p className="text-sm text-slate-500 mt-0.5">{user.position} · {profile.department}</p>
            <p className="text-xs text-slate-400 mt-1">{profile.facility} · {profile.location}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className={`grid gap-4 mb-6 ${isAdmin ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3"}`}>
          <StatCard value={myCases.length} label={isAdmin ? "Cases reviewed" : "Reports submitted"} color={NAVY} />
          <StatCard value={openCount} label="Open cases" color="#f59e0b" />
          <StatCard value={closedCount} label="Closed cases" color="#0d9488" />
          {isAdmin && <StatCard value={pendingReview} label="Pending review" color="#e11d48" />}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Contact + certifications */}
          <div className="space-y-4">

            {/* Contact info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Contact</p>
                {!editing && (
                  <button
                    onClick={handleStartEdit}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-800 border border-teal-200 rounded-lg px-3 py-1 transition-colors"
                  >
                    ✏️ Edit
                  </button>
                )}
                {profileSaved && (
                  <span className="text-xs text-teal-600 font-medium">✓ Changes saved</span>
                )}
              </div>

              <div className="space-y-3">
                {/* Email */}
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-sm w-4 shrink-0">✉</span>
                  {editing ? (
                    <input
                      className="flex-1 text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  ) : (
                    <span className="text-sm text-slate-600">{savedEmail}</span>
                  )}
                </div>
                {/* Phone */}
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-sm w-4 shrink-0">☎</span>
                  {editing ? (
                    <input
                      className="flex-1 text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                    />
                  ) : (
                    <span className="text-sm text-slate-600">{savedPhone}</span>
                  )}
                </div>
                {/* Locked fields */}
                {[
                  { icon: "🏥", label: profile.facility },
                  { icon: "📍", label: profile.location },
                  { icon: "📅", label: `Joined ${profile.joined}` },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-slate-400 text-sm w-4 shrink-0">{icon}</span>
                    <span className="text-sm text-slate-500">{label}</span>
                    {editing && (
                      <svg className="ml-auto w-3.5 h-3.5 text-slate-300 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>

              {/* Edit mode actions */}
              {editing && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Certifications</p>
              <div className="space-y-2">
                {profile.certifications.map((cert) => (
                  <div key={cert} className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold text-xs mt-0.5">✓</span>
                    <span className="text-sm text-slate-600">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Responsibilities</p>
              <div className="space-y-2">
                {profile.responsibilities.map((r) => (
                  <div key={r} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                    <span className="text-sm text-slate-600">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Recent activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="px-6 py-4 border-b border-slate-50">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Recent activity</p>
                <h3 className="text-base font-bold text-slate-800">
                  {isAdmin ? "Cases you've reviewed" : "Your incident reports"}
                </h3>
              </div>

              {recent.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-slate-400 text-sm">No activity yet.</p>
                  {!isAdmin && (
                    <Link
                      to="/portal/report/new"
                      className="mt-3 inline-block text-xs font-semibold px-4 py-2 rounded-lg text-white"
                      style={{ background: NAVY }}
                    >
                      Submit your first report
                    </Link>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {recent.map((c) => (
                    <Link
                      key={c.id}
                      to={isAdmin ? `/admin/cases/${c.id}` : `/portal/cases/${c.id}`}
                      className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group"
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "#e8f0f9" }}
                      >
                        <span className="text-sm font-bold" style={{ color: NAVY }}>
                          {c.injuryType === "Near Miss" ? "!" : c.injuryType?.[0] ?? "?"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-slate-800 group-hover:underline" style={{ color: NAVY }}>{c.id}</span>
                          <span className="text-xs text-slate-400 shrink-0">{c.incidentDate}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{c.injuryType} · {c.incidentLocation}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <StatusBadge status={c.reviewStatus} />
                          <StatusBadge status={c.caseStatus} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {myCases.length > 5 && (
                <div className="px-6 py-3 border-t border-slate-50">
                  <Link
                    to={isAdmin ? "/admin/cases" : "/portal"}
                    className="text-xs font-semibold hover:underline"
                    style={{ color: NAVY }}
                  >
                    View all {myCases.length} cases →
                  </Link>
                </div>
              )}
            </div>

            {/* Safety acknowledgement card */}
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <Shield size={18} aria-hidden="true" className="text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Non-punitive reporting commitment</p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {profile.facility} maintains a confidential, non-punitive safety culture.
                    All incident reports are used for quality improvement only.
                    Thank you for your commitment to workplace safety.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
