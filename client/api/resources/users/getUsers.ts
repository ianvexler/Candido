import apiClient from "@/api/apiClient";
import { User } from "@/lib/types";

type GetUsersResponse = { 
  users: User[] 
};

const getUsers = async (): Promise<GetUsersResponse> => {
  const response = await apiClient.get('/api/users');
  return response.data;
};

export default getUsers;