import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMail } from 'react-icons/hi';
import athenuraLogo from '../../assets/athenura-logo.png';
import forgotPasswordImage from '../../assets/forgot-password.png';
import { useTheme } from '../../context/ThemeContext';
import {
  FiLock, FiSend, FiShield, FiUsers,
  FiClock, FiRefreshCw, FiCheck, FiArrowLeft, FiAlertCircle
} from 'react-icons/fi';
import { userForgetPasswordRequest } from '../../apis/api';

const FEATURES = [
  { icon: FiShield,    title: 'Secure & Private',      subtitle: 'JWT authentication & role-based security' },
  { icon: FiUsers,     title: 'Role-Based Access',      subtitle: 'Admin, Editor, and Viewer permissions' },
  { icon: FiRefreshCw, title: 'Real-Time Sync',         subtitle: 'Live collaboration across your team' },
  { icon: FiClock,     title: 'Version History',        subtitle: 'Track changes and restore previous versions' },
];

export default function ForgotPasswordPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const val = email.trim();
    if (!val) return setError('Email address is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return setError('Please enter a valid email address');
    setLoading(true);
    try {
      await userForgetPasswordRequest({ email: val });
      setSent(true);
    } catch {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
      setEmail('');
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden flex items-center justify-center bg-[#EEF2F7] dark:bg-[#070B14] p-4 font-sans select-none">

      <div className="w-full max-w-5xl flex flex-row h-[92vh] max-h-[820px] rounded-2xl shadow-2xl shadow-blue-900/5 dark:shadow-black/50 overflow-hidden bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50">

        {/* ── LEFT PANEL ── */}
        <div className="hidden md:flex w-1/2 flex-col justify-between overflow-hidden p-8 bg-gradient-to-br from-[#F4F8FD] to-[#E5EFFE] dark:from-[#131B2E] dark:to-[#0A0D18] relative self-stretch border-r border-slate-200/40 dark:border-slate-800/40">

          {/* Dot grids */}
          <div className="absolute top-4 right-4 w-24 h-24 opacity-[0.05] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#64748B 1.5px, transparent 1.5px)', backgroundSize: '10px 10px' }} />
          <div className="absolute bottom-4 left-4 w-24 h-24 opacity-[0.05] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#64748B 1.5px, transparent 1.5px)', backgroundSize: '10px 10px' }} />

          {/* Soft cloud blobs */}
          <div className="absolute top-12 left-1/4 w-32 h-8 bg-white/30 dark:bg-white/5 rounded-full blur-sm pointer-events-none" />
          <div className="absolute bottom-1/3 right-10 w-24 h-6 bg-white/20 dark:bg-white/5 rounded-full blur-sm pointer-events-none" />

          {/* Logo */}
          <div className="flex flex-col gap-1 relative z-10 shrink-0">
            <img src={athenuraLogo} alt="Athenura"
              className="h-10 w-auto object-contain"
              style={{ maxWidth: '160px', filter: isDark ? 'brightness(10)' : 'brightness(0.2)', opacity: 0.95 }} />
            <div className="w-10 h-[3px] bg-blue-500 rounded-full mt-1" />
          </div>

          {/* Headline */}
          <div className="text-left mt-2 relative z-10 shrink-0">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
              Reset Your Password
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 font-normal leading-relaxed">
              Enter your email address and we'll send you<br />
              a link to reset your password.
            </p>
          </div>

          {/* Image illustration */}
          <div className="relative flex justify-center items-end mt-4 pt-4 max-h-[200px] overflow-hidden z-10 flex-1">
            <img
              src={forgotPasswordImage}
              alt="Forgot password"
              className="w-[55%] object-contain drop-shadow-md z-10 transition-transform duration-300 hover:scale-[1.02]"
            />

            {/* Floating send icon */}
            <div className="absolute top-2 right-[28%] text-[#2563EB] z-10 animate-bounce" style={{ animationDuration: '4s' }}>
              <FiSend className="w-4 h-4 transform rotate-12" />
            </div>

            {/* Email badge */}
            <div className="absolute top-1/4 left-[18%] bg-blue-600/90 dark:bg-blue-500/80 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-lg border border-white/10 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              Reset link sent
            </div>

            {/* Lock badge */}
            <div className="absolute bottom-6 right-[18%] bg-white/95 dark:bg-[#131B2E]/95 backdrop-blur-sm px-2 py-1 rounded-xl shadow-md border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-1.5 z-20">
              <div className="w-4 h-4 rounded-full bg-[#2563EB] flex items-center justify-center">
                <FiLock className="text-white text-[8px]" />
              </div>
              <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">Secure link</span>
            </div>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 relative z-10 shrink-0">
            {FEATURES.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-left">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center shrink-0">
                  <item.icon className="text-[#2563EB] dark:text-blue-400 text-sm" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="w-full md:w-1/2 bg-white dark:bg-[#0E1524] flex flex-col justify-center overflow-hidden p-8 relative self-stretch">

          <div className="absolute top-4 right-4 w-20 h-20 opacity-[0.05] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#64748B 1.5px, transparent 1.5px)', backgroundSize: '8px 8px' }} />

          <div className="w-full max-w-[360px] mx-auto flex flex-col justify-center h-full select-text">

            {!sent ? (
              <>
                {/* Icon */}
                <div className="relative w-20 h-20 bg-blue-500/10 dark:bg-blue-400/10 rounded-full flex items-center justify-center mx-auto mb-4 shrink-0">
                  {/* decorative plus marks */}
                  <span className="absolute -top-3 left-4 text-blue-300 dark:text-blue-700 text-xl font-light select-none">+</span>
                  <span className="absolute -top-3 right-4 text-blue-300 dark:text-blue-700 text-xl font-light select-none">+</span>
                  <span className="absolute -bottom-3 left-4 text-blue-300 dark:text-blue-700 text-xl font-light select-none">+</span>
                  <span className="absolute -bottom-3 right-4 text-blue-300 dark:text-blue-700 text-xl font-light select-none">+</span>
                  <div className="relative flex items-center justify-center">
                    <HiOutlineMail className="text-[#2563EB] dark:text-blue-400 text-4xl" />
                    <FiLock className="text-[#2563EB] dark:text-blue-400 text-xs absolute -bottom-1 -right-1 bg-white dark:bg-[#0E1524] rounded-full p-[3px] shadow-sm border border-slate-100 dark:border-slate-700" />
                  </div>
                </div>

                {/* Heading */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Forgot Password?
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-normal leading-relaxed">
                    No worries! Enter your email and we'll send you<br />instructions to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Email field */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="fp-email" className="text-sm font-semibold text-[#0F172A] dark:text-gray-200 block">
                      Email Address
                    </label>
                    <div className="relative">
                      <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl z-10" />
                      <input
                        id="fp-email"
                        type="email"
                        autoComplete="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        className={`w-full h-12 text-sm bg-white dark:bg-gray-700 border ${
                          error
                            ? 'border-red-500 focus:ring-red-400/20'
                            : 'border-gray-200 dark:border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                        } rounded-xl pl-12 pr-4 text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none transition-all text-sm font-medium`}
                      />
                    </div>
                    {error && (
                      <p className="text-red-500 text-xs mt-1.5 font-semibold flex items-center gap-1">
                        <FiAlertCircle size={11} /> {error}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl mt-4 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/10 hover:shadow-blue-500/20">
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</>
                      : <><FiSend className="text-lg" /> Send Reset Link</>}
                  </button>
                </form>

                <Link to="/login"
                  className="text-[#2563EB] dark:text-blue-400 font-semibold text-sm mt-4 flex items-center justify-center gap-1 hover:underline cursor-pointer">
                  <FiArrowLeft className="text-lg" /> Back to Login
                </Link>
              </>
            ) : (
              /* ── Success state ── */
              <div className="text-center py-6 animate-fade-in">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/35 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheck className="text-green-500 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Email Sent!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Check your inbox for reset instructions.
                </p>
                <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 text-left">
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                    ⏱ The link expires in <strong>1 hour</strong>. Check your spam folder if you don't see it.
                  </p>
                </div>
                <Link to="/login"
                  className="mt-5 inline-flex items-center gap-1 text-[#2563EB] dark:text-blue-400 font-semibold text-sm hover:underline">
                  <FiArrowLeft size={14} /> Back to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
