import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FolderDot, 
  Activity, 
  Sparkles, 
  Shield, 
  ArrowRight, 
  FileText, 
  PenTool, 
  MessageSquare, 
  Clock, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  Share2, 
  ChevronRight, 
  Terminal,
  Layers,
  Heart
} from 'lucide-react';
import Button from '../../components/common/Button';
import ThemeToggle from '../../components/common/ThemeToggle';
import { BRAND_NAME } from '../../utils/constants';

// 1. LIGHTWEIGHT SCROLL REVEAL COMPONENT ( IntersectionObserver )
function RevealOnScroll({ children, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-800 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {children}
    </div>
  );
}

// 2. HIGH-PERFORMANCE ANIMATED INTEGER COUNTER
function AnimatedCounter({ end, duration = 1500, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered) {
        setTriggered(true);
      }
    }, { threshold: 0.2 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;
    
    let start = 0;
    const startTime = performance.now();

    const update = (timestamp) => {
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const easeProgress = percentage * (2 - percentage); // Ease out quadratic
      
      const current = Math.floor(start + easeProgress * (end - start));
      setCount(current);

      if (percentage < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, [triggered, end, duration]);

  return (
    <span ref={ref} className="font-sans font-extrabold tracking-tight tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

// 3. HIGH-PERFORMANCE ANIMATED DECIMAL COUNTER (For float metrics like 99.99%)
function AnimatedDecimalCounter({ end, duration = 1500, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered) {
        setTriggered(true);
      }
    }, { threshold: 0.2 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;
    
    let start = 0;
    const startTime = performance.now();

    const update = (timestamp) => {
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const easeProgress = percentage * (2 - percentage);
      
      const current = Math.floor(start + easeProgress * (end - start));
      setCount(current);

      if (percentage < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, [triggered, end, duration]);

  return (
    <span ref={ref} className="font-sans font-extrabold tracking-tight tabular-nums">
      {(count / 100).toFixed(2)}
      {suffix}
    </span>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  
  // Real-time editor typing simulation script
  const [typedText, setTypedText] = useState("");
  const [typingUser, setTypingUser] = useState("Sarah");
  const [typingColor, setTypingColor] = useState("bg-purple-500");

  useEffect(() => {
    const fullText = "Implementing real-time websocket synchronization for teams...";
    let index = 0;
    let isDeleting = false;
    let pauseCounter = 0;
    
    const interval = setInterval(() => {
      if (pauseCounter > 0) {
        pauseCounter--;
        return;
      }

      if (!isDeleting) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
        if (index === fullText.length) {
          pauseCounter = 18;
          isDeleting = true;
        }
      } else {
        setTypedText(fullText.slice(0, index - 1));
        index--;
        if (index === 0) {
          pauseCounter = 6;
          isDeleting = false;
          if (typingUser === "Sarah") {
            setTypingUser("Dave");
            setTypingColor("bg-emerald-500");
          } else {
            setTypingUser("Sarah");
            setTypingColor("bg-purple-500");
          }
        }
      }
    }, 90);

    return () => clearInterval(interval);
  }, [typingUser]);

  // ZERO-LAG CURSOR SPOTLIGHT TRACKING (Sets local CSS properties to prevent React layout reflows)
  const handlePointerMove = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    container.style.setProperty('--spotlight-x', `${x}px`);
    container.style.setProperty('--spotlight-y', `${y}px`);
    
    // Spotlight for nested card spotlight borders
    const cards = container.querySelectorAll('.spotlight-card');
    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const cx = e.clientX - cardRect.left;
      const cy = e.clientY - cardRect.top;
      card.style.setProperty('--mouse-x', `${cx}px`);
      card.style.setProperty('--mouse-y', `${cy}px`);
    });
  };

  return (
    <div 
      onPointerMove={handlePointerMove}
      className="min-h-screen relative dot-grid-bg bg-[#F7FAFF] dark:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB] transition-colors duration-300 flex flex-col justify-between overflow-x-hidden select-none"
    >
      
      {/* HIGH-PERFORMANCE RADIAL SPOTLIGHT OVERLAY */}
      <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_var(--spotlight-x,0px)_var(--spotlight-y,0px),rgba(13,110,253,0.06),transparent_80%)] dark:bg-[radial-gradient(750px_circle_at_var(--spotlight-x,0px)_var(--spotlight-y,0px),rgba(59,130,246,0.045),transparent_80%)] pointer-events-none z-0 select-none" />

      {/* BACKGROUND DECORATIVE GRADIENT GLOWS */}
      <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] rounded-full bg-blue-500/10 dark:bg-blue-600/5 blur-3xl pointer-events-none filter select-none animate-pulse-slow z-0" />
      <div className="absolute top-2/3 right-1/4 w-[30rem] h-[30rem] rounded-full bg-indigo-500/10 dark:bg-indigo-600/5 blur-3xl pointer-events-none filter select-none animate-pulse-slow z-0" />
      
      {/* FLOATING SAAS GRAPHIC OBJECTS */}
      <div className="absolute top-28 left-[10%] text-[#0D6EFD]/25 dark:text-white/5 animate-float-slow z-0 pointer-events-none hidden md:block">
        <FileText size={46} className="drop-shadow-lg" />
      </div>
      <div className="absolute top-44 right-[15%] text-indigo-500/20 dark:text-white/5 animate-float-medium z-0 pointer-events-none hidden md:block">
        <Sparkles size={40} className="drop-shadow-lg" />
      </div>
      <div className="absolute bottom-[35%] left-[8%] text-emerald-500/20 dark:text-white/5 animate-float-fast z-0 pointer-events-none hidden md:block">
        <MessageSquare size={42} className="drop-shadow-lg" />
      </div>
      <div className="absolute bottom-[28%] right-[10%] text-[#0D6EFD]/20 dark:text-white/5 animate-float-slow z-0 pointer-events-none hidden md:block">
        <PenTool size={38} className="drop-shadow-lg" />
      </div>

      {/* STICKY GLASS NAVIGATION NAVBAR */}
      <header className="px-6 py-3.5 flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 transition-colors duration-300 bg-white/60 dark:bg-[#070B14]/60 backdrop-blur-lg sticky top-0 z-50 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-[#0D6EFD] flex items-center justify-center shadow-md shadow-blue-500/20 transform group-hover:scale-105 transition-transform duration-200">
            <FolderDot size={18} className="text-white" />
          </div>
          <span className="font-sans font-extrabold text-sm uppercase tracking-widest text-[#081B3A] dark:text-white">{BRAND_NAME}</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login" className="text-xs font-bold text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] transition-colors mr-1">
            Sign In
          </Link>
          <Button size="md" variant="primary" onClick={() => navigate('/register')} className="btn-shine shadow-md shadow-blue-500/10">
            Sign Up Free
          </Button>
        </div>
      </header>

      {/* CORE CONTAINER */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-6 md:py-10 space-y-16 md:space-y-24 z-10">
        
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center min-h-[50vh] py-4">
          
          {/* HERO LEFT COPY */}
          <div className="lg:col-span-6 space-y-4 md:space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0D6EFD]/8 dark:bg-[#0D6EFD]/12 border border-[#0D6EFD]/20 text-[#0D6EFD] text-[10px] font-bold rounded-full uppercase tracking-wider">
              <Sparkles size={11} className="animate-spin-slow" />
              <span>Real-time co-authoring workspace</span>
            </div>

            <h1 className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl text-[#081B3A] dark:text-white leading-[1.08] tracking-tight">
              The collaborative canvas for <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0D6EFD] to-indigo-500 dark:from-[#3FA3FF] dark:to-cyan-400">modern</span> engineering teams.
            </h1>

            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#94A3B8] max-w-lg leading-relaxed font-semibold">
              Co-edit architecture proposals, engineering specifications, sprint documents, and team briefings in real-time. Experience lightning-fast typing synchronization, custom cursor indicators, and a powerful Notion-inspired canvas.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
              <button 
                onClick={() => navigate('/register')} 
                className="btn-shine group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold text-white bg-[#0D6EFD] hover:bg-[#0D6EFD]/95 rounded-lg transition-all shadow-[0_4px_20px_rgba(13,110,253,0.3)] hover:scale-[1.03] active:scale-[0.97]"
              >
                <span>Get Started Free</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/login')} 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-[#081B3A] dark:text-[#E5E7EB] rounded-lg transition-all backdrop-blur-sm hover:scale-[1.03] active:scale-[0.97]"
              >
                <span>Launch Live Demo</span>
              </button>
            </div>
          </div>

          {/* HERO RIGHT: MOCKUP EDITOR PREVIEW */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="w-full max-w-lg glass-card border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0F172A]/80 shadow-[0_20px_50px_rgba(13,110,253,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-2xl overflow-hidden backdrop-blur-md">
              
              {/* Mock Browser Title Bar */}
              <div className="px-4 py-3 bg-slate-50/80 dark:bg-[#070B14]/80 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-[10px] font-bold text-[#6B7280] dark:text-[#94A3B8]/60 uppercase tracking-widest hidden sm:inline">CollabDocs Browser</span>
                </div>
                
                {/* Active Avatars */}
                <div className="flex items-center">
                  <div className="flex -space-x-1.5 mr-2">
                    <div className="w-5 h-5 rounded-full bg-blue-500 border border-white dark:border-[#0F172A] text-white text-[8px] font-bold flex items-center justify-center shadow-sm" title="Eleanor (You)">EK</div>
                    <div className="w-5 h-5 rounded-full bg-purple-500 border border-white dark:border-[#0F172A] text-white text-[8px] font-bold flex items-center justify-center shadow-sm animate-pulse" title="Sarah">SM</div>
                    <div className="w-5 h-5 rounded-full bg-emerald-500 border border-white dark:border-[#0F172A] text-white text-[8px] font-bold flex items-center justify-center shadow-sm" title="Dave">DJ</div>
                    <div className="w-5 h-5 rounded-full bg-amber-500 border border-white dark:border-[#0F172A] text-white text-[8px] font-bold flex items-center justify-center shadow-sm" title="Julian">JM</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
                  <span className="text-[9px] font-extrabold text-emerald-500 uppercase tracking-wider">Syncing</span>
                </div>
              </div>

              {/* Editor Subheader */}
              <div className="px-4 py-2 border-b border-slate-100 dark:border-white/5 bg-white/50 dark:bg-[#0F172A]/50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-[#081B3A] dark:text-white truncate">🚀 Docs / SystemSpecs_v2.md</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <Bold size={11} />
                  </div>
                  <div className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <Italic size={11} />
                  </div>
                  <div className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <Underline size={11} />
                  </div>
                  <div className="w-px h-3 bg-slate-200 dark:bg-white/10" />
                  <div className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <AlignLeft size={11} />
                  </div>
                  <div className="p-1 rounded text-[#0D6EFD] bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30">
                    <Share2 size={11} />
                  </div>
                </div>
              </div>

              {/* Mock Canvas layout */}
              <div className="flex h-56 text-left bg-white/90 dark:bg-[#0B1220]/90">
                
                {/* Notion Outline Sidebar */}
                <div className="w-28 sm:w-36 bg-slate-50/50 dark:bg-[#070B14]/40 border-r border-slate-100 dark:border-white/5 p-3 space-y-3 hidden sm:block">
                  <div className="text-[8px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#94A3B8]/50">Outline</div>
                  <ul className="space-y-1.5 text-[9px] font-semibold text-[#6B7280] dark:text-[#94A3B8]">
                    <li className="flex items-center gap-1 text-[#0D6EFD] dark:text-[#3FA3FF]">
                      <ChevronRight size={10} />
                      <span>1. Overview</span>
                    </li>
                    <li className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer pl-2">
                      <span>2. Architecture</span>
                    </li>
                    <li className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer pl-2">
                      <span>3. Synchronization</span>
                    </li>
                    <li className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer pl-2">
                      <span>4. Permissions</span>
                    </li>
                  </ul>
                </div>

                {/* Main Workspace canvas */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-[10px]">
                  
                  <div className="space-y-1">
                    <div className="text-[#0D6EFD] font-extrabold uppercase tracking-widest text-[8px]">Specification Doc</div>
                    <h3 className="font-sans font-bold text-xs sm:text-sm text-[#081B3A] dark:text-white">1. System Synchronization Spec</h3>
                  </div>

                  <div className="space-y-2.5 text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
                    <p className="font-semibold">
                      This specification details our instant document sync layer designed for secure collaborative team workflows.
                    </p>
                    
                    {/* Collaborative Simulated Typing Block */}
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0F172A]/50 border border-slate-100 dark:border-white/5 font-mono text-[9px] text-[#081B3A] dark:text-[#E5E7EB] space-y-1">
                      <div className="flex items-center gap-1 text-[#6B7280] dark:text-[#94A3B8]/60 text-[8px] border-b border-slate-100 dark:border-white/5 pb-1 mb-1 font-sans">
                        <Terminal size={10} />
                        <span>Live Sync Logs</span>
                      </div>
                      <div className="relative inline-block pr-1 font-medium min-h-[14px]">
                        <span className="text-blue-500 font-bold">collab-docs:~$ </span>
                        <span>{typedText}</span>
                        <span className={`inline-block w-[2px] h-[1.1em] ${typingColor} animate-pulse ml-0.5 align-middle relative`}>
                          <span className={`absolute -top-3.5 left-0 ${typingColor} text-white font-sans text-[7px] font-extrabold px-1 rounded-sm shadow-sm tracking-wider uppercase whitespace-nowrap`}>
                            {typingUser}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 border-t border-slate-100 dark:border-white/5 pt-2 text-[9px] font-semibold text-[#6B7280] dark:text-[#94A3B8]/50">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                      <span>Julian marked section 2.1 as "Pending Review"</span>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>

        </section>


        {/* STATISTICS / SOCIAL PROOF METRICS SECTION */}
        <RevealOnScroll>
          <section className="py-6 md:py-8 border-y border-slate-200/50 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.005]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-5xl mx-auto">
              
              <div className="space-y-1">
                <div className="text-3xl md:text-4xl text-[#0D6EFD] dark:text-[#3FA3FF]">
                  <AnimatedCounter end={10} suffix="K+" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#94A3B8]/60">Active Teams</div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl md:text-4xl text-purple-500 dark:text-purple-400">
                  <AnimatedCounter end={50} suffix="K+" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#94A3B8]/60">Documents Saved</div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl md:text-4xl text-emerald-500 dark:text-emerald-400">
                  <AnimatedDecimalCounter end={9999} suffix="%" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#94A3B8]/60">System Uptime</div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl md:text-4xl text-amber-500 dark:text-amber-400">
                  <AnimatedCounter end={120} suffix="+" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#94A3B8]/60">Countries Reached</div>
              </div>

            </div>
          </section>
        </RevealOnScroll>

        {/* PREMIUM FEATURE CARDS GRID */}
        <section className="space-y-8 md:space-y-12">
          <RevealOnScroll>
            <div className="text-center space-y-2">
              <span className="text-[#0D6EFD] text-[10px] font-extrabold uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-200/50 dark:border-blue-900/30">Built For Engineering Teams</span>
              <h2 className="font-sans font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#081B3A] dark:text-white leading-tight tracking-tight">
                Enterprise speed. Minimalist control.
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#94A3B8] max-w-lg mx-auto font-semibold">
                Designed to eliminate friction, sync active Caret vectors instantly, and safeguard your engineering layout blueprint securely.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            
            {/* FEATURE 1: Real-time Sync */}
            <RevealOnScroll delay={0}>
              <div className="spotlight-card glow-blue p-5 backdrop-blur-md shadow-sm rounded-xl space-y-4 hover:-translate-y-2 cursor-pointer h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/30 text-[#0D6EFD] flex items-center justify-center shrink-0 shadow-inner group">
                    <Activity size={18} className="animate-float-fast text-[#0D6EFD]" />
                  </div>
                  <h4 className="font-sans font-extrabold text-xs uppercase tracking-wider text-[#081B3A] dark:text-[#E5E7EB]">
                    Real-time Sync Layer
                  </h4>
                  <p className="text-[11px] leading-relaxed text-[#6B7280] dark:text-[#94A3B8] font-semibold">
                    Co-author specs synchronously. Instantly replicate cursors, key carets, formatting adjustments, and typing highlights across the globe.
                  </p>
                </div>
                <div className="text-[9px] font-extrabold text-[#0D6EFD] hover:underline flex items-center gap-1 pt-2">
                  <span>Explore socket layer</span>
                  <ChevronRight size={10} />
                </div>
              </div>
            </RevealOnScroll>

            {/* FEATURE 2: Intelligent Templates */}
            <RevealOnScroll delay={100}>
              <div className="spotlight-card glow-purple p-5 backdrop-blur-md shadow-sm rounded-xl space-y-4 hover:-translate-y-2 cursor-pointer h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-900/30 text-purple-500 flex items-center justify-center shrink-0 shadow-inner">
                    <Layers size={18} className="animate-float-slow text-purple-500" />
                  </div>
                  <h4 className="font-sans font-extrabold text-xs uppercase tracking-wider text-[#081B3A] dark:text-[#E5E7EB]">
                    Engineering Outlines
                  </h4>
                  <p className="text-[11px] leading-relaxed text-[#6B7280] dark:text-[#94A3B8] font-semibold">
                    Spin up pre-structured specs, release blueprints, roadmap targets, and API templates in standard fluid responsive canvas dimensions.
                  </p>
                </div>
                <div className="text-[9px] font-extrabold text-purple-500 hover:underline flex items-center gap-1 pt-2">
                  <span>Preview templates</span>
                  <ChevronRight size={10} />
                </div>
              </div>
            </RevealOnScroll>

            {/* FEATURE 3: Access Permissions */}
            <RevealOnScroll delay={200}>
              <div className="spotlight-card glow-amber p-5 backdrop-blur-md shadow-sm rounded-xl space-y-4 hover:-translate-y-2 cursor-pointer h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900/30 text-amber-500 flex items-center justify-center shrink-0 shadow-inner">
                    <Shield size={18} className="animate-float-medium text-amber-500" />
                  </div>
                  <h4 className="font-sans font-extrabold text-xs uppercase tracking-wider text-[#081B3A] dark:text-[#E5E7EB]">
                    Role Authorization
                  </h4>
                  <p className="text-[11px] leading-relaxed text-[#6B7280] dark:text-[#94A3B8] font-semibold">
                    Strict identity authentication. Transition users dynamically from Editor access to Viewer nodes, or lock folders securely in 1 click.
                  </p>
                </div>
                <div className="text-[9px] font-extrabold text-amber-500 hover:underline flex items-center gap-1 pt-2">
                  <span>View access matrices</span>
                  <ChevronRight size={10} />
                </div>
              </div>
            </RevealOnScroll>

            {/* FEATURE 4: Revision History */}
            <RevealOnScroll delay={300}>
              <div className="spotlight-card glow-emerald p-5 backdrop-blur-md shadow-sm rounded-xl space-y-4 hover:-translate-y-2 cursor-pointer h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/30 text-emerald-500 flex items-center justify-center shrink-0 shadow-inner">
                    <Clock size={18} className="animate-float-fast text-emerald-500" />
                  </div>
                  <h4 className="font-sans font-extrabold text-xs uppercase tracking-wider text-[#081B3A] dark:text-[#E5E7EB]">
                    Checkpoint Commits
                  </h4>
                  <p className="text-[11px] leading-relaxed text-[#6B7280] dark:text-[#94A3B8] font-semibold">
                    Never lose work. Enjoy microsecond auto-saving to secure databases combined with designated layout restoration points.
                  </p>
                </div>
                <div className="text-[9px] font-extrabold text-emerald-500 hover:underline flex items-center gap-1 pt-2">
                  <span>Browse version control</span>
                  <ChevronRight size={10} />
                </div>
              </div>
            </RevealOnScroll>

          </div>
        </section>

      </main>

    </div>
  );
}
