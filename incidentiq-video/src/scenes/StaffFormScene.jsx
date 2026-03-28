import { useCurrentFrame, interpolate } from "remotion";
import { NAVY, TEAL, WHITE, useFadeUp } from "../shared.jsx";

function MockInput({ label, value, frame, startFrame, delay = 0 }) {
  const elapsed = frame - startFrame - delay;
  const chars = Math.max(0, Math.floor(elapsed * 0.5));
  const shown = value.slice(0, chars);
  const opacity = interpolate(elapsed - delay, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ color: "#94a3b8", fontSize: 16, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{
        background: "white", border: "2px solid #e2e8f0",
        borderRadius: 12, padding: "14px 18px",
        fontSize: 22, color: "#1e293b", minHeight: 52,
        display: "flex", alignItems: "center",
      }}>
        {shown}
        {chars < value.length && elapsed > 0 && (
          <span style={{ borderRight: "2px solid #0d9488", animation: "blink 1s step-end infinite", marginLeft: 2, height: 22, display: "inline-block" }} />
        )}
      </div>
    </div>
  );
}

function ProgressBar({ percent, frame, startFrame }) {
  const elapsed = frame - startFrame;
  const p = interpolate(elapsed, [0, 60], [0, percent], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ color: "#64748b", fontSize: 18, fontWeight: 600 }}>Report progress</span>
        <span style={{ color: TEAL, fontSize: 18, fontWeight: 700 }}>{Math.round(p)}%</span>
      </div>
      <div style={{ background: "#f1f5f9", borderRadius: 999, height: 10 }}>
        <div style={{
          background: `linear-gradient(90deg, ${TEAL} 0%, #5eead4 100%)`,
          borderRadius: 999, height: 10,
          width: `${p}%`,
          transition: "width 0.1s",
        }} />
      </div>
    </div>
  );
}

export function StaffFormScene() {
  const frame = useCurrentFrame();
  const labelStyle = useFadeUp(0, 0);
  const cardOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardY = interpolate(frame, [10, 30], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const submitVisible = frame > 340;
  const submitScale = interpolate(frame, [340, 380], [0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "#f1f5f9",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>
      {/* Label banner */}
      <div style={{
        ...labelStyle,
        position: "absolute", top: 60, left: 0, right: 0,
        textAlign: "center",
      }}>
        <span style={{
          background: NAVY, color: WHITE,
          fontSize: 22, fontWeight: 700,
          padding: "8px 28px", borderRadius: 999,
          letterSpacing: 2, textTransform: "uppercase",
        }}>
          Frontline staff — 2-minute report
        </span>
      </div>

      {/* Mock form card */}
      <div style={{
        opacity: cardOpacity,
        transform: `translateY(${cardY}px)`,
        background: WHITE,
        borderRadius: 28,
        padding: "48px 52px",
        width: 760,
        boxShadow: "0 16px 64px rgba(0,0,0,0.12)",
      }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ color: "#94a3b8", fontSize: 18, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
            Sunrise Nursing & Rehabilitation
          </div>
          <div style={{ color: NAVY, fontSize: 36, fontWeight: 900, marginBottom: 4 }}>New Incident Report</div>
          <div style={{ color: "#94a3b8", fontSize: 18 }}>Guided, confidential, non-punitive</div>
        </div>

        <ProgressBar percent={78} frame={frame} startFrame={20} />

        <MockInput label="Incident Type" value="Musculoskeletal Injury" frame={frame} startFrame={40} />
        <MockInput label="Location" value="East Wing — Room 214" frame={frame} startFrame={80} />
        <MockInput
          label="What happened"
          value="Patient transfer — lumbar strain during manual lift, no equipment available"
          frame={frame}
          startFrame={120}
        />

        {/* Submit button */}
        {submitVisible && (
          <div style={{ marginTop: 24, transform: `scale(${submitScale})` }}>
            <div style={{
              background: NAVY, color: WHITE,
              borderRadius: 16, padding: "20px 0",
              textAlign: "center", fontSize: 24, fontWeight: 800,
              cursor: "pointer",
            }}>
              ✓ Submit Report
            </div>
            <div style={{ textAlign: "center", marginTop: 12, color: "#94a3b8", fontSize: 18 }}>
              Your report is confidential and protected
            </div>
          </div>
        )}
      </div>

      {/* Timer badge */}
      {frame > 50 && (
        <div style={{
          position: "absolute", bottom: 60, right: 80,
          opacity: interpolate(frame, [50, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          background: TEAL, color: WHITE,
          borderRadius: 16, padding: "16px 28px",
          fontSize: 26, fontWeight: 800,
          boxShadow: "0 4px 24px rgba(13,148,136,0.4)",
        }}>
          ⏱ ~2 min to complete
        </div>
      )}
    </div>
  );
}
