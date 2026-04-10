import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types';
import * as api from '@/services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password?: string, otp?: string) => Promise<boolean>;
  logout: () => void;
  detectRole: (email: string) => UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectRole = useCallback((email: string): UserRole | null => {
    if (email.includes('admin')) return 'admin';
    if (email.includes('staff') || ['priya', 'amit', 'sneha', 'vikram'].some(n => email.includes(n))) return 'staff';
    if (email.includes('student') || ['arjun', 'kavya', 'rohan', 'meera'].some(n => email.includes(n))) return 'student';
    return null;
  }, []);

  const login = useCallback(async (email: string, password?: string, otp?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.login(email, password, otp);
      if (result) {
        setUser(result);
        return true;
      }
      setError('Invalid credentials. Please try again.');
      return false;
    } catch {
      setError('Something went wrong. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout, detectRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
