import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';

const schema = z.object({
  email: z.string().min(1, 'Email address is required').email('Invalid email address')
});

type Fields = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { forgetPasswordRequest, error: authError } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>('');

  const { register, handleSubmit, formState: { errors } } = useForm<Fields>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: Fields) => {
    setLoading(true);
    setServerError('');
    try {
      await forgetPasswordRequest(data.email.trim());
      toast.success('Password reset code sent to your email!');
      navigate(`/reset-password?email=${encodeURIComponent(data.email.trim())}`);
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setServerError(err.message || 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Forgot your password?" 
      subtitle="Enter your email to receive a password reset verification code"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
        {(serverError || authError) && (
          <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl text-center">
            <p className="text-xs font-semibold text-red-400">{serverError || authError}</p>
          </div>
        )}

        {/* Email */}
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 block mb-1">
            EMAIL ADDRESS
          </label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="email"
              {...register('email')}
              placeholder="e.g. eleanor@company.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
            />
          </div>
          {errors.email && (
            <p className="text-[10px] text-red-400 font-semibold mt-1">{errors.email.message}</p>
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
              <Loader2 size={16} className="animate-spin" /> Sending Code...
            </>
          ) : (
            'Send Reset Code'
          )}
        </button>

        {/* Back Link */}
        <div className="text-center">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={13} /> Back to Sign In
          </Link>
        </div>

      </form>
    </AuthLayout>
  );
}
