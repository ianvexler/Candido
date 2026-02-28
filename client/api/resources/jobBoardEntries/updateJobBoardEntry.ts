import { JobStatus } from "@/lib/types";
import apiClient from "../../apiClient";

export const updateJobBoardEntry = async (
  id: number,
  title: string,
  company: string,
  location: string,
  salary: string,
  url: string,
  description: string,
  status: JobStatus,
  number: number,
  tagNames?: string[]
) => {
  const response = await apiClient.put(`/api/job-board-entries/${id}`, {
    id,
    title,
    company,
    location,
    salary,
    url,
    description,
    status,
    number,
    tagNames,
  });
  return response.data;
};