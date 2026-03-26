import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";
import { useApp } from "../../context/AppContext";
import { injuryTypeData, incidentsOverTime, shiftData } from "../../data/mockData";
import StatusBadge from "../../components/StatusBadge";
import TrendNarrative from "../../components/TrendNarrative";
import AISafetyAssistant from "../../components/AISafetyAssistant";
import { Link } from "react-router-dom";

const PIE_COLORS = ["#0d9488", "#6366f1", "#f59e0b", "#f43f5e", "#94a3b8"];

function StatCard({ label, value, sub, color = "teal" }) {
  const ring = color === "teal" ? "bg-teal-50 text-teal-700" : color === "amber" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700";
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
      <span className="text-3xl font-semibold text-slate-800">{value}</span>
      {sub && <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit mt-1 ${ring}`}>{sub}</span>}
    </div>
  );
}

export default function AdminDashboard() {
  const { cases } = useApp();
  const openCases = cases.filter((c) => c.caseStatus === "Open").length;
  const pendingReview = cases.filter((c) => c.reviewStatus === "Pending").length;
  const onLeave = cases.filter((c) => c.employeeStatus === "On Leave").length;

  const recent = cases.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-800">Safety Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Overview of incident trends and case status — March 2025</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Cases" value={cases.length} sub="All time" />
          <StatCard label="Open Cases" value={openCases} sub="Needs attention" color="amber" />
          <StatCard label="Pending Review" value={pendingReview} sub="Awaiting admin" color="amber" />
          <StatCard label="Staff on Leave" value={onLeave} sub="Work-related injury" color="rose" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Incidents over time */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Incidents Over Time</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={incidentsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Line type="monotone" dataKey="incidents" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 4, fill: "#0d9488" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Injury type breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Injury Type Breakdown</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={injuryTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} paddingAngle={3}>
                  {injuryTypeData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Weekly Briefing */}
        <div className="mb-8">
          <TrendNarrative />
        </div>

        {/* Shift bar + alert */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Incidents by Shift</h2>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={shiftData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="shift" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} width={55} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="incidents" fill="#0d9488" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Trend alerts */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Trend Alerts</h2>
            <div className="space-y-3">
              <div className="flex gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <span className="text-amber-500 text-lg">⚠</span>
                <div>
                  <p className="text-sm font-medium text-amber-900">Musculoskeletal injuries up 35% this quarter</p>
                  <p className="text-xs text-amber-700 mt-0.5">Consider scheduling lift safety refresher training for Day and Evening shifts.</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <span className="text-blue-500 text-lg">ℹ</span>
                <div>
                  <p className="text-sm font-medium text-blue-900">Day shift accounts for 44% of all incidents</p>
                  <p className="text-xs text-blue-700 mt-0.5">Peak incident time: 06:00–09:00. Review staffing ratios during morning care routines.</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-teal-50 border border-teal-100 rounded-xl">
                <span className="text-teal-500 text-lg">✓</span>
                <div>
                  <p className="text-sm font-medium text-teal-900">Near-miss reporting increased 20% vs. last quarter</p>
                  <p className="text-xs text-teal-700 mt-0.5">Positive trend — staff are engaging with the reporting system proactively.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent cases table */}
        <div className="bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">Recent Cases</h2>
            <Link to="/admin/cases" className="text-xs text-teal-600 hover:underline font-medium">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Case #", "Employee", "Injury Type", "Date", "Review", "Case Status"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((c) => (
                  <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3">
                      <Link to={`/admin/cases/${c.id}`} className="text-teal-600 hover:underline font-medium">{c.id}</Link>
                    </td>
                    <td className="px-6 py-3 text-slate-700">{c.employeeName}</td>
                    <td className="px-6 py-3 text-slate-600">{c.injuryType}</td>
                    <td className="px-6 py-3 text-slate-500">{c.incidentDate}</td>
                    <td className="px-6 py-3"><StatusBadge status={c.reviewStatus} /></td>
                    <td className="px-6 py-3"><StatusBadge status={c.caseStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AISafetyAssistant />
    </div>
  );
}
