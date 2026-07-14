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

// 4. HIGH-PERFORMANCE ANIMATED ONE-DECIMAL COUNTER (For uptime metric like 99.9%)
function AnimatedOneDecimalCounter({ end, duration = 1500, suffix = "" }) {
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
      {(count / 10).toFixed(1)}
      {suffix}
    </span>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');

  const features = [
    {
      icon: '⚡',
      title: 'Real-Time Collaboration',
      desc: 'Work together with your team simultaneously. See changes as they happen with live cursor tracking.'
    },
    {
      icon: '📄',
      title: 'Rich Document Editor',
      desc: 'Full-featured editor with formatting, tables, images, and more — just like Microsoft Word.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      desc: 'Enterprise-grade security with role-based access control. You decide who sees what.'
    },
    {
      icon: '💬',
      title: 'Comments & Chat',
      desc: 'Leave inline comments and chat with collaborators directly inside the document.'
    },
    {
      icon: '📁',
      title: 'Version History',
      desc: 'Never lose work. Restore any previous version of your document with one click.'
    },
    {
      icon: '🌐',
      title: 'Access Anywhere',
      desc: 'Works on desktop, tablet, and mobile. Your documents are always with you.'
    },
  ];

  const steps = [
    { num: '01', title: 'Create a Document', desc: 'Start from scratch or import an existing Word file.' },
    { num: '02', title: 'Invite Your Team', desc: 'Share with teammates by email. Assign roles — Editor or Viewer.' },
    { num: '03', title: 'Collaborate Live', desc: 'Edit together in real-time. See cursors, comments, and changes instantly.' },
    { num: '04', title: 'Export & Share', desc: 'Download as PDF or DOCX anytime. Share links with anyone.' },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Product Manager, TechCorp',
      avatar: 'P',
      text: 'Athenura replaced Google Docs for our entire team. The real-time sync is incredibly fast.'
    },
    {
      name: 'Rahul Mehta',
      role: 'Startup Founder',
      avatar: 'R',
      text: 'We use it for all our proposals and reports. Version history has saved us multiple times!'
    },
    {
      name: 'Anjali Nair',
      role: 'Content Lead, MediaHouse',
      avatar: 'A',
      text: 'The comment and chat feature keeps all feedback in one place. No more endless email chains.'
    },
  ];

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
        <section className="hero-section-wrapper py-12 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
          <div className="hero-responsive-container flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0 px-4 sm:px-6 lg:px-0">
            
            {/* HERO LEFT COPY (45% width, vertically centered) */}
            <div className="w-full lg:w-[45%] text-left flex flex-col items-start justify-center">
              
              {/* Badge directly above headline */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0D6EFD]/8 dark:bg-[#0D6EFD]/12 border border-[#0D6EFD]/20 text-[#0D6EFD] text-[10px] font-bold rounded-full uppercase tracking-wider">
                <Sparkles size={11} className="animate-spin-slow" />
                <span>Real-time co-authoring workspace</span>
              </div>

              {/* Headline: clamp font-size, line-height 1, letter-spacing -2px, max-width 650px, gap to badge = 16px */}
              <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] dark:text-white mt-[16px] max-w-[650px] leading-tight tracking-tight">
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
                  className="w-full sm:w-auto btn-shine group relative inline-flex items-center justify-center gap-2 px-8 h-[60px] text-base font-semibold text-white bg-[#0D6EFD] hover:bg-[#0D6EFD]/95 rounded-xl transition-all shadow-[0_4px_20px_rgba(13,110,253,0.3)] hover:scale-[1.02] active:scale-[0.98] shrink-0 cursor-pointer"
                >
                  <span>Start Collaborating Free</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => navigate('/login')} 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 h-[60px] text-base font-semibold border border-[#E2E8F0] dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-[#081B3A] dark:text-[#E5E7EB] rounded-xl transition-all backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98] shrink-0 cursor-pointer"
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

        {/* SECTION 2 — FEATURES */}
        <section id="features" className="py-20 px-6 bg-slate-50 dark:bg-[#060D1A] transition-colors duration-300 border-y border-slate-200/60 dark:border-white/5">
          <div className="max-w-6xl mx-auto">
            <RevealOnScroll>
              <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
                <span className="text-[#0D6EFD] text-xs font-extrabold uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-3.5 py-1.5 rounded-full border border-blue-200/50 dark:border-blue-900/30">Everything you need</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white text-center leading-tight tracking-tight pt-2">
                  Everything you need to collaborate
                </h2>
                <p className="text-slate-500 dark:text-gray-400 text-center max-w-xl mx-auto text-base sm:text-lg">
                  Athenura brings your team together with powerful tools built for modern document collaboration.
                </p>
              </div>
            </RevealOnScroll>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <RevealOnScroll key={i} delay={i * 75}>
                  <div className="spotlight-card bg-white dark:bg-[#0F172A] border border-slate-200/70 dark:border-white/5 rounded-2xl p-6 hover:border-blue-500/30 hover:shadow-lg dark:hover:shadow-none transition-all duration-300 h-full flex flex-col justify-start">
                    <div className="text-3xl mb-4 p-2.5 w-12 h-12 bg-slate-50 dark:bg-[#070B14] rounded-xl flex items-center justify-center border border-slate-100 dark:border-white/5 shadow-inner">{f.icon}</div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">
                      {f.title}
                    </h3>
                    <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3 — HOW IT WORKS */}
        <section className="py-20 px-6 bg-white dark:bg-[#080F1E] transition-colors duration-300">
          <div className="max-w-4xl mx-auto">
            <RevealOnScroll>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white text-center mb-16 tracking-tight">
                How it works
              </h2>
            </RevealOnScroll>
            
            <div className="space-y-10">
              {steps.map((s, i) => (
                <RevealOnScroll key={i} delay={i * 100}>
                  <div className="flex gap-6 items-start p-6 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#0F172A]/40 backdrop-blur-sm">
                    <span className="text-4xl sm:text-5xl font-black text-blue-600/20 dark:text-blue-500/10 flex-shrink-0 w-16 select-none leading-none pt-1">
                      {s.num}
                    </span>
                    <div>
                      <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-1.5">
                        {s.title}
                      </h3>
                      <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 — STATS / SOCIAL PROOF */}
        <section className="py-16 px-6 bg-slate-50 dark:bg-[#060D1A] transition-colors duration-300 border-y border-slate-200/60 dark:border-white/5">
          <div className="max-w-6xl mx-auto">
            <RevealOnScroll>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center font-sans">
                {[
                  { value: 10, label: 'Documents Created', isK: true },
                  { value: 500, label: 'Teams Using Athenura', isPlus: true },
                  { value: 999, label: 'Uptime', isUptime: true },
                  { value: 100, label: 'Sync Latency', isLatency: true },
                ].map((s, i) => (
                  <div key={i} className="space-y-1">
                    <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                      {s.isK && <AnimatedCounter end={s.value} suffix="K+" />}
                      {s.isPlus && <AnimatedCounter end={s.value} suffix="+" />}
                      {s.isUptime && <AnimatedOneDecimalCounter end={s.value} suffix="%" />}
                      {s.isLatency && (
                        <>
                          <span className="font-sans font-extrabold tracking-tight">&lt; </span>
                          <AnimatedCounter end={s.value} suffix="ms" />
                        </>
                      )}
                    </div>
                    <div className="text-slate-500 dark:text-gray-400 text-xs sm:text-sm font-semibold">{s.label}</div>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* SECTION 5 — TESTIMONIALS */}
        <section className="py-20 px-6 bg-white dark:bg-[#080F1E] transition-colors duration-300">
          <div className="max-w-5xl mx-auto">
            <RevealOnScroll>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white text-center mb-16 tracking-tight">
                Loved by teams everywhere
              </h2>
            </RevealOnScroll>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <RevealOnScroll key={i} delay={i * 100}>
                  <div className="bg-slate-50/50 dark:bg-[#0F172A] border border-slate-200/60 dark:border-white/5 rounded-2xl p-6 h-full flex flex-col justify-between shadow-sm dark:shadow-none hover:shadow-md transition-shadow duration-300">
                    <p className="text-slate-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-6 italic">
                      "{t.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                        {t.avatar}
                      </div>
                      <div>
                        <div className="text-slate-900 dark:text-white text-sm font-bold">
                          {t.name}
                        </div>
                        <div className="text-slate-500 dark:text-gray-500 text-xs font-semibold">{t.role}</div>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6 — CTA BANNER */}
        <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-900/25 dark:to-indigo-900/15 border-y border-slate-200/60 dark:border-blue-500/10 transition-colors duration-300">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <RevealOnScroll>
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Ready to collaborate smarter?
                </h2>
                <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                  Join thousands of teams already using Athenura. Free to get started.
                </p>
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll delay={150}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <a href="/register"
                  className="px-8 py-3 bg-[#0D6EFD] hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-[0_4px_15px_rgba(13,110,253,0.15)] flex items-center justify-center cursor-pointer">
                  Get Started Free
                </a>
                <a href="/login"
                  className="px-8 py-3 border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-white font-bold rounded-xl transition backdrop-blur-sm flex items-center justify-center cursor-pointer">
                  Sign In
                </a>
              </div>
            </RevealOnScroll>
          </div>
        </section>

      </main>

    </div>
  );
}
