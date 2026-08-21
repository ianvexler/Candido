import apiClient from "@/api/apiClient";
import { JobBoardEntriesStats } from "@/lib/types";

const getJobBoardEntriesStats = async (): Promise<JobBoardEntriesStats> => {
  const response = await apiClient.get('/job_board_entries/stats');
  return response.data;
};

export default getJobBoardEntriesStats;
