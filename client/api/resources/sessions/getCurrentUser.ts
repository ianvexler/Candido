import apiClient from "@/api/apiClient";
import type { User } from "@/lib/types";

type MeResponse = { user: User };

export const getCurrentUser = async (): Promise<MeResponse> => {
  const { data } = await apiClient.get<MeResponse>("/api/sessions/me");
  return { user: data.user };
};
