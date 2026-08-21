import { JobBoardEntry, JobStatus } from "@/lib/types";
import apiClient from "../../apiClient";

type CreateJobBoardEntryResponse = {
  job_board_entry: JobBoardEntry;
};

export const createJobBoardEntry = async (title: string, company: string, location: string, salary: string, url: string, status: JobStatus, description: string, tags: string[], closingDate?: Date): Promise<CreateJobBoardEntryResponse> => {
  const response = await apiClient.post('/job_board_entries', {
    title,
    company,
    location,
    salary,
    url,
    status,
    description,
    tags,
    closing_date: closingDate,
  });

  return response.data;
};
