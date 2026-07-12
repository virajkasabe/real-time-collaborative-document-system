import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function EmailVerificationPage() {
  const { verifyEmail, verifyEmailRequest, error: authError, triggerToast } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || new URLSearchParams(location.search).get('email') || '';

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>('');
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleChange = (val: string, index: number) => {
    const cleanVal = val.replace(/[^0-9a-zA-Z]/g, '');
    if (!cleanVal) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleanVal.substring(cleanVal.length - 1);
    setOtp(newOtp);

    // Auto focus next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/[^0-9a-zA-Z]/g, '').substring(0, 6);
    if (text.length === 6) {
      const newOtp = text.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    } else {
      toast.error('Please paste a 6-digit verification code');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');

    if (code.length < 6) {
      toast.error('Please enter the full 6-digit code');
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      await verifyEmail(email, code);
      if (triggerToast) {
        triggerToast('Email verified successfully!', 'success');
      } else {
        toast.success('Email verified successfully!');
      }
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Verify error:', err);
      setServerError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await verifyEmailRequest(email);
      toast.success('Verification code resent successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend code');
    }
  };

  return (
    <AuthLayout 
      title="Verify your email" 
      subtitle={`Enter the 6-digit code we sent to ${email}`}
    >
      <form onSubmit={handleVerify} className="space-y-6 text-left">
        {(serverError || authError) && (
          <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl text-center">
            <p className="text-xs font-semibold text-red-400">{serverError || authError}</p>
          </div>
        )}

        <div className="grid grid-cols-6 gap-2 sm:gap-3">
          {Array(6).fill(0).map((_, i) => (
            <input 
              key={i}
              ref={(el) => { if (el) inputRefs.current[i] = el; }}
              type="text"
              maxLength={1}
              value={otp[i]}
              onChange={e => handleChange(e.target.value, i)}
              onKeyDown={e => handleKeyDown(e, i)}
              onPaste={handlePaste}
              className="w-full aspect-square text-center text-xl font-bold bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-sm transition shadow-lg shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Verifying...
            </>
          ) : (
            'Verify Email'
          )}
        </button>

        <div className="text-center text-xs text-gray-400">
          Didn't receive the code?{' '}
          <button 
            type="button" 
            onClick={handleResend}
            className="text-blue-500 hover:text-blue-400 font-bold transition cursor-pointer"
          >
            Resend Code
          </button>
        </div>

      </form>
    </AuthLayout>
  );
}
