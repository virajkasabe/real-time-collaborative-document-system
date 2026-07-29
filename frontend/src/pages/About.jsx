import { useEffect, useRef, useState } from "react";
import { Users, Star, Lightbulb, FileText, Shield, MessageSquare, Zap } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

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
  { icon: <Zap size={20} />, title: "Live Document Sync", desc: "Changes appear instantly across all connected users without manual refresh.", avatarCls: "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300" },
  { icon: <Shield size={20} />, title: "Secure Authentication", desc: "Protected access with JWT authentication and secure user management.", avatarCls: "bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300" },
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
  const isDark = theme === "dark" || document.documentElement.classList.contains('dark');

  const team = [
    { name: 'Lakhan Shinde', role: 'Full Stack Developer', avatar: 'L' },
    { name: 'Madhu Kasabe', role: 'Frontend Developer', avatar: 'M' },
    { name: 'Shreyas Patil', role: 'UI/UX Designer', avatar: 'S' },
    { name: 'Nikita Deshmukh', role: 'Product Manager', avatar: 'N' },
    { name: 'Abhishek Gole', role: 'QA Engineer', avatar: 'A' },
  ];

  const handlePointerMove = (e) => {
    const container = e.currentTarget;
    const cards = container.querySelectorAll(".spotlight-card");
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 relative z-10">
        {/* Heading */}
        <RevealOnScroll>
          <div className="text-center mb-16 px-4">
            <h1 className="font-sans font-extrabold tracking-tight text-4xl sm:text-5xl md:text-6xl text-[#0F172A] dark:text-white">
              About{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0D6EFD] to-indigo-500 dark:from-[#3FA3FF] dark:to-cyan-400">
                Us
              </span>
            </h1>
            <p className={`max-w-xl mx-auto mt-4 text-sm sm:text-base font-semibold leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-[#6B7280]"}`}>
              Learn more about our mission, our story, and the team building the future of document collaboration.
            </p>
          </div>
        </RevealOnScroll>

        {/* MISSION SECTION */}
        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <RevealOnScroll>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Our Mission
              </h2>
            </RevealOnScroll>
            <RevealOnScroll delay={100}>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-lg sm:text-xl font-medium">
                Athenura was built to make document collaboration effortless. We believe great ideas come from teams working together — and the tools they use should never get in the way.
              </p>
            </RevealOnScroll>
          </div>
        </section>

        {/* STORY SECTION */}
        <section className="py-16 px-6 bg-slate-50 dark:bg-[#080F1E] border-y border-slate-200/50 dark:border-white/5 rounded-2xl transition-colors duration-300">
          <div className="max-w-3xl mx-auto space-y-6">
            <RevealOnScroll>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight text-center">
                Our Story
              </h2>
            </RevealOnScroll>
            <RevealOnScroll delay={100}>
              <div className="space-y-4 text-slate-600 dark:text-gray-400 leading-relaxed text-base sm:text-lg text-center">
                <p>
                  Athenura started as a project by a group of developers who were frustrated with existing document tools. We wanted something faster, cleaner, and built for real-time teamwork.
                </p>
                <p>
                  Today, Athenura powers collaboration for teams — from startups to student groups — all built with the same vision: documents should bring people together.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* VALUES SECTION */}
        <section className="py-16 px-6 transition-colors duration-300">
          <div className="max-w-4xl mx-auto">
            <RevealOnScroll>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-10 tracking-tight">
                Our Values
              </h2>
            </RevealOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: '🤝', title: 'Collaboration First', desc: 'Everything we build starts with teamwork in mind.' },
                { icon: '🚀', title: 'Speed Matters', desc: 'Real-time means real-time. No lag, no delay.' },
                { icon: '🔐', title: 'Privacy by Design', desc: 'Your data is yours. Always secure, always private.' },
              ].map((v, i) => (
                <RevealOnScroll key={i} delay={i * 100}>
                  <div className="spotlight-card bg-slate-50 dark:bg-[#0F172A] border border-slate-200/60 dark:border-white/5 rounded-2xl p-6 text-center hover:border-blue-500/30 hover:shadow-lg dark:hover:shadow-none transition-all duration-300 h-full flex flex-col justify-start">
                    <div className="text-4xl mb-4 p-2.5 w-14 h-14 bg-white dark:bg-[#070B14] rounded-full flex items-center justify-center border border-slate-100 dark:border-white/5 shadow-sm mx-auto">{v.icon}</div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">{v.title}</h3>
                    <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* HIGHLIGHTS & WHY CHOOSE SECTION */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {highlights.map((h, i) => (
              <RevealOnScroll key={h.title} delay={i * 100}>
                <div className={`spotlight-card glow-blue rounded-2xl border p-4 sm:p-5 flex gap-4 transition-colors duration-300 ${isDark ? "bg-zinc-900/60 border-white/5" : "bg-white border-blue-100 shadow-sm"}`}>
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${h.avatarCls}`}>{h.icon}</div>
                  <div>
                    <h3 className={`font-semibold text-sm sm:text-base ${isDark ? "text-white" : "text-slate-900"}`}>{h.title}</h3>
                    <p className={`text-xs sm:text-sm leading-6 mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>{h.desc}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}

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
        </section>

        {/* TEAM GRID */}
        <section className="py-16 px-6 bg-slate-50 dark:bg-[#080F1E] border-t border-slate-200/50 dark:border-white/5 rounded-2xl transition-colors duration-300">
          <div className="max-w-4xl mx-auto">
            <RevealOnScroll>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-10 tracking-tight">
                Meet the Team
              </h2>
            </RevealOnScroll>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {team.map((m, i) => (
                <RevealOnScroll key={i} delay={i * 75}>
                  <div className="text-center space-y-3 group">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0D6EFD] to-indigo-600 hover:from-blue-600 hover:to-indigo-700 flex items-center justify-center text-white text-2xl font-black mx-auto shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 select-none cursor-default">
                      {m.avatar}
                    </div>
                    <div>
                      <div className="text-slate-900 dark:text-white font-bold text-base transition-colors duration-200 group-hover:text-blue-500 dark:group-hover:text-blue-400">{m.name}</div>
                      <div className="text-slate-500 dark:text-gray-500 text-xs font-semibold mt-0.5">{m.role}</div>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* CTA */}
      <section className={`py-16 transition-colors duration-300 ${isDark ? "bg-gradient-to-r from-zinc-900 to-black" : "bg-gradient-to-r from-blue-700 to-indigo-700"}`}>
        <RevealOnScroll>
          <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
            <h2 className="font-sans font-extrabold tracking-tight text-3xl sm:text-4xl text-white">Join Our Journey</h2>
            <p className={`max-w-xl mx-auto leading-relaxed text-sm sm:text-base ${isDark ? "text-zinc-400" : "text-blue-100"}`}>
              Join us to build the future of engineering collaboration. We're growing fast and looking for driven, thoughtful engineers and designers.
            </p>
          </div>
        </RevealOnScroll>
      </section>
    </div>
  );
}
