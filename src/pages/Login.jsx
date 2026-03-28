import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Logo from "../components/Logo";

const NAVY = "#0f2d52";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(role) {
    login(role);
    navigate(role === "admin" ? "/admin" : "/portal");
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div style={{ background: NAVY }} className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <Logo size={36} shieldColor="white" signalColor={NAVY} />
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

        <p className="text-blue-400 text-xs">Sunrise Nursing &amp; Rehabilitation · Powered by IncidentIQ</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 bg-slate-50">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <Logo size={32} shieldColor={NAVY} signalColor="white" />
            <span style={{ color: NAVY }} className="text-xl font-bold">IncidentIQ</span>
          </div>

          {/* Facility tag */}
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Sunrise Nursing &amp; Rehabilitation</p>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Sign in</h2>
          <p className="text-sm text-slate-500 mb-8">Use your facility credentials to continue</p>

          {/* Form */}
          <div className="space-y-4 mb-2">
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@sunrisenursing.org"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Password</label>
                <button type="button" className="text-xs text-teal-600 hover:text-teal-800 font-medium transition-colors">
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
              />
            </div>
          </div>

          <button
            type="button"
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white mt-4 mb-6 shadow-sm hover:opacity-90 transition-opacity"
            style={{ background: NAVY }}
          >
            Sign In
          </button>

          {/* Demo access divider */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-50 px-3 text-xs text-slate-400 font-medium">Demo access</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleLogin("staff")}
              className="py-3 rounded-xl text-sm font-semibold border-2 transition-colors hover:bg-slate-100"
              style={{ borderColor: NAVY, color: NAVY }}
            >
              Frontline Staff
            </button>
            <button
              onClick={() => handleLogin("admin")}
              className="py-3 rounded-xl text-sm font-semibold border-2 transition-colors hover:bg-slate-100"
              style={{ borderColor: NAVY, color: NAVY }}
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
