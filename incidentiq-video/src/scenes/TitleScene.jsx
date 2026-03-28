import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { NAVY, NAVY_LIGHT, TEAL, WHITE, LogoMark, useFadeUp } from "../shared.jsx";

export function TitleScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 14, stiffness: 160 } });
  const titleStyle = useFadeUp(0, 12);
  const taglineStyle = useFadeUp(0, 28);
  const pillStyle = useFadeUp(0, 44);

  // Subtle radial glow pulse
  const glowOpacity = interpolate(frame, [0, 75, 150], [0.3, 0.55, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: `linear-gradient(135deg, ${NAVY} 0%, #1e5a8e 100%)`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", top: "30%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600, height: 600,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${TEAL}44 0%, transparent 70%)`,
        opacity: glowOpacity,
        pointerEvents: "none",
      }} />

      {/* Grid dots */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      {/* Logo */}
      <div style={{ transform: `scale(${logoScale})`, marginBottom: 32 }}>
        <LogoMark size={96} />
      </div>

      {/* Wordmark */}
      <div style={{ ...titleStyle, marginBottom: 20, textAlign: "center" }}>
        <span style={{
          color: WHITE, fontSize: 108, fontWeight: 900,
          letterSpacing: -4, lineHeight: 1,
          textShadow: "0 4px 32px rgba(0,0,0,0.3)",
        }}>
          IncidentIQ
        </span>
      </div>

      {/* Tagline */}
      <div style={{ ...taglineStyle, marginBottom: 48, textAlign: "center" }}>
        <span style={{
          color: "rgba(255,255,255,0.75)", fontSize: 36,
          fontWeight: 400, letterSpacing: 0.5,
        }}>
          From incident to insight
        </span>
      </div>

      {/* Pill */}
      <div style={pillStyle}>
        <span style={{
          background: `${TEAL}33`,
          border: `2px solid ${TEAL}88`,
          color: "#5eead4",
          fontSize: 22, fontWeight: 700,
          padding: "10px 32px", borderRadius: 999,
          letterSpacing: 2, textTransform: "uppercase",
        }}>
          AI-Powered Safety Reporting for Nursing Homes
        </span>
      </div>

      {/* Bottom credit */}
      <div style={{
        position: "absolute", bottom: 48,
        color: "rgba(255,255,255,0.35)", fontSize: 20,
        letterSpacing: 2, textTransform: "uppercase",
      }}>
        LoveHack Season 2 · 2026
      </div>
    </div>
  );
}
