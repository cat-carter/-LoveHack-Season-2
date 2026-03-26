import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { injuryTypeData, incidentsOverTime, shiftData } from "../data/mockData";

const NAVY = "#0f2d52";

export default function TrendNarrative() {
  const { cases } = useApp();
  const [narrative, setNarrative] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Live metrics for the stat strip
  const openCases = cases.filter((c) => c.caseStatus === "Open").length;
  const pendingReview = cases.filter((c) => c.reviewStatus === "Pending").length;
  const last = incidentsOverTime[incidentsOverTime.length - 1]?.incidents ?? 0;
  const prev = incidentsOverTime[incidentsOverTime.length - 2]?.incidents ?? 0;
  const momPct = prev ? Math.round(((last - prev) / prev) * 100) : 0;
  const topInjury = [...injuryTypeData].sort((a, b) => b.value - a.value)[0];

  useEffect(() => {
    async function fetchNarrative() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/trend-narrative", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cases, injuryTypeData, incidentsOverTime, shiftData }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setNarrative(data.narrative);
      } catch {
        setError("Unable to load AI briefing. Check that the server is running.");
      } finally {
        setLoading(false);
      }
    }
    fetchNarrative();
  }, []);

  // Split into lede sentence + body for visual hierarchy
  const sentences = narrative.match(/[^.!?]+[.!?]+/g) ?? [];
  const lede = sentences[0] ?? "";
  const body = sentences.slice(1).join(" ").trim();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">

      {/* ── Header bar ─────────────────────────────────────────────────────── */}
      <div
        className="px-6 py-4 flex items-center justify-between gap-4"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a4a7a 100%)` }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            <span className="text-white text-base leading-none">✦</span>
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm tracking-tight">AI Safety Brief</p>
            <p className="text-blue-200 text-xs truncate">{today} · Sunrise Nursing & Rehabilitation</p>
          </div>
        </div>
        <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border border-white/25 bg-white/10 text-white/90">
          Claude
        </span>
      </div>

      {/* ── Metric strip ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50 border-b border-slate-100">
        {[
          { label: "Open cases", value: openCases, color: "#f59e0b" },
          { label: "Pending review", value: pendingReview, color: "#e11d48" },
          {
            label: "vs last month",
            value: `${momPct > 0 ? "+" : ""}${momPct}%`,
            color: momPct > 0 ? "#e11d48" : "#0d9488",
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="px-4 py-3 text-center">
            <p className="text-xl font-black leading-none" style={{ color }}>{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Top insight chip ──────────────────────────────────────────────── */}
      <div className="bg-white px-6 pt-5 pb-1">
        <div
          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
          style={{ background: "#e8f0f9", color: NAVY }}
        >
          <span>⚑</span>
          Top injury type this quarter: <strong>{topInjury?.name}</strong> ({topInjury?.value} cases)
        </div>
      </div>

      {/* ── Narrative body ─────────────────────────────────────────────────── */}
      <div className="bg-white px-6 pb-6">
        {loading && (
          <div className="space-y-2.5">
            <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-full" />
            <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-11/12" />
            <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-4/5" />
            <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-3/5" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
            <span>⚠</span> {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-2">
            {lede && (
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">{lede}</p>
            )}
            {body && (
              <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
            )}
          </div>
        )}
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div className="bg-slate-50 border-t border-slate-100 px-6 py-2.5 flex items-center justify-between">
        <p className="text-xs text-slate-400">Generated by Claude · For informational use only</p>
        <p className="text-xs text-slate-400">Refreshes on page load</p>
      </div>
    </div>
  );
}
