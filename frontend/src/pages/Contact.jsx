import { useEffect, useRef, useState } from "react";
import { MapPin, Mail, Globe, Send, MessageSquare, Phone, Users, Check } from "lucide-react";
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

const frequentContacts = [
  { dept: "Technical Support", email: "technical@collabdocs.com" },
  { dept: "Account Assistance", email: "accounts@collabdocs.com" },
  { dept: "Collaboration Help", email: "collaboration@collabdocs.com" },
  { dept: "Feature Requests", email: "feedback@collabdocs.com" },
];

export default function ContactUs() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: "", email: "", message: "" });
  };

  const handlePointerMove = (e) => {
    const cards = e.currentTarget.querySelectorAll(".spotlight-card");
    cards.forEach(card => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${e.clientX - r.left}px`);
      card.style.setProperty("--mouse-y", `${e.clientY - r.top}px`);
    });
  };

  const cardCls = `spotlight-card rounded-2xl border transition-colors duration-300 ${isDark ? "bg-zinc-900/60 border-white/5" : "bg-white border-blue-100 shadow-sm"}`;
  const inputCls = `w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDark ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500" : "bg-[#f8faff] border-blue-100 text-slate-900 placeholder-slate-400"}`;
  const labelCls = `block mb-2 text-sm font-semibold ${isDark ? "text-zinc-300" : "text-slate-700"}`;

  return (
    <div
      onPointerMove={handlePointerMove}
      className={`min-h-screen relative overflow-x-hidden dot-grid-bg transition-colors duration-300 ${isDark ? "bg-[#070B14] text-[#E5E7EB]" : "bg-[#F7FAFF] text-[#081B3A]"}`}
    >
      {/* Gradient glows */}
      <div className="absolute top-1/4 left-1/4 w-[20rem] sm:w-[35rem] h-[20rem] sm:h-[35rem] rounded-full bg-blue-500/10 dark:bg-blue-600/5 blur-3xl pointer-events-none animate-pulse-slow z-0" />
      <div className="absolute top-2/3 right-1/4 w-[18rem] sm:w-[28rem] h-[18rem] sm:h-[28rem] rounded-full bg-indigo-500/10 dark:bg-indigo-600/5 blur-3xl pointer-events-none animate-pulse-slow z-0" />

      {/* Floating icons — desktop only */}
      <div className="absolute top-24 left-[8%] text-blue-500/20 dark:text-white/5 animate-float-slow z-0 pointer-events-none hidden lg:block"><Mail size={44} /></div>
      <div className="absolute top-40 right-[12%] text-violet-500/20 dark:text-white/5 animate-float-medium z-0 pointer-events-none hidden lg:block"><MessageSquare size={40} /></div>
      <div className="absolute bottom-[40%] left-[6%] text-cyan-500/20 dark:text-white/5 animate-float-fast z-0 pointer-events-none hidden lg:block"><Phone size={36} /></div>
      <div className="absolute bottom-[28%] right-[8%] text-blue-500/20 dark:text-white/5 animate-float-slow z-0 pointer-events-none hidden lg:block"><Users size={38} /></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-14 pb-14 sm:pb-16 relative z-10">

        {/* Heading */}
        <RevealOnScroll>
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="font-sans font-extrabold tracking-tight text-4xl sm:text-5xl md:text-6xl text-[#0F172A] dark:text-white">
              Contact{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0D6EFD] to-indigo-500 dark:from-[#3FA3FF] dark:to-cyan-400">
                Us
              </span>
            </h1>
            <p className={`max-w-lg mx-auto mt-4 text-sm sm:text-base font-medium leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-[#6B7280]"}`}>
              Have a question, a partnership idea, or just want to say hi? We'd love to hear from you.
            </p>
          </div>
        </RevealOnScroll>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start mb-8">

          {/* Left Column */}
          <div className="flex flex-col gap-6">

            <RevealOnScroll>
              <div className={`${cardCls} glow-blue p-5 sm:p-6`}>
                <h3 className={`font-sans font-bold text-base sm:text-lg mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Get in Contact</h3>
                <div className="space-y-4">

                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl shrink-0 ${isDark ? "bg-zinc-800" : "bg-blue-50"}`}>
                      <MapPin size={18} className={isDark ? "text-blue-400" : "text-blue-600"} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Office</p>
                      <p className={`text-sm leading-6 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                        Athenura Technologies<br />Noida, Uttar Pradesh 201309, India
                      </p>
                    </div>
                  </div>

                  <div className={`border-t ${isDark ? "border-zinc-700" : "border-blue-100"}`} />

                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl shrink-0 ${isDark ? "bg-zinc-800" : "bg-violet-50"}`}>
                      <Mail size={18} className={isDark ? "text-violet-400" : "text-violet-600"} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Support Email</p>
                      <p className={`text-sm break-all ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>support@collabdocs.com</p>
                    </div>
                  </div>

                  <div className={`border-t ${isDark ? "border-zinc-700" : "border-blue-100"}`} />

                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl shrink-0 ${isDark ? "bg-zinc-800" : "bg-cyan-50"}`}>
                      <Globe size={18} className={isDark ? "text-cyan-400" : "text-cyan-600"} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Website</p>
                      <p className={`text-sm ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>collabdocs.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            {/* Map */}
            <RevealOnScroll delay={100}>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Athenura+Technologies+Noida+Uttar+Pradesh+201309+India"
                target="_blank"
                rel="noopener noreferrer"
                className={`relative overflow-hidden h-48 sm:h-52 rounded-2xl border block cursor-pointer transition-colors duration-300 ${isDark ? "border-zinc-700" : "border-blue-100 shadow-sm"}`}
              >
                <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-br from-zinc-800 via-zinc-900 to-black" : "bg-gradient-to-br from-blue-100 via-indigo-100 to-cyan-100"}`} />
                <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                  {[0, 25, 50, 75, 100].map((p) => (
                    <g key={p}>
                      <line x1={`${p}%`} y1="0" x2={`${p}%`} y2="100%" stroke={isDark ? "#3f3f46" : "#93c5fd"} />
                      <line x1="0" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke={isDark ? "#3f3f46" : "#93c5fd"} />
                    </g>
                  ))}
                </svg>
                <div className="relative z-10 h-full flex flex-col items-center justify-center gap-2">
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center shadow-md animate-float-fast">
                    <MapPin size={16} className="text-white" />
                  </div>
                  <p className={`font-semibold text-sm ${isDark ? "text-blue-400" : "text-blue-700"}`}>Athenura Technologies</p>
                  <p className={`text-xs ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>Noida, Uttar Pradesh, India</p>
                </div>
              </a>
            </RevealOnScroll>
          </div>

          {/* Right Column — Contact Form */}
          <RevealOnScroll delay={150}>
            <div className={`${cardCls} glow-purple p-5 sm:p-8`}>
              <h2 className={`font-sans font-bold text-xl sm:text-2xl mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>Get in Touch</h2>
              <p className={`text-sm mb-6 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>Our team will respond within 24 business hours.</p>

              {sent && (
                <div className="bg-green-100 border border-green-300 text-green-800 rounded-lg px-4 py-3 mb-5 text-sm flex items-center">
                  <Check size={16} className="mr-1.5 shrink-0" /> Message sent! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={labelCls}>Name</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Email Address</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Your Message</label>
                  <textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help you?" className={`${inputCls} resize-none`} />
                </div>
                <button type="submit" className="btn-shine w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm shadow-blue-500/20 hover:scale-[1.01] active:scale-[0.99]">
                  <Send size={15} />
                  Send Your Message
                </button>
              </form>
            </div>
          </RevealOnScroll>
        </div>

        {/* Frequent Contacts */}
        <RevealOnScroll>
          <div className={`${cardCls} glow-blue overflow-hidden`}>
            <div className={`px-5 sm:px-6 py-4 sm:py-5 border-b ${isDark ? "border-zinc-700" : "border-blue-100"}`}>
              <h3 className={`font-sans font-bold text-base sm:text-lg ${isDark ? "text-white" : "text-slate-900"}`}>Frequent Contacts</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-zinc-800">
              {frequentContacts.map((contact) => (
                <div key={contact.dept} className="flex flex-col sm:flex-row sm:items-center justify-between px-5 sm:px-6 py-3 sm:py-4 gap-1 sm:gap-0">
                  <span className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{contact.dept}</span>
                  <a href={`mailto:${contact.email}`} className={`text-sm break-all ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}>{contact.email}</a>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}