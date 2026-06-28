import { useState, useEffect } from "react";

const STEPS = ["ocupacion", "intereses", "cafe"];

const OCCUPATIONS = [
  { id:"estudiante", emoji:"🎓", label:"Estudiante" },
  { id:"creativo",   emoji:"🎨", label:"Creativo / diseñador" },
  { id:"tech",       emoji:"💻", label:"Tecnología / dev" },
  { id:"salud",      emoji:"🏥", label:"Salud" },
  { id:"empresa",    emoji:"📊", label:"Negocios / empresa" },
  { id:"docente",    emoji:"📖", label:"Docente / educación" },
  { id:"independ",   emoji:"🌐", label:"Freelance / independiente" },
  { id:"otro",       emoji:"✨", label:"Otra cosa" },
];

const INTEREST_SECTIONS = [
  { label:"Tu mundo", options:[
    { id:"musica", emoji:"🎵", label:"Música" },
    { id:"cine",   emoji:"🎬", label:"Cine & series" },
    { id:"libros", emoji:"📚", label:"Leer" },
    { id:"arte",   emoji:"🎨", label:"Arte" },
    { id:"deporte",emoji:"⚽", label:"Deporte" },
    { id:"gaming", emoji:"🎮", label:"Gaming" },
    { id:"viajes", emoji:"✈️", label:"Viajar" },
    { id:"cocina", emoji:"🍳", label:"Cocinar" },
  ]},
  { label:"Tu ritmo", options:[
    { id:"madrugador",emoji:"🌅", label:"Madrugador" },
    { id:"nocturno",  emoji:"🌙", label:"Nocturno" },
    { id:"social",    emoji:"👥", label:"Social" },
    { id:"solitario", emoji:"🌿", label:"Tiempo solo" },
    { id:"calma",     emoji:"🧘", label:"Calma" },
    { id:"aventura",  emoji:"🧗", label:"Aventura" },
  ]},
];

const COFFEES = [
  { id:"espresso",   emoji:"⚡", label:"Espresso puro" },
  { id:"cappuccino", emoji:"☁️", label:"Cappuccino" },
  { id:"latte",      emoji:"🥛", label:"Latte" },
  { id:"filtrado",   emoji:"🌿", label:"Café filtrado" },
  { id:"americano",  emoji:"🖤", label:"Americano" },
  { id:"frio",       emoji:"🧊", label:"Cold brew" },
];

export default function Onboarding({ onDone }) {
  const [step,    setStep]    = useState(0);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const [occupation,        setOccupation]        = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [favCoffee,         setFavCoffee]         = useState(null);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const goNext = () => {
    if (step < STEPS.length - 1) {
      setVisible(false);
      setTimeout(() => { setStep(s => s + 1); setVisible(true); }, 320);
    } else {
      setLeaving(true);
      setTimeout(() => onDone(), 480);
    }
  };

  const toggleInterest = (id) =>
    setSelectedInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const canContinue = () => {
    if (STEPS[step] === "ocupacion") return occupation !== null;
    if (STEPS[step] === "intereses") return selectedInterests.length >= 1;
    if (STEPS[step] === "cafe")      return favCoffee !== null;
    return false;
  };

  const QUESTIONS = {
    ocupacion: "¡Hola! Bienvenido a la barra. Antes de empezar, ¿a qué te dedicas?",
    intereses: "Bien. Ahora cuéntame, ¿qué cosas te mueven o te gustan?",
    cafe:      "Última pregunta, la más importante: ¿cuál es tu café ideal?",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html, body, #root { height:100%; width:100%; }

        .onb-root { min-height:100vh; background:#1C110A; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:'DM Sans',sans-serif; padding:40px 24px; overflow-y:auto; transition:opacity .45s ease; }
        .onb-root.leaving { opacity:0; }
        .onb-root::before { content:''; position:absolute; top:-20%; left:50%; transform:translateX(-50%); width:500px; height:500px; background:radial-gradient(ellipse,rgba(140,80,20,0.09) 0%,transparent 65%); pointer-events:none; }

        .onb-inner { width:100%; max-width:540px; opacity:0; transform:translateY(18px); transition:opacity .4s ease,transform .4s cubic-bezier(0.22,1,0.36,1); }
        .onb-inner.vis { opacity:1; transform:translateY(0); }

        .prog-dot { width:6px; height:6px; border-radius:50%; transition:all .3s; }
        .prog-dot.active  { background:#C8965A; transform:scale(1.3); }
        .prog-dot.done    { background:#7A4818; }
        .prog-dot.pending { background:rgba(180,130,70,0.2); }

        .opt-btn { display:flex; align-items:center; gap:9px; padding:12px 14px; background:rgba(245,237,216,0.04); border:1.5px solid rgba(180,130,70,0.14); border-radius:14px; color:#C8B898; font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:300; cursor:pointer; transition:all .2s cubic-bezier(0.34,1.56,0.64,1); text-align:left; width:100%; }
        .opt-btn:hover { background:rgba(245,237,216,0.08); border-color:rgba(180,130,70,0.28); transform:translateY(-2px); }
        .opt-btn.sel { background:rgba(200,150,90,0.16); border-color:rgba(200,150,90,0.45); color:#F5EDD8; transform:translateY(-2px); box-shadow:0 4px 16px rgba(120,72,24,0.2); }

        .chip { display:inline-flex; align-items:center; gap:6px; padding:8px 14px; background:rgba(245,237,216,0.04); border:1.5px solid rgba(180,130,70,0.14); border-radius:22px; color:#C8B898; font-size:13px; font-weight:300; cursor:pointer; transition:all .2s; }
        .chip:hover { background:rgba(245,237,216,0.08); border-color:rgba(180,130,70,0.28); }
        .chip.sel { background:rgba(200,150,90,0.16); border-color:rgba(200,150,90,0.45); color:#F5EDD8; }

        .next-btn { width:100%; padding:14px 16px; margin-top:28px; border-radius:12px; border:none; background:linear-gradient(135deg,#C8965A,#7A4818); color:#FDF9F0; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:500; cursor:pointer; transition:all .22s cubic-bezier(0.34,1.56,0.64,1); box-shadow:0 4px 16px rgba(120,72,24,0.32); opacity:.4; }
        .next-btn.on { opacity:1; }
        .next-btn.on:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(120,72,24,0.44); }
        .next-btn.on:active { transform:scale(0.97); }
        .next-btn:disabled { cursor:default; }

        .skip-link { display:block; text-align:center; font-size:12px; color:#5A3A1A; margin-top:14px; cursor:pointer; font-style:italic; transition:color .2s; background:none; border:none; font-family:'DM Sans',sans-serif; }
        .skip-link:hover { color:#9A7A50; }

        /* ── RESPONSIVE MÓVIL ── */
        @media (max-width: 480px) {
          .onb-root { padding:24px 16px !important; }
          .onb-options-grid { grid-template-columns:repeat(auto-fill,minmax(110px,1fr)) !important; gap:8px !important; }
          .opt-btn { font-size:12.5px !important; padding:10px 11px !important; }
          .chip { font-size:12px !important; padding:7px 12px !important; }
        }
      `}</style>

      <div className={`onb-root ${leaving ? "leaving" : ""}`}>
        <div className={`onb-inner ${visible ? "vis" : ""}`}>

          {/* progreso */}
          <div style={{ display:"flex", gap:6, marginBottom:32, justifyContent:"center" }}>
            {STEPS.map((s, i) => (
              <div key={s} className={`prog-dot ${i===step?"active":i<step?"done":"pending"}`}/>
            ))}
          </div>

          {/* burbuja Sr. Coffee */}
          <div style={{ display:"flex", gap:14, alignItems:"flex-end", marginBottom:36 }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#C8965A,#7A4818)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0, boxShadow:"0 4px 16px rgba(120,72,24,0.38)" }}>☕</div>
            <div style={{ background:"rgba(245,237,216,0.06)", border:"1px solid rgba(180,130,70,0.18)", borderRadius:18, borderBottomLeftRadius:4, padding:"16px 18px", flex:1 }}>
              <div style={{ fontSize:10.5, fontWeight:500, textTransform:"uppercase", letterSpacing:".1em", color:"#9A6030", marginBottom:6 }}>Sr. Coffee</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:300, fontStyle:"italic", color:"#F5EDD8", lineHeight:1.45 }}>
                {QUESTIONS[STEPS[step]]}
              </div>
            </div>
          </div>

          {/* PASO: ocupación */}
          {STEPS[step] === "ocupacion" && (
            <div>
              <div style={{ fontSize:10.5, fontWeight:500, textTransform:"uppercase", letterSpacing:".12em", color:"#7A5020", marginBottom:16 }}>Elige una opción</div>
              <div className="onb-options-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:10 }}>
                {OCCUPATIONS.map(o => (
                  <button key={o.id} className={`opt-btn ${occupation===o.id?"sel":""}`} onClick={() => setOccupation(o.id)}>
                    <span style={{ fontSize:18 }}>{o.emoji}</span>{o.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PASO: intereses */}
          {STEPS[step] === "intereses" && (
            <div>
              {INTEREST_SECTIONS.map(sec => (
                <div key={sec.label} style={{ marginBottom:24 }}>
                  <div style={{ fontSize:11, fontWeight:500, textTransform:"uppercase", letterSpacing:".1em", color:"#7A5020", marginBottom:10 }}>{sec.label}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {sec.options.map(opt => (
                      <button key={opt.id} className={`chip ${selectedInterests.includes(opt.id)?"sel":""}`} onClick={() => toggleInterest(opt.id)}>
                        <span style={{ fontSize:15 }}>{opt.emoji}</span>{opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PASO: café favorito */}
          {STEPS[step] === "cafe" && (
            <div>
              <div style={{ fontSize:10.5, fontWeight:500, textTransform:"uppercase", letterSpacing:".12em", color:"#7A5020", marginBottom:16 }}>Elige tu café</div>
              <div className="onb-options-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:10 }}>
                {COFFEES.map(c => (
                  <button key={c.id} className={`opt-btn ${favCoffee===c.id?"sel":""}`} onClick={() => setFavCoffee(c.id)}>
                    <span style={{ fontSize:18 }}>{c.emoji}</span>{c.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button className={`next-btn ${canContinue()?"on":""}`} disabled={!canContinue()} onClick={goNext}>
            {step < STEPS.length - 1 ? "Siguiente →" : "Entrar al café →"}
          </button>
          <button className="skip-link" onClick={() => onDone()}>saltar por ahora</button>

        </div>
      </div>
    </>
  );
}
