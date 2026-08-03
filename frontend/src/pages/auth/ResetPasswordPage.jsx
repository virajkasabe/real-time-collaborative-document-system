import { useState } from 'react';
import { Link, useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import athenuraLogo from '../../assets/athenura-logo.png';
import {
  FiLock, FiEye, FiEyeOff, FiShield,
  FiCheckCircle, FiCircle, FiCheck, FiArrowLeft, FiAlertCircle
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { userForgetPassword } from '../../apis/api';

const REQUIREMENTS = (pwd) => [
  { label: 'At least 8 characters',         met: pwd.length >= 8 },
  { label: 'Uppercase & lowercase letters',  met: /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) },
  { label: 'At least one number',            met: /[0-9]/.test(pwd) },
  { label: 'At least one special character', met: /[^A-Za-z0-9]/.test(pwd) },
];

const getStrength = (pwd) => {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
};

const STRENGTH_META = [
  { label: '',       color: 'bg-slate-200 dark:bg-slate-700' },
  { label: 'Weak',   color: 'bg-red-400' },
  { label: 'Fair',   color: 'bg-orange-400' },
  { label: 'Good',   color: 'bg-yellow-400' },
  { label: 'Strong', color: 'bg-green-500' },
];

export default function ResetPasswordPage() {
  const { triggerToast } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');
  const param = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const email = location.state?.email || searchParams.get('email') || '';

  const [password, setPassword]       = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(false);
  const [errors, setErrors]           = useState({});

  const strength  = getStrength(password);
  const reqs      = REQUIREMENTS(password);
  const canSubmit = password && confirmPassword && password === confirmPassword && strength >= 2;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const errs = {};
    if (!password) errs.password = 'Password is required';
    else if (!reqs.every(r => r.met)) errs.password = 'Password does not meet all requirements';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length) {
      setErrors(errs);
      triggerToast(errs.password || errs.confirmPassword, 'warning');
      return;
    }
    setLoading(true);
    const result = await userForgetPassword(param, { newPassword: password, unHashedToken: param });
    setLoading(false);
    if (result) {
      setSuccess(true);
      triggerToast('Password updated successfully!', 'success');
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
              Set a New Password
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 font-normal leading-relaxed">
              Create a strong password to keep your<br />account and documents safe.
            </p>
          </div>

          {/* Padlock illustration */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden my-2 z-10">
            <div className="absolute w-48 h-48 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex flex-col items-center z-10">
              {/* Shackle */}
              <div className="w-14 h-9 border-[7px] border-[#2563EB]/70 dark:border-blue-400/70 rounded-t-full bg-transparent mx-auto -mb-1" />
              {/* Body */}
              <div className="w-36 h-28 bg-gradient-to-b from-[#3B8EEF] to-[#2563EB] rounded-2xl shadow-xl shadow-blue-400/30 flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-2 left-3 w-5 h-14 bg-white/10 rounded-full -rotate-12" />
                <div className="w-10 h-10 bg-[#1D4ED8]/60 rounded-full flex items-center justify-center">
                  <div className="w-4 h-5 bg-[#1E40AF] rounded-b-full rounded-t-full" />
                </div>
              </div>
              {/* Password dots card */}
              <div className="absolute -bottom-4 -left-10 bg-white dark:bg-[#0F172A] rounded-xl shadow-lg px-4 py-2 flex items-center gap-2 border border-slate-200 dark:border-slate-700">
                <span className="text-[#2563EB] text-sm font-bold tracking-widest">✱ ✱ ✱ ✱</span>
              </div>
              {/* Shield badge */}
              <div className="absolute -top-2 -right-10 w-11 h-11 bg-gradient-to-br from-[#3B9EFF] to-[#2563EB] rounded-xl shadow-md flex items-center justify-center">
                <FiShield className="text-white text-lg" />
              </div>
            </div>
          </div>

          {/* Security tip card */}
          <div className="flex items-start gap-3 bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 mt-4 relative z-10 shrink-0 border border-slate-200/40 dark:border-slate-700/30">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center flex-shrink-0">
              <FiShield className="text-[#2563EB] dark:text-blue-400 text-base" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white">Your security is our priority</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Use a password you don't use on any other site.
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="w-full md:w-1/2 bg-white dark:bg-[#0E1524] flex flex-col justify-center overflow-hidden p-8 relative self-stretch">

          <div className="absolute top-4 right-4 w-20 h-20 opacity-[0.05] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#64748B 1.5px, transparent 1.5px)', backgroundSize: '8px 8px' }} />

          <div className="w-full max-w-[360px] mx-auto flex flex-col justify-center h-full select-text">

            {!success ? (
              <>
                {/* Icon */}
                <div className="relative w-16 h-16 bg-blue-500/10 dark:bg-blue-400/10 rounded-full flex items-center justify-center mx-auto mb-4 shrink-0">
                  <FiLock className="text-[#2563EB] dark:text-blue-400 text-2xl" />
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#0E1524] rounded-full p-1 shadow-sm border border-slate-100 dark:border-slate-700">
                    <FiShield className="text-[#2563EB] dark:text-blue-400 text-xs" />
                  </div>
                </div>

                {/* Heading */}
                <div className="text-center mb-5">
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Set New Password
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    Create a strong password for your account
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 text-left">

                  {/* New password */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-[#0F172A] dark:text-gray-200 block">
                      New Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg z-10" />
                      <input
                        type={showPwd ? 'text' : 'password'}
                        placeholder="Enter new password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className={`w-full h-10 text-sm bg-slate-50 dark:bg-slate-800/30 border ${
                          errors.password
                            ? 'border-red-500 focus:ring-red-400/20'
                            : 'border-slate-200 dark:border-slate-700/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        } rounded-lg pl-10 pr-10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all font-medium`}
                      />
                      <button type="button" onClick={() => setShowPwd(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer focus:outline-none hover:text-slate-600 dark:hover:text-white transition duration-150 z-10">
                        {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>

                    {/* Strength bar */}
                    {password.length > 0 && (
                      <div className="mt-1.5">
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4].map(lvl => (
                            <div key={lvl}
                              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                strength >= lvl ? STRENGTH_META[strength].color : 'bg-slate-200 dark:bg-slate-700'
                              }`} />
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Strength:{' '}
                          <span className={`font-semibold ${
                            strength === 1 ? 'text-red-500' :
                            strength === 2 ? 'text-orange-500' :
                            strength === 3 ? 'text-yellow-500' :
                            strength === 4 ? 'text-green-500' : ''}`}>
                            {STRENGTH_META[strength].label}
                          </span>
                        </p>
                      </div>
                    )}
                    {errors.password && (
                      <p className="text-red-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
                        <FiAlertCircle size={11} /> {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-[#0F172A] dark:text-gray-200 block">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg z-10" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className={`w-full h-10 text-sm bg-slate-50 dark:bg-slate-800/30 border ${
                          errors.confirmPassword
                            ? 'border-red-500 focus:ring-red-400/20'
                            : 'border-slate-200 dark:border-slate-700/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        } rounded-lg pl-10 pr-10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all font-medium`}
                      />
                      <button type="button" onClick={() => setShowConfirm(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer focus:outline-none hover:text-slate-600 dark:hover:text-white transition duration-150 z-10">
                        {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
                        <FiAlertCircle size={11} /> {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Requirements */}
                  <div className="space-y-1 mt-1">
                    {reqs.map((req, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {req.met
                          ? <FiCheckCircle className="text-green-500 flex-shrink-0 text-sm" />
                          : <FiCircle className="text-slate-300 dark:text-slate-600 flex-shrink-0 text-sm" />}
                        <span className={`text-xs ${req.met ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || !canSubmit}
                    className="w-full h-10 rounded-lg mt-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Updating…</>
                      : <><FiLock size={14} /> Update Password</>}
                  </button>

                  <Link to="/login"
                    className="text-blue-600 dark:text-blue-400 font-semibold text-sm flex items-center justify-center gap-1 mt-2 hover:underline cursor-pointer">
                    <FiArrowLeft className="text-lg" /> Back to Login
                  </Link>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/35 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiCheck className="text-green-500 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Password Updated!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Your password has been successfully reset.<br />
                  You can now sign in with your new password.
                </p>
                <Link to="/login"
                  className="mt-4 inline-flex items-center justify-center gap-2 w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm cursor-pointer transition-all shadow-md shadow-blue-500/10">
                  Sign In Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
