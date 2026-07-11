import React, { useState, useEffect } from 'react';
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { FiLock, FiEye, FiEyeOff, FiUsers, FiShield, FiClock, FiUserCheck } from "react-icons/fi";
import bgImage from "../../assets/collab-bg.png";
import { useAuth } from "../../context/AuthContext";
import athenuraLogo from "../../assets/athenura-logo.png";
import { useTheme } from "../../context/ThemeContext";
import { LocalStorage } from '../../apis';
import { googleLoginApi } from '../../apis/api';

export default function LoginPage() {
  const { login, triggerToast, error: authError } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    let errs = {};

    if (!email.trim()) errs.email = 'Email address is required';
    if (!password) errs.password = 'Password is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    const res = await login(email.trim(), password);

    if (res?.success === false) {
      setErrors({ 
        general: res.message || 'Login failed. Please try again.' 
      });
    }

    setLoading(false);

    if (res?.success) {
      navigate('/dashboard');
    }

      setEmail("")
      setPassword("")
  };

  const handleGoogleLogin = () => {
    LocalStorage.set("googleAuthReturnUrl", window.location.pathname);
    const baseApi = import.meta.env.VITE_GOOGLE_CALLBACK_URL || googleLoginApi;
    window.location.assign(baseApi);
  };

  return (
    <div className="h-screen w-full overflow-hidden flex items-center justify-center bg-[#EEF2F7] dark:bg-[#070B14] p-4 font-sans">
      {/* Main Card Container */}
      <div className="w-full max-w-5xl flex flex-row h-[92vh] max-h-[820px] rounded-2xl shadow-2xl shadow-blue-900/5 dark:shadow-black/50 overflow-hidden bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 transition-all">
        
        {/* LEFT PANEL: Branding & Info */}
        <div className="hidden md:flex w-1/2 flex-col justify-between overflow-hidden p-8 bg-gradient-to-br from-[#F4F8FD] to-[#E5EFFE] dark:from-[#131B2E] dark:to-[#0A0D18] relative self-stretch border-r border-slate-200/40 dark:border-slate-800/40">
          
          {/* Decorative patterns */}
          <div 
            className="absolute top-4 right-4 w-24 h-24 opacity-[0.05] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#64748B 1.5px, transparent 1.5px)', backgroundSize: '10px 10px' }} 
          />
          <div 
            className="absolute bottom-4 left-4 w-24 h-24 opacity-[0.05] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#64748B 1.5px, transparent 1.5px)', backgroundSize: '10px 10px' }} 
          />

          <div className="absolute top-12 left-1/4 w-32 h-8 bg-white/30 dark:bg-white/5 rounded-full blur-sm pointer-events-none" />
          <div className="absolute bottom-1/3 right-10 w-24 h-6 bg-white/20 dark:bg-white/5 rounded-full blur-sm pointer-events-none" />

          {/* Logo - Left Panel */}
          <div className="flex flex-col gap-1 relative z-10">
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
          </div>

          {/* Headline */}
          <div className="text-left mt-2 relative z-10">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
              Real-Time Collaborative
              <br />
              Document System
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 font-normal leading-relaxed">
              Create, edit and collaborate on documents
              in real-time with secure access control.
            </p>
          </div>

          {/* Mockup Illustration */}
          <div className="relative flex justify-center items-end mt-4 pt-4 max-h-[200px] overflow-hidden z-10 flex-1">
            <img
              src={bgImage}
              alt="collaboration"
              className="w-[52%] object-contain drop-shadow-md z-10 transition-transform duration-300 hover:scale-[1.02]"
            />
            
            <div className="absolute top-2 right-[28%] text-[#2563EB] z-10 animate-bounce" style={{ animationDuration: '4s' }}>
              <svg className="w-4 h-4 transform -rotate-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </div>

            <div className="absolute top-1/4 left-[22%] bg-blue-600/90 dark:bg-blue-500/80 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-lg border border-white/10 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              Aarav
            </div>
            
            <div className="absolute bottom-6 right-[22%] bg-emerald-600/90 dark:bg-emerald-500/80 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-lg border border-white/10 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              Neha
            </div>

            <div className="absolute bottom-6 left-[28%] bg-amber-500/90 dark:bg-amber-500/80 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-lg border border-white/10 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              Rohan
            </div>
          </div>

          {/* Feature List */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 relative z-10">
            {[
              { icon: FiUsers, title: 'Real-Time Collaboration', subtitle: 'Work together with your team instantly' },
              { icon: FiShield, title: 'Secure & Private', subtitle: 'JWT authentication & role-based security' },
              { icon: FiUserCheck, title: 'Role-Based Access', subtitle: 'Admin, Editor, and Viewer permissions' },
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
        </div>

        {/* RIGHT PANEL: Login Form */}
        <div className="w-full md:w-1/2 bg-white dark:bg-[#0E1524] flex flex-col justify-center overflow-hidden p-8 relative self-stretch">
          
          <div 
            className="absolute top-4 right-4 w-20 h-20 opacity-[0.05] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#64748B 1.5px, transparent 1.5px)', backgroundSize: '8px 8px' }} 
          />

          <div className="w-full max-w-[360px] mx-auto flex flex-col h-full">
            {/* Logo - Positioned at the TOP of right panel */}
            <div className="flex justify-center pt-2 pb-4">
              <img 
                src={athenuraLogo}
                alt="Athenura" 
                className="h-14 w-auto object-contain"
                style={{
                  maxWidth: '200px',
                  filter: isDark ? 'brightness(10)' : 'brightness(1)',
                }}
              />
            </div>

            {/* Content - Centered vertically with flex-1 */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-center mb-4">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Login to continue to your account
                </p>
              </div>

              {/* Show general error from auth context or form */}
              {(authError || errors.general) && (
                <div className="text-center my-4 text-red-500 font-semibold text-[14px]">
                  <div className="flex items-center justify-center gap-3">
                    <span>{authError || errors.general}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-3">
                
                {/* Email Input */}
                <div className="space-y-1 text-left">
                  <label className="text-sm font-semibold text-[#0F172A] dark:text-gray-200 normal-case mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg z-10" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full h-10 text-sm bg-slate-50 dark:bg-slate-800/30 border ${
                        errors.email ? 'border-red-500 focus:ring-red-400/20' : 'border-slate-200 dark:border-slate-700/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      } rounded-lg pl-10 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all font-medium`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-1 text-left">
                  <label className="text-sm font-semibold text-[#0F172A] dark:text-gray-200 normal-case mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg z-10" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full h-10 text-sm bg-slate-50 dark:bg-slate-800/30 border ${
                        errors.password ? 'border-red-500 focus:ring-red-400/20' : 'border-slate-200 dark:border-slate-700/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      } rounded-lg pl-10 pr-10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all font-medium`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer focus:outline-none hover:text-slate-600 dark:hover:text-white transition duration-150 z-10"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Remember & Forgot */}
                <div className="flex justify-between items-center py-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <button
                      type="button"
                      onClick={() => setRememberMe(!rememberMe)}
                      className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                        rememberMe
                          ? 'bg-blue-600 border-blue-600'
                          : 'bg-white border-slate-300 dark:bg-slate-800 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {rememberMe && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-xs"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center"
                >
                  {loading ? 'Sign In...' : 'Sign In'}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="h-[1px] bg-slate-200 dark:bg-slate-800/80 flex-1"></div>
                  <span className="text-slate-400 dark:text-slate-500 text-[10px] font-semibold tracking-wider whitespace-nowrap">
                    OR CONTINUE WITH
                  </span>
                  <div className="h-[1px] bg-slate-200 dark:bg-slate-800/80 flex-1"></div>
                </div>

                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full h-10 border border-slate-200 dark:border-slate-700/60 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 active:bg-slate-200/50 dark:active:bg-slate-850 text-slate-700 dark:text-slate-300 font-semibold text-xs flex justify-center items-center gap-2.5 cursor-pointer transition-all"
                >
                  <FcGoogle size={18} />
                  Continue with Google
                </button>

                {/* Register Link */}
                <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    Create Account
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}