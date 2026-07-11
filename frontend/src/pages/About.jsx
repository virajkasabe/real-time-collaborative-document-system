import { useEffect, useRef, useState } from "react";
import { Users, Star, Lightbulb, FileText, Shield, MessageSquare } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function RevealOnScroll({ children, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      {children}
    </div>
  );
}

// Pastel blue / lavender / green — work in both light & dark
const values = [
  {
    icon: <Users size={22} />,
    title: "Real-Time Collaboration",
    desc: "Collaborate together with instant updates.",
    iconColor: "text-blue-500 dark:text-blue-300",
    bg: "bg-[#DBEAFE] dark:bg-[#172554]/60",
    border: "border-[#BFDBFE] dark:border-blue-800/40",
    glow: "glow-blue",
  },
  {
    icon: <Star size={22} />,
    title: "Security & Trust",
    desc: "Secure sharing with role-based access.",
    iconColor: "text-violet-500 dark:text-violet-300",
    bg: "bg-[#EDE9FE] dark:bg-[#2E1065]/60",
    border: "border-[#DDD6FE] dark:border-violet-800/40",
    glow: "glow-purple",
  },
  {
    icon: <Lightbulb size={22} />,
    title: "Innovation",
    desc: "Pushing for innovation, collaboration and solutions.",
    iconColor: "text-emerald-600 dark:text-emerald-300",
    bg: "bg-[#D1FAE5] dark:bg-[#064E3B]/50",
    border: "border-[#A7F3D0] dark:border-emerald-800/40",
    glow: "glow-emerald",
  },
];

const highlights = [
  { emoji: "⚡", title: "Live Document Sync", desc: "Changes appear instantly across all connected users without manual refresh.", avatarCls: "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300" },
  { emoji: "🛡️", title: "Secure Authentication", desc: "Protected access with JWT authentication and secure user management.", avatarCls: "bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300" },
];

const reasons = [
  "Real-time collaborative editing",
  "Secure role-based document sharing",
  "Automatic version tracking",
  "Cloud-based document access",
  "Seamless team productivity",
];

export default function AboutUs() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handlePointerMove = (e) => {
    const cards = e.currentTarget.querySelectorAll(".spotlight-card");
    cards.forEach(card => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${e.clientX - r.left}px`);
      card.style.setProperty("--mouse-y", `${e.clientY - r.top}px`);
    });
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className={`min-h-[calc(100vh-72px)] relative overflow-x-hidden dot-grid-bg transition-colors duration-300 ${isDark ? "bg-[#070B14] text-[#E5E7EB]" : "bg-[#F7FAFF] text-[#081B3A]"}`}
    >
      {/* Gradient glows */}
      <div className="absolute top-1/4 left-1/4 w-[20rem] sm:w-[35rem] h-[20rem] sm:h-[35rem] rounded-full bg-blue-500/10 dark:bg-blue-600/5 blur-3xl pointer-events-none animate-pulse-slow z-0" />
      <div className="absolute top-2/3 right-1/4 w-[18rem] sm:w-[30rem] h-[18rem] sm:h-[30rem] rounded-full bg-indigo-500/10 dark:bg-indigo-600/5 blur-3xl pointer-events-none animate-pulse-slow z-0" />

      {/* Floating icons — desktop only */}
      <div className="absolute top-24 left-[8%] text-blue-500/20 dark:text-white/5 animate-float-slow z-0 pointer-events-none hidden lg:block"><FileText size={44} /></div>
      <div className="absolute top-40 right-[12%] text-violet-500/20 dark:text-white/5 animate-float-medium z-0 pointer-events-none hidden lg:block"><Users size={40} /></div>
      <div className="absolute bottom-[38%] left-[6%] text-cyan-500/20 dark:text-white/5 animate-float-fast z-0 pointer-events-none hidden lg:block"><MessageSquare size={38} /></div>
      <div className="absolute bottom-[25%] right-[8%] text-blue-500/20 dark:text-white/5 animate-float-slow z-0 pointer-events-none hidden lg:block"><Shield size={36} /></div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-12 relative z-10">

        {/* Heading */}
        <RevealOnScroll>
          <div className="text-center mb-10 sm:mb-14">
            <h1 className="font-sans font-extrabold tracking-tight text-4xl sm:text-5xl md:text-6xl text-[#0F172A] dark:text-white">
              About{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0D6EFD] to-indigo-500 dark:from-[#3FA3FF] dark:to-cyan-400">
                Us
              </span>
            </h1>
            <p className={`max-w-xl mx-auto mt-4 text-sm sm:text-base font-medium leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-[#6B7280]"}`}>
              Building a secure, real-time collaborative document platform for modern engineering teams.
            </p>
          </div>
        </RevealOnScroll>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-10">

          {/* Left */}
          <div className="space-y-6">
            <RevealOnScroll>
              <p className={`leading-8 text-sm sm:text-base ${isDark ? "text-[#94A3B8]" : "text-slate-600"}`}>
                We are building a secure, real-time collaborative document platform inspired by modern productivity tools. Our goal is to enable teams to create, edit, and share documents seamlessly while maintaining security, transparency, and efficient teamwork.
              </p>
              <p className={`leading-8 text-sm sm:text-base mt-4 ${isDark ? "text-[#94A3B8]" : "text-slate-600"}`}>
                Through real-time collaboration, version history, and role-based access control, we empower users to work together from anywhere with confidence.
              </p>
            </RevealOnScroll>

            {/* Value cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {values.map((v, i) => (
                <RevealOnScroll key={v.title} delay={i * 100}>
                  <div className={`spotlight-card ${v.glow} p-5 text-center rounded-2xl border ${v.bg} ${v.border} hover:-translate-y-1 transition-transform duration-300 cursor-default h-full`}>
                    <div className={`flex justify-center mb-3 ${v.iconColor}`}>{v.icon}</div>
                    <h3 className={`font-semibold text-sm mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>{v.title}</h3>
                    <p className={`text-xs leading-5 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>{v.desc}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="space-y-4">
            <RevealOnScroll>
              <h2 className="font-sans font-extrabold tracking-tight text-2xl sm:text-3xl text-[#0F172A] dark:text-white mb-2">
                Project Highlights
              </h2>
            </RevealOnScroll>

            {highlights.map((h, i) => (
              <RevealOnScroll key={h.title} delay={i * 100}>
                <div className={`spotlight-card glow-blue rounded-2xl border p-4 sm:p-5 flex gap-4 transition-colors duration-300 ${isDark ? "bg-zinc-900/60 border-white/5" : "bg-white border-blue-100 shadow-sm"}`}>
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${h.avatarCls}`}>{h.emoji}</div>
                  <div>
                    <h3 className={`font-semibold text-sm sm:text-base ${isDark ? "text-white" : "text-slate-900"}`}>{h.title}</h3>
                    <p className={`text-xs sm:text-sm leading-6 mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>{h.desc}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}

            {/* Why Choose */}
            <RevealOnScroll delay={200}>
              <div className={`spotlight-card glow-purple rounded-2xl border p-4 sm:p-5 transition-colors duration-300 ${isDark ? "bg-zinc-900/60 border-white/5" : "bg-white border-blue-100 shadow-sm"}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Star size={14} className="text-blue-500 dark:text-blue-400 fill-blue-500 dark:fill-blue-400 flex-shrink-0" />
                  <h3 className={`font-semibold text-sm sm:text-base ${isDark ? "text-white" : "text-slate-900"}`}>Why Choose Our Platform</h3>
                </div>
                <div className="space-y-3">
                  {reasons.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0" />
                      <span className={`text-xs sm:text-sm ${isDark ? "text-[#94A3B8]" : "text-slate-600"}`}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </main>
    </div>
  );
}
