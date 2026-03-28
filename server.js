import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually (no dotenv dependency needed)
try {
  const env = readFileSync(join(__dirname, ".env"), "utf8");
  for (const line of env.split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
} catch {}

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Nodemailer transporter (Gmail) ────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function emailTemplates(type, c) {
  const facility = "Sunrise Nursing & Rehabilitation";
  const base = {
    from: `"IncidentIQ — ${facility}" <${process.env.GMAIL_USER}>`,
  };

  if (type === "new_case") {
    return {
      ...base,
      to: process.env.ADMIN_EMAIL,
      subject: `[IncidentIQ] New incident report submitted — ${c.id}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
          <div style="background:#0f2d52;padding:20px 24px;border-radius:8px 8px 0 0">
            <h1 style="color:white;font-size:18px;margin:0">IncidentIQ</h1>
            <p style="color:#93c5fd;font-size:12px;margin:4px 0 0">Incident Reporting & Safety Analytics</p>
          </div>
          <div style="border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 8px 8px">
            <p style="color:#0d9488;font-weight:700;font-size:14px;margin:0 0 16px">🆕 New Incident Report</p>
            <table style="width:100%;font-size:14px;border-collapse:collapse">
              <tr><td style="color:#64748b;padding:6px 0;width:140px">Case Number</td><td style="font-weight:600">${c.id}</td></tr>
              <tr><td style="color:#64748b;padding:6px 0">Employee</td><td>${c.employeeName}</td></tr>
              <tr><td style="color:#64748b;padding:6px 0">Incident Type</td><td>${c.injuryType}</td></tr>
              <tr><td style="color:#64748b;padding:6px 0">Date</td><td>${c.incidentDate} at ${c.incidentTime}</td></tr>
              <tr><td style="color:#64748b;padding:6px 0">Location</td><td>${c.incidentLocation}</td></tr>
            </table>
            <p style="font-size:13px;color:#475569;margin:16px 0 0">Log in to IncidentIQ to review this case and assign a reviewer.</p>
            <p style="font-size:11px;color:#94a3b8;margin:20px 0 0;padding-top:16px;border-top:1px solid #f1f5f9">${facility} · Automated notification from IncidentIQ</p>
          </div>
        </div>`,
    };
  }

  if (type === "reviewer_assigned") {
    return {
      ...base,
      to: process.env.STAFF_EMAIL,
      subject: `[IncidentIQ] Your report has been assigned — ${c.id}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
          <div style="background:#0f2d52;padding:20px 24px;border-radius:8px 8px 0 0">
            <h1 style="color:white;font-size:18px;margin:0">IncidentIQ</h1>
            <p style="color:#93c5fd;font-size:12px;margin:4px 0 0">Incident Reporting & Safety Analytics</p>
          </div>
          <div style="border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 8px 8px">
            <p style="color:#0d9488;font-weight:700;font-size:14px;margin:0 0 16px">👤 Reviewer Assigned</p>
            <p style="font-size:14px;margin:0 0 16px">Hi ${c.employeeName?.split(" ")[0]},</p>
            <p style="font-size:14px;margin:0 0 16px">Your incident report <strong>${c.id}</strong> has been assigned to <strong>${c.reviewer}</strong> for review.</p>
            <table style="width:100%;font-size:14px;border-collapse:collapse">
              <tr><td style="color:#64748b;padding:6px 0;width:140px">Case Number</td><td style="font-weight:600">${c.id}</td></tr>
              <tr><td style="color:#64748b;padding:6px 0">Incident Type</td><td>${c.injuryType}</td></tr>
              <tr><td style="color:#64748b;padding:6px 0">Submitted</td><td>${new Date(c.submittedAt).toLocaleDateString()}</td></tr>
              <tr><td style="color:#64748b;padding:6px 0">Assigned to</td><td>${c.reviewer}</td></tr>
            </table>
            <p style="font-size:13px;color:#475569;margin:16px 0 0">No action is needed from you at this time. You will receive another notification when your report has been reviewed.</p>
            <p style="font-size:11px;color:#94a3b8;margin:20px 0 0;padding-top:16px;border-top:1px solid #f1f5f9">${facility} · Automated notification from IncidentIQ</p>
          </div>
        </div>`,
    };
  }

  if (type === "case_reviewed") {
    return {
      ...base,
      to: process.env.STAFF_EMAIL,
      subject: `[IncidentIQ] Your report has been reviewed — ${c.id}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
          <div style="background:#0f2d52;padding:20px 24px;border-radius:8px 8px 0 0">
            <h1 style="color:white;font-size:18px;margin:0">IncidentIQ</h1>
            <p style="color:#93c5fd;font-size:12px;margin:4px 0 0">Incident Reporting & Safety Analytics</p>
          </div>
          <div style="border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 8px 8px">
            <p style="color:#0d9488;font-weight:700;font-size:14px;margin:0 0 16px">✅ Report Reviewed</p>
            <p style="font-size:14px;margin:0 0 16px">Hi ${c.employeeName?.split(" ")[0]},</p>
            <p style="font-size:14px;margin:0 0 16px">Your incident report <strong>${c.id}</strong> has been reviewed${c.reviewer ? ` by <strong>${c.reviewer}</strong>` : ""}.</p>
            <table style="width:100%;font-size:14px;border-collapse:collapse">
              <tr><td style="color:#64748b;padding:6px 0;width:140px">Case Number</td><td style="font-weight:600">${c.id}</td></tr>
              <tr><td style="color:#64748b;padding:6px 0">Incident Type</td><td>${c.injuryType}</td></tr>
              <tr><td style="color:#64748b;padding:6px 0">Status</td><td style="color:#0d9488;font-weight:600">Reviewed</td></tr>
            </table>
            <p style="font-size:13px;color:#475569;margin:16px 0 0">No further action is needed from you. If you have questions, please contact your administrator.</p>
            <p style="font-size:11px;color:#94a3b8;margin:20px 0 0;padding-top:16px;border-top:1px solid #f1f5f9">${facility} · Automated notification from IncidentIQ</p>
          </div>
        </div>`,
    };
  }

  return null;
}

// ─── POST /api/chat ────────────────────────────────────────────────────────
// AI Safety Assistant: answers admin questions using live case data
app.post("/api/chat", async (req, res) => {
  const { question, cases, stats } = req.body;

  const casesSummary = cases
    .map(
      (c) =>
        `• ${c.id}: ${c.employeeName} (${c.position}), ${c.injuryType}, ${c.incidentDate} ${c.incidentTime}, Location: ${c.incidentLocation}, Shift: ${c.shift}, Review: ${c.reviewStatus}, Case: ${c.caseStatus}, Employee: ${c.employeeStatus}`
    )
    .join("\n");

  const system = `You are SafeReport's AI Safety Analyst — an expert in workplace safety for nursing homes and long-term care facilities.
You have access to the facility's current incident data and help administrators identify trends, risks, and actions.
Be concise, specific, and actionable. Use bullet points where helpful. Reference case IDs and employee names when relevant.
Always maintain a supportive, non-punitive tone — the goal is to improve safety, not assign blame.`;

  const userMessage = `Here is the current incident data for this facility:

STATS:
- Total cases: ${stats.total}
- Open cases: ${stats.open}
- Pending review: ${stats.pending}
- Staff on leave: ${stats.onLeave}

CASE DETAILS:
${casesSummary}

ADMIN QUESTION: ${question}`;

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: userMessage }],
    });

    res.json({ answer: response.content[0].text });
  } catch (err) {
    console.error("Claude API error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/trend-narrative ─────────────────────────────────────────────
// Generates a plain-language weekly safety narrative for the dashboard
app.post("/api/trend-narrative", async (req, res) => {
  const { cases, injuryTypeData, incidentsOverTime, shiftData } = req.body;

  const openCases = cases.filter((c) => c.caseStatus === "Open");
  const pendingReview = cases.filter((c) => c.reviewStatus === "Pending");
  const onLeave = cases.filter((c) => c.employeeStatus === "On Leave");
  const recentMonth = incidentsOverTime[incidentsOverTime.length - 1];
  const prevMonth = incidentsOverTime[incidentsOverTime.length - 2];

  const prompt = `You are SafeReport's AI Safety Analyst for a nursing home facility. Generate a brief, plain-language weekly safety briefing for the administrator.

DATA:
- Incidents this month (${recentMonth?.month}): ${recentMonth?.value ?? recentMonth?.incidents}
- Incidents last month (${prevMonth?.month}): ${prevMonth?.value ?? prevMonth?.incidents}
- Open cases: ${openCases.length}
- Pending admin review: ${pendingReview.length}
- Staff currently on leave: ${onLeave.length} (${onLeave.map((c) => c.employeeName).join(", ") || "none"})

INJURY BREAKDOWN:
${injuryTypeData.map((d) => `- ${d.name}: ${d.value} incidents`).join("\n")}

SHIFT BREAKDOWN:
${shiftData.map((d) => `- ${d.shift} shift: ${d.incidents} incidents`).join("\n")}

Write a 3–4 sentence safety briefing that:
1. Notes the key trend (up/down/stable vs last month)
2. Highlights the most urgent item needing attention
3. Ends with one concrete, positive action the admin can take this week
Keep it warm, clear, and action-oriented. No headers or bullet points — flowing prose only.`;

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ narrative: response.content[0].text });
  } catch (err) {
    console.error("Claude API error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/coach ───────────────────────────────────────────────────────
// Smart form coach: proxies to n8n workflow (which calls Claude AI)
const N8N_COACH_URL = "https://cat-carter.app.n8n.cloud/webhook/form-coach";

app.post("/api/coach", async (req, res) => {
  const { description, injuryType, location, shift } = req.body;

  if (!description || description.trim().length < 10) {
    return res.json({ suggestions: [] });
  }

  try {
    const n8nRes = await fetch(N8N_COACH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        step: 1,
        formData: { description, injuryType, location, shift },
      }),
    });

    if (!n8nRes.ok) throw new Error(`n8n returned ${n8nRes.status}`);
    const data = await n8nRes.json();
    res.json(data);
  } catch (err) {
    console.error("n8n coach error:", err.message);
    res.status(500).json({ suggestions: [] });
  }
});

// ─── POST /api/triage ──────────────────────────────────────────────────────
// AI case triage: proxies to n8n workflow which calls Claude AI
const N8N_TRIAGE_URL = "https://cat-carter.app.n8n.cloud/webhook/triage-case";

app.post("/api/triage", async (req, res) => {
  const { caseData } = req.body;
  try {
    const n8nRes = await fetch(N8N_TRIAGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caseData }),
    });
    if (!n8nRes.ok) throw new Error(`n8n returned ${n8nRes.status}`);
    const data = await n8nRes.json();
    res.json(data);
  } catch (err) {
    console.error("n8n triage error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/notify ──────────────────────────────────────────────────────
// Sends email notifications via Gmail (Nodemailer)
// type: "new_case" | "reviewer_assigned" | "case_reviewed"
app.post("/api/notify", async (req, res) => {
  const { type, caseData } = req.body;

  if (!process.env.GMAIL_USER || process.env.GMAIL_USER === "your-gmail@gmail.com") {
    console.log(`[notify] Gmail not configured — skipping email (type: ${type})`);
    return res.json({ sent: false, reason: "Gmail not configured" });
  }

  const mail = emailTemplates(type, caseData);
  if (!mail) return res.status(400).json({ error: "Unknown notification type" });

  try {
    await transporter.sendMail(mail);
    console.log(`[notify] Email sent: ${type} for ${caseData.id} → ${mail.to}`);
    res.json({ sent: true });
  } catch (err) {
    console.error(`[notify] Email error:`, err.message);
    res.status(500).json({ sent: false, error: err.message });
  }
});

// ─── POST /api/osha-narrative ───────────────────────────────────────────────
// AI-drafts the 4 OSHA 301 narrative fields from incident data
app.post("/api/osha-narrative", async (req, res) => {
  const { caseData } = req.body;
  const c = caseData;

  const prompt = `You are completing an OSHA Form 301 Injury and Illness Incident Report for a nursing home facility. Based on the incident data below, write concise, factual, professional responses to the 4 required narrative questions. Each response should be 1-3 sentences in plain language appropriate for a government form. Do not add speculation beyond the facts provided.

INCIDENT DATA:
- Employee: ${c.employeeName}, ${c.position}
- Date/Time: ${c.incidentDate} at ${c.incidentTime} (${c.shift} shift)
- Location: ${c.incidentLocation}
- Injury Type: ${c.injuryType}
- Incident Description: ${c.injuryDescription}
- Symptoms Reported: ${c.symptoms}
- Medical Evaluation: ${c.medicalEvaluation ? "Yes" : "No"}${c.medicalDiagnosis ? " — Diagnosis: " + c.medicalDiagnosis : ""}

Respond with only this JSON object, no other text:
{
  "q1": "Answer to: What was the employee doing just before the incident occurred? Describe the task and any equipment or materials involved.",
  "q2": "Answer to: What happened? Tell us how the injury or illness occurred.",
  "q3": "Answer to: What was the injury or illness? Tell us the part of the body that was affected.",
  "q4": "Answer to: What object or substance directly harmed the employee? (e.g., concrete floor, chlorine, radial arm saw)"
}`;

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 700,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    const narratives = JSON.parse(jsonMatch[0]);
    res.json(narratives);
  } catch (err) {
    console.error("OSHA narrative error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`SafeReport AI server running on :${PORT}`));
