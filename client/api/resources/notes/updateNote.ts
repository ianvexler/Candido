import apiClient from "@/api/apiClient";

export const updateNote = async (id: number, content: string) => {
  const response = await apiClient.put(`/notes/${id}`, {
    content,
  });
  return response.data;
};
