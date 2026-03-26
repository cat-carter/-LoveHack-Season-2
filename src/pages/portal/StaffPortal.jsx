import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import StatusBadge from "../../components/StatusBadge";

export default function StaffPortal() {
  const { cases, user, drafts } = useApp();
  const myCases = cases.filter((c) => c.employeeName === user?.name || c.submittedBy === user?.name);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-800">Welcome, {user?.name}</h1>
          <p className="text-sm text-slate-500 mt-1">{user?.position}</p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Link
            to="/portal/report/new"
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl p-5 flex flex-col gap-2 transition-colors shadow-sm"
          >
            <span className="text-2xl">📋</span>
            <span className="font-semibold text-sm">New Incident Report</span>
            <span className="text-xs text-teal-100">Report a workplace injury or near miss</span>
          </Link>
          <Link
            to="/portal/report/new?type=near-miss"
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl p-5 flex flex-col gap-2 transition-colors"
          >
            <span className="text-2xl">⚠️</span>
            <span className="font-semibold text-sm">Near Miss Report</span>
            <span className="text-xs text-slate-400">Report a close call — no injury required</span>
          </Link>
        </div>

        {/* Encouragement strip */}
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 mb-8 flex gap-3 items-start">
          <span className="text-teal-500 text-xl">🛡</span>
          <div>
            <p className="text-sm font-medium text-teal-800">Reporting is safe and encouraged</p>
            <p className="text-xs text-teal-600 mt-0.5">All reports are reviewed by your administrator. This facility has a non-punitive reporting culture.</p>
          </div>
        </div>

        {/* Drafts */}
        {drafts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Saved Drafts</h2>
            <div className="space-y-2">
              {drafts.map((d) => (
                <div key={d.draftId} className="bg-white border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Draft — {d.incidentDate || "No date"}</p>
                    <p className="text-xs text-slate-400">Saved {new Date(d.savedAt).toLocaleString()}</p>
                  </div>
                  <Link to="/portal/report/new" className="text-xs text-teal-600 font-medium hover:underline">Continue →</Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My reports */}
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">My Submitted Reports</h2>
          {myCases.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
              <p className="text-slate-400 text-sm">No reports submitted yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myCases.map((c) => (
                <Link
                  key={c.id}
                  to={`/portal/cases/${c.id}`}
                  className="block bg-white border border-slate-200 rounded-2xl p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{c.id}</p>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
