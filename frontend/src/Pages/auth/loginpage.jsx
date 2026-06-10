import React, { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import bgImage from "../../assets/collab-bg.png";
import { useAuth } from "../../context/AuthContext";
import { BRAND_NAME } from "../../utils/constants";

export default function LoginPage() {
  const { login, triggerToast } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    const success = await login(email.trim(), password);
    setLoading(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const success = await login('google.user@company.com', 'password');
    setLoading(false);
    if (success) {
      triggerToast('Signed in with Google (Simulated)', 'success');
      navigate('/dashboard');
    }
  };

  return (
    <div
      style={{
        fontFamily: 'Inter, "SF Pro Display", "Segoe UI", sans-serif',
        background: 'linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%)'
      }}
      className="min-h-screen flex items-center justify-center p-4 lg:p-6 relative overflow-hidden font-sans"
    >
      {/* Subtle decorative blue blur shapes in background */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#2563EB]/8 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card - 50/50 split layout, vertically centered columns */}
      <div className="login-page-container z-10">

        {/* LEFT PANEL: Brand Info Panel (50% Width, vertically centered internally) */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#F8FAFC]/50 p-12 xl:p-16 flex-col justify-center select-none">

          {/* Logo Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-md shadow-[#2563EB]/10">
              <FaFileAlt className="text-white text-lg" />
            </div>
            <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
              {BRAND_NAME}
            </h1>
          </div>

          {/* Headline and description (precise margins applied) */}
          <div className="text-left mt-[32px]">
            <h1 className="hero-login-heading text-[#0F172A] tracking-tighter">
              Collaborate on
              <br />
              documents in real time
            </h1>
            <p className="hero-login-description font-normal max-w-[500px] mt-[24px]">
              Co-edit architecture specs, product proposals, and team briefs instantly with secure role-based control.
            </p>
          </div>

          {/* Illustration - Floating & Soft Shadow (precise margin applied, w-85% scaling) */}
          <div className="flex justify-center mt-[32px]">
            <img
              src={bgImage}
              alt="collaboration"
              className="hero-login-illustration object-contain animate-float-slow drop-shadow-[0_15px_35px_rgba(15,23,42,0.03)] w-[90%] lg:w-[85%]"
            />
          </div>

          {/* Feature Badges Grid (precise margin applied) */}
          <div className="grid grid-cols-2 gap-4 mt-[32px]">
            {[
              'Real-time collaboration',
              'Version history',
              'Secure sharing',
              'Team workspaces'
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-left">
                <span className="text-[#2563EB] font-bold text-base">✓</span>
                <span className="text-[14px] font-semibold text-[#0F172A]">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL: Login Form Card (50% Width, vertically centered) */}
        <div className="w-full lg:w-1/2 bg-gradient-to-b from-[#F8FAFC] to-[#EEF4FF] flex items-center justify-center p-6 sm:p-12">

          {/* Card - max-width 520px, Radius 24px, subtle shadow, vertically centered */}
          <div className="login-card-wrapper text-left space-y-6">

            {/* Header - Welcome Back */}
            <div className="space-y-2 text-center">
              <h1 className="text-[36px] font-extrabold text-[#0F172A] tracking-tighter leading-none">
                Welcome Back
              </h1>
              <p className="text-[#64748B] text-sm font-medium">
                Sign in to continue
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#0F172A]">
                  Email
                </label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] text-xl" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full h-[52px] text-[16px] bg-white border ${
                      errors.email ? 'border-red-500 focus:ring-red-500/10' : 'border-[#D0D7E2] focus:ring-[#2563EB]/10'
                    } rounded-[14px] pl-12 pr-4 text-[#0F172A] placeholder-[#64748B]/40 focus:outline-none focus:ring-4 focus:border-[#2563EB] font-medium transition-all duration-150`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs font-semibold">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#0F172A]">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] text-xl" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full h-[52px] text-[16px] bg-white border ${
                      errors.password ? 'border-red-500 focus:ring-red-500/10' : 'border-[#D0D7E2] focus:ring-[#2563EB]/10'
                    } rounded-[14px] pl-12 pr-12 text-[#0F172A] placeholder-[#64748B]/40 focus:outline-none focus:ring-4 focus:border-[#2563EB] font-medium transition-all duration-150`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] cursor-pointer focus:outline-none hover:text-[#0F172A] transition duration-150"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs font-semibold">{errors.password}</p>
                )}
              </div>

              {/* Remember & Forgot Password */}
              <div className="flex justify-between items-center pt-1">
                <label className="flex items-center gap-2 text-[#64748B] cursor-pointer text-sm font-medium">
                  <input
                    type="checkbox"
                    className="rounded text-[#2563EB] focus:ring-[#2563EB]/20 border-[#D0D7E2] w-4 h-4 cursor-pointer"
                  />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[#2563EB] hover:underline font-bold text-sm"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] rounded-[14px] bg-gradient-to-r from-[#2563EB] to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-[16px] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2 cursor-pointer"
              >
                {loading ? 'Sign In...' : 'Sign In'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 py-2">
                <div className="h-[1px] bg-[#E2E8F0] flex-1"></div>
                <span className="text-[#64748B] text-xs font-bold tracking-wider">
                  OR
                </span>
                <div className="h-[1px] bg-[#E2E8F0] flex-1"></div>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full h-[52px] border border-[#E2E8F0] rounded-[14px] bg-white hover:bg-slate-50/50 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 font-semibold text-[#0F172A] text-[16px] flex justify-center items-center gap-3 cursor-pointer"
              >
                <FcGoogle size={24} />
                Continue with Google
              </button>

              {/* Register Link */}
              <p className="text-center text-[#64748B] pt-2 text-sm font-medium">
                Don't have an account?
                <Link
                  to="/register"
                  className="text-[#2563EB] font-bold ml-1 hover:underline"
                >
                  Create Account
                </Link>
              </p>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
