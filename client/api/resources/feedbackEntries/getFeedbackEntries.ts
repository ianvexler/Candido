import apiClient from "@/api/apiClient";
import { FeedbackEntry } from "@/lib/types";

type GetFeedbackEntriesResponse = {
  feedback_entries: FeedbackEntry[];
};

const getFeedbackEntries = async (): Promise<GetFeedbackEntriesResponse> => {
  const response = await apiClient.get('/feedback_entries');
  return response.data;
};

export default getFeedbackEntries;
