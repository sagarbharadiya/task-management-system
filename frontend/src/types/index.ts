// User related types
export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface User {
  id: string;
  username: string; // Changed from userName to username to match API
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string; // Made optional since API doesn't return it
}

// Task related types
export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  assignee?: User;
  createdAt: string;
  updatedAt: string;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Task request types
export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: TaskPriority;
  assigneeId: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  assigneeId?: string;
  status?: TaskStatus;
}

export interface GetTasksRequest {
  status?: TaskStatus;
  assigneeId?: string;
}

// Form validation types are now inferred from Zod schemas in validation.ts

// API Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Context types
export interface UserContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: (filters?: GetTasksRequest) => Promise<void>;
  createTask: (taskData: CreateTaskRequest) => Promise<void>;
  updateTask: (id: string, taskData: UpdateTaskRequest) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTasksByStatus: (status: TaskStatus) => Task[];
}
