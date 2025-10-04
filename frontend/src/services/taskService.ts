import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  GetTasksRequest,
} from "../types";
import { api } from "./api";
import { API_ENDPOINTS } from "../constants/api";

export const taskService = {
  // Tasks
  getTasks: async (filters?: GetTasksRequest): Promise<Task[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.assigneeId) params.append("assignee", filters.assigneeId);

      const response = await api.get<Task[]>(`${API_ENDPOINTS.TASKS.BASE}?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTask: async (id: string): Promise<Task> => {
    try {
      const response = await api.get<Task>(API_ENDPOINTS.TASKS.BY_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createTask: async (taskData: CreateTaskRequest): Promise<Task> => {
    try {
      const response = await api.post<Task>(API_ENDPOINTS.TASKS.BASE, taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateTask: async (
    id: string,
    taskData: UpdateTaskRequest
  ): Promise<Task> => {
    try {
      const response = await api.put<Task>(API_ENDPOINTS.TASKS.BY_ID(id), taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteTask: async (id: string): Promise<void> => {
    try {
      await api.delete(API_ENDPOINTS.TASKS.BY_ID(id));
    } catch (error) {
      throw error;
    }
  },
};

export default taskService;
