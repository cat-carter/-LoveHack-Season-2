import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import StatusBadge from "../../components/StatusBadge";
import { X } from "lucide-react";

const NAVY = "#0f2d52";

const HEADERS = [
  "Case #", "Employee", "Manager", "Date", "Injury Type",
  "Review", "Workers Comp", "OSHA 300", "Employee Status", "Case"
];

const SORT_OPTIONS = [
  { value: "date-desc", label: "Date: Newest" },
  { value: "date-asc", label: "Date: Oldest" },
  { value: "employee-asc", label: "Employee A–Z" },
  { value: "review-status", label: "Review Status" },
];

export default function CaseList() {
  const { cases } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFilter = searchParams.get("filter") || "all";

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date-desc");

  // Status filter — map URL params to caseStatus / reviewStatus values
  const statusFilter = urlFilter === "open" ? "Open"
    : urlFilter === "closed" ? "Closed"
    : urlFilter === "pending" ? "Pending"
    : "all";

  function setFilter(val) {
    setSearchParams(val === "all" ? {} : { filter: val });
  }

  // Apply status filter
  let result = cases;
  if (statusFilter === "Open" || statusFilter === "Closed") {
    result = result.filter((c) => c.caseStatus === statusFilter);
  } else if (statusFilter === "Pending") {
    result = result.filter((c) => c.reviewStatus === "Pending");
  }

  // Apply search
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter((c) =>
      c.id.toLowerCase().includes(q) ||
      (c.employeeName || "").toLowerCase().includes(q) ||
      (c.incidentDate || "").includes(q) ||
      (c.injuryType || "").toLowerCase().includes(q)
    );
  }

  // Apply sort
  result = [...result].sort((a, b) => {
    if (sort === "date-desc") return new Date(b.submittedAt) - new Date(a.submittedAt);
    if (sort === "date-asc") return new Date(a.submittedAt) - new Date(b.submittedAt);
    if (sort === "employee-asc") return (a.employeeName || "").localeCompare(b.employeeName || "");
    if (sort === "review-status") return (a.reviewStatus || "").localeCompare(b.reviewStatus || "");
    return 0;
  });

  const FILTER_TABS = [
    { key: "all", label: `All (${cases.length})` },
    { key: "open", label: `Open (${cases.filter((c) => c.caseStatus === "Open").length})` },
    { key: "pending", label: `Pending Review (${cases.filter((c) => c.reviewStatus === "Pending").length})` },
    { key: "closed", label: `Closed (${cases.filter((c) => c.caseStatus === "Closed").length})` },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 fade-in">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Case Repository</h1>
            <p className="text-sm text-slate-400 mt-1">Sunrise Nursing & Rehabilitation · {cases.length} total cases</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {FILTER_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
              style={
                urlFilter === key
                  ? { background: NAVY, color: "#fff" }
                  : { background: "#fff", color: "#475569", border: "1px solid #e2e8f0" }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search + sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by case #, employee, date, or injury type…"
              className="w-full pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
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
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50">
                {HEADERS.map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <Link to={`/admin/cases/${c.id}`} className="font-semibold hover:underline" style={{ color: NAVY }}>{c.id}</Link>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-700">{c.employeeName}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">{c.managerName}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-400 tabular-nums">{c.incidentDate}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-600">{c.injuryType}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={c.reviewStatus} /></td>
                  <td className="px-5 py-3.5"><StatusBadge status={c.workersCompStatus} /></td>
                  <td className="px-5 py-3.5"><StatusBadge status={c.osha300Status} /></td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <StatusBadge status={c.employeeStatus} />
                    {c.expectedReturn && <p className="text-xs text-slate-400 mt-1">Returns {c.expectedReturn}</p>}
                  </td>
                  <td className="px-5 py-3.5"><StatusBadge status={c.caseStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {result.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-slate-400 text-sm">
                {search ? "No cases match your search." : "No cases in this category."}
              </p>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 mt-3">{result.length} of {cases.length} cases shown</p>
      </div>
    </div>
  );
}
