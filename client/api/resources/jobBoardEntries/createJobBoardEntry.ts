import { JobStatus } from "@/lib/types";
import apiClient from "../../apiClient";

export const createJobBoardEntry = async (title: string, company: string, location: string, salary: string, url: string, status: JobStatus, description: string) => {
  const response = await apiClient.post('/api/job-board-entries', {
    title,
    company,
    location,
    salary,
    url,
    status,
    description,
  });

  return response.data;
};
