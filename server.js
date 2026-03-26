import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
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

const PORT = 3001;
app.listen(PORT, () => console.log(`SafeReport AI server running on :${PORT}`));
