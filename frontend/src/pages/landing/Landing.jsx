import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
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
  Play
} from 'lucide-react';
import Button from '../../components/common/Button';
import ThemeToggle from '../../components/common/ThemeToggle';
import { BRAND_NAME } from '../../utils/constants';
import { useTheme } from '../../context/ThemeContext';
import athenuraLogo from '../../assets/athenura-logo.png';

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
  const { theme } = useTheme();
  const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      forceUpdate(n => n + 1);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => observer.disconnect();
  }, []);

  
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
      

      {/* CORE CONTAINER */}
      <main className="flex-1 w-full z-10">
        
        {/* HERO SECTION */}
        <section className="hero-section-wrapper relative overflow-hidden">
          <div className="hero-responsive-container flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0 px-[24px] lg:px-0">
            
            {/* HERO LEFT COPY (45% width, vertically centered) */}
            <div className="w-full lg:w-[45%] text-left flex flex-col items-start justify-center">
              
              {/* Badge directly above headline */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0D6EFD]/8 dark:bg-[#0D6EFD]/12 border border-[#0D6EFD]/20 text-[#0D6EFD] text-[10px] font-bold rounded-full uppercase tracking-wider">
                <Sparkles size={11} className="animate-spin-slow" />
                <span>Real-time co-authoring workspace</span>
              </div>

              {/* Headline: clamp font-size, line-height 1, letter-spacing -2px, max-width 650px, gap to badge = 16px */}
              <h1 className="font-sans hero-headline-clamp text-[#0F172A] dark:text-white mt-[16px] max-w-[650px]">
                The collaborative canvas for <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0D6EFD] to-indigo-500 dark:from-[#3FA3FF] dark:to-cyan-400">modern</span> engineering teams.
              </h1>

              {/* Description: font-size 18px, line-height 1.7, max-width 560px, color #64748b, gap to headline = 20px */}
              <p className="hero-description-clamp dark:text-[#94A3B8] font-normal mt-[20px]">
                Co-edit architecture proposals, engineering specifications, sprint documents, and team briefings in real-time. Experience lightning-fast typing synchronization, custom cursor indicators, and a powerful Notion-inspired canvas.
              </p>

              {/* CTA Buttons: 28px below description, equal heights 60px */}
              <div className="flex flex-col sm:flex-row gap-4 mt-[28px] w-full sm:w-auto">
                <button 
                  onClick={() => navigate('/register')} 
                  className="btn-shine group relative inline-flex items-center justify-center gap-2 px-8 h-[60px] text-base font-semibold text-white bg-[#0D6EFD] hover:bg-[#0D6EFD]/95 rounded-xl transition-all shadow-[0_4px_20px_rgba(13,110,253,0.3)] hover:scale-[1.02] active:scale-[0.98] shrink-0"
                >
                  <span>Start Collaborating Free</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => navigate('/login')} 
                  className="inline-flex items-center justify-center gap-2 px-8 h-[60px] text-base font-semibold border border-[#E2E8F0] dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-[#081B3A] dark:text-[#E5E7EB] rounded-xl transition-all backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98] shrink-0"
                >
                  <Play size={14} className="fill-current mr-0.5" />
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>

            {/* HERO RIGHT: PREMIUM PRODUCT SHOWCASE CARD (55% width, right-aligned, floating translation) */}
            <div className="w-full lg:w-[55%] flex justify-center lg:justify-end items-center relative z-10">
              <div className="hero-mockup-card-responsive flex flex-col rounded-[24px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.12)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.5)] transform -translate-y-[10px] overflow-hidden transition-all duration-300 hover:translate-y-[-12px] hover:shadow-[0_35px_90px_rgba(15,23,42,0.15)]">
                
                {/* 1. Mock Browser Title Bar */}
                <div className="px-5 py-4 bg-slate-50/80 dark:bg-[#070B14]/80 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between h-14 shrink-0">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  
                  {/* Domain URL bar */}
                  <div className="mx-4 px-3 py-1 bg-slate-100 dark:bg-[#0F172A]/60 border border-slate-200/50 dark:border-white/5 rounded-lg text-[10px] text-[#64748B] dark:text-[#94A3B8]/60 font-medium w-full max-w-[280px] text-center truncate select-none hidden sm:block">
                    collabdocs.com/specs/synchronization
                  </div>

                  {/* Active Avatars */}
                  <div className="flex items-center shrink-0">
                    <div className="flex -space-x-2 mr-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500 border border-white dark:border-[#0F172A] text-white text-[9px] font-bold flex items-center justify-center shadow-sm" title="Eleanor (You)">EK</div>
                      <div className="w-6 h-6 rounded-full bg-purple-500 border border-white dark:border-[#0F172A] text-white text-[9px] font-bold flex items-center justify-center shadow-sm animate-pulse" title="Sarah">SM</div>
                      <div className="w-6 h-6 rounded-full bg-emerald-500 border border-white dark:border-[#0F172A] text-white text-[9px] font-bold flex items-center justify-center shadow-sm" title="Dave">DJ</div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
                    <span className="text-[9px] font-extrabold text-emerald-500 uppercase tracking-wider hidden xs:inline">Syncing</span>
                  </div>
                </div>

                {/* 2. Editor Toolbar */}
                <div className="px-5 py-3 border-b border-slate-100 dark:border-white/5 bg-white/50 dark:bg-[#0F172A]/50 flex items-center justify-between gap-4 h-12 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F172A] dark:text-white truncate">
                    <span>🚀 Docs</span>
                    <span className="text-slate-300 dark:text-white/10">/</span>
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Sync_v2.md</span>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <Bold size={13} />
                      </button>
                      <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <Italic size={13} />
                      </button>
                      <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <Underline size={13} />
                      </button>
                      <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />
                      <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <AlignLeft size={13} />
                      </button>
                    </div>
                    <button className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-[#0D6EFD] bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 rounded-lg hover:bg-blue-100/55 dark:hover:bg-blue-900/50 transition-colors">
                      <Share2 size={11} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* 3. Main Editor Canvas Workspace (Three-Column Layout: Outline, Workspace Canvas, Activity/Comments Feed) */}
                <div className="flex flex-1 text-left bg-white/95 dark:bg-[#0B1220]/95 overflow-hidden min-h-0">
                  
                  {/* Column A: Notion Outline Sidebar */}
                  <div className="w-32 bg-slate-50/50 dark:bg-[#070B14]/40 border-r border-slate-100 dark:border-white/5 p-4 space-y-4 shrink-0 hidden sm:block">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#94A3B8]/40">Outline</div>
                    <ul className="space-y-2 text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8]">
                      <li className="flex items-center gap-1 text-[#0D6EFD] dark:text-[#3FA3FF] cursor-pointer">
                        <ChevronRight size={11} />
                        <span>1. Overview</span>
                      </li>
                      <li className="flex items-center gap-1 pl-3 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                        <span>2. Sync Protocol</span>
                      </li>
                      <li className="flex items-center gap-1 pl-3 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                        <span>3. Access Rules</span>
                      </li>
                    </ul>
                  </div>

                  {/* Column B: Main Workspace Canvas */}
                  <div className="flex-1 p-5 border-r border-slate-100 dark:border-white/5 overflow-y-auto flex flex-col justify-between h-full min-w-0">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="text-[#0D6EFD] font-extrabold uppercase tracking-widest text-[8px]">Specification Proposal</div>
                        <h3 className="font-sans font-extrabold text-sm sm:text-base text-[#0F172A] dark:text-white tracking-tight leading-tight">
                          1. System Synchronization Spec
                        </h3>
                      </div>

                      <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed space-y-3 font-normal">
                        <p className="relative">
                          This spec details our operational transformation sync layer.
                          {' '}
                          <span className="relative inline-block text-purple-500 font-bold shrink-0">|
                            <span className="absolute -top-4 left-0 bg-purple-500 text-white text-[7px] font-sans font-extrabold px-1 rounded-sm shadow-sm tracking-wider uppercase whitespace-nowrap z-20">Sarah</span>
                          </span>
                          {' '}
                          Keystrokes synchronize cursors instantly.
                        </p>
                        
                        {/* Live Sync Logs Terminal Block */}
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A]/50 border border-slate-100 dark:border-white/5 font-mono text-[9px] text-[#0F172A] dark:text-[#E5E7EB] space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-400 dark:text-[#94A3B8]/60 text-[8px] border-b border-slate-100 dark:border-white/5 pb-1 mb-1 font-sans">
                            <Terminal size={10} />
                            <span>Live Websocket Sync Protocol</span>
                          </div>
                          <div className="relative inline-block pr-1 font-medium min-h-[14px] w-full">
                            <span className="text-blue-500 font-bold">collab-docs:~$ </span>
                            <span>{typedText}</span>
                            <span className={`inline-block w-[2px] h-[1.1em] ${typingColor} animate-pulse ml-0.5 align-middle relative`}>
                              <span className={`absolute -top-3.5 left-0 ${typingColor} text-white font-sans text-[7px] font-extrabold px-1 rounded-sm shadow-sm tracking-wider uppercase whitespace-nowrap`}>
                                {typingUser}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom status area */}
                    <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center gap-2 text-[9px] font-semibold text-[#64748B] dark:text-[#94A3B8]/50 shrink-0 select-none">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                      <span>Dave joined documentation workspace</span>
                    </div>
                  </div>

                  {/* Column C: Activity & Comments Feed Sidebar */}
                  <div className="w-48 bg-slate-50/30 dark:bg-[#070B14]/30 p-4 space-y-4 shrink-0 hidden md:block overflow-y-auto">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#94A3B8]/40">Activity & Comments</div>
                    
                    <div className="space-y-3.5 text-[9px] font-medium leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
                      
                      {/* Comment 1 */}
                      <div className="p-2.5 rounded-lg bg-white/70 dark:bg-[#0F172A]/50 border border-slate-100 dark:border-white/5 space-y-1 shadow-sm">
                        <div className="flex items-center justify-between text-[8px] font-bold text-slate-400 dark:text-[#94A3B8]/50">
                          <span>Dave</span>
                          <span>2m ago</span>
                        </div>
                        <p className="text-[#0F172A] dark:text-slate-300">Should we use binary payload buffers?</p>
                      </div>

                      {/* Comment 2 */}
                      <div className="p-2.5 rounded-lg bg-white/70 dark:bg-[#0F172A]/50 border border-slate-100 dark:border-white/5 space-y-1 shadow-sm">
                        <div className="flex items-center justify-between text-[8px] font-bold text-slate-400 dark:text-[#94A3B8]/50">
                          <span>Sarah</span>
                          <span>1m ago</span>
                        </div>
                        <p className="text-[#0F172A] dark:text-slate-300">Yes, it cuts websocket overhead by 40%.</p>
                      </div>

                      {/* Edit Log */}
                      <div className="flex items-start gap-1.5 pt-1 text-slate-400 dark:text-[#94A3B8]/40 text-[8px]">
                        <span className="w-1 h-1 rounded-full bg-purple-500 mt-1 shrink-0"></span>
                        <p>Julian updated security layout blueprint</p>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </section>

        {/* STATISTICS / SOCIAL PROOF METRICS SECTION */}
        <section className="py-12 lg:py-16 border-y border-slate-200/50 dark:border-white/5 bg-slate-50/10 dark:bg-white/[0.002]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            <RevealOnScroll>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl text-[#0D6EFD] dark:text-[#3FA3FF]">
                    <AnimatedCounter end={10} suffix="K+" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#94A3B8]/60">Active Teams</div>
                </div>

                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl text-purple-500 dark:text-purple-400">
                    <AnimatedCounter end={50} suffix="K+" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#94A3B8]/60">Documents Saved</div>
                </div>

                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl text-emerald-500 dark:text-emerald-400">
                    <AnimatedDecimalCounter end={9999} suffix="%" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#94A3B8]/60">System Uptime</div>
                </div>

                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl text-amber-500 dark:text-amber-400">
                    <AnimatedCounter end={120} suffix="+" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#94A3B8]/60">Countries Reached</div>
                </div>

              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* PREMIUM FEATURE CARDS GRID */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 space-y-16">
            <RevealOnScroll>
              <div className="text-center space-y-4 max-w-3xl mx-auto">
                <span className="text-[#0D6EFD] text-xs font-extrabold uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-3.5 py-1.5 rounded-full border border-blue-200/50 dark:border-blue-900/30">Built For Engineering Teams</span>
                <h2 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#081B3A] dark:text-white leading-tight tracking-tight pt-2">
                  Enterprise speed. Minimalist control.
                </h2>
                <p className="text-base sm:text-lg text-[#6B7280] dark:text-[#94A3B8] max-w-2xl mx-auto font-normal leading-relaxed">
                  Designed to eliminate friction, sync active Caret vectors instantly, and safeguard your engineering layout blueprint securely.
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              
              {/* FEATURE 1: Real-time Sync */}
              <RevealOnScroll delay={0}>
                <div className="spotlight-card glow-blue p-6 backdrop-blur-md shadow-sm rounded-xl space-y-6 hover:-translate-y-2 cursor-pointer h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/30 text-[#0D6EFD] flex items-center justify-center shrink-0 shadow-inner">
                      <Activity size={20} className="animate-float-fast text-[#0D6EFD]" />
                    </div>
                    <h4 className="font-sans font-bold text-lg text-[#081B3A] dark:text-white">
                      Real-time Sync Layer
                    </h4>
                    <p className="text-sm leading-relaxed text-[#6B7280] dark:text-[#94A3B8]">
                      Co-author specs synchronously. Instantly replicate cursors, key carets, formatting adjustments, and typing highlights across the globe.
                    </p>
                  </div>
                  <div className="text-xs font-bold text-[#0D6EFD] hover:underline flex items-center gap-1 pt-2">
                    <span>Explore socket layer</span>
                    <ChevronRight size={12} />
                  </div>
                </div>
              </RevealOnScroll>

              {/* FEATURE 2: Intelligent Outlines */}
              <RevealOnScroll delay={100}>
                <div className="spotlight-card glow-purple p-6 backdrop-blur-md shadow-sm rounded-xl space-y-6 hover:-translate-y-2 cursor-pointer h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-900/30 text-purple-500 flex items-center justify-center shrink-0 shadow-inner">
                      <Layers size={20} className="animate-float-slow text-purple-500" />
                    </div>
                    <h4 className="font-sans font-bold text-lg text-[#081B3A] dark:text-white">
                      Engineering Outlines
                    </h4>
                    <p className="text-sm leading-relaxed text-[#6B7280] dark:text-[#94A3B8]">
                      Spin up pre-structured specs, release blueprints, roadmap targets, and API templates in standard fluid responsive canvas dimensions.
                    </p>
                  </div>
                  <div className="text-xs font-bold text-purple-500 hover:underline flex items-center gap-1 pt-2">
                    <span>Preview templates</span>
                    <ChevronRight size={12} />
                  </div>
                </div>
              </RevealOnScroll>

              {/* FEATURE 3: Access Permissions */}
              <RevealOnScroll delay={200}>
                <div className="spotlight-card glow-amber p-6 backdrop-blur-md shadow-sm rounded-xl space-y-6 hover:-translate-y-2 cursor-pointer h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900/30 text-amber-500 flex items-center justify-center shrink-0 shadow-inner">
                      <Shield size={20} className="animate-float-medium text-amber-500" />
                    </div>
                    <h4 className="font-sans font-bold text-lg text-[#081B3A] dark:text-white">
                      Role Authorization
                    </h4>
                    <p className="text-sm leading-relaxed text-[#6B7280] dark:text-[#94A3B8]">
                      Strict identity authentication. Transition users dynamically from Editor access to Viewer nodes, or lock folders securely in 1 click.
                    </p>
                  </div>
                  <div className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1 pt-2">
                    <span>View access matrices</span>
                    <ChevronRight size={12} />
                  </div>
                </div>
              </RevealOnScroll>

              {/* FEATURE 4: Checkpoint commits */}
              <RevealOnScroll delay={300}>
                <div className="spotlight-card glow-emerald p-6 backdrop-blur-md shadow-sm rounded-xl space-y-6 hover:-translate-y-2 cursor-pointer h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/30 text-emerald-500 flex items-center justify-center shrink-0 shadow-inner">
                      <Clock size={20} className="animate-float-fast text-emerald-500" />
                    </div>
                    <h4 className="font-sans font-bold text-lg text-[#081B3A] dark:text-white">
                      Checkpoint Commits
                    </h4>
                    <p className="text-sm leading-relaxed text-[#6B7280] dark:text-[#94A3B8]">
                      Never lose work. Enjoy microsecond auto-saving to secure databases combined with designated layout restoration points.
                    </p>
                  </div>
                  <div className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1 pt-2">
                    <span>Browse version control</span>
                    <ChevronRight size={12} />
                  </div>
                </div>
              </RevealOnScroll>

            </div>
          </div>
        </section>

      </main>

    </div>
  );
}
