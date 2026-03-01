import apiClient from "@/api/apiClient";

export const updateCurrentUser = async (setupCompleted: boolean) => {
  const response = await apiClient.put('/api/users', {
    setupCompleted,
  });

  return response.data;
};