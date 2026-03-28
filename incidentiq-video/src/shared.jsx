import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const NAVY = "#0f2d52";
export const NAVY_LIGHT = "#1a4170";
export const TEAL = "#0d9488";
export const TEAL_LIGHT = "#ccfbf1";
export const SLATE = "#64748b";
export const WHITE = "#ffffff";
export const AMBER = "#f59e0b";
export const RED = "#e11d48";

/** Fade + slide-up entrance */
export function useFadeUp(startFrame = 0, delay = 0) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame - delay;
  const opacity = interpolate(f, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(f, [0, 20], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `translateY(${y}px)` };
}

/** Spring pop-in */
export function useSpring(startFrame = 0, fps = 30) {
  const frame = useCurrentFrame();
  const scale = spring({ frame: frame - startFrame, fps, config: { damping: 12, stiffness: 180 } });
  return { transform: `scale(${scale})` };
}

/** Typewriter text reveal */
export function TypeWriter({ text, startFrame = 0, charsPerFrame = 1, style = {} }) {
  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;
  const visibleChars = Math.max(0, Math.floor(elapsed * charsPerFrame));
  return <span style={style}>{text.slice(0, visibleChars)}</span>;
}

/** Full-bleed scene background */
export function SceneBg({ color = NAVY, children, style = {} }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: color,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      ...style,
    }}>
      {children}
    </div>
  );
}

/** Pill badge */
export function Badge({ label, color = TEAL, textColor = WHITE }) {
  return (
    <span style={{
      background: color, color: textColor,
      fontSize: 22, fontWeight: 800,
      padding: "6px 20px", borderRadius: 999,
      letterSpacing: 1, textTransform: "uppercase",
    }}>
      {label}
    </span>
  );
}

/** Card container */
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: WHITE, borderRadius: 24,
      padding: "36px 44px",
      boxShadow: "0 8px 48px rgba(0,0,0,0.18)",
      ...style,
    }}>
      {children}
    </div>
  );
}

/** IncidentIQ logo mark */
export function LogoMark({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill={WHITE} fillOpacity="0.15" />
      {/* Shield */}
      <path d="M20 6 L32 11 L32 22 C32 28.6 26.6 34.2 20 36 C13.4 34.2 8 28.6 8 22 L8 11 Z" fill="none" stroke={WHITE} strokeWidth="2.5" />
      {/* Signal bars */}
      <rect x="15" y="21" width="3" height="7" rx="1.5" fill={TEAL} />
      <rect x="19.5" y="17" width="3" height="11" rx="1.5" fill={TEAL} />
      <rect x="24" y="13" width="3" height="15" rx="1.5" fill={TEAL} />
    </svg>
  );
}
