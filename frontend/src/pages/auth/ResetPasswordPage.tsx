import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Key, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const schema = z.object({
  code: z.string().min(4, 'Code must be at least 4 characters'),
  password: z.string().min(6, 'New password must be at least 6 characters')
});

type Fields = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const { resetPassword, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const email = new URLSearchParams(location.search).get('email') || '';

  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>('');

  const { register, handleSubmit, formState: { errors } } = useForm<Fields>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: Fields) => {
    if (!email) {
      toast.error('Email is missing from the query params');
      return;
    }
    setLoading(true);
    setServerError('');
    try {
      await resetPassword(email, data.code.trim(), data.password);
      toast.success('Password reset successfully! Please sign in.');
      navigate('/login');
    } catch (err: any) {
      console.error('Reset password error:', err);
      setServerError(err.message || 'Reset failed. Please check your verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Reset your password" 
      subtitle={`Enter the code sent to ${email} and pick a new password`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        {(serverError || authError) && (
          <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl text-center">
            <p className="text-xs font-semibold text-red-400">{serverError || authError}</p>
          </div>
        )}

        {/* Verification Code */}
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 block mb-1">
            VERIFICATION CODE
          </label>
          <div className="relative">
            <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text"
              {...register('code')}
              placeholder="e.g. 123456"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
            />
          </div>
          {errors.code && (
            <p className="text-[10px] text-red-400 font-semibold mt-1">{errors.code.message}</p>
          )}
        </div>

        {/* New Password */}
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 block mb-1">
            NEW PASSWORD
          </label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 transition cursor-pointer"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[10px] text-red-400 font-semibold mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Action button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-sm transition shadow-lg shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Resetting...
            </>
          ) : (
            'Reset Password'
          )}
        </button>

        {/* Redirect */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Remembered your password?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-400 font-bold transition">
            Sign in
          </Link>
        </p>

      </form>
    </AuthLayout>
  );
}
