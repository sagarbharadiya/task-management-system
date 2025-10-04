import { useState, useCallback } from 'react';
import { User, ApiError } from '../types';
import userService from '../services/userService';
import toast from 'react-hot-toast';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await userService.getUsers();
      setUsers(usersData);
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message);
      toast.error(apiError.message || 'Failed to fetch users');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserById = useCallback((id: string): User | undefined => {
    return users.find(user => user.id === id);
  }, [users]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    getUserById,
  };
};
