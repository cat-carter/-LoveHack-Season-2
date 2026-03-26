import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Logo from "./Logo";

export default function Navbar() {
  const { user, logout, cases } = useApp();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const isAdmin = user?.role === "admin";

  // Badge count — admin: unreviewed pending cases; staff: cases with updates (assigned or reviewed)
  const badgeCount = isAdmin
    ? cases.filter((c) => c.reviewStatus === "Pending").length
    : cases.filter(
        (c) =>
          (c.submittedBy === user?.name || c.employeeName === user?.name) &&
          c.reviewer !== null
      ).length;

  return (
    <nav style={{ background: "#0f2d52" }} className="px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
      <Link
        to={user ? (user.role === "admin" ? "/admin" : "/portal") : "/"}
        className="flex items-center gap-2.5 group"
      >
        <Logo size={28} shieldColor="white" signalColor="#0f2d52" />
        <span className="text-white font-bold text-lg tracking-tight group-hover:opacity-80 transition-opacity">IncidentIQ</span>
      </Link>

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

          {/* Notification bell */}
          <Link
            to={isAdmin ? "/admin/cases" : "/portal"}
            className="relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-blue-700 transition-colors"
            title={isAdmin ? `${badgeCount} pending review` : `${badgeCount} case update${badgeCount !== 1 ? "s" : ""}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {badgeCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                {badgeCount > 99 ? "99+" : badgeCount}
              </span>
            )}
          </Link>

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
