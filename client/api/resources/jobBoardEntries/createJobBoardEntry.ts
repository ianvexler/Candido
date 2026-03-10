import { JobStatus } from "@/lib/types";
import apiClient from "../../apiClient";

export const createJobBoardEntry = async (title: string, company: string, location: string, salary: string, url: string, status: JobStatus, description: string, tags: string[]) => {
  const response = await apiClient.post('/api/job-board-entries', {
    title,
    company,
    location,
    salary,
    url,
    status,
    description,
    tags,
  });

  return response.data;
};
