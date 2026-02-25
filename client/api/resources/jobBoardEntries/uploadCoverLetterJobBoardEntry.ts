import apiClient from "@/api/apiClient";

export const uploadCoverLetterJobBoardEntry = async (id: number, coverLetterText?: string, coverLetterFile?: File) => {
  const formData = new FormData();
  if (coverLetterFile) {
    formData.append("file", coverLetterFile);
  }
  if (coverLetterText) {
    formData.append("coverLetterText", coverLetterText);
  }

  const response = await apiClient.post(`/api/job-board-entries/${id}/cover-letter`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });
  return response.data;
};