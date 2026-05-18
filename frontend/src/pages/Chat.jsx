import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { chat as chatApi } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

const SUGGESTIONS = [
  {
    icon: "🧘",
    title: "Breathing Exercise",
    prompt: "Guide me through a calming 4-7-8 breathing session.",
  },
  {
    icon: "💬",
    title: "Talk It Out",
    prompt: "I need someone to listen without judgment.",
  },
  {
    icon: "📓",
    title: "Mood Journal",
    prompt: "Help me reflect and log how I'm feeling today.",
  },
  {
    icon: "🔬",
    title: "CBT Technique",
    prompt: "Walk me through a cognitive reframing exercise.",
  },
];

const QUICK_CHIPS = [
  "Try a breathing exercise",
  "I need to talk",
  "Log my mood",
  "CBT exercise",
  "Feeling anxious",
];

const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function TypingDots() {
  return (
    <div className="flex gap-[5px] items-center px-4 py-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-[7px] h-[7px] rounded-full bg-[#22B1D4]"
          style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </div>
  );
}

function Bubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div
      className={`flex gap-[10px] max-w-[660px] ${isUser ? "ml-auto flex-row-reverse" : ""}`}
    >
      {!isUser && (
        <div className="w-9 h-9 rounded-full bg-[#E8F8FC] flex items-center justify-center shrink-0 mt-0.5 border border-[#D4EEF7]">
          <img
            src="/logo.png"
            alt="Serene"
            className="w-5 h-5 object-contain"
          />
        </div>
      )}
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-[11px] rounded-[18px] text-[14px] leading-[1.6] shadow-sm max-w-[480px] ${
            isUser
              ? "bg-gradient-to-br from-[#22B1D4] to-[#189AB4] text-white rounded-tr-[4px]"
              : "bg-white border border-[#E4EEF3] text-[#1F2933] rounded-tl-[4px]"
          }`}
        >
          {isUser ? (
            <span>{msg.content}</span>
          ) : (
            <div className="prose prose-sm max-w-none [&_p]:my-1 [&_p:last-child]:mb-0 [&_strong]:font-bold [&_ul]:pl-4 [&_ol]:pl-4 [&_li]:mb-1 [&_code]:bg-[#E8F8FC] [&_code]:px-1 [&_code]:rounded [&_code]:text-xs [&_blockquote]:border-l-2 [&_blockquote]:border-[#D4EEF7] [&_blockquote]:pl-2 [&_blockquote]:text-[#52606D]">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          )}
        </div>
        <span className="text-[10px] text-[#9AA5B1] mt-1 px-1">
          {fmtTime(msg.created_at || new Date().toISOString())}
        </span>
      </div>
    </div>
  );
}

export default function Chat() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState("home");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);
  const [renaming, setRenaming] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const messagesEndRef = useRef(null);

  const displayName = user?.first_name || user?.username || "there";

  useEffect(() => {
    chatApi
      .list()
      .then((d) => setConversations(Array.isArray(d) ? d : (d?.results ?? [])))
      .catch(console.error)
      .finally(() => setLoadingConvs(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Close context menu on outside click
  useEffect(() => {
    const close = () => setMenuOpen(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const loadConversation = async (id) => {
    try {
      const data = await chatApi.detail(id);
      setMessages(data.messages || []);
      setActiveConvId(id);
      setView("chat");
    } catch (e) {
      console.error(e);
    }
  };

  const handleSend = async (text) => {
    const msg = (text || message).trim();
    if (!msg || loading) return;

    const userMsg = {
      id: `tmp-${Date.now()}`,
      role: "user",
      content: msg,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setView("chat");
    setLoading(true);

    try {
      const data = await chatApi.send({
        content: msg,
        conversation_id: activeConvId || null,
      });

      if (!activeConvId) {
        setActiveConvId(data.conversation_id);
        chatApi
          .list()
          .then((d) =>
            setConversations(Array.isArray(d) ? d : (d?.results ?? [])),
          );
      }

      const aiContent =
        data.message && typeof data.message === "object"
          ? data.message.content
          : data.reply || data.message || "";

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: aiContent,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again in a moment.",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async (id) => {
    if (!renameValue.trim()) {
      setRenaming(null);
      return;
    }
    try {
      await chatApi.rename(id, renameValue.trim());
      setConversations((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, title: renameValue.trim() } : c,
        ),
      );
    } catch (e) {
      console.error(e);
    } finally {
      setRenaming(null);
      setMenuOpen(null);
      setRenameValue("");
    }
  };

  const handleDelete = async (id) => {
    try {
      await chatApi.delete(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConvId === id) startNewChat();
    } catch (e) {
      console.error(e);
    } finally {
      setMenuOpen(null);
    }
  };

  const startNewChat = () => {
    setView("home");
    setMessages([]);
    setActiveConvId(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        @keyframes orb-pulse { 0%,100%{transform:scale(1);opacity:.88} 50%{transform:scale(1.07);opacity:1} }
        .orb-anim { animation: orb-pulse 4s ease-in-out infinite; }
        .sb-scroll::-webkit-scrollbar { width: 4px; }
        .sb-scroll::-webkit-scrollbar-thumb { background: #E4EEF3; border-radius: 4px; }
        .msg-scroll::-webkit-scrollbar { width: 4px; }
        .msg-scroll::-webkit-scrollbar-thumb { background: #E4EEF3; border-radius: 4px; }
        .no-sb::-webkit-scrollbar { display: none; }
      `}</style>

      <div
        className="flex h-screen bg-[#F8FAFC] overflow-hidden text-[#1F2933]"
        style={{ fontFamily: "'Nunito', 'DM Sans', sans-serif" }}
      >
        {/* ── SIDEBAR ── */}
        <aside
          className={`flex flex-col bg-white border-r border-[#E4EEF3] shrink-0 transition-all duration-300 overflow-hidden ${
            sidebarOpen ? "w-[268px] min-w-[268px]" : "w-0 min-w-0"
          }`}
        >
          {/* Brand + New Chat */}
          <div className="p-4 pb-3 border-b border-[#E4EEF3]">
            <div className="flex items-center justify-between mb-3">
              <Link to="/" className="flex items-center gap-2.5 no-underline">
                <img
                  src="/logo.png"
                  alt="Serene"
                  className="w-8 h-8 object-contain"
                />
                <span
                  className="text-[18px] font-bold text-[#1F2933]"
                  style={{ fontFamily: "serif" }}
                >
                  Serene
                </span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9AA5B1] hover:bg-[#E8F8FC] hover:text-[#22B1D4] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  chevron_left
                </span>
              </button>
            </div>
            <button
              onClick={startNewChat}
              className="w-full flex items-center justify-center gap-1.5 py-[9px] rounded-[10px] text-white text-[13px] font-bold shadow-[0_3px_12px_rgba(34,177,212,.3)] hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg,#22B1D4,#189AB4)" }}
            >
              <span className="material-symbols-outlined text-[17px]">add</span>
              New chat
            </button>
          </div>

          {/* Search */}
          <div className="mx-4 mt-3 flex items-center gap-2 bg-[#F8FAFC] border border-[#E4EEF3] rounded-[9px] px-3 py-[7px]">
            <span className="material-symbols-outlined text-[16px] text-[#9AA5B1]">
              search
            </span>
            <input
              placeholder="Search conversations…"
              className="flex-1 bg-transparent border-none outline-none text-[13px] text-[#1F2933] placeholder:text-[#9AA5B1]"
            />
          </div>

          {/* Nav items */}
          <div className="px-[10px] pt-2 pb-1">
            <button
              onClick={startNewChat}
              className={`flex items-center gap-2.5 w-full px-[10px] py-2 rounded-[9px] text-[13px] font-semibold transition-colors ${
                view === "home"
                  ? "bg-[#E8F8FC] text-[#22B1D4]"
                  : "text-[#52606D] hover:bg-[#E8F8FC] hover:text-[#22B1D4]"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                home
              </span>
              Home
            </button>
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 w-full px-[10px] py-2 rounded-[9px] text-[13px] font-semibold text-[#52606D] hover:bg-[#E8F8FC] hover:text-[#22B1D4] transition-colors no-underline"
            >
              <span className="material-symbols-outlined text-[18px]">
                dashboard
              </span>
              Dashboard
            </Link>
          </div>

          {/* History list */}
          <div className="flex-1 overflow-y-auto px-[10px] pb-2 sb-scroll">
            {loadingConvs ? (
              <p className="text-[12px] text-[#9AA5B1] px-2 pt-3">Loading…</p>
            ) : conversations.length === 0 ? (
              <p className="text-[12px] text-[#9AA5B1] px-2 pt-3">
                No conversations yet.
              </p>
            ) : (
              <>
                <p className="text-[10px] font-extrabold text-[#9AA5B1] uppercase tracking-[.8px] px-1.5 pt-[10px] pb-1">
                  Recent
                </p>
                {conversations.map((c) => (
                  <div
                    key={c.id}
                    className={`relative group flex items-center rounded-[8px] transition-colors mb-0.5 ${
                      activeConvId === c.id
                        ? "bg-[#E8F8FC] text-[#22B1D4]"
                        : "text-[#52606D] hover:bg-[#E8F8FC] hover:text-[#22B1D4]"
                    }`}
                  >
                    {renaming === c.id ? (
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRename(c.id);
                          if (e.key === "Escape") {
                            setRenaming(null);
                            setMenuOpen(null);
                          }
                        }}
                        onBlur={() => handleRename(c.id)}
                        className="flex-1 mx-2 my-1 px-2 py-1 text-[12.5px] rounded-md border border-[#22B1D4] outline-none text-[#1F2933] bg-white"
                      />
                    ) : (
                      <button
                        onClick={() => loadConversation(c.id)}
                        className="flex-1 text-left px-[10px] py-[6px] text-[12.5px] font-medium truncate"
                      >
                        {c.title || "Untitled chat"}
                      </button>
                    )}

                    {/* Three-dot menu trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(menuOpen === c.id ? null : c.id);
                      }}
                      className={`shrink-0 mr-1 w-6 h-6 rounded flex items-center justify-center text-[#9AA5B1] hover:text-[#22B1D4] transition-opacity ${
                        menuOpen === c.id
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        more_horiz
                      </span>
                    </button>

                    {/* Dropdown */}
                    {menuOpen === c.id && (
                      <div
                        className="absolute right-0 top-8 z-50 bg-white border border-[#E4EEF3] rounded-xl shadow-lg overflow-hidden w-36"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            setRenaming(c.id);
                            setRenameValue(c.title || "");
                            setMenuOpen(null);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-[#52606D] hover:bg-[#E8F8FC] hover:text-[#22B1D4] transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            edit
                          </span>
                          Rename
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            delete
                          </span>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Profile + logout */}
          <div className="flex items-center gap-[9px] px-[14px] py-3 border-t border-[#E4EEF3] hover:bg-[#F8FAFC] transition-colors cursor-default">
            <div
              className="w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 border-2 border-[#E4EEF3]"
              style={{ background: "linear-gradient(135deg,#E8F8FC,#22B1D4)" }}
            >
              <span className="material-symbols-outlined text-white text-[18px]">
                person
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-bold text-[#1F2933] truncate">
                {displayName}
              </p>
              <p className="text-[11px] text-[#9AA5B1] truncate">
                {user?.email || ""}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="text-[#9AA5B1] hover:text-[#22B1D4] transition-colors border-none bg-transparent"
            >
              <span className="material-symbols-outlined text-[18px]">
                logout
              </span>
            </button>
          </div>
        </aside>

        {/* ── MAIN AREA ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <div className="h-14 bg-white border-b border-[#E4EEF3] flex items-center justify-between px-5 shrink-0">
            <div className="flex items-center gap-2.5">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[#9AA5B1] hover:bg-[#E8F8FC] hover:text-[#22B1D4] transition-colors"
                >
                  <span className="material-symbols-outlined">menu</span>
                </button>
              )}
              <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E4EEF3] rounded-full px-3 py-[5px]"></div>
            </div>
            <button
              onClick={startNewChat}
              className="flex items-center gap-1.5 h-[34px] px-3 rounded-[8px] border border-[#E4EEF3] text-[13px] font-semibold text-[#52606D] hover:bg-[#E8F8FC] hover:text-[#22B1D4] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Chat
            </button>
          </div>

          {/* ── HOME VIEW ── */}
          {view === "home" && (
            <div className="flex-1 flex flex-col items-center overflow-y-auto px-6 pt-10 pb-6">
              {/* Orb */}
              <div
                className="w-[110px] h-[110px] rounded-full mb-5 orb-anim relative"
                style={{
                  background:
                    "radial-gradient(circle at 38% 35%, rgba(34,177,212,.6) 0%, rgba(34,177,212,.28) 40%, rgba(34,177,212,.08) 70%, transparent 100%)",
                  boxShadow:
                    "0 0 60px rgba(34,177,212,.22), inset 0 0 30px rgba(255,255,255,.25)",
                }}
              >
                <div className="absolute top-[14%] left-[18%] w-[38%] h-[26%] bg-white/50 rounded-full blur-[7px]" />
              </div>

              <p
                className="text-[28px] italic text-[#22B1D4] mb-1 font-semibold"
                style={{ fontFamily: "serif" }}
              >
                Hello, {displayName}
              </p>
              <p className="text-[26px] font-bold text-[#1F2933] mb-8 text-center">
                How can I assist you today?
              </p>

              {/* Input card */}
              <div className="w-full max-w-[680px] bg-white border border-[#E4EEF3] rounded-[18px] shadow-[0_4px_28px_rgba(0,0,0,.07)] overflow-hidden">
                <div className="px-4 py-[10px]">
                  <textarea
                    value={message}
                    rows={3}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="How are you feeling today?"
                    className="w-full bg-transparent border-none outline-none resize-none text-[15px] text-[#1F2933] placeholder:text-[#9AA5B1] leading-[1.55] min-h-[80px] max-h-[180px]"
                  />
                </div>
                <div className="flex items-center justify-between px-4 py-[8px] border-t border-[#E4EEF3]">
                  <span className="text-[11px] text-[#9AA5B1]">
                    Shift+Enter for new line
                  </span>
                  <button
                    onClick={() => handleSend()}
                    disabled={!message.trim() || loading}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      message.trim() && !loading
                        ? "text-white shadow-[0_4px_12px_rgba(34,177,212,.4)]"
                        : "bg-[#F8FAFC] text-[#9AA5B1] cursor-not-allowed"
                    }`}
                    style={
                      message.trim() && !loading
                        ? {
                            background:
                              "linear-gradient(135deg,#22B1D4,#189AB4)",
                          }
                        : {}
                    }
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_upward
                    </span>
                  </button>
                </div>
              </div>

              {/* Suggestion cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[10px] w-full max-w-[680px] mt-[14px]">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.title}
                    onClick={() => handleSend(s.prompt)}
                    className="bg-white border border-[#E4EEF3] rounded-2xl p-4 text-left hover:border-[#D4EEF7] hover:shadow-[0_4px_16px_rgba(34,177,212,.12)] hover:-translate-y-0.5 transition-all"
                  >
                    <div className="text-[22px] mb-2">{s.icon}</div>
                    <div className="text-[13px] font-bold text-[#1F2933] mb-1">
                      {s.title}
                    </div>
                    <div className="text-[11px] text-[#9AA5B1] leading-[1.5]">
                      {s.desc}
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-[#9AA5B1] mt-[10px] pb-2">
                Serene is not a substitute for professional medical advice.
              </p>
            </div>
          )}

          {/* ── CHAT VIEW ── */}
          {view === "chat" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-7 flex flex-col gap-[18px] msg-scroll">
                <div className="flex justify-center">
                  <span className="bg-white border border-[#E4EEF3] rounded-full px-4 py-1 text-[11px] font-semibold text-[#9AA5B1]">
                    Today
                  </span>
                </div>

                {messages.map((msg, i) => (
                  <Bubble key={msg.id || i} msg={msg} />
                ))}

                {loading && (
                  <div className="flex gap-[10px]">
                    <div className="w-9 h-9 rounded-full bg-[#E8F8FC] flex items-center justify-center shrink-0 mt-0.5 border border-[#D4EEF7]">
                      <img
                        src="/logo.png"
                        alt="Serene"
                        className="w-5 h-5 object-contain"
                      />
                    </div>
                    <div className="bg-white border border-[#E4EEF3] rounded-[18px] rounded-tl-[4px] shadow-sm">
                      <TypingDots />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="px-5 pb-4 pt-[10px] bg-white border-t border-[#E4EEF3] shrink-0">
                <div className="flex gap-2 overflow-x-auto no-sb pb-[10px]">
                  {QUICK_CHIPS.map((p) => (
                    <button
                      key={p}
                      onClick={() => handleSend(p)}
                      className="shrink-0 text-[12px] font-bold text-[#22B1D4] border-[1.5px] border-[rgba(34,177,212,.3)] bg-white px-[13px] py-[5px] rounded-full hover:bg-[#E8F8FC] hover:border-[#22B1D4] transition-all whitespace-nowrap"
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div className="flex items-end bg-[#F8FAFC] border-[1.5px] border-[#E4EEF3] rounded-2xl overflow-hidden focus-within:border-[#22B1D4] focus-within:shadow-[0_0_0_3px_rgba(34,177,212,.1)] transition-all">
                  <textarea
                    value={message}
                    rows={1}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type your message…"
                    className="flex-1 bg-transparent border-none outline-none px-3 py-3 resize-none text-[14px] text-[#1F2933] placeholder:text-[#9AA5B1] min-h-[48px] max-h-[120px] leading-[1.5]"
                  />
                  <div className="flex items-center gap-1 px-[10px] py-2">
                    <button className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[#9AA5B1] hover:bg-[#E8F8FC] hover:text-[#22B1D4] transition-colors">
                      <span className="material-symbols-outlined text-[18px]">
                        attach_file
                      </span>
                    </button>
                    <button className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[#9AA5B1] hover:bg-[#E8F8FC] hover:text-[#22B1D4] transition-colors">
                      <span className="material-symbols-outlined text-[18px]">
                        mic_none
                      </span>
                    </button>
                    <button
                      onClick={() => handleSend()}
                      disabled={!message.trim() || loading}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        message.trim() && !loading
                          ? "text-white shadow-[0_3px_12px_rgba(34,177,212,.4)]"
                          : "bg-[#E4EEF3] text-[#9AA5B1] cursor-not-allowed"
                      }`}
                      style={
                        message.trim() && !loading
                          ? {
                              background:
                                "linear-gradient(135deg,#22B1D4,#189AB4)",
                            }
                          : {}
                      }
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_upward
                      </span>
                    </button>
                  </div>
                </div>
                <p className="text-center text-[10px] text-[#B8C4CE] mt-2">
                  Serene AI can make mistakes. If you're in crisis, call iCall:
                  9152987821
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
