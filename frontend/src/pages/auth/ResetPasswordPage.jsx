import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import { HiOutlineMail } from 'react-icons/hi';
import athenuraLogo from "../../assets/athenura-logo.png";
import { FiLock, FiEye, FiEyeOff, FiShield,
         FiCheckCircle, FiCircle, FiCheck,
         FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function ResetPasswordPage() {
  const { token } = useParams(); // get token from URL
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password strength checks (live)
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', pass: /[a-z]/.test(password) },
    { label: 'One number', pass: /[0-9]/.test(password) },
    { label: 'Special character', pass: /[^A-Za-z0-9]/.test(password) },
  ];

  const getStrength = () => {
    const passed = checks.filter(c => c.pass).length;
    if (passed <= 1) return { label: 'Weak', color: '#ef4444', width: '20%' };
    if (passed <= 3) return { label: 'Fair', color: '#f59e0b', width: '60%' };
    if (passed === 4) return { label: 'Good', color: '#3b82f6', width: '80%' };
    return { label: 'Strong', color: '#22c55e', width: '100%' };
  };

  // Check token ONCE on mount only - stops repeating error
  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new one.');
    }
  }, []);

  const handleReset = async () => {
    setError(''); 
    
    if (!token) {
      setError('Invalid reset link. Please request a new one.');
      return;
    }
    if (!password) {
      setError('Please enter a new password');
      return;
    }
    if (!confirmPassword) {
      setError('Please confirm your password');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (checks.some(c => !c.pass)) {
      setError('Password does not meet all requirements');
      return;
    }

    const payload = {
      token: token,
      newPassword: password
    };

    console.log("Token extracted from URL:", token);
    console.log("Request payload:", payload);

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:5000/api/v1/rtcds/auth/reset-password',
        payload,
        { withCredentials: true }
      );

      console.log("API response:", response.data);

      toast.success(response.data?.message || 'Password reset successful!');
      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error("API error response:", err.response?.data || err.message);
      const msg = err.response?.data?.message || err.message || 'Password reset failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Show invalid link page if no token
  if (!token) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#0f172a'
      }}>
        <div style={{
          background: '#1e293b',
          border: '1px solid #ef4444',
          padding: '32px',
          borderRadius: '16px',
          textAlign: 'center',
          maxWidth: '400px',
          width: '90%'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <h3 style={{ color: '#ef4444', margin: '0 0 8px' }}>
            Invalid Reset Link
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 24px' }}>
            Token is missing from the URL.
            Please request a new password reset link.
          </p>
          <button
            onClick={() => navigate('/forgot-password')}
            style={{
              background: '#1a73e8',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  // Show success page
  if (success) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#0f172a'
      }}>
        <div style={{
          background: '#1e293b',
          padding: '32px',
          borderRadius: '16px',
          textAlign: 'center',
          maxWidth: '400px',
          width: '90%'
        }}>
          <div style={{
            width: '64px', height: '64px',
            background: '#d1fae5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '32px'
          }}>✅</div>
          <h3 style={{ color: '#22c55e', margin: '0 0 8px' }}>
            Password Reset Successful!
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-[#DBEAFE] to-[#C7D9F8] dark:from-[#090D16] dark:to-[#04060B] font-sans select-none">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* MAIN CARD: same as other auth pages */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row h-[92vh] max-h-[820px] rounded-2xl shadow-xl overflow-hidden bg-white dark:bg-[#0F172A]">
        
        {/* LEFT PANEL */}
        <div className="hidden md:flex md:w-[48%] bg-gradient-to-br from-[#DBEAFE] to-[#C7D9F8] dark:from-[#161D2E] dark:to-[#1E2535] flex-col overflow-hidden p-8 relative self-stretch border-r border-slate-200/40 dark:border-slate-800/40">
          
          {/* Logo (top-left) */}
          <div className="flex flex-col text-left relative z-10 shrink-0">
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
            <div className="w-8 h-[3px] bg-[#2563EB] mt-1.5 rounded-full" />
          </div>

          {/* Headline (two lines) */}
          <div className="mt-8 shrink-0 relative z-10 text-left">
            <h1 className="text-4xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-none">
              Set New
            </h1>
            <h1 className="text-4xl font-extrabold text-[#2563EB] mt-1 tracking-tight leading-none">
              Password
            </h1>
          </div>

          {/* Subtext */}
          <p className="text-sm text-[#475569] dark:text-gray-300 mt-3 leading-relaxed max-w-[280px] text-left relative z-10 shrink-0">
            Create a strong password to secure your account and keep your documents safe.
          </p>

          {/* Main Illustration — 3D PADLOCK */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden my-2">
            
            {/* Light blue blob background */}
            <div className="absolute w-56 h-56 bg-blue-200/40 rounded-full blur-3xl" />

            {/* Padlock group */}
            <div className="relative z-10 flex flex-col items-center">
              
              {/* Shackle (top U-shape) */}
              <div className="w-16 h-10 border-[8px] border-[#2563EB] rounded-t-full bg-transparent mx-auto -mb-1" />
              
              {/* Lock body */}
              <div className="w-40 h-32 bg-gradient-to-b from-[#4DA3FF] to-[#2563EB] rounded-2xl shadow-2xl shadow-blue-400/50 flex items-center justify-center relative">
                
                {/* Keyhole circle */}
                <div className="w-10 h-10 bg-[#1D4ED8]/60 rounded-full flex items-center justify-center">
                  <div className="w-4 h-6 bg-[#1E40AF] rounded-b-full rounded-t-full" />
                </div>

                {/* Shine effect */}
                <div className="absolute top-3 left-4 w-6 h-12 bg-white/10 rounded-full transform -rotate-12" />
              </div>
            </div>

            {/* Password dots card - bottom left */}
            <div className="absolute bottom-8 left-4 bg-white rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3 z-20 border border-slate-100">
              <span className="text-[#2563EB] text-xl font-bold tracking-widest">
                ✱ ✱ ✱ ✱
              </span>
            </div>

            {/* Blue shield checkmark - bottom right */}
            <div className="absolute bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-[#3B9EFF] to-[#2563EB] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-400/40 z-20">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Checkmark shield top right */}
            <div className="absolute top-8 right-8 w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center z-20 border border-slate-100">
              <svg className="w-6 h-6 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>

          {/* Security badge (bottom of left panel) */}
          <div className="flex items-start gap-3 bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 mt-4 text-left relative z-10 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center flex-shrink-0 shadow-md">
              <FiShield className="text-white text-lg" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0F172A] dark:text-white">
                Your security is our priority.
              </p>
              <p className="text-xs text-[#475569] dark:text-gray-400 mt-0.5">
                Choose a strong password that you don't use elsewhere.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-[52%] bg-white dark:bg-[#1E2535] flex flex-col justify-center overflow-hidden p-8 md:p-10 self-stretch">
          
          <div className="w-full max-w-[360px] mx-auto flex flex-col justify-center h-full select-text">
            <div className="w-full flex flex-col">
              
              {/* Top icon (centered) */}
              <div className="relative w-16 h-16 bg-[#EBF4FF] dark:bg-blue-900/30 rounded-full mx-auto mb-4 flex items-center justify-center shrink-0">
                <HiOutlineMail className="text-[#2563EB] text-3xl" />
                
                {/* Lock badge (bottom-right of circle) */}
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-700 rounded-full p-1 text-[#2563EB] text-xs shadow-sm border border-gray-100 dark:border-gray-600">
                  <FiLock />
                </div>
              </div>

              {/* Header */}
              <div className="text-center">
                <h2 className="text-2xl font-extrabold text-[#0F172A] dark:text-white text-center">
                  Set New Password
                </h2>
                <p className="text-sm text-[#64748B] dark:text-gray-400 text-center mt-1 mb-5">
                  Enter your new password below.
                </p>
              </div>

              <div className="space-y-3.5 text-left">
                
                {/* 1. New Password field */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-[#0F172A] dark:text-gray-200 mb-1 block">
                    New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg z-10" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 bg-white dark:bg-[#2D3748] border border-gray-200 dark:border-gray-600 rounded-xl pl-12 pr-12 text-[#0F172A] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all font-medium text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer focus:outline-none hover:text-[#0F172A] dark:hover:text-white transition duration-150 z-10"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>

                  {/* Password Strength Bar */}
                  {password.length > 0 && (
                    <div className="mt-2">
                      <div style={{ height: '4px', background: '#334155',
                        borderRadius: '2px', margin: '8px 0' }}>
                        <div style={{
                          height: '100%',
                          width: getStrength().width,
                          background: getStrength().color,
                          borderRadius: '2px',
                          transition: 'all 0.3s ease'
                        }} />
                      </div>
                      <span style={{ color: getStrength().color, fontSize: '12px' }}>
                        {getStrength().label}
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. Confirm New Password field */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-[#0F172A] dark:text-gray-200 mb-1 block">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg z-10" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-11 bg-white dark:bg-[#2D3748] border border-gray-200 dark:border-gray-600 rounded-xl pl-12 pr-12 text-[#0F172A] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all font-medium text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer focus:outline-none hover:text-[#0F172A] dark:hover:text-white transition duration-150 z-10"
                    >
                      {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Requirements checklist */}
                <div className="space-y-1 mt-2">
                  {checks.map((check, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center',
                      gap: '6px', fontSize: '12px', marginBottom: '4px',
                      color: check.pass ? '#22c55e' : '#94a3b8'
                    }}>
                      {check.pass ? '✅' : '⭕'} {check.label}
                    </div>
                  ))}
                </div>

                {/* Error message */}
                {error && (
                  <div style={{
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid #ef4444',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    color: '#ef4444',
                    fontSize: '13px',
                    marginTop: '12px'
                  }}>
                    ⚠️ {error}
                  </div>
                )}

                {/* Update Password Button */}
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="w-full h-11 rounded-xl mt-3 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-blue-500/10 hover:shadow-blue-500/20"
                >
                  <FiLock />
                  {loading ? 'Updating Password...' : 'Update Password'}
                </button>

                {/* Back to Login Link */}
                <div
                  onClick={() => navigate('/login')}
                  className="text-[#2563EB] dark:text-blue-400 font-semibold text-sm flex items-center justify-center gap-1 mt-3 hover:underline cursor-pointer"
                >
                  <FiArrowLeft className="text-lg" />
                  Back to Login
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
