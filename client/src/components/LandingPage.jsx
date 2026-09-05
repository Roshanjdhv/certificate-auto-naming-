import React, { useState, useRef, useEffect } from "react";
import { PRESET_TEMPLATES } from "../utils/templatesData";

const T = {
  bg:"var(--bg)", s0:"var(--surface)", s1:"var(--surface2)", s2:"var(--surface3)", s3:"var(--surface3)", s4:"var(--border)",
  pr:"var(--text)", onPr:"var(--bg)", mu:"var(--text-muted)", ou:"var(--text-muted)", ouV:"var(--border-muted)",
  xs:"4px", sm:"8px", md:"12px", ba:"16px", lg:"20px", xl:"24px", x2:"32px", x3:"48px",
  accent:"var(--accent)",
};

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, delay = 0, dir = "up" }) {
  const [r, vis] = useReveal(0.1);
  const trs = { up:"translateY(36px)", down:"translateY(-36px)", left:"translateX(-36px)", right:"translateX(36px)" };
  return (
    <div ref={r} style={{ opacity:vis?1:0, transform:vis?"none":(trs[dir]||"translateY(36px)"), transition:`opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

function LandingPage({ onUploadCertificate, onOpenStudio, onOpenHowToUse, theme, toggleTheme }) {
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [feedbackText, setFeedbackText] = useState("Processing...");
  const [smtpStatus, setSmtpStatus] = useState("Handshake: 250 OK ready for pipeline");
  const [isTesting, setIsTesting] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x:50, y:50 });
  const fileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMove = (e) => setMousePos({ x:(e.clientX/window.innerWidth)*100, y:(e.clientY/window.innerHeight)*100 });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const processFile = (file) => {
    if (!file.type.startsWith("image/")) { alert("Please upload an image file (PNG, JPG, WebP)."); return; }
    setProcessing(true); setFeedbackText(`Loading ${file.name}\u2026`);
    setTimeout(() => { setFeedbackText("Certificate Initialized!"); setTimeout(() => { setProcessing(false); onUploadCertificate(file); }, 700); }, 900);
  };
  const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); const f = e.dataTransfer.files?.[0]; if (f) processFile(f); };
  const handleTestSmtp = (e) => { e.preventDefault(); setIsTesting(true); setSmtpStatus("Initiating TLS handshake\u2026"); setTimeout(() => { setIsTesting(false); setSmtpStatus("\u2713 Authentication Successful"); }, 1400); };

  const SW = { width:"100%", maxWidth:"1280px", margin:"0 auto", padding:"0 48px" };
  const card = (ex={}) => ({ background:T.s1, borderRadius:16, padding:T.x2, border:`1px solid ${T.ouV}`, boxShadow:"0 4px 24px rgba(0,0,0,0.4)", transition:"background 0.25s,transform 0.25s,box-shadow 0.25s", ...ex });
  const inp = { width:"100%", height:38, padding:`0 ${T.md}`, background:T.s0, border:`1px solid ${T.s4}`, color:T.pr, borderRadius:8, fontSize:12, fontFamily:"monospace", outline:"none", boxSizing:"border-box" };
  const lbl = { display:"block", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:T.mu, marginBottom:T.xs };

  const CSS = `
    @keyframes fadeSlideDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:none}}
    @keyframes fadeSlideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}
    @keyframes ping{75%,100%{transform:scale(2.2);opacity:0}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
    @keyframes float2{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes pulse-glow{0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,0.25)}50%{box-shadow:0 0 0 24px rgba(255,255,255,0)}}
    @keyframes gradient-shift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
    @keyframes border-pulse{0%,100%{border-color:rgba(255,255,255,0.35)}50%{border-color:rgba(255,255,255,0.75)}}
    @keyframes scan{0%{top:-4px}100%{top:101%}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
    @keyframes orbit{from{transform:rotate(0deg) translateX(120px) rotate(0deg)}to{transform:rotate(360deg) translateX(120px) rotate(-360deg)}}
    @keyframes rotateDial{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes laserScan{0%,100%{top:10%;opacity:0.2}50%{top:85%;opacity:1}}
    @keyframes pulseBrackets{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.04)}}

    .lp-nav{animation:fadeSlideDown .6s ease both}
    .lp-t1{animation:fadeSlideUp .8s .15s ease both}
    .lp-t2{animation:fadeSlideUp .8s .35s ease both}
    .lp-t3{animation:fadeSlideUp .8s .55s ease both}
    .lp-t4{animation:fadeSlideUp .9s .75s ease both}
    .lp-float{animation:float 7s ease-in-out infinite}
    .lp-float2{animation:float2 9s ease-in-out 2s infinite}
    .lp-float3{animation:float 11s ease-in-out 5s infinite}
    .lp-spin{animation:spin 1s linear infinite}
    .lp-ping{animation:ping 1.5s cubic-bezier(0,0,.2,1) infinite}
    .lp-glow{animation:pulse-glow 2.5s ease-in-out infinite}
    .lp-blink{animation:blink 1.1s steps(1) infinite}
    .lp-orbit{animation:orbit 14s linear infinite}
    .lp-orbit2{animation:orbit2 20s linear infinite}
    .lp-scan{animation:scan 3s linear infinite}
    .lp-border{animation:border-pulse 3s ease-in-out infinite}

    .lp-card:hover{background:var(--surface2)!important;transform:translateY(-6px)!important;box-shadow:0 20px 60px var(--shadow-lg)!important}
    .lp-tcard:hover{transform:translateY(-10px)!important;box-shadow:0 24px 64px var(--shadow-lg)!important}
    .lp-btn:hover{opacity:.88!important;transform:translateY(-2px)!important}
    .lp-ghost:hover{background:var(--border)!important;transform:translateY(-2px)!important}
    .lp-navlink:hover{color:var(--text)!important}
    .lp-zone:hover{border-color:var(--border-strong)!important;background:var(--surface2)!important}
    .lp-icon{transition:transform .3s ease}
    .lp-zone:hover .lp-icon{transform:scale(1.12)!important}

    @keyframes marqueeLeft{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    @keyframes marqueeRight{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}
    .marquee-container{display:flex;width:max-content;gap:24px;padding:0 12px}
    .marquee-row{overflow:hidden;margin-bottom:24px;position:relative}
    .marquee-row::before,.marquee-row::after{content:"";position:absolute;top:0;bottom:0;width:150px;z-index:2;pointer-events:none}
    .marquee-row::before{left:0;background:linear-gradient(to right,var(--bg),transparent)}
    .marquee-row::after{right:0;background:linear-gradient(to left,var(--bg),transparent)}
    .marquee-left{animation:marqueeLeft 60s linear infinite}
    .marquee-right{animation:marqueeRight 60s linear infinite}
    .marquee-row:hover .marquee-left, .marquee-row:hover .marquee-right{animation-play-state:paused}

    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}
    ::-webkit-scrollbar-thumb:hover{background:var(--text-muted)}
  `;

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.pr,fontFamily:"'Poppins','Inter',sans-serif",overflowX:"hidden"}}>
      <style>{CSS}</style>

      {/* NAVBAR */}
      <header className="lp-nav" style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:navScrolled?"var(--surface)":"var(--bg)",backdropFilter:"blur(24px)",borderBottom:navScrolled?`1px solid var(--border)`:"1px solid transparent",height:72,display:"flex",alignItems:"center",transition:"all .4s"}}>
        <div style={{...SW,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:T.sm,cursor:"pointer"}} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>
            <div style={{width:38,height:38,borderRadius:12,background:"var(--accent)",display:"grid",placeItems:"center",boxShadow:"0 0 20px rgba(0,0,0,0.1)"}}>
              <span className="material-symbols-outlined" style={{fontSize:24,color:"var(--bg)"}}>workspace_premium</span>
            </div>
            <span style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em",color:"var(--text)"}}>CertFlow</span>
          </div>
          <nav style={{display:"flex",alignItems:"center",gap:"32px"}}>
            {[["#features","Features"],["#how-it-works","How It Works"],["#templates","Templates"]].map(([h,l])=>(
              <a key={h} href={h} className="lp-navlink" style={{fontSize:14,color:"var(--text-muted)",textDecoration:"none",transition:"color .2s",fontWeight:500}}>{l}</a>
            ))}
          </nav>
          <div style={{display:"flex",alignItems:"center",gap:T.md}}>
            <button onClick={toggleTheme} className="lp-ghost" style={{display:"flex",alignItems:"center",justifyContent:"center",width:38,height:38,borderRadius:999,background:"var(--surface2)",color:"var(--text)",border:"1px solid var(--border)",cursor:"pointer",transition:"all .2s"}} title="Toggle Theme">
              <span className="material-symbols-outlined" style={{fontSize:20}}>{theme === 'light' ? 'dark_mode' : 'light_mode'}</span>
            </button>
            <button onClick={()=>document.getElementById("drop-zone")?.scrollIntoView({behavior:"smooth"})} className="lp-ghost" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 20px",borderRadius:999,background:"var(--surface2)",color:"var(--text)",border:"1px solid var(--border)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>
              <span className="material-symbols-outlined" style={{fontSize:18}}>cloud_upload</span>Upload Certificate
            </button>
            <button onClick={onOpenStudio} className="lp-btn" style={{padding:"10px 24px",borderRadius:999,background:"var(--accent)",color:"var(--bg)",border:"none",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .2s",boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
              Open Studio &rarr;
            </button>
          </div>
        </div>
      </header>

      <main style={{paddingTop:72}}>

        {/* HERO SECTION */}
        <section style={{position:"relative",minHeight:"85vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"60px 0 40px",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,pointerEvents:"none",background:`radial-gradient(700px circle at ${mousePos.x}% ${mousePos.y}%,rgba(255,255,255,0.04),transparent 65%)`,transition:"background .15s",zIndex:0}}/>
          <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)`,backgroundSize:"48px 48px",zIndex:0}}/>

          <div style={{...SW,position:"relative",zIndex:1}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"48px",alignItems:"center"}}>

              {/* LEFT COLUMN */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:"24px"}}>
                <div className="lp-t1" style={{display:"inline-flex",alignItems:"center",gap:8,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:999,padding:"6px 16px",fontSize:12,fontWeight:600,color:"var(--text-muted)"}}>
                  <span style={{color:"var(--accent)",fontSize:13}}>âœ¦</span> NEW: Create once, send to hundreds
                </div>

                <h1 className="lp-t2" style={{fontSize:"clamp(42px,5vw,68px)",fontWeight:800,lineHeight:1.08,letterSpacing:"-0.035em",margin:0,color:"var(--text)"}}>
                  Create &amp; Send<br/>
                  Personalised<br/>
                  <span style={{color:"var(--accent)"}}>Certificates</span>
                </h1>

                <p className="lp-t2" style={{fontSize:16,color:"var(--text-muted)",maxWidth:480,lineHeight:1.7,margin:0}}>
                  Design beautiful certificate templates, import recipient data, and deliver personalised certificates instantly via ZIP download or email.
                </p>

                {/* STATS ROW */}
                <div className="lp-t3" style={{display:"flex",alignItems:"center",gap:"16px",marginTop:T.md,width:"100%"}}>
                  {[
                    ["workspace_premium","500+","Certificates / Min"],
                    ["bolt","1-Click","Email Dispatch"],
                    ["shield","100%","Secure & Private"]
                  ].map(([icon,val,lbl])=>(
                    <div key={lbl} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 16px",background:"var(--surface2)",borderRadius:14,border:"1px solid var(--border)",flex:1}}>
                      <div style={{width:38,height:38,borderRadius:10,background:"var(--surface)",border:"1px solid var(--border-muted)",display:"grid",placeItems:"center",flexShrink:0}}>
                        <span className="material-symbols-outlined" style={{fontSize:20,color:"var(--accent)"}}>{icon}</span>
                      </div>
                      <div>
                        <div style={{fontSize:16,fontWeight:800,color:"var(--text)",lineHeight:1.2}}>{val}</div>
                        <div style={{fontSize:11,color:"var(--text-muted)",marginTop:2,whiteSpace:"nowrap"}}>{lbl}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN - ANIMATED CIRCULAR SCAN PORTAL */}
              <div style={{position:"relative",display:"flex",justifyContent:"center",alignItems:"center"}}>
                {/* Format Badges Top Right */}
                <div style={{position:"absolute",top:0,right:20,zIndex:10,display:"flex",gap:6,background:"var(--surface2)",border:"1px solid var(--border)",padding:"4px 8px",borderRadius:12,backdropFilter:"blur(12px)"}}>
                  {["PNG","JPG","WEBP"].map(fmt=>(
                    <span key={fmt} style={{fontSize:10,fontWeight:700,fontFamily:"monospace",color:"var(--text)",padding:"2px 8px",borderRadius:6,background:"var(--surface3)",border:"1px solid var(--border-muted)"}}>{fmt}</span>
                  ))}
                </div>

                {/* CIRCULAR DASHED ROTATING DIAL */}
                <div id="drop-zone" onClick={()=>fileRef.current?.click()} onDragOver={e=>{e.preventDefault();e.stopPropagation();setDragActive(true);}} onDragLeave={e=>{e.preventDefault();setDragActive(false);}} onDrop={handleDrop}
                  style={{position:"relative",width:460,height:460,borderRadius:"50%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.3s"}}>
                  
                  {/* Rotating Dial Ring */}
                  <svg width="460" height="460" viewBox="0 0 460 460" style={{position:"absolute",inset:0,animation:"rotateDial 40s linear infinite",pointerEvents:"none"}}>
                    <circle cx="230" cy="230" r="224" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 6" />
                    <circle cx="230" cy="230" r="212" fill="none" stroke="var(--border-muted)" strokeWidth="1.5" strokeDasharray="60 4 120 4 40 4" />
                    <circle cx="230" cy="230" r="198" fill="none" stroke="var(--border)" strokeWidth="1" />
                  </svg>

                  {/* Outer Pulsing Glow */}
                  <div style={{position:"absolute",inset:20,borderRadius:"50%",background:"radial-gradient(circle,var(--surface) 0%,transparent 70%,transparent 100%)",border:"1px solid var(--border)",boxShadow:dragActive?"0 0 60px var(--accent-light)":"0 0 40px var(--surface2)",transition:"all .3s"}}/>

                  <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f)processFile(f);}}/>

                  {/* PORTAL INNER CONTENT */}
                  <div style={{position:"relative",zIndex:5,display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",padding:"30px",maxWidth:340}}>
                    
                    {/* CERTIFICATE GRAPHIC WITH SCANNER */}
                    <div style={{position:"relative",width:180,height:115,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface2)",backdropFilter:"blur(10px)",boxShadow:"0 12px 32px rgba(0,0,0,0.1)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",marginBottom:20,overflow:"hidden"}}>
                      {/* Corner Brackets */}
                      <div style={{position:"absolute",top:-2,left:-2,width:16,height:16,borderTop:"3px solid var(--text-muted)",borderLeft:"3px solid var(--text-muted)",borderRadius:"4px 0 0 0"}}/>
                      <div style={{position:"absolute",top:-2,right:-2,width:16,height:16,borderTop:"3px solid var(--text-muted)",borderRight:"3px solid var(--text-muted)",borderRadius:"0 4px 0 0"}}/>
                      <div style={{position:"absolute",bottom:-2,left:-2,width:16,height:16,borderBottom:"3px solid var(--text-muted)",borderLeft:"3px solid var(--text-muted)",borderRadius:"0 0 0 4px"}}/>
                      <div style={{position:"absolute",bottom:-2,right:-2,width:16,height:16,borderBottom:"3px solid var(--text-muted)",borderRight:"3px solid var(--text-muted)",borderRadius:"0 0 4px 0"}}/>

                      {/* Laser Scan Line */}
                      <div style={{position:"absolute",left:0,right:0,height:2,background:"var(--accent)",boxShadow:"0 0 12px var(--accent), 0 0 24px var(--accent)",animation:"laserScan 2.6s ease-in-out infinite",zIndex:3}}/>

                      {/* Certificate Inner Preview Sketch */}
                      <div style={{width:"85%",height:"75%",border:"1px dashed var(--border)",borderRadius:6,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,padding:6}}>
                        <div style={{width:"60%",height:4,background:"var(--border)",borderRadius:2}}/>
                        <div style={{width:24,height:24,borderRadius:"50%",border:"1px solid var(--border)",display:"grid",placeItems:"center"}}>
                          <span className="material-symbols-outlined" style={{fontSize:14,color:"var(--text-muted)"}}>workspace_premium</span>
                        </div>
                        <div style={{width:"40%",height:3,background:"var(--border)",borderRadius:2}}/>
                      </div>
                    </div>

                    {/* PROMPT TEXT */}
                    <h3 style={{fontSize:20,fontWeight:700,color:"var(--text-muted)",margin:"0 0 6px",letterSpacing:"-0.02em"}}>
                      Drop your <span style={{color:"var(--text)",fontWeight:800}}>certificate</span> here
                    </h3>
                    <p style={{fontSize:12,color:"var(--text-muted)",margin:"0 0 18px"}}>PNG, JPG or WebP &mdash; up to 25MB</p>

                    {/* UPLOAD BUTTON */}
                    <button type="button" onClick={e=>{e.stopPropagation();fileRef.current?.click();}} className="lp-ghost" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 24px",borderRadius:999,background:"var(--surface)",color:"var(--text)",border:"1px solid var(--border)",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .2s",boxShadow:"0 4px 16px rgba(0,0,0,0.1)"}}>
                      <span className="material-symbols-outlined" style={{fontSize:18,color:"var(--accent)"}}>cloud_upload</span>Upload Certificate
                    </button>

                    <span style={{fontSize:11,color:"var(--text-muted)",marginTop:12,fontFamily:"monospace"}}>or drag & drop your certificate image here</span>
                  </div>

                  {processing&&(
                    <div style={{position:"absolute",inset:0,background:"var(--surface2)",backdropFilter:"blur(16px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:T.md,zIndex:20,borderRadius:"50%"}}>
                      <div className="lp-spin" style={{width:48,height:48,borderRadius:"50%",border:"3px solid var(--border)",borderTopColor:"var(--accent)",boxSizing:"border-box"}}/>
                      <p style={{fontSize:16,fontWeight:700,color:"var(--text)",margin:0}}>{feedbackText}</p>
                      <p style={{fontSize:12,color:"var(--text-muted)",margin:0,fontFamily:"monospace"}}>Redirecting to canvas editor&hellip;</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* BOTTOM 4-STEP PROCESS BAR */}
            <div style={{marginTop:"64px"}}>
              <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:24,padding:"32px 40px",display:"grid",gridTemplateColumns:"1fr auto 1fr auto 1fr auto 1fr",alignItems:"center",gap:"16px",boxShadow:"0 16px 48px rgba(0,0,0,0.1)"}}>
                {[
                  ["01","style","Choose Template","Pick a template or create your own."],
                  ["02","table_chart","Upload Data","Import your recipient list via Excel."],
                  ["03","auto_fix_high","Personalise Fields","Map and preview your data."],
                  ["04","send","Download / Send","Download ZIP or send via email instantly."]
                ].map(([step,icon,title,desc],idx,arr)=>(
                  <React.Fragment key={step}>
                    <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
                      <div style={{fontSize:13,fontWeight:800,color:"var(--accent)",background:"var(--surface2)",border:"1px solid var(--border)",width:32,height:32,borderRadius:10,display:"grid",placeItems:"center",flexShrink:0,marginTop:2}}>
                        {step}
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:4}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{width:34,height:34,borderRadius:10,background:"var(--surface2)",border:"1px solid var(--border)",display:"grid",placeItems:"center",flexShrink:0}}>
                            <span className="material-symbols-outlined" style={{fontSize:18,color:"var(--text)"}}>{icon}</span>
                          </div>
                          <span style={{fontSize:15,fontWeight:700,color:"var(--text)"}}>{title}</span>
                        </div>
                        <p style={{fontSize:12,color:"var(--text-muted)",margin:0,lineHeight:1.4,maxWidth:180}}>{desc}</p>
                      </div>
                    </div>
                    {idx < arr.length - 1 && (
                      <span className="material-symbols-outlined" style={{fontSize:20,color:"var(--border-muted)"}}>arrow_forward</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* FEATURES */}
        <section id="features" style={{...SW,padding:"0 48px 80px"}}>
          <Reveal><div style={{textAlign:"center",marginBottom:T.x2}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:T.xs}}>Why CertFlow</div>
            <h2 style={{fontSize:"clamp(24px,3vw,38px)",fontWeight:800,color:T.pr,letterSpacing:"-0.03em",margin:0}}>Everything You Need</h2>
          </div></Reveal>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:T.md}}>
            {[["badge","Personalised","Automatically add names, courses, dates, grades with zero manual positioning.",150],
              ["dynamic_feed","Bulk Generation","Generate hundreds of certificates from one template in seconds.",250],
              ["forward_to_inbox","Direct Email","Send via your authenticated SMTP &mdash; no third-party branding.",350],
              ["bolt","Zero Manual Work","Eliminate hours of repetitive formatting with deterministic pipelines.",450],
            ].map(([icon,title,body,delay])=>(
              <Reveal key={title} delay={delay}>
                <div className="lp-card" style={{...card(),display:"flex",flexDirection:"column",gap:T.md,height:"100%"}}>
                  <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,var(--border),rgba(255,255,255,.04))",border:"1px solid var(--border-muted)",display:"grid",placeItems:"center"}}>
                    <span className="material-symbols-outlined" style={{fontSize:22,color:"var(--text)"}}>{icon}</span>
                  </div>
                  <div>
                    <h3 style={{fontSize:15,fontWeight:700,color:T.pr,margin:"0 0 6px"}}>{title}</h3>
                    <p style={{fontSize:13,color:T.mu,lineHeight:1.65,margin:0}} dangerouslySetInnerHTML={{__html:body}}/>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" style={{...SW,padding:"0 48px 80px"}}>
          <Reveal>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:T.x2,flexWrap:"wrap",gap:T.md}}>
              <div>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:T.xs}}>Workflow</div>
                <h2 style={{fontSize:"clamp(22px,3vw,36px)",fontWeight:800,color:T.pr,letterSpacing:"-0.03em",margin:0}}>How CertFlow Works</h2>
              </div>
              <p style={{fontSize:14,color:T.mu,maxWidth:360,lineHeight:1.7,margin:0}}>From a raster image to personalized certificates in six steps.</p>
            </div>
          </Reveal>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:T.md}}>
            {[["01","image","Upload Your Certificate","Upload your design as PNG, JPG, or WebP from any design tool.","Supported: PNG / JPG / WebP",100],
              ["02","table_view","Import Recipient List","Upload Excel or CSV &mdash; columns become token tags.","{{Name}} {{Email}} {{Course}}",200],
              ["03","drag_pan","Place Fields","Drag fields onto the canvas. Replaced per recipient automatically.","Snap-to-grid positioning",300],
              ["04","match_case","Style Typography","Control fonts, sizes, colors, alignment, bold, italic, position.","20+ Google Fonts",400],
              ["05","find_in_page","Preview & Adjust","Preview each certificate. Override individual rows as needed.","Row-level overrides",500],
              ["06","unarchive","Download or Email","Export as ZIP or dispatch via SMTP directly from the app.","Zip / SMTP dispatch",600],
            ].map(([n,icon,title,body,footer,delay])=>(
              <Reveal key={n} delay={delay}>
                <div className="lp-card" style={{...card(),display:"flex",flexDirection:"column",justifyContent:"space-between",gap:T.lg}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:T.lg}}>
                      <span style={{fontSize:10,fontWeight:800,fontFamily:"monospace",textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--text)",background:"var(--border)",border:"1px solid var(--border-muted)",padding:"2px 10px",borderRadius:6}}>Step {n}</span>
                      <span className="material-symbols-outlined" style={{fontSize:20,color:T.ou}}>{icon}</span>
                    </div>
                    <h3 style={{fontSize:15,fontWeight:700,color:T.pr,margin:"0 0 8px"}}>{title}</h3>
                    <p style={{fontSize:13,color:T.mu,lineHeight:1.65,margin:0}} dangerouslySetInnerHTML={{__html:body}}/>
                  </div>
                  <div style={{background:"var(--surface2)",borderRadius:8,padding:`${T.sm} ${T.md}`,borderTop:"1px solid var(--border)"}}>
                    <span style={{fontSize:11,color:"var(--text-muted)",fontFamily:"monospace"}}>{footer}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* TEMPLATES */}
        <section id="templates" style={{padding:"0 0 80px"}}>
          <Reveal>
            <div style={{...SW, marginBottom:T.x2}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:T.xs}}>Templates</div>
              <h2 style={{fontSize:"clamp(22px,3vw,36px)",fontWeight:800,color:T.pr,letterSpacing:"-0.03em",margin:"0 0 10px"}}>Start With Your Design</h2>
              <p style={{fontSize:14,color:T.mu,maxWidth:480,lineHeight:1.65,margin:0}}>Bring your custom design or jump straight into the Canvas Studio.</p>
            </div>
          </Reveal>
          
          {/* MARQUEE ROW 1 - Right to Left */}
          <div className="marquee-row">
            <div className="marquee-container marquee-left">
              {[...PRESET_TEMPLATES.slice(0, 6), ...PRESET_TEMPLATES.slice(0, 6)].map((tpl, idx) => (
                <div key={idx} className="lp-tcard" style={{width: 320, background:T.s1,borderRadius:18,overflow:"hidden",border:`1px solid ${T.ouV}`,boxShadow:"0 8px 36px var(--shadow-sm)",display:"flex",flexDirection:"column",transition:"all .35s cubic-bezier(.34,1.56,.64,1)",cursor:"pointer",flexShrink:0}}>
                  <div style={{position:"relative",background:T.s0,aspectRatio:"4/3",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:T.lg,overflow:"hidden",backgroundImage:`url(${tpl.background || ''})`,backgroundSize:'cover',backgroundPosition:'center'}}>
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.7),rgba(0,0,0,.15))",pointerEvents:"none"}}/>
                    <div style={{position:"relative",zIndex:1,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:10,fontFamily:"monospace",color:"#ffffff",background:"rgba(0,0,0,.4)",padding:"2px 10px",borderRadius:6,border:"1px solid rgba(255,255,255,.25)",backdropFilter:"blur(4px)"}}>{tpl.category}</span>
                    </div>
                  </div>
                  <div style={{padding:T.lg,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div>
                      <div style={{fontSize:14,fontWeight:700,color:T.pr,marginBottom:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:170}}>{tpl.name}</div>
                      <div style={{fontSize:12,color:T.mu,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:170}}>{tpl.description}</div>
                    </div>
                    <button onClick={onOpenStudio} className="lp-btn" style={{padding:`8px ${T.md}`,borderRadius:8,background:"var(--text)",color:"var(--bg)",border:"none",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",flexShrink:0,transition:"all .2s"}}>Use Studio</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MARQUEE ROW 2 - Left to Right */}
          <div className="marquee-row">
            <div className="marquee-container marquee-right">
              {[...PRESET_TEMPLATES.slice(6, 12), ...PRESET_TEMPLATES.slice(6, 12)].map((tpl, idx) => (
                <div key={idx} className="lp-tcard" style={{width: 320, background:T.s1,borderRadius:18,overflow:"hidden",border:`1px solid ${T.ouV}`,boxShadow:"0 8px 36px var(--shadow-sm)",display:"flex",flexDirection:"column",transition:"all .35s cubic-bezier(.34,1.56,.64,1)",cursor:"pointer",flexShrink:0}}>
                  <div style={{position:"relative",background:T.s0,aspectRatio:"4/3",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:T.lg,overflow:"hidden",backgroundImage:`url(${tpl.background || ''})`,backgroundSize:'cover',backgroundPosition:'center'}}>
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.7),rgba(0,0,0,.15))",pointerEvents:"none"}}/>
                    <div style={{position:"relative",zIndex:1,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:10,fontFamily:"monospace",color:"#ffffff",background:"rgba(0,0,0,.4)",padding:"2px 10px",borderRadius:6,border:"1px solid rgba(255,255,255,.25)",backdropFilter:"blur(4px)"}}>{tpl.category}</span>
                    </div>
                  </div>
                  <div style={{padding:T.lg,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div>
                      <div style={{fontSize:14,fontWeight:700,color:T.pr,marginBottom:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:170}}>{tpl.name}</div>
                      <div style={{fontSize:12,color:T.mu,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:170}}>{tpl.description}</div>
                    </div>
                    <button onClick={onOpenStudio} className="lp-btn" style={{padding:`8px ${T.md}`,borderRadius:8,background:"var(--text)",color:"var(--bg)",border:"none",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",flexShrink:0,transition:"all .2s"}}>Use Studio</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SMTP */}
        <section style={{...SW,padding:"0 48px 80px"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:T.x2,alignItems:"start"}}>
            <Reveal dir="left">
              <div style={{display:"flex",flexDirection:"column",gap:T.md}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--text-muted)"}}>Direct Email Dispatch</div>
                <h2 style={{fontSize:"clamp(22px,3vw,36px)",fontWeight:800,color:T.pr,letterSpacing:"-0.03em",margin:0}}>Send Certificates Directly to Every Inbox</h2>
                <p style={{fontSize:14,color:T.mu,lineHeight:1.78,margin:0}}>Connect your authenticated SMTP account and deliver personalised certificates to every recipient automatically &mdash; no third-party tools needed.</p>
                <div style={{padding:T.md,background:"rgba(255,255,255,.05)",borderRadius:12,border:"1px solid rgba(255,255,255,.15)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:T.xs,color:"var(--text)",fontSize:14,fontWeight:700,marginBottom:T.xs}}>
                    <span className="material-symbols-outlined" style={{fontSize:18}}>verified_user</span>Zero Credential Retention
                  </div>
                  <p style={{fontSize:13,color:T.mu,lineHeight:1.6,margin:0}}>Use a Google App Password for Gmail SMTP. Credentials are only used in your session and never stored on any server.</p>
                </div>
              </div>
            </Reveal>
            <Reveal dir="right" delay={150}>
              <div style={{...card()}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingBottom:T.md,marginBottom:T.lg,borderBottom:`1px solid ${T.s4}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:T.xs}}>
                    <span className="material-symbols-outlined" style={{fontSize:20,color:"var(--text)"}}>dns</span>
                    <span style={{fontSize:15,fontWeight:700,color:T.pr}}>SMTP Configuration</span>
                  </div>
                  <span style={{fontSize:10,fontFamily:"monospace",color:"var(--text)",background:"var(--border)",padding:"2px 8px",borderRadius:6,border:"1px solid var(--border-muted)"}}>SSL/TLS Ready</span>
                </div>
                <form onSubmit={handleTestSmtp} style={{display:"flex",flexDirection:"column",gap:T.md}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 100px",gap:T.md}}>
                    <div><label style={lbl}>SMTP Host</label><input type="text" defaultValue="smtp.gmail.com" style={inp}/></div>
                    <div><label style={lbl}>Port</label><select defaultValue="587" style={{...inp,padding:`0 ${T.sm}`}}><option>587 (TLS)</option><option>465 (SSL)</option></select></div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:T.md}}>
                    <div><label style={lbl}>Username / Email</label><input type="text" defaultValue="you@example.com" style={inp}/></div>
                    <div><label style={lbl}>Password / App Secret</label><input type="password" defaultValue="app-password" style={inp}/></div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:T.md,flexWrap:"wrap"}}>
                    <div style={{display:"flex",alignItems:"center",gap:T.xs,color:T.mu}}>
                      <span style={{width:8,height:8,borderRadius:"50%",background:"var(--text)",display:"inline-block"}}/>
                      <span style={{fontSize:11,fontFamily:"monospace"}}>{smtpStatus}</span>
                    </div>
                    <button type="submit" disabled={isTesting} className="lp-ghost" style={{padding:`0 ${T.lg}`,height:36,background:T.s3,border:`1px solid ${T.s4}`,color:T.pr,borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>
                      {isTesting?"Testing\u2026":"Test Connection"}
                    </button>
                  </div>
                </form>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section style={{...SW,padding:"0 48px 100px"}}>
          <Reveal>
            <div style={{position:"relative",borderRadius:26,padding:"88px 48px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:T.md,overflow:"hidden",background:"linear-gradient(135deg,var(--surface2),var(--surface))",border:"1px solid var(--border-muted)",boxShadow:"0 32px 80px var(--shadow-lg)"}}>
              <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(var(--surface2) 1px,transparent 1px),linear-gradient(90deg,var(--surface2) 1px,transparent 1px)`,backgroundSize:"36px 36px",pointerEvents:"none"}}/>
              <div className="lp-float" style={{position:"absolute",top:"-30%",left:"10%",width:320,height:320,borderRadius:"50%",background:"radial-gradient(circle,var(--border),transparent 70%)",filter:"blur(55px)",pointerEvents:"none"}}/>
              <div className="lp-float2" style={{position:"absolute",bottom:"-20%",right:"5%",width:280,height:280,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,255,255,.08),transparent 70%)",filter:"blur(45px)",pointerEvents:"none"}}/>
              <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:T.md,maxWidth:600}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--text-muted)"}}>Ready to Launch</div>
                <h2 style={{fontSize:"clamp(28px,4.5vw,52px)",fontWeight:800,color:"var(--text)",letterSpacing:"-0.04em",margin:0}}>Create Your First<br/>Certificate Right Now</h2>
                <p style={{fontSize:16,color:T.mu,lineHeight:1.78,margin:0}}>Upload your certificate design and personalise it for your entire recipient list in minutes.</p>
                <div style={{display:"flex",gap:T.md,flexWrap:"wrap",justifyContent:"center",marginTop:T.sm}}>
                  <button onClick={()=>document.getElementById("drop-zone")?.scrollIntoView({behavior:"smooth"})} className="lp-btn" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:T.xs,padding:`0 ${T.x2}`,height:54,background:"var(--text)",color:"var(--bg)",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 8px 32px var(--shadow-sm)",transition:"all .2s"}}>
                    <span className="material-symbols-outlined" style={{fontSize:22}}>upload_file</span>Upload Certificate
                  </button>
                  <button onClick={onOpenStudio} className="lp-ghost" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",padding:`0 ${T.xl}`,height:54,background:"var(--surface3)",color:T.pr,border:"1px solid var(--border)",borderRadius:14,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>
                    Open Canvas Studio
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

      </main>

      {/* FOOTER */}
      <footer style={{background:T.s0,borderTop:`1px solid ${T.ouV}`,padding:`${T.x3} 0`}}>
        <div style={SW}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:T.x2,marginBottom:T.x2}}>
            <div style={{gridColumn:"span 2"}}>
              <div style={{display:"flex",alignItems:"center",gap:T.sm,marginBottom:T.md}}>
                <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,var(--text),#8e8e93)",display:"grid",placeItems:"center",boxShadow:"0 0 14px var(--border-muted)"}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth="2.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
                </div>
                <span style={{fontSize:20,fontWeight:800,color:"var(--text)"}}>CertFlow</span>
              </div>
              <p style={{fontSize:13,color:T.mu,lineHeight:1.65,maxWidth:300,margin:0}}>High-throughput certificate rendering, personalising, and direct email delivery &mdash; built for speed.</p>
            </div>
            <div>
              <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:T.ou,marginBottom:T.md}}>Product</div>
              <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:T.sm}}>
                {[["#features","Features"],["#templates","Templates"]].map(([h,l])=>(
                  <li key={h}><a href={h} className="lp-navlink" style={{fontSize:13,color:T.mu,textDecoration:"none",transition:"color .2s"}}>{l}</a></li>
                ))}
                <li><button onClick={onOpenStudio} className="lp-navlink" style={{fontSize:13,color:T.mu,background:"none",border:"none",padding:0,cursor:"pointer",fontFamily:"inherit",transition:"color .2s"}}>Canvas Studio</button></li>
              </ul>
            </div>
            <div>
              <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:T.ou,marginBottom:T.md}}>Resources</div>
              <ul style={{listStyle:"none",padding:0,margin:0}}>
                <li><a href="/how-to-use.html" onClick={e=>{e.preventDefault();onOpenHowToUse();}} className="lp-navlink" style={{fontSize:13,color:T.mu,textDecoration:"none",transition:"color .2s"}}>Documentation & Guide</a></li>
              </ul>
            </div>
          </div>
          <div style={{paddingTop:T.lg,borderTop:`1px solid ${T.ouV}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:T.md}}>
            <p style={{fontSize:11,color:T.ou,fontFamily:"monospace",margin:0}}>&copy; 2025 CertFlow. All rights reserved.</p>
            <p style={{fontSize:11,color:T.ou,fontFamily:"monospace",margin:0}}>Built with love for educators & teams</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

