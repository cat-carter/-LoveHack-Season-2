import { useCurrentFrame, interpolate } from "remotion";

const NAVY = "#0f2d52";
const TEAL = "#0d9488";
const RED = "#dc2626";

function fade(frame, start, dur = 20) {
  return interpolate(frame - start, [0, dur], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
}

function slideIn(frame, start, dur = 20, from = 30) {
  return interpolate(frame - start, [0, dur], [from, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
}

function TriageRow({ icon, label, value, color, frame, startFrame }) {
  const op = fade(frame, startFrame);
  const x = slideIn(frame, startFrame, 20, -20);
  return (
    <div style={{
      opacity: op, transform: `translateX(${x}px)`,
      display: "flex", alignItems: "center", gap: 16,
      padding: "14px 0", borderBottom: "1px solid #f1f5f9",
    }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ color: "#64748b", fontSize: 16, fontWeight: 600, width: 200 }}>{label}</span>
      <span style={{
        background: `${color}18`, color,
        borderRadius: 8, padding: "5px 14px",
        fontSize: 15, fontWeight: 800,
      }}>{value}</span>
    </div>
  );
}

export function CaseDetailScene() {
  const frame = useCurrentFrame();

  // Timeline:
  // 0-30: page loads
  // 30-90: AI triage panel animates in
  // 90-160: triage rows appear
  // 160-250: summary text appears
  // 250-370: recommended actions appear
  // 370-500: assign reviewer section
  // 500-540: cursor clicks assign button

  const showTriage = frame > 30;
  const showActions = frame > 250;
  const assignSelected = frame > 370;
  const assignClicked = frame > 500;

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
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Dashboard</span>
        <span style={{ color: "rgba(255,255,255,0.3)" }}> / </span>
        <span style={{ color: "white", fontSize: 14, fontWeight: 600 }}>Case IQ-2024-008</span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", gap: 0 }}>
        {/* Left: case info */}
        <div style={{
          width: 460, padding: "32px 32px 32px 40px", overflowY: "hidden",
          borderRight: "1.5px solid #e2e8f0",
          opacity: fade(frame, 0),
        }}>
          {/* Status + severity */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <span style={{
              background: "#fee2e2", color: "#dc2626",
              fontSize: 13, fontWeight: 700, padding: "5px 14px", borderRadius: 999,
            }}>● Open</span>
            <span style={{
              background: "#fee2e2", color: "#dc2626",
              fontSize: 13, fontWeight: 700, padding: "5px 14px", borderRadius: 999,
            }}>▲ HIGH Severity</span>
          </div>

          <h2 style={{ color: "#1e293b", fontSize: 24, fontWeight: 900, marginBottom: 4 }}>
            Musculoskeletal Injury
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 28 }}>
            Case IQ-2024-008 · Submitted Mar 20, 2026
          </p>

          {/* Employee info */}
          <div style={{
            background: "#f8fafc", borderRadius: 14, padding: "18px 20px", marginBottom: 20,
            border: "1px solid #e2e8f0",
          }}>
            <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Employee</p>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: TEAL, color: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, fontWeight: 800,
              }}>MS</div>
              <div>
                <p style={{ color: "#1e293b", fontSize: 16, fontWeight: 700 }}>Maria Santos</p>
                <p style={{ color: "#94a3b8", fontSize: 13 }}>Certified Nursing Assistant · East Wing</p>
              </div>
            </div>
          </div>

          {/* Incident details */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Incident Details</p>
            {[
              { label: "Date", value: "March 20, 2026" },
              { label: "Shift", value: "Morning (7am–3pm)" },
              { label: "Location", value: "East Wing, Room 214" },
              { label: "Witnesses", value: "James Okonkwo (CNA)" },
            ].map(({ label, value }) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between",
                padding: "10px 0", borderBottom: "1px solid #f1f5f9",
              }}>
                <span style={{ color: "#64748b", fontSize: 14 }}>{label}</span>
                <span style={{ color: "#1e293b", fontSize: 14, fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{
            background: "#f8fafc", borderRadius: 12, padding: "16px 18px",
            border: "1px solid #e2e8f0", marginBottom: 20,
          }}>
            <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Description</p>
            <p style={{ color: "#334155", fontSize: 14, lineHeight: 1.6 }}>
              While transferring patient from bed to wheelchair in Room 214, felt sharp pain in lower back. No mechanical lift was available. Another staff member witnessed the incident.
            </p>
          </div>

          {/* Assign reviewer */}
          {frame > 360 && (
            <div style={{ opacity: fade(frame, 360) }}>
              <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Assign Reviewer</p>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{
                  flex: 1,
                  background: "white",
                  border: `2px solid ${assignSelected ? TEAL : "#e2e8f0"}`,
                  borderRadius: 12, padding: "10px 14px",
                  fontSize: 15, color: "#1e293b",
                }}>
                  {assignSelected ? "Dr. Patricia Chen" : "Select reviewer…"}
                </div>
                <div style={{
                  background: assignClicked ? "#dcfce7" : NAVY,
                  color: assignClicked ? "#16a34a" : "white",
                  borderRadius: 12, padding: "10px 20px",
                  fontSize: 14, fontWeight: 700,
                  transition: "all 0.15s",
                }}>
                  {assignClicked ? "✓ Assigned" : "Assign"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: AI triage */}
        <div style={{ flex: 1, padding: "32px 40px 32px 32px", overflowY: "hidden" }}>
          {showTriage && (
            <div style={{ opacity: fade(frame, 30) }}>
              {/* AI triage header */}
              <div style={{
                background: "#fff5f5", borderRadius: 18, padding: "24px 28px",
                border: "2.5px solid #fecaca", marginBottom: 20,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <span style={{ fontSize: 24 }}>🤖</span>
                  <span style={{ color: NAVY, fontSize: 22, fontWeight: 800 }}>AI Triage Analysis</span>
                  <span style={{
                    marginLeft: "auto", background: "#fee2e2", color: "#dc2626",
                    fontSize: 13, fontWeight: 800, padding: "4px 12px", borderRadius: 999,
                    textTransform: "uppercase", letterSpacing: 1,
                  }}>▲ HIGH</span>
                </div>

                <TriageRow icon="🚨" label="Severity" value="High" color="#dc2626" frame={frame} startFrame={45} />
                <TriageRow icon="📋" label="OSHA Recordable" value="Yes" color="#d97706" frame={frame} startFrame={65} />
                <TriageRow icon="🏥" label="Medical Eval" value="Required" color="#7c3aed" frame={frame} startFrame={85} />
                <TriageRow icon="📅" label="OSHA 301 Due" value="7 days" color={TEAL} frame={frame} startFrame={105} />

                {frame > 140 && (
                  <div style={{
                    marginTop: 18,
                    opacity: fade(frame, 140),
                    background: "#f8fafc", borderRadius: 10, padding: "14px 16px",
                    color: "#334155", fontSize: 14, lineHeight: 1.6,
                  }}>
                    <strong>Summary:</strong> Lumbar strain during unassisted patient transfer in East Wing. Inadequate lift equipment available at time of incident. OSHA 301 and workers' comp required.
                  </div>
                )}
              </div>

              {/* Recommended actions */}
              {showActions && (
                <div style={{
                  background: "white", borderRadius: 18, padding: "24px 28px",
                  border: "1.5px solid #e2e8f0",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  opacity: fade(frame, 250),
                  transform: `translateX(${slideIn(frame, 250, 20, 24)}px)`,
                }}>
                  <p style={{ color: "#64748b", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 18 }}>
                    Recommended Actions
                  </p>
                  {[
                    { i: 0, text: "Complete OSHA Form 301 within 7 calendar days" },
                    { i: 1, text: "Initiate workers' compensation filing immediately" },
                    { i: 2, text: "Conduct equipment audit — East Wing lift devices" },
                    { i: 3, text: "Schedule ergonomics review for patient transfer protocols" },
                    { i: 4, text: "Add to OSHA 300 Log under musculoskeletal category" },
                  ].map(({ i, text }) => (
                    <div key={i} style={{
                      display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14,
                      opacity: fade(frame, 265 + i * 18),
                      transform: `translateX(${slideIn(frame, 265 + i * 18, 18, 16)}px)`,
                    }}>
                      <span style={{ color: TEAL, fontWeight: 800, fontSize: 18, marginTop: 1, flexShrink: 0 }}>→</span>
                      <span style={{ color: "#334155", fontSize: 15, lineHeight: 1.4 }}>{text}</span>
                    </div>
                  ))}

                  {frame > 400 && (
                    <div style={{
                      marginTop: 20,
                      opacity: fade(frame, 400),
                      background: `${TEAL}10`, border: `1.5px solid ${TEAL}33`,
                      borderRadius: 10, padding: "12px 16px",
                      color: TEAL, fontSize: 14, fontWeight: 600, textAlign: "center",
                    }}>
                      All of this — in under 3 seconds from submission
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
