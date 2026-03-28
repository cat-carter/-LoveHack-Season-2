import { useCurrentFrame, interpolate } from "remotion";
import { NAVY, TEAL, WHITE, useFadeUp } from "../shared.jsx";

function DraftField({ label, value, frame, startFrame, delay = 0 }) {
  const elapsed = frame - startFrame - delay;
  const chars = Math.max(0, Math.floor(elapsed * 0.7));
  const shown = value.slice(0, chars);
  const opacity = interpolate(elapsed, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ opacity, marginBottom: 24 }}>
      <div style={{
        color: "#94a3b8", fontSize: 14, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{
        background: elapsed > 0 ? "#f0fdfa" : "#f8fafc",
        border: `2px solid ${elapsed > 0 ? TEAL + "55" : "#e2e8f0"}`,
        borderRadius: 10, padding: "14px 16px",
        fontSize: 18, color: "#1e293b",
        minHeight: 54, lineHeight: 1.6,
        transition: "all 0.3s",
      }}>
        {shown}
        {chars < value.length && elapsed > 0 && (
          <span style={{ borderRight: "2px solid #0d9488", marginLeft: 2, height: 18, display: "inline-block", verticalAlign: "middle" }} />
        )}
      </div>
    </div>
  );
}

export function OSHAScene() {
  const frame = useCurrentFrame();
  const labelStyle = useFadeUp(0, 0);
  const cardStyle = useFadeUp(0, 15);

  const aiLabelOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const completedOpacity = interpolate(frame, [480, 530], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "#f8fafc",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>
      {/* Label */}
      <div style={{ ...labelStyle, position: "absolute", top: 48, textAlign: "center" }}>
        <span style={{
          background: NAVY, color: WHITE,
          fontSize: 20, fontWeight: 700,
          padding: "8px 28px", borderRadius: 999,
          letterSpacing: 2, textTransform: "uppercase",
        }}>
          OSHA Form 301 — AI auto-draft
        </span>
      </div>

      <div style={{ ...cardStyle, display: "flex", gap: 36, alignItems: "flex-start", maxWidth: 1200 }}>
        {/* Form */}
        <div style={{
          background: WHITE, borderRadius: 24,
          padding: "40px 44px", width: 640,
          boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <div style={{ color: NAVY, fontSize: 28, fontWeight: 900 }}>OSHA Form 301</div>
              <div style={{ color: "#64748b", fontSize: 16 }}>Injury and Illness Incident Report</div>
            </div>
            <div style={{
              opacity: aiLabelOpacity,
              background: `${TEAL}15`, border: `1.5px solid ${TEAL}55`,
              borderRadius: 10, padding: "8px 14px",
              color: TEAL, fontSize: 15, fontWeight: 700,
              textAlign: "center",
            }}>
              ✨ Claude<br />drafting…
            </div>
          </div>

          <DraftField
            label="1. What happened?"
            value="Employee sustained lumbar strain while performing manual patient transfer in Room 214, East Wing. No mechanical lift equipment was available at time of incident."
            frame={frame} startFrame={40}
          />
          <DraftField
            label="2. What object or substance was involved?"
            value="Patient body weight during transfer — estimated 180 lbs. No assistive devices or mechanical lifts were utilized."
            frame={frame} startFrame={40} delay={120}
          />
          <DraftField
            label="3. What part of the body was affected?"
            value="Lumbar spine (lower back). Employee reported immediate pain radiating to left leg."
            frame={frame} startFrame={40} delay={220}
          />
          <DraftField
            label="4. What was the employee doing?"
            value="Performing scheduled morning patient transfer from bed to wheelchair without required second staff member or mechanical lift device."
            frame={frame} startFrame={40} delay={310}
          />
        </div>

        {/* Side callout */}
        <div style={{ width: 420 }}>
          <div style={{
            background: NAVY, borderRadius: 24, padding: "36px 36px",
            marginBottom: 20,
            boxShadow: "0 8px 40px rgba(15,45,82,0.4)",
          }}>
            <div style={{ color: TEAL, fontSize: 18, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>
              Without IncidentIQ
            </div>
            {["Open blank Form 301", "Re-read the incident report", "Write all 4 fields from scratch", "Review for completeness", "Print and file"].map((s, i) => (
              <div key={i} style={{
                display: "flex", gap: 12, alignItems: "center",
                marginBottom: 12, color: "rgba(255,255,255,0.7)", fontSize: 18,
              }}>
                <span style={{ color: "#f87171" }}>✗</span>
                {s}
              </div>
            ))}
            <div style={{
              marginTop: 20, padding: "14px 0",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              color: "#f87171", fontSize: 22, fontWeight: 800, textAlign: "center",
            }}>
              20–30 minutes per case
            </div>
          </div>

          <div style={{
            background: `${TEAL}15`,
            border: `2px solid ${TEAL}44`,
            borderRadius: 24, padding: "36px 36px",
          }}>
            <div style={{ color: TEAL, fontSize: 18, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>
              With IncidentIQ
            </div>
            {['Click "Open OSHA 301"', "Claude drafts all 4 fields", "Review and edit if needed", "Print — done"].map((s, i) => (
              <div key={i} style={{
                display: "flex", gap: 12, alignItems: "center",
                marginBottom: 12, color: "rgba(255,255,255,0.85)", fontSize: 18,
              }}>
                <span style={{ color: TEAL }}>✓</span>
                {s}
              </div>
            ))}
            <div style={{
              marginTop: 20, padding: "14px 0",
              borderTop: `1px solid ${TEAL}33`,
              color: WHITE, fontSize: 22, fontWeight: 800, textAlign: "center",
            }}>
              Under 2 minutes
            </div>
          </div>
        </div>
      </div>

      {/* Completion badge */}
      {frame > 480 && (
        <div style={{
          position: "absolute", bottom: 52,
          opacity: completedOpacity,
          background: TEAL, color: WHITE,
          borderRadius: 16, padding: "16px 32px",
          fontSize: 26, fontWeight: 800,
          boxShadow: "0 4px 24px rgba(13,148,136,0.4)",
        }}>
          ✓ OSHA 301 ready to print — drafted in 2.4 seconds
        </div>
      )}
    </div>
  );
}
