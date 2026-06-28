import { useState, useEffect, useRef } from "react";

const DEMO_CONVERSATIONS = [
  {
    id: "vida", tag: "Vida & rutina",
    color: "#7AAA5A", bg: "rgba(92,122,62,0.14)", border: "rgba(92,122,62,0.28)",
    messages: [
      { role: "user",   text: "Siento que los días pasan y no hago nada con ellos." },
      { role: "coffee", text: "¿O es que haces cosas pero no las sientes tuyas?" },
      { role: "user",   text: "Exacto. Hago mucho pero nada se siente mío." },
      { role: "coffee", text: "Ahí hay algo importante. ¿Cuándo fue la última vez que hiciste algo solo porque tú querías?" },
    ],
  },
  {
    id: "trabajo", tag: "Trabajo & estrés",
    color: "#C8905A", bg: "rgba(154,80,32,0.12)", border: "rgba(154,80,32,0.28)",
    messages: [
      { role: "user",   text: "Tengo una entrevista mañana y no puedo dejar de pensar en que voy a fallar." },
      { role: "coffee", text: "¿Qué es exactamente lo que te imaginas que pasa si falla?" },
      { role: "user",   text: "Que confirme que no soy suficientemente bueno." },
      { role: "coffee", text: "Eso es mucho peso para una sola entrevista. ¿Esa idea viene de mañana o de mucho antes?" },
    ],
  },
  {
    id: "mente", tag: "Mente & emociones",
    color: "#8A9ACA", bg: "rgba(74,90,138,0.14)", border: "rgba(74,90,138,0.28)",
    messages: [
      { role: "user",   text: "Hay algo que no está bien y no sé qué es ni cómo explicarlo." },
      { role: "coffee", text: "No tienes que explicarlo todavía. ¿Cuándo lo empezaste a notar?" },
      { role: "user",   text: "Hace dos semanas. Desde que terminó algo." },
      { role: "coffee", text: "¿Quieres contarme qué terminó, o preferiríamos quedarnos en el cómo se siente?" },
    ],
  },
];

const FEATURES = [
  { icon: "🎧", title: "Te escucha sin juzgar",   desc: "Sin consejos no pedidos. Sin frases vacías. Solo conversación real al ritmo que tú marques." },
  { icon: "☕", title: "Un café por sesión",       desc: "Cada sesión tiene su ritmo. Espresso si tienes prisa, Cappuccino si quieres quedarte." },
  { icon: "🌙", title: "Siempre disponible",       desc: "A las 2am o a las 8am. El café siempre está recién hecho y la barra, abierta." },
];

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function DemoCard({ conv, index }) {
  const [ref, inView] = useInView(0.08);
  const [visibleMsgs, setVisibleMsgs] = useState(0);
  useEffect(() => {
    if (!inView) return;
    conv.messages.forEach((_, i) => setTimeout(() => setVisibleMsgs(v => Math.max(v, i + 1)), i * 480));
  }, [inView]);

  return (
    <div ref={ref} className="land-demo-card" style={{
      background: "rgba(245,237,216,0.04)", border: `1px solid ${conv.border}`,
      borderRadius: 20, padding: "24px 22px", marginBottom: 20,
      opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 0.1}s`,
    }}>
      <div style={{ display:"inline-flex", alignItems:"center", fontSize:11, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.1em", padding:"5px 12px", borderRadius:20, color:conv.color, background:conv.bg, border:`1px solid ${conv.border}`, marginBottom:18 }}>
        {conv.tag}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {conv.messages.map((msg, i) => (
          <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-end", flexDirection: msg.role==="user"?"row-reverse":"row", opacity: visibleMsgs>i?1:0, transform: visibleMsgs>i?"translateY(0)":"translateY(8px)", transition:"opacity 0.35s ease, transform 0.35s ease" }}>
            {msg.role === "coffee" && (
              <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#C8965A,#7A4818)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>☕</div>
            )}
            <div style={{ maxWidth:"72%", padding:"10px 14px", borderRadius:16, fontSize:14, fontWeight:300, lineHeight:1.6, ...(msg.role==="coffee" ? { background:"rgba(245,237,216,0.07)", border:"1px solid rgba(180,130,70,0.15)", color:"#E8D8B8", borderTopLeftRadius:4 } : { background:"linear-gradient(135deg,rgba(200,150,90,0.2),rgba(120,72,24,0.15))", border:"1px solid rgba(180,130,70,0.2)", color:"#C8A870", borderTopRightRadius:4 }) }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ feat, index }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div ref={ref} className="feat-card" style={{ opacity:inView?1:0, transform:inView?"translateY(0)":"translateY(20px)", transition:`opacity .45s ease ${index*.1}s,transform .45s ease ${index*.1}s,background .2s,border-color .2s` }}>
      <div style={{ fontSize:26, marginBottom:12 }}>{feat.icon}</div>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, fontWeight:600, color:"#F5EDD8", marginBottom:8 }}>{feat.title}</div>
      <div style={{ fontSize:13.5, color:"#9A7A50", fontWeight:300, lineHeight:1.6 }}>{feat.desc}</div>
    </div>
  );
}

export default function Landing({ onNext }) {
  const [vis, setVis] = useState(false);
  const [ctaRef, ctaInView] = useInView(0.4);
  useEffect(() => { setTimeout(() => setVis(true), 100); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html, body, #root { height:100%; width:100%; }
        .landing-root { min-height:100vh; background:#1C110A; font-family:'DM Sans',sans-serif; color:#F5EDD8; overflow-y:auto; overflow-x:hidden; scrollbar-width:thin; scrollbar-color:rgba(180,130,70,0.18) transparent; }
        .landing-root::-webkit-scrollbar { width:5px; }
        .landing-root::-webkit-scrollbar-thumb { background:rgba(180,130,70,0.16); border-radius:3px; }
        @keyframes scrollPulse { 0%,100%{opacity:.35;transform:scaleY(1)} 50%{opacity:.8;transform:scaleY(1.2)} }
        @keyframes hintFade { to{opacity:1} }
        @keyframes landFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .cta-btn { display:inline-flex; align-items:center; gap:12px; padding:16px 38px; background:linear-gradient(135deg,#C8965A,#7A4818); border:none; border-radius:50px; color:#FDF9F0; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:500; cursor:pointer; box-shadow:0 6px 24px rgba(120,72,24,0.42); transition:transform .25s cubic-bezier(0.34,1.56,0.64,1),box-shadow .25s; }
        .cta-btn:hover { transform:translateY(-3px) scale(1.04); box-shadow:0 10px 34px rgba(120,72,24,0.52); }
        .cta-btn:active { transform:scale(0.97); }
        .btn-arrow { font-size:18px; display:inline-block; transition:transform .2s; }
        .cta-btn:hover .btn-arrow { transform:translateX(5px); }
        .feat-card { background:rgba(245,237,216,0.04); border:1px solid rgba(180,130,70,0.12); border-radius:18px; padding:26px 22px; transition:background .2s,border-color .2s,transform .2s; cursor:default; }
        .feat-card:hover { background:rgba(245,237,216,0.07); border-color:rgba(180,130,70,0.22); transform:translateY(-3px); }

        /* ── RESPONSIVE MÓVIL ── */
        @media (max-width: 600px) {
          .land-hero { padding:40px 18px !important; min-height:90vh !important; }
          .land-section { padding:48px 18px !important; }
          .land-demo-card { padding:18px 16px !important; margin-bottom:14px !important; }
          .land-cta { padding:40px 18px 70px !important; }
          .land-feat-grid { grid-template-columns:1fr !important; gap:12px !important; }
          .cta-btn { padding:14px 30px !important; font-size:14px !important; }
        }
      `}</style>

      <div className="landing-root">

        {/* HERO */}
        <section className="land-hero" style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"60px 28px", position:"relative" }}>
          <div style={{ position:"absolute", top:"-10%", left:"50%", transform:"translateX(-50%)", width:500, height:500, background:"radial-gradient(ellipse,rgba(140,80,20,0.1) 0%,transparent 65%)", pointerEvents:"none" }}/>

          <div style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#C8965A,#7A4818)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, margin:"0 auto 28px", boxShadow:"0 8px 28px rgba(120,72,24,0.45)", opacity:vis?1:0, transform:vis?"scale(1)":"scale(0.75)", transition:"opacity .5s ease .1s,transform .5s cubic-bezier(0.34,1.56,0.64,1) .1s" }}>☕</div>

          <div style={{ fontSize:11, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.18em", color:"#9A6030", marginBottom:16, opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(10px)", transition:"opacity .4s ease .28s,transform .4s ease .28s" }}>Bienvenido a</div>

          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(44px,8vw,70px)", fontWeight:300, fontStyle:"italic", color:"#F5EDD8", lineHeight:1.1, opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(14px)", transition:"opacity .5s ease .42s,transform .5s ease .42s" }}>
            Sr. <span style={{ color:"#C8965A" }}>Coffee</span>
          </h1>

          <p style={{ fontSize:16, fontWeight:300, color:"#9A7A50", lineHeight:1.75, maxWidth:440, margin:"18px auto 0", opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(10px)", transition:"opacity .45s ease .56s,transform .45s ease .56s" }}>
            Un espacio donde las conversaciones tienen el ritmo de un buen café.<br/>Sin prisa. Sin juicios. Solo tú y una taza lista.
          </p>

          <div style={{ position:"absolute", bottom:32, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:8, opacity:0, animation:"hintFade 1s ease 1.5s forwards" }}>
            <div style={{ width:1, height:42, background:"linear-gradient(to bottom,transparent,rgba(180,130,70,0.45))", animation:"scrollPulse 2s ease-in-out infinite" }}/>
            <div style={{ fontSize:10, color:"#7A5020", textTransform:"uppercase", letterSpacing:"0.12em" }}>descubre más</div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="land-section" style={{ padding:"80px 28px", maxWidth:860, margin:"0 auto" }}>
          <div style={{ fontSize:10.5, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.16em", color:"#7A5020", textAlign:"center", marginBottom:12 }}>¿Qué es Sr. Coffee?</div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,4vw,38px)", fontWeight:300, fontStyle:"italic", color:"#F5EDD8", textAlign:"center", marginBottom:48, lineHeight:1.3 }}>
            Más que un chatbot.<br/>Un compañero de café.
          </h2>
          <div className="land-feat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16 }}>
            {FEATURES.map((f, i) => <FeatureCard key={f.icon} feat={f} index={i}/>)}
          </div>
        </section>

        {/* DIVIDER */}
        <div style={{ display:"flex", alignItems:"center", gap:20, padding:"0 28px", maxWidth:860, margin:"0 auto" }}>
          <div style={{ flex:1, height:1, background:"rgba(180,130,70,0.1)" }}/><div style={{ width:4, height:4, borderRadius:"50%", background:"rgba(180,130,70,0.28)" }}/><div style={{ flex:1, height:1, background:"rgba(180,130,70,0.1)" }}/>
        </div>

        {/* DEMOS */}
        <section className="land-section" style={{ padding:"80px 28px", maxWidth:660, margin:"0 auto" }}>
          <div style={{ fontSize:10.5, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.16em", color:"#7A5020", textAlign:"center", marginBottom:12 }}>Así habla Sr. Coffee</div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(26px,4vw,36px)", fontWeight:300, fontStyle:"italic", color:"#F5EDD8", textAlign:"center", marginBottom:40, lineHeight:1.35 }}>
            Conversaciones reales.<br/>Sin guión.
          </h2>
          {DEMO_CONVERSATIONS.map((conv, i) => <DemoCard key={conv.id} conv={conv} index={i}/>)}
        </section>

        {/* CTA */}
        <section className="land-cta" style={{ padding:"60px 28px 100px", textAlign:"center", position:"relative" }}>
          <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:1, height:60, background:"linear-gradient(to bottom,transparent,rgba(180,130,70,0.28))" }}/>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,5vw,42px)", fontWeight:300, fontStyle:"italic", color:"#F5EDD8", marginBottom:12, lineHeight:1.3 }}>
            ¿Listo para tu primer café?
          </h2>
          <p style={{ fontSize:14, color:"#9A7A50", fontWeight:300, marginBottom:40 }}>Toma asiento. El Sr. Coffee ya está esperando.</p>
          <button ref={ctaRef} className="cta-btn"
            style={{ opacity:ctaInView?1:0, transform:ctaInView?"translateY(0)":"translateY(12px)", transition:"opacity .45s ease .1s,transform .45s cubic-bezier(0.34,1.56,0.64,1) .1s" }}
            onClick={onNext}>
            Entrar al café <span className="btn-arrow">→</span>
          </button>
          <p style={{ fontSize:12, color:"#5A3A1A", marginTop:18, fontStyle:"italic" }}>acceso con credenciales · sin registro</p>
        </section>

      </div>
    </>
  );
}
