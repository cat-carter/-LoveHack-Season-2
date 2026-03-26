import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { injuryTypeData, incidentsOverTime, shiftData } from "../data/mockData";

export default function TrendNarrative() {
  const { cases } = useApp();
  const [narrative, setNarrative] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        setError("Unable to load AI summary.");
      } finally {
        setLoading(false);
      }
    }
    fetchNarrative();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs">✦</div>
        <h2 className="text-sm font-semibold text-slate-700">AI Weekly Safety Briefing</h2>
        <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Claude</span>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <div className="w-4 h-4 border-2 border-teal-300 border-t-teal-600 rounded-full animate-spin" />
          Generating briefing…
        </div>
      )}

      {error && (
        <p className="text-sm text-rose-500">{error}</p>
      )}

      {!loading && !error && (
        <p className="text-sm text-slate-700 leading-relaxed">{narrative}</p>
      )}
    </div>
  );
}
