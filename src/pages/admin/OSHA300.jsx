import { useApp } from "../../context/AppContext";
import { Link } from "react-router-dom";

function calcDaysAway(incidentDate) {
  if (!incidentDate) return { count: 0, returnDate: null };
  const incident = new Date(incidentDate).getTime();
  const returnMs = incident + 7 * 24 * 60 * 60 * 1000;
  const today = Date.now();
  const count = today >= returnMs ? 7 : Math.max(0, Math.ceil((today - incident) / (1000 * 60 * 60 * 24)));
  const returnDate = new Date(returnMs).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return { count, returnDate };
}

export default function OSHA300() {
  const { cases } = useApp();
  const recordable = cases.filter((c) => c.triage?.oshaRecordable === true);
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">OSHA 300 Log</h1>
            <p className="text-sm text-slate-500 mt-1">Log of Work-Related Injuries and Illnesses · Year: {currentYear}</p>
          </div>
          <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">← Dashboard</Link>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 text-sm text-amber-800">
          <strong>OSHA 300 Summary:</strong> This log records all work-related injuries and illnesses that meet OSHA recordability thresholds. Cases marked "Not Recordable" are excluded.
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Case #</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Employee</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Job Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Where Occurred</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Describe Injury</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Classify</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Days Away</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {recordable.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link to={`/admin/cases/${c.id}`} className="text-teal-600 hover:underline font-medium">{c.id}</Link>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{c.employeeName}</td>
                  <td className="px-4 py-3 text-slate-500">{c.position}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{c.incidentDate}</td>
                  <td className="px-4 py-3 text-slate-500">{c.incidentLocation}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{c.injuryDescription}</td>
                  <td className="px-4 py-3 text-slate-600">{c.injuryType}</td>
                  <td className="px-4 py-3 text-center text-slate-700">
                    {(() => {
                      const { count, returnDate } = calcDaysAway(c.incidentDate);
                      return (
                        <div>
                          <span className="font-semibold">{count}</span>
                          {returnDate && <p className="text-[10px] text-slate-400 mt-0.5">Est. return {returnDate}</p>}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{c.osha300Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-400 mt-4 text-center">
          Establishment: Sunrise Nursing & Rehabilitation · 400 Wellness Blvd, Springfield, IL · NAICS: 623110
        </p>
      </div>
    </div>
  );
}
