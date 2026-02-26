import { useState } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [activeView, setActiveView] = useState("home"); // 'home' | 'chat'
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const historyGroups = [
    {
      label: "Today",
      items: [
        "Work Stress & Anxiety",
        "Morning Check-in",
        "Feeling overwhelmed today",
      ],
    },
    {
      label: "Yesterday",
      items: ["Sleep Quality Discussion", "Relationship Thoughts"],
    },
    {
      label: "7 days",
      items: [
        "Anxiety & CBT Exercises",
        "Gratitude journaling tips",
        "Help me calm down right now",
        "Breathing techniques for panic",
      ],
    },
  ];

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

  const handleSend = (text) => {
    const msg = text || message;
    if (!msg.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: msg,
        sender: "user",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setMessage("");
    setActiveView("chat");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "That's a great step forward. Let's focus on what you can control right now. Would you like to try a grounding exercise or talk more about what's on your mind?",
          sender: "bot",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 1000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Nunito:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons+Round');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --teal: #22B1D4;
          --teal-dark: #189AB4;
          --teal-deeper: #137A8F;
          --teal-soft: #E8F8FC;
          --teal-mid: #D4EEF7;
          --bg: #F8FAFC;
          --white: #ffffff;
          --border: #E4EEF3;
          --text: #1F2933;
          --muted: #52606D;
          --faint: #9AA5B1;
          --sidebar-w: 268px;
        }

        .app {
          display: flex;
          height: 100vh;
          font-family: 'Nunito', sans-serif;
          background: var(--bg);
          color: var(--text);
          overflow: hidden;
        }

        /* SIDEBAR */
        .sidebar {
          width: var(--sidebar-w);
          min-width: var(--sidebar-w);
          background: var(--white);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          transition: width 0.28s ease, min-width 0.28s ease;
          overflow: hidden;
        }
        .sidebar.hidden { width: 0; min-width: 0; }

        .sb-top {
          padding: 18px 16px 14px;
          border-bottom: 1px solid var(--border);
        }
        .sb-brand {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px;
        }
        .sb-brand-left { display: flex; align-items: center; gap: 10px; }
        .sb-logo {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, var(--teal), var(--teal-dark));
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; box-shadow: 0 3px 10px rgba(34,177,212,.3);
        }
        .sb-logo .material-icons-round { font-size: 18px; }
        .sb-title {
          font-family: 'Lora', serif;
          font-size: 18px; font-weight: 600;
          color: var(--text);
        }
        .sb-collapse {
          width: 28px; height: 28px; border-radius: 7px;
          border: none; background: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: var(--faint); transition: all .15s;
        }
        .sb-collapse:hover { background: var(--teal-soft); color: var(--teal); }
        .sb-collapse .material-icons-round { font-size: 20px; }

        .new-btn {
          width: 100%;
          background: linear-gradient(135deg, var(--teal), var(--teal-dark));
          color: #fff; border: none; border-radius: 10px;
          padding: 9px 14px; font-family: 'Nunito', sans-serif;
          font-size: 13px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          box-shadow: 0 3px 12px rgba(34,177,212,.3);
          transition: opacity .15s;
        }
        .new-btn:hover { opacity: .9; }
        .new-btn .material-icons-round { font-size: 17px; }

        .sb-search {
          margin: 12px 16px 0;
          display: flex; align-items: center; gap: 8px;
          background: var(--bg); border: 1px solid var(--border);
          border-radius: 9px; padding: 7px 12px;
        }
        .sb-search .material-icons-round { font-size: 16px; color: var(--faint); }
        .sb-search input {
          flex: 1; background: none; border: none; outline: none;
          font-family: 'Nunito', sans-serif; font-size: 13px; color: var(--text);
        }
        .sb-search input::placeholder { color: var(--faint); }
        .sb-search kbd {
          font-size: 10px; color: var(--faint);
          border: 1px solid var(--border); border-radius: 4px;
          padding: 1px 5px; background: var(--white);
        }

        .sb-nav { padding: 10px 10px 4px; }
        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 10px; border-radius: 9px;
          font-size: 13px; font-weight: 600; color: var(--muted);
          cursor: pointer; transition: all .15s; border: none; background: none; width: 100%;
          font-family: 'Nunito', sans-serif;
        }
        .nav-item:hover { background: var(--teal-soft); color: var(--teal); }
        .nav-item.active { background: var(--teal-soft); color: var(--teal); }
        .nav-item .material-icons-round { font-size: 18px; }

        .sb-body {
          flex: 1; overflow-y: auto; padding: 4px 10px 8px;
          scrollbar-width: thin; scrollbar-color: var(--border) transparent;
        }
        .hist-label {
          font-size: 10px; font-weight: 800; color: var(--faint);
          text-transform: uppercase; letter-spacing: .8px;
          padding: 10px 6px 4px;
        }
        .hist-item {
          display: block; width: 100%; text-align: left; border: none; background: none;
          padding: 6px 10px; border-radius: 8px; cursor: pointer;
          font-family: 'Nunito', sans-serif; font-size: 12.5px;
          color: var(--muted); font-weight: 500;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          transition: all .15s;
        }
        .hist-item:hover { background: var(--teal-soft); color: var(--teal); }

        .sb-profile {
          padding: 12px 14px;
          border-top: 1px solid var(--border);
          display: flex; align-items: center; gap: 9px;
          cursor: pointer; transition: background .15s;
        }
        .sb-profile:hover { background: var(--bg); }
        .sb-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          object-fit: cover; border: 2px solid var(--border); flex-shrink: 0;
        }
        .sb-profile-info { flex: 1; min-width: 0; }
        .sb-profile-name { font-size: 12.5px; font-weight: 700; color: var(--text); }
        .sb-profile-email { font-size: 11px; color: var(--faint); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sb-logout { color: var(--faint); background: none; border: none; cursor: pointer; display: flex; align-items: center; }
        .sb-logout:hover { color: var(--teal); }
        .sb-logout .material-icons-round { font-size: 18px; }

        /* MAIN */
        .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

        .topbar {
          height: 56px; background: var(--white);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px; flex-shrink: 0;
        }
        .topbar-left { display: flex; align-items: center; gap: 10px; }
        .topbar-logo-pill {
          display: flex; align-items: center; gap: 7px;
          background: var(--bg); border: 1px solid var(--border);
          border-radius: 20px; padding: 5px 12px 5px 8px;
          cursor: pointer;
        }
        .tl-dot {
          width: 22px; height: 22px;
          background: linear-gradient(135deg, var(--teal), var(--teal-dark));
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
        }
        .tl-dot .material-icons-round { font-size: 13px; color: #fff; }
        .tl-name { font-size: 13px; font-weight: 700; color: var(--text); }
        .tl-caret { font-size: 16px; color: var(--faint); }
        .topbar-right { display: flex; align-items: center; gap: 6px; }
        .tb-btn {
          height: 34px; border: none; background: none; cursor: pointer;
          border-radius: 8px; display: flex; align-items: center; justify-content: center;
          color: var(--faint); transition: all .15s; padding: 0 8px;
          font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 600; gap: 5px;
        }
        .tb-btn .material-icons-round { font-size: 18px; }
        .tb-btn:hover { background: var(--teal-soft); color: var(--teal); }
        .tb-btn.outline { border: 1px solid var(--border); }
        .upgrade-btn {
          height: 34px; padding: 0 16px;
          background: linear-gradient(135deg, var(--teal), var(--teal-dark));
          color: #fff; border: none; border-radius: 8px;
          font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 700;
          cursor: pointer; box-shadow: 0 3px 10px rgba(34,177,212,.3);
          transition: opacity .15s;
        }
        .upgrade-btn:hover { opacity: .9; }

        /* HOME VIEW */
        .home-view {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; overflow-y: auto;
          padding: 40px 24px 0;
        }

        .orb-wrap { position: relative; width: 110px; height: 110px; margin-bottom: 18px; }
        .orb {
          width: 110px; height: 110px; border-radius: 50%;
          background: radial-gradient(circle at 38% 35%,
            rgba(34,177,212,.6) 0%,
            rgba(34,177,212,.28) 40%,
            rgba(34,177,212,.08) 70%,
            transparent 100%);
          box-shadow: 0 0 60px rgba(34,177,212,.22), inset 0 0 30px rgba(255,255,255,.25);
          animation: orb-pulse 4s ease-in-out infinite;
          position: relative;
        }
        .orb::after {
          content: '';
          position: absolute; top: 14%; left: 18%;
          width: 38%; height: 26%;
          background: rgba(255,255,255,.5);
          border-radius: 50%; filter: blur(7px);
        }
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1); opacity: .88; }
          50% { transform: scale(1.07); opacity: 1; }
        }

        .home-greeting {
          font-family: 'Lora', serif;
          font-size: 28px; font-weight: 400; font-style: italic;
          color: var(--teal); margin-bottom: 5px; text-align: center;
        }
        .home-subtitle {
          font-size: 26px; font-weight: 700;
          color: var(--text); text-align: center; margin-bottom: 34px;
        }

        /* Big input card */
        .home-input-wrap {
          width: 100%; max-width: 680px;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 18px;
          box-shadow: 0 4px 28px rgba(0,0,0,.07);
          overflow: hidden;
        }
        .hi-toolbar {
          display: flex; align-items: center; gap: 6px;
          padding: 12px 14px 0;
        }
        .hi-pill-btn {
          display: flex; align-items: center; gap: 5px;
          background: var(--teal-soft); border: 1.5px solid var(--teal-mid);
          color: var(--teal); border-radius: 20px; padding: 5px 12px;
          font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 700;
          cursor: pointer; transition: background .15s;
        }
        .hi-pill-btn:hover { background: var(--teal-mid); }
        .hi-pill-btn .material-icons-round { font-size: 15px; }
        .hi-icon-btn {
          width: 30px; height: 30px; border-radius: 50%;
          border: none; background: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: var(--faint); transition: all .15s;
        }
        .hi-icon-btn:hover { background: var(--teal-soft); color: var(--teal); }
        .hi-icon-btn .material-icons-round { font-size: 17px; }

        .hi-textarea-row { padding: 10px 16px; }
        .hi-textarea {
          width: 100%; background: none; border: none; outline: none;
          font-family: 'Nunito', sans-serif; font-size: 15px;
          color: var(--text); resize: none; min-height: 56px; max-height: 140px;
          line-height: 1.55;
        }
        .hi-textarea::placeholder { color: var(--faint); }

        .hi-bottom {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 14px 12px;
          border-top: 1px solid var(--border);
        }
        .hi-bottom-left { display: flex; align-items: center; gap: 2px; }
        .hi-action {
          display: flex; align-items: center; gap: 5px;
          font-size: 12px; font-weight: 600; color: var(--muted);
          cursor: pointer; padding: 5px 8px; border-radius: 8px;
          transition: background .15s; border: none; background: none;
          font-family: 'Nunito', sans-serif;
        }
        .hi-action:hover { background: var(--teal-soft); color: var(--teal); }
        .hi-action .material-icons-round { font-size: 15px; color: var(--teal); }

        .send-home {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: none; cursor: pointer; transition: all .2s;
        }
        .send-home.active {
          background: linear-gradient(135deg, var(--teal), var(--teal-dark));
          color: #fff; box-shadow: 0 4px 12px rgba(34,177,212,.4);
        }
        .send-home.inactive { background: var(--bg); color: var(--faint); cursor: not-allowed; }
        .send-home .material-icons-round { font-size: 18px; }

        /* suggestion cards */
        .suggestions {
          width: 100%; max-width: 680px;
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 10px; margin-top: 14px; padding-bottom: 16px;
        }
        .sug-card {
          background: var(--white); border: 1px solid var(--border);
          border-radius: 14px; padding: 16px 14px;
          cursor: pointer; transition: all .2s; text-align: left;
        }
        .sug-card:hover {
          border-color: var(--teal-mid);
          box-shadow: 0 4px 16px rgba(34,177,212,.12);
          transform: translateY(-2px);
        }
        .sug-icon { font-size: 22px; margin-bottom: 8px; }
        .sug-title { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
        .sug-desc { font-size: 11px; color: var(--faint); line-height: 1.5; }

        .home-footer {
          width: 100%; max-width: 680px;
          text-align: center; padding: 10px 0 20px;
          font-size: 11px; color: var(--faint);
        }
        .home-footer a { color: var(--teal); font-weight: 600; text-decoration: none; }
        .home-footer a:hover { text-decoration: underline; }

        /* CHAT VIEW */
        .chat-view { flex: 1; margin-right:50%; transform: translateX(49%); display: flex; flex-direction: column; overflow: hidden; }
        .messages-area {
          flex: 1; overflow-y: auto; padding: 28px 24px 16px;
          display: flex; flex-direction: column; gap: 18px;
          scrollbar-width: thin; scrollbar-color: var(--border) transparent;
        }
        .date-divider { text-align: center; }
        .date-pill {
          display: inline-block; background: var(--white);
          border: 1px solid var(--border); border-radius: 20px;
          padding: 3px 14px; font-size: 11px; color: var(--faint); font-weight: 600;
        }
        .msg-row { display: flex; gap: 10px; max-width: 660px; }
        .msg-row.user { margin-left: auto; flex-direction: row-reverse; }
        .bot-av {
          width: 30px; height: 30px; border-radius: 50%;
          background: var(--teal-soft); display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; align-self: flex-start; margin-top: 2px;
        }
        .bot-av .material-icons-round { font-size: 15px; color: var(--teal); }
        .msg-col { display: flex; flex-direction: column; }
        .msg-row.user .msg-col { align-items: flex-end; }
        .bubble {
          padding: 11px 16px; border-radius: 18px;
          font-size: 14px; line-height: 1.6;
          box-shadow: 0 1px 4px rgba(0,0,0,.06);
        }
        .bubble.bot {
          background: var(--white); border: 1px solid var(--border);
          color: var(--text); border-top-left-radius: 4px;
        }
        .bubble.user {
          background: linear-gradient(135deg, var(--teal), var(--teal-dark));
          color: #fff; border-top-right-radius: 4px;
        }
        .msg-time { font-size: 10px; color: var(--faint); margin-top: 4px; padding: 0 4px; }

        .chat-input-area { padding: 10px 20px 16px; background: var(--white); border-top: 1px solid var(--border); }
        .quick-chips {
          display: flex; gap: 7px; overflow-x: auto; scrollbar-width: none;
          padding-bottom: 10px;
        }
        .quick-chips::-webkit-scrollbar { display: none; }
        .qchip {
          flex-shrink: 0; font-size: 12px; font-weight: 700;
          color: var(--teal); border: 1.5px solid rgba(34,177,212,.3);
          background: var(--white); padding: 5px 13px; border-radius: 20px;
          cursor: pointer; font-family: 'Nunito', sans-serif;
          transition: all .15s; white-space: nowrap;
        }
        .qchip:hover { background: var(--teal-soft); border-color: var(--teal); }

        .chat-input-inner {
          background: var(--bg); border: 1.5px solid var(--border);
          border-radius: 16px; display: flex; align-items: flex-end;
          transition: border-color .2s, box-shadow .2s; overflow: hidden;
        }
        .chat-input-inner:focus-within {
          border-color: var(--teal);
          box-shadow: 0 0 0 3px rgba(34,177,212,.1);
        }
        .chat-textarea {
          flex: 1; background: none; border: none; outline: none;
          padding: 13px 12px; resize: none;
          font-family: 'Nunito', sans-serif; font-size: 14px; color: var(--text);
          min-height: 48px; max-height: 120px; line-height: 1.5;
        }
        .chat-textarea::placeholder { color: var(--faint); }
        .chat-side-btns { display: flex; align-items: center; padding: 8px 10px 8px 0; gap: 2px; }
        .cs-btn {
          width: 34px; height: 34px; border-radius: 50%; border: none; background: none;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          color: var(--faint); transition: all .15s;
        }
        .cs-btn:hover { background: var(--teal-soft); color: var(--teal); }
        .cs-btn .material-icons-round { font-size: 18px; }
        .send-chat {
          width: 36px; height: 36px; border-radius: 50%;
          border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all .2s;
        }
        .send-chat.active {
          background: linear-gradient(135deg, var(--teal), var(--teal-dark));
          color: #fff; box-shadow: 0 3px 12px rgba(34,177,212,.4);
        }
        .send-chat.inactive { background: var(--border); color: var(--faint); cursor: not-allowed; }
        .send-chat .material-icons-round { font-size: 18px; }
        .chat-footer { text-align: center; margin-top: 8px; font-size: 10px; color: #B8C4CE; }
      `}</style>

      <div className="app">
        {/* SIDEBAR */}
        <aside className={`sidebar${sidebarOpen ? "" : " hidden"}`}>
          <div className="sb-top">
            <div className="sb-brand">
              <div className="flex items-center gap-3">
                <img src="logo.png" alt="serene" className="w-10" />
                <span className="text-2xl font-serif font-bold text-[#1F2933]">
                  Serene
                </span>
              </div>

              <button
                className="sb-collapse"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="material-icons-round">chevron_left</span>
              </button>
            </div>
            <button
              className="new-btn"
              onClick={() => {
                setActiveView("home");
                setMessages([]);
              }}
            >
              <span className="material-icons-round">add</span>
              New chat
            </button>
          </div>

          <div className="sb-search">
            <span className="material-icons-round">search</span>
            <input placeholder="Search conversations…" />
            <kbd>⌘K</kbd>
          </div>

          <div className="sb-nav">
            <button
              className={`nav-item${activeView === "home" ? " active" : ""}`}
              onClick={() => {
                setActiveView("home");
                setMessages([]);
              }}
            >
              <span className="material-icons-round">explore</span> Explore
            </button>
            <button className="nav-item">
              <span className="material-icons-round">auto_stories</span> Library
            </button>
            <button className="nav-item">
              <span className="material-icons-round">folder_open</span> Files
            </button>
            <button className="nav-item">
              <span className="material-icons-round">history</span> History
            </button>
          </div>

          <div className="sb-body">
            {historyGroups.map((g) => (
              <div key={g.label}>
                <div className="hist-label">{g.label}</div>
                {g.items.map((item) => (
                  <button
                    key={item}
                    className="hist-item"
                    onClick={() => setActiveView("chat")}
                  >
                    {item}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="sb-profile">
            <img
              src="https://picsum.photos/seed/sarah/100/100"
              alt="Sarah"
              className="sb-avatar"
              referrerPolicy="no-referrer"
            />
            <div className="sb-profile-info">
              <div className="sb-profile-name">Sarah Jenkins</div>
              <div className="sb-profile-email">sarah@gmail.com</div>
            </div>
            <button className="sb-logout">
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
              <div className="topbar-logo-pill">
                <img src="logo.png" alt="serene" className="w-5" />
                <span className="tl-name">Serene</span>
                <span className="material-icons-round tl-caret">
                  expand_more
                </span>
              </div>
            </div>
            <div className="topbar-right">
              <button className="tb-btn">
                <span className="material-icons-round">more_horiz</span>
              </button>
              <button className="tb-btn">
                <span className="material-icons-round">link</span>
              </button>
              <button className="tb-btn outline">
                <span className="material-icons-round">ios_share</span>
                Export chat
              </button>
              <button className="upgrade-btn">Upgrade</button>
            </div>
          </div>

          {/* HOME */}
          {activeView === "home" && (
            <div className="home-view">
              <div className="orb-wrap">
                <div className="orb" />
              </div>

              <div className="home-greeting">Hello, Sarah</div>
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
                      Attach file
                    </button>
                  </div>
                  <button
                    className={`send-home ${message.trim() ? "active" : "inactive"}`}
                    onClick={() => handleSend()}
                    disabled={!message.trim()}
                  >
                    <span className="material-icons-round">arrow_upward</span>
                  </button>
                </div>
              </div>

              <div className="home-footer">
                Join our community for more insights{" "}
                <a href="#">Join Discord</a>
              </div>
            </div>
          )}

          {/* CHAT */}
          {activeView === "chat" && (
            <div className="chat-view">
              <div className="messages-area">
                <div className="date-divider">
                  <span className="date-pill">Today</span>
                </div>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`msg-row ${msg.sender === "user" ? "user" : ""}`}
                  >
                    {msg.sender === "bot" && (
                      <div className="w-10 flex justify-start items-start">
                        <img src="logo.png" alt="serene" className="w-5" />
                      </div>
                    )}
                    <div className="msg-col">
                      <div className={`bubble ${msg.sender}`}>{msg.text}</div>
                      <span className="msg-time">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="chat-input-area">
                <div className="quick-chips">
                  {[
                    "Try a breathing exercise",
                    "I need to talk",
                    "Log my mood",
                    "CBT exercise",
                    "Feeling anxious",
                  ].map((p) => (
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
                      className={`send-chat ${message.trim() ? "active" : "inactive"}`}
                      onClick={() => handleSend()}
                      disabled={!message.trim()}
                    >
                      <span className="material-icons-round">arrow_upward</span>
                    </button>
                  </div>
                </div>
                <div className="chat-footer">
                  Serene AI can make mistakes. Consider verifying important
                  information.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
