import { useCurrentFrame, interpolate, spring } from "remotion";
import { NAVY, TEAL, WHITE, AMBER, useFadeUp } from "../shared.jsx";

const STEPS = [
  { icon: "📝", label: "Report Submitted", sub: "IncidentIQ web app", color: "#3b82f6", delay: 0 },
  { icon: "⚡", label: "n8n Triggered", sub: "Webhook listener fires", color: "#f97316", delay: 40 },
  { icon: "🤖", label: "Claude API", sub: "Anthropic — triage + OSHA draft", color: TEAL, delay: 80 },
  { icon: "📊", label: "Structured Output", sub: "JSON → severity, flags, actions", color: "#8b5cf6", delay: 120 },
  { icon: "✅", label: "Case Updated", sub: "Admin sees results instantly", color: "#22c55e", delay: 160 },
];

function WorkflowNode({ step, index, frame }) {
  const { icon, label, sub, color, delay } = step;
  const elapsed = frame - delay;
  const scale = spring({ frame: elapsed, fps: 30, config: { damping: 12, stiffness: 160 } });
  const opacity = interpolate(elapsed, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const isActive = frame > delay + 15;

  return (
    <div style={{ opacity, transform: `scale(${scale})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{
        width: 120, height: 120,
        borderRadius: 28,
        background: isActive ? `${color}22` : "rgba(255,255,255,0.06)",
        border: `3px solid ${isActive ? color : "rgba(255,255,255,0.1)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 44,
        boxShadow: isActive ? `0 0 32px ${color}55` : "none",
        transition: "all 0.3s",
      }}>
        {icon}
      </div>
      <div style={{ marginTop: 14, textAlign: "center" }}>
        <div style={{ color: WHITE, fontSize: 20, fontWeight: 700 }}>{label}</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, marginTop: 4 }}>{sub}</div>
      </div>
    </div>
  );
}

function Arrow({ frame, startFrame }) {
  const progress = interpolate(frame - startFrame, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 50 }}>
      <div style={{
        height: 3,
        width: `${progress * 80}px`,
        background: `linear-gradient(90deg, ${TEAL}, rgba(94,234,212,0.3))`,
        borderRadius: 2,
      }} />
      {progress > 0.8 && (
        <div style={{ color: TEAL, fontSize: 22, marginLeft: 4, opacity: progress }}>→</div>
      )}
    </div>
  );
}

export function N8nScene() {
  const frame = useCurrentFrame();
  const headStyle = useFadeUp(0, 0);

  const detailOpacity = interpolate(frame, [240, 270], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const detailY = interpolate(frame, [240, 270], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: `linear-gradient(160deg, #1a0a38 0%, #0f2d52 50%, #0a2d20 100%)`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>
      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />

      {/* Heading */}
      <div style={{ ...headStyle, textAlign: "center", marginBottom: 56 }}>
        <div style={{ color: "#f97316", fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>
          ⚡ Automation workflow
        </div>
        <div style={{ color: WHITE, fontSize: 52, fontWeight: 900 }}>
          n8n + Claude — end to end
        </div>
      </div>

      {/* Workflow nodes */}
      <div style={{
        display: "flex", alignItems: "center", gap: 20,
        marginBottom: 60,
      }}>
        {STEPS.map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <WorkflowNode step={step} index={i} frame={frame} />
            {i < STEPS.length - 1 && (
              <div style={{ margin: "0 8px 48px 8px" }}>
                <Arrow frame={frame} startFrame={step.delay + 25} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <div style={{
        opacity: detailOpacity,
        transform: `translateY(${detailY}px)`,
        display: "flex", gap: 24,
      }}>
        {[
          { title: "Trigger", desc: "HTTP webhook fires the moment a report is submitted", icon: "🔗", color: "#3b82f6" },
          { title: "Claude Prompt", desc: "Structured prompt with injury data → JSON triage object", icon: "🧠", color: TEAL },
          { title: "OSHA Draft", desc: "Second Claude call writes all 4 Form 301 narrative fields", icon: "📄", color: "#8b5cf6" },
          { title: "Update", desc: "Case record updated in real time before admin opens it", icon: "⚡", color: "#22c55e" },
        ].map((item, i) => (
          <div key={i} style={{
            background: `${item.color}15`,
            border: `1.5px solid ${item.color}44`,
            borderRadius: 16, padding: "20px 24px",
            width: 260,
          }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
            <div style={{ color: item.color, fontSize: 18, fontWeight: 800, marginBottom: 6 }}>{item.title}</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, lineHeight: 1.5 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
