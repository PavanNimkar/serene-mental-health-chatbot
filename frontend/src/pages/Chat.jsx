import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { chat as chatApi } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

export default function Chat() {
  const { user, logout } = useAuth();
  const [message, setMessage] = useState("");
  const [activeView, setActiveView] = useState("home");
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const messagesEndRef = useRef(null);

  const displayName = user?.display_name || user?.username || "there";

  // Load conversations on mount
  useEffect(() => {
    chatApi
      .list()
      .then((data) => setConversations(data.results || data))
      .catch(console.error)
      .finally(() => setLoadingConvs(false));
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversation = async (id) => {
    try {
      const data = await chatApi.detail(id);
      setMessages(data.messages || []);
      setActiveConvId(id);
      setActiveView("chat");
    } catch (e) {
      console.error(e);
    }
  };

  const handleSend = async (text) => {
    const msg = text || message;
    if (!msg.trim() || loading) return;

    const userMsg = {
      id: `tmp-${Date.now()}`,
      role: "user",
      content: msg,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setActiveView("chat");
    setLoading(true);

    try {
      const data = await chatApi.send({
        content: msg,
        conversation_id: activeConvId || null,
      });

      // Set conversation id if new
      if (!activeConvId) {
        setActiveConvId(data.conversation_id);
        // Refresh sidebar list
        chatApi.list().then((d) => setConversations(d.results || d));
      }

      setMessages((prev) => [...prev, data.message]);
    } catch (e) {
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

  const startNewChat = () => {
    setActiveView("home");
    setMessages([]);
    setActiveConvId(null);
  };

  const suggestions = [
    {
      icon: "🧘",
      title: "Breathing Exercise",
      desc: "Guide me through a calming 4-7-8 breathing session.",
    },
    {
      icon: "💬",
      title: "Talk It Out",
      desc: "I need someone to listen without judgment.",
    },
    {
      icon: "📓",
      title: "Mood Journal",
      desc: "Help me reflect and log how I'm feeling today.",
    },
    {
      icon: "🔬",
      title: "CBT Technique",
      desc: "Walk me through a cognitive reframing exercise.",
    },
  ];

  const quickChips = [
    "Try a breathing exercise",
    "I need to talk",
    "Log my mood",
    "CBT exercise",
    "Feeling anxious",
  ];

  const fmtTime = (iso) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Nunito:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons+Round');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --teal: #22B1D4; --teal-dark: #189AB4; --teal-deeper: #137A8F;
          --teal-soft: #E8F8FC; --teal-mid: #D4EEF7;
          --bg: #F8FAFC; --white: #ffffff; --border: #E4EEF3;
          --text: #1F2933; --muted: #52606D; --faint: #9AA5B1;
          --sidebar-w: 268px;
        }

        .app { display: flex; height: 100vh; font-family: 'Nunito', sans-serif; background: var(--bg); color: var(--text); overflow: hidden; }

        .sidebar { width: var(--sidebar-w); min-width: var(--sidebar-w); background: var(--white); border-right: 1px solid var(--border); display: flex; flex-direction: column; transition: width .28s ease, min-width .28s ease; overflow: hidden; }
        .sidebar.hidden { width: 0; min-width: 0; }

        .sb-top { padding: 18px 16px 14px; border-bottom: 1px solid var(--border); }
        .sb-brand { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .sb-brand-left { display: flex; align-items: center; gap: 10px; }
        .sb-title { font-family: 'Lora', serif; font-size: 18px; font-weight: 600; color: var(--text); }
        .sb-collapse { width: 28px; height: 28px; border-radius: 7px; border: none; background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--faint); transition: all .15s; }
        .sb-collapse:hover { background: var(--teal-soft); color: var(--teal); }
        .sb-collapse .material-icons-round { font-size: 20px; }

        .new-btn { width: 100%; background: linear-gradient(135deg, var(--teal), var(--teal-dark)); color: #fff; border: none; border-radius: 10px; padding: 9px 14px; font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 3px 12px rgba(34,177,212,.3); transition: opacity .15s; }
        .new-btn:hover { opacity: .9; }
        .new-btn .material-icons-round { font-size: 17px; }

        .sb-search { margin: 12px 16px 0; display: flex; align-items: center; gap: 8px; background: var(--bg); border: 1px solid var(--border); border-radius: 9px; padding: 7px 12px; }
        .sb-search .material-icons-round { font-size: 16px; color: var(--faint); }
        .sb-search input { flex: 1; background: none; border: none; outline: none; font-family: 'Nunito', sans-serif; font-size: 13px; color: var(--text); }
        .sb-search input::placeholder { color: var(--faint); }

        .sb-nav { padding: 10px 10px 4px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 9px; font-size: 13px; font-weight: 600; color: var(--muted); cursor: pointer; transition: all .15s; border: none; background: none; width: 100%; font-family: 'Nunito', sans-serif; }
        .nav-item:hover { background: var(--teal-soft); color: var(--teal); }
        .nav-item.active { background: var(--teal-soft); color: var(--teal); }
        .nav-item .material-icons-round { font-size: 18px; }

        .sb-body { flex: 1; overflow-y: auto; padding: 4px 10px 8px; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
        .hist-label { font-size: 10px; font-weight: 800; color: var(--faint); text-transform: uppercase; letter-spacing: .8px; padding: 10px 6px 4px; }
        .hist-item { display: block; width: 100%; text-align: left; border: none; background: none; padding: 6px 10px; border-radius: 8px; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: 12.5px; color: var(--muted); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: all .15s; }
        .hist-item:hover { background: var(--teal-soft); color: var(--teal); }
        .hist-item.active { background: var(--teal-soft); color: var(--teal); font-weight: 700; }

        .sb-profile { padding: 12px 14px; border-top: 1px solid var(--border); display: flex; align-items: center; gap: 9px; cursor: pointer; transition: background .15s; }
        .sb-profile:hover { background: var(--bg); }
        .sb-avatar { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border); flex-shrink: 0; background: var(--teal-soft); display: flex; align-items: center; justify-content: center; }
        .sb-profile-info { flex: 1; min-width: 0; }
        .sb-profile-name { font-size: 12.5px; font-weight: 700; color: var(--text); }
        .sb-profile-email { font-size: 11px; color: var(--faint); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sb-logout { color: var(--faint); background: none; border: none; cursor: pointer; display: flex; align-items: center; }
        .sb-logout:hover { color: var(--teal); }
        .sb-logout .material-icons-round { font-size: 18px; }

        .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

        .topbar { height: 56px; background: var(--white); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; flex-shrink: 0; }
        .topbar-left { display: flex; align-items: center; gap: 10px; }
        .topbar-logo-pill { display: flex; align-items: center; gap: 7px; background: var(--bg); border: 1px solid var(--border); border-radius: 20px; padding: 5px 12px 5px 8px; }
        .tl-name { font-size: 13px; font-weight: 700; color: var(--text); }
        .tl-caret { font-size: 16px; color: var(--faint); }
        .topbar-right { display: flex; align-items: center; gap: 6px; }
        .tb-btn { height: 34px; border: none; background: none; cursor: pointer; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--faint); transition: all .15s; padding: 0 8px; font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 600; gap: 5px; }
        .tb-btn .material-icons-round { font-size: 18px; }
        .tb-btn:hover { background: var(--teal-soft); color: var(--teal); }
        .tb-btn.outline { border: 1px solid var(--border); }
        .upgrade-btn { height: 34px; padding: 0 16px; background: linear-gradient(135deg, var(--teal), var(--teal-dark)); color: #fff; border: none; border-radius: 8px; font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; box-shadow: 0 3px 10px rgba(34,177,212,.3); transition: opacity .15s; }
        .upgrade-btn:hover { opacity: .9; }

        .home-view { flex: 1; display: flex; flex-direction: column; align-items: center; overflow-y: auto; padding: 40px 24px 0; }

        .orb-wrap { position: relative; width: 110px; height: 110px; margin-bottom: 18px; }
        .orb { width: 110px; height: 110px; border-radius: 50%; background: radial-gradient(circle at 38% 35%, rgba(34,177,212,.6) 0%, rgba(34,177,212,.28) 40%, rgba(34,177,212,.08) 70%, transparent 100%); box-shadow: 0 0 60px rgba(34,177,212,.22), inset 0 0 30px rgba(255,255,255,.25); animation: orb-pulse 4s ease-in-out infinite; position: relative; }
        .orb::after { content: ''; position: absolute; top: 14%; left: 18%; width: 38%; height: 26%; background: rgba(255,255,255,.5); border-radius: 50%; filter: blur(7px); }
        @keyframes orb-pulse { 0%, 100% { transform: scale(1); opacity: .88; } 50% { transform: scale(1.07); opacity: 1; } }

        .home-greeting { font-family: 'Lora', serif; font-size: 28px; font-weight: 400; font-style: italic; color: var(--teal); margin-bottom: 5px; text-align: center; }
        .home-subtitle { font-size: 26px; font-weight: 700; color: var(--text); text-align: center; margin-bottom: 34px; }

        .home-input-wrap { width: 100%; max-width: 680px; background: var(--white); border: 1px solid var(--border); border-radius: 18px; box-shadow: 0 4px 28px rgba(0,0,0,.07); overflow: hidden; }
        .hi-textarea-row { padding: 10px 16px;}
        .hi-textarea { width: 100%; background: none; border: none; outline: none; font-family: 'Nunito', sans-serif; font-size: 15px; color: var(--text); resize: none; min-height: 100px; max-height: 200px; line-height: 1.55; }
        .hi-textarea::placeholder { color: var(--faint);}
        .hi-bottom { display: flex; align-items: center; justify-content: space-between; padding: 8px 14px 12px; border-top: 1px solid var(--border); }
        .hi-bottom-left { display: flex; align-items: center; gap: 2px; }
        .hi-action { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: var(--muted); cursor: pointer; padding: 5px 8px; border-radius: 8px; transition: background .15s; border: none; background: none; font-family: 'Nunito', sans-serif; }
        .hi-action:hover { background: var(--teal-soft); color: var(--teal); }
        .hi-action .material-icons-round { font-size: 15px; color: var(--teal); }
        .send-home { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: all .2s; }
        .send-home.active { background: linear-gradient(135deg, var(--teal), var(--teal-dark)); color: #fff; box-shadow: 0 4px 12px rgba(34,177,212,.4); }
        .send-home.inactive { background: var(--bg); color: var(--faint); cursor: not-allowed; }
        .send-home .material-icons-round { font-size: 18px; }

        .suggestions { width: 100%; max-width: 680px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 14px; padding-bottom: 16px; }
        .sug-card { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 16px 14px; cursor: pointer; transition: all .2s; text-align: left; }
        .sug-card:hover { border-color: var(--teal-mid); box-shadow: 0 4px 16px rgba(34,177,212,.12); transform: translateY(-2px); }
        .sug-icon { font-size: 22px; margin-bottom: 8px; }
        .sug-title { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
        .sug-desc { font-size: 11px; color: var(--faint); line-height: 1.5; }

        .home-footer { width: 100%; max-width: 680px; text-align: center; padding: 10px 0 20px; font-size: 11px; color: var(--faint); }

        .chat-view { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .messages-area { flex: 1; overflow-y: auto; padding: 28px 24px 16px; display: flex; flex-direction: column; gap: 18px; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
        .date-divider { text-align: center; }
        .date-pill { display: inline-block; background: var(--white); border: 1px solid var(--border); border-radius: 20px; padding: 3px 14px; font-size: 11px; color: var(--faint); font-weight: 600; }

        .msg-row { display: flex; gap: 10px; max-width: 660px; }
        .msg-row.user { margin-left: auto; flex-direction: row-reverse; }
        .msg-col { display: flex; flex-direction: column; }
        .msg-row.user .msg-col { align-items: flex-end; }
        .bubble { padding: 11px 16px; border-radius: 18px; font-size: 14px; line-height: 1.6; box-shadow: 0 1px 4px rgba(0,0,0,.06); max-width: 480px; }
        .bubble.assistant { background: var(--white); border: 1px solid var(--border); color: var(--text); border-top-left-radius: 4px; }
        .bubble.user { background: linear-gradient(135deg, var(--teal), var(--teal-dark)); color: #fff; border-top-right-radius: 4px; }
        .msg-time { font-size: 10px; color: var(--faint); margin-top: 4px; padding: 0 4px; }

        /* ── Markdown styles inside assistant bubble ── */
        .bubble.assistant p { margin: 0 0 8px; }
        .bubble.assistant p:last-child { margin-bottom: 0; }
        .bubble.assistant strong { font-weight: 700; color: var(--text); }
        .bubble.assistant em { font-style: italic; }
        .bubble.assistant ul, .bubble.assistant ol { padding-left: 18px; margin: 6px 0 8px; }
        .bubble.assistant li { margin-bottom: 4px; }
        .bubble.assistant h1, .bubble.assistant h2, .bubble.assistant h3 {
          font-family: 'Lora', serif; font-weight: 600; margin: 10px 0 6px; color: var(--teal-deeper);
        }
        .bubble.assistant h1 { font-size: 16px; }
        .bubble.assistant h2 { font-size: 15px; }
        .bubble.assistant h3 { font-size: 14px; }
        .bubble.assistant hr { border: none; border-top: 1px solid var(--border); margin: 10px 0; }
        .bubble.assistant code { background: var(--teal-soft); border-radius: 4px; padding: 1px 5px; font-size: 12px; font-family: monospace; }
        .bubble.assistant blockquote { border-left: 3px solid var(--teal-mid); padding-left: 10px; color: var(--muted); margin: 6px 0; }

        .typing-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--teal); animation: bounce 1.2s infinite; }
        .typing-dot:nth-child(2) { animation-delay: .2s; }
        .typing-dot:nth-child(3) { animation-delay: .4s; }
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }

        .chat-input-area { padding: 10px 20px 16px; background: var(--white); border-top: 1px solid var(--border); }
        .quick-chips { display: flex; gap: 7px; overflow-x: auto; scrollbar-width: none; padding-bottom: 10px; }
        .quick-chips::-webkit-scrollbar { display: none; }
        .qchip { flex-shrink: 0; font-size: 12px; font-weight: 700; color: var(--teal); border: 1.5px solid rgba(34,177,212,.3); background: var(--white); padding: 5px 13px; border-radius: 20px; cursor: pointer; font-family: 'Nunito', sans-serif; transition: all .15s; white-space: nowrap; }
        .qchip:hover { background: var(--teal-soft); border-color: var(--teal); }

        .chat-input-inner { background: var(--bg); border: 1.5px solid var(--border); border-radius: 16px; display: flex; align-items: flex-end; transition: border-color .2s, box-shadow .2s; overflow: hidden; }
        .chat-input-inner:focus-within { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(34,177,212,.1); }
        .chat-textarea { flex: 1; background: none; border: none; outline: none; padding: 13px 12px; resize: none; font-family: 'Nunito', sans-serif; font-size: 14px; color: var(--text); min-height: 48px; max-height: 120px; line-height: 1.5; }
        .chat-textarea::placeholder { color: var(--faint); }
        .chat-side-btns { display: flex; align-items: center; padding: 8px 10px 8px 0; gap: 2px; }
        .cs-btn { width: 34px; height: 34px; border-radius: 50%; border: none; background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--faint); transition: all .15s; }
        .cs-btn:hover { background: var(--teal-soft); color: var(--teal); }
        .cs-btn .material-icons-round { font-size: 18px; }
        .send-chat { width: 36px; height: 36px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .2s; }
        .send-chat.active { background: linear-gradient(135deg, var(--teal), var(--teal-dark)); color: #fff; box-shadow: 0 3px 12px rgba(34,177,212,.4); }
        .send-chat.inactive { background: var(--border); color: var(--faint); cursor: not-allowed; }
        .send-chat .material-icons-round { font-size: 18px; }
        .chat-footer { text-align: center; margin-top: 8px; font-size: 10px; color: #B8C4CE; }
      `}</style>

      <div className="app">
        {/* SIDEBAR */}
        <aside className={`sidebar${sidebarOpen ? "" : " hidden"}`}>
          <div className="sb-top">
            <div className="sb-brand">
              <Link to="/" className="flex items-center gap-2.5">
                <img src="logo.png" alt="serene" className="w-10" />
                <span className="text-2xl font-serif font-bold text-[#1F2933]">
                  Serene
                </span>
              </Link>
              <button
                className="sb-collapse"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="material-icons-round">chevron_left</span>
              </button>
            </div>
            <button className="new-btn" onClick={startNewChat}>
              <span className="material-icons-round">add</span>
              New chat
            </button>
          </div>

          <div className="sb-search">
            <span className="material-icons-round">search</span>
            <input placeholder="Search conversations…" />
          </div>

          <div className="sb-nav">
            <button
              className={`nav-item${activeView === "home" ? " active" : ""}`}
              onClick={startNewChat}
            >
              <span className="material-icons-round">home</span> Home
            </button>
            <a
              href="/dashboard"
              className="nav-item"
              style={{ textDecoration: "none" }}
            >
              <span className="material-icons-round">dashboard</span> Dashboard
            </a>
          </div>

          <div className="sb-body">
            {loadingConvs ? (
              <p
                style={{
                  padding: "12px",
                  fontSize: "12px",
                  color: "var(--faint)",
                }}
              >
                Loading…
              </p>
            ) : conversations.length === 0 ? (
              <p
                style={{
                  padding: "12px",
                  fontSize: "12px",
                  color: "var(--faint)",
                }}
              >
                No conversations yet.
              </p>
            ) : (
              <>
                <div className="hist-label">Recent</div>
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    className={`hist-item${activeConvId === c.id ? " active" : ""}`}
                    onClick={() => loadConversation(c.id)}
                  >
                    {c.title || "Untitled chat"}
                  </button>
                ))}
              </>
            )}
          </div>

          <div className="sb-profile">
            <div
              className="sb-avatar"
              style={{
                background: "linear-gradient(135deg, #E8F8FC, #22B1D4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                className="material-icons-round"
                style={{ color: "white", fontSize: "18px" }}
              >
                person
              </span>
            </div>
            <div className="sb-profile-info">
              <div className="sb-profile-name">{displayName}</div>
              <div className="sb-profile-email">{user?.email || ""}</div>
            </div>
            <button className="sb-logout" onClick={logout} title="Sign out">
              <span className="material-icons-round">logout</span>
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          {/* Topbar */}
          <div className="topbar">
            <div className="topbar-left">
              {!sidebarOpen && (
                <button className="tb-btn" onClick={() => setSidebarOpen(true)}>
                  <span className="material-icons-round">menu</span>
                </button>
              )}
            </div>
          </div>

          {/* HOME VIEW */}
          {activeView === "home" && (
            <div className="home-view">
              <div className="orb-wrap">
                <div className="orb" />
              </div>
              <div className="home-greeting">Hello, {displayName}</div>
              <div className="home-subtitle">How can I assist you today?</div>

              <div className="home-input-wrap">
                <div className="hi-textarea-row">
                  <textarea
                    className="hi-textarea"
                    placeholder="How are you feeling today?"
                    value={message}
                    rows={2}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                </div>
                <div className="hi-bottom">
                  <div className="hi-bottom-left">
                    <button className="hi-action">
                      <span
                        className="material-icons-round"
                        style={{ color: "var(--faint)" }}
                      >
                        attach_file
                      </span>
                      Attach
                    </button>
                  </div>
                  <button
                    className={`send-home ${message.trim() ? "active" : "inactive"}`}
                    onClick={() => handleSend()}
                    disabled={!message.trim() || loading}
                  >
                    <span className="material-icons-round">arrow_upward</span>
                  </button>
                </div>
              </div>

              <div className="suggestions">
                {suggestions.map((s) => (
                  <button
                    key={s.title}
                    className="sug-card"
                    onClick={() => handleSend(s.desc)}
                  >
                    <div className="sug-icon">{s.icon}</div>
                    <div className="sug-title">{s.title}</div>
                    <div className="sug-desc">{s.desc}</div>
                  </button>
                ))}
              </div>

              <div className="home-footer">
                Serene is not a substitute for professional medical advice.
              </div>
            </div>
          )}

          {/* CHAT VIEW */}
          {activeView === "chat" && (
            <div className="chat-view">
              <div className="messages-area">
                <div className="date-divider">
                  <span className="date-pill">Today</span>
                </div>

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`msg-row ${msg.role === "user" ? "user" : ""}`}
                  >
                    {msg.role !== "user" && (
                      <div style={{ width: 36, flexShrink: 0, paddingTop: 2 }}>
                        <img
                          src="logo.png"
                          alt="serene"
                          style={{ width: 22 }}
                        />
                      </div>
                    )}
                    <div className="msg-col">
                      <div className={`bubble ${msg.role}`}>
                        {msg.role === "assistant" ? (
                          // ✅ Render markdown for AI messages
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        ) : (
                          // Plain text for user messages
                          msg.content
                        )}
                      </div>
                      <span className="msg-time">
                        {fmtTime(msg.created_at)}
                      </span>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="msg-row">
                    <div style={{ width: 36, flexShrink: 0, paddingTop: 2 }}>
                      <img src="logo.png" alt="serene" style={{ width: 22 }} />
                    </div>
                    <div className="msg-col">
                      <div
                        className="bubble assistant"
                        style={{
                          display: "flex",
                          gap: 5,
                          alignItems: "center",
                          padding: "14px 18px",
                        }}
                      >
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-area">
                <div className="quick-chips">
                  {quickChips.map((p) => (
                    <button
                      key={p}
                      className="qchip"
                      onClick={() => handleSend(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <div className="chat-input-inner">
                  <textarea
                    className="chat-textarea"
                    placeholder="Type your message…"
                    value={message}
                    rows={1}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <div className="chat-side-btns">
                    <button className="cs-btn">
                      <span className="material-icons-round">attach_file</span>
                    </button>
                    <button className="cs-btn">
                      <span className="material-icons-round">mic_none</span>
                    </button>
                    <button
                      className={`send-chat ${message.trim() && !loading ? "active" : "inactive"}`}
                      onClick={() => handleSend()}
                      disabled={!message.trim() || loading}
                    >
                      <span className="material-icons-round">arrow_upward</span>
                    </button>
                  </div>
                </div>
                <div className="chat-footer">
                  Serene AI can make mistakes. If you're in crisis, call iCall:
                  9152987821
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
