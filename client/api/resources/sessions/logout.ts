import apiClient from "@/api/apiClient";

type LogoutResponse = { message: string };

export const logout = async (): Promise<LogoutResponse> => {
  const { data } = await apiClient.delete<LogoutResponse>("/sessions");
  return data;
};
