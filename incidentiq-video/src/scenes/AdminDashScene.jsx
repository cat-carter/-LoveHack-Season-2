import { useCurrentFrame, interpolate } from "remotion";

const NAVY = "#0f2d52";
const TEAL = "#0d9488";

function fade(frame, start, dur = 20) {
  return interpolate(frame - start, [0, dur], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
}

const CASES = [
  { id: "IQ-2024-008", name: "Maria Santos", type: "Musculoskeletal Injury", dept: "East Wing", severity: "High", status: "Open", date: "Mar 20", osha: "Yes" },
  { id: "IQ-2024-007", name: "James Okonkwo", type: "Slip and Fall", dept: "West Wing", severity: "Medium", status: "Under Review", date: "Mar 18", osha: "No" },
  { id: "IQ-2024-006", name: "Rosa Delgado", type: "Medication Error", dept: "ICU", severity: "High", status: "Pending OSHA", date: "Mar 15", osha: "Yes" },
  { id: "IQ-2024-005", name: "Tom Whitfield", type: "Near Miss", dept: "Rehab", severity: "Low", status: "Closed", date: "Mar 12", osha: "No" },
  { id: "IQ-2024-004", name: "Priya Patel", type: "Needle Stick", dept: "East Wing", severity: "Medium", status: "Closed", date: "Mar 8", osha: "Yes" },
];

const SEV_COLORS = {
  High: { bg: "#fee2e2", text: "#dc2626" },
  Medium: { bg: "#fef9c3", text: "#ca8a04" },
  Low: { bg: "#dcfce7", text: "#16a34a" },
};

const STATUS_COLORS = {
  "Open": { bg: "#fee2e2", text: "#dc2626" },
  "Under Review": { bg: "#fef9c3", text: "#ca8a04" },
  "Pending OSHA": { bg: "#fde8d0", text: "#ea580c" },
  "Closed": { bg: "#dcfce7", text: "#16a34a" },
};

export function AdminDashScene() {
  const frame = useCurrentFrame();

  // Cursor hovers row 0 at local ~100 (absolute 1600), clicks at ~140 (absolute 1640)
  const hoveredRow = frame > 95 ? 0 : -1;

  return (
    <div style={{ position: "absolute", inset: 0, background: "#f8fafc", display: "flex" }}>
      {/* Sidebar */}
      <div style={{
        width: 220, background: NAVY, display: "flex", flexDirection: "column",
        padding: "0 0 24px 0", flexShrink: 0,
      }}>
        <div style={{ padding: "22px 20px 28px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>🛡️</div>
            <span style={{ color: "white", fontSize: 18, fontWeight: 800 }}>IncidentIQ</span>
          </div>
        </div>

        <nav style={{ padding: "20px 12px", flex: 1 }}>
          {[
            { icon: "📊", label: "Dashboard", active: true },
            { icon: "📋", label: "All Cases", active: false },
            { icon: "📝", label: "OSHA 300 Log", active: false },
            { icon: "📈", label: "Analytics", active: false },
            { icon: "⚙️", label: "Settings", active: false },
          ].map(({ icon, label, active }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 10, marginBottom: 2,
              background: active ? "rgba(255,255,255,0.12)" : "transparent",
              color: active ? "white" : "rgba(255,255,255,0.6)",
              fontSize: 14, fontWeight: active ? 700 : 400,
            }}>
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </nav>

        <div style={{ padding: "0 12px" }}>
          <div style={{
            background: `${TEAL}22`, borderRadius: 12, padding: "12px 14px",
            border: `1px solid ${TEAL}44`,
          }}>
            <p style={{ color: "#5eead4", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Admin</p>
            <p style={{ color: "white", fontSize: 14, fontWeight: 700 }}>Director Chen</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Sunrise N&amp;R</p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "hidden", padding: "36px 40px" }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          marginBottom: 28, opacity: fade(frame, 0),
        }}>
          <div>
            <p style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, marginBottom: 6 }}>Admin Dashboard</p>
            <h1 style={{ color: "#1e293b", fontSize: 28, fontWeight: 900 }}>Incident Overview</h1>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: `${TEAL}15`, border: `1px solid ${TEAL}44`,
            borderRadius: 12, padding: "8px 16px",
            color: TEAL, fontSize: 13, fontWeight: 700,
          }}>
            🤖 AI Triage Active
          </div>
        </div>

        {/* Summary cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28,
          opacity: fade(frame, 10),
        }}>
          {[
            { label: "Total Cases", val: "8", sub: "This month", color: NAVY },
            { label: "Open / Active", val: "3", sub: "Need attention", color: "#dc2626" },
            { label: "OSHA Recordable", val: "3", sub: "Forms pending", color: "#ea580c" },
            { label: "Avg. Close Time", val: "4.2d", sub: "↓ improving", color: "#16a34a" },
          ].map(({ label, val, sub, color }) => (
            <div key={label} style={{
              background: "white", borderRadius: 16, padding: "20px 22px",
              border: "1.5px solid #e2e8f0",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>{label}</p>
              <p style={{ color, fontSize: 30, fontWeight: 900, marginBottom: 4 }}>{val}</p>
              <p style={{ color: "#94a3b8", fontSize: 13 }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Case table */}
        <div style={{
          background: "white", borderRadius: 18, border: "1.5px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
          opacity: fade(frame, 18),
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "140px 1fr 160px 100px 150px 90px 70px",
            padding: "14px 24px",
            background: "#f8fafc",
            borderBottom: "1.5px solid #e2e8f0",
          }}>
            {["Case ID", "Employee / Type", "Department", "Severity", "Status", "Date", "OSHA"].map(h => (
              <span key={h} style={{ color: "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>{h}</span>
            ))}
          </div>

          {CASES.map((c, i) => {
            const isHovered = hoveredRow === i;
            const sev = SEV_COLORS[c.severity];
            const st = STATUS_COLORS[c.status];
            return (
              <div key={c.id} style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr 160px 100px 150px 90px 70px",
                padding: "14px 24px",
                alignItems: "center",
                background: isHovered ? "#f0f9ff" : "white",
                borderBottom: i < CASES.length - 1 ? "1px solid #f1f5f9" : "none",
                cursor: "pointer",
              }}>
                <span style={{ color: NAVY, fontSize: 13, fontWeight: 700 }}>{c.id}</span>
                <div>
                  <p style={{ color: "#1e293b", fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{c.name}</p>
                  <p style={{ color: "#94a3b8", fontSize: 12 }}>{c.type}</p>
                </div>
                <span style={{ color: "#475569", fontSize: 14 }}>{c.dept}</span>
                <span style={{
                  background: sev.bg, color: sev.text,
                  fontSize: 12, fontWeight: 700,
                  padding: "4px 10px", borderRadius: 999,
                  display: "inline-block", whiteSpace: "nowrap",
                }}>
                  {c.severity}
                </span>
                <span style={{
                  background: st.bg, color: st.text,
                  fontSize: 12, fontWeight: 700,
                  padding: "4px 10px", borderRadius: 999,
                  display: "inline-block", whiteSpace: "nowrap",
                }}>
                  {c.status}
                </span>
                <span style={{ color: "#475569", fontSize: 13 }}>{c.date}</span>
                <span style={{
                  color: c.osha === "Yes" ? "#ea580c" : "#94a3b8",
                  fontSize: 12, fontWeight: 700,
                }}>
                  {c.osha === "Yes" ? "⚠ Yes" : "No"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
