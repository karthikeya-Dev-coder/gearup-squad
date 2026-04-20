import React from 'react';

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950">
      {/* Ambient glow background */}
      <div
        className="absolute w-64 h-64 rounded-full opacity-20 blur-3xl animate-pulse"
        style={{ background: 'radial-gradient(circle, #7c3aed, #4f46e5, transparent)' }}
      />

      {/* Logo + Rings container */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer slow ring */}
        <div className="absolute w-32 h-32 rounded-full border border-violet-500/30 animate-spin" style={{ animationDuration: '3s' }} />
        {/* Middle spin ring */}
        <div className="absolute w-28 h-28 rounded-full border-2 border-transparent border-t-violet-500 border-r-violet-400 animate-spin" style={{ animationDuration: '1.2s' }} />
        {/* Inner ring */}
        <div className="absolute w-24 h-24 rounded-full border border-violet-400/20" />

        {/* Logo with glow */}
        <div
          className="relative w-20 h-20 rounded-full overflow-hidden"
          style={{
            boxShadow: '0 0 30px 8px rgba(124, 58, 237, 0.6), 0 0 60px 20px rgba(79, 70, 229, 0.3)',
          }}
        >
          <img
            src="/logo.png"
            alt="SportSync Logo"
            className="w-full h-full object-cover rounded-full"
          />
          {/* Glow overlay pulse */}
          <div
            className="absolute inset-0 rounded-full animate-pulse"
            style={{ background: 'rgba(124, 58, 237, 0.15)' }}
          />
        </div>
      </div>

      {/* Brand text */}
      <h1
        className="text-white text-xl font-bold tracking-tight mb-1"
        style={{ textShadow: '0 0 20px rgba(124, 58, 237, 0.8)' }}
      >
        SportSync
      </h1>
      <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-6">{message}</p>

      {/* Animated bouncing dots */}
      <div className="flex gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0ms', boxShadow: '0 0 6px rgba(124,58,237,0.8)' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms', boxShadow: '0 0 6px rgba(124,58,237,0.6)' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-bounce" style={{ animationDelay: '300ms', boxShadow: '0 0 6px rgba(124,58,237,0.4)' }} />
      </div>
    </div>
  );
}
