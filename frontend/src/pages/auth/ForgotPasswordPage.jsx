// pages/ForgotPassword.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineMail } from 'react-icons/hi';
import athenuraLogo from "../../assets/athenura-logo.png";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { FiLock, FiSend, FiShield, FiUsers,
         FiClock, FiRefreshCw, FiCheck,
         FiArrowLeft } from 'react-icons/fi';
import { userForgetPasswordRequest } from '../../apis/api';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailVal = email.trim();
    if (!emailVal) {
      setError('Email address is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      // API call to send reset email
      // await api.post('/auth/forgot-password', { email: emailVal });
      
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1500));
      const res = await userForgetPasswordRequest({email})
      setSent(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    } 
    setEmail('')
  };

  const features = [
    { icon: FiShield, title: "Secure", subtitle: "& Safe" },
    { icon: FiUsers, title: "Role-Based", subtitle: "Access" },
    { icon: FiRefreshCw, title: "Real-Time", subtitle: "Collaboration" },
    { icon: FiClock, title: "Version", subtitle: "History" }
  ];

  return (
    <div className="h-screen w-full overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-[#DBEAFE] to-[#C7D9F8] dark:from-[#090D16] dark:to-[#04060B] font-sans select-none">
      
      <div className="w-full max-w-6xl flex flex-col md:flex-row h-[92vh] max-h-[820px] rounded-2xl shadow-xl overflow-hidden bg-white dark:bg-[#0F172A]">
        
        {/* LEFT PANEL */}
        <div className="hidden md:flex md:w-[48%] bg-gradient-to-br from-[#DBEAFE] to-[#C7D9F8] dark:bg-[#161D2E] dark:from-[#161D2E] dark:to-[#1E2535] flex-col overflow-hidden p-8 relative self-stretch border-r border-slate-200/40 dark:border-slate-800/40">
          
          <div 
            className="absolute top-4 right-4 w-20 h-20 opacity-20 pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#64748B 1.5px, transparent 1.5px)', backgroundSize: '10px 10px' }} 
          />
          <div 
            className="absolute bottom-4 left-4 w-20 h-20 opacity-20 pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#64748B 1.5px, transparent 1.5px)', backgroundSize: '10px 10px' }} 
          />
          <div className="absolute top-16 left-[15%] w-24 h-8 bg-white/40 dark:bg-white/5 rounded-full blur-[2px] pointer-events-none" />
          <div className="absolute top-20 left-[35%] w-16 h-6 bg-white/30 dark:bg-white/5 rounded-full blur-[1px] pointer-events-none" />

          <div className="flex flex-col relative z-10 shrink-0">
            <div className="flex items-center gap-3">
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
            <div className="w-10 h-[3px] bg-[#2563EB] mt-2 rounded-full" />
          </div>

          <h1 className="text-2xl font-extrabold text-[#0F172A] dark:text-white mt-6 tracking-tight leading-snug relative z-10 shrink-0">
            Reset Your Password
          </h1>

          <p className="text-sm text-[#475569] dark:text-gray-300 mt-2 leading-relaxed relative z-10 shrink-0">
            Enter your email address and we'll send you<br />
            a link to reset your password.
          </p>

          <div className="flex-1 flex items-center justify-center overflow-hidden max-h-[220px] relative mt-2">
            
            <div className="absolute left-2 top-8 w-28 h-12 bg-white/80 dark:bg-white/10 rounded-full blur-md opacity-90 shadow-sm" />
            <div className="absolute left-8 top-4 w-16 h-8 bg-white/60 dark:bg-white/5 rounded-full blur-sm opacity-70" />

            <div className="absolute top-2 right-12 z-20">
              <FiSend className="text-[#2563EB] text-3xl transform rotate-[30deg]" />
            </div>

            <svg className="absolute top-8 right-2 w-40 h-24 opacity-50 z-10" viewBox="0 0 120 80">
              <path d="M 100 5 Q 80 20 60 40 Q 40 60 20 70" stroke="#2563EB" strokeWidth="1.5" fill="none" strokeDasharray="5 4" strokeLinecap="round" />
            </svg>

            <div className="relative z-10">
              <div className="relative w-48 h-36">
                <div className="w-full h-full bg-gradient-to-b from-[#3B8EEF] to-[#1D5FC4] rounded-b-2xl shadow-xl shadow-blue-400/30 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden">
                    <div 
                      className="w-full h-full bg-[#2D7DE0]" 
                      style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                    />
                  </div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-20 bg-white rounded-xl shadow-md flex flex-col items-center justify-center gap-1 z-10">
                    <FiLock className="text-[#2563EB] text-2xl" />
                    <div className="w-14 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="w-10 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  </div>
                </div>
                <div className="absolute -bottom-1.5 left-0 w-1/2 h-5 bg-[#1A54B8] rounded-bl-2xl transform skew-y-3" />
                <div className="absolute -bottom-1.5 right-0 w-1/2 h-5 bg-[#2563EB] rounded-br-2xl transform -skew-y-3" />
              </div>
            </div>

            <div className="absolute bottom-2 left-4 flex gap-1 opacity-70">
              <div className="w-8 h-11 bg-[#93C5FD] rounded-full transform -rotate-[40deg] origin-bottom rounded-tl-none shadow-sm" />
              <div className="w-5 h-8 bg-[#BFDBFE] rounded-full transform rotate-[15deg] origin-bottom shadow-sm" />
            </div>

            <div className="absolute bottom-2 right-6 grid grid-cols-5 gap-1.5 opacity-25">
              {Array(15).fill(0).map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-[#2563EB]" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-auto relative z-10 shrink-0">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/80 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                  <feat.icon className="text-[#2563EB] dark:text-blue-400 text-sm" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-[#475569] dark:text-gray-400">
                    {feat.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-[52%] bg-white dark:bg-[#1E2535] flex flex-col justify-center overflow-hidden p-8 md:p-10 self-stretch">
          
          <div 
            className="absolute top-4 right-4 w-20 h-20 opacity-[0.04] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#64748B 1.5px, transparent 1.5px)', backgroundSize: '8px 8px' }} 
          />

          <div className="w-full max-w-[360px] mx-auto flex flex-col justify-center h-full select-text">
            {!sent ? (
              <div className="w-full flex flex-col">
                
                <div className="relative w-20 h-20 bg-[#EBF4FF] dark:bg-blue-900/35 rounded-full flex items-center justify-center mx-auto mb-2 shrink-0">
                  <span className="absolute -top-3 left-4 text-[#93C5FD] dark:text-blue-400 text-xl font-light select-none">+</span>
                  <span className="absolute -top-3 right-4 text-[#93C5FD] dark:text-blue-400 text-xl font-light select-none">+</span>
                  <span className="absolute -bottom-3 left-4 text-[#93C5FD] dark:text-blue-400 text-xl font-light select-none">+</span>
                  <span className="absolute -bottom-3 right-4 text-[#93C5FD] dark:text-blue-400 text-xl font-light select-none">+</span>
                  
                  <div className="relative flex items-center justify-center">
                    <HiOutlineMail className="text-[#2563EB] text-4xl" />
                    <FiLock className="text-[#2563EB] text-sm absolute -bottom-1 -right-1 bg-white dark:bg-[#1E2535] rounded-full p-1 shadow-sm border border-slate-100 dark:border-slate-700" />
                  </div>
                </div>

                <h2 className="text-2xl font-extrabold text-[#0F172A] dark:text-white text-center mt-4">
                  Forgot Password?
                </h2>

                <p className="text-sm text-[#64748B] dark:text-gray-400 text-center mt-2 mb-6 leading-relaxed">
                  No worries! Enter your email address and we'll send you instructions to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="email" className="block text-sm font-semibold text-[#0F172A] dark:text-gray-200 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 text-xl z-10" />
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-12 rounded-xl border border-gray-200 dark:border-gray-600 pl-12 bg-white dark:bg-gray-700 text-[#0F172A] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all text-sm font-medium"
                      />
                    </div>
                    {error && (
                      <p className="text-red-500 text-xs mt-1.5 font-semibold">
                        {error}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl mt-4 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/10 hover:shadow-blue-500/20"
                  >
                    <FiSend className="text-white text-lg" />
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>

                  <Link
                    to="/login"
                    className="text-[#2563EB] dark:text-blue-400 font-semibold text-sm mt-4 flex items-center justify-center gap-1 hover:underline cursor-pointer"
                  >
                    <FiArrowLeft className="text-lg" />
                    Back to Login
                  </Link>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 animate-fade-in w-full">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/35 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheck className="text-green-500 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] dark:text-white">
                  Email Sent!
                </h3>
                <p className="text-sm text-[#64748B] dark:text-gray-400 mt-2">
                  Check your inbox for reset instructions.
                </p>
                <Link
                  to="/login"
                  className="mt-6 inline-flex items-center gap-1 text-[#2563EB] dark:text-blue-400 font-semibold text-sm hover:underline"
                >
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