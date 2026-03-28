import { useCurrentFrame, interpolate, spring } from "remotion";
import { NAVY, TEAL, WHITE, AMBER, RED, useFadeUp } from "../shared.jsx";

function CountUp({ from, to, frame, startFrame, suffix = "", prefix = "", color = WHITE, size = 96 }) {
  const elapsed = frame - startFrame;
  const progress = interpolate(elapsed, [0, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const value = Math.round(from + (to - from) * progress);
  const opacity = interpolate(elapsed, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = spring({ frame: elapsed, fps: 30, config: { damping: 14, stiffness: 150 } });

  return (
    <div style={{ opacity, transform: `scale(${scale})`, textAlign: "center" }}>
      <div style={{ color, fontSize: size, fontWeight: 900, lineHeight: 1 }}>
        {prefix}{value}{suffix}
      </div>
    </div>
  );
}

export function ImpactScene() {
  const frame = useCurrentFrame();
  const headStyle = useFadeUp(0, 0);
  const subStyle = useFadeUp(0, 20);

  const showRow2 = frame > 200;
  const showRow3 = frame > 380;
  const showCta = frame > 560;

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: `linear-gradient(160deg, ${NAVY} 0%, #1e5a8e 100%)`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>
      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
        backgroundSize: "72px 72px",
      }} />

      <div style={{ ...headStyle, textAlign: "center", marginBottom: 12 }}>
        <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 22, fontWeight: 700, textTransform: "uppercase", letterSpacing: 4 }}>
          The impact
        </span>
      </div>

      <div style={{ ...subStyle, textAlign: "center", marginBottom: 72 }}>
        <span style={{ color: WHITE, fontSize: 52, fontWeight: 900, lineHeight: 1.2 }}>
          Real time returned to<br />people doing hard work
        </span>
      </div>

      {/* Row 1: OSHA time */}
      <div style={{
        display: "flex", alignItems: "center", gap: 60,
        marginBottom: 44,
        opacity: interpolate(frame, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#f87171", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>OSHA 301 — before</div>
          <CountUp from={0} to={30} frame={frame} startFrame={40} suffix=" min" color="#f87171" size={80} />
        </div>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 64, fontWeight: 900 }}>→</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: TEAL, fontSize: 28, fontWeight: 700, marginBottom: 8 }}>OSHA 301 — with AI</div>
          <CountUp from={30} to={2} frame={frame} startFrame={80} suffix=" min" color={TEAL} size={80} />
        </div>
        <div style={{
          background: `${TEAL}22`, border: `2px solid ${TEAL}55`,
          borderRadius: 16, padding: "14px 24px",
          opacity: interpolate(frame, [110, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <div style={{ color: TEAL, fontSize: 32, fontWeight: 900 }}>93%</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 18 }}>time saved</div>
        </div>
      </div>

      {/* Row 2: Reporting rate */}
      {showRow2 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 60,
          marginBottom: 44,
          opacity: interpolate(frame, [200, 230], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#f87171", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Near-miss reports — before</div>
            <CountUp from={0} to={4} frame={frame} startFrame={210} suffix="%" color="#f87171" size={80} />
          </div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 64, fontWeight: 900 }}>→</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: TEAL, fontSize: 28, fontWeight: 700, marginBottom: 8 }}>With guided reporting</div>
            <CountUp from={4} to={100} frame={frame} startFrame={230} suffix="%" color={TEAL} size={80} />
          </div>
          <div style={{
            background: `${AMBER}22`, border: `2px solid ${AMBER}55`,
            borderRadius: 16, padding: "14px 24px",
            opacity: interpolate(frame, [280, 310], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            <div style={{ color: AMBER, fontSize: 32, fontWeight: 900 }}>600×</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 18 }}>more data to act on</div>
          </div>
        </div>
      )}

      {/* Row 3: Triage time */}
      {showRow3 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 60,
          opacity: interpolate(frame, [380, 410], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#f87171", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Manual triage — before</div>
            <CountUp from={0} to={15} frame={frame} startFrame={390} suffix=" min" color="#f87171" size={80} />
          </div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 64, fontWeight: 900 }}>→</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: TEAL, fontSize: 28, fontWeight: 700, marginBottom: 8 }}>AI triage — instant</div>
            <CountUp from={15} to={0} frame={frame} startFrame={410} suffix=" sec" color={TEAL} size={80} />
            <div style={{
              color: TEAL, fontSize: 24, fontWeight: 700, marginTop: 4,
              opacity: interpolate(frame, [440, 460], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}>
              &lt; 3 seconds
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      {showCta && (
        <div style={{
          position: "absolute", bottom: 60,
          opacity: interpolate(frame, [560, 590], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `scale(${interpolate(frame, [560, 590], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
          background: WHITE, borderRadius: 16, padding: "18px 44px",
          color: NAVY, fontSize: 28, fontWeight: 900,
          boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
        }}>
          Every minute saved is a minute back with patients
        </div>
      )}
    </div>
  );
}
