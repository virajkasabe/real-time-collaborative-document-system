import React, { useState } from 'react';
import { FiBell, FiMail, FiUserCheck, FiUserX, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';
import { useNotifications } from '../context/NotificationContext';
import { useSocket } from '../context/SocketContext';
import { INVITATION_EVENT } from '../utils/constants';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const [activeTab, setActiveTab] = useState('all');
  const { socket } = useSocket()
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'invites', label: 'Invites' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'declined', label: 'Declined' }
  ];


   const acceptCollab = (acceptNotif) => {
    console.log("acces",acceptNotif)
    markAsRead(acceptNotif.id)
      socket.emit(INVITATION_EVENT.ACCEPT_INVITATION,
        acceptNotif
      )
    }

  const declinedCollab = (declineNotif) => {
    console.log("acces",declineNotif)
    markAsRead(declineNotif.id)
      socket.emit(INVITATION_EVENT.DECLINE_INVITATION,{
        declineNotif
      })
  }
  
  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'invites':
        return notifications.filter(n => n.type === 'COLLAB_INVITED');
      case 'accepted':
        return notifications.filter(n => n.type === 'COLLAB_ACCEPTED');
      case 'declined':
        return notifications.filter(n => n.type === 'COLLAB_DECLINED');
      default:
        return notifications;
    }
  };



  const getEmptyStateMessage = () => {
    switch (activeTab) {
      case 'unread':
        return {
          title: "You're all caught up! 🎉",
          desc: "No unread notifications left."
        };
      case 'invites':
        return {
          title: "No pending invites",
          desc: "You haven't received any document collaboration invites."
        };
      case 'accepted':
        return {
          title: "No accepted invites yet",
          desc: "None of your invites have been accepted yet."
        };
      case 'declined':
        return {
          title: "No declined invites",
          desc: "You have no declined invitations."
        };
      default:
        return {
          title: "No notifications yet",
          desc: "We will notify you when something happens!"
        };
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'COLLAB_INVITED':
        return <FiMail className="text-[#2563EB] dark:text-blue-400 text-xl" />;
      case 'COLLAB_ACCEPTED':
        return <FiUserCheck className="text-green-500 text-xl" />;
      case 'COLLAB_DECLINED':
        return <FiUserX className="text-red-500 text-xl" />;
      default:
        return <FiBell className="text-gray-400 text-xl" />;
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

  const filtered = getFilteredNotifications();
  const empty = getEmptyStateMessage();

  return (
    <div className="p-6 space-y-6 max-w-4xl w-full mx-auto select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] dark:border-white/10 pb-5 transition-all duration-300">
        <div className="text-left">
          <div className="flex items-center gap-2.5">
            <h2 className="font-sans font-extrabold text-xl md:text-2xl text-[#081B3A] dark:text-white tracking-tight">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[11px] font-bold">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] font-medium mt-1">
            Stay updated with your collaborative project activities
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3.5 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-white/10 text-xs font-bold text-[#081B3A] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="px-3.5 py-1.5 rounded-lg border border-red-200 dark:border-red-900/30 text-xs font-bold text-red-650 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/10 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
            >
              <FiTrash2 size={13} />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-white/5 pb-0.5 gap-2 scrollbar-none overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 border-b-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'border-[#2563EB] text-[#2563EB] dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List Container */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/5 rounded-[20px] p-12 text-center flex flex-col items-center justify-center shadow-sm transition-all duration-300">
            <FiBell className="text-gray-300 dark:text-gray-600 text-5xl mb-4" />
            <h3 className="text-base font-bold text-[#081B3A] dark:text-white">
              {empty.title}
            </h3>
            <p className="text-xs text-gray-450 dark:text-gray-500 mt-1 max-w-xs">
              {empty.desc}
            </p>
          </div>
        ) : (
          filtered.map(notif => (
            <div
              key={notif.id}
              onClick={() => !notif.read && markAsRead(notif.id)}
              className={`bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/5 rounded-[20px] p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md ${
                !notif.read ? 'border-l-4 border-l-[#2563EB]' : ''
              }`}
            >
              <div className="flex items-start gap-4 text-left">
                {/* Icon Container */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${getBg(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#0F172A] dark:text-white leading-snug break-words">
                    {getMessage(notif)}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {notif.type === 'COLLAB_INVITED' && (
                  <>
                    <button
                      onClick={() => acceptCollab(notif)}
                      className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                    >
                      <FiCheck size={13} />
                      Accept
                    </button>
                    <button
                     onClick={() => declinedCollab(notif)}
                      className="px-3 py-1.5 rounded-lg border border-gray-250 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <FiX size={13} />
                      Decline
                    </button>
                  </>
                )}
                {!notif.read && notif.type !== 'COLLAB_INVITED' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notif.id);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-gray-250 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
