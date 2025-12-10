import { toast } from 'sonner';
import Axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { getCookie } from '@/utils/storage';
import { API_BASE_URL } from '@/utils/const';
import { useSessionStore } from '@/stores/SessionStore';

function authRequestInterceptor(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const token = getCookie('access_token');

  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  config.headers.Accept = '*/*';

  return config;
}

export const axios = Axios.create({
  baseURL: API_BASE_URL,
  paramsSerializer: {
    indexes: null,
  },
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Use proper typing for interceptors
axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    const { status } = error.response;

    switch (status) {
      case 400:
        // Don't show generic toast for 400 errors - let components handle specific error messages
        break;
      case 401:
        if (window.location.pathname !== '/auth/login') {
          // Show session expiry popup instead of immediate redirect
          useSessionStore.getState().handleSessionExpiry();
        }
        break;
      case 403:
        break;
      case 404:
        break;
      case 500:
        break;
      default:
        break;
    }

    return Promise.reject(error);
  },
);

// Export types for use in other parts of the app
export type { AxiosError, AxiosRequestConfig, AxiosResponse };
