import { User, Equipment, Booking, Warning, ActivityLog, UserRole } from '@/types';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { initialUsers } from '@/lib/UserContext';




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
  // Check if user session exists in localStorage on initial load
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem('sportsSyncUser') : null;
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
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
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Load current users from initial state
      const currentUsers: User[] = initialUsers;
      
      const user = currentUsers.find(u => u.email === email);
      if (!user) {
        setError('Invalid credentials. Please try again.');
        return false;
      }
      if (user.role === 'student' && otp && otp !== '123456') {
        setError('Invalid OTP. Please try again.');
        return false;
      }

      // Persist to localStorage
      setUser(user);
      localStorage.setItem('sportsSyncUser', JSON.stringify(user));
      return true;
    } catch {
      setError('Something went wrong. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('sportsSyncUser');
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
