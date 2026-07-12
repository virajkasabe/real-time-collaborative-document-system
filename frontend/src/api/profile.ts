import { http } from './http';

export function apiUpdateProfile(payload: any) {
  return http.put('/profile', payload);
}

export function apiUploadAvatar(formData: FormData) {
  return http.post('/profile/avatar', formData);
}

export function apiChangePassword(payload: { currentPassword: string; newPassword: string }) {
  return http.post('/profile/change-password', payload);
}

