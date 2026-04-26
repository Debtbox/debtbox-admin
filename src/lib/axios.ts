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
import { clearAuthTokens } from '@/utils/storage';
import { refreshAuthToken } from '@/features/auth/api/refreshAuthToken';

type RequestConfig = InternalAxiosRequestConfig & { _retry?: boolean; skipAuth?: boolean };

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (err: AxiosError) => void }> = [];

function processQueue(err: AxiosError | null) {
  failedQueue.forEach((prom) => (err ? prom.reject(err) : prom.resolve(undefined)));
  failedQueue = [];
}

function authRequestInterceptor(config: RequestConfig): RequestConfig {
  if (config.skipAuth) {
    config.headers.Accept = '*/*';
    return config;
  }
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

axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as RequestConfig | undefined;

    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    const { status } = error.response;
    const isLoginPage = window.location.pathname.includes('auth/login');

    if (status === 401 && originalRequest && !originalRequest._retry && !originalRequest.skipAuth && !isLoginPage) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axios(originalRequest));
      }
      originalRequest._retry = true;
      isRefreshing = true;

      return refreshAuthToken()
        .then(() => {
          processQueue(null);
          return axios(originalRequest);
        })
        .catch((refreshErr) => {
          processQueue(refreshErr as AxiosError);
          clearAuthTokens();
          useSessionStore.getState().handleSessionExpiry();
          return Promise.reject(refreshErr);
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    if (status === 401 && isLoginPage) {
      // Let login page handle (e.g. wrong credentials)
    } else if (status === 401) {
      useSessionStore.getState().handleSessionExpiry();
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (status === 400) {
      // Let components handle specific error messages
    }

    return Promise.reject(error);
  },
);

export type { AxiosError, AxiosRequestConfig, AxiosResponse };
