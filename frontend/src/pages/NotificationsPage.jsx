import React, { useState } from 'react';
import { FiBell, FiMail, FiUserCheck, FiUserX, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';
import { useNotifications } from '../context/NotificationContext';
import { useSocket } from '../context/SocketContext';
import { INVITATION_EVENT } from '../utils/constants';
<<<<<<< HEAD

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const [activeTab, setActiveTab] = useState('all');
  const { socket } = useSocket()
=======
import { useAuth } from '../context/AuthContext';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll, clearNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('all');
  const { socket } = useSocket()
  const { triggerToast } = useAuth()
>>>>>>> wind-breathing
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'invites', label: 'Invites' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'declined', label: 'Declined' }
  ];

<<<<<<< HEAD

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
  
=======
  const acceptCollab = (acceptNotif) => {
    markAsRead(acceptNotif.id)
    socket.emit(INVITATION_EVENT.ACCEPT_INVITATION, acceptNotif)
    triggerToast("User joined successfully", 'success')
    clearNotification(acceptNotif.notificationId)
  }

  const declinedCollab = (declineNotif) => {
    markAsRead(declineNotif.id)
    console.log("notification", notifications)
    socket.emit(INVITATION_EVENT.DECLINE_INVITATION, declineNotif)
    triggerToast("User declined the collaboration", 'fail')
    clearNotification(declineNotif.notificationId)
  }

>>>>>>> wind-breathing
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

<<<<<<< HEAD


=======
>>>>>>> wind-breathing
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
<<<<<<< HEAD
        return <FiMail className="text-[#2563EB] dark:text-blue-400 text-xl" />;
      case 'COLLAB_ACCEPTED':
        return <FiUserCheck className="text-green-500 text-xl" />;
      case 'COLLAB_DECLINED':
        return <FiUserX className="text-red-500 text-xl" />;
      default:
        return <FiBell className="text-gray-400 text-xl" />;
=======
        return <FiMail className="text-[#2563EB] dark:text-blue-400 text-lg sm:text-xl" />;
      case 'COLLAB_ACCEPTED':
        return <FiUserCheck className="text-green-500 text-lg sm:text-xl" />;
      case 'COLLAB_DECLINED':
        return <FiUserX className="text-red-500 text-lg sm:text-xl" />;
      default:
        return <FiBell className="text-gray-400 text-lg sm:text-xl" />;
>>>>>>> wind-breathing
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
<<<<<<< HEAD
        return `${n.inviterName} invited you to collaborate on "${n.docname}"`;
=======
        return `${n.senderName} invited you to collaborate on "${n.documentTitle}"`;
>>>>>>> wind-breathing
      case 'COLLAB_ACCEPTED':
        return `${n.accepterName} accepted your invite for "${n.docname}"`;
      case 'COLLAB_DECLINED':
        return `Invite for "${n.docname}" was declined`;
      default:
        return 'New notification';
    }
  };

  const filtered = getFilteredNotifications();
  const empty = getEmptyStateMessage();

  return (
<<<<<<< HEAD
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
=======
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-4xl w-full mx-auto select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[#E5E7EB] dark:border-white/10 pb-4 sm:pb-5 transition-all duration-300">
        <div className="text-left">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="font-sans font-extrabold text-lg sm:text-xl md:text-2xl text-[#081B3A] dark:text-white tracking-tight">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] sm:text-[11px] font-bold">
>>>>>>> wind-breathing
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] font-medium mt-1">
            Stay updated with your collaborative project activities
          </p>
        </div>

<<<<<<< HEAD
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3.5 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-white/10 text-xs font-bold text-[#081B3A] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer"
=======
        <div className="flex items-center gap-2 flex-wrap">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3 sm:px-3.5 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-white/10 text-[10px] sm:text-xs font-bold text-[#081B3A] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer whitespace-nowrap"
>>>>>>> wind-breathing
            >
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
<<<<<<< HEAD
              className="px-3.5 py-1.5 rounded-lg border border-red-200 dark:border-red-900/30 text-xs font-bold text-red-650 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/10 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
            >
              <FiTrash2 size={13} />
              Clear all
=======
              className="px-3 sm:px-3.5 py-1.5 rounded-lg border border-red-200 dark:border-red-900/30 text-[10px] sm:text-xs font-bold text-red-650 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/10 transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
            >
              <FiTrash2 size={13} />
              <span className="hidden xs:inline">Clear all</span>
>>>>>>> wind-breathing
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
<<<<<<< HEAD
      <div className="flex border-b border-gray-100 dark:border-white/5 pb-0.5 gap-2 scrollbar-none overflow-x-auto">
=======
      <div className="flex border-b border-gray-100 dark:border-white/5 pb-0.5 gap-1 sm:gap-2 scrollbar-none overflow-x-auto">
>>>>>>> wind-breathing
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
<<<<<<< HEAD
            className={`px-4 py-2 border-b-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
=======
            className={`px-2.5 sm:px-4 py-2 border-b-2 text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
>>>>>>> wind-breathing
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
<<<<<<< HEAD
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/5 rounded-[20px] p-12 text-center flex flex-col items-center justify-center shadow-sm transition-all duration-300">
            <FiBell className="text-gray-300 dark:text-gray-600 text-5xl mb-4" />
            <h3 className="text-base font-bold text-[#081B3A] dark:text-white">
              {empty.title}
            </h3>
            <p className="text-xs text-gray-450 dark:text-gray-500 mt-1 max-w-xs">
=======
      <div className="space-y-2 sm:space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/5 rounded-[20px] p-8 sm:p-12 text-center flex flex-col items-center justify-center shadow-sm transition-all duration-300">
            <FiBell className="text-gray-300 dark:text-gray-600 text-4xl sm:text-5xl mb-4" />
            <h3 className="text-sm sm:text-base font-bold text-[#081B3A] dark:text-white">
              {empty.title}
            </h3>
            <p className="text-xs text-gray-450 dark:text-gray-500 mt-1 max-w-xs px-4">
>>>>>>> wind-breathing
              {empty.desc}
            </p>
          </div>
        ) : (
          filtered.map(notif => (
            <div
              key={notif.id}
              onClick={() => !notif.read && markAsRead(notif.id)}
<<<<<<< HEAD
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
=======
              className={`bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/5 rounded-[16px] sm:rounded-[20px] p-3 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-all duration-300 hover:shadow-md ${
                !notif.read ? 'border-l-4 border-l-[#2563EB]' : ''
              }`}
            >
              <div className="flex items-start gap-3 sm:gap-4 text-left w-full">
                {/* Icon Container */}
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${getBg(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white leading-snug break-words">
                    {getMessage(notif)}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
                    {new Date(notif.expiry).toLocaleString()}
>>>>>>> wind-breathing
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
<<<<<<< HEAD
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
=======
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0 ml-auto sm:ml-0 w-full sm:w-auto justify-end">
>>>>>>> wind-breathing
                {notif.type === 'COLLAB_INVITED' && (
                  <>
                    <button
                      onClick={() => acceptCollab(notif)}
<<<<<<< HEAD
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
=======
                      className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-[10px] sm:text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm flex-1 sm:flex-none justify-center"
                    >
                      <FiCheck size={13} />
                      <span className="hidden xs:inline">Accept</span>
                    </button>
                    <button
                      onClick={() => declinedCollab(notif)}
                      className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-gray-250 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[10px] sm:text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex-1 sm:flex-none justify-center"
                    >
                      <FiX size={13} />
                      <span className="hidden xs:inline">Decline</span>
>>>>>>> wind-breathing
                    </button>
                  </>
                )}
                {!notif.read && notif.type !== 'COLLAB_INVITED' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notif.id);
                    }}
<<<<<<< HEAD
                    className="px-3 py-1.5 rounded-lg border border-gray-250 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Mark read
=======
                    className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-gray-250 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[10px] sm:text-xs font-bold cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex-1 sm:flex-none justify-center"
                  >
                    <span className="hidden xs:inline">Mark read</span>
                    <span className="xs:hidden">Read</span>
>>>>>>> wind-breathing
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
<<<<<<< HEAD

    </div>
  );
}
=======
    </div>
  );
}
>>>>>>> wind-breathing
