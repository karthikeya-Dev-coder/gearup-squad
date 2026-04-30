import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

type UserRole = 'admin' | 'staff' | 'student';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

// Map each role to its home dashboard
const roleDashboard: Record<UserRole, string> = {
  admin: '/admin',
  staff: '/staff',
  student: '/student',
};

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth();

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role → redirect to their correct dashboard
  if (!allowedRoles.includes(user.role as UserRole)) {
    const correctDashboard = roleDashboard[user.role as UserRole] ?? '/login';
    return <Navigate to={correctDashboard} replace />;
  }

  return <>{children}</>;
}

// Redirect to correct dashboard based on role
export function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const dashboard = roleDashboard[user.role as UserRole] ?? '/login';
  return <Navigate to={dashboard} replace />;
}

// Prevent logged-in users from accessing public routes (like login)
export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (user) {
    const dashboard = roleDashboard[user.role as UserRole] ?? '/';
    return <Navigate to={dashboard} replace />;
  }

  return <>{children}</>;
}
