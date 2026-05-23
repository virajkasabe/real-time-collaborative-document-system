//  ?? ====== EVENTS =========
// *** SOCKET EVENT

<<<<<<< HEAD
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


export const NOTIFICATION_ERROR = Object.freeze({
  
})

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
=======
export const DOCUMENT_EVENT = Object.freeze({
  JOIN_DOCUMENT: "Join_Document",
  LEAVE_DOCUMENT: "Leave_Document",
  LEFT_DOCUMENT: "Left_Document",
  EDIT_DOCUMENT: "Edit_Document",
  VIEW_DOCUMENT: "View_Document",
});

export const CONNECT_DISCONNET_EVENT = Object.freeze({
  CONNECTION: "Connection",
  DISCONNECT: "Disconnect",
  CONNECT: "Connect",
  SOCKET_ERROR: "Sokcet_Error",
});

export const CURSOR_EVENT = Object.freeze({
  CURSOR_MOVE: "Cursor_Move",
});

export const COLLAB_EVENT = Object.freeze({
  JOINT_COLLABORATION: "Join_Collaboration",
  LEFT_COLLABORATION: "Left_Collaboration",
  REMOVE_FROM_COLLABORATION: "Remove_From_Collaboration",
});

export const TYPEING_EVENT = Object.freeze({
  START_TYPING: "Start_Typing",
  STOP_TYPING: "Stop_Typing",
});

export export const ROLE_CHANGE = Object.freeze({
  ROLE_UPDATE: "Role_Update",
>>>>>>> f7ad83d (feat(backend): implement core backend functionality with environment configuration, database connection, and socket integration)
});
