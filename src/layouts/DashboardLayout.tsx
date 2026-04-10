import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Users, Package, Calendar, AlertTriangle,
  Settings, LogOut, Menu, X, Activity, ClipboardList, Trophy
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const adminNav: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Staff', path: '/admin/staff', icon: Users },
  { label: 'Students', path: '/admin/students', icon: Users },
  { label: 'Equipment', path: '/admin/equipment', icon: Package },
  { label: 'Bookings', path: '/admin/bookings', icon: Calendar },
  { label: 'Penalties', path: '/admin/penalties', icon: AlertTriangle },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

const staffNav: NavItem[] = [
  { label: 'Dashboard', path: '/staff', icon: LayoutDashboard },
  { label: 'Equipment', path: '/staff/equipment', icon: Package },
  { label: 'Bookings', path: '/staff/bookings', icon: Calendar },
  { label: 'Warnings', path: '/staff/warnings', icon: AlertTriangle },
  { label: 'Activity', path: '/staff/activity', icon: Activity },
  { label: 'Settings', path: '/staff/settings', icon: Settings },
];

const studentNav: NavItem[] = [
  { label: 'Dashboard', path: '/student', icon: LayoutDashboard },
  { label: 'Equipment', path: '/student/equipment', icon: Package },
  { label: 'My Bookings', path: '/student/bookings', icon: ClipboardList },
  { label: 'Warnings', path: '/student/warnings', icon: AlertTriangle },
  { label: 'Activity', path: '/student/activity', icon: Activity },
  { label: 'Settings', path: '/student/settings', icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = user?.role === 'admin' ? adminNav : user?.role === 'staff' ? staffNav : studentNav;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center gap-3 px-6 h-16 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-sidebar-primary-foreground">SportSync</span>
          <button className="ml-auto lg:hidden text-sidebar-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === `/${user?.role}`}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-4.5 h-4.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-accent-foreground truncate">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center px-4 lg:px-6 gap-4">
          <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground capitalize">{user?.role} Dashboard</h1>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
