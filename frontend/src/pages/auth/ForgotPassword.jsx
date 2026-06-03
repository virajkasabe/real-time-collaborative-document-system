import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ThemeToggle from '../../components/common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    const success = await forgotPassword(email.trim());
    setLoading(false);

    if (success) {
      navigate(`/reset-password?email=${encodeURIComponent(email.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F7FAFF] dark:bg-[#070B14] transition-colors duration-300">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm glass-card border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#0F172A] shadow-lg rounded-2xl p-6 md:p-8 space-y-5 transition-all duration-300 text-left">
        <div className="space-y-1.5">
          <h3 className="font-sans font-extrabold text-base text-[#081B3A] dark:text-[#E5E7EB] uppercase tracking-wider transition-colors duration-300">
            Recover credentials
          </h3>
          <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8] font-bold">
            Enter your email below to request a simulated security code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. corey@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full h-8"
            icon={Mail}
          >
            Send recovery code
          </Button>
        </form>

        <div className="text-center">
          <Link
            to="/login"
            className="text-[10px] font-bold text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft size={12} />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
