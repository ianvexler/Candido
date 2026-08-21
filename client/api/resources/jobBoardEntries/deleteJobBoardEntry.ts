import apiClient from "@/api/apiClient";

export const deleteJobBoardEntry = async (id: number) => {
  const response = await apiClient.delete(`/job_board_entries/${id}`);
  return response.data;
};
