import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FolderDot, ArrowRight, ShieldCheck } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ThemeToggle from '../../components/common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { BRAND_NAME } from '../../utils/constants';

export default function Login() {
  const { login, triggerToast } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F7FAFF] dark:bg-[#070B14] transition-colors duration-300">
      {/* Top right theme toggle float */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left side: branding/welcome banner (Bright Blue Password theme inspired) */}
      <div className="hidden md:flex md:w-1/2 bg-[#0D6EFD] text-white flex-col justify-between p-8 relative overflow-hidden select-none">
        {/* Soft abstract graphic background glows */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-12 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        {/* Branding header */}
        <div className="flex items-center gap-2">
          <FolderDot size={18} className="text-white" />
          <span className="font-sans font-extrabold text-sm uppercase tracking-widest">{BRAND_NAME}</span>
        </div>

        {/* Branding center body */}
        <div className="my-auto text-left space-y-4 max-w-md">
          <h2 className="font-sans font-extrabold text-2xl lg:text-3xl leading-tight">
            Collaborate on document workspaces in real-time.
          </h2>
          <p className="text-xs text-white/80 leading-relaxed font-semibold">
            Join thousands of teams editing product proposals, specifications, meeting minutes, and marketing blueprints on a stunning, clean canvas.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold text-white/70 uppercase tracking-wider bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg w-max shadow-sm">
            <ShieldCheck size={12} className="text-emerald-400" />
            <span>Encrypted cloud storage</span>
          </div>
        </div>

        {/* Branding footer */}
        <p className="text-[10px] text-white/50 font-semibold text-left">
          &copy; 2026 CollabDocs Inc. All rights reserved.
        </p>
      </div>

      {/* Right side: Login form card */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm glass-card border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#0F172A] shadow-lg rounded-2xl p-6 md:p-8 space-y-5 transition-all duration-300 text-left">
          
          <div className="space-y-1.5">
            {/* Branding mobile logo */}
            <div className="flex md:hidden items-center gap-1.5 text-[#0D6EFD] mb-4">
              <FolderDot size={16} />
              <span className="font-bold text-xs uppercase tracking-widest">{BRAND_NAME}</span>
            </div>
            <h3 className="font-sans font-extrabold text-base text-[#081B3A] dark:text-[#E5E7EB] uppercase tracking-wider transition-colors duration-300">
              Welcome back
            </h3>
            <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8] font-bold">
              Sign in with your email to launch your dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. eleanor@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />

            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                required
              />
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-[10px] font-bold text-[#0D6EFD] hover:text-[#0D6EFD]/80"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full h-8"
              icon={ArrowRight}
            >
              Sign In
            </Button>
          </form>

          {/* Alternate navigation links */}
          <div className="text-center text-[10px] font-bold text-[#6B7280] dark:text-[#94A3B8] transition-colors duration-300">
            <span>Don't have an account? </span>
            <Link to="/register" className="text-[#0D6EFD] hover:text-[#0D6EFD]/80">
              Sign Up
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
// Note: User can sign in using any mock credentials (e.g. eleanor@company.com / 12345).
export const MOCK_USER_EMAILS = ['eleanor@company.com', 'sarah@company.com', 'mark@company.com'];
export const MOCK_PASSWORD = 'password';
