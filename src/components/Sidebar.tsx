import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import {
  LayoutDashboard, Users, Package, Calendar, AlertTriangle,
  User, LogOut, X, Activity, ClipboardList, Settings,
  ChevronLeft, ChevronRight
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
];

const staffNav: NavItem[] = [
  { label: 'Dashboard', path: '/staff', icon: LayoutDashboard },
  { label: 'Equipment', path: '/staff/equipment', icon: Package },
  { label: 'Bookings', path: '/staff/bookings', icon: Calendar },
  { label: 'Penalties', path: '/staff/penalties', icon: AlertTriangle },
  { label: 'Activity Log', path: '/staff/activity', icon: Activity },
];

const studentNav: NavItem[] = [
  { label: 'Dashboard', path: '/student', icon: LayoutDashboard },
  { label: 'Equipment', path: '/student/equipment', icon: Package },
  { label: 'My Bookings', path: '/student/bookings', icon: ClipboardList },
  { label: 'Penalties', path: '/student/penalties', icon: AlertTriangle },
  { label: 'Activity Log', path: '/student/activity', icon: Activity },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ isOpen, onClose, onLogout, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const { user } = useAuth();
  const navItems = user?.role === 'admin' ? adminNav : user?.role === 'staff' ? staffNav : studentNav;
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 768;
  });

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keep mobile drawer full-width for readability.
  const compactSidebar = isCollapsed && isDesktop;

  return (
    <aside className={cn(
      // Mobile: fixed drawer sliding in from left
      // Desktop: sticky sidebar that stays on screen while content scrolls
      "flex flex-col transition-all duration-300 ease-in-out sidebar-premium shrink-0",
      "fixed inset-y-0 left-0 z-50",
      "md:sticky md:top-0 md:h-screen md:relative md:inset-auto md:z-30",
      compactSidebar ? "w-20" : "w-72",
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>
      {/* Sidebar Header with Large Logo */}
      <div className={cn(
        "flex items-center border-b border-sidebar-border/30 transition-all duration-300 overflow-hidden whitespace-nowrap shrink-0",
        compactSidebar ? "md:px-4 px-6 md:h-24 h-28 md:justify-center" : "px-6 h-28 md:h-32"
      )}>
        <div className={cn(
          "rounded-full overflow-hidden flex items-center justify-center bg-white shadow-xl border border-sidebar-border/10 p-1 transition-all duration-300 shrink-0",
          compactSidebar ? "md:w-14 md:h-14 w-16 h-16" : "w-16 h-16 md:w-20 md:h-20"
        )}>
          <img
            src="/logo.png"
            alt="SportSync Logo"
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        <div className={cn(
          "flex flex-col ml-4 transition-all duration-300 ease-in-out",
          compactSidebar ? "md:w-0 md:opacity-0 md:ml-0 md:invisible w-40 opacity-100 visible" : "w-40 opacity-100 visible"
        )}>
          <span className="font-black text-2xl tracking-tighter text-sidebar-primary-foreground leading-none">
            SportSync
          </span>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-sidebar-foreground/40 mt-1">
            Management
          </span>
        </div>

        <button
          className="ml-auto md:hidden p-2 rounded-xl hover:bg-sidebar-accent/50 text-sidebar-foreground transition-colors absolute right-4"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 py-8 px-3 space-y-1.5 overflow-y-auto scrollbar-hide overflow-x-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === `/${user?.role}`}
            onClick={onClose}
            className={({ isActive }) => cn(
              "flex items-center rounded-xl text-sm font-semibold transition-all duration-300 group nav-item-hover relative",
              isActive ? "nav-item-active" : "text-sidebar-foreground/60 hover:text-sidebar-primary",
              compactSidebar ? "md:px-0 md:justify-center px-3.5 py-3 md:h-12" : "px-3.5 py-3"
            )}
            title={compactSidebar ? item.label : ""}
          >
            <div className={cn(
              "transition-all duration-300 group-hover:scale-110 shrink-0 flex items-center justify-center",
              compactSidebar ? "md:w-12 md:h-12 w-6 h-6 mr-3 md:mr-0" : "w-6 h-6 mr-3"
            )}>
              <item.icon className={compactSidebar ? "md:w-6 md:h-6 w-5 h-5" : "w-5 h-5"} />
            </div>

            <span className={cn(
               "tracking-tight whitespace-nowrap transition-all duration-300 ease-in-out",
               compactSidebar ? "md:w-0 md:opacity-0 md:invisible w-48 opacity-100 visible" : "w-48 opacity-100 visible"
            )}>
              {item.label}
            </span>

            {/* Active link indicator dot */}
            <div className={cn(
              "absolute right-4 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)] transition-all duration-300",
              compactSidebar ? "md:opacity-0 md:scale-0 opacity-0 scale-0" : "opacity-0 scale-0 group-[.nav-item-active]:scale-100 group-[.nav-item-active]:opacity-100"
            )}></div>
          </NavLink>
        ))}
      </nav>


      {/* Bottom Logout Section */}
      <div className={cn("mt-auto transition-all duration-300", compactSidebar ? "md:p-4 p-4" : "p-4")}>
        <button
          onClick={onLogout}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl font-bold text-sidebar-foreground/60 border border-sidebar-border/50 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-300 w-full",
            compactSidebar ? "md:w-12 md:h-12 md:p-0 md:text-[0px] md:border-0 md:bg-sidebar-accent/50 md:mx-auto px-4 py-3 text-sm" : "px-4 py-3 text-sm"
          )}
          title={compactSidebar ? "Sign Out" : ""}
        >
          <LogOut className={cn(compactSidebar ? "md:w-5 md:h-5 w-4 h-4 shrink-0" : "w-4 h-4 shrink-0")} />
          <span className={cn(
            "transition-all duration-300 whitespace-nowrap overflow-hidden",
            compactSidebar ? "md:w-0 md:opacity-0 md:invisible w-auto opacity-100 visible" : "w-auto opacity-100 visible"
          )}>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
