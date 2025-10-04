import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2 } from 'lucide-react';
import { Task, TaskPriority, User, UserRole } from '../../types';
import { TaskFormData, taskSchema } from '../../utils/validation';
import { useAuth } from '../../hooks/useAuth';

interface TaskFormProps {
  task?: Task | null;
  users: User[];
  usersLoading?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  isLoading: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  users,
  usersLoading = false,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const { user: currentUser } = useAuth();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: TaskPriority.MEDIUM,
      assigneeId: '',
    },
  });

  // Determine if user can assign tasks to others - memoized to prevent unnecessary re-renders
  const canAssignToOthers = useMemo(() => {
    return currentUser?.role === UserRole.ADMIN;
  }, [currentUser?.role]);
  
  // Get available users for assignment - memoized to prevent infinite re-renders
  const availableUsers = useMemo(() => {
    return canAssignToOthers ? users : (currentUser ? [currentUser] : []);
  }, [canAssignToOthers, users, currentUser]);

  useEffect(() => {
    // Only reset form when modal is open and we have the necessary data
    if (!isOpen) return;
    
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        priority: task.priority,
        assigneeId: task.assigneeId,
      });
    } else {
      reset({
        title: '',
        description: '',
        priority: TaskPriority.MEDIUM,
        assigneeId: availableUsers.length > 0 ? availableUsers[0].id : '',
      });
    }
  }, [task, availableUsers, reset, isOpen]);

  const handleFormSubmit = async (data: TaskFormData) => {
    try {
      await onSubmit(data);
      onClose();
      reset();
    } catch (error) {
      // Error is handled in the parent component
    }
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  if (!isOpen) return null;

  // Don't render if users are still loading or no current user
  if (usersLoading || (!canAssignToOthers && !currentUser)) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="ml-3 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              {...register('title')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter task description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority *
            </label>
            <select
              {...register('priority')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value={TaskPriority.LOW}>Low</option>
              <option value={TaskPriority.MEDIUM}>Medium</option>
              <option value={TaskPriority.HIGH}>High</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
            )}
          </div>

          {canAssignToOthers ? (
            <div>
              <label htmlFor="assigneeId" className="block text-sm font-medium text-gray-700 mb-1">
                Assignee *
              </label>
              <select
                {...register('assigneeId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select an assignee</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
              {errors.assigneeId && (
                <p className="mt-1 text-sm text-red-600">{errors.assigneeId.message}</p>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignee
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                {currentUser?.username} ({currentUser?.email})
              </div>
              <p className="mt-1 text-xs text-gray-500">
                As a regular user, you can only assign tasks to yourself.
              </p>
              {/* Hidden input to set assigneeId to current user */}
              <input
                {...register('assigneeId')}
                type="hidden"
                value={currentUser?.id || ''}
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{task ? 'Update Task' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;

