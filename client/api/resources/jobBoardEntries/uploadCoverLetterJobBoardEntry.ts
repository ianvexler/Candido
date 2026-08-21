import apiClient from "@/api/apiClient";
import { JobBoardEntry } from "@/lib/types";

type UploadCoverLetterResponse = {
  job_board_entry: JobBoardEntry;
};

export const uploadCoverLetterJobBoardEntry = async (id: number, coverLetterText?: string, coverLetterFile?: File): Promise<UploadCoverLetterResponse> => {
  const formData = new FormData();
  if (coverLetterFile) {
    formData.append("file", coverLetterFile);
  }
  if (coverLetterText) {
    formData.append("cover_letter_text", coverLetterText);
  }

  const response = await apiClient.post(`/job_board_entries/${id}/cover_letter`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });
  return response.data;
};
