import React, { useState } from 'react';
import { FiUser, FiLock, FiEye, FiEyeOff, 
         FiUsers, FiShield, FiCloud, FiClock } from 'react-icons/fi';
import { HiOutlineMail } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import bgImage from '../../assets/collab-bg.png';
import athenuraLogo from "../../assets/athenura-logo.png";
import { useTheme } from "../../context/ThemeContext";
import { LocalStorage } from '../../apis';
import { googleLoginApi } from '../../apis/api';

export default function RegisterPage() {
  const { register, login, triggerToast } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');
  const navigate = useNavigate();

  // State variables matching requirements exactly
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    let errs = {};

    // Validation checks
    if (!fullName.trim()) {
      errs.fullName = 'Full Name is required';
    }

    if (!email.trim()) {
      errs.email = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!agreedToTerms) {
      errs.agreedToTerms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    // Call register(email, name, password) matching AuthContext signature
    const res = await register(email.trim(), fullName.trim(), password);
    
    const { token } = res.data
    setLoading(false);

    if (res.success === true) {
      navigate('/verify-email', { state: { email: email, token } });
    }
  };

   const handleGoogleSignup = () => {
         LocalStorage.set("googleAuthReturnUrl", window.location.pathname);
   
         const baseApi = import.meta.env.VITE_GOOGLE_CALLBACK_URL || googleLoginApi;
   
         window.location.assign(baseApi);
       };

  return (
    <div className="h-screen w-full overflow-hidden flex items-center justify-center bg-[#EEF2F7] dark:bg-[#070B14] p-4 md:p-6 font-sans select-none">
      {/* Outer Card: rounded-2xl shadow-xl centered on page */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row h-[94vh] max-h-[860px] overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-[#0F172A]/95">
        
        {/* LEFT PANEL: ~45% width, light blue gradient background, hidden on mobile */}
        <div className="hidden md:flex w-[45%] flex-col justify-between p-8 bg-gradient-to-br from-[#D6E8FF] to-[#C2DBFF] dark:from-[#131B2E] dark:to-[#0A0D18] relative overflow-hidden self-stretch border-r border-slate-200/40 dark:border-slate-800/40">
          
          {/* Decorative Background Assets */}
          <div 
            className="absolute top-4 right-4 w-20 h-20 opacity-20 pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#64748B 1.5px, transparent 1.5px)', backgroundSize: '10px 10px' }} 
          />
          <div 
            className="absolute bottom-4 left-4 w-20 h-20 opacity-20 pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#64748B 1.5px, transparent 1.5px)', backgroundSize: '10px 10px' }} 
          />

          {/* White cloud shapes floating in mid-background */}
          <div className="absolute top-16 left-[15%] w-24 h-8 bg-white/40 dark:bg-white/5 rounded-full blur-[2px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute top-20 left-[35%] w-16 h-6 bg-white/30 dark:bg-white/5 rounded-full blur-[1px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/3 right-[12%] w-28 h-9 bg-white/40 dark:bg-white/5 rounded-full blur-[3px] pointer-events-none animate-pulse" style={{ animationDuration: '7s' }} />

          {/* Top-Left Logo */}
          <div className="flex flex-col gap-1.5 relative z-10 shrink-0">
            <div className="flex items-center gap-2.5">
              <img 
                src={athenuraLogo}
                alt="Athenura"
                className="h-10 w-auto object-contain"
                style={{ 
                  maxWidth: '160px',
                  filter: isDark ? 'brightness(10)' : 'brightness(0.2)',
                  opacity: '0.95'
                }}
              />
            </div>
            <div className="w-10 h-[3px] bg-blue-500 rounded-full" />
          </div>

          {/* Headline & Subtext */}
          <div className="text-left mt-3 relative z-10 shrink-0">
            <h2 className="text-2xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-snug">
              Real-Time Collaborative Document System
            </h2>
            <p className="text-sm text-[#64748B] dark:text-slate-350 mt-2 font-normal leading-relaxed">
              Create, edit and collaborate on documents<br />
              in real-time with secure access control.
            </p>
          </div>

          {/* Feature List (4 items, vertical, with original styling) */}
          <div className="flex flex-col gap-3.5 my-3 relative z-10 shrink-0">
            {[
              { icon: FiUsers, title: 'Real-Time Collaboration', subtitle: 'Work together with your team instantly' },
              { icon: FiShield, title: 'Secure & Private', subtitle: 'JWT authentication & role-based security' },
              { icon: FiCloud, title: 'Cloud Based', subtitle: 'Access your documents from anywhere' },
              { icon: FiClock, title: 'Version History', subtitle: 'Track changes and restore previous versions' }
            ].map((item, idx) => (
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

          {/* Illustration (bottom of panel) */}
          <div className="relative flex justify-center items-end mt-2 pt-2 max-h-[180px] overflow-hidden z-10 flex-1">
            {/* Mockup Image */}
            <img
              src={bgImage}
              alt="collaboration mockup"
              className="w-[45%] object-contain drop-shadow-lg z-10 transition-transform duration-300 hover:scale-[1.02]"
            />
            
            {/* Dashed Curved Path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none text-blue-400/30 z-0" fill="none" viewBox="0 0 280 180">
              <path d="M 30 140 Q 110 30 190 100 T 260 20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 3" />
            </svg>

            {/* Floating Paper Plane Icon */}
            <div className="absolute top-2 right-[28%] text-[#2563EB] z-10 animate-bounce" style={{ animationDuration: '4.5s' }}>
              <svg className="w-5 h-5 transform rotate-[15deg]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </div>

            {/* Badges */}
            {/* Editing Badge */}
            <div className="absolute bottom-4 left-[10%] bg-white/95 backdrop-blur-sm px-2 py-1 rounded-xl shadow-md border border-slate-200/50 flex items-center gap-1.5 z-20 animate-bounce" style={{ animationDuration: '3.8s' }}>
              <div className="w-4.5 h-4.5 rounded-full bg-amber-400 text-white font-bold text-[9px] flex items-center justify-center shadow-inner aspect-square px-1">
                E
              </div>
              <span className="text-[9px] font-bold text-slate-700 whitespace-nowrap">Editing...</span>
            </div>

            {/* Commenting Badge */}
            <div className="absolute top-1/4 right-[12%] bg-white/95 backdrop-blur-sm px-2 py-1 rounded-xl shadow-md border border-slate-200/50 flex items-center gap-1.5 z-20 animate-bounce" style={{ animationDuration: '4.2s' }}>
              <div className="w-4.5 h-4.5 rounded-full bg-emerald-500 text-white font-bold text-[9px] flex items-center justify-center shadow-inner aspect-square px-1">
                C
              </div>
              <span className="text-[9px] font-bold text-slate-700 whitespace-nowrap">Commenting...</span>
            </div>

            {/* Viewing Badge */}
            <div className="absolute bottom-5 right-[12%] bg-white/95 backdrop-blur-sm px-2 py-1 rounded-xl shadow-md border border-slate-200/50 flex items-center gap-1.5 z-20 animate-bounce" style={{ animationDuration: '3.5s' }}>
              <div className="w-4.5 h-4.5 rounded-full bg-purple-500 text-white font-bold text-[9px] flex items-center justify-center shadow-inner aspect-square px-1">
                V
              </div>
              <span className="text-[9px] font-bold text-slate-700 whitespace-nowrap">Viewing...</span>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: ~55% width, white/dark background, overflow-hidden p-6 */}
        <div className="w-full md:w-[55%] bg-white dark:bg-[#0E1524] flex flex-col justify-center p-6 relative overflow-hidden self-stretch">
          
          {/* Subtle Dot Grid: Top-Right */}
          <div 
            className="absolute top-4 right-4 w-20 h-20 opacity-[0.04] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#64748B 1.5px, transparent 1.5px)', backgroundSize: '8px 8px' }} 
          />

          <div className="w-full max-w-[360px] mx-auto flex flex-col justify-center h-full overflow-hidden select-text">
            
            {/* Header: Title + Subtitle */}
            <div className="text-center mb-3 shrink-0">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Create Your Account
              </h1>
              <p className="text-xs text-slate-550 dark:text-slate-400 mt-1 font-medium">
                Join CollabDocs and start collaborating
              </p>
            </div>

            {/* Form fields */}
            <form onSubmit={handleRegister} className="space-y-2 shrink-0">
              
              {/* Full Name */}
              <div className="space-y-1 text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg z-10" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full h-9 bg-slate-50 dark:bg-slate-800/30 border ${
                      errors.fullName ? 'border-red-500 focus:ring-red-400/20' : 'border-slate-200 dark:border-slate-700/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } rounded-lg pl-10 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all font-medium text-xs`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-[11px] font-semibold mt-0.5">{errors.fullName}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1 text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Email Address
                </label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg z-10" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full h-9 bg-slate-50 dark:bg-slate-800/30 border ${
                      errors.email ? 'border-red-500 focus:ring-red-400/20' : 'border-slate-200 dark:border-slate-700/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } rounded-lg pl-10 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all font-medium text-xs`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-[11px] font-semibold mt-0.5">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1 text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg z-10" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full h-9 bg-slate-50 dark:bg-slate-800/30 border ${
                      errors.password ? 'border-red-500 focus:ring-red-400/20' : 'border-slate-200 dark:border-slate-700/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } rounded-lg pl-10 pr-10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all font-medium text-xs`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer focus:outline-none hover:text-slate-650 dark:hover:text-white transition duration-150 z-10"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0 font-normal">
                  At least 8 characters with letter, number & symbol
                </p>
                {errors.password && (
                  <p className="text-red-500 text-[11px] font-semibold mt-0.5">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1 text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg z-10" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full h-9 bg-slate-50 dark:bg-slate-800/30 border ${
                      errors.confirmPassword ? 'border-red-500 focus:ring-red-400/20' : 'border-slate-200 dark:border-slate-700/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } rounded-lg pl-10 pr-10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all font-medium text-xs`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer focus:outline-none hover:text-slate-650 dark:hover:text-white transition duration-150 z-10"
                  >
                    {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-[11px] font-semibold mt-0.5">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start gap-2.5 my-1 py-0 text-left">
                <input
                  type="checkbox"
                  id="agreedToTerms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-4.5 h-4.5 rounded text-blue-600 border-gray-300 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                />
                <label htmlFor="agreedToTerms" className="text-xs text-slate-500 dark:text-slate-400 cursor-pointer select-none leading-normal">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreedToTerms && (
                <p className="text-red-500 text-[11px] font-semibold mt-0.5">{errors.agreedToTerms}</p>
              )}

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-9 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-2"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              {/* OR CONTINUE WITH Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="h-[1px] bg-slate-200 dark:bg-slate-800/80 flex-1"></div>
                <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold tracking-wider whitespace-nowrap">
                  OR CONTINUE WITH
                </span>
                <div className="h-[1px] bg-slate-200 dark:bg-slate-800/80 flex-1"></div>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={loading}
                className="w-full h-9 border border-slate-200 dark:border-slate-700/60 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 active:bg-slate-200/50 dark:active:bg-slate-850 text-slate-700 dark:text-slate-300 font-semibold text-xs flex justify-center items-center gap-2.5 cursor-pointer transition-all"
              >
                <FcGoogle size={18} />
                Continue with Google
              </button>

              {/* Sign In Link */}
              <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  Sign In
                </Link>
              </p>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}