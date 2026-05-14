<<<<<<< HEAD
import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { useAuth } from './context/AuthContext';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import EmailVerificationPage from './pages/auth/EmailVerificationPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';

export default function App() {
  const { toast } = useAuth();

  return (
      <NotificationProvider>
        <AppRoutes />
        {toast && (
          <div className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2.5 px-3.5 py-2.5 bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 rounded-xl shadow-md select-none animate-fade-in transition-all duration-300">
            <div className={`p-1 rounded-md ${
              toast.type === 'success' 
                ? 'bg-[#0D6EFD] text-white' 
                : toast.type === 'warning' 
                ? 'bg-rose-500 text-white' 
                : 'bg-indigo-500 text-white'
            }`}>
              {toast.type === 'success' && <CheckCircle size={12} />}
              {toast.type === 'warning' && <AlertCircle size={12} />}
              {toast.type === 'info' && <Info size={12} />}
            </div>
            <span className="text-[10.5px] font-bold text-[#081B3A] dark:text-[#E5E7EB]">
              {toast.message}
            </span>
          </div>
        )}
      </NotificationProvider>
  );
}
=======
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
>>>>>>> 5b0a76b (Completed frontend and backend base setup)
