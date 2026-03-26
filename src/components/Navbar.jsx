import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Logo from "./Logo";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function Navbar() {
  const { user, logout, cases } = useApp();
  const navigate = useNavigate();
  const [panelOpen, setPanelOpen] = useState(false);
  const [dismissed, setDismissed] = useState(new Set());
  const bellRef = useRef(null);

  function dismissOne(id, e) {
    e.preventDefault();
    e.stopPropagation();
    setDismissed((prev) => new Set([...prev, id]));
  }

  function dismissAll() {
    setDismissed(new Set(notifications.map((n) => n.id)));
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  const isAdmin = user?.role === "admin";

  // Build notification items
  const notifications = isAdmin
    ? cases
        .filter((c) => c.reviewStatus === "Pending")
        .map((c) => ({
          id: c.id,
          icon: "📋",
          title: "Awaiting review",
          detail: `${c.id} · ${c.injuryType} · ${c.employeeName}`,
          time: c.submittedAt,
          href: `/admin/cases/${c.id}`,
        }))
    : cases
        .filter(
          (c) =>
            (c.submittedBy === user?.name || c.employeeName === user?.name) &&
            c.reviewer !== null
        )
        .map((c) => ({
          id: c.id,
          icon: c.reviewStatus === "Reviewed" ? "✅" : "👤",
          title:
            c.reviewStatus === "Reviewed"
              ? "Your report was reviewed"
              : `Assigned to ${c.reviewer}`,
          detail: `${c.id} · ${c.injuryType}`,
          time: c.submittedAt,
          href: `/portal/cases/${c.id}`,
        }));

  const visibleNotifications = notifications.filter((n) => !dismissed.has(n.id));
  const badgeCount = visibleNotifications.length;

  // Close panel on outside click
  useEffect(() => {
    function handleClick(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setPanelOpen(false);
      }
    }
    if (panelOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [panelOpen]);

  return (
    <nav style={{ background: "#0f2d52" }} className="px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md print:hidden">
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

          {/* Notification bell + panel */}
          <div ref={bellRef} className="relative">
            <button
              onClick={() => setPanelOpen((o) => !o)}
              className="relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-blue-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {badgeCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                  {badgeCount > 99 ? "99+" : badgeCount}
                </span>
              )}
            </button>

            {/* Dropdown panel */}
            {panelOpen && (
              <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                {/* Panel header */}
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
                  {visibleNotifications.length > 0 && (
                    <button
                      onClick={dismissAll}
                      className="text-xs text-slate-400 hover:text-slate-700 font-medium transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Notification list */}
                {visibleNotifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-2xl mb-2">🔔</p>
                    <p className="text-sm text-slate-500">You're all caught up!</p>
                    <p className="text-xs text-slate-400 mt-1">No pending notifications.</p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                    {visibleNotifications.map((n) => (
                      <div key={n.id} className="flex items-start group hover:bg-slate-50 transition-colors">
                        <Link
                          to={n.href}
                          onClick={() => setPanelOpen(false)}
                          className="flex items-start gap-3 px-4 py-3 flex-1 min-w-0"
                        >
                          <span className="text-base mt-0.5 shrink-0">{n.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 leading-snug">{n.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5 truncate">{n.detail}</p>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0 mt-1 mr-1">{timeAgo(n.time)}</span>
                        </Link>
                        <button
                          onClick={(e) => dismissOne(n.id, e)}
                          className="shrink-0 px-2 py-3 text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all"
                          title="Dismiss"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="border-t border-slate-100 px-4 py-2.5">
                  <Link
                    to={isAdmin ? "/admin/cases" : "/portal"}
                    onClick={() => setPanelOpen(false)}
                    className="text-xs font-medium text-teal-600 hover:text-teal-800 transition-colors"
                  >
                    View all cases →
                  </Link>
                </div>
              </div>
            )}
          </div>

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
