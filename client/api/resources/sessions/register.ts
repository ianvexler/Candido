import apiClient from "@/api/apiClient";
import { User } from "@/lib/types";

type RegisterResponse = { user: User };

export const register = async (email: string, password: string, name: string): Promise<RegisterResponse> => {
  const { data } = await apiClient.post<RegisterResponse>("/api/sessions/register", { email, password, name });
  return { user: data.user };
};
