//  ?? ====== EVENTS =========
// *** SOCKET EVENT

export const DOCUMENT_EVENT = Object.freeze({
  USER_JOIN : "userJoin",
  USER_LEFT : "userLeft",
  USER_REMOVE : "userRemove",
  SEND_OPERATION: "sendOperation",
  RECEIVE_OPERATION: "receiveOperation",
  VERSION_SAVED : "versionSaved"
});

export const COLLABORATION_EVENT = Object.freeze({
      ACCEPT_COLLABORATION : "acceptCollaborationRequest",
      DECLINE_COLLABORATION : "declineCollaborationRequest",
})


export const CONNECT_DISCONNET_EVENT = Object.freeze({
  CONNECTION: "connection",
  DISCONNECT: "Disconnect",
  CONNECT: "Connect",
  SOCKET_ERROR: "SocketError",
});

export const CURSOR_EVENT = Object.freeze({
    CURSOR_UPDATE: "cursorUpdate",
    CURSOR_CHANGE: "cursorChange",
});

export const ROLE_CHANGE = Object.freeze({
  ROLE_UPDATE: "RoleUpdate",
});
