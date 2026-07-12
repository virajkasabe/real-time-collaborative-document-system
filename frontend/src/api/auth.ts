import { http } from './http';

// These endpoints are expected to exist (backend already works). We only organize the client.

export function apiLogin(payload: { email: string; password?: string }) {
  return http.post('/auth/login', payload);
}

export function apiRegister(payload: { email: string; fullName: string; password?: string }) {
  return http.post('/auth/register', payload);
}

export function apiLogout() {
  return http.post('/auth/logout');
}

export function apiGetUser() {
  return http.get('/auth/me');
}

export function apiForgetPasswordRequest(payload: { email: string }) {
  return http.post('/auth/forgot-password/request', payload);
}

export function apiResetPassword(payload: { email: string; code: string; password?: string }) {
  return http.post('/auth/forgot-password/reset', payload);
}

