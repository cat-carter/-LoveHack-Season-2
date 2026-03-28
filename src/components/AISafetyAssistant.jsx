import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Sparkles, X, Send } from "lucide-react";

const SUGGESTIONS = [
  "What's driving the increase in musculoskeletal injuries?",
  "Which shift has the most incidents and why?",
  "What should I prioritize this week?",
  "Are there any concerning trends I should act on?",
];

export default function AISafetyAssistant() {
  const { cases } = useApp();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const openCases = cases.filter((c) => c.caseStatus === "Open").length;
  const pendingReview = cases.filter((c) => c.reviewStatus === "Pending").length;
  const onLeave = cases.filter((c) => c.employeeStatus === "On Leave").length;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(question) {
    const q = question || input.trim();
    if (!q) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          cases,
          stats: { total: cases.length, open: openCases, pending: pendingReview, onLeave },
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages((prev) => [...prev, { role: "ai", text: data.answer }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", text: "Sorry, I couldn't reach the AI. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg flex items-center justify-center text-xl transition-all"
        title="AI Safety Assistant"
      >
        {open ? <X size={20} aria-hidden="true" /> : <Sparkles size={20} aria-hidden="true" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 z-50 sm:w-[380px] bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden"
          style={{ maxHeight: "70vh" }}>

          {/* Header */}
          <div className="bg-teal-600 px-5 py-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} aria-hidden="true" className="text-white" />
              <div>
                <p className="text-white font-semibold text-sm">AI Safety Assistant</p>
                <p className="text-teal-100 text-xs">Powered by Claude · Ask about your incident data</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div aria-live="polite" aria-label="AI Safety Assistant conversation" className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <div>
                <p className="text-xs text-slate-400 text-center mb-4">Ask a question about your facility's safety data</p>
                <div className="space-y-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="w-full text-left text-xs text-slate-600 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 hover:border-teal-200 rounded-xl px-3 py-2.5 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "ai" && (
                  <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center mr-2 mt-0.5 shrink-0"><Sparkles size={12} aria-hidden="true" className="text-teal-700" /></div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap
                  ${m.role === "user"
                    ? "bg-teal-600 text-white rounded-tr-sm"
                    : "bg-slate-50 text-slate-700 border border-slate-200 rounded-tl-sm"
                  }`}>
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center shrink-0"><Sparkles size={12} aria-hidden="true" className="text-teal-700" /></div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-100 px-4 py-3 flex gap-2">
            <input
              className="flex-1 text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-slate-50"
              placeholder="Ask about your safety data…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors"
              aria-label="Send message"
            >
              <Send size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
