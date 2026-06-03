import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FolderDot, UserPlus } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ThemeToggle from '../../components/common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { BRAND_NAME } from '../../utils/constants';

export default function Register() {
  const { register, triggerToast } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    let errs = {};

    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim()) errs.email = 'Email address is required';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 4) errs.password = 'Password must be at least 4 characters';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    const success = await register(email.trim(), name.trim(), password);
    setLoading(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F7FAFF] dark:bg-[#070B14] transition-colors duration-300">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left side branding sidebar */}
      <div className="hidden md:flex md:w-1/2 bg-[#0D6EFD] text-white flex-col justify-between p-8 relative overflow-hidden select-none">
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-12 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="flex items-center gap-2">
          <FolderDot size={18} className="text-white" />
          <span className="font-sans font-extrabold text-sm uppercase tracking-widest">{BRAND_NAME}</span>
        </div>

        <div className="my-auto text-left space-y-4 max-w-md">
          <h2 className="font-sans font-extrabold text-2xl lg:text-3xl leading-tight">
            Create unified documents with your teammates.
          </h2>
          <p className="text-xs text-white/80 leading-relaxed font-semibold">
            Deploy shared links to sync comments, versions checkpoints, rich typography layout presets, and live cursor indicators instantly.
          </p>
        </div>

        <p className="text-[10px] text-white/50 font-semibold text-left">
          &copy; 2026 CollabDocs Inc. All rights reserved.
        </p>
      </div>

      {/* Right form container */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm glass-card border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#0F172A] shadow-lg rounded-2xl p-6 md:p-8 space-y-5 transition-all duration-300 text-left">
          
          <div className="space-y-1.5">
            <div className="flex md:hidden items-center gap-1.5 text-[#0D6EFD] mb-4">
              <FolderDot size={16} />
              <span className="font-bold text-xs uppercase tracking-widest">{BRAND_NAME}</span>
            </div>
            <h3 className="font-sans font-extrabold text-base text-[#081B3A] dark:text-[#E5E7EB] uppercase tracking-wider transition-colors duration-300">
              Create an account
            </h3>
            <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8] font-bold">
              Join CollabDocs to start building documents.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3.5">
            <Input
              label="Full Name"
              placeholder="e.g. Eleanor Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. eleanor@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
            />

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full h-8"
              icon={UserPlus}
            >
              Sign Up
            </Button>
          </form>

          <div className="text-center text-[10px] font-bold text-[#6B7280] dark:text-[#94A3B8] transition-colors duration-300">
            <span>Already have an account? </span>
            <Link to="/login" className="text-[#0D6EFD] hover:text-[#0D6EFD]/80">
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
