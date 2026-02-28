import apiClient from "@/api/apiClient";

type RegisterResponse = { user: { id: number }; message: string };

export const register = async (email: string, password: string, name: string): Promise<RegisterResponse> => {
  const { data } = await apiClient.post<RegisterResponse>("/api/sessions/register", { email, password, name });
  return data;
};
