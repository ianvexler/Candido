import apiClient from "@/api/apiClient";

export const deleteNote = async (id: number) => {
  const response = await apiClient.delete(`/notes/${id}`);
  return response.data;
};
