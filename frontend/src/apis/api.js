
import { apiClient } from "./index"


// ================= XXXX =================
// auth register, login , logout
// ================= XXXX =================

export const userRegister = (data) => {
    return apiClient.post("/auth/register",data)
}

export const verifyEmail = async(otp, token) => {
    return await apiClient.post(`/auth/verify-email${token}`, {otp, token})
}

export const verifyEmailRequest = async(email) => {
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

export const userRefreshTokenRefreshed = (data) => {
    return apiClient.post("/auth/refresh-token-refreshed", data)
}

export const userPasswordForgetRequest = (data) => {
    return apiClient.post("/auth/forgot-password-request", data)
}

export const forgetPassword = (unHashedToken, data) => {
    return apiClient.post(`/auth/reset-password/${unHashedToken}`,data)
}

export const changeUserCurrentPassword = (data) => {
    return apiClient.post(`/auth/update-current-password`,data)
}


// ================= XXXX =================
// collab invite, accept, declined 
// ================= XXXX =================

export const inviteCollab = (docId,data) => {
    return apiClient.post(`/collab/send-collab/${docId}`,data)
}

export const acceptCollab = (email,tokenId) => {
    return apiClient.post(`/collab/accept/email=${email}/join=${tokenId}`)
}

export const declinedCollab = (email,tokenId) => {
    return apiClient.post(`collab/decline/email=${email}/join=${tokenId}`)
}

// ================= XXXX =================
// docuement create, read, update, delete
// ================= XXXX =================

export const createDoc = (data) => {
    return apiClient.post(`/doc/create-doc`, data)
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

