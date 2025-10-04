import React, { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
} from "@dnd-kit/core";
import { Plus, Search, User, CheckSquare, X, UserCircle } from "lucide-react";
import { useTasks } from "../../hooks/useTasks";
import { useAuth } from "../../hooks/useAuth";
import { useUsers } from "../../hooks/useUsers";
import {
  Task,
  TaskStatus,
  CreateTaskRequest,
  UserRole,
  TaskPriority,
} from "../../types";
import { TaskFormData } from "../../utils/validation";

// Type for drag end handler that receives complete task object
type TaskDragEndHandler = (updatedTask: Task, dragEvent: DragEndEvent) => void;

import DraggableTaskColumn from "../tasks/DraggableTaskColumn";
import DraggableTaskCard from "../tasks/DraggableTaskCard";
import TaskForm from "../tasks/TaskForm";

const Dashboard: React.FC = () => {
  const {
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getTasksByStatus,
  } = useTasks();
  const { user } = useAuth();
  const { users, loading: usersLoading, fetchUsers } = useUsers();

  // Local state
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | "">("");
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Fetch tasks and users on component mount
  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []); // Empty dependency array - only run on mount

  // Handle drag start
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const task = tasks.find((t) => t.id === active.id);
      setActiveTask(task || null);
    },
    [tasks]
  );

  // Handle drag end with complete task object
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) return;

      const taskId = active.id as string;
      const newStatus = over.id as TaskStatus;

      const task = tasks.find((t) => t.id === taskId);
      if (!task || task.status === newStatus) return;

      // Create updated task object with new status
      const updatedTask: Task = {
        ...task,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };

      // Call custom drag end handler with complete task object
      handleTaskDragEnd(updatedTask, event);

      setActiveTask(null);
    },
    [tasks]
  );

  // Custom drag end handler that receives the complete updated task object
  const handleTaskDragEnd: TaskDragEndHandler = useCallback(
    (updatedTask: Task, dragEvent: DragEndEvent) => {
      // Update task with complete task data including all fields
      updateTask(updatedTask.id, {
        title: updatedTask.title,
        description: updatedTask.description,
        priority: updatedTask.priority,
        assigneeId: updatedTask.assigneeId,
        status: updatedTask.status,
      });

      // Additional logic can be added here
      // This handler now receives the complete task object with updated status
      // You can access all task properties: updatedTask.id, updatedTask.title, etc.
      // dragEvent contains information about the drag operation if needed
      console.debug("Drag event completed:", { updatedTask, dragEvent });
    },
    [updateTask, tasks]
  );

  // Handle task form submission
  const handleTaskSubmit = useCallback(
    async (data: TaskFormData) => {
      if (editingTask) {
        // Update existing task
        await updateTask(editingTask.id, {
          title: data.title,
          description: data.description,
          priority: data.priority as TaskPriority,
          assigneeId: data.assigneeId,
        });
        setEditingTask(null);
      } else {
        // Create new task
        const createData: CreateTaskRequest = {
          title: data.title,
          description: data.description,
          priority: data.priority as TaskPriority,
          assigneeId: data.assigneeId,
        };
        await createTask(createData);
      }
    },
    [editingTask, updateTask, createTask]
  );

  // Handle task edit
  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  }, []);

  // Handle task delete
  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      if (window.confirm("Are you sure you want to delete this task?")) {
        await deleteTask(taskId);
      }
    },
    [deleteTask]
  );

  // Handle new task creation
  const handleNewTask = useCallback(() => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  }, []);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedAssignee("");
    setSelectedStatus("");
  }, []);

  // Handle inline task updates (title, description, and priority)
  const handleInlineUpdate = useCallback(
    async (
      taskId: string,
      updates: { title?: string; description?: string; priority?: TaskPriority }
    ) => {
      try {
        await updateTask(taskId, updates);
      } catch (error) {
        // Error is handled by the updateTask function
        console.error("Failed to update task:", error);
      }
    },
    [updateTask]
  );

  // Get available users for assignee filter based on role
  const getAvailableUsersForFilter = useCallback(() => {
    if (user?.role === UserRole.ADMIN) {
      return users; // Admin can see all users
    } else {
      return user ? [user] : []; // Regular users can only see themselves
    }
  }, [user, users]);

  // Function to populate assignee data in tasks
  const populateAssigneeData = useCallback(
    (tasksList: Task[]): Task[] => {
      return tasksList.map((task) => ({
        ...task,
        assignee: users.find((user) => user.id === task.assigneeId),
      }));
    },
    [users]
  );

  // Filter tasks based on search, assignee, and status
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAssignee =
      !selectedAssignee || task.assigneeId === selectedAssignee;
    const matchesStatus = !selectedStatus || task.status === selectedStatus;
    return matchesSearch && matchesAssignee && matchesStatus;
  });

  // Get tasks by status with assignee data populated
  const pendingTasks = populateAssigneeData(
    getTasksByStatus(TaskStatus.PENDING).filter((task) =>
      filteredTasks.some((t) => t.id === task.id)
    )
  );
  const inProgressTasks = populateAssigneeData(
    getTasksByStatus(TaskStatus.IN_PROGRESS).filter((task) =>
      filteredTasks.some((t) => t.id === task.id)
    )
  );
  const completedTasks = populateAssigneeData(
    getTasksByStatus(TaskStatus.COMPLETED).filter((task) =>
      filteredTasks.some((t) => t.id === task.id)
    )
  );

  const columns = [
    {
      status: TaskStatus.PENDING,
      title: "Pending",
      color: "border-blue-300 bg-blue-50",
      tasks: pendingTasks,
    },
    {
      status: TaskStatus.IN_PROGRESS,
      title: "In Progress",
      color: "border-yellow-300 bg-yellow-50",
      tasks: inProgressTasks,
    },
    {
      status: TaskStatus.COMPLETED,
      title: "Completed",
      color: "border-green-300 bg-green-50",
      tasks: completedTasks,
    },
  ];

  if ((loading && tasks.length === 0) || (usersLoading && users.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Drag and Drop Board */}
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((column) => (
            <DraggableTaskColumn
              key={column.status}
              status={column.status}
              title={column.title}
              color={column.color}
              tasks={column.tasks}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleInlineUpdate}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <DraggableTaskCard
              task={populateAssigneeData([activeTask])[0]}
              onEdit={() => {}}
              onDelete={() => {}}
              onUpdate={async () => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Form Modal */}
      <TaskForm
        task={editingTask}
        users={users}
        usersLoading={usersLoading}
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleTaskSubmit}
        isLoading={loading}
      />
    </div>
  );
};

export default Dashboard;
