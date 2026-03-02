import { JobBoardEntry } from "@/lib/types";
import apiClient from "../../apiClient";

type GetJobBoardEntriesResponse = {
  jobBoardEntries: JobBoardEntry[];
  isEmpty: boolean;
};

export const getJobBoardEntries = async (): Promise<GetJobBoardEntriesResponse> => {
  const response = await apiClient.get('/api/job-board-entries');
  return response.data;
};
