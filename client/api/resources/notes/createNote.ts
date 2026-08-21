import apiClient from "@/api/apiClient";

export const createNote = async (jobBoardEntryId: number, content: string) => {
  const response = await apiClient.post('/notes', {
    job_board_entry_id: jobBoardEntryId,
    content,
  });

  return response.data;
};
