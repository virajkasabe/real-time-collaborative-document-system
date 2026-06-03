import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#F7FAFF] dark:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB] transition-colors duration-300 font-sans">
            <AppRoutes />
            <ToastNotifier />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Inline Toast notifier listening to AuthContext alerts
import { useAuth } from './context/AuthContext';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

function ToastNotifier() {
  const { toast } = useAuth();

  if (!toast) return null;

  const typeStyles = {
    success: 'bg-[#0D6EFD] text-white border-[#0D6EFD]',
    warning: 'bg-rose-500 text-white border-rose-500',
    info: 'bg-indigo-500 text-white border-indigo-500'
  };

  const Icons = {
    success: CheckCircle,
    warning: AlertCircle,
    info: Info
  };

  const IconComponent = Icons[toast.type] || Info;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 px-3.5 py-2.5 bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 rounded-xl shadow-md select-none animate-fade-in transition-all duration-300">
      <div className={`p-1 rounded-md ${typeStyles[toast.type]}`}>
        <IconComponent size={12} />
      </div>
      <span className="text-[10.5px] font-bold text-[#081B3A] dark:text-[#E5E7EB]">
        {toast.message}
      </span>
    </div>
  );
}
