import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import athenuraLogo from '../../assets/athenura-logo.png';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { HiOutlineMail } from 'react-icons/hi';
import { FiShield, FiUsers, FiKey, FiClock, FiArrowLeft, FiAlertCircle, FiCheckCircle, FiLock } from 'react-icons/fi';

const FEATURES = [
  { icon: FiUsers,  title: 'Real-Time Collaboration', subtitle: 'Work together with your team instantly' },
  { icon: FiShield, title: 'Secure & Private',         subtitle: 'JWT authentication & role-based security' },
  { icon: FiKey,    title: 'Role-Based Access',         subtitle: 'Admin, Editor, and Viewer permissions' },
  { icon: FiClock,  title: 'Version History',           subtitle: 'Track changes and restore previous versions' },
];

export default function EmailVerificationPage() {
  const { triggerToast, verifyEmail, error, verifyEmailRequest } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');
  const navigate = useNavigate();
  const location = useLocation();
  const params   = useParams();

  const parts = location.pathname.split('/');
  const email = params.email || (parts[2] || '').replace('email=', '') || '';
  const token = params.token || (parts[3] || '').replace('token=', '') || '';

  const [otp, setOtp]                         = useState(['', '', '', '', '', '']);
  const [loading, setLoading]                 = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  const [resendCooldown, setResendCooldown]   = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => { setVerificationError(null); }, [otp]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleChange = (el, idx) => {
    const val = el.value.replace(/[^0-9a-zA-Z]/g, '');
    if (!val) { const n = [...otp]; n[idx] = ''; setOtp(n); return; }
    const n = [...otp]; n[idx] = val.slice(-1); setOtp(n);
    if (idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      if (!otp[idx] && idx > 0) {
        const n = [...otp]; n[idx - 1] = ''; setOtp(n);
        inputRefs.current[idx - 1]?.focus();
      } else {
        const n = [...otp]; n[idx] = ''; setOtp(n);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/[^0-9a-zA-Z]/g, '').slice(0, 6);
    if (text.length === 6) { setOtp(text.split('')); inputRefs.current[5]?.focus(); }
    else triggerToast('Please paste a 6-character code', 'warning');
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { triggerToast('Please enter the full 6-digit code', 'warning'); return; }
    setLoading(true); setVerificationError(null);
    try {
      const result = await verifyEmail(email, code, token);
      if (result.success) {
        triggerToast('Email verified successfully!', 'success');
        navigate('/dashboard');
      } else {
        const msg = result.error || 'Invalid code. Please try again.';
        setVerificationError(msg);
        triggerToast(msg, 'error');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      const msg = err.message || 'Verification failed. Please try again.';
      setVerificationError(msg);
      triggerToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    await verifyEmailRequest(email);
    triggerToast('New code sent to ' + email, 'success');
    setOtp(['', '', '', '', '', '']);
    setVerificationError(null);
    setResendCooldown(60);
    inputRefs.current[0]?.focus();
  };

  const allFilled = otp.every(d => d !== '');

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
              Verify Your Email Address
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 font-normal leading-relaxed">
              Enter the 6-digit verification code<br />to complete your registration.
            </p>
          </div>

          {/* OTP illustration card */}
          <div className="relative flex justify-center items-center mt-4 flex-1 z-10 overflow-hidden max-h-[180px]">
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/30 shadow-md p-5 w-fit">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 text-center mb-3">
                Verification Code
              </p>
              <div className="flex gap-2">
                {['A', '7', 'K', '3', 'X', '9'].map((d, i) => (
                  <div key={i}
                    className="w-9 h-10 bg-blue-500/10 dark:bg-blue-400/10 rounded-lg border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-center text-[#2563EB] dark:text-blue-400 font-bold text-base">
                    {d}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <p className="text-green-600 dark:text-green-400 text-[10px] font-semibold">Code verified</p>
              </div>
            </div>
          </div>

          {/* Feature list */}
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

            {/* Icon */}
            <div className="relative w-16 h-16 bg-blue-500/10 dark:bg-blue-400/10 rounded-full flex items-center justify-center mx-auto mb-3 shrink-0">
              <HiOutlineMail className="text-[#2563EB] dark:text-blue-400 text-2xl" />
              <FiLock className="text-[#2563EB] dark:text-blue-400 text-[10px] absolute -bottom-0.5 -right-0.5 bg-white dark:bg-[#0E1524] rounded-full p-0.5 shadow-sm border border-slate-100 dark:border-slate-700" />
            </div>

            {/* Heading */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Email Verification
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                Enter the 6-digit code sent to<br />
                <span className="font-semibold text-[#2563EB] dark:text-blue-400">{email || 'your email'}</span>
              </p>
            </div>

            {/* Error */}
            {(verificationError || error) && (
              <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                <FiAlertCircle className="text-red-500 flex-shrink-0 mt-0.5 text-sm" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  {verificationError || error?.message || error}
                </p>
              </div>
            )}

            <form onSubmit={handleVerify} className="shrink-0">
              {/* OTP boxes */}
              <div className="flex justify-center gap-2 mb-5" onPaste={handlePaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => (inputRefs.current[idx] = el)}
                    maxLength={1}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={e => handleChange(e.target, idx)}
                    onKeyDown={e => handleKeyDown(e, idx)}
                    disabled={loading}
                    style={{ width: '46px', height: '52px' }}
                    className={`rounded-lg border-2 text-center text-lg font-bold transition-all duration-200 outline-none
                      bg-slate-50 dark:bg-slate-800/30
                      text-slate-900 dark:text-white
                      disabled:opacity-50
                      ${digit
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-[#2563EB] dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-700/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }`}
                  />
                ))}
              </div>

              {/* Verify button */}
              <button
                type="submit"
                disabled={loading || !allFilled}
                className="w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Verifying…</>
                  : <><FiCheckCircle className="text-base" /> Verify Code</>}
              </button>
            </form>

            {/* Back + Resend */}
            <Link to="/login"
              className="text-[#2563EB] dark:text-blue-400 font-semibold text-sm mt-3 flex items-center justify-center gap-1 hover:underline cursor-pointer shrink-0">
              <FiArrowLeft className="text-lg" /> Back to Login
            </Link>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium shrink-0">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={loading || resendCooldown > 0}
                className="text-[#2563EB] dark:text-blue-400 font-bold hover:underline focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
