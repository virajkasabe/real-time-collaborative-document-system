// Authentication APIs and simulated endpoints for CollabDocs

import { apiClient } from './api';

export const authService = {
  login: async (email, password) => {
    return apiClient.post('/auth/login', { email, password });
  },
  
  register: async (email, name, password) => {
    return apiClient.post('/auth/register', { email, name, password });
  },

  forgotPassword: async (email) => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  resetPassword: async (email, code, newPassword) => {
    return apiClient.post('/auth/reset-password', { email, code, newPassword });
  }
};
