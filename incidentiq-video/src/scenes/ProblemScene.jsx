import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { NAVY, TEAL, WHITE, AMBER, RED, useFadeUp } from "../shared.jsx";

function StatCard({ value, label, color, frame, startFrame }) {
  const scale = spring({ frame: frame - startFrame, fps: 30, config: { damping: 12, stiffness: 150 } });
  const opacity = interpolate(frame - startFrame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{
      transform: `scale(${scale})`, opacity,
      background: "rgba(255,255,255,0.08)",
      border: `2px solid rgba(255,255,255,0.12)`,
      borderRadius: 24, padding: "48px 40px",
      textAlign: "center", width: 340,
    }}>
      <div style={{ color, fontSize: 96, fontWeight: 900, lineHeight: 1, marginBottom: 16 }}>{value}</div>
      <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 26, lineHeight: 1.35 }}>{label}</div>
    </div>
  );
}

export function ProblemScene() {
  const frame = useCurrentFrame();
  const headingStyle = useFadeUp(0, 0);
  const subStyle = useFadeUp(0, 20);

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: `linear-gradient(160deg, #0a1f38 0%, ${NAVY} 100%)`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 0,
    }}>
      <div style={{ ...headingStyle, marginBottom: 16, textAlign: "center" }}>
        <span style={{
          color: "rgba(255,255,255,0.45)", fontSize: 24,
          fontWeight: 700, letterSpacing: 4, textTransform: "uppercase",
        }}>
          The problem
        </span>
      </div>

      <div style={{ ...subStyle, marginBottom: 72, textAlign: "center" }}>
        <span style={{ color: WHITE, fontSize: 52, fontWeight: 800, lineHeight: 1.25 }}>
          Nursing home incident reporting<br />
          <span style={{ color: "#f87171" }}>is broken</span>
        </span>
      </div>

      <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
        <StatCard value="96%" label="of near-misses go unreported" color="#f87171" frame={frame} startFrame={30} />
        <StatCard value="600×" label="near-misses per serious injury" color={AMBER} frame={frame} startFrame={60} />
        <StatCard value="30 min" label="to complete one OSHA 301 form" color="#a78bfa" frame={frame} startFrame={90} />
      </div>

      {/* Bottom callout */}
      {frame > 150 && (
        <div style={{
          marginTop: 56,
          opacity: interpolate(frame, [150, 175], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [150, 175], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          color: TEAL, fontSize: 30, fontWeight: 700, textAlign: "center",
        }}>
          What if AI could absorb all of that work the moment a report comes in?
        </div>
      )}
    </div>
  );
}
