import Axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig
} from "axios";

import { env } from "@/config/env";
import { authEvents } from "@/lib/auth-events";
import { readCookie } from "@/utils/cookie";

const CSRF_COOKIE = "csrf_token";
const CSRF_HEADER = "X-CSRF-Token";
const REFRESH_PATH = "/auth/refresh";

type RetryConfig = InternalAxiosRequestConfig & { _retried?: boolean };

export const api = Axios.create({
  baseURL: env.API_URL,
  withCredentials: true
});

function requestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = "application/json";
    const csrf = readCookie(CSRF_COOKIE);
    if (csrf) {
      config.headers[CSRF_HEADER] = csrf;
    }
  }

  return config;
}

api.interceptors.request.use(requestInterceptor);

let isRefreshing = false;
let queue: Array<(error: AxiosError | null) => void> = [];

function flushQueue(error: AxiosError | null) {
  queue.forEach(callback => callback(error));
  queue = [];
}

async function refreshSession() {
  await api.post(REFRESH_PATH);
}

api.interceptors.response.use(
  response => response.data,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    const status = error.response?.status;
    const isRefreshCall = original?.url?.includes(REFRESH_PATH);

    if (status !== 401 || !original || original._retried || isRefreshCall) {
      if (status === 401 && isRefreshCall) {
        authEvents.emitUnauthenticated();
      }

      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push(queueError => {
          if (queueError) {
            reject(queueError);

            return;
          }
          original._retried = true;
          resolve(api(original as AxiosRequestConfig));
        });
      });
    }

    isRefreshing = true;

    try {
      await refreshSession();
      flushQueue(null);
      original._retried = true;

      return api(original as AxiosRequestConfig);
    } catch (refreshError) {
      flushQueue(refreshError as AxiosError);
      authEvents.emitUnauthenticated();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
