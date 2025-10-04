import { AuthResponse, LoginRequest, RegisterRequest } from "../types";
import { api, tokenManager } from "./api";
import { API_ENDPOINTS } from "../constants/api";

export const authService = {
  // Authentication
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
      tokenManager.setToken(response.data.token);
      tokenManager.setUser(response.data.user); // Store user details
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
      tokenManager.setToken(response.data.token);
      tokenManager.setUser(response.data.user); // Store user details
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: (): void => {
    tokenManager.clearAll(); // Clear both token and user details
  },
};

export default authService;
