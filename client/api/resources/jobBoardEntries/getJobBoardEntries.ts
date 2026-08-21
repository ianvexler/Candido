import { JobBoardEntry } from "@/lib/types";
import apiClient from "../../apiClient";

type GetJobBoardEntriesResponse = {
  job_board_entries: JobBoardEntry[];
  is_empty: boolean;
};

export const getJobBoardEntries = async (): Promise<GetJobBoardEntriesResponse> => {
  const response = await apiClient.get('/job_board_entries');
  return response.data;
};
