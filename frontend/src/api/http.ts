import axios, { AxiosError, AxiosInstance } from 'axios';

const baseAPIURL = (import.meta as any).env?.VITE_API_URL || (import.meta as any).env?.VITE_SERVER_URI || '/api/v1/rtcds';

export type ApiErrorShape = {
  message?: string;
  errors?: unknown;
};

export const http: AxiosInstance = axios.create({
  baseURL: baseAPIURL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

function getStoredAccessToken(): string | null {
  try {
    const raw = localStorage.getItem('accessToken');
    if (!raw) return null;
    return raw;
  } catch {
    return null;
  }
}

http.interceptors.request.use((config) => {
  const token = getStoredAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    // Only set if backend expects bearer tokens.
    (config.headers as any).Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    if (config.headers) {
      delete (config.headers as any)['Content-Type'];
    }
  }

  return config;
});

http.interceptors.response.use(
  (res) => res,
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    const data = error.response?.data as ApiErrorShape | undefined;

    const message =
      data?.message ||
      (typeof error.message === 'string' ? error.message : null) ||
      'Request failed';

    if (status === 401 || status === 403) {
      // Keep behavior compatible with existing app. Actual redirect is handled in contexts currently.
      try {
        localStorage.clear();
      } catch {
        // ignore
      }
    }

    return Promise.reject({
      status,
      data,
      message,
      originalError: error,
    });
  }
);

