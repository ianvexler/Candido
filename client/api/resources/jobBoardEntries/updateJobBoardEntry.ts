import { JobBoardEntry, JobStatus } from "@/lib/types";
import apiClient from "../../apiClient";

type UpdateJobBoardEntryResponse = {
  job_board_entry: JobBoardEntry;
};

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
): Promise<UpdateJobBoardEntryResponse> => {
  const response = await apiClient.put(`/job_board_entries/${id}`, {
    id,
    title,
    company,
    location,
    salary,
    url,
    description,
    status,
    number,
    tag_names: tagNames,
    closing_date: closingDate,
  });
  return response.data;
};
