import { User } from "../types";
import { api } from "./api";
import { API_ENDPOINTS } from "../constants/api";

export const userService = {
  // Users
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get<User[]>(API_ENDPOINTS.USERS.BASE);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUser: async (id: string): Promise<User> => {
    try {
      const response = await api.get<User>(API_ENDPOINTS.USERS.BY_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
