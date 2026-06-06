import React, { useState, useEffect } from 'react';
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaShieldAlt,
  FaCloud,
  FaHistory,
  FaFileAlt,
} from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import bgImage from "../../assets/collab-bg.png";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const { register, isAuthenticated, login, triggerToast } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    let errs = {};

    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim()) errs.email = 'Email address is required';
    
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 4) {
      errs.password = 'Password must be at least 4 characters';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      errs.agreeTerms = 'You must agree to the Terms and Privacy Policy';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      if (errs.agreeTerms && Object.keys(errs).length === 1) {
        triggerToast(errs.agreeTerms, 'warning');
      }
      return;
    }

    setLoading(true);
    const success = await register(email.trim(), name.trim(), password);
    setLoading(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    const success = await login('google.user@company.com', 'password');
    setLoading(false);
    if (success) {
      triggerToast('Signed up with Google (Simulated)', 'success');
      navigate('/dashboard');
    }
  };

  return (
    <div 
      style={{ 
        fontFamily: 'Inter, "SF Pro Display", "Segoe UI", sans-serif',
      }}
      className="min-h-screen flex items-center justify-center p-4 lg:p-6 relative overflow-hidden font-sans bg-gradient-to-r from-sky-100 to-blue-300"
    >
      {/* Main Container Card - 52/48 split layout, vertically centered columns on desktop, flex-col stack on mobile/tablet */}
      <div className="register-page-container z-10 flex flex-col lg:flex-row bg-white rounded-[30px] shadow-2xl w-full max-w-[1400px]">

        {/* LEFT SIDE: Branding Panel (52% Width) */}
        <div className="flex w-full lg:w-[52%] bg-gradient-to-br from-blue-50 to-blue-100 p-6 lg:p-12 flex-col justify-center items-center select-none rounded-t-[30px] lg:rounded-t-0 lg:rounded-l-[30px]">
          <div className="w-full max-w-[500px] text-left flex flex-col gap-y-[clamp(24px,3vh,32px)]">
            {/* Logo */}
            <div>
              <div className="flex items-center gap-3">
                <FaFileAlt className="text-blue-500 text-4xl" />
                <h1 className="text-3xl font-bold text-slate-900">
                  Collab
                  <span className="text-blue-500">Docs</span>
                </h1>
              </div>
              <div className="w-12 h-1 bg-blue-500 mt-[16px] rounded-full"></div>
            </div>

            {/* Heading with responsive typography */}
            <h1 className="text-[clamp(2.25rem,3.5vw,2.5rem)] font-bold leading-tight text-slate-900 text-left">
              Real-Time Collaborative
              <br />
              Document System
            </h1>

            {/* Description with responsive typography */}
            <p className="text-[clamp(1rem,1.25vw,1.125rem)] text-slate-500 text-left">
              Google Docs + Microsoft Word Inspired
              <br />
              with Secure Access Control
            </p>

            {/* Illustration with responsive spacing and scaling */}
            <div className="flex justify-center">
              <img
                src={bgImage}
                alt="collaboration"
                className="register-hero-illustration object-contain w-full"
              />
            </div>

            {/* Features list */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex gap-3 text-left">
                <div className="bg-white p-3 rounded-full shadow self-start">
                  <FaUsers className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">
                    Real-Time Collaboration
                  </h3>
                  <p className="text-xs text-gray-500">
                    Work together in real-time
                  </p>
                </div>
              </div>

              <div className="flex gap-3 text-left">
                <div className="bg-white p-3 rounded-full shadow self-start">
                  <FaShieldAlt className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">
                    Secure & Private
                  </h3>
                  <p className="text-xs text-gray-500">
                    JWT authentication
                  </p>
                </div>
              </div>

              <div className="flex gap-3 text-left">
                <div className="bg-white p-3 rounded-full shadow self-start">
                  <FaCloud className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">
                    Cloud Based
                  </h3>
                  <p className="text-xs text-gray-500">
                    Access anywhere
                  </p>
                </div>
              </div>

              <div className="flex gap-3 text-left">
                <div className="bg-white p-3 rounded-full shadow self-start">
                  <FaHistory className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">
                    Version History
                  </h3>
                  <p className="text-xs text-gray-500">
                    Restore versions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Form card (48% Width, vertically centered) */}
        <div className="w-full lg:w-[48%] bg-gray-50 flex justify-center items-center p-6 lg:p-12 rounded-b-[30px] lg:rounded-b-0 lg:rounded-r-[30px]">
          <div className="bg-white w-full max-w-[600px] rounded-[30px] shadow-xl p-6 lg:p-12 text-left flex flex-col justify-center">

            <h1 className="text-[clamp(1.75rem,2.5vw,2.25rem)] font-bold text-center text-slate-900 leading-tight">
              Create Your Account
            </h1>
            <p className="text-center text-slate-500 font-medium mt-[16px] mb-[16px]">
              Join CollabDocs and start collaborating
            </p>

            <form onSubmit={handleRegister} className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="font-medium text-slate-700">Full Name</label>
                <div className="relative mt-[8px]">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full h-[52px] border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-xl pl-12 pr-4 focus:outline-none focus:ring-2`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="font-medium text-slate-700">Email Address</label>
                <div className="relative mt-[8px]">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full h-[52px] border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-xl pl-12 pr-4 focus:outline-none focus:ring-2`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="font-medium text-slate-700">Password</label>
                <div className="relative mt-[8px]">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full h-[52px] border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-xl pl-12 pr-12 focus:outline-none focus:ring-2`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer focus:outline-none hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="font-medium text-slate-700">Confirm Password</label>
                <div className="relative mt-[8px]">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full h-[52px] border ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-xl pl-12 pr-12 focus:outline-none focus:ring-2`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer focus:outline-none hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 rounded text-blue-500 focus:ring-blue-500 border-gray-300 cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="cursor-pointer">
                  I agree to the <span className="text-blue-600 hover:underline">Terms of Service</span> and <span className="text-blue-600 hover:underline">Privacy Policy</span>
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="text-red-500 text-xs mt-0.5 font-medium">{errors.agreeTerms}</p>
              )}

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 text-white font-semibold text-base hover:from-sky-500 hover:to-blue-700 transition duration-200 shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 py-1">
                <div className="flex-1 h-[1px] bg-gray-300"></div>
                <span className="text-gray-400 text-sm font-medium">
                  OR CONTINUE WITH
                </span>
                <div className="flex-1 h-[1px] bg-gray-300"></div>
              </div>

              {/* Google Sign Up */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={loading}
                className="w-full h-[52px] border border-gray-300 rounded-xl flex justify-center items-center gap-3 hover:bg-gray-50 transition duration-150 font-semibold text-slate-700 cursor-pointer"
              >
                <FcGoogle size={24} />
                Continue with Google
              </button>

              {/* Login Link */}
              <p className="text-center text-gray-500 pt-2 font-medium">
                Already have an account?
                <Link
                  to="/login"
                  className="text-blue-600 font-bold ml-1 hover:underline"
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