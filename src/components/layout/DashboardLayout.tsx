import React, { useState } from 'react';
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
  // Desktop sidebar hover state
  const [sidebarHovered, setSidebarHovered] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Mobile overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-md lg:hidden transition-all duration-500",
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)} 
      />

      {/* Modular Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onLogout={handleLogout}
        onHoverChange={setSidebarHovered}
      />


      {/* Main content wrapper - Joined to sidebar */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 overflow-y-auto transition-[padding] duration-500 ease-out bg-slate-950/50",
          !sidebarHovered && "lg:pl-[80px]"
        )}
        style={sidebarHovered ? { paddingLeft: '256px' } : undefined}
      >
        {/* Top Header - Merged with Sidebar Colors */}
        <header className="h-16 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl flex items-center pl-6 lg:pl-10 pr-4 lg:pr-6 gap-4 sticky top-0 z-30 transition-all duration-300">
          <button 
            className="lg:hidden p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all duration-300 border border-white/5 shadow-inner" 
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-white capitalize tracking-tight">
              {user?.role} Portal
            </h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Sports Equip Active Session
            </p>
          </div>
          
          <div className="ml-auto flex items-center gap-3">
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
