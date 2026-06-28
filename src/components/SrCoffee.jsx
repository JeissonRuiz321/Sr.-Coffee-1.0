import { useState, useRef, useEffect } from "react";
import { TOPICS, HINTS, STARTERS, RESPONSES } from "../data/topics";
import { CoffeeIcon, SendIcon } from "../data/icons";

/* ── helpers localStorage ── */
const getLS = (k, fb) => { try { const v = localStorage.getItem(k); return v !== null ? v : fb; } catch { return fb; } };
const setLS = (k, v) => { try { localStorage.setItem(k, String(v)); } catch {} };

export default function SrCoffee({ onLogout }) {
  const today = new Date().toDateString();

  /* ── estado ── */
  const [screen,        setScreen]        = useState("home");
  const [activeTopic,   setActiveTopic]   = useState(null);
  const [messages,      setMessages]      = useState([]);
  const [input,         setInput]         = useState("");
  const [loading,       setLoading]       = useState(false);
  const [hoveredTopic,  setHoveredTopic]  = useState(null);

  const [dark,          setDark]          = useState(() => getLS("src_dark","false") === "true");
  const [streak,        setStreak]        = useState(() => parseInt(getLS("src_streak","0")));
  const [sessions,      setSessions]      = useState(() => parseInt(getLS("src_sessions","0")));
  const [cafes,         setCafes]         = useState(() => parseInt(getLS("src_cafes","0")));
  const [talkedToday,   setTalkedToday]   = useState(() => getLS("src_today","") === today);
  const [streakPop,     setStreakPop]     = useState(false);

  const [mood, setMood] = useState(() => {
    const d = getLS("src_mood_date","");
    return d === today ? getLS("src_mood", null) : null;
  });

  const [showProfile,   setShowProfile]   = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [profileName,   setProfileName]   = useState(() => getLS("src_name",""));
  const [profileAge,    setProfileAge]    = useState(() => parseInt(getLS("src_age","22")));

  const bottomRef   = useRef(null);
  const textareaRef = useRef(null);
  const msgId       = useRef(0);
  const lastResps   = useRef([]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);
  useEffect(() => { if (screen === "chat") setTimeout(() => textareaRef.current?.focus(), 300); }, [screen]);

  /* ── respuesta local ── */
  const getResponse = (topicId) => {
    const pool  = RESPONSES[topicId] || RESPONSES.default;
    const avail = pool.filter(r => !lastResps.current.includes(r));
    const list  = avail.length ? avail : pool;
    const r = list[Math.floor(Math.random() * list.length)];
    lastResps.current = [...lastResps.current.slice(-3), r];
    return r;
  };

  /* ── mood ── */
  const saveMood = (m) => { setMood(m); setLS("src_mood",m); setLS("src_mood_date",today); };

  /* ── dark mode ── */
  const toggleDark = () => { const n=!dark; setDark(n); setLS("src_dark",n); };

  /* ── perfil ── */
  const saveProfile = () => {
    if (!profileName.trim()) return;
    setLS("src_name", profileName.trim());
    setLS("src_age",  profileAge);
    setShowProfile(false);
  };

  /* ── iniciar chat ── */
  const startChat = (topic) => {
    setActiveTopic(topic);
    setScreen("chat");
    msgId.current = 0;
    lastResps.current = [];

    let greeting = STARTERS[topic.id];
    if (mood === "bad")     greeting = greeting.replace(/\?$/, "? Veo que el día está complicado. Te escucho.");
    if (mood === "neutral") greeting = greeting.replace(/\?$/, "? Uno de esos días normales. ¿Qué hay?");
    if (mood === "good")    greeting = greeting.replace(/\?$/, "? Veo que hoy va bien. ¿Qué lo está haciendo diferente?");

    setMessages([{ role:"asst", content:greeting, id:msgId.current++ }]);

    const nc = cafes + 1, ns = sessions + 1;
    setCafes(nc); setSessions(ns);
    setLS("src_cafes", nc); setLS("src_sessions", ns);
  };

  const goHome = () => { setScreen("home"); setActiveTopic(null); setMessages([]); setInput(""); };

  /* ── enviar mensaje ── */
  const sendMessage = () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages(prev => [...prev, { role:"user", content:text, id:msgId.current++ }]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    if (!talkedToday) {
      const n = streak + 1;
      setTalkedToday(true); setStreak(n); setStreakPop(true);
      setLS("src_streak",n); setLS("src_today",today);
      setTimeout(() => setStreakPop(false), 2200);
    }

    setTimeout(() => {
      const reply = getResponse(activeTopic?.id);
      setMessages(prev => [...prev, { role:"asst", content:reply, id:msgId.current++ }]);
      setLoading(false);
    }, 900 + Math.random() * 700);
  };

  const handleKey = (e) => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  /* ── colores ── */
  const bg      = dark ? "#1F1814" : "#F2E8D5";
  const surface = dark ? "#312A24" : "#FDF9F2";
  const border  = dark ? "rgba(210,190,170,0.1)" : "rgba(120,80,30,0.13)";
  const textCol = dark ? "#F0E8E0" : "#352010";
  const muted   = "#9A7A50";
  const brown   = dark ? "#E8D8C8" : "#4A2E0E";

  const ibtn = { width:32, height:32, borderRadius:"50%", background:surface, border:`1px solid ${dark?"rgba(210,190,170,0.14)":"rgba(120,80,30,0.2)"}`, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html, body, #root { height:100%; width:100%; overflow:hidden; }
        body { font-family:'DM Sans',sans-serif; }

        .home-scroll { flex:1; overflow-y:auto; padding:22px 18px; display:flex; flex-direction:column; gap:18px; scrollbar-width:thin; }
        .home-scroll::-webkit-scrollbar { width:6px; }
        .home-scroll::-webkit-scrollbar-thumb { background:rgba(120,80,30,0.15); border-radius:3px; }

        .tcard { padding:16px 13px; border-radius:16px; cursor:pointer; transition:all .22s cubic-bezier(0.34,1.56,0.64,1); user-select:none; }
        .tcard:hover { transform:translateY(-4px) scale(1.015); box-shadow:0 8px 24px rgba(90,50,10,0.12); }
        .tcard:active { transform:scale(0.98); }
        .t-ic { font-size:22px; display:block; margin-bottom:8px; transition:transform .2s; }
        .tcard:hover .t-ic { transform:scale(1.15) rotate(-5deg); }

        .quick { border-radius:18px; padding:16px 18px; cursor:pointer; display:flex; align-items:center; gap:14px; transition:all .22s; }
        .quick:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(90,50,10,0.1); }

        .msg-row { display:flex; gap:8px; animation:fUp .28s ease forwards; opacity:0; }
        @keyframes fUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .msg-row.user { flex-direction:row-reverse; }

        .td { width:6px; height:6px; border-radius:50%; animation:blink 1.4s ease-in-out infinite; background:#B08050; }
        .td:nth-child(2){animation-delay:.2s} .td:nth-child(3){animation-delay:.4s}
        @keyframes blink { 0%,80%,100%{opacity:.2;transform:scale(0.85)} 40%{opacity:1;transform:scale(1.2)} }

        .mood-b { flex:1; max-width:85px; padding:12px 8px; border-radius:14px; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:6px; font-size:11px; font-weight:500; text-transform:uppercase; letter-spacing:.06em; transition:all .2s; }
        .mood-b:hover { transform:translateY(-3px); }

        .overlay { position:fixed; inset:0; background:rgba(0,0,0,0.38); display:flex; align-items:center; justify-content:center; z-index:100; backdrop-filter:blur(2px); animation:fadeO .2s ease; }
        @keyframes fadeO { from{opacity:0} to{opacity:1} }
        .modal { border-radius:22px; padding:26px 22px; width:90%; max-width:380px; position:relative; animation:slideU .3s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes slideU { from{opacity:0;transform:translateY(18px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }

        .inp-row:focus-within { border-color:#B08050 !important; box-shadow:0 0 0 3px rgba(176,128,80,0.12) !important; }
        textarea { font-family:'DM Sans',sans-serif; scrollbar-width:none; }
        textarea::-webkit-scrollbar { display:none; }
        textarea::placeholder { font-style:italic; }

        .ibtn:hover { transform:translateY(-1px); }
        .streak-pop { animation:spop .35s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes spop { 0%{transform:scale(1)} 50%{transform:scale(1.1)} 100%{transform:scale(1)} }

        .profile-slider { width:100%; height:6px; border-radius:4px; outline:none; -webkit-appearance:none; appearance:none; cursor:pointer; }
        .profile-slider::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:linear-gradient(135deg,#C8965A,#7A4818); cursor:pointer; border:2px solid white; }
        .profile-slider::-moz-range-thumb { width:18px; height:18px; border-radius:50%; background:linear-gradient(135deg,#C8965A,#7A4818); border:2px solid white; }

        /* ── RESPONSIVE MÓVIL ── */
        @media (max-width: 480px) {
          .app-header { padding:10px 12px !important; }
          .ibtn { width:28px !important; height:28px !important; font-size:13px !important; }
          .avatar-main { width:34px !important; height:34px !important; }
          .brand-name { font-size:15px !important; }
          .brand-sub { font-size:10px !important; }
          .streak-pill { padding:4px 8px !important; font-size:11px !important; gap:3px !important; }
          .streak-pill .days-label { display:none; }
          .header-icons { gap:5px !important; }
          .home-scroll { padding:16px 12px !important; gap:14px !important; }
          .topics-grid { gap:8px !important; }
          .tcard { padding:12px 10px !important; }
          .t-ic { font-size:19px !important; margin-bottom:6px !important; }
          .t-nm { font-size:12px !important; }
          .t-ht { font-size:10px !important; }
          .hero-title-main { font-size:20px !important; }
          .hero-sub-main { font-size:12px !important; }
          .stat-box { padding:10px 6px !important; }
          .stat-val { font-size:20px !important; }
          .quick-box { padding:13px 14px !important; gap:10px !important; }
          .bubble-msg { max-width:82% !important; font-size:13.5px !important; }
          .input-area-wrap { padding:8px 10px 12px !important; }
          .modal-box { padding:20px 16px !important; max-width:94vw !important; }
        }
      `}</style>

      <div style={{ display:"flex", flexDirection:"column", height:"100vh", maxWidth:700, margin:"0 auto", background:bg, color:textCol, fontFamily:"'DM Sans',sans-serif" }}>

        {/* TOAST */}
        {streakPop && (
          <div style={{ position:"fixed", top:70, left:"50%", transform:"translateX(-50%)", background:"#FEF0E4", border:"1px solid rgba(200,90,20,0.28)", color:"#C85A14", padding:"8px 20px", borderRadius:20, fontSize:13, fontWeight:500, zIndex:999, whiteSpace:"nowrap" }}>
            🔥 ¡Racha al día — {streak} días seguidos!
          </div>
        )}

        {/* HEADER */}
        <header className="app-header" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", background:surface, borderBottom:`1px solid ${border}`, flexShrink:0, zIndex:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {screen==="chat" && (
              <button className="ibtn" onClick={goHome} style={ibtn}>‹</button>
            )}
            <div className="avatar-main" style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#C8965A,#7A4818)", display:"flex", alignItems:"center", justifyContent:"center", color:"#FDF9F0", flexShrink:0 }}>
              <CoffeeIcon size={20}/>
            </div>
            <div>
              <div className="brand-name" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:600, color:brown }}>Sr. Coffee</div>
              <div className="brand-sub" style={{ fontSize:11, color:muted, fontStyle:"italic" }}>
                {screen==="chat" && activeTopic
                  ? <span style={{ color:activeTopic.color }}>{activeTopic.icon} {activeTopic.label}</span>
                  : "listo para escuchar"}
              </div>
            </div>
          </div>
          <div className="header-icons" style={{ display:"flex", alignItems:"center", gap:8 }}>
            <button className="ibtn" style={ibtn} onClick={toggleDark}>{dark?"☀️":"🌙"}</button>
            <button className="ibtn" style={ibtn} onClick={() => setShowAnalytics(true)}>📊</button>
            <button className="ibtn" style={ibtn} onClick={() => setShowProfile(true)}>👤</button>
            {onLogout && <button className="ibtn" style={ibtn} onClick={onLogout} title="Salir">🚪</button>}
            <div className={`streak-pill ${streakPop?"streak-pop":""}`} style={{ display:"flex", alignItems:"center", gap:5, background:surface, border:`1px solid ${dark?"rgba(210,190,170,0.14)":"rgba(120,80,30,0.2)"}`, padding:"5px 11px", borderRadius:20, fontSize:12, color:muted }}>
              <span style={{ fontSize:15 }}>🔥</span>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:brown }}>{streak}</span>
              <span className="days-label">días</span>
            </div>
          </div>
        </header>

        {/* HOME */}
        {screen === "home" && (
          <div className="home-scroll">

            {!mood ? (
              <div style={{ background:"linear-gradient(135deg,rgba(200,150,90,0.1),rgba(140,90,40,0.06))", border:`1.5px solid ${dark?"rgba(210,190,170,0.14)":"rgba(120,80,30,0.2)"}`, borderRadius:18, padding:20 }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600, color:brown, textAlign:"center", marginBottom:14 }}>¿Cómo va hoy?</div>
                <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                  {[["good","😌","Bien"],["neutral","😐","Normal"],["bad","😞","Difícil"]].map(([m,e,l]) => (
                    <button key={m} className="mood-b" onClick={() => saveMood(m)} style={{ background:surface, border:`1.5px solid ${border}`, color:muted }}>
                      <span style={{ fontSize:24 }}>{e}</span>{l}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display:"flex", alignItems:"center", gap:8, background:surface, border:`1.5px solid ${border}`, borderRadius:16, padding:"8px 13px" }}>
                <span style={{ fontSize:18 }}>{mood==="good"?"😌":mood==="neutral"?"😐":"😞"}</span>
                <span style={{ flex:1, fontSize:13, fontWeight:500, color:brown }}>{mood==="good"?"Hoy va bien":mood==="neutral"?"Día normal":"Día complicado"}</span>
                <button onClick={() => setMood(null)} style={{ background:"none", border:`1px solid ${border}`, borderRadius:"50%", width:20, height:20, cursor:"pointer", color:muted, fontSize:11 }}>✕</button>
              </div>
            )}

            <div style={{ textAlign:"center" }}>
              <div className="hero-title-main" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:300, color:dark?"#FFD9A8":brown, fontStyle:"italic", lineHeight:1.3 }}>¿De qué va el café<br/>de hoy?</div>
              <div className="hero-sub-main" style={{ fontSize:13, color:muted, fontWeight:300, lineHeight:1.6, marginTop:5 }}>Elige un tema o empieza directamente.<br/>Aquí no hay prisa.</div>
            </div>

            <div style={{ display:"flex", gap:8 }}>
              {[["Racha",streak],["Sesiones",sessions],["Cafés",cafes]].map(([l,v]) => (
                <div key={l} className="stat-box" style={{ flex:1, background:surface, border:`1px solid ${border}`, borderRadius:14, padding:"12px 10px", textAlign:"center", transition:"all .2s" }}>
                  <div className="stat-val" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:600, color:brown, lineHeight:1 }}>{v}</div>
                  <div style={{ fontSize:10, color:muted, textTransform:"uppercase", letterSpacing:".08em", marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize:10, fontWeight:500, textTransform:"uppercase", letterSpacing:".1em", color:"#C0A070" }}>Elige un tema</div>

            <div className="topics-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {TOPICS.map(t => (
                <div key={t.id} className="tcard"
                  style={{ background:hoveredTopic===t.id?t.bg:surface, border:`1.5px solid ${hoveredTopic===t.id?t.color+"44":border}` }}
                  onMouseEnter={() => setHoveredTopic(t.id)}
                  onMouseLeave={() => setHoveredTopic(null)}
                  onClick={() => startChat(t)}>
                  <span className="t-ic">{t.icon}</span>
                  <div className="t-nm" style={{ fontSize:13, fontWeight:500, color:t.color, lineHeight:1.3 }}>{t.label}</div>
                  <div className="t-ht" style={{ fontSize:11, fontWeight:300, color:t.color, opacity:.7, fontStyle:"italic", marginTop:3 }}>{HINTS[t.id]}</div>
                </div>
              ))}
            </div>

            <div className="quick quick-box" onClick={() => startChat(TOPICS[4])}
              style={{ background:"linear-gradient(135deg,rgba(200,150,90,0.1),rgba(140,90,40,0.06))", border:`1.5px solid ${dark?"rgba(210,190,170,0.14)":"rgba(120,80,30,0.2)"}` }}>
              <div style={{ width:42, height:42, borderRadius:"50%", background:"linear-gradient(135deg,#C8965A,#7A4818)", display:"flex", alignItems:"center", justifyContent:"center", color:"#FDF9F0", flexShrink:0 }}>
                <CoffeeIcon size={20}/>
              </div>
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontWeight:600, color:brown }}>Simplemente hablar</div>
                <div style={{ fontSize:12, color:muted, fontWeight:300, marginTop:2 }}>Sin tema. Como siempre empieza la mejor conversación.</div>
              </div>
            </div>
          </div>
        )}

        {/* CHAT */}
        {screen === "chat" && (
          <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden" }}>
            <div style={{ flex:1, overflowY:"auto", padding:"18px 16px 8px", display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ flex:1, height:1, background:border }}/><div style={{ fontSize:10, color:"#C0A070", textTransform:"uppercase", letterSpacing:".1em", fontStyle:"italic" }}>hoy</div><div style={{ flex:1, height:1, background:border }}/>
              </div>
              {messages.map(msg => (
                <div key={msg.id} className={`msg-row ${msg.role==="user"?"user":""}`}>
                  {msg.role==="asst" && (
                    <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#C8965A,#7A4818)", display:"flex", alignItems:"center", justifyContent:"center", color:"#FDF9F0", flexShrink:0 }}>
                      <CoffeeIcon size={13}/>
                    </div>
                  )}
                  <div className="bubble-msg" style={{ maxWidth:"75%", padding:"10px 14px", borderRadius:18, fontSize:14.5, lineHeight:1.65, fontWeight:300, ...(msg.role==="asst" ? { background:surface, border:`1px solid ${border}`, color:textCol, borderTopLeftRadius:4 } : { background:"linear-gradient(135deg,#C8965A,#9A6030)", color:"#FDF9F0", borderTopRightRadius:4 }) }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display:"flex", gap:8 }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#C8965A,#7A4818)", display:"flex", alignItems:"center", justifyContent:"center", color:"#FDF9F0", flexShrink:0 }}>
                    <CoffeeIcon size={13}/>
                  </div>
                  <div style={{ display:"flex", gap:4, alignItems:"center", padding:"11px 15px", background:surface, border:`1px solid ${border}`, borderRadius:18, borderTopLeftRadius:4 }}>
                    <div className="td"/><div className="td"/><div className="td"/>
                  </div>
                </div>
              )}
              <div ref={bottomRef}/>
            </div>
            <div className="input-area-wrap" style={{ padding:"10px 16px 16px", background:surface, borderTop:`1px solid ${border}`, flexShrink:0 }}>
              <div className="inp-row" style={{ display:"flex", alignItems:"flex-end", gap:8, background:bg, border:`1.5px solid ${dark?"rgba(210,190,170,0.16)":"rgba(120,80,30,0.2)"}`, borderRadius:24, padding:"8px 8px 8px 16px", transition:"all .2s" }}>
                <textarea ref={textareaRef} value={input}
                  onChange={e => { setInput(e.target.value); e.target.style.height="auto"; e.target.style.height=Math.min(e.target.scrollHeight,100)+"px"; }}
                  onKeyDown={handleKey} placeholder="cuéntame algo..." rows={1}
                  style={{ flex:1, background:"transparent", border:"none", outline:"none", color:textCol, fontSize:14, fontWeight:300, resize:"none", lineHeight:1.5, maxHeight:100 }}/>
                <button onClick={sendMessage} disabled={!input.trim()||loading}
                  style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#C8965A,#7A4818)", border:"none", cursor:input.trim()?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center", color:"#FDF9F0", flexShrink:0, opacity:input.trim()?1:.4, transition:"all .2s" }}>
                  <SendIcon/>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL ANALYTICS */}
        {showAnalytics && (
          <div className="overlay" onClick={() => setShowAnalytics(false)}>
            <div className="modal modal-box" onClick={e => e.stopPropagation()} style={{ background:surface, border:`1px solid ${border}` }}>
              <button onClick={() => setShowAnalytics(false)} style={{ position:"absolute", top:14, right:14, width:26, height:26, borderRadius:"50%", background:bg, border:`1px solid ${border}`, cursor:"pointer", color:muted, fontSize:15 }}>✕</button>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:brown, textAlign:"center", marginBottom:6 }}>Tu Patrón</div>
              <div style={{ fontSize:11, color:muted, textAlign:"center", marginBottom:20, textTransform:"uppercase", letterSpacing:".08em" }}>resumen general</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {[["🔥 Racha",`${streak} días`,"sin faltar"],["☕ Cafés",cafes,"registrados"],["💬 Sesiones",sessions,"en total"]].map(([l,v,s],i) => (
                  <div key={i} style={{ background:bg, border:`1px solid ${border}`, borderRadius:13, padding:13, textAlign:"center", gridColumn:i===2?"1/-1":"auto" }}>
                    <div style={{ fontSize:11, color:muted, textTransform:"uppercase", letterSpacing:".08em", marginBottom:5 }}>{l}</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:brown }}>{v}</div>
                    <div style={{ fontSize:10.5, color:"#C0A070", fontStyle:"italic", marginTop:3 }}>{s}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:16, paddingTop:14, borderTop:`1px solid ${border}`, textAlign:"center", fontSize:12, color:muted, fontStyle:"italic" }}>
                Sigue así. Los patrones hablan por sí solos.
              </div>
            </div>
          </div>
        )}

        {/* MODAL PERFIL */}
        {showProfile && (
          <div className="overlay" onClick={() => setShowProfile(false)}>
            <div className="modal modal-box" onClick={e => e.stopPropagation()} style={{ background:surface, border:`1px solid ${border}` }}>
              <button onClick={() => setShowProfile(false)} style={{ position:"absolute", top:14, right:14, width:26, height:26, borderRadius:"50%", background:bg, border:`1px solid ${border}`, cursor:"pointer", color:muted, fontSize:15 }}>✕</button>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:brown, textAlign:"center", marginBottom:22 }}>Tu Perfil</div>
              <div style={{ marginBottom:18 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:".08em", color:muted, marginBottom:7 }}>Nombre</label>
                <input type="text" value={profileName} onChange={e => setProfileName(e.target.value)} onKeyDown={e => e.key==="Enter"&&saveProfile()} maxLength={30} placeholder="¿Cómo te llamas?"
                  style={{ width:"100%", padding:"11px 13px", border:`1.5px solid ${dark?"rgba(210,190,170,0.18)":"rgba(120,80,30,0.2)"}`, borderRadius:11, background:bg, color:textCol, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:300, outline:"none" }}/>
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:".08em", color:muted, marginBottom:7 }}>
                  Edad: <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:600, color:brown, marginLeft:4 }}>{profileAge}</span>
                </label>
                <input type="range" className="profile-slider" min="1" max="90" value={profileAge} onChange={e => setProfileAge(parseInt(e.target.value))}
                  style={{ background:`linear-gradient(90deg,#C8965A ${(profileAge-1)/89*100}%,${dark?"rgba(210,190,170,0.2)":"rgba(120,80,30,0.15)"} ${(profileAge-1)/89*100}%)` }}/>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:muted, padding:"0 3px", marginTop:4 }}>
                  <span>1</span><span>45</span><span>90</span>
                </div>
              </div>
              <button onClick={saveProfile} style={{ width:"100%", padding:"13px 16px", background:"linear-gradient(135deg,#C8965A,#9A6030)", border:"none", borderRadius:11, color:"#FDF9F0", fontSize:14, fontWeight:600, cursor:"pointer" }}>
                Guardar cambios
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
