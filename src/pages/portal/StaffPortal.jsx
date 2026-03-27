import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import StatusBadge from "../../components/StatusBadge";

const NAVY = "#0f2d52";

export default function StaffPortal() {
  const { cases, user, drafts } = useApp();
  const myCases = cases.filter((c) => c.employeeName === user?.name || c.submittedBy === user?.name);
  const openCount = myCases.filter((c) => c.caseStatus === "Open").length;

  const recent = [...myCases]
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-8 fade-in">

        {/* Welcome header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Staff Portal</p>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name?.split(" ")[0]}</h1>
          <p className="text-sm text-slate-400 mt-0.5">{user?.position} · Sunrise Nursing & Rehabilitation</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <Link
            to="/portal/reports"
            className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 text-center hover:bg-slate-50 hover:border-slate-200 transition-colors group"
          >
            <p className="text-2xl font-black" style={{ color: NAVY }}>{myCases.length}</p>
            <p className="text-xs text-slate-400 mt-0.5 group-hover:text-slate-600 transition-colors">Total reports ↗</p>
          </Link>
          <Link
            to="/portal/reports?filter=open"
            className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 text-center hover:bg-amber-50 hover:border-amber-200 transition-colors group"
          >
            <p className="text-2xl font-black text-amber-500">{openCount}</p>
            <p className="text-xs text-slate-400 mt-0.5 group-hover:text-amber-600 transition-colors">Open cases ↗</p>
          </Link>
          <Link
            to="/portal/reports?filter=drafts"
            className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 text-center hover:bg-slate-100 hover:border-slate-300 transition-colors group"
          >
            <p className="text-2xl font-black text-slate-500">{drafts.length}</p>
            <p className="text-xs text-slate-400 mt-0.5 group-hover:text-slate-600 transition-colors">Saved drafts ↗</p>
          </Link>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <Link
            to="/portal/report/new"
            className="text-white rounded-2xl p-5 flex flex-col gap-2 transition-all hover:opacity-90 shadow-sm"
            style={{ background: NAVY }}
          >
            <span className="text-2xl">📋</span>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm">New Incident Report</span>
              <span className="text-lg font-bold opacity-80">+</span>
            </div>
            <span className="text-xs opacity-70">Report a workplace injury or illness</span>
          </Link>
          <Link
            to="/portal/near-miss/new"
            className="bg-white border border-slate-200 text-slate-700 rounded-2xl p-5 flex flex-col gap-2 transition-colors shadow-sm hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800 group"
          >
            <span className="text-2xl">⚠️</span>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm">Near Miss Report</span>
              <span className="text-lg font-bold opacity-60 group-hover:opacity-100">+</span>
            </div>
            <span className="text-xs text-slate-400 group-hover:text-amber-600 transition-colors">Report a close call — good catch!</span>
          </Link>
        </div>

        {/* Safety encouragement */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 flex gap-3 items-start">
          <span className="text-blue-500 text-lg mt-0.5">🛡</span>
          <div>
            <p className="text-sm font-semibold text-slate-800">Reporting is safe and encouraged</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">All reports are reviewed by your administrator. This facility maintains a <strong>non-punitive</strong> reporting culture.</p>
          </div>
        </div>

        {/* Drafts */}
        {drafts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Saved Drafts</h2>
            <div className="space-y-2">
              {drafts.map((d) => (
                <div key={d.draftId} className="bg-white border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Draft — {d.incidentDate || "No date"}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Saved {new Date(d.savedAt).toLocaleString()}</p>
                  </div>
                  <Link to="/portal/report/new" className="text-xs font-semibold hover:underline" style={{ color: NAVY }}>Continue →</Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Recent Activity</h2>
            {myCases.length > 4 && (
              <Link to="/portal/reports" className="text-xs font-semibold hover:underline" style={{ color: NAVY }}>
                View all {myCases.length} reports →
              </Link>
            )}
          </div>
          {recent.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center shadow-sm">
              <p className="text-slate-400 text-sm">No reports submitted yet.</p>
              <Link
                to="/portal/report/new"
                className="mt-4 inline-block text-xs font-semibold px-4 py-2 rounded-xl text-white"
                style={{ background: NAVY }}
              >
                Submit your first report
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((c) => (
                <Link
                  key={c.id}
                  to={`/portal/cases/${c.id}`}
                  className="block bg-white border border-slate-100 rounded-2xl p-4 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold" style={{ color: NAVY }}>{c.id}</p>
                      <p className="text-sm text-slate-600 mt-0.5">{c.injuryType} · {c.incidentDate}</p>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{c.injuryDescription}</p>
                    </div>
                    <div className="flex flex-col gap-1 items-end shrink-0">
                      <StatusBadge status={c.caseStatus} />
                      <StatusBadge status={c.reviewStatus} />
                    </div>
                  </div>
                </Link>
              ))}
              {myCases.length > 4 && (
                <Link
                  to="/portal/reports"
                  className="block text-center py-3 text-xs font-semibold rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  View all {myCases.length} reports →
                </Link>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
