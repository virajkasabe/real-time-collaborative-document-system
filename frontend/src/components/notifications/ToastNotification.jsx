import React from 'react';
<<<<<<< HEAD
import { createPortal } from 'react-dom';
=======
>>>>>>> wind-breathing
import { FiX, FiMail, FiCheck } from 'react-icons/fi';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

export default function ToastNotification() {
  const { toasts, dismissToast } = useNotifications();
  const { user } = useAuth();
  const location = useLocation();

  // List of auth/public routes
  const publicRoutes = [
    '/', 
    '/login', 
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/set-new-password'
  ];

  if (!user) return null;
  if (publicRoutes.includes(location.pathname)) return null;

  const getToastTitle = (type) => {
    switch (type) {
      case 'COLLAB_INVITED':
        return 'New Collaboration Invite';
      case 'COLLAB_ACCEPTED':
        return 'Invitation Accepted! 🎉';
      case 'COLLAB_DECLINED':
        return 'Invitation Declined';
      default:
        return 'New Notification';
    }
  };

  const getToastMessage = (toast) => {
    switch (toast.type) {
      case 'COLLAB_INVITED':
        return `${toast.inveterName} invited you to collaborate on "${toast.documentTitle}"`;
      case 'COLLAB_ACCEPTED':
        return `${toast.accepterName} accepted your invite for "${toast.documentTitle}"`;
      case 'COLLAB_DECLINED':
        return `"${toast.documentTitle}" invite was declined`;
      default:
        return 'You have a new update';
    }
  };

<<<<<<< HEAD
  return createPortal(
    <div className="fixed z-[9999] flex flex-col gap-2 pointer-events-none select-none" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-start gap-3 bg-white dark:bg-[#1E2535] border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl p-4 min-w-[320px] max-w-[400px] relative overflow-hidden animate-slide-in-right pointer-events-auto"
        >
          {/* Icon based on type */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              toast.type === 'COLLAB_INVITED'
                ? 'bg-blue-100 dark:bg-blue-900/30'
                : toast.type === 'COLLAB_ACCEPTED'
                ? 'bg-green-100 dark:bg-green-900/30'
                : 'bg-red-100 dark:bg-red-900/30'
            }`}
          >
            {toast.type === 'COLLAB_INVITED' ? (
              <FiMail className="text-blue-600 dark:text-blue-400 text-lg" />
            ) : toast.type === 'COLLAB_ACCEPTED' ? (
              <FiCheck className="text-green-600 dark:text-green-400 text-lg" />
            ) : (
              <FiX className="text-red-600 dark:text-red-400 text-lg" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-bold text-[#0F172A] dark:text-white">
              {getToastTitle(toast.type)}
            </p>
            <p className="text-xs text-[#64748B] dark:text-gray-400 mt-0.5 truncate">
              {getToastMessage(toast)}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex-shrink-0 cursor-pointer"
          >
            <FiX size={16} />
          </button>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 h-[3px] bg-blue-500 rounded-full animate-shrink-width" />
        </div>
      ))}
    </div>,
    document.body
=======
  return (
    // <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none select-none">
    //   {toasts.map((toast) => (
    //     <div
    //       key={toast.id}
    //       className="flex items-start gap-3 bg-white dark:bg-[#1E2535] border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl p-4 min-w-[320px] max-w-[400px] relative overflow-hidden animate-slide-in-right pointer-events-auto"
    //     >
    //       {/* Icon based on type */}
    //       <div
    //         className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
    //           toast.type === 'COLLAB_INVITED'
    //             ? 'bg-blue-100 dark:bg-blue-900/30'
    //             : toast.type === 'COLLAB_ACCEPTED'
    //             ? 'bg-green-100 dark:bg-green-900/30'
    //             : 'bg-red-100 dark:bg-red-900/30'
    //         }`}
    //       >
    //         {toast.type === 'COLLAB_INVITED' ? (
    //           <FiMail className="text-blue-600 dark:text-blue-400 text-lg" />
    //         ) : toast.type === 'COLLAB_ACCEPTED' ? (
    //           <FiCheck className="text-green-600 dark:text-green-400 text-lg" />
    //         ) : (
    //           <FiX className="text-red-600 dark:text-red-400 text-lg" />
    //         )}
    //       </div>

    //       {/* Content */}
    //       <div className="flex-1 min-w-0 text-left">
    //         <p className="text-sm font-bold text-[#0F172A] dark:text-white">
    //           {getToastTitle(toast.type)}
    //         </p>
    //         <p className="text-xs text-[#64748B] dark:text-gray-400 mt-0.5 truncate">
    //           {getToastMessage(toast)}
    //         </p>
    //       </div>

    //       {/* Close button */}
    //       <button
    //         onClick={() => dismissToast(toast.id)}
    //         className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex-shrink-0 cursor-pointer"
    //       >
    //         <FiX size={16} />
    //       </button>

    //       {/* Progress bar */}
    //       <div className="absolute bottom-0 left-0 h-[3px] bg-blue-500 rounded-full animate-shrink-width" />
    //     </div>
    //   ))}
    // </div>
    <div className=""></div>
>>>>>>> wind-breathing
  );
}
