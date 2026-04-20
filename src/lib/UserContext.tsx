import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

interface UserContextType {
  users: User[];
  isLoading: boolean;
  error: string | null;
  addUser: (user: Partial<User>) => Promise<void>;
  updateUser: (user: Partial<User> & { id: string }) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  bulkImportUsers: (students: Partial<User>[], sendCredentials: boolean) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem('sportsSyncToken');
    if (!token) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to fetch users');
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const addUser = async (userData: Partial<User>) => {
    try {
      const response = await api.post('/users', userData);
      setUsers(prev => [...prev, response.data]);
      toast.success('User added successfully');
    } catch (err: any) {
      console.error('Error adding user:', err);
      toast.error(err.response?.data?.message || 'Failed to add user');
      throw err;
    }
  };

  const updateUser = async (updatedData: Partial<User> & { id: string }) => {
    try {
      const response = await api.patch(`/users/${updatedData.id}`, updatedData);
      setUsers(prev => prev.map(u => u.id === updatedData.id ? response.data : u));
      toast.success('User updated successfully');
    } catch (err: any) {
      console.error('Error updating user:', err);
      toast.error(err.response?.data?.message || 'Failed to update user');
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('User deleted successfully');
    } catch (err: any) {
      console.error('Error deleting user:', err);
      toast.error(err.response?.data?.message || 'Failed to delete user');
      throw err;
    }
  };

  const bulkImportUsers = async (students: Partial<User>[], sendCredentials: boolean) => {
    try {
      const response = await api.post('/users/bulk-import', { students, sendCredentials });
      // Results summary could be handled here if needed, but for now we refresh
      await fetchUsers();
      const importedCount = response.data.filter((r: any) => r.status === 'imported').length;
      toast.success(`Successfully imported ${importedCount} students`);
    } catch (err: any) {
      console.error('Error bulk importing users:', err);
      toast.error(err.response?.data?.message || 'Failed to bulk import students');
      throw err;
    }
  };

  return (
    <UserContext.Provider value={{ 
      users, 
      isLoading, 
      error, 
      addUser, 
      updateUser, 
      deleteUser, 
      bulkImportUsers,
      refreshUsers: fetchUsers 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
}

