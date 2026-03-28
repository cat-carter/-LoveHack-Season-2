import { useCurrentFrame, interpolate } from "remotion";

const NAVY = "#0f2d52";
const TEAL = "#0d9488";

export function LoginScene({ staffClick, adminClick }) {
  const frame = useCurrentFrame();

  // Email typed after cursor clicks (frame ~55 local = absolute 145)
  const emailChars = Math.max(0, Math.floor((frame - 55) * 0.6));
  const email = "m.santos@sunrisenursing.org".slice(0, emailChars);

  const passChars = Math.max(0, Math.floor((frame - 115) * 1.2));
  const pass = "••••••••".slice(0, passChars);

  const staffHighlight = staffClick && frame > staffClick - 90 - 90; // local
  const adminHighlight = adminClick && frame > adminClick - 30;

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", background: "#f8fafc" }}>
      {/* Left panel */}
      <div style={{
        width: "50%", background: `linear-gradient(135deg, ${NAVY} 0%, #1e6091 100%)`,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "52px 56px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22,
          }}>🛡️</div>
          <span style={{ color: "white", fontSize: 28, fontWeight: 800 }}>IncidentIQ</span>
        </div>

        <div>
          <p style={{ color: "#93c5fd", fontSize: 16, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, marginBottom: 20 }}>
            From incident to insight
          </p>
          <h1 style={{ color: "white", fontSize: 52, fontWeight: 900, lineHeight: 1.2, marginBottom: 24 }}>
            Smarter safety reporting<br />for nursing homes
          </h1>
          <p style={{ color: "#bfdbfe", fontSize: 20, lineHeight: 1.7, maxWidth: 420 }}>
            Up to 96% of near-misses go unreported. IncidentIQ makes reporting fast, guided, and non-punitive — turning incident data into actionable intelligence.
          </p>
          <div style={{ display: "flex", gap: 48, marginTop: 52 }}>
            {[["96%", "of near-misses go unreported"], ["600×", "near-misses per serious injury"], ["2 min", "average report time"]].map(([v, l]) => (
              <div key={v}>
                <p style={{ color: "white", fontSize: 36, fontWeight: 900 }}>{v}</p>
                <p style={{ color: "#93c5fd", fontSize: 14, marginTop: 4 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: "#60a5fa", fontSize: 15 }}>Sunrise Nursing &amp; Rehabilitation · Powered by IncidentIQ</p>
      </div>

      {/* Right panel */}
      <div style={{
        width: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "#f8fafc",
      }}>
        <div style={{ width: 420 }}>
          <p style={{ color: "#94a3b8", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, marginBottom: 4 }}>
            Sunrise Nursing &amp; Rehabilitation
          </p>
          <h2 style={{ color: "#1e293b", fontSize: 34, fontWeight: 900, marginBottom: 4 }}>Sign in</h2>
          <p style={{ color: "#94a3b8", fontSize: 17, marginBottom: 36 }}>Use your facility credentials to continue</p>

          {/* Email */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ color: "#475569", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, display: "block", marginBottom: 8 }}>
              Email address
            </label>
            <div style={{
              background: "white", border: "2px solid #e2e8f0", borderRadius: 14,
              padding: "14px 18px", fontSize: 18, color: "#1e293b",
              minHeight: 52, display: "flex", alignItems: "center",
            }}>
              {email || <span style={{ color: "#cbd5e1" }}>you@sunrisenursing.org</span>}
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{ color: "#475569", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>Password</label>
              <span style={{ color: TEAL, fontSize: 14, fontWeight: 600 }}>Forgot password?</span>
            </div>
            <div style={{
              background: "white", border: "2px solid #e2e8f0", borderRadius: 14,
              padding: "14px 18px", fontSize: 18, color: "#1e293b",
              minHeight: 52, display: "flex", alignItems: "center",
            }}>
              {pass || <span style={{ color: "#cbd5e1" }}>••••••••</span>}
            </div>
          </div>

          {/* Sign In */}
          <div style={{
            background: NAVY, color: "white", borderRadius: 14,
            padding: "18px 0", textAlign: "center",
            fontSize: 18, fontWeight: 700, marginBottom: 28,
          }}>
            Sign In
          </div>

          {/* Demo divider */}
          <div style={{ position: "relative", marginBottom: 20, display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            <span style={{ background: "#f8fafc", padding: "0 14px", color: "#94a3b8", fontSize: 14, fontWeight: 600 }}>Demo access</span>
            <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
          </div>

          {/* Demo buttons */}
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{
              flex: 1, border: `2.5px solid ${NAVY}`, color: NAVY,
              borderRadius: 14, padding: "16px 0", textAlign: "center",
              fontSize: 17, fontWeight: 700,
              background: staffHighlight ? "#e8f0f9" : "transparent",
              boxShadow: staffHighlight ? `0 0 0 3px ${NAVY}33` : "none",
              transition: "all 0.15s",
            }}>
              Frontline Staff
            </div>
            <div style={{
              flex: 1, border: `2.5px solid ${NAVY}`, color: NAVY,
              borderRadius: 14, padding: "16px 0", textAlign: "center",
              fontSize: 17, fontWeight: 700,
              background: adminHighlight ? "#e8f0f9" : "transparent",
              boxShadow: adminHighlight ? `0 0 0 3px ${NAVY}33` : "none",
              transition: "all 0.15s",
            }}>
              Administrator
            </div>
          </div>

          <div style={{ marginTop: 24, background: "#eff6ff", border: "1px solid #dbeafe", borderRadius: 14, padding: "16px 20px" }}>
            <p style={{ color: "#1d4ed8", fontSize: 15, textAlign: "center" }}>
              All reports are confidential. This facility maintains a <strong>non-punitive</strong> reporting culture.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
