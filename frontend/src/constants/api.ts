// API Configuration
export const API_BASE_URL =
  (import.meta as any).env.VITE_API_BASE_URL || "https://localhost:7004/api";

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },

  // Task endpoints
  TASKS: {
    BASE: "/tasks",
    BY_ID: (id: string) => `/tasks/${id}`,
  },

  // User endpoints
  USERS: {
    BASE: "/users",
    BY_ID: (id: string) => `/users/${id}`,
  },
} as const;
