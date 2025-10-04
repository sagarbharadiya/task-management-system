import { useState, useEffect, useRef } from 'react';
import { User, LoginRequest, RegisterRequest, ApiError } from '../types';
import authService from '../services/authService';
import { tokenManager, performGlobalLogout } from '../services/api';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const tokenCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Function to check token expiration and logout if needed
  const checkTokenExpiration = () => {
    if (tokenManager.isTokenExpired()) {
      console.warn('Token expired, logging out automatically');
      performGlobalLogout('Session expired. Please login again.');
    }
  };

  // Function to setup periodic token checking
  const setupTokenValidation = () => {
    // Clear any existing interval
    if (tokenCheckInterval.current) {
      clearInterval(tokenCheckInterval.current);
    }

    // Check token every 30 seconds
    tokenCheckInterval.current = setInterval(checkTokenExpiration, 30000);
  };

  // Initialize auth state
  useEffect(() => {
    const token = tokenManager.getToken();
    const storedUser = tokenManager.getUser();
    
    if (token && !tokenManager.isTokenExpired() && storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
      setupTokenValidation();
    } else if (token && tokenManager.isTokenExpired()) {
      // Token exists but is expired, clear all data
      tokenManager.clearAll();
      console.warn('Found expired token on initialization, clearing all auth data');
    } else if (token && !storedUser) {
      // Token exists but no user data, clear token
      tokenManager.removeToken();
      console.warn('Found token without user data, clearing token');
    }
    setIsLoading(false);

    // Cleanup interval on unmount
    return () => {
      if (tokenCheckInterval.current) {
        clearInterval(tokenCheckInterval.current);
      }
    };
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      setupTokenValidation(); // Start token validation after successful login
      toast.success('Login successful!');
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      setUser(response.user);
      setIsAuthenticated(true);
      setupTokenValidation(); // Start token validation after successful registration
      toast.success('Registration successful!');
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    // Clear token validation interval
    if (tokenCheckInterval.current) {
      clearInterval(tokenCheckInterval.current);
      tokenCheckInterval.current = null;
    }
    
    // Clear local state immediately
    setUser(null);
    setIsAuthenticated(false);
    
    // Use performGlobalLogout to handle localStorage cleanup and navigation
    performGlobalLogout('Logged out successfully');
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };
};
