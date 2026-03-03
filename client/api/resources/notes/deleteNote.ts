import apiClient from "@/api/apiClient";

export const deleteNote = async (id: number) => {
  const response = await apiClient.delete(`/api/notes/${id}`);
  return response.data;
};
