import apiClient from "@/api/apiClient";
import { JobBoardEntry } from "@/lib/types";

type UploadCVResponse = {
  job_board_entry: JobBoardEntry;
};

export const uploadCVJobBoardEntry = async (id: number, cvText?: string, cvFile?: File): Promise<UploadCVResponse> => {
  const formData = new FormData();
  if (cvFile) {
    formData.append("file", cvFile);
  }
  if (cvText) {
    formData.append("cv_text", cvText);
  }

  const response = await apiClient.post(`/job_board_entries/${id}/cv`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });
  return response.data;
};
