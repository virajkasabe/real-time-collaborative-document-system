
export const loginType = Object.freeze({
  EMAIL_PASSWORD: "EMAIL_PASSWORD",
  GOOGLE: "GOOGLE",
});

export const DOCUMENT_ROLES = Object.freeze({
  VIEWER: "Viewer",
  EDITOR: "Editor",
  OWNER: "Owner",
});

export const DOCUMENT_ROLES_ENUM = Object.values(DOCUMENT_ROLES);

export const redisEvent = Object.freeze({
  ERROR: "error",
  CONNECT: "connect",
});

export const loginTypeEnum = Object.values(loginType);
