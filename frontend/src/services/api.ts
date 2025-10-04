import axios, { AxiosResponse, AxiosError } from "axios";
import { ApiError } from "../types";
import { API_BASE_URL } from "../constants/api";

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

// Token and user management
const TOKEN_KEY = "auth_token";
const USER_KEY = "user_details";

// Utility function to decode JWT token and check expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // If we can't decode the token, consider it expired
  }
};

// Utility function to get token expiration time in milliseconds
const getTokenExpirationTime = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000; // Convert to milliseconds
  } catch (error) {
    console.error("Error getting token expiration:", error);
    return null;
  }
};

export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },
  getUser: (): any => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  },
  setUser: (user: any): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  removeUser: (): void => {
    localStorage.removeItem(USER_KEY);
  },
  clearAll: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  isTokenExpired: (): boolean => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return true;
    return isTokenExpired(token);
  },
  getTokenExpirationTime: (): number | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    return getTokenExpirationTime(token);
  },
  getTokenTimeRemaining: (): number => {
    const expirationTime = tokenManager.getTokenExpirationTime();
    if (!expirationTime) return 0;
    return Math.max(0, expirationTime - Date.now());
  },
};

// Centralized error handler
export const handleApiError = (error: AxiosError): ApiError => {
  console.error("API Error:", {
    message: error.message,
    code: error.code,
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
    url: error.config?.url,
    method: error.config?.method,
  });

  // Handle specific error cases
  if (error.response?.status === 401) {
    tokenManager.removeToken();
    window.location.href = "/login";
    return {
      message: "Authentication failed. Please login again.",
      status: 401,
      code: "UNAUTHORIZED",
    };
  }

  if (error.code === "NETWORK_ERROR" || error.message === "Network Error") {
    return {
      message:
        "Network error: Unable to connect to server. Please check if the server is running.",
      status: 0,
      code: "NETWORK_ERROR",
    };
  }

  if (error.code === "ECONNABORTED") {
    return {
      message: "Request timeout: Server is taking too long to respond.",
      status: 408,
      code: "TIMEOUT",
    };
  }

  // Default error handling
  return {
    message:
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred",
    status: error.response?.status,
    code: error.code,
  };
};

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();

    // Check if token exists and is not expired
    if (token && !tokenManager.isTokenExpired()) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token && tokenManager.isTokenExpired()) {
      // Token is expired, remove it and redirect to login
      console.warn("Token has expired, redirecting to login");
      performGlobalLogout("Your session has expired. Please login again.");
      return Promise.reject(new Error("Token expired"));
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Check if it's a 401 error (unauthorized) which typically means token expired
    if (error.response?.status === 401) {
      console.warn("Received 401 Unauthorized, token may be expired");
      performGlobalLogout("Authentication failed. Please login again.");
    }

    const apiError = handleApiError(error);
    return Promise.reject(apiError);
  }
);

// Global logout function that can be called from anywhere
export const performGlobalLogout = (message?: string): void => {
  // Clear all auth-related data from localStorage
  tokenManager.clearAll();

  // Show notification if message provided
  if (message) {
    // Import toast dynamically to avoid circular dependencies
    import("react-hot-toast").then(({ default: toast }) => {
      toast.error(message);
    });
  }

  // Redirect to login page
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

export default api;
