import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import athenuraLogo from "../assets/athenura-logo.png";

function useInView(ref, threshold = 0.15) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return vis;
}

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const vis = useInView(ref);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.65s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.65s cubic-bezier(.22,1,.36,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

const socials = [
  { label: "LinkedIn",  href: "https://www.linkedin.com/company/athenura/", accent: "#0a66c2",
    icon: <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45z" /> },
  { label: "Instagram", href: "https://www.instagram.com/athenura.in", accent: "#e1306c",
    icon: <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07-3.2 0-3.58-.01-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12c0-3.2.01-3.58.07-4.85C2.38 3.86 3.9 2.31 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.7.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.73 2.71 21.31.27 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32A6.16 6.16 0 0 0 12 5.84zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" /> },
  { label: "Twitter",   href: "https://twitter.com/athenura_in", accent: "#1da1f2",
    icon: <path d="M23.95 4.57a9.83 9.83 0 0 1-2.83.78 4.94 4.94 0 0 0 2.17-2.72 9.86 9.86 0 0 1-3.13 1.2 4.92 4.92 0 0 0-8.38 4.48A13.94 13.94 0 0 1 1.67 3.15a4.9 4.9 0 0 0 1.52 6.57 4.9 4.9 0 0 1-2.23-.62v.06a4.92 4.92 0 0 0 3.95 4.83 4.94 4.94 0 0 1-2.21.08 4.93 4.93 0 0 0 4.6 3.42A9.87 9.87 0 0 1 0 19.54a13.94 13.94 0 0 0 7.55 2.21c9.06 0 14.01-7.5 14.01-14.01 0-.21 0-.42-.01-.63a10 10 0 0 0 2.4-2.54z" /> },
  { label: "Medium",    href: "https://medium.com/@athenura", accent: "#ffffff",
    icon: <path d="M13.54 12a6.72 6.72 0 0 1-6.72 6.72A6.72 6.72 0 0 1 .1 12a6.72 6.72 0 0 1 6.72-6.72A6.72 6.72 0 0 1 13.54 12zM20.96 12c0 3.54-1.5 6.42-3.36 6.42S14.24 15.54 14.24 12s1.5-6.42 3.36-6.42 3.36 2.88 3.36 6.42zM23.9 12c0 3.17-.53 5.75-1.18 5.75-.65 0-1.18-2.58-1.18-5.75s.53-5.75 1.18-5.75c.65 0 1.18 2.58 1.18 5.75z" /> },
];

const company  = [["About Us", "/about"], ["Contact Us", "/contact"], ["Help", "/help"], ["FAQs", "/help"]];
const services = [
  { title: "Real-Time Editing", detail: "Work together instantly with live sync", icon: <path d="M12 3l8 4v5c0 5.25-3.4 9.62-8 11-4.6-1.38-8-5.75-8-11V7l8-4z" /> },
  { title: "Secure Sharing", detail: "Share files safely with controlled access", icon: <path d="M12 2a5 5 0 0 1 5 5v1h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v1h6V7a3 3 0 0 0-3-3z" /> },
  { title: "Version History", detail: "Review and restore previous versions", icon: <path d="M13 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-2.05-5H13V3z" /> },
  { title: "Team Workspace", detail: "Coordinate feedback in one shared hub", icon: <path d="M16 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm-8 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 2c-2.67 0-8 1.34-8 4v1h8v-1c0-.8.25-1.46.65-2.03A10.93 10.93 0 0 0 8 13zm8 0c-.8 0-1.53.12-2.2.34A5.18 5.18 0 0 1 16 17v1h8v-1c0-2.66-5.33-4-8-4z" /> },
];

const contactItems = [
  { label: "EMAIL", val: "official@athenura.in",  href: "mailto:official@athenura.in", color: "#10b981",
    svg: <path d="M2 4h20v16H2V4zm2 2v.01L12 12l8-5.99V6H4zm16 2.24-7.4 5.55a1 1 0 0 1-1.2 0L4 8.24V18h16V8.24z" /> },
  { label: "PHONE", val: "+91 98350 51934", href: "tel:+919835051934", color: "#10b981",
    svg: <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.56.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.56 1 1 0 0 1-.25 1.02l-2.2 2.21z" /> },
];

export default function FooterPage() {
  const [hovSocial, setHovSocial] = useState(null);
  const [showTop,   setShowTop]   = useState(false);
  const [email,     setEmail]     = useState("");
  const [subDone,   setSubDone]   = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSub = (e) => {
    e.preventDefault();
    if (email) { setSubDone(true); setEmail(""); setTimeout(() => setSubDone(false), 3500); }
  };

  return (
    <>
      {/* Back-to-top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        style={{
          position: "fixed", bottom: "1.75rem", right: "1.75rem", zIndex: 50,
          width: 42, height: 42, borderRadius: "50%",
          background: "linear-gradient(135deg,#2563eb,#6366f1)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37,99,235,0.45)",
          opacity: showTop ? 1 : 0,
          transform: showTop ? "translateY(0) scale(1)" : "translateY(12px) scale(0.8)",
          transition: "opacity 0.3s, transform 0.3s",
          pointerEvents: showTop ? "auto" : "none",
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M12 4l-8 8h5v8h6v-8h5z" /></svg>
      </button>

      <style>{`
        @keyframes shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes pinPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.25);opacity:.65} }
        @keyframes glow     { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes fadeIn   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .ft-link { color:#94a3b8;font-size:.875rem;text-decoration:none;display:flex;align-items:center;gap:6px;transition:color .2s,transform .2s,padding-left .2s,background .2s,border-color .2s;position:relative; }
        .ft-link:hover { color:#e2e8f0;transform:translateX(5px);padding-left:2px; }
        .ft-link::after { content:'';position:absolute;left:0;bottom:-1px;width:0;height:1px;background:#3b82f6;transition:width .25s; }
        .ft-link:hover::after { width:100%; }
        .brand-block { padding:1rem .25rem 1rem 0; }
        .brand-tag { display:inline-flex;align-items:center;gap:.5rem;color:#60a5fa;font-size:.72rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;margin-top:1rem;margin-bottom:.7rem; }
        .brand-tag::before { content:'';display:inline-block;width:26px;height:1px;background:linear-gradient(90deg,#60a5fa,transparent); }
        .brand-copy { color:#94a3b8;font-size:.84rem;line-height:1.8;max-width:220; }
        .svc-link { color:#e2e8f0;font-size:.86rem;font-weight:600;text-decoration:none;display:block;line-height:1.35;transition:color .2s; }
        .svc-item { display:flex;align-items:flex-start;gap:.7rem;padding:.8rem .9rem;border:1px solid rgba(255,255,255,.06);border-radius:12px;background:rgba(255,255,255,.04);transition:transform .2s,background .2s,border-color .2s,box-shadow .2s; }
        .svc-item:hover { transform:translateX(4px);background:rgba(59,130,246,.12);border-color:rgba(96,165,250,.28);box-shadow:0 10px 24px rgba(37,99,235,.14); }
        .svc-icon { width:30px;height:30px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:linear-gradient(135deg,rgba(37,99,235,.22),rgba(99,102,241,.18));color:#60a5fa;box-shadow:inset 0 1px 1px rgba(255,255,255,.08); }
        .svc-detail { color:#64748b;font-size:.72rem;line-height:1.45;margin-top:.15rem; }
        .map-card { transition:transform .28s,box-shadow .28s; }
        .map-card:hover { transform:scale(1.03);box-shadow:0 10px 40px rgba(37,99,235,.3); }
        .contact-card { display:flex;align-items:flex-start;gap:.75rem;padding:.7rem .8rem;border-radius:12px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.06);transition:all .2s; }
        .contact-card:hover { transform:translateY(-2px);background:rgba(37,99,235,.12);border-color:rgba(96,165,250,.24); }
        .sub-input:focus { outline:none;box-shadow:0 0 0 2px #3b82f6; }
        .cta-btn:hover { transform:translateY(-2px);box-shadow:0 6px 20px rgba(37,99,235,.5) !important; }
        .contact-link:hover { color:#60a5fa !important; }
      `}</style>

      <footer style={{
        background: "linear-gradient(160deg,#060e1c 0%,#0b1730 30%,#0d1b3e 60%,#07121f 100%)",
        borderTop: "1px solid rgba(255,255,255,.06)",
        position: "relative", overflow: "hidden",
        fontFamily: "system-ui,sans-serif",
      }}>
        {/* Shimmer bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg,transparent,#3b82f6,#818cf8,#06b6d4,#3b82f6,transparent)",
          backgroundSize: "250% 100%", animation: "shimmer 4s linear infinite",
        }} />

        {/* Dot grids */}
        <div style={{ position:"absolute",top:0,right:0,width:240,height:240,opacity:.1,pointerEvents:"none",
          backgroundImage:"radial-gradient(#60a5fa 1.2px,transparent 1.2px)",backgroundSize:"15px 15px" }} />
        <div style={{ position:"absolute",bottom:60,left:0,width:180,height:180,opacity:.07,pointerEvents:"none",
          backgroundImage:"radial-gradient(#818cf8 1.2px,transparent 1.2px)",backgroundSize:"15px 15px" }} />

        {/* Glow blobs */}
        <div style={{ position:"absolute",top:"40%",left:"20%",width:500,height:300,pointerEvents:"none",
          background:"radial-gradient(ellipse,rgba(37,99,235,.07) 0%,transparent 70%)",animation:"glow 5s ease-in-out infinite" }} />

        {/* CTA strip */}
        <Reveal>
          <div style={{ borderBottom:"1px solid rgba(255,255,255,.06)", background:"linear-gradient(90deg,rgba(37,99,235,.12),rgba(99,102,241,.08),rgba(6,182,212,.06))" }}>
            <div style={{ maxWidth:1280,margin:"0 auto",padding:"2rem 1.5rem",display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:"1.25rem" }}>
              <div>
                <h3 style={{ color:"#ffffff",fontSize:"1.1rem",fontWeight:700,marginBottom:".25rem" }}>Ready to collaborate in real time?</h3>
                <p style={{ color:"#64748b",fontSize:".85rem" }}>Join thousands of teams already using Athenura.</p>
              </div>
              <form onSubmit={handleSub} style={{ display:"flex",gap:".5rem",flexWrap:"wrap" }}>
                {subDone ? (
                  <div style={{ animation:"fadeIn .4s ease",color:"#4ade80",fontSize:".85rem",fontWeight:600,display:"flex",alignItems:"center",gap:".4rem",background:"rgba(74,222,128,.1)",border:"1px solid rgba(74,222,128,.25)",borderRadius:8,padding:".5rem 1rem" }}>
                    ✓ You're on the list!
                  </div>
                ) : (
                  <>
                    <input type="email" value={email} required onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email" className="sub-input"
                      style={{ padding:".55rem 1rem",borderRadius:8,fontSize:".85rem",background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)",color:"#e2e8f0",width:220 }} />
                    <button type="submit" className="cta-btn"
                      style={{ padding:".55rem 1.25rem",borderRadius:8,fontSize:".85rem",fontWeight:600,background:"linear-gradient(135deg,#2563eb,#6366f1)",color:"#fff",border:"none",cursor:"pointer",boxShadow:"0 4px 14px rgba(37,99,235,.35)",transition:"transform .2s,box-shadow .2s" }}>
                      Get Early Access
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </Reveal>

        {/* Main columns */}
        <div style={{ maxWidth:1280,margin:"0 auto",padding:"3.5rem 1.5rem",position:"relative",zIndex:1 }}>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:"2.5rem 2rem" }}>

            {/* Brand */}
            <Reveal delay={0}>
              <div className="brand-block">
                <Link to="/" style={{ display:"inline-block",marginBottom:"1rem" }}>
                  <img src={athenuraLogo} alt="Athenura" style={{ height:36,width:"auto",objectFit:"contain",filter:"brightness(10)",opacity:.95 }} />
                </Link>
                <div className="brand-tag">Trusted platform</div>
                <p className="brand-copy">
                  Real-time collaboration document system with secure access, powerful editing, and a seamless team experience.
                </p>
                <p style={{ color:"#475569",fontSize:".72rem",marginTop:"1rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase" }}>Follow us</p>
                <div style={{ display:"flex",gap:".55rem",marginTop:".6rem",flexWrap:"wrap" }}>
                  {socials.map(({ label, href, icon, accent }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                      style={{
                        width:36,height:36,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                        background: hovSocial === label ? accent + "22" : "rgba(255,255,255,.05)",
                        border: `1px solid ${hovSocial === label ? accent + "55" : "rgba(255,255,255,.09)"}`,
                        color: hovSocial === label ? accent : "#64748b",
                        transition:"all .22s",
                        transform: hovSocial === label ? "translateY(-3px) scale(1.1)" : "none",
                        boxShadow: hovSocial === label ? `0 6px 18px ${accent}33` : "none",
                      }}
                      onMouseEnter={() => setHovSocial(label)}
                      onMouseLeave={() => setHovSocial(null)}
                    >
                      <svg viewBox="0 0 24 24" style={{ width:14,height:14 }} fill="currentColor">{icon}</svg>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Company */}
            <Reveal delay={80}>
              <div>
                <h4 style={{ color:"#ffffff",fontSize:".875rem",fontWeight:700,letterSpacing:".04em",marginBottom:"1.1rem",paddingBottom:".5rem",borderBottom:"1px solid rgba(255,255,255,.07)" }}>Company</h4>
                <ul style={{ listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:".6rem" }}>
                  {company.map(([label, to]) => (
                    <li key={label}>
                      <Link to={to} className="ft-link" style={{ padding:"0.65rem 0.75rem", borderRadius:10, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.05)" }}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Services */}
            <Reveal delay={160}>
              <div>
                <h4 style={{ color:"#ffffff",fontSize:".875rem",fontWeight:700,letterSpacing:".04em",marginBottom:"1.1rem",paddingBottom:".5rem",borderBottom:"1px solid rgba(255,255,255,.07)" }}>Services</h4>
                <ul style={{ listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:".7rem" }}>
                  {services.map(({ title, detail, icon }) => (
                    <li key={title}>
                      <a href="#" className="svc-item" style={{ display:"flex", alignItems:"flex-start", gap:".7rem", textDecoration:"none" }}>
                        <span className="svc-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">{icon}</svg>
                        </span>
                        <span>
                          <span className="svc-link">{title}</span>
                          <span className="svc-detail">{detail}</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Contact */}
            <Reveal delay={240}>
              <div>
                <h4 style={{ color:"#ffffff",fontSize:".875rem",fontWeight:700,letterSpacing:".04em",marginBottom:"1.1rem",paddingBottom:".5rem",borderBottom:"1px solid rgba(255,255,255,.07)" }}>Contact Us</h4>
                <div style={{ display:"flex",flexDirection:"column",gap:".7rem" }}>
                  {contactItems.map(({ label, val, href, color, svg }) => (
                    <div key={label} className="contact-card">
                      <span style={{ width:34,height:34,borderRadius:"50%",flexShrink:0,background:`${color}18`,border:`1px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <svg viewBox="0 0 24 24" style={{ width:15,height:15,color }} fill="currentColor">{svg}</svg>
                      </span>
                      <div>
                        <p style={{ color:"#64748b",fontSize:".68rem",letterSpacing:".1em",fontWeight:700,marginBottom:".2rem",textTransform:"uppercase" }}>{label}</p>
                        <a href={href} className="contact-link" style={{ color:"#e2e8f0",fontSize:".82rem",fontWeight:600,textDecoration:"none",transition:"color .2s",display:"inline-block" }}>{val}</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Location */}
            <Reveal delay={320}>
              <div>
                <h4 style={{ color:"#ffffff",fontSize:".875rem",fontWeight:700,letterSpacing:".04em",marginBottom:"1.1rem",paddingBottom:".5rem",borderBottom:"1px solid rgba(255,255,255,.07)" }}>Location</h4>
                <a href="https://www.google.com/maps/search/?api=1&query=Athenura+Technologies+Noida+Uttar+Pradesh+201309+India"
                  target="_blank" rel="noopener noreferrer" className="map-card"
                  style={{ display:"block",height:168,borderRadius:16,textDecoration:"none",border:"1px solid rgba(96,165,250,.2)",background:"linear-gradient(135deg,#0f1e3d,#18305a,#0c1a32)",position:"relative",overflow:"hidden",boxShadow:"0 14px 32px rgba(2,6,23,.24)" }}>
                  <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:.12 }}>
                    {[0,25,50,75,100].map(p => (
                      <g key={p}>
                        <line x1={`${p}%`} y1="0" x2={`${p}%`} y2="100%" stroke="#3b82f6" strokeWidth="1" />
                        <line x1="0" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke="#3b82f6" strokeWidth="1" />
                      </g>
                    ))}
                  </svg>
                  <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at center,rgba(37,99,235,.2) 0%,transparent 70%)" }} />
                  <div style={{ position:"relative",zIndex:1,height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:".45rem",padding:"1rem" }}>
                    <div style={{ width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#2563eb,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 18px rgba(37,99,235,.55)",animation:"pinPulse 2.2s ease-in-out infinite" }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5z" /></svg>
                    </div>
                    <p style={{ color:"#dbeafe",fontWeight:700,fontSize:".82rem",textAlign:"center" }}>Athenura Technologies</p>
                    <p style={{ color:"#94a3b8",fontSize:".72rem",textAlign:"center",lineHeight:1.5 }}>Noida, Uttar Pradesh, India</p>
                    <span style={{ fontSize:".68rem",color:"#60a5fa",background:"rgba(37,99,235,.15)",border:"1px solid rgba(96,165,250,.2)",borderRadius:999,padding:".2rem .7rem",marginTop:".15rem" }}>Open in Maps ↗</span>
                  </div>
                </a>
              </div>
            </Reveal>

          </div>

          {/* Divider */}
          <div style={{ margin:"3rem 0 0",height:1,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.08),rgba(255,255,255,.08),transparent)" }} />

          {/* Bottom bar */}
          <Reveal delay={400}>
            <div style={{ paddingTop:"1.4rem",display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:"1rem" }}>
              <p style={{ color:"#334155",fontSize:".78rem" }}>© 2026 Athenura. All rights reserved.</p>
              
            </div>
          </Reveal>
        </div>
      </footer>
    </>
  );
}
