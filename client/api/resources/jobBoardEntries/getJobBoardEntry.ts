import apiClient from "@/api/apiClient";
import { JobBoardEntry } from "@/lib/types";

type GetJobBoardEntryResponse = {
  job_board_entry: JobBoardEntry;
};

export const getJobBoardEntry = async (id: string): Promise<GetJobBoardEntryResponse> => {
  const response = await apiClient.get(`/job_board_entries/${id}`);
  return response.data;
};
