import { createContext, useContext, useState } from "react";
import { mockCases, mockUsers } from "../data/mockData";
import { mockReviewers } from "../data/mockData";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cases, setCases] = useState(mockCases);
  const [drafts, setDrafts] = useState([]);

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
      id: `CASE-2025-${String(cases.length + 1).padStart(3, "0")}`,
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

    return newCase;
  }

  function addNote(caseId, text, requiresAction) {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        const note = {
          id: Date.now(),
          text,
          by: user?.name || "Admin",
          at: new Date().toISOString(),
          requiresAction,
        };
        return {
          ...c,
          notes: [...(c.notes || []), note],
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
    const draft = {
      ...formData,
      draftId: `DRAFT-${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
    setDrafts((prev) => [...prev.filter((d) => d.draftId !== draft.draftId), draft]);
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
