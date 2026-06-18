
import { apiClient } from "./index"

// ================= ---- =================
// auth register, login , logout
// ================= ---- =================

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


// ================= ---- =================
// collab invite, accept, declined 
// ================= ---- =================

export const inviteCollab = ( { docId, ...data}) => {
    console.log("docId", docId, "data", data)
    return apiClient.post(`/collab/send-collab/${docId}`,data)
}

export const acceptCollab = (email,tokenId) => {
    return apiClient.post(`/collab/accept/email=${email}/join=${tokenId}`)
}

export const declinedCollab = (email,tokenId) => {
    return apiClient.post(`collab/decline/email=${email}/join=${tokenId}`)
}

// ================= ---- =================
// docuement create, read, update, delete
// ================= ---- =================

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

export const docMoveToTrash = (docId) => {
    return apiClient.delete(`/doc/move-trash/${docId}`)
}

export const deleteDoc = (docId) => {
    return apiClient.delete(`/doc/delete/${docId}`)
}

