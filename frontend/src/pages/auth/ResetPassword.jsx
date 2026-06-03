import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ThemeToggle from '../../components/common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !code.trim() || !password) return;

    setLoading(true);
    const success = await resetPassword(email.trim(), code.trim(), password);
    setLoading(false);

    if (success) {
      navigate('/login');
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
            Reset password
          </h3>
          <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8] font-bold">
            Enter the recovery code to update your security keys.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={!!searchParams.get('email')}
          />

          <Input
            label="Security Code"
            type="text"
            placeholder="e.g. 123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full h-8"
            icon={ShieldAlert}
          >
            Update password
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
