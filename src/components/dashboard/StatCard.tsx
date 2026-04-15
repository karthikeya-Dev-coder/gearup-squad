import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
  color?: 'primary' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'info';
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, className, color = 'primary' }: StatCardProps) {
  const themes = {
    primary: {
      gradient: 'bg-gradient-to-br from-[#10b981] to-[#059669]',
      iconBg: 'bg-white/20',
      shadow: 'shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)]'
    },
    indigo: {
      gradient: 'bg-gradient-to-br from-[#6366f1] to-[#4f46e5]',
      iconBg: 'bg-white/20',
      shadow: 'shadow-[0_10px_30px_-10px_rgba(99,102,241,0.5)]'
    },
    emerald: {
      gradient: 'bg-gradient-to-br from-[#10b981] to-[#047857]',
      iconBg: 'bg-white/20',
      shadow: 'shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)]'
    },
    amber: {
      gradient: 'bg-gradient-to-br from-[#f43f5e] via-[#e11d48] to-[#fb923c]', // Pink to Orange like the image
      iconBg: 'bg-white/20',
      shadow: 'shadow-[0_10px_30px_-10px_rgba(225,29,72,0.5)]'
    },
    rose: {
      gradient: 'bg-gradient-to-br from-[#ec4899] to-[#be185d]',
      iconBg: 'bg-white/20',
      shadow: 'shadow-[0_10px_30px_-10px_rgba(236,72,153,0.5)]'
    },
    info: {
      gradient: 'bg-gradient-to-br from-[#06b6d4] to-[#0ea5e9]', // Cyan to Blue like the image
      iconBg: 'bg-white/20',
      shadow: 'shadow-[0_10px_30px_-10px_rgba(6,182,212,0.5)]'
    },
    violet: { // Adding a purple one like the image
        gradient: 'bg-gradient-to-br from-[#8b5cf6] to-[#6366f1]',
        iconBg: 'bg-white/20',
        shadow: 'shadow-[0_10px_30px_-10px_rgba(139,92,246,0.5)]'
    }
  };

  const theme = themes[color === 'indigo' ? 'violet' : (color || 'primary')];

  return (
    <div className={cn(
      "relative group min-h-40 rounded-[1.75rem] p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden border-0",
      theme.gradient,
      theme.shadow,
      className
    )}>
      {/* Glossy Reflection */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none" />
      
      {/* Top Section */}
      <div className="flex items-center justify-between gap-3 relative z-10 text-white">
        <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center backdrop-blur-lg shadow-inner shrink-0", theme.iconBg)}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        {trend && (
           <div className="bg-white/20 backdrop-blur-md rounded-xl px-2.5 py-1 text-[10px] font-bold max-w-[60%] truncate">
             {trend}
           </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 text-white">
        <p className="text-xs sm:text-sm font-medium opacity-80 mb-1 break-words">{title}</p>
        <div className="flex items-baseline gap-2">
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight break-words">{value}</h3>
            {trendUp !== undefined && (
                <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0",
                    theme.iconBg
                )}>
                    {trendUp ? '↗' : '↘'}
                </div>
            )}
        </div>
      </div>

      {/* Wave Decorative Element */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 blur-2xl rounded-full -mb-16 -mr-16 pointer-events-none" />
    </div>
  );
}
