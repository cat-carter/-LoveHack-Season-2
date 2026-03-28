import { useCurrentFrame, interpolate } from "remotion";

const NAVY = "#0f2d52";
const TEAL = "#0d9488";

function fadeIn(frame, start, duration = 20) {
  return interpolate(frame - start, [0, duration], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
}

function slideUp(frame, start, duration = 20) {
  return interpolate(frame - start, [0, duration], [24, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
}

export function StaffPortalScene() {
  const frame = useCurrentFrame();

  // cursor hovers "New Incident Report" at frame ~70 local (absolute 460)
  const isHoveringNew = frame > 60 && frame < 110;

  return (
    <div style={{ position: "absolute", inset: 0, background: "#f8fafc", display: "flex", flexDirection: "column" }}>
      {/* Top nav */}
      <div style={{
        background: NAVY, height: 64, display: "flex", alignItems: "center",
        padding: "0 40px", gap: 14, flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>🛡️</div>
        <span style={{ color: "white", fontSize: 22, fontWeight: 800 }}>IncidentIQ</span>
        <div style={{ flex: 1 }} />
        <div style={{
          background: "rgba(255,255,255,0.12)", borderRadius: 20,
          padding: "6px 16px", color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 600,
        }}>
          Staff Portal
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: TEAL,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontSize: 14, fontWeight: 800,
        }}>MS</div>
      </div>

      {/* Body */}
      <div style={{
        flex: 1, display: "flex", justifyContent: "center",
        padding: "48px 40px", overflowY: "hidden",
      }}>
        <div style={{ width: 680 }}>

          {/* Welcome header */}
          <div style={{
            marginBottom: 36,
            opacity: fadeIn(frame, 0),
            transform: `translateY(${slideUp(frame, 0)}px)`,
          }}>
            <p style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, marginBottom: 6 }}>
              Staff Portal
            </p>
            <h1 style={{ color: "#1e293b", fontSize: 30, fontWeight: 900, marginBottom: 4 }}>
              Welcome back, Maria
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 15 }}>
              Certified Nursing Assistant · Sunrise Nursing &amp; Rehabilitation
            </p>
          </div>

          {/* Stats row */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 28,
            opacity: fadeIn(frame, 12),
            transform: `translateY(${slideUp(frame, 12)}px)`,
          }}>
            {[
              { val: "3", label: "Total reports ↗", color: NAVY },
              { val: "1", label: "Open cases ↗", color: "#f59e0b" },
              { val: "0", label: "Saved drafts ↗", color: "#64748b" },
            ].map(({ val, label, color }) => (
              <div key={label} style={{
                background: "white", borderRadius: 14, border: "1.5px solid #e2e8f0",
                padding: "16px", textAlign: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}>
                <p style={{ color, fontSize: 28, fontWeight: 900, marginBottom: 4 }}>{val}</p>
                <p style={{ color: "#94a3b8", fontSize: 13 }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28,
            opacity: fadeIn(frame, 24),
            transform: `translateY(${slideUp(frame, 24)}px)`,
          }}>
            {/* New Incident Report — highlights on hover */}
            <div style={{
              background: isHoveringNew ? "#1a4170" : NAVY,
              borderRadius: 20, padding: "24px 22px",
              display: "flex", flexDirection: "column", gap: 10,
              boxShadow: isHoveringNew ? `0 8px 32px rgba(15,45,82,0.35)` : "0 2px 8px rgba(15,45,82,0.15)",
              transform: isHoveringNew ? "scale(1.01)" : "scale(1)",
              transition: "all 0.15s",
              cursor: "pointer",
            }}>
              <span style={{ fontSize: 24 }}>📋</span>
              <div>
                <p style={{ color: "white", fontWeight: 800, fontSize: 16 }}>New Incident Report</p>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 700, fontSize: 12 }}>+</p>
              </div>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>Report a workplace injury or illness</p>
            </div>

            {/* Near Miss */}
            <div style={{
              background: "white", borderRadius: 20, padding: "24px 22px",
              border: "1.5px solid #e2e8f0",
              display: "flex", flexDirection: "column", gap: 10,
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}>
              <span style={{ fontSize: 24 }}>⚠️</span>
              <div>
                <p style={{ color: "#1e293b", fontWeight: 800, fontSize: 16 }}>Near Miss Report</p>
              </div>
              <p style={{ color: "#94a3b8", fontSize: 13 }}>Report a close call or unsafe condition</p>
            </div>
          </div>

          {/* Recent activity */}
          <div style={{
            background: "white", borderRadius: 20, border: "1.5px solid #e2e8f0",
            padding: "24px 28px",
            opacity: fadeIn(frame, 36),
            transform: `translateY(${slideUp(frame, 36)}px)`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <p style={{ color: "#475569", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 18 }}>
              Recent Reports
            </p>
            {[
              { id: "IQ-2024-001", type: "Musculoskeletal Injury", date: "Mar 15, 2026", status: "Under Review", color: "#f59e0b" },
              { id: "IQ-2024-002", type: "Slip and Fall", date: "Feb 28, 2026", status: "Closed", color: "#10b981" },
              { id: "IQ-2024-003", type: "Near Miss", date: "Feb 10, 2026", status: "Closed", color: "#10b981" },
            ].map((r, i) => (
              <div key={r.id} style={{
                display: "flex", alignItems: "center",
                padding: "12px 0",
                borderBottom: i < 2 ? "1px solid #f1f5f9" : "none",
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#1e293b", fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{r.type}</p>
                  <p style={{ color: "#94a3b8", fontSize: 13 }}>{r.id} · {r.date}</p>
                </div>
                <span style={{
                  background: `${r.color}18`, color: r.color,
                  fontSize: 12, fontWeight: 700,
                  padding: "4px 12px", borderRadius: 999,
                }}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>

          {/* Non-punitive footer */}
          <div style={{
            marginTop: 20,
            background: "#eff6ff", border: "1px solid #dbeafe", borderRadius: 14,
            padding: "14px 20px", textAlign: "center",
            opacity: fadeIn(frame, 48),
          }}>
            <p style={{ color: "#1d4ed8", fontSize: 14 }}>
              All reports are <strong>confidential</strong>. This facility maintains a <strong>non-punitive</strong> reporting culture.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
