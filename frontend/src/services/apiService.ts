// Main API service that combines all individual services
import authService from "./authService";
import userService from "./userService";
import taskService from "./taskService";

export const apiService = {
  // Authentication
  login: authService.login,
  register: authService.register,
  logout: authService.logout,

  // Tasks
  getTasks: taskService.getTasks,
  getTask: taskService.getTask,
  createTask: taskService.createTask,
  updateTask: taskService.updateTask,
  deleteTask: taskService.deleteTask,

  // Users
  getUsers: userService.getUsers,
  getUser: userService.getUser,
};

export default apiService;
