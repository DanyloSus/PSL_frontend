import {
  queryOptions,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import axios from "axios";

import { api } from "@/lib/api";

import type {
  AuthResponse,
  LoginValues,
  RegisterValues,
  UserPublic
} from "../types/auth.schema";

export const authKeys = {
  me: ["auth", "me"] as const
};

async function fetchMe(): Promise<UserPublic | null> {
  try {
    return await api.get<UserPublic, UserPublic>("/auth/me");
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
}

export const meQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.me,
    queryFn: fetchMe,
    retry: false,
    staleTime: 1000 * 60 * 5
  });

function registerRequest(values: RegisterValues) {
  return api.post<AuthResponse, AuthResponse>("/auth/register", values);
}

function loginRequest(values: LoginValues) {
  return api.post<AuthResponse, AuthResponse>("/auth/login", values);
}

function logoutRequest() {
  return api.post("/auth/logout");
}

export function useRegister() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: registerRequest,
    onSuccess: data => {
      client.setQueryData(authKeys.me, data.user);
    }
  });
}

export function useLogin() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: data => {
      client.setQueryData(authKeys.me, data.user);
    }
  });
}

export function useLogout() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      client.setQueryData(authKeys.me, null);
      client.removeQueries();
    }
  });
}
