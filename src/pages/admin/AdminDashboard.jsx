import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, LabelList,
} from "recharts";
import { useApp } from "../../context/AppContext";
import { injuryTypeData, incidentsOverTime, shiftData } from "../../data/mockData";
import StatusBadge from "../../components/StatusBadge";
import TrendNarrative from "../../components/TrendNarrative";
import AISafetyAssistant from "../../components/AISafetyAssistant";
import { Link } from "react-router-dom";
import { AlertTriangle, TrendingUp, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";

const NAVY = "#0f2d52";
const COLORS = ["#0f2d52", "#1e6091", "#0d9488", "#f59e0b", "#94a3b8"];

// ── Global activity feed ─────────────────────────────────────────────────────
function ActivityFeed({ cases }) {
  const allEntries = cases.flatMap((c) =>
    (c.auditTrail || []).map((entry) => ({ ...entry, caseId: c.id }))
  );
  const sorted = allEntries
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 10);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
      <div className="px-5 py-4 border-b border-slate-50">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-0.5">Activity</p>
        <h3 className="text-base font-bold text-slate-800">Recent actions</h3>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
        {sorted.length === 0 ? (
          <p className="text-sm text-slate-400 italic px-5 py-6">No activity recorded yet.</p>
        ) : (
          sorted.map((entry, i) => (
            <div key={i} className="flex gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0" />
              <div className="flex-1 min-w-0">
                <Link
                  to={`/admin/cases/${entry.caseId}`}
                  className="text-xs font-semibold hover:underline shrink-0"
                  style={{ color: NAVY }}
                >
                  {entry.caseId}
                </Link>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">{entry.action}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {entry.by} · {new Date(entry.at).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Custom tooltip shared across charts ────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3">
      {label && <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color || NAVY }}>
          {p.value} {p.name || "incidents"}
        </p>
      ))}
    </div>
  );
}

// ── KPI card ────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, trend, accentColor = NAVY, urgent }) {
  const trendUp = trend > 0;
  return (
    <div className={`rounded-2xl p-5 shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow ${
      urgent
        ? "bg-amber-50 border-2 border-amber-300"
        : "bg-white border border-slate-100"
    }`}>
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</span>
      <div className="flex items-end gap-3">
        <span className={`text-4xl font-black ${urgent ? "text-amber-700" : "text-slate-800"}`}>{value}</span>
        {trend !== undefined && (
          <span className={`text-xs font-semibold mb-1.5 px-2 py-0.5 rounded-full ${trendUp ? "bg-rose-50 text-rose-600" : "bg-teal-50 text-teal-700"}`}>
            {trendUp ? <ArrowUpRight size={10} className="inline mr-0.5" aria-hidden="true" /> : <ArrowDownRight size={10} className="inline mr-0.5" aria-hidden="true" />}{Math.abs(trend)}%
          </span>
        )}
      </div>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
      <div className="h-0.5 w-12 rounded-full mt-1" style={{ background: urgent ? "#d97706" : accentColor }} />
    </div>
  );
}

// ── Donut center label (absolute overlay — always truly centered) ─────────────
function DonutCenter({ total }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center">
        <p className="text-3xl font-black text-slate-800 leading-none">{total}</p>
        <p className="text-xs text-slate-500 mt-1">total</p>
      </div>
    </div>
  );
}

function OshaReminder({ cases }) {
  // Cases with pending OSHA forms (recordable cases only)
  const pending = cases.filter(
    (c) =>
      c.triage?.oshaRecordable !== false &&
      (c.osha300Status === "Pending" || c.osha301Status === "Pending")
  );

  if (pending.length === 0) return null;

  // Find the oldest overdue case
  const oldest = pending.reduce((a, b) =>
    new Date(a.submittedAt) < new Date(b.submittedAt) ? a : b
  );
  const daysSince = Math.floor(
    (Date.now() - new Date(oldest.submittedAt)) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-4">
      <AlertTriangle size={20} aria-hidden="true" className="text-amber-600 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-amber-900">
          {pending.length} case{pending.length > 1 ? "s" : ""} with OSHA forms pending
        </p>
        <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
          OSHA Forms 300 &amp; 301 must be completed within <strong>7 calendar days</strong> of a recordable incident.
          {daysSince > 7 && ` Oldest pending case is ${daysSince} days old.`}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {pending.slice(0, 4).map((c) => (
            <Link
              key={c.id}
              to={`/admin/cases/${c.id}`}
              className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
            >
              {c.id}
            </Link>
          ))}
          {pending.length > 4 && (
            <span className="text-xs text-amber-600 py-1">+{pending.length - 4} more</span>
          )}
        </div>
      </div>
      <Link
        to="/admin/cases"
        className="shrink-0 text-xs font-semibold text-amber-700 hover:text-amber-900 border border-amber-300 rounded-lg px-3 py-1.5 hover:bg-amber-100 transition-colors whitespace-nowrap"
      >
        View all →
      </Link>
    </div>
  );
}

export default function AdminDashboard() {
  const { cases } = useApp();
  const openCases = cases.filter((c) => c.caseStatus === "Open").length;
  const pendingReview = cases.filter((c) => c.reviewStatus === "Pending").length;
  const onLeave = cases.filter((c) => c.employeeStatus === "On Leave").length;
  const total = injuryTypeData.reduce((s, d) => s + d.value, 0);

  const recent = cases.slice(0, 5);

  // Month-over-month change
  const last = incidentsOverTime[incidentsOverTime.length - 1]?.incidents;
  const prev = incidentsOverTime[incidentsOverTime.length - 2]?.incidents;
  const momPct = prev ? Math.round(((last - prev) / prev) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 fade-in">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Safety Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Sunrise Nursing & Rehabilitation · March 2025</p>
          </div>
          <Link to="/admin/cases" className="text-xs font-semibold px-4 py-2 rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors shadow-sm">
            View all cases →
          </Link>
        </div>

        {/* OSHA 7-day reminder */}
        <OshaReminder cases={cases} />

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard label="Total Cases" value={cases.length} sub="All time" accentColor={NAVY} />
          <KpiCard label="Open Cases" value={openCases} sub="Require resolution" trend={20} accentColor="#f59e0b" urgent={openCases > 0} />
          <KpiCard label="Pending Review" value={pendingReview} sub="Awaiting admin action" trend={0} accentColor="#1e6091" />
          <KpiCard label="Staff on Leave" value={onLeave} sub="Work-related injury" trend={0} accentColor="#f43f5e" />
        </div>

        {/* AI Briefing */}
        <div className="mb-8">
          <TrendNarrative />
        </div>

        {/* Charts row 1: Area + Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Area chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="mb-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Incident trend</p>
              <h3 className="text-base font-bold text-slate-800">
                {momPct > 0 ? `↑ Up ${momPct}% from last month — monitor closely` : momPct < 0 ? `↓ Down ${Math.abs(momPct)}% from last month` : "Stable month-over-month"}
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={incidentsOverTime} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="10%" stopColor={NAVY} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={NAVY} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#cbd5e1" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: NAVY, strokeWidth: 1, strokeDasharray: "4 4" }} />
                <Area type="monotone" dataKey="incidents" stroke={NAVY} strokeWidth={2.5} fill="url(#areaGrad)" dot={{ r: 4, fill: NAVY, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6, fill: NAVY }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Donut chart */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">By injury type</p>
              <h3 className="text-base font-bold text-slate-800">Musculoskeletal leads at 35%</h3>
            </div>
            <div className="relative">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={injuryTypeData}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={80}
                    paddingAngle={3} dataKey="value"
                    strokeWidth={0}
                  >
                    {injuryTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <DonutCenter total={total} />
            </div>
            <div className="space-y-1.5 mt-2">
              {injuryTypeData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-slate-600 flex-1">{d.name}</span>
                  <span className="text-xs font-bold text-slate-700">{d.value}</span>
                  <span className="text-xs text-slate-400 w-8 text-right">{Math.round((d.value / total) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts row 2: Horizontal bar + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Shift bar */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">By shift</p>
              <h3 className="text-base font-bold text-slate-800">Day shift accounts for 44%</h3>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={shiftData} layout="vertical" margin={{ left: 0, right: 30, top: 4, bottom: 4 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="shift" tick={{ fontSize: 13, fill: "#475569", fontWeight: 600 }} axisLine={false} tickLine={false} width={52} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="incidents" fill={NAVY} radius={[0, 8, 8, 0]} barSize={22}>
                  <LabelList dataKey="incidents" position="right" style={{ fontSize: 12, fontWeight: 700, fill: "#0f172a" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Trend alerts */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">AI-detected trends</p>
              <h3 className="text-base font-bold text-slate-800">3 items require your attention</h3>
            </div>
            <div className="space-y-3">
              {[
                {
                  Icon: TrendingUp,
                  bg: "bg-rose-50", border: "border-rose-100", iconColor: "text-rose-500",
                  title: "Musculoskeletal injuries up 35% this quarter",
                  body: "14 of 40 incidents are muscle/back-related. Day shift CNAs are most affected. Consider scheduling a lift safety refresher.",
                },
                {
                  Icon: Clock,
                  bg: "bg-amber-50", border: "border-amber-100", iconColor: "text-amber-500",
                  title: "Peak incident window: 06:00 – 09:00 on Day shift",
                  body: "Morning care routines account for the highest risk period. Review staffing ratios at shift start.",
                },
                {
                  Icon: TrendingUp,
                  bg: "bg-teal-50", border: "border-teal-100", iconColor: "text-teal-600",
                  title: "Near-miss reporting up 20% vs. last quarter",
                  body: "Staff are engaging with the reporting system proactively — a strong safety culture signal worth acknowledging.",
                },
              ].map((a) => (
                <div key={a.title} className={`flex gap-3 p-4 ${a.bg} border ${a.border} rounded-xl`}>
                  <a.Icon size={16} aria-hidden="true" className={`${a.iconColor} mt-0.5 shrink-0`} />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{a.title}</p>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{a.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row: Recent cases + Activity feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent cases */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-0.5">Recent cases</p>
                <h3 className="text-base font-bold text-slate-800">Latest incident reports</h3>
              </div>
              <Link to="/admin/cases" className="text-xs font-semibold text-blue-600 hover:underline">View all →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50">
                    {["Case #", "Employee", "Injury Type", "Date", "Review", "Case"].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((c) => (
                    <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3.5">
                        <Link to={`/admin/cases/${c.id}`} className="font-semibold hover:underline" style={{ color: NAVY }}>{c.id}</Link>
                      </td>
                      <td className="px-6 py-3.5 font-medium text-slate-700">{c.employeeName}</td>
                      <td className="px-6 py-3.5 text-slate-500">{c.injuryType}</td>
                      <td className="px-6 py-3.5 text-slate-400 tabular-nums">{c.incidentDate}</td>
                      <td className="px-6 py-3.5"><StatusBadge status={c.reviewStatus} /></td>
                      <td className="px-6 py-3.5"><StatusBadge status={c.caseStatus} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Global activity feed */}
          <ActivityFeed cases={cases} />
        </div>

      </div>
      <AISafetyAssistant />
    </div>
  );
}
