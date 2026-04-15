import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Menu, LogOut, Smartphone } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSendSMS = () => {
    toast.success(`Credentials sent to ${user?.name} via SMS`, {
      description: "Secure verification link dispatched.",
      duration: 4000,
    });
  };

  const getPageTitle = () => {
    const segments = location.pathname.split('/').filter(Boolean);
    if (segments.length <= 1) {
      return `${user?.role || 'User'} Dashboard`;
    }
    
    const lastSegment = segments[segments.length - 1];
    if (lastSegment === 'staff') return 'Manage Staff';
    if (lastSegment === 'students') return 'Manage Students';
    if (lastSegment === 'equipment') return 'Equipment Management';
    if (lastSegment === 'bookings') return 'Bookings';
    if (lastSegment === 'penalties') return 'Penalties';
    if (lastSegment === 'activity') return 'Activity Log';
    
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ');
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onLogout={handleLogout} 
      />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 flex items-center justify-between px-3 sm:px-4 lg:px-6 shrink-0 z-30">
          <div className="flex items-center gap-3 sm:gap-4">
            <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-semibold text-foreground capitalize truncate">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:bg-muted/50 p-1.5 pr-3 rounded-full transition-colors border border-border/50">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {user?.name?.charAt(0)}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground mt-1">{user?.email}</p>
                    <p className="text-[10px] uppercase tracking-wider text-primary font-semibold mt-1">{user?.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSendSMS} className="cursor-pointer py-2">
                  <Smartphone className="mr-2 h-4 w-4 text-blue-500" />
                  <span>Send credentials via SMS</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 cursor-pointer py-2">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Scrollable area for content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 custom-scrollbar">
          <div className="animate-fade-in max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
