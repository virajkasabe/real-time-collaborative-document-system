import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { useAuth } from './context/AuthContext';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import EmailVerificationPage from './pages/auth/EmailVerificationPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import ToastNotification from './components/notifications/ToastNotification';

export default function App() {
  const { toast } = useAuth();

  return (
    <SocketProvider>
      <NotificationProvider>
        <ToastNotification />
        <AppRoutes />
        {/* Routes list:
          <Route path="/verify-email" element={<EmailVerificationPage />} />
        */}

        {/* Global Toast Notification */}
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
    </SocketProvider>
  );
}
