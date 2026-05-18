<<<<<<< HEAD

export const loginType = Object.freeze({
  EMAIL_PASSWORD: "Email Password",
  GOOGLE: "Google",
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
=======
/*

    write here contanst variable

*/


export const loginType = {
      EMAIL_PASSWORD : "EMAIL_PASSWORD",
      GOOGLE : "GOOGLE"
}

export const docsUserType = {
  VIEWR : "Viwer",
  EDITOR : "Editor",
  OWNER : "Owner"
}


export const loginTypeEnum = Object.values(loginType)
export const docsUserTypeEnum = Object.values(docsUserType)



















//
>>>>>>> 49577a8 (docs(backend): add initial documentation comments for modules and utilities)
