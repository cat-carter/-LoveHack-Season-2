/**
 * IncidentIQ logo mark — Shield + Signal
 * Shield = safety / protection
 * Signal arcs = intelligence / data / insight
 */
export default function Logo({ size = 32, shieldColor = "#0f2d52", signalColor = "white" }) {
  const h = Math.round(size * 1.09);
  return (
    <svg width={size} height={h} viewBox="0 0 32 35" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Shield body */}
      <path
        d="M16 2L30 7.5V17C30 25 23.5 31 16 33C8.5 31 2 25 2 17V7.5L16 2Z"
        fill={shieldColor}
      />
      {/* Signal — center dot */}
      <circle cx="16" cy="22.5" r="2.2" fill={signalColor} />
      {/* Signal — inner arc */}
      <path
        d="M11.5 18.5C11.5 15 20.5 15 20.5 18.5"
        stroke={signalColor}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Signal — outer arc */}
      <path
        d="M8 14.5C8 8.5 24 8.5 24 14.5"
        stroke={signalColor}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
