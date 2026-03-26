import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const isAdmin = user?.role === "admin";

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
          <span className="text-white text-sm font-bold">S</span>
        </div>
        <span className="font-semibold text-slate-800 text-lg">SafeReport</span>
      </div>

      {user && (
        <div className="flex items-center gap-6">
          {isAdmin ? (
            <>
              <Link to="/admin" className="text-sm text-slate-600 hover:text-teal-700 font-medium">Dashboard</Link>
              <Link to="/admin/cases" className="text-sm text-slate-600 hover:text-teal-700 font-medium">Cases</Link>
            </>
          ) : (
            <>
              <Link to="/portal" className="text-sm text-slate-600 hover:text-teal-700 font-medium">My Reports</Link>
              <Link to="/portal/report/new" className="text-sm text-slate-600 hover:text-teal-700 font-medium">New Report</Link>
            </>
          )}

          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-semibold text-sm">
              {user.name.charAt(0)}
            </div>
            <span className="text-sm text-slate-700 hidden sm:block">{user.name}</span>
            <button
              onClick={handleLogout}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
