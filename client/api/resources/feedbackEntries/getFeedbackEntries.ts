import apiClient from "@/api/apiClient";

const getFeedbackEntries = async () => {
  const response = await apiClient.get('/api/feedback-entries');
  return response.data;
};

export default getFeedbackEntries;