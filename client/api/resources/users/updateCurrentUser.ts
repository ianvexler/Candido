import apiClient from "@/api/apiClient";

export const updateCurrentUser = async (setupCompleted: boolean) => {
  const response = await apiClient.put('/users', {
    setup_completed: setupCompleted,
  });

  return response.data;
};
