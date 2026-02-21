import axios from "axios";

export type ErrorResponse = {
  error: string;
};

const getApiUrl = () => {
  switch (process.env.NODE_ENV) {
    case "production":
      return process.env.NEXT_PUBLIC_API_URL ?? "https://prod_api_url_here";
    default:
      return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  }
};

const apiClient = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

export default apiClient;
