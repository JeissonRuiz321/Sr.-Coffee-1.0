import { useState } from "react";

const VALID_USER = "coffeelover";
const VALID_PASS = "1234";

const LOADING_PHRASES = [
  "Tu café está siendo preparado...",
  "Moliendo los granos del día...",
  "Calentando la barra...",
  "El espresso está por salir...",
  "Ajustando la temperatura...",
];

export default function Login({ onLogin }) {
  const [user,    setUser]    = useState("");
  const [pass,    setPass]    = useState("");
  const [error,   setError]   = useState(false);
  const [shake,   setShake]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [phrase,  setPhrase]  = useState(0);

 const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    setError(false);
    setLoading(true);
    const interval = setInterval(() => setPhrase(p => (p + 1) % LOADING_PHRASES.length), 1200);
    setTimeout(() => { clearInterval(interval); onLogin(); }, 5000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html,body,#root { height:100%; width:100%; overflow:hidden; }

        .login-root { min-height:100vh; background:#1C110A; display:flex; align-items:center; justify-content:center; font-family:'DM Sans',sans-serif; position:relative; overflow:hidden; }
        .login-root::before { content:''; position:absolute; top:-40%; left:-30%; width:80%; height:80%; background:radial-gradient(ellipse,rgba(160,90,30,0.12) 0%,transparent 65%); pointer-events:none; }

        .login-card { background:#F5EDD8; border-radius:24px; padding:44px 40px; width:100%; max-width:400px; position:relative; z-index:1; box-shadow:0 32px 80px rgba(0,0,0,0.55),0 8px 24px rgba(0,0,0,0.28),0 0 0 1px rgba(180,130,70,0.12); animation:cardIn .5s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes cardIn { from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
        .login-card.shake { animation:shake .5s cubic-bezier(.36,.07,.19,.97) both; }

        .l-field { margin-bottom:16px; }
        .l-label { display:block; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.1em; color:#7A5020; margin-bottom:8px; }
        .l-input { width:100%; padding:13px 16px; border-radius:12px; border:1.5px solid rgba(120,80,30,0.2); background:#FDF9F0; color:#2D1A0A; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:300; outline:none; transition:border-color .2s,box-shadow .2s; box-shadow:inset 0 1px 3px rgba(90,50,10,0.07); }
        .l-input:focus { border-color:#B08050; box-shadow:inset 0 1px 3px rgba(90,50,10,0.07),0 0 0 3px rgba(176,128,80,0.15); }
        .l-input.err { border-color:#A0401A; box-shadow:inset 0 1px 3px rgba(160,64,26,0.1),0 0 0 3px rgba(160,64,26,0.1); }
        .l-input::placeholder { color:#C0A070; font-style:italic; }
        .l-error { font-size:12px; color:#A0401A; margin-top:6px; font-style:italic; opacity:0; transform:translateY(-4px); transition:opacity .25s,transform .25s; }
        .l-error.show { opacity:1; transform:translateY(0); }

        .l-btn { width:100%; padding:14px 16px; margin-top:8px; border-radius:12px; border:none; background:linear-gradient(135deg,#C8965A,#7A4818); color:#FDF9F0; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:500; cursor:pointer; transition:all .22s cubic-bezier(0.34,1.56,0.64,1); box-shadow:0 4px 16px rgba(120,72,24,0.32); }
        .l-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 24px rgba(120,72,24,0.42); }
        .l-btn:active:not(:disabled) { transform:scale(0.97); }
        .l-btn:disabled { opacity:.7; cursor:default; }

        .loading-screen { position:fixed; inset:0; background:#1C110A; display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:200; animation:fadeIn .35s ease; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        .cup-wrap { position:relative; width:80px; height:80px; margin-bottom:32px; }
        .cup-body { position:absolute; bottom:0; left:10px; width:60px; height:50px; background:linear-gradient(160deg,#C8965A,#7A4818); border-radius:4px 4px 22px 22px; box-shadow:0 4px 20px rgba(120,72,24,0.45); }
        .cup-handle { position:absolute; right:0; bottom:12px; width:18px; height:22px; border:3px solid #C8965A; border-left:none; border-radius:0 11px 11px 0; }
        .cup-saucer { position:absolute; bottom:0; left:0; width:80px; height:9px; background:linear-gradient(135deg,#B08050,#6A3810); border-radius:50%; }
        .steam-wrap { position:absolute; bottom:54px; left:50%; transform:translateX(-50%); display:flex; gap:7px; }
        .steam-line { width:3px; border-radius:2px; background:rgba(200,150,90,0.55); animation:steamRise 1.8s ease-in-out infinite; }
        .steam-line:nth-child(1){height:18px;animation-delay:0s}
        .steam-line:nth-child(2){height:26px;animation-delay:.35s}
        .steam-line:nth-child(3){height:18px;animation-delay:.7s}
        @keyframes steamRise { 0%{opacity:0;transform:translateY(0) scaleX(1)} 30%{opacity:.85} 70%{opacity:.3;transform:translateY(-18px) scaleX(1.5)} 100%{opacity:0;transform:translateY(-30px) scaleX(2)} }

        .loading-phrase { font-family:'Cormorant Garamond',serif; font-size:21px; font-weight:300; font-style:italic; color:#C8965A; text-align:center; animation:phraseIn .5s ease; max-width:300px; line-height:1.4; }
        @keyframes phraseIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

        .l-dots { display:flex; gap:7px; margin-top:18px; }
        .l-dot { width:6px; height:6px; border-radius:50%; background:#7A4818; animation:dotBlink 1.4s ease-in-out infinite; }
        .l-dot:nth-child(2){animation-delay:.2s} .l-dot:nth-child(3){animation-delay:.4s}
        @keyframes dotBlink { 0%,80%,100%{opacity:.2;transform:scale(0.8)} 40%{opacity:1;transform:scale(1.25);background:#C8965A} }

        .l-bar-wrap { width:180px; height:2px; background:rgba(180,130,70,0.15); border-radius:2px; margin-top:28px; overflow:hidden; }
        .l-bar { height:100%; background:linear-gradient(90deg,#C8965A,#7A4818); border-radius:2px; animation:barFill 5s linear forwards; }
        @keyframes barFill { from{width:0%} to{width:100%} }

        /* ── RESPONSIVE MÓVIL ── */
        @media (max-width: 480px) {
          .login-card { padding:30px 22px !important; max-width:92vw !important; }
          .cup-wrap { width:64px !important; height:64px !important; }
          .loading-phrase { font-size:17px !important; }
        }
      `}</style>

      {loading && (
        <div className="loading-screen">
          <div className="cup-wrap">
            <div className="steam-wrap">
              <div className="steam-line"/><div className="steam-line"/><div className="steam-line"/>
            </div>
            <div className="cup-body"/>
            <div className="cup-handle"/>
            <div className="cup-saucer"/>
          </div>
          <div key={phrase} className="loading-phrase">{LOADING_PHRASES[phrase]}</div>
          <div className="l-dots">
            <div className="l-dot"/><div className="l-dot"/><div className="l-dot"/>
          </div>
          <div className="l-bar-wrap"><div className="l-bar"/></div>
        </div>
      )}

      <div className="login-root">
        <div className={`login-card ${shake ? "shake" : ""}`}>
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:"linear-gradient(135deg,#C8965A,#7A4818)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, margin:"0 auto 14px", boxShadow:"0 6px 20px rgba(120,72,24,0.38)" }}>☕</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:600, color:"#2D1A0A" }}>Sr. Coffee</div>
            <div style={{ fontSize:13, color:"#9A7A50", marginTop:6, fontWeight:300, fontStyle:"italic" }}>la barra siempre está lista</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="l-field">
              <label className="l-label">Usuario</label>
              <input type="text" className={`l-input ${error?"err":""}`} placeholder="tu nombre aquí" value={user} onChange={e=>{setUser(e.target.value);setError(false);}} autoFocus/>
            </div>
            <div className="l-field">
              <label className="l-label">Contraseña</label>
              <input type="password" className={`l-input ${error?"err":""}`} placeholder="••••••••" value={pass} onChange={e=>{setPass(e.target.value);setError(false);}}/>
              <div className={`l-error ${error?"show":""}`}>Credenciales incorrectas. Intenta de nuevo.</div>
            </div>
            <button type="submit" className="l-btn" disabled={loading||!user.trim()||!pass}>Ingresar</button>
          </form>

          <div style={{ textAlign:"center", fontSize:11.5, color:"#B09070", marginTop:20, fontStyle:"italic" }}>
           
          </div>
        </div>
      </div>
    </>
  );
}
