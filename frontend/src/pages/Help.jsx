import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown, Search, Send, Headphones, MessageSquare, X, FileText, Shield, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
      className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {children}
    </div>
  );
}

const FAQS = [
  { q: 'How do I create a new document?', a: 'Click the "New Document" button in the top navigation bar. You can choose a blank document or start from a template.' },
  { q: 'How does real-time collaboration work?', a: 'Multiple users can edit the same document simultaneously. Changes are synced instantly via WebSockets and each user sees live cursor positions.' },
  { q: 'How do I share a document?', a: 'Open the document, click the "Share" button in the editor toolbar, and enter the email addresses of collaborators. You can assign Viewer or Editor roles.' },
  { q: 'How do I reset my password?', a: 'Go to the login page and click "Forgot Password". Enter your email and follow the link sent to your inbox.' },
  { q: 'Where can I see version history?', a: 'Inside the editor, click the clock icon in the top toolbar to open Version History. You can restore any previous version.' },
  { q: 'How do I remove a collaborator?', a: 'Open the Share panel, find the collaborator, and click the remove icon next to their name.' },
];

const ISSUE_TYPES = ['Bug / Error', 'Account Issue', 'Collaboration Problem', 'Performance', 'Feature Request', 'Other'];
const AREAS = ['Document Editor', 'Dashboard', 'Authentication', 'Sharing & Permissions', 'Notifications', 'General'];
const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];

function FaqAccordion({ isDark }) {
  const [open, setOpen] = useState(null);
  const [search, setSearch] = useState('');
  const filtered = FAQS.filter(f => f.q.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 h-full transition-colors duration-300 ${isDark ? 'bg-[#070b15] border-[#16223f]' : 'bg-white border-zinc-200 shadow-sm'}`}>
      <h2 className={`font-sans font-bold text-base sm:text-lg mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Frequently Asked Questions</h2>
      <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 mb-5 ${isDark ? 'bg-[#090e1a] border-[#1c2f5d]' : 'bg-slate-50 border-zinc-200'}`}>
        <Search size={14} className={isDark ? 'text-zinc-500' : 'text-zinc-400'} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search FAQs..."
          className={`flex-1 bg-transparent text-sm outline-none ${isDark ? 'text-zinc-200 placeholder-zinc-600' : 'text-zinc-800 placeholder-zinc-400'}`}
        />
      </div>
      <div className="space-y-2">
        {filtered.map((f, i) => (
          <div key={i} className={`rounded-xl border transition-colors duration-200 ${isDark ? 'border-[#1c2f5d] bg-[#090e1a]/60' : 'border-zinc-100 bg-slate-50/60'}`}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className={`w-full flex justify-between items-center px-4 py-3 text-left text-sm font-semibold ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}
            >
              <span className="pr-2">{f.q}</span>
              <ChevronDown size={15} className={`shrink-0 transition-transform ${open === i ? 'rotate-180' : ''} ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
            </button>
            {open === i && (
              <p className={`px-4 pb-3 text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{f.a}</p>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className={`text-sm text-center py-4 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>No results found.</p>}
      </div>
    </div>
  );
}

function ReportForm({ isDark, onSubmitSuccess }) {
  const [form, setForm] = useState({ issueType: '', subject: '', severity: 'Medium', affectedArea: '', description: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    onSubmitSuccess({ id, timestamp, ...form, filesCount: 0 });
    setForm({ issueType: '', subject: '', severity: 'Medium', affectedArea: '', description: '' });
  };

  const inputCls = `w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors duration-200 ${isDark ? 'bg-[#090e1a] border-[#1c2f5d] text-zinc-200 placeholder-zinc-600' : 'bg-slate-50 border-zinc-200 text-zinc-800 placeholder-zinc-400'}`;
  const labelCls = `block text-xs font-semibold mb-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`;

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 transition-colors duration-300 ${isDark ? 'bg-[#070b15] border-[#16223f]' : 'bg-white border-zinc-200 shadow-sm'}`}>
      <h2 className={`font-sans font-bold text-base sm:text-lg mb-5 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Report an Issue</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Issue Type</label>
          <select value={form.issueType} onChange={e => set('issueType', e.target.value)} required className={inputCls}>
            <option value="">Select type...</option>
            {ISSUE_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Subject</label>
          <input value={form.subject} onChange={e => set('subject', e.target.value)} required placeholder="Brief description of the issue" className={inputCls} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Severity</label>
            <select value={form.severity} onChange={e => set('severity', e.target.value)} className={inputCls}>
              {SEVERITIES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Affected Area</label>
            <select value={form.affectedArea} onChange={e => set('affectedArea', e.target.value)} required className={inputCls}>
              <option value="">Select area...</option>
              {AREAS.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}>Description</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} placeholder="Describe the issue in detail..." className={`${inputCls} resize-none`} />
        </div>
        <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors duration-200">
          <Send size={14} />
          Submit Ticket
        </button>
      </form>
    </div>
  );
}

function StillNeedHelp({ isDark }) {
  const navigate = useNavigate();
  return (
    <div className={`rounded-2xl border p-6 sm:p-8 text-center transition-colors duration-300 ${isDark ? 'bg-[#070b15] border-[#16223f]' : 'bg-white border-zinc-200 shadow-sm'}`}>
      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}>
        <Headphones size={22} className="text-indigo-500" />
      </div>
      <h3 className={`font-sans font-bold text-base sm:text-lg mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Still need help?</h3>
      <p className={`text-sm mb-5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Can't find what you're looking for? Our support team is ready to assist you.</p>
      <button onClick={() => navigate('/contact')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors duration-200">
        <MessageSquare size={14} />
        Contact Us
      </button>
    </div>
  );
}

function SubmissionModal({ isOpen, isDark, onClose, ticket }) {
  if (!isOpen || !ticket) return null;
  const severityColor = ticket.severity === 'Critical' ? 'text-red-500 bg-red-500/10' : ticket.severity === 'High' ? 'text-amber-500 bg-amber-500/10' : 'text-blue-500 bg-blue-500/10';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-2xl border p-5 sm:p-6 shadow-2xl transition-colors duration-300 ${isDark ? 'bg-[#070b15] border-[#16223f]' : 'bg-white border-zinc-200'}`}>
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Check size={18} className="text-emerald-500" />
            </div>
            <div>
              <p className={`text-xs font-semibold ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Ticket Created</p>
              <p className={`font-bold font-mono text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}>{ticket.id}</p>
            </div>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors shrink-0 ${isDark ? 'hover:bg-white/5 text-zinc-500' : 'hover:bg-zinc-100 text-zinc-400'}`}><X size={16} /></button>
        </div>
        <div className={`space-y-2 text-sm rounded-xl p-4 ${isDark ? 'bg-[#090e1a]' : 'bg-slate-50'}`}>
          {[['Subject', ticket.subject], ['Issue Type', ticket.issueType], ['Affected Area', ticket.affectedArea], ['Submitted', ticket.timestamp]].map(([label, val]) => (
            <div key={label} className="flex justify-between gap-2">
              <span className={`shrink-0 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{label}</span>
              <span className={`font-medium text-right ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>{val}</span>
            </div>
          ))}
          <div className="flex justify-between gap-2">
            <span className={`shrink-0 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Severity</span>
            <span className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded ${severityColor}`}>{ticket.severity}</span>
          </div>
        </div>
        <p className={`text-xs mt-4 text-center ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Our team will respond within 24 business hours.</p>
      </div>
    </div>
  );
}

export default function HelpPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [ticketsHistory, setTicketsHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('logged-tickets-history')) || []; } catch { return []; }
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleFormSubmit = (ticketDetails) => {
    setTicketsHistory(prev => {
      const updated = [ticketDetails, ...prev];
      localStorage.setItem('logged-tickets-history', JSON.stringify(updated));
      return updated;
    });
    setSelectedTicket(ticketDetails);
    setIsModalOpen(true);
    showToast(`Support Ticket ${ticketDetails.id} created successfully!`);
  };

  const handlePointerMove = (e) => {
    const cards = e.currentTarget.querySelectorAll('.spotlight-card');
    cards.forEach(card => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
    });
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className={`min-h-[calc(100vh-72px)] font-sans relative dot-grid-bg transition-colors duration-300 overflow-x-hidden ${isDark ? 'bg-[#070B14] text-[#E5E7EB]' : 'bg-[#F7FAFF] text-[#081B3A]'}`}
    >
      {/* Gradient glows */}
      <div className="absolute top-1/4 left-1/4 w-[20rem] sm:w-[35rem] h-[20rem] sm:h-[35rem] rounded-full bg-blue-500/10 dark:bg-blue-600/5 blur-3xl pointer-events-none animate-pulse-slow z-0" />
      <div className="absolute top-2/3 right-1/4 w-[18rem] sm:w-[28rem] h-[18rem] sm:h-[28rem] rounded-full bg-indigo-500/10 dark:bg-indigo-600/5 blur-3xl pointer-events-none animate-pulse-slow z-0" />

      {/* Floating icons — desktop only */}
      <div className="absolute top-24 left-[8%] text-blue-500/20 dark:text-white/5 animate-float-slow z-0 pointer-events-none hidden lg:block"><FileText size={44} /></div>
      <div className="absolute top-40 right-[12%] text-violet-500/20 dark:text-white/5 animate-float-medium z-0 pointer-events-none hidden lg:block"><MessageSquare size={40} /></div>
      <div className="absolute bottom-[40%] left-[6%] text-cyan-500/20 dark:text-white/5 animate-float-fast z-0 pointer-events-none hidden lg:block"><Shield size={36} /></div>
      <div className="absolute bottom-[28%] right-[8%] text-blue-500/20 dark:text-white/5 animate-float-slow z-0 pointer-events-none hidden lg:block"><Clock size={38} /></div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-2 sm:pt-4 relative z-10">

        {/* Header */}
        <RevealOnScroll>
          <div className="text-center mb-10 sm:mb-14">
            <h1 className="font-sans font-extrabold tracking-tight text-4xl sm:text-5xl md:text-6xl text-[#0F172A] dark:text-white">
              Need{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0D6EFD] to-indigo-500 dark:from-[#3FA3FF] dark:to-cyan-400">
                Help?
              </span>
            </h1>
            <p className={`max-w-xl mx-auto text-sm sm:text-base mt-4 font-medium leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'}`}>
              Find answers to common questions or report an issue.{' '}
              Our team will get back to you as soon as possible.
            </p>
          </div>
        </RevealOnScroll>

        {/* 2-col grid */}
        <RevealOnScroll>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <ReportForm isDark={isDark} onSubmitSuccess={handleFormSubmit} />
            <FaqAccordion isDark={isDark} />
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <StillNeedHelp isDark={isDark} />
        </RevealOnScroll>

        {/* Ticket history */}
        {ticketsHistory.length > 0 && (
          <div className={`mt-6 sm:mt-8 p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-[#070b15] border-[#16223f]/70' : 'bg-slate-100/60 border-zinc-200'}`}>
            <div className="flex items-center gap-2 mb-3.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shrink-0" />
              <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Session Tickets Log ({ticketsHistory.length})
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ticketsHistory.map((t) => (
                <div
                  key={t.id}
                  onClick={() => { setSelectedTicket(t); setIsModalOpen(true); }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all hover:scale-[1.01] ${isDark ? 'bg-[#090e1a]/60 border-[#1c2f5d] hover:border-indigo-500/60 hover:bg-[#0c142a]' : 'bg-white border-zinc-200 hover:border-indigo-400 hover:shadow-sm'}`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-mono font-bold text-blue-500">{t.id}</span>
                    <span className="text-[10px] text-zinc-500">{t.timestamp}</span>
                  </div>
                  <p className={`font-semibold truncate mb-1 ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>{t.subject}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${t.severity === 'Critical' ? 'bg-red-500/15 text-red-500' : t.severity === 'High' ? 'bg-amber-500/15 text-amber-500' : 'bg-blue-500/15 text-blue-500'}`}>
                      {t.severity}
                    </span>
                    <span className="text-[10px] text-zinc-500 truncate">{t.affectedArea}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-xs sm:text-sm border bg-[#090e1a] text-white border-zinc-800 max-w-[calc(100vw-2rem)]">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-black shrink-0">
            <Check size={12} className="stroke-[3]" />
          </div>
          <p className="font-medium truncate">{toastMessage}</p>
        </div>
      )}

      <SubmissionModal isOpen={isModalOpen} isDark={isDark} onClose={() => setIsModalOpen(false)} ticket={selectedTicket} />
    </div>
  );
}