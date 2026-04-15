import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/Sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Mobile drawer state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Desktop collapse state (persisted)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Mobile overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden transition-all duration-300",
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)} 
      />

      {/* Modular Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onLogout={handleLogout}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      {/* Main content wrapper — scrolls independently so sidebar stays sticky */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto transition-all duration-300 ease-in-out">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md flex items-center px-4 md:px-6 gap-4 sticky top-0 z-30">
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-muted text-foreground transition-colors" 
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-foreground capitalize tracking-tight">
              {user?.role} Portal
            </h1>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              SportSync Active Session
            </p>
          </div>
          
          <div className="ml-auto flex items-center gap-3">
             <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-xs font-bold text-foreground leading-none">{user?.name}</span>
                <span className="text-[10px] text-muted-foreground mt-1 capitalize">{user?.role}</span>
             </div>
             <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground text-xs font-black shadow-md">
                {user?.name?.charAt(0)}
             </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto animate-fade-in w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
