import apiClient from "@/api/apiClient";

export const uploadCVJobBoardEntry = async (id: number, cvText?: string, cvFile?: File) => {
  const formData = new FormData();
  if (cvFile) {
    formData.append("file", cvFile);
  }
  if (cvText) {
    formData.append("cvText", cvText);
  }

  const response = await apiClient.post(`/api/job-board-entries/${id}/cv`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });
  return response.data;
};