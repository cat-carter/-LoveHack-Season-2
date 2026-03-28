import { useCurrentFrame, interpolate, spring } from "remotion";
import { NAVY, TEAL, WHITE, LogoMark, useFadeUp } from "../shared.jsx";

export function OutroScene() {
  const frame = useCurrentFrame();

  const logoScale = spring({ frame, fps: 30, config: { damping: 12, stiffness: 140 } });
  const titleStyle = useFadeUp(0, 18);
  const taglineStyle = useFadeUp(0, 36);
  const stackStyle = useFadeUp(0, 60);
  const ctaStyle = useFadeUp(0, 90);

  const glowPulse = interpolate(frame, [0, 225, 450], [0.3, 0.6, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const STACK = [
    { label: "React + Vite", color: "#61dafb" },
    { label: "Tailwind CSS", color: "#38bdf8" },
    { label: "Claude — Anthropic", color: TEAL },
    { label: "n8n", color: "#f97316" },
  ];

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: `linear-gradient(135deg, ${NAVY} 0%, #1e5a8e 100%)`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>
      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      {/* Glow */}
      <div style={{
        position: "absolute", top: "40%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 700, height: 700, borderRadius: "50%",
        background: `radial-gradient(circle, ${TEAL}44 0%, transparent 70%)`,
        opacity: glowPulse,
      }} />

      {/* Logo */}
      <div style={{ transform: `scale(${logoScale})`, marginBottom: 28 }}>
        <LogoMark size={88} />
      </div>

      {/* Wordmark */}
      <div style={{ ...titleStyle, textAlign: "center", marginBottom: 16 }}>
        <span style={{
          color: WHITE, fontSize: 96, fontWeight: 900,
          letterSpacing: -3, lineHeight: 1,
          textShadow: "0 4px 32px rgba(0,0,0,0.3)",
        }}>
          IncidentIQ
        </span>
      </div>

      {/* Tagline */}
      <div style={{ ...taglineStyle, textAlign: "center", marginBottom: 52 }}>
        <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 30, fontWeight: 400, letterSpacing: 0.5 }}>
          From incident to insight — AI-powered safety reporting for nursing homes
        </span>
      </div>

      {/* Tech stack pills */}
      <div style={{
        ...stackStyle,
        display: "flex", gap: 14, flexWrap: "wrap",
        justifyContent: "center", marginBottom: 52,
      }}>
        {STACK.map(({ label, color }) => (
          <span key={label} style={{
            background: `${color}22`,
            border: `2px solid ${color}55`,
            color,
            fontSize: 20, fontWeight: 700,
            padding: "8px 24px", borderRadius: 999,
          }}>
            {label}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div style={{ ...ctaStyle, textAlign: "center" }}>
        <div style={{
          background: `${TEAL}22`,
          border: `2px solid ${TEAL}66`,
          borderRadius: 20, padding: "24px 60px",
          color: WHITE, fontSize: 26, fontWeight: 700,
        }}>
          Built at LoveHack Season 2 · March 2026
        </div>
      </div>

      {/* Bottom strip */}
      <div style={{
        position: "absolute", bottom: 48,
        display: "flex", gap: 48,
        color: "rgba(255,255,255,0.3)",
        fontSize: 18, letterSpacing: 1, textTransform: "uppercase",
      }}>
        <span>Creativity</span>
        <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
        <span>AI Integration</span>
        <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
        <span>Real-world impact</span>
        <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
        <span>n8n automation</span>
      </div>
    </div>
  );
}
