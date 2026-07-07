// Unified Constants configuration for CollabDocs system

export const BRAND_NAME = 'CollabDocs';

export const TEMPLATES = [
  { id: 'blank', name: 'Blank Page', icon: 'File', desc: 'Start with a clean canvas' },
  { id: 'proposal', name: 'Project Proposal', icon: 'Briefcase', desc: 'Structure pitches & estimates' },
  { id: 'minutes', name: 'Meeting Minutes', icon: 'Clock', desc: 'Summarize discussions & action items' },
  { id: 'spec', name: 'Product Spec Sheet', icon: 'FileText', desc: 'Define features & engineering specs' }
];

export const DOCUMENT_ROLES = Object.freeze({
  VIEWER: "Viewer",
  EDITOR: "Editor",
  OWNER: "Owner",
});

export const STORAGE_LIMIT = 5 * 1024 * 1024 * 1024; // 5 GB in bytes
export const INITIAL_STORAGE_USED = 1.84 * 1024 * 1024 * 1024; // 1.84 GB used

export const QUICK_ACTIONS = [
  { id: 'create', label: 'New Document', icon: 'Plus', bg: 'bg-[#0D6EFD]/10 text-[#0D6EFD]' },
  { id: 'template', label: 'Use Template', icon: 'FileText', bg: 'bg-emerald-500/10 text-emerald-500' },
  { id: 'share', label: 'Share Workspace', icon: 'Share2', bg: 'bg-amber-500/10 text-amber-500' },
  { id: 'settings', label: 'System Settings', icon: 'Settings', bg: 'bg-indigo-500/10 text-indigo-500' }
];

export const MOCK_NOTIFICATIONS = [
  { id: 'n-1', text: 'Sarah Connor invited you to product roadmap', time: '10m ago', type: 'invite', read: false },
  { id: 'n-2', text: 'System backup synchronized successfully', time: '1h ago', type: 'success', read: false },
  { id: 'n-3', text: 'Version history limit reached (100 revisions)', time: '1d ago', type: 'alert', read: true }
];

//  ?? ====== EVENTS =========
// *** SOCKET EVENT

export const SOCKET_EVENT = Object.freeze({
  ERROR: "error",
});

export const DOCUMENT_EVENT = Object.freeze({
  USER_JOIN: "userJoin",
  USER_LEFT: "userLeft",
  USER_REMOVE: "userRemove",
  SEND_OPERATION: "sendOperation",
  RECEIVE_OPERATION: "receiveOperation",
  VERSION_SAVED: "versionSaved",
  ACTIVE_USERS: "activeUser",
  NEW_USER_JOIN : "newUserJoin"
});

export const COLLABORATION_EVENT = Object.freeze({
  ACCEPT_COLLABORATION: "acceptCollaborationRequest",
  DECLINE_COLLABORATION: "declineCollaborationRequest",
});

export const COLLABORATION_ERROR_EVENT = Object.freeze({
  ERROR_ACCEPT_COLLABORATION: "errorAcceptCollaborationRequest",
  ERROR_DECLINE_COLLABORATION: "errorDeclineCollaborationRequest",
});

export const SEND_COLLABORATION_ERROR_EVENT = Object.freeze({
  SEND_COLLAB_ERROR : "sendCollabError"
})

export const NOTIFICATION_EVENT = Object.freeze({
  NOTIFICATION_SEND: "notificationSend",
  NOTIFICATION_RECIVED: "notificationRecived",
  SEND_REAL_TIME_NOTIFICATION: "sendRealTimeNotification",
  RECIVED_REAL_TIME_NOTIFICATION: "recivedRealTimeNotification",
});
  
export const INVITATION_EVENT = Object.freeze({
  ACCEPT_INVITATION: "acceptIneInvitation",
  DECLINE_INVITATION: "declineInvitation",
});

export const CONNECT_DISCONNET_EVENT = Object.freeze({
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  CONNECTED: "connected",
  SOCKET_ERROR: "socketError",
});

export const CURSOR_EVENT = Object.freeze({
  CURSOR_UPDATE: "cursorUpdate",
  CURSOR_CHANGE: "cursorChange",
});

export const ROLE_CHANGE = Object.freeze({
  ROLE_UPDATE: "roleUpdate",
});

export const CHATS_EVENT = Object.freeze({
  SEND_CHAT: "sendChat",
  RECIVED_CHAT : "recivedChat"
});
