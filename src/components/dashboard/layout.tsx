import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Menu, LogOut, Smartphone, Mail, Loader2 } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleLogout = () => {
    const role = user?.role;
    logout();
    navigate(`/login?tab=${role || 'student'}`);
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
    <div className="h-screen flex bg-gradient-to-br from-background via-background to-secondary/30 overflow-hidden font-sans">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden transition-all duration-300" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Floating Vertical Palette (Sidebar) */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        onHoverChange={setSidebarHovered}
      />

      {/* Main content wrapper - Joined to sidebar */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-[padding] duration-500 ease-out relative z-10 w-full max-w-full",
          !sidebarHovered && "lg:pl-[80px]"
        )}
        style={sidebarHovered ? { paddingLeft: '256px' } : undefined}
      >
        {/* Top Header - Merged with Sidebar Colors */}
        <header 
          className={cn(
            "h-16 border-b border-white/5 bg-slate-950 flex items-center justify-between px-4 sm:px-8 shrink-0 z-30 transition-all duration-300 fixed top-0 right-0 left-0",
            !sidebarHovered ? "lg:pl-[80px]" : "lg:pl-64"
          )}
          style={sidebarHovered ? { paddingLeft: '256px' } : undefined}
        >
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col ml-2 lg:ml-4">
            <h1 className="text-sm font-bold text-white capitalize tracking-tight">
              {user?.role} Portal
            </h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Sports Equip Active Session
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 hover:bg-white/10 p-1 pr-3 lg:pr-4 rounded-full transition-all duration-300 border border-white/5 shadow-sm group">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-inner group-hover:scale-105 transition-transform duration-300">
                    {user?.name?.charAt(0)}
                  </div>
                  <div className="flex flex-col items-start hidden sm:flex leading-none">
                    <span className="text-sm font-bold tracking-tight text-white">{user?.name}</span>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">{user?.role}</span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-xl border-border/50 shadow-elevated overflow-hidden p-1 backdrop-blur-xl bg-card/95">
                <DropdownMenuLabel className="px-3 py-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold tracking-tight">{user?.name}</p>
                    <p className="text-xs text-muted-foreground font-medium">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />

                {user?.role === 'admin' ? (
                  <div
                    className="px-3 py-2 flex flex-col gap-2"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    <p className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      Send Login Credentials
                    </p>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="email"
                        id="adminEmailSend"
                        placeholder="Enter email..."
                        className="h-8 text-xs bg-muted/50 focus:ring-1 focus:ring-primary/50 border-border/50"
                      />
                      <Button 
                        size="sm" 
                        disabled={isSendingEmail}
                        className="h-8 px-3 text-xs font-bold shrink-0 min-w-[70px]"
                        onClick={async () => {
                          const input = document.getElementById('adminEmailSend') as HTMLInputElement;
                          if(input && input.value) {
                            try {
                              setIsSendingEmail(true);
                              const { default: api } = await import('@/lib/api');
                              await api.post('/auth/admin/send-credentials', { targetEmail: input.value });
                              toast.success('Sent!', {
                                description: `Login details sent to ${input.value}`
                              });
                              input.value = '';
                            } catch (err) {
                              toast.error('Failed to send credentials. Please try again.');
                            } finally {
                              setIsSendingEmail(false);
                            }
                          } else {
                            toast.error('Please enter a valid email address');
                          }
                        }}
                      >
                        {isSendingEmail ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Send"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <DropdownMenuItem onClick={handleSendSMS} className="cursor-pointer py-2.5 px-3 rounded-lg focus:bg-primary/10 focus:text-primary transition-colors mt-1 font-medium text-sm">
                    <Smartphone className="mr-2 h-4 w-4" />
                    <span>Send credentials via SMS</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 cursor-pointer py-2.5 px-3 rounded-lg transition-colors font-medium text-sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Spacer to push content below fixed header */}
        <div className="h-16 shrink-0" />

        {/* Scrollable area for content - Original padding restored here */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-3 sm:p-6 lg:p-8 w-full max-w-full">
          <div className="animate-fade-in max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
