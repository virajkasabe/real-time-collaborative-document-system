
export const loginType = Object.freeze({
<<<<<<< HEAD
  EMAIL_PASSWORD: "EMAIL_PASSWORD",
  GOOGLE: "GOOGLE",
=======
  EMAIL_PASSWORD: "Email Password",
  GOOGLE: "Google",
>>>>>>> wind-breathing
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
