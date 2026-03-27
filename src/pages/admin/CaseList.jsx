import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import StatusBadge from "../../components/StatusBadge";
import { useState } from "react";

const NAVY = "#0f2d52";

const HEADERS = [
  "Case #", "Employee", "Manager", "Date", "Injury Type",
  "Review", "Workers Comp", "OSHA 300", "Employee Status", "Case"
];

export default function CaseList() {
  const { cases } = useApp();
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? cases : cases.filter((c) => c.caseStatus === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 fade-in">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Case Repository</h1>
            <p className="text-sm text-slate-400 mt-1">Sunrise Nursing & Rehabilitation · {cases.length} total cases</p>
          </div>
          <div className="flex gap-2">
            {["All", "Open", "Closed"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
                style={
                  filter === s
                    ? { background: NAVY, color: "#fff" }
                    : { background: "#fff", color: "#475569", border: "1px solid #e2e8f0" }
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total", value: cases.length, color: NAVY },
            { label: "Open", value: cases.filter(c => c.caseStatus === "Open").length, color: "#f59e0b" },
            { label: "Pending review", value: cases.filter(c => c.reviewStatus === "Pending").length, color: "#e11d48" },
            { label: "On Leave", value: cases.filter(c => c.employeeStatus === "On Leave").length, color: "#1e6091" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 flex items-center gap-3">
              <span className="text-2xl font-black" style={{ color }}>{value}</span>
              <span className="text-xs text-slate-400 font-medium leading-tight">{label}</span>
            </div>
          ))}
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
              {filtered.map((c) => (
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

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-slate-400 text-sm">No {filter.toLowerCase()} cases found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
