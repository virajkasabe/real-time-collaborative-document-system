import React from 'react';
import { FiBell, FiMail, FiUserCheck, FiUserX } from 'react-icons/fi';

export default function NotificationItem({ notification, onRead }) {
  const getIcon = (type) => {
    switch (type) {
      case 'COLLAB_INVITED':
        return <FiMail className="text-[#2563EB] text-base" />;
      case 'COLLAB_ACCEPTED':
        return <FiUserCheck className="text-green-500 text-base" />;
      case 'COLLAB_DECLINED':
        return <FiUserX className="text-red-500 text-base" />;
      default:
        return <FiBell className="text-gray-400 text-base" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'COLLAB_INVITED':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'COLLAB_ACCEPTED':
        return 'bg-green-100 dark:bg-green-900/30';
      case 'COLLAB_DECLINED':
        return 'bg-red-100 dark:bg-red-900/30';
      default:
        return 'bg-gray-100 dark:bg-gray-700';
    }
  };

  const getMessage = (n) => {
    switch (n.type) {
      case 'COLLAB_INVITED':
        return `${n.inveterName} invited you to collaborate on "${n.documentTitle}"`;
      case 'COLLAB_ACCEPTED':
        return `${n.accepterName} accepted your invite for "${n.documentTitle}"`;
      case 'COLLAB_DECLINED':
        return `Invite for "${n.documentTitle}" was declined`;
      default:
        return 'New notification';
    }
  };

  return (
    <div
      onClick={() => onRead(notification.id)}
      className={`flex items-start gap-3 p-4 cursor-pointer transition-colors duration-150 border-b border-gray-50 dark:border-gray-700/30 hover:bg-gray-50 dark:hover:bg-gray-700/30 ${
        !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
      }`}
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getBg(notification.type)}`}>
        {getIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <p className="text-sm text-[#0F172A] dark:text-gray-200 leading-snug break-words">
          {getMessage(notification)}
        </p>
        <p className="text-xs text-[#94A3B8] dark:text-gray-500 mt-1">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Unread dot */}
      {!notification.read && (
        <div className="w-2 h-2 bg-[#2563EB] rounded-full flex-shrink-0 mt-1.5" />
      )}
    </div>
  );
}
