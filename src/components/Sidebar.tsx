import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import {
  LayoutDashboard, Users, Package, Calendar, AlertTriangle,
  LogOut, X, Activity, ClipboardList, GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const adminNav: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Staff', path: '/admin/staff', icon: Users },
  { label: 'Students', path: '/admin/students', icon: GraduationCap },
  { label: 'Equipment', path: '/admin/equipment', icon: Package },
  { label: 'Bookings', path: '/admin/bookings', icon: Calendar },
  { label: 'Penalties', path: '/admin/penalties', icon: AlertTriangle },
];

const staffNav: NavItem[] = [
  { label: 'Dashboard', path: '/staff', icon: LayoutDashboard },
  { label: 'Equipment', path: '/staff/inventory', icon: Package },
  { label: 'Bookings', path: '/staff/bookings', icon: Calendar },
  { label: 'Penalties', path: '/staff/penalties', icon: AlertTriangle },
  { label: 'Activity Log', path: '/staff/activity', icon: Activity },
];

const studentNav: NavItem[] = [
  { label: 'Dashboard', path: '/student', icon: LayoutDashboard },
  { label: 'Equipment', path: '/student/inventory', icon: Package },
  { label: 'My Bookings', path: '/student/bookings', icon: ClipboardList },
  { label: 'Penalties', path: '/student/penalties', icon: AlertTriangle },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onHoverChange?: (hovered: boolean) => void;
}

export function Sidebar({ isOpen, onClose, onLogout, onHoverChange }: SidebarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const navItems = user?.role === 'admin' ? adminNav : user?.role === 'staff' ? staffNav : studentNav;

  return (
    <>
      {/* Mobile Drawer */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-2xl border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out lg:hidden w-72",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shadow-inner overflow-hidden shrink-0">
              <img src="/logo.png" alt="Sports Equip Logo" className="w-full h-full object-cover rounded-full drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-white leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">SportsEquip</span>
          </div>
          <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all duration-300">
            <X className="w-5 h-5 text-white/50 hover:text-white" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
          {navItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === `/${user?.role}`}
              onClick={onClose}
              className={({ isActive }) => cn(
                "flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-500 reveal-item",
                isActive
                  ? "bg-sky-500/20 text-white shadow-[0_0_20px_rgba(14,165,233,0.25)] border border-sky-500/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-300",
                item.path === window.location.pathname ? "text-sky-400 scale-110 drop-shadow-[0_0_8px_rgba(14,165,233,0.6)]" : ""
              )} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-white/5 bg-white/5 backdrop-blur-md">
          <button 
            onClick={onLogout} 
            className="group flex items-center justify-center gap-3 w-full rounded-2xl px-4 py-4 text-sm font-black text-red-100 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 transition-all duration-500 shadow-lg shadow-red-500/5 hover:shadow-red-500/20"
          >
            <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Desktop Floating Vertical Palette */}
      <aside
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
        className={cn(
          "hidden lg:flex fixed left-0 inset-y-0 z-40",
          "flex-col items-center py-8 px-2",
          "bg-slate-950 border-r border-white/5",
          "shadow-[8px_0_32px_rgba(0,0,0,0.3)] transition-all duration-200 ease-out group",
          "hover:w-64 hover:px-4 w-[80px]"
        )}>
        <TooltipProvider delayDuration={0}>

          <div
            className="h-14 w-14 mb-8 flex items-center justify-center shrink-0 cursor-pointer group-hover:w-full group-hover:justify-start group-hover:p-1.5 transition-all duration-200 overflow-hidden"
            onClick={() => navigate(`/${user?.role}`)}
          >
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shadow-inner group-hover:w-12 group-hover:h-12 transition-all duration-200 overflow-hidden shrink-0">
              <img src="/logo.png" alt="Sports Equip Logo" className="w-full h-full object-cover rounded-full shrink-0 drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]" />
            </div>
            <span className="ml-3 font-black text-white tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden text-2xl">
              SportsEquip
            </span>
          </div>

          <nav className="flex flex-col gap-3 w-full flex-1">
            {navItems.map((item) => (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.path}
                    end={item.path === `/${user?.role}`}
                    className={({ isActive }) => cn(
                      "relative flex items-center rounded-full transition-all duration-200 cursor-pointer",
                      "group/item w-full h-[52px] overflow-hidden",
                      isActive
                        ? "bg-sky-500/40 text-white shadow-[0_0_25px_rgba(14,165,233,0.4)]"
                        : "text-slate-400 hover:text-white hover:bg-sky-500/25"
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        <div className="absolute left-0 w-[52px] h-[52px] flex items-center justify-center shrink-0 z-10">
                          <item.icon className={cn(
                            "w-5 h-5 transition-all duration-300",
                            isActive
                              ? "text-sky-400 scale-110 drop-shadow-[0_0_10px_rgba(14,165,233,0.8)]"
                              : "group-hover/item:scale-110 group-hover/item:text-sky-400 group-hover/item:drop-shadow-[0_0_8px_rgba(14,165,233,0.6)]"
                          )} />
                        </div>
                        <span className="ml-14 font-extrabold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden group-hover/item:text-sky-50 group-hover/item:drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                          {item.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right" className="group-hover:hidden bg-foreground text-background font-bold border-none shadow-xl ml-2 rounded-xl">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>

          <div className="w-full px-2 mt-auto pb-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onLogout}
                  className="relative flex items-center rounded-2xl transition-all duration-500 group/btn w-full h-[52px] text-red-400 hover:bg-red-500 hover:text-white shadow-lg shadow-red-500/5"
                >
                  <div className="absolute left-0 w-[56px] h-[52px] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/btn:scale-110">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <span className="ml-14 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
                    Sign Out
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="group-hover:hidden bg-red-600 text-white font-bold border-none shadow-xl ml-2 rounded-xl">
                Sign Out
              </TooltipContent>
            </Tooltip>
          </div>

        </TooltipProvider>
      </aside>
    </>
  );
}
