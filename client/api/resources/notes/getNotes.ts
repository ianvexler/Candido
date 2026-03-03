import apiClient from "@/api/apiClient";
import { Note } from "@/lib/types";

type GetNotesResponse = {
  notes: Note[];
};

export const getNotes = async (jobBoardEntryId: number): Promise<GetNotesResponse> => {
  const response = await apiClient.get(`/api/notes/${jobBoardEntryId}`);
  return response.data;
};