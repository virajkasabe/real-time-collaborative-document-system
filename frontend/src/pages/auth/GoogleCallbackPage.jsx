import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      loginWithGoogle(token);
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [loginWithGoogle, navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#EEF2F7] dark:bg-[#070B14] font-sans">
      <div className="text-center p-8 bg-white dark:bg-[#0F172A] rounded-2xl shadow-xl max-w-sm w-full border border-slate-200 dark:border-slate-800">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Signing you in</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Please wait while we set up your session...</p>
      </div>
    </div>
  );
}
