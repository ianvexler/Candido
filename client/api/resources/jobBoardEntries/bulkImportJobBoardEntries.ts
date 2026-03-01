import { JobStatus } from "@/lib/types";
import apiClient from "../../apiClient";

export type BulkImportEntry = {
  title: string;
  company: string;
  location?: string;
  salary?: string;
  url?: string;
  description?: string;
  status: JobStatus;
};

export const bulkImportJobBoardEntries = async (entries: BulkImportEntry[]) => {
  const response = await apiClient.post("/api/job-board-entries/import", { entries });
  return response.data;
};
