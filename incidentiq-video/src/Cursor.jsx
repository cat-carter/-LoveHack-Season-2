import { useCurrentFrame, interpolate } from "remotion";

// easeInOut for smooth cursor movement
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function interpolateEased(frame, waypoints) {
  if (waypoints.length === 0) return { x: 960, y: 540 };
  if (frame <= waypoints[0].frame) return waypoints[0];
  if (frame >= waypoints[waypoints.length - 1].frame) return waypoints[waypoints.length - 1];

  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i];
    const b = waypoints[i + 1];
    if (frame >= a.frame && frame <= b.frame) {
      const t = easeInOut((frame - a.frame) / (b.frame - a.frame));
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
  }
  return waypoints[waypoints.length - 1];
}

export function Cursor({ waypoints }) {
  const frame = useCurrentFrame();
  const pos = interpolateEased(frame, waypoints);

  // Detect click frames
  const isClicking = waypoints.some(
    (w) => w.click && Math.abs(frame - w.frame) < 8
  );

  const clickScale = isClicking
    ? interpolate(
        (frame - (waypoints.find((w) => w.click && Math.abs(frame - w.frame) < 8)?.frame ?? frame)),
        [-4, 0, 4, 8],
        [1, 0.75, 0.9, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 1;

  const clickRippleOpacity = isClicking
    ? interpolate(
        (frame - (waypoints.find((w) => w.click && Math.abs(frame - w.frame) < 8)?.frame ?? frame)),
        [0, 8],
        [0.5, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  const clickRippleScale = isClicking
    ? interpolate(
        (frame - (waypoints.find((w) => w.click && Math.abs(frame - w.frame) < 8)?.frame ?? frame)),
        [0, 8],
        [1, 2.5],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 1;

  return (
    <div style={{
      position: "absolute",
      left: pos.x,
      top: pos.y,
      pointerEvents: "none",
      zIndex: 9999,
      transform: "translate(-4px, -4px)",
    }}>
      {/* Click ripple */}
      <div style={{
        position: "absolute",
        width: 36, height: 36,
        borderRadius: "50%",
        background: "rgba(13,148,136,0.35)",
        transform: `translate(-50%, -50%) scale(${clickRippleScale})`,
        left: 4, top: 4,
        opacity: clickRippleOpacity,
      }} />

      {/* Cursor SVG */}
      <svg
        width="28" height="32"
        viewBox="0 0 28 32"
        style={{ transform: `scale(${clickScale})`, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }}
      >
        <path d="M2 2 L2 24 L8 18 L13 28 L16 26.5 L11 16.5 L19 16.5 Z" fill="white" stroke="#0f2d52" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
