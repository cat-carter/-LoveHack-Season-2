import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { NAVY, TEAL, WHITE, AMBER, RED, useFadeUp } from "../shared.jsx";

function TriageRow({ icon, label, value, color, frame, startFrame }) {
  const elapsed = frame - startFrame;
  const opacity = interpolate(elapsed, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(elapsed, [0, 20], [-30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{
      opacity, transform: `translateX(${x}px)`,
      display: "flex", alignItems: "center", gap: 20,
      padding: "18px 0", borderBottom: "1px solid #f1f5f9",
    }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      <span style={{ color: "#64748b", fontSize: 20, fontWeight: 600, width: 220 }}>{label}</span>
      <span style={{
        background: `${color}22`, color, borderRadius: 8,
        padding: "6px 18px", fontSize: 20, fontWeight: 800,
      }}>{value}</span>
    </div>
  );
}

function ActionItem({ text, frame, startFrame, i }) {
  const elapsed = frame - startFrame - i * 15;
  const opacity = interpolate(elapsed, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(elapsed, [0, 20], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{
      opacity, transform: `translateX(${x}px)`,
      display: "flex", gap: 14, alignItems: "flex-start",
      marginBottom: 14,
    }}>
      <span style={{ color: TEAL, fontWeight: 800, fontSize: 20, marginTop: 2 }}>→</span>
      <span style={{ color: "#334155", fontSize: 20, lineHeight: 1.4 }}>{text}</span>
    </div>
  );
}

export function AITriageScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelStyle = useFadeUp(0, 0);
  const headStyle = useFadeUp(0, 10);

  // Processing animation: 0-60 frames show "analyzing..."
  const analyzingOpacity = interpolate(frame, [0, 10, 50, 70], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const resultsOpacity = interpolate(frame, [65, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const resultsY = interpolate(frame, [65, 90], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const showActions = frame > 250;

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: `linear-gradient(160deg, #0a1f38 0%, ${NAVY} 60%, #0f3d2e 100%)`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>
      {/* Label */}
      <div style={{ ...labelStyle, position: "absolute", top: 60, textAlign: "center" }}>
        <span style={{
          background: `${TEAL}33`, border: `2px solid ${TEAL}66`,
          color: "#5eead4", fontSize: 20, fontWeight: 700,
          padding: "8px 28px", borderRadius: 999,
          letterSpacing: 2, textTransform: "uppercase",
        }}>
          Powered by Claude · Anthropic
        </span>
      </div>

      {/* Analyzing pulse */}
      <div style={{
        position: "absolute",
        opacity: analyzingOpacity,
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 24,
      }}>
        {/* Spinner */}
        <div style={{
          width: 80, height: 80,
          border: `4px solid ${TEAL}44`,
          borderTop: `4px solid ${TEAL}`,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }} />
        <div style={{ color: WHITE, fontSize: 36, fontWeight: 700 }}>
          Claude is analyzing the report…
        </div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 22 }}>
          Severity · OSHA recordability · Recommended actions
        </div>
      </div>

      {/* Results card */}
      <div style={{
        opacity: resultsOpacity,
        transform: `translateY(${resultsY}px)`,
        display: "flex", gap: 36, alignItems: "flex-start",
        maxWidth: 1300,
      }}>
        {/* Left: triage panel */}
        <div style={{
          background: "#fff9f9",
          borderRadius: 24, padding: "40px 44px",
          width: 560, boxShadow: "0 8px 48px rgba(0,0,0,0.25)",
          border: "3px solid #fecaca",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <span style={{ fontSize: 28 }}>🤖</span>
            <span style={{ color: NAVY, fontSize: 28, fontWeight: 800 }}>AI Triage Analysis</span>
            <span style={{
              marginLeft: "auto", background: "#fee2e2", color: "#dc2626",
              fontSize: 16, fontWeight: 800, padding: "4px 14px", borderRadius: 999,
              textTransform: "uppercase", letterSpacing: 1,
            }}>
              ▲ HIGH
            </span>
          </div>

          <TriageRow icon="🚨" label="Severity" value="High" color="#dc2626" frame={frame} startFrame={90} />
          <TriageRow icon="📋" label="OSHA Recordable" value="Yes" color="#d97706" frame={frame} startFrame={110} />
          <TriageRow icon="🏥" label="Medical Eval" value="Required" color="#7c3aed" frame={frame} startFrame={130} />
          <TriageRow icon="📅" label="301 Due" value="7 days" color="#0d9488" frame={frame} startFrame={150} />

          {frame > 160 && (
            <div style={{
              marginTop: 24,
              opacity: interpolate(frame, [160, 185], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              background: "#f8fafc", borderRadius: 12, padding: "16px 20px",
              color: "#334155", fontSize: 18, lineHeight: 1.6,
            }}>
              <strong>Summary:</strong> Lumbar strain during unassisted patient transfer in East Wing. Inadequate lift equipment available at time of incident. OSHA 301 and workers' comp required.
            </div>
          )}
        </div>

        {/* Right: recommended actions */}
        {showActions && (
          <div style={{
            opacity: interpolate(frame, [250, 275], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            transform: `translateX(${interpolate(frame, [250, 275], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
            background: WHITE,
            borderRadius: 24, padding: "40px 44px",
            width: 580, boxShadow: "0 8px 48px rgba(0,0,0,0.25)",
          }}>
            <div style={{ color: "#64748b", fontSize: 18, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 20 }}>
              Recommended Actions
            </div>
            <ActionItem text="Complete OSHA Form 301 within 7 calendar days" frame={frame} startFrame={270} i={0} />
            <ActionItem text="Initiate workers' compensation filing immediately" frame={frame} startFrame={270} i={1} />
            <ActionItem text="Conduct equipment audit — East Wing lift devices" frame={frame} startFrame={270} i={2} />
            <ActionItem text="Schedule ergonomics review for patient transfer protocols" frame={frame} startFrame={270} i={3} />
            <ActionItem text="Add to OSHA 300 Log under musculoskeletal category" frame={frame} startFrame={270} i={4} />

            <div style={{
              marginTop: 28,
              opacity: interpolate(frame, [370, 400], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              background: `${TEAL}11`, border: `1.5px solid ${TEAL}44`,
              borderRadius: 12, padding: "14px 18px",
              color: TEAL, fontSize: 17, fontWeight: 600, textAlign: "center",
            }}>
              All of this — in under 3 seconds from submission
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
