import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Logo from "./Logo";

export default function Navbar() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const isAdmin = user?.role === "admin";

  return (
    <nav style={{ background: "#0f2d52" }} className="px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2.5">
        <Logo size={28} shieldColor="white" signalColor="#0f2d52" />
        <span className="text-white font-bold text-lg tracking-tight">IncidentIQ</span>
      </div>

      {user && (
        <div className="flex items-center gap-5">
          {isAdmin ? (
            <>
              <Link to="/admin" className="text-sm text-blue-200 hover:text-white font-medium transition-colors">Dashboard</Link>
              <Link to="/admin/cases" className="text-sm text-blue-200 hover:text-white font-medium transition-colors">Cases</Link>
              <Link to="/admin/osha300" className="text-sm text-blue-200 hover:text-white font-medium transition-colors">OSHA 300</Link>
            </>
          ) : (
            <>
              <Link to="/portal" className="text-sm text-blue-200 hover:text-white font-medium transition-colors">My Reports</Link>
              <Link to="/portal/report/new" className="text-sm text-blue-200 hover:text-white font-medium transition-colors">New Report</Link>
            </>
          )}

          <div className="flex items-center gap-3 ml-1 pl-4 border-l border-blue-700">
            <Link to={isAdmin ? "/admin/profile" : "/portal/profile"} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-blue-400 bg-opacity-30 border border-blue-400 flex items-center justify-center text-white font-semibold text-sm group-hover:bg-opacity-50 transition-all">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm text-blue-100 hidden sm:block group-hover:text-white transition-colors">{user.name.split(" ")[0]}</span>
            </Link>
            <button onClick={handleLogout} className="text-xs text-blue-300 hover:text-white transition-colors">
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
