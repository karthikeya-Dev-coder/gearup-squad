import { UserRole } from '@/types';
import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '@/lib/api';

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  isTransitioning: boolean;
  loaderMessage: string;
  error: string | null;
  login: (email: string, password?: string, expectedRole?: string) => Promise<{ success: boolean; role?: string }>;
  logout: () => void;
  detectRole: (email: string) => UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(() => {
    const savedUser = typeof window !== 'undefined' ? sessionStorage.getItem('sportsSyncUser') : null;
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('Loading...');
  const [error, setError] = useState<string | null>(null);

  const detectRole = useCallback((email: string): UserRole | null => {
    if (email.includes('admin')) return 'admin';
    if (email.includes('staff') || ['priya', 'amit', 'sneha', 'vikram'].some(n => email.includes(n))) return 'staff';
    if (email.includes('student') || ['arjun', 'kavya', 'rohan', 'meera'].some(n => email.includes(n))) return 'student';
    return null;
  }, []);

  const login = useCallback(async (email: string, password?: string, expectedRole?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      // Validate role BEFORE showing loader or saving session
      if (expectedRole && userData.role !== expectedRole) {
        throw new Error(`Invalid credentials. Please verify your login type and try again.`);
      }

      sessionStorage.setItem('sportsSyncToken', token);
      sessionStorage.setItem('sportsSyncUser', JSON.stringify(userData));

      // Show full-screen transition loader before entering dashboard
      setLoaderMessage(`Welcome back! Entering ${userData.role} portal...`);
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 1800));
      setIsTransitioning(false);

      setUser(userData);
      return { success: true, role: userData.role as string };
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Invalid credentials. Please try again.');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoaderMessage('Signing out securely...');
    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsTransitioning(false);
    setUser(null);
    sessionStorage.removeItem('sportsSyncUser');
    sessionStorage.removeItem('sportsSyncToken');
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isTransitioning, loaderMessage, error, login, logout, detectRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
