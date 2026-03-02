import apiClient from "@/api/apiClient";
import { JobBoardEntriesStats } from "@/lib/types";

const getJobBoardEntriesStats = async (): Promise<JobBoardEntriesStats> => {
  const response = await apiClient.get('/api/job-board-entries/stats');
  return response.data;
};

export default getJobBoardEntriesStats;