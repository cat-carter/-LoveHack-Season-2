import { createContext, useContext, useState } from "react";
import { mockCases, mockUsers } from "../data/mockData";

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
    const newCase = {
      ...formData,
      id: `CASE-2025-${String(cases.length + 1).padStart(3, "0")}`,
      submittedBy: user?.name || "Unknown",
      submittedAt: new Date().toISOString(),
      reviewStatus: "Pending",
      workersCompStatus: "None",
      osha300Status: "Pending",
      osha301Status: "Pending",
      employeeStatus: "At Work",
      expectedReturn: null,
      caseStatus: "Open",
      reviewer: null,
    };
    setCases((prev) => [newCase, ...prev]);
    return newCase;
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
    <AppContext.Provider value={{ user, login, logout, cases, submitCase, drafts, saveDraft }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
