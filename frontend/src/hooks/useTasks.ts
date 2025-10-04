import { useState, useCallback } from "react";
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  GetTasksRequest,
  TaskStatus,
  ApiError,
} from "../types";
import taskService from "../services/taskService";
import toast from "react-hot-toast";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (filters?: GetTasksRequest): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const tasksData = await taskService.getTasks(filters);
      setTasks(tasksData);
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message);
      toast.error(apiError.message || "Failed to fetch tasks");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData: CreateTaskRequest): Promise<Task> => {
    try {
      setLoading(true);
      setError(null);
      const newTask = await taskService.createTask(taskData);
      setTasks((prev) => [...prev, newTask]);
      toast.success("Task created successfully!");
      return newTask;
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message);
      toast.error(apiError.message || "Failed to create task");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (
    id: string,
    taskData: UpdateTaskRequest
  ): Promise<Task> => {
    try {
      setLoading(true);
      setError(null);
      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
      toast.success("Task updated successfully!");
      return updatedTask;
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message);
      toast.error(apiError.message || "Failed to update task");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success("Task deleted successfully!");
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message);
      toast.error(apiError.message || "Failed to delete task");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTasksByStatus = useCallback((status: TaskStatus): Task[] => {
    return tasks.filter((task) => task.status === status);
  }, [tasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getTasksByStatus,
  };
};
