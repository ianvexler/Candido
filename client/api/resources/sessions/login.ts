import apiClient from "@/api/apiClient";
import type { User } from "@/lib/types";

type LoginResponse = { user: User };

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>("/api/sessions", {
    email,
    password,
  });
  return { user: data.user };
};
