import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();

  function handleLogin(role) {
    login(role);
    navigate(role === "admin" ? "/admin" : "/portal");
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div style={{ background: "#0f2d52" }} className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
            <span style={{ color: "#0f2d52" }} className="text-base font-black tracking-tight">IQ</span>
          </div>
          <span className="text-white text-xl font-bold tracking-tight">IncidentIQ</span>
        </div>

        <div>
          <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-4">From incident to insight</p>
          <h1 className="text-4xl font-bold text-white leading-tight mb-6">
            Smarter safety reporting<br />for nursing homes
          </h1>
          <p className="text-blue-200 text-base leading-relaxed max-w-sm">
            Up to 96% of near-misses go unreported. IncidentIQ makes reporting fast, guided, and non-punitive — turning incident data into actionable intelligence.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { value: "96%", label: "of near-misses go unreported" },
              { value: "600×", label: "near-misses per serious injury" },
              { value: "2min", label: "average report time" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-blue-300 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-400 text-xs">Built for LovHack Season 2</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div style={{ background: "#0f2d52" }} className="w-9 h-9 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-black">IQ</span>
            </div>
            <span style={{ color: "#0f2d52" }} className="text-xl font-bold">IncidentIQ</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-1">Sign in</h2>
          <p className="text-sm text-slate-500 mb-8">Access your facility's safety dashboard</p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Username</label>
              <input
                type="text"
                defaultValue="demo@incidentiq.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 bg-white"
                style={{ "--tw-ring-color": "#0f2d52" }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Password</label>
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 bg-white"
              />
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center mb-3">Select a role to demo</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleLogin("staff")}
              className="py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shadow-sm"
              style={{ background: "#0f2d52" }}
            >
              Frontline Staff
            </button>
            <button
              onClick={() => handleLogin("admin")}
              className="py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 border-2 shadow-sm"
              style={{ borderColor: "#0f2d52", color: "#0f2d52", background: "white" }}
            >
              Administrator
            </button>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs text-blue-700 text-center">
              All reports are confidential. This facility maintains a <strong>non-punitive</strong> reporting culture.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
