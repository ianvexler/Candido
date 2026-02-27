import apiClient from "@/api/apiClient";

export const deleteJobBoardEntry = async (id: number) => {
  const response = await apiClient.delete(`/api/job-board-entries/${id}`);
  return response.data;
};