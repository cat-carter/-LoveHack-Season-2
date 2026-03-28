import { useCurrentFrame, interpolate } from "remotion";

const NAVY = "#0f2d52";
const TEAL = "#0d9488";

function fade(frame, start, dur = 18) {
  return interpolate(frame - start, [0, dur], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
}

const STEPS = ["Incident Details", "Injury Information", "Medical Evaluation", "Review & Submit"];

export function IncidentFormScene() {
  const frame = useCurrentFrame();

  // Typing sequences (local frames):
  // frame 0-20: page fades in, step 1 active
  // frame ~70 (abs 760): cursor clicks injury type dropdown → opens
  // frame ~100: cursor clicks "Musculoskeletal" option
  // frame ~140: cursor clicks location field
  // frame ~180-300: location types
  // frame ~250: cursor clicks description textarea
  // frame ~275-420: description types
  // frame ~430: AI coach sparkle appears

  const injuryDropdownOpen = frame > 70 && frame < 105;
  const injurySelected = frame >= 105;

  const locationChars = Math.max(0, Math.floor((frame - 145) * 0.8));
  const location = "East Wing, Room 214 – Patient Transfer Area".slice(0, locationChars);

  const descChars = Math.max(0, Math.floor((frame - 260) * 0.55));
  const fullDesc = "While transferring patient from bed to wheelchair in Room 214, I felt sharp pain in my lower back. No mechanical lift was available at the time. Another staff member witnessed the incident. I reported to the charge nurse immediately.";
  const description = fullDesc.slice(0, descChars);

  const showCoach = frame > 400;
  const coachOpacity = fade(frame, 400);

  const showSuggestion = frame > 430;

  // Cursor is near location at ~145, textarea at ~260
  const cursorNearLocation = frame > 130 && frame < 200;
  const cursorNearDesc = frame > 245 && frame < 310;

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
        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Staff Portal</span>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>/</span>
        <span style={{ color: "white", fontSize: 14, fontWeight: 600 }}>New Incident Report</span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "hidden", display: "flex", justifyContent: "center", padding: "40px 40px" }}>
        <div style={{ width: 720 }}>

          {/* Step indicator */}
          <div style={{
            display: "flex", alignItems: "center", gap: 0, marginBottom: 36,
            opacity: fade(frame, 0),
          }}>
            {STEPS.map((step, i) => (
              <div key={step} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: i === 0 ? NAVY : i < 1 ? TEAL : "#e2e8f0",
                    border: `2.5px solid ${i === 0 ? NAVY : i < 1 ? TEAL : "#e2e8f0"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: i <= 0 ? "white" : "#94a3b8",
                    fontSize: 13, fontWeight: 800,
                    marginBottom: 6,
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ color: i === 0 ? NAVY : "#94a3b8", fontSize: 11, fontWeight: i === 0 ? 700 : 500, textAlign: "center", lineHeight: 1.3 }}>
                    {step}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ height: 2, flex: 1, background: "#e2e8f0", marginBottom: 22 }} />
                )}
              </div>
            ))}
          </div>

          {/* Form card */}
          <div style={{
            background: "white", borderRadius: 20, border: "1.5px solid #e2e8f0",
            padding: "36px 40px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            opacity: fade(frame, 8),
          }}>
            <h2 style={{ color: "#1e293b", fontSize: 22, fontWeight: 900, marginBottom: 4 }}>Incident Details</h2>
            <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 32 }}>Tell us what happened, when, and where.</p>

            {/* Date / Shift row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              <div>
                <label style={{ display: "block", color: "#475569", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
                  Date of Incident
                </label>
                <div style={{
                  background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: 12,
                  padding: "12px 16px", fontSize: 16, color: "#1e293b",
                }}>
                  March 20, 2026
                </div>
              </div>
              <div>
                <label style={{ display: "block", color: "#475569", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
                  Shift
                </label>
                <div style={{
                  background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: 12,
                  padding: "12px 16px", fontSize: 16, color: "#1e293b",
                }}>
                  Morning (7am–3pm)
                </div>
              </div>
            </div>

            {/* Injury Type dropdown */}
            <div style={{ marginBottom: 24, position: "relative" }}>
              <label style={{ display: "block", color: "#475569", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
                Type of Injury / Illness
              </label>
              <div style={{
                background: "white",
                border: `2px solid ${injurySelected ? TEAL : injuryDropdownOpen ? NAVY : "#e2e8f0"}`,
                borderRadius: 12, padding: "12px 16px", fontSize: 16,
                color: injurySelected ? "#1e293b" : "#94a3b8",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                cursor: "pointer",
              }}>
                <span>{injurySelected ? "Musculoskeletal Injury" : "Select injury type…"}</span>
                <span style={{ color: "#94a3b8", fontSize: 12 }}>▼</span>
              </div>
              {injuryDropdownOpen && (
                <div style={{
                  position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10,
                  background: "white", borderRadius: 12,
                  border: "1.5px solid #e2e8f0",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  overflow: "hidden",
                  marginTop: 4,
                }}>
                  {["Musculoskeletal Injury", "Slip and Fall", "Cut / Laceration", "Illness / Exposure", "Property Damage", "Near Miss", "Other"].map((opt, i) => (
                    <div key={opt} style={{
                      padding: "12px 18px", fontSize: 15,
                      color: i === 0 ? NAVY : "#334155",
                      background: i === 0 ? "#eff6ff" : "white",
                      fontWeight: i === 0 ? 700 : 400,
                      cursor: "pointer",
                      borderBottom: i < 6 ? "1px solid #f1f5f9" : "none",
                    }}>
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", color: "#475569", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
                Location
              </label>
              <div style={{
                background: "white",
                border: `2px solid ${cursorNearLocation ? TEAL : "#e2e8f0"}`,
                borderRadius: 12, padding: "12px 16px", fontSize: 16, color: "#1e293b",
                minHeight: 50, display: "flex", alignItems: "center",
              }}>
                {location || <span style={{ color: "#cbd5e1" }}>e.g. East Wing, Room 214</span>}
                {cursorNearLocation && location.length < "East Wing, Room 214 – Patient Transfer Area".length && (
                  <span style={{ display: "inline-block", width: 2, height: 18, background: NAVY, marginLeft: 2, animation: "none", opacity: 1 }} />
                )}
              </div>
            </div>

            {/* Description textarea */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", color: "#475569", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
                Description of Incident
              </label>
              <div style={{
                background: "white",
                border: `2px solid ${cursorNearDesc ? TEAL : "#e2e8f0"}`,
                borderRadius: 12, padding: "14px 16px", fontSize: 15, color: "#1e293b",
                minHeight: 100, lineHeight: 1.6,
              }}>
                {description || <span style={{ color: "#cbd5e1" }}>Describe what happened in your own words…</span>}
                {cursorNearDesc && description.length < fullDesc.length && (
                  <span style={{ display: "inline-block", width: 2, height: 16, background: NAVY, marginLeft: 2 }} />
                )}
              </div>

              {/* AI Coach */}
              {showCoach && (
                <div style={{ marginTop: 12, opacity: coachOpacity }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    color: TEAL, fontSize: 13, fontWeight: 600, marginBottom: showSuggestion ? 10 : 0,
                  }}>
                    <span>✨</span>
                    <span>Get writing tips</span>
                  </div>
                  {showSuggestion && (
                    <div style={{ marginTop: 8 }}>
                      <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
                        Click to add — then fill in the blanks:
                      </p>
                      {[
                        "I attempted to use proper body mechanics, however [describe what went wrong].",
                        "The patient weighed approximately [weight] lbs and was [mobility level].",
                      ].map((s, i) => (
                        <div key={i} style={{
                          background: "#f8fafc", border: "1px solid #e2e8f0",
                          borderRadius: 10, padding: "10px 14px",
                          color: "#475569", fontSize: 13, marginBottom: 8,
                          display: "flex", gap: 8,
                        }}>
                          <span style={{ color: TEAL, fontWeight: 700 }}>＋</span>
                          {s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Next button */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
            <div style={{
              background: NAVY, color: "white", borderRadius: 14,
              padding: "14px 36px", fontSize: 16, fontWeight: 700,
              display: "flex", alignItems: "center", gap: 10,
              opacity: fade(frame, 20),
            }}>
              Continue to Injury Information →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
