// Central event contract for Socket.IO.
// Note: we do not change backend event names—this file only documents them.

export const Events = {
  Document: {
    USER_JOIN: 'userJoin',
    USER_LEFT: 'userLeft',
    USER_REMOVE: 'userRemove',
    SEND_OPERATION: 'sendOperation',
    RECEIVE_OPERATION: 'receiveOperation',
    VERSION_SAVED: 'versionSaved',
    ACTIVE_USERS: 'activeUser',
    NEW_USER_JOIN: 'newUserJoin',
  },
  Cursor: {
    CURSOR_UPDATE: 'cursorUpdate',
    CURSOR_CHANGE: 'cursorChange',
  },
  Chats: {
    SEND_CHAT: 'sendChat',
    RECIVED_CHAT: 'recivedChat',
  },
} as const;

export type EventName = string;

