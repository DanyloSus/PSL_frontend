import {
  queryOptions,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import axios from "axios";

import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

import {
  authResponseSchema,
  userPublicSchema,
  type AuthResponse,
  type LoginValues,
  type RegisterValues,
  type UserPublic
} from "../types/auth.schema";

async function fetchMe(): Promise<UserPublic | null> {
  try {
    const data = await api.get<UserPublic, UserPublic>("/auth/me");

    return userPublicSchema.parse(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
}

export const meQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.auth.me,
    queryFn: fetchMe,
    retry: false,
    staleTime: 1000 * 60 * 5
  });

async function registerRequest(values: RegisterValues): Promise<AuthResponse> {
  const data = await api.post<AuthResponse, AuthResponse>(
    "/auth/register",
    values
  );

  return authResponseSchema.parse(data);
}

async function loginRequest(values: LoginValues): Promise<AuthResponse> {
  const data = await api.post<AuthResponse, AuthResponse>(
    "/auth/login",
    values
  );

  return authResponseSchema.parse(data);
}

function logoutRequest() {
  return api.post("/auth/logout");
}

export function useRegister() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: registerRequest,
    onSuccess: data => {
      client.setQueryData(queryKeys.auth.me, data.user);
    }
  });
}

export function useLogin() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: data => {
      client.setQueryData(queryKeys.auth.me, data.user);
    }
  });
}

export function useLogout() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      client.clear();
    }
  });
}
