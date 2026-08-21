import apiClient from "@/api/apiClient";
import { FeedbackType } from "@/lib/types";

export const createFeedbackEntry = async (title: string, content: string, type: FeedbackType) => {
  const response = await apiClient.post('/feedback_entries', {
    title,
    content,
    type,
  });

  return response.data;
};
