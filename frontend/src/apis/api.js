<<<<<<< HEAD

import { apiClient } from "./index"
=======
import { apiClient, baseAPIURL } from "./index"
>>>>>>> wind-breathing

// ?? =============================================
// auth register, login , logout
// ?? =============================================

export const userRegister = (data) => {
    return apiClient.post("/auth/register",data)
}

export const verifyUserEmail = async(otp, email) => {
    return await apiClient.post(`/auth/verify-email`, {otp, email})
}

export const verifyUserEmailRequest = async(email) => {
    return await apiClient.post(`/auth/verify-email-request`, {email})
}

export const userLogin = async (data) => {
    return await apiClient.post("/auth/login",data)
}

<<<<<<< HEAD
=======
// ?? NOT FOR GOOD PRACTICS ONLY FOR TESTING ENVIROMENT 
export const googleLoginApi = `${baseAPIURL}/callback/google`


>>>>>>> wind-breathing
export const userLogout = () => {
    return apiClient.get("/auth/logout")
}

export const getUser = () => {
    return apiClient.get("/auth/getme")
}

export const updateUserProfile = (data) => {
    return apiClient.post("/auth/update-profile", data)
}

export const userForgetPasswordRequest = (data) => {
<<<<<<< HEAD
=======
    console.log("data",data)
>>>>>>> wind-breathing
    return apiClient.post("/auth/forgot-password-request", data)
}

export const userForgetPassword = (unHashedToken, data) => {
    return apiClient.post(`/auth/reset-password/${unHashedToken}`,data)
}

export const changeUserCurrentPassword = (data) => {
    return apiClient.post(`/auth/update-current-password`,data)
}

export const userAccessTokenRefreshed = (data) => {
    return apiClient.post("/auth/access-token-refreshed", data)
}

export const userRefreshTokenRefreshed = (data) => {
    return apiClient.post("/auth/refresh-token-refreshed", data)
}

<<<<<<< HEAD

=======
>>>>>>> wind-breathing
// ?? =============================================
// collab invite, accept, declined 
// ?? =============================================

export const inviteCollab = ( { docId, ...data}) => {
    console.log("docId", docId, "data", data)
    return apiClient.post(`/collab/send-collab/${docId}`,data)
}

export const acceptCollab = (email,tokenId) => {
    return apiClient.post(`/collab/accept/email=${email}/join=${tokenId}`)
}

export const declinedCollab = (email,tokenId) => {
<<<<<<< HEAD
    return apiClient.post(`collab/decline/email=${email}/join=${tokenId}`)
}



=======
    return apiClient.post(`/collab/decline/email=${email}/join=${tokenId}`)
}

>>>>>>> wind-breathing
// ?? =============================================
// docuement create, read, update, delete
// ??  =============================================

export const createDoc = (data) => {
    console.log("data", data)
    return apiClient.post("/doc/create-doc", data)
}

export const fetchDocumentFolder = () => {
    return apiClient.get(`/doc/fetch-folder`)
}

export const fetchDoc = (docId) => {
    return apiClient.get(`/doc/fetch-doc/${docId}`)
}

export const sharedWithMeDocs = () => {
    return apiClient.get("/doc/shared-with-me-docs")
}

<<<<<<< HEAD
=======
export const fetchTrashFolder = () => {
    return apiClient.get(`/doc/trash/folder`)
}

>>>>>>> wind-breathing
export const restoreDoc = (docId) => {
    return apiClient.put(`/doc/restore-doc/${docId}`)
}

<<<<<<< HEAD

=======
>>>>>>> wind-breathing
// !! =============================================
// !!        DENGET ZONE
// !! =============================================

// !! user
export const deleteUserAccount = (userId) => {
    return apiClient.delete(`/auth/delete/${userId}` )
}

<<<<<<< HEAD
// !! docs
=======
// !! docs move trash
>>>>>>> wind-breathing
export const docMoveToTrash = (docId) => {
    return apiClient.delete(`/doc/move-trash/${docId}`)
}

<<<<<<< HEAD
=======
// !! docs delete document
>>>>>>> wind-breathing
export const deleteDoc = (docId) => {
    return apiClient.delete(`/doc/delete/${docId}`)
}

<<<<<<< HEAD
=======


>>>>>>> wind-breathing
