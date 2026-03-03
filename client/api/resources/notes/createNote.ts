import apiClient from "@/api/apiClient";

export const createNote = async (jobBoardEntryId: number, content: string) => {
  const response = await apiClient.post('/api/notes', {
    jobBoardEntryId,
    content,
  });

  return response.data;
};
