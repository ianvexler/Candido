import apiClient from "@/api/apiClient";

export const getFileUpload = async (filename: string): Promise<Blob> => {
  const response = await apiClient.get(`/uploads/${filename}`, {
    responseType: "blob",
  });
  return response.data;
};