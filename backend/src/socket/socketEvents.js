//  ?? ====== EVENTS =========
// *** SOCKET EVENT

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

export const ROLE_CHANGE = Object.freeze({
  ROLE_UPDATE: "Role_Update",
});
