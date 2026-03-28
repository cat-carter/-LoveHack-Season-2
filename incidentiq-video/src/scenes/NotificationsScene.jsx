import { useCurrentFrame, interpolate } from "remotion";

const NAVY = "#0f2d52";
const TEAL = "#0d9488";

function fade(frame, start, dur = 18) {
  return interpolate(frame - start, [0, dur], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
}

function slideUp(frame, start, dur = 18) {
  return interpolate(frame - start, [0, dur], [20, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
}

export function NotificationsScene() {
  const frame = useCurrentFrame();

  // Timeline:
  // 0-30: page loads
  // 30-90: cursor moves to "Send Update" button (abs 2940)
  // 90-120: cursor clicks send (abs 2970)
  // 120+: sending spinner → confirmation banner

  const isSending = frame > 90 && frame < 135;
  const isSent = frame > 135;

  // Previous notifications
  const notifHistory = [
    { date: "Mar 22 · 9:05 AM", msg: "Case assigned to Dr. Patricia Chen for review" },
    { date: "Mar 21 · 2:30 PM", msg: "OSHA 301 form drafted and filed" },
    { date: "Mar 20 · 4:00 PM", msg: "Initial case review completed" },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, background: "#f8fafc", display: "flex", flexDirection: "column" }}>
      {/* Top nav */}
      <div style={{
        background: NAVY, height: 64, display: "flex", alignItems: "center",
        padding: "0 40px", gap: 14, flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
        }}>🛡️</div>
        <span style={{ color: "white", fontSize: 22, fontWeight: 800 }}>IncidentIQ</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Case IQ-2024-008</span>
        <span style={{ color: "rgba(255,255,255,0.3)" }}> / </span>
        <span style={{ color: "white", fontSize: 14, fontWeight: 600 }}>Notifications</span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", justifyContent: "center", padding: "40px 40px" }}>
        <div style={{ width: 780 }}>

          {/* Page header */}
          <div style={{ marginBottom: 32, opacity: fade(frame, 0) }}>
            <p style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, marginBottom: 6 }}>Case IQ-2024-008</p>
            <h1 style={{ color: "#1e293b", fontSize: 28, fontWeight: 900, marginBottom: 4 }}>Employee Notifications</h1>
            <p style={{ color: "#94a3b8", fontSize: 15 }}>Keep Maria Santos informed of case progress</p>
          </div>

          {/* Employee card */}
          <div style={{
            background: "white", borderRadius: 18, border: "1.5px solid #e2e8f0",
            padding: "20px 24px", marginBottom: 24,
            display: "flex", alignItems: "center", gap: 16,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            opacity: fade(frame, 8),
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              background: TEAL, color: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 800, flexShrink: 0,
            }}>MS</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: "#1e293b", fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Maria Santos</p>
              <p style={{ color: "#94a3b8", fontSize: 13 }}>
                📧 m.santos@sunrisenursing.org
              </p>
            </div>
            <div style={{
              background: "#dcfce7", color: "#16a34a",
              fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 999,
            }}>
              ● Email configured
            </div>
          </div>

          {/* Compose notification */}
          <div style={{
            background: "white", borderRadius: 18, border: "1.5px solid #e2e8f0",
            padding: "28px 32px", marginBottom: 24,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            opacity: fade(frame, 16),
          }}>
            <p style={{ color: "#475569", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 18 }}>
              Send Case Update
            </p>

            <div style={{
              background: "#f8fafc", border: "1.5px solid #e2e8f0",
              borderRadius: 12, padding: "16px 18px", marginBottom: 18,
              fontSize: 15, color: "#334155", lineHeight: 1.6,
            }}>
              Your case (IQ-2024-008) has been reviewed by Dr. Patricia Chen.
              An OSHA 301 form has been filed on your behalf. Workers' compensation paperwork
              has been initiated. Please contact HR if you have any questions.
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {/* Send Update button */}
              <div style={{
                background: isSent ? "#dcfce7" : isSending ? `${NAVY}cc` : NAVY,
                color: isSent ? "#16a34a" : "white",
                borderRadius: 12, padding: "12px 28px",
                fontSize: 15, fontWeight: 700,
                display: "flex", alignItems: "center", gap: 10,
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: isSent ? "0 2px 8px rgba(22,163,74,0.3)" : "0 2px 8px rgba(15,45,82,0.2)",
              }}>
                {isSending ? (
                  <>
                    <div style={{
                      width: 16, height: 16, borderRadius: "50%",
                      border: "2.5px solid rgba(255,255,255,0.3)",
                      borderTop: "2.5px solid white",
                    }} />
                    Sending…
                  </>
                ) : isSent ? (
                  <>✓ Email Sent</>
                ) : (
                  <>📧 Send Update</>
                )}
              </div>
            </div>
          </div>

          {/* Confirmation banner */}
          {isSent && (
            <div style={{
              background: "#f0fdf4", border: "1.5px solid #86efac",
              borderRadius: 14, padding: "16px 22px", marginBottom: 24,
              display: "flex", alignItems: "center", gap: 14,
              opacity: fade(frame, 135),
              transform: `translateY(${slideUp(frame, 135)}px)`,
            }}>
              <span style={{ fontSize: 24 }}>✅</span>
              <div>
                <p style={{ color: "#15803d", fontSize: 15, fontWeight: 700, marginBottom: 2 }}>
                  Email sent to m.santos@sunrisenursing.org
                </p>
                <p style={{ color: "#4ade80", fontSize: 13 }}>
                  Delivered · Mar 28, 2026 · 3:42 PM
                </p>
              </div>
            </div>
          )}

          {/* Notification history */}
          <div style={{
            background: "white", borderRadius: 18, border: "1.5px solid #e2e8f0",
            padding: "24px 28px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            opacity: fade(frame, 24),
          }}>
            <p style={{ color: "#475569", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>
              Notification History
            </p>
            {(isSent
              ? [{ date: "Mar 28 · 3:42 PM", msg: "Email notification sent to m.santos@sunrisenursing.org", new: true }, ...notifHistory]
              : notifHistory
            ).map(({ date, msg, new: isNew }, i) => (
              <div key={i} style={{
                display: "flex", gap: 14, alignItems: "flex-start",
                padding: "12px 0", borderBottom: i < notifHistory.length - (isSent ? 0 : 1) ? "1px solid #f1f5f9" : "none",
                opacity: isNew ? fade(frame, 140 + i * 10) : 1,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                  background: isNew ? "#dcfce7" : "#f1f5f9",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14,
                }}>
                  {isNew ? "✉" : "•"}
                </div>
                <div>
                  <p style={{ color: "#1e293b", fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{msg}</p>
                  <p style={{ color: "#94a3b8", fontSize: 12 }}>{date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
