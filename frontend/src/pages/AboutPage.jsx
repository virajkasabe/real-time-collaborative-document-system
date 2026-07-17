import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Shield, History, Cloud, MessageSquare,
  FileOutput, Target, Heart, Rocket, LayoutDashboard
} from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f4f6fa] dark:bg-[#070B14] font-sans transition-colors duration-300">
      
      {/* SECTION 1: HERO */}
      <section 
        className="py-16 px-4 sm:px-8 md:px-10 text-center"
        style={{ background: 'linear-gradient(135deg, #1a56db 0%, #1e40af 100%)' }}
      >
        <span className="inline-block px-3 py-1 border border-white/30 bg-white/10 text-white text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
          About Us
        </span>
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">
          About Athenura
        </h1>
        <p className="text-white/75 text-base max-w-xl mx-auto mt-4 mb-8">
          A real-time collaborative document system built
          with modern web technologies. Inspired by Google Docs and
          Microsoft Word, Athenura brings teams together with
          instant sync, secure access, and a powerful editor.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-white hover:bg-slate-50 text-[#1a56db] font-semibold px-6 py-2.5 rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <LayoutDashboard size={18} />
          Go to Dashboard
        </button>
      </section>

      {/* SECTION 2: MISSION */}
      <section className="bg-white dark:bg-[#0F172A] py-14 px-4 sm:px-8 md:px-10 transition-colors duration-300">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center">
            <span className="text-[#1a56db] text-xs font-bold uppercase tracking-wider">
              Our Mission
            </span>
            <h2 className="text-[#081b3a] dark:text-white font-bold mt-2 text-xl sm:text-2xl">
              Building the future of collaborative writing
            </h2>
            <p className="text-[#6b7280] dark:text-[#94A3B8] text-sm sm:text-base leading-relaxed mt-4">
              We believe great ideas shouldn't be limited by geography
              or tools. Athenura was built to remove barriers — giving every
              team a real-time canvas where ideas flow freely, edits sync
              instantly, and documents come alive through collaboration.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Card 1 */}
            <div className="bg-[#f9fafb] dark:bg-[#0F172A]/40 border border-[#E5E7EB] dark:border-white/5 rounded-xl p-4 flex items-start gap-3">
              <div className="bg-[#dbeafe] text-[#1a56db] p-2.5 rounded-xl shrink-0">
                <Target size={18} />
              </div>
              <div>
                <h4 className="text-[#081b3a] dark:text-white font-semibold text-sm">
                  Vision
                </h4>
                <p className="text-[#6b7280] dark:text-[#94A3B8] text-xs mt-1">
                  Make collaborative editing as natural as thinking
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#f9fafb] dark:bg-[#0F172A]/40 border border-[#E5E7EB] dark:border-white/5 rounded-xl p-4 flex items-start gap-3">
              <div className="bg-[#d1fae5] text-[#059669] p-2.5 rounded-xl shrink-0">
                <Heart size={18} />
              </div>
              <div>
                <h4 className="text-[#081b3a] dark:text-white font-semibold text-sm">
                  Values
                </h4>
                <p className="text-[#6b7280] dark:text-[#94A3B8] text-xs mt-1">
                  Open collaboration, security first, continuous improvement
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#f9fafb] dark:bg-[#0F172A]/40 border border-[#E5E7EB] dark:border-white/5 rounded-xl p-4 flex items-start gap-3">
              <div className="bg-[#ede9fe] text-[#7c3aed] p-2.5 rounded-xl shrink-0">
                <Rocket size={18} />
              </div>
              <div>
                <h4 className="text-[#081b3a] dark:text-white font-semibold text-sm">
                  Goal
                </h4>
                <p className="text-[#6b7280] dark:text-[#94A3B8] text-xs mt-1">
                  Empower 1M+ teams to collaborate without friction
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <hr className="border-[#E5E7EB] dark:border-white/5" />

      {/* SECTION 3: FEATURES */}
      <section className="bg-[#f4f6fa] dark:bg-[#070B14] py-14 px-4 sm:px-8 md:px-10 transition-colors duration-300">
        <div className="max-w-5xl mx-auto">
          <span className="text-[#1a56db] text-xs font-bold uppercase tracking-wider text-center block">
            What We Built
          </span>
          <h2 className="text-[#081b3a] dark:text-white font-bold text-center mt-2 text-xl sm:text-2xl mb-10">
            Everything your team needs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white dark:bg-[#0F172A]/40 border border-[#E5E7EB] dark:border-white/5 rounded-2xl p-5 hover:border-[#1a56db] dark:hover:border-[#1a56db] transition-colors flex flex-col items-start">
              <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center bg-[#dbeafe] text-[#1a56db]">
                <Users size={20} />
              </div>
              <h3 className="text-[#081b3a] dark:text-white font-bold text-base mb-2">
                Real-Time Collaboration
              </h3>
              <p className="text-[#6b7280] dark:text-[#94A3B8] text-xs leading-relaxed">
                Multiple users edit simultaneously with live cursor indicators and instant sync.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-[#0F172A]/40 border border-[#E5E7EB] dark:border-white/5 rounded-2xl p-5 hover:border-[#1a56db] dark:hover:border-[#1a56db] transition-colors flex flex-col items-start">
              <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center bg-[#d1fae5] text-[#059669]">
                <Shield size={20} />
              </div>
              <h3 className="text-[#081b3a] dark:text-white font-bold text-base mb-2">
                Secure Access Control
              </h3>
              <p className="text-[#6b7280] dark:text-[#94A3B8] text-xs leading-relaxed">
                Role-based permissions — Owner, Editor, Viewer — with JWT authentication.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-[#0F172A]/40 border border-[#E5E7EB] dark:border-white/5 rounded-2xl p-5 hover:border-[#1a56db] dark:hover:border-[#1a56db] transition-colors flex flex-col items-start">
              <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center bg-[#ede9fe] text-[#7c3aed]">
                <History size={20} />
              </div>
              <h3 className="text-[#081b3a] dark:text-white font-bold text-base mb-2">
                Version History
              </h3>
              <p className="text-[#6b7280] dark:text-[#94A3B8] text-xs leading-relaxed">
                Every change tracked. Restore any previous version with one click.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white dark:bg-[#0F172A]/40 border border-[#E5E7EB] dark:border-white/5 rounded-2xl p-5 hover:border-[#1a56db] dark:hover:border-[#1a56db] transition-colors flex flex-col items-start">
              <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center bg-[#fef3c7] text-[#d97706]">
                <Cloud size={20} />
              </div>
              <h3 className="text-[#081b3a] dark:text-white font-bold text-base mb-2">
                Cloud Storage
              </h3>
              <p className="text-[#6b7280] dark:text-[#94A3B8] text-xs leading-relaxed">
                Documents auto-saved to cloud. Access from any device, anywhere.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white dark:bg-[#0F172A]/40 border border-[#E5E7EB] dark:border-white/5 rounded-2xl p-5 hover:border-[#1a56db] dark:hover:border-[#1a56db] transition-colors flex flex-col items-start">
              <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center bg-[#fce7f3] text-[#db2777]">
                <MessageSquare size={20} />
              </div>
              <h3 className="text-[#081b3a] dark:text-white font-bold text-base mb-2">
                Team Chat & Comments
              </h3>
              <p className="text-[#6b7280] dark:text-[#94A3B8] text-xs leading-relaxed">
                Built-in team chat and inline comments keep feedback in context.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-white dark:bg-[#0F172A]/40 border border-[#E5E7EB] dark:border-white/5 rounded-2xl p-5 hover:border-[#1a56db] dark:hover:border-[#1a56db] transition-colors flex flex-col items-start">
              <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center bg-[#ccfbf1] text-[#0d9488]">
                <FileOutput size={20} />
              </div>
              <h3 className="text-[#081b3a] dark:text-white font-bold text-base mb-2">
                Import & Export
              </h3>
              <p className="text-[#6b7280] dark:text-[#94A3B8] text-xs leading-relaxed">
                Import DOCX, PDF, markdown. Export in multiple formats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: STATS */}
      <section className="bg-[#081b3a] py-14 px-4 sm:px-8 md:px-10 text-center">
        <div className="max-w-5xl mx-auto">
          <span className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2 block">
            By The Numbers
          </span>
          <h2 className="text-white text-xl sm:text-2xl font-bold mb-10">
            Trusted by teams worldwide
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stat 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-sm text-white/60">Documents Created</div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-sm text-white/60">Teams Using Athenura</div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-sm text-white/60">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: TECH STACK */}
      <section className="bg-white dark:bg-[#0F172A] py-14 px-4 sm:px-8 md:px-10 transition-colors duration-300">
        <div className="max-w-5xl mx-auto">
          <span className="text-[#1a56db] text-xs font-bold uppercase tracking-wider block mb-2">
            Tech Stack
          </span>
          <h2 className="text-[#081b3a] dark:text-white font-bold text-xl sm:text-2xl mb-8">
            Built with modern technologies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Frontend */}
            <div>
              <h3 className="text-sm font-semibold text-[#081b3a] dark:text-white mb-3">
                Frontend
              </h3>
              <div className="flex flex-wrap">
                {[
                  'React 18', 'Tailwind CSS', 'Quill.js',
                  'Socket.IO Client', 'React Router v6', 'Lucide React'
                ].map((tech) => (
                  <span 
                    key={tech} 
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#dbeafe] text-[#1a56db] rounded-full text-xs font-medium m-1"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Backend */}
            <div>
              <h3 className="text-sm font-semibold text-[#081b3a] dark:text-white mb-3">
                Backend
              </h3>
              <div className="flex flex-wrap">
                {[
                  'Node.js', 'Express.js', 'MongoDB',
                  'Socket.IO', 'JWT Auth', 'Google OAuth'
                ].map((tech) => (
                  <span 
                    key={tech} 
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#d1fae5] text-[#059669] rounded-full text-xs font-medium m-1"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: CTA BANNER */}
      <section 
        className="bg-gradient-to-br from-[#1a56db] to-[#1e40af] mx-4 sm:mx-8 mb-10 rounded-2xl py-14 px-4 sm:px-8 md:px-10 text-center"
      >
        <h2 className="text-white text-2xl font-bold">
          Ready to start collaborating?
        </h2>
        <p className="text-white/75 text-sm mt-2 mb-6">
          Join thousands of teams already using Athenura to work smarter together.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="bg-white hover:bg-slate-50 text-[#1a56db] font-semibold px-7 py-2.5 rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-md transition-all"
        >
          <Rocket size={16} />
          Start Free Today
        </button>
      </section>
    </div>
  );
}
