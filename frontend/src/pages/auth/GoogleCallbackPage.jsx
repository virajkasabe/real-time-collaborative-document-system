import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error || !token) {
      console.error('Google OAuth failed:', error);
      navigate('/login?error=google_failed', { replace: true });
      return;
    }

    const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'collabdocs_token';
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem('token', token);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('authToken', token);

    if (typeof loginWithGoogle === 'function') {
      loginWithGoogle(token);
    }

    navigate('/dashboard', { replace: true });
  }, [loginWithGoogle, navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060D1A]">
      <div className="text-center space-y-4">
        <svg
          className="animate-spin w-10 h-10 text-blue-500 mx-auto"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-white text-sm">Signing you in with Google...</p>
      </div>
    </div>
  );
}
