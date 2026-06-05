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
  tagNames?: string[],
  closingDate?: Date | null
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
    closingDate,
  });
  return response.data;
};