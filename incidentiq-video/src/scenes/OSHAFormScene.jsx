import { useCurrentFrame, interpolate } from "remotion";

const NAVY = "#0f2d52";
const TEAL = "#0d9488";

function fade(frame, start, dur = 18) {
  return interpolate(frame - start, [0, dur], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
}

function TypeField({ label, value, frame, startFrame, delay = 0, wide = false }) {
  const elapsed = Math.max(0, frame - startFrame - delay);
  const chars = Math.max(0, Math.floor(elapsed * 0.65));
  const shown = value.slice(0, chars);
  const active = elapsed > 0 && chars < value.length;
  const done = chars >= value.length && elapsed > 0;

  return (
    <div style={{ marginBottom: 18, gridColumn: wide ? "span 2" : "span 1" }}>
      <label style={{
        display: "block", color: "#475569", fontSize: 11, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6,
      }}>
        {label}
      </label>
      <div style={{
        background: active ? "#f0fdfa" : done ? "#f0fdf4" : "#f8fafc",
        border: `2px solid ${active ? TEAL : done ? "#86efac" : "#e2e8f0"}`,
        borderRadius: 10, padding: "10px 14px",
        fontSize: 14, color: "#1e293b",
        minHeight: 42, lineHeight: 1.5,
        transition: "border-color 0.2s, background 0.2s",
      }}>
        {shown || <span style={{ color: "#cbd5e1" }}>{"\u00a0"}</span>}
        {active && (
          <span style={{ borderRight: `2px solid ${TEAL}`, marginLeft: 1, height: 15, display: "inline-block", verticalAlign: "middle" }} />
        )}
      </div>
    </div>
  );
}

export function OSHAFormScene() {
  const frame = useCurrentFrame();

  // Timeline (local frames):
  // 0-30: cursor clicks "Open OSHA 301" button (from waypoint at abs 2490-2530)
  // 30-60: page loads / form appears
  // 60+: Claude auto-fills fields one by one
  // 300+: completion badge

  const showForm = frame > 30;
  const showAIBadge = frame > 40;
  const showDone = frame > 360;

  return (
    <div style={{ position: "absolute", inset: 0, background: "#f8fafc", display: "flex", flexDirection: "column" }}>
      {/* Top nav */}
      <div style={{
        background: NAVY, height: 64, display: "flex", alignItems: "center",
        padding: "0 40px", gap: 14, flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
        }}>🛡️</div>
        <span style={{ color: "white", fontSize: 22, fontWeight: 800 }}>IncidentIQ</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Case IQ-2024-008</span>
        <span style={{ color: "rgba(255,255,255,0.3)" }}> / </span>
        <span style={{ color: "white", fontSize: 14, fontWeight: 600 }}>OSHA Form 301</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", justifyContent: "center", padding: "36px 40px" }}>
        <div style={{ width: 1100, display: "flex", gap: 32 }}>

          {/* Form */}
          {showForm && (
            <div style={{
              flex: 1,
              background: "white", borderRadius: 20, border: "1.5px solid #e2e8f0",
              padding: "32px 36px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              opacity: fade(frame, 30),
            }}>
              {/* Form header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
                <div>
                  <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
                    U.S. Department of Labor · OSHA
                  </p>
                  <h2 style={{ color: "#1e293b", fontSize: 22, fontWeight: 900 }}>Form 301 — Injury & Illness Incident Report</h2>
                  <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 2 }}>Case IQ-2024-008 · Sunrise Nursing &amp; Rehabilitation</p>
                </div>
                {showAIBadge && (
                  <div style={{
                    opacity: fade(frame, 40),
                    background: `${TEAL}15`, border: `1.5px solid ${TEAL}44`,
                    borderRadius: 12, padding: "10px 16px",
                    textAlign: "center",
                    color: TEAL, fontSize: 13, fontWeight: 700,
                  }}>
                    ✨ Claude<br />auto-drafting…
                  </div>
                )}
              </div>

              {/* Employee section */}
              <p style={{ color: "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid #f1f5f9" }}>
                Section 1 — Employee Information
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px", marginBottom: 24 }}>
                <TypeField label="Full Name" value="Maria Santos" frame={frame} startFrame={60} delay={0} />
                <TypeField label="Job Title" value="Certified Nursing Assistant" frame={frame} startFrame={60} delay={30} />
                <TypeField label="Date of Hire" value="June 14, 2021" frame={frame} startFrame={60} delay={70} />
                <TypeField label="Department" value="East Wing — Patient Care" frame={frame} startFrame={60} delay={100} />
              </div>

              {/* Incident section */}
              <p style={{ color: "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid #f1f5f9" }}>
                Section 2 — Incident Information
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px", marginBottom: 24 }}>
                <TypeField label="Date of Injury" value="March 20, 2026" frame={frame} startFrame={60} delay={130} />
                <TypeField label="Time of Injury" value="8:45 AM" frame={frame} startFrame={60} delay={160} />
                <TypeField label="Location" value="East Wing, Room 214 — Patient Transfer" frame={frame} startFrame={60} delay={190} />
                <TypeField label="Type of Injury" value="Musculoskeletal — Lumbar Strain" frame={frame} startFrame={60} delay={220} />
                <TypeField
                  label="What happened? (Claude-drafted)"
                  value="Employee sustained lumbar strain during unassisted patient transfer. Patient weight approx. 180 lbs. No mechanical lift available."
                  frame={frame} startFrame={60} delay={250} wide
                />
                <TypeField
                  label="Body part affected"
                  value="Lumbar spine (lower back), with pain radiating to left leg"
                  frame={frame} startFrame={60} delay={330} wide
                />
              </div>

              {/* Checkboxes */}
              <p style={{ color: "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid #f1f5f9" }}>
                Section 3 — Classification
              </p>
              <div style={{ display: "flex", gap: 32, marginBottom: 20 }}>
                {[
                  { label: "OSHA Recordable", checked: true },
                  { label: "Workers' Comp Required", checked: true },
                  { label: "Days Away from Work", checked: true },
                  { label: "Medical Treatment", checked: true },
                ].map(({ label, checked }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 4,
                      background: checked && frame > 350 ? TEAL : "white",
                      border: `2px solid ${checked && frame > 350 ? TEAL : "#e2e8f0"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s",
                    }}>
                      {checked && frame > 350 && <span style={{ color: "white", fontSize: 11 }}>✓</span>}
                    </div>
                    <span style={{ color: "#475569", fontSize: 13 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Right side panel */}
          <div style={{ width: 320 }}>
            {/* Before/After comparison */}
            <div style={{
              background: NAVY, borderRadius: 18, padding: "24px 24px",
              marginBottom: 16,
              opacity: fade(frame, 35),
            }}>
              <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>Without IncidentIQ</p>
              {["Open blank Form 301", "Re-read incident report", "Write all fields by hand", "20–30 min per case"].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                  <span style={{ color: "#f87171", fontSize: 14 }}>✗</span>
                  <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }}>{s}</span>
                </div>
              ))}
            </div>

            <div style={{
              background: `${TEAL}15`, border: `1.5px solid ${TEAL}44`,
              borderRadius: 18, padding: "24px 24px",
              opacity: fade(frame, 42),
            }}>
              <p style={{ color: TEAL, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>With IncidentIQ</p>
              {['Click "Open OSHA 301"', "Claude drafts all fields", "Review & edit if needed", "Under 2 minutes"].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                  <span style={{ color: TEAL, fontSize: 14 }}>✓</span>
                  <span style={{ color: "#334155", fontSize: 14 }}>{s}</span>
                </div>
              ))}
            </div>

            {/* Done badge */}
            {showDone && (
              <div style={{
                marginTop: 16,
                opacity: fade(frame, 360),
                background: TEAL, color: "white",
                borderRadius: 14, padding: "14px 20px",
                fontSize: 15, fontWeight: 700, textAlign: "center",
                boxShadow: `0 4px 20px ${TEAL}55`,
              }}>
                ✓ Drafted in 2.4 seconds
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
