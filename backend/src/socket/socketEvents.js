//  ?? ====== EVENTS =========
// *** SOCKET EVENT

export const DOCUMENT_EVENT = Object.freeze({
  JOIN_DOCUMENT: "joinDocument",
  LEAVE_DOCUMENT: "leaveDocument",
  LEFT_DOCUMENT: "leftDocument",
  CHANGE_DOCUMENT: "changeDocument",
  VIEW_DOCUMENT: "viewDocument",
});

export const CONNECT_DISCONNET_EVENT = Object.freeze({
  CONNECTION: "connection",
  DISCONNECT: "Disconnect",
  CONNECT: "Connect",
  SOCKET_ERROR: "Socket_Error",
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

export const ROLE_CHANGE = Object.freeze({
  ROLE_UPDATE: "Role_Update",
});
