import Axios, { type InternalAxiosRequestConfig } from "axios";

import { env } from "@/config/env";

function requestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = "application/json";
  }

  return config;
}

export const api = Axios.create({
  baseURL: env.API_URL
});

api.interceptors.request.use(requestInterceptor);
api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    return Promise.reject(error);
  }
);
