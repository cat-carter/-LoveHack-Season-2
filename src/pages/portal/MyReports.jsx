import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import StatusBadge from "../../components/StatusBadge";
import { X } from "lucide-react";

const NAVY = "#0f2d52";

const TABS = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "drafts", label: "Drafts" },
  { key: "closed", label: "Closed" },
];

export default function MyReports() {
  const { cases, user, drafts } = useApp();
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get("filter") || "all";
  const [activeTab, setActiveTab] = useState(initialFilter);
  const [search, setSearch] = useState("");

  const myCases = cases.filter(
    (c) => c.employeeName === user?.name || c.submittedBy === user?.name
  );

  function filterCases() {
    let result = myCases;
    if (activeTab === "open") result = result.filter((c) => c.caseStatus === "Open");
    else if (activeTab === "closed") result = result.filter((c) => c.caseStatus === "Closed");
    else if (activeTab === "drafts") return drafts; // drafts handled separately

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          (c.incidentDate || "").includes(q) ||
          (c.injuryType || "").toLowerCase().includes(q)
      );
    }
    return result;
  }

  const filtered = filterCases();
  const isDraftsTab = activeTab === "drafts";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-8 fade-in">

        {/* Header */}
        <Link
          to="/portal"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-5 transition-colors"
        >
          ← Home
        </Link>
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-800">My Reports</h1>
          <p className="text-sm text-slate-400 mt-0.5">All incident reports submitted by or on your behalf</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearch(""); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === tab.key
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
              {tab.key === "all" && ` (${myCases.length})`}
              {tab.key === "open" && ` (${myCases.filter((c) => c.caseStatus === "Open").length})`}
              {tab.key === "drafts" && ` (${drafts.length})`}
              {tab.key === "closed" && ` (${myCases.filter((c) => c.caseStatus === "Closed").length})`}
            </button>
          ))}
        </div>

        {/* Search — only on non-drafts tabs */}
        {!isDraftsTab && (
          <div className="relative mb-5">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by case number, date, or incident type…"
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {/* Drafts tab */}
        {isDraftsTab && (
          drafts.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center shadow-sm">
              <p className="text-slate-400 text-sm">No saved drafts.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {drafts.map((d) => (
                <div key={d.draftId} className="bg-white border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Draft — {d.incidentDate || "No date"}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Saved {new Date(d.savedAt).toLocaleString()}</p>
                  </div>
                  <Link
                    to={d.injuryType === "Near Miss"
                      ? `/portal/near-miss/new?draft=${encodeURIComponent(d.draftId)}`
                      : `/portal/report/new?draft=${encodeURIComponent(d.draftId)}`}
                    className="text-xs font-semibold hover:underline" style={{ color: NAVY }}
                  >
                    Continue →
                  </Link>
                </div>
              ))}
            </div>
          )
        )}

        {/* Cases list */}
        {!isDraftsTab && (
          filtered.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center shadow-sm">
              <p className="text-slate-400 text-sm">
                {search ? "No reports match your search." : "No reports in this category."}
              </p>
              {!search && activeTab === "all" && (
                <Link
                  to="/portal/report/new"
                  className="mt-4 inline-block text-xs font-semibold px-4 py-2 rounded-xl text-white"
                  style={{ background: NAVY }}
                >
                  Submit your first report
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((c) => (
                <Link
                  key={c.id}
                  to={`/portal/cases/${c.id}`}
                  className="block bg-white border border-slate-100 rounded-2xl p-4 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold" style={{ color: NAVY }}>{c.id}</p>
                        <p className="text-xs text-slate-400">{c.incidentDate}</p>
                      </div>
                      <p className="text-sm text-slate-600 mt-0.5">{c.injuryType} · {c.incidentLocation}</p>
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
          )
        )}

      </div>
    </div>
  );
}
