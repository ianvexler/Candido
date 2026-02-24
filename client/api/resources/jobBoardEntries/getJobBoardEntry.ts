import apiClient from "@/api/apiClient";
import { JobBoardEntry } from "@/lib/types";

type GetJobBoardEntryResponse = {
  jobBoardEntry: JobBoardEntry;
};

export const getJobBoardEntry = async (id: string): Promise<GetJobBoardEntryResponse> => {
  const response = await apiClient.get(`/api/job-board-entries/${id}`);
  return response.data;
};
