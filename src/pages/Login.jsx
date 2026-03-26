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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-slate-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center mb-4 shadow-md">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-800">SafeReport</h1>
          <p className="text-slate-500 text-sm mt-1">Nursing Home Incident Reporting System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-1">Welcome back</h2>
          <p className="text-sm text-slate-500 mb-6">Sign in to access your account</p>

          <div className="space-y-3 mb-6">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Username</label>
              <input
                type="text"
                defaultValue="demo@safereport.org"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-slate-50"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Password</label>
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-slate-50"
              />
            </div>
          </div>

          {/* Demo role selector */}
          <p className="text-xs text-slate-400 text-center mb-3">Demo: select a role to sign in</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleLogin("staff")}
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-3 text-sm font-medium transition-colors shadow-sm"
            >
              Sign in as Staff
            </button>
            <button
              onClick={() => handleLogin("admin")}
              className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl py-3 text-sm font-medium transition-colors shadow-sm"
            >
              Sign in as Admin
            </button>
          </div>
        </div>

        {/* Info strip */}
        <div className="mt-6 bg-teal-50 border border-teal-100 rounded-xl p-4 text-center">
          <p className="text-xs text-teal-700">
            All reports are confidential and reviewed by your facility administrator.
            Reporting is encouraged and non-punitive.
          </p>
        </div>
      </div>
    </div>
  );
}
