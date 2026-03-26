import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import StatusBadge from "../../components/StatusBadge";
import { useState } from "react";

const HEADERS = [
  "Case #", "Employee", "Manager", "Date & Time", "Injury Type",
  "Review", "Workers Comp", "OSHA 300", "OSHA 301", "Employee Status", "Case Status"
];

export default function CaseList() {
  const { cases } = useApp();
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? cases : cases.filter((c) => c.caseStatus === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Case Repository</h1>
            <p className="text-sm text-slate-500 mt-1">{cases.length} total cases</p>
          </div>
          <div className="flex gap-2">
            {["All", "Open", "Closed"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === s ? "bg-teal-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {HEADERS.map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Link to={`/admin/cases/${c.id}`} className="text-teal-600 hover:underline font-medium">{c.id}</Link>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-700">{c.employeeName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500">{c.managerName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500">{c.incidentDate} {c.incidentTime}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-600">{c.injuryType}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.reviewStatus} /></td>
                  <td className="px-4 py-3"><StatusBadge status={c.workersCompStatus} /></td>
                  <td className="px-4 py-3"><StatusBadge status={c.osha300Status} /></td>
                  <td className="px-4 py-3"><StatusBadge status={c.osha301Status} /></td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div><StatusBadge status={c.employeeStatus} /></div>
                    {c.expectedReturn && <p className="text-xs text-slate-400 mt-1">Returns {c.expectedReturn}</p>}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={c.caseStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
