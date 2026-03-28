import { createContext, useContext, useState, useEffect } from "react";
import { mockCases, mockUsers } from "../data/mockData";
import { mockReviewers } from "../data/mockData";

function readStorage(key, fallback) {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch {
    return fallback;
  }
}

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => readStorage("iq_user", null));
  const [cases, setCases] = useState(() => readStorage("iq_cases", mockCases));
  const [drafts, setDrafts] = useState(() => readStorage("iq_drafts", []));

  useEffect(() => { localStorage.setItem("iq_cases", JSON.stringify(cases)); }, [cases]);
  useEffect(() => { localStorage.setItem("iq_drafts", JSON.stringify(drafts)); }, [drafts]);
  useEffect(() => {
    if (user) localStorage.setItem("iq_user", JSON.stringify(user));
    else localStorage.removeItem("iq_user");
  }, [user]);

  function login(role) {
    const found = mockUsers.find((u) => u.role === role);
    setUser(found);
  }

  function logout() {
    setUser(null);
  }

  function submitCase(formData) {
    const now = new Date().toISOString();
    const newCase = {
      ...formData,
      id: `CASE-${new Date().getFullYear()}-${String(cases.length + 1).padStart(3, "0")}`,
      submittedBy: user?.name || "Unknown",
      submittedAt: now,
      reviewStatus: "Pending",
      workersCompStatus: "None",
      osha300Status: "Pending",
      osha301Status: "Pending",
      employeeStatus: "At Work",
      expectedReturn: null,
      caseStatus: "Open",
      reviewer: null,
      auditTrail: [{ action: "Case created", by: user?.name || "Unknown", at: now }],
    };
    setCases((prev) => [newCase, ...prev]);

    // Fire-and-forget email to admin
    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "new_case", caseData: newCase }),
    }).catch(() => {});

    // AI triage via n8n — updates the case when result returns
    fetch("/api/triage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caseData: newCase }),
    })
      .then((r) => r.json())
      .then((triage) => {
        setCases((prev) =>
          prev.map((c) => (c.id === newCase.id ? { ...c, triage } : c))
        );
      })
      .catch(() => {});

    return newCase;
  }

  function addNote(caseId, text, requiresAction) {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        const now = new Date().toISOString();
        const note = {
          id: Date.now(),
          text,
          by: user?.name || "Admin",
          at: now,
          requiresAction,
        };
        const auditEntry = {
          action: requiresAction
            ? `Action requested: "${text.slice(0, 80)}${text.length > 80 ? "…" : ""}"`
            : `Note added: "${text.slice(0, 80)}${text.length > 80 ? "…" : ""}"`,
          by: user?.name || "Admin",
          at: now,
        };
        return {
          ...c,
          notes: [...(c.notes || []), note],
          auditTrail: [...(c.auditTrail || []), auditEntry],
        };
      })
    );
  }

  function dismissNote(caseId, noteId) {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          notes: (c.notes || []).map((n) =>
            n.id === noteId ? { ...n, dismissed: true } : n
          ),
        };
      })
    );
  }

  function updateCase(caseId, updates, actionLabel) {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        const entry = {
          action: actionLabel,
          by: user?.name || "System",
          at: new Date().toISOString(),
        };
        return {
          ...c,
          ...updates,
          auditTrail: [...(c.auditTrail || []), entry],
        };
      })
    );
  }

  function saveDraft(formData) {
    // Stable ID per user+form-type so repeated saves replace, not accumulate
    const draftId = `DRAFT-${user?.name || "unknown"}-${formData.injuryType || "incident"}`;
    const draft = { ...formData, draftId, savedAt: new Date().toISOString() };
    setDrafts((prev) => [...prev.filter((d) => d.draftId !== draftId), draft]);
    return draft;
  }

  return (
    <AppContext.Provider value={{ user, login, logout, cases, submitCase, updateCase, addNote, dismissNote, drafts, saveDraft, reviewers: mockReviewers }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
