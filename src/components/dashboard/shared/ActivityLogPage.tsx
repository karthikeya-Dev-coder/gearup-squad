import React from 'react';
import { Activity, Clock, User, Shield, Info } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { useData } from '@/lib/BookingContext';
import { useAuth } from '@/lib/AuthContext';
import { formatDistanceToNow } from 'date-fns';

export default function ActivityLogPage() {
  const { activityLogs, isLoading } = useData();
  const { user } = useAuth();

  // Filter logs based on role if needed (though context usually handles this)
  const filteredLogs = activityLogs.filter(log => {
      if (user?.role === 'admin') return true;
      // Staff see logs they are involved in or general logs
      return log.userId === user?.id || log.details.toLowerCase().includes(user?.name.toLowerCase() || '');
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="System Activities" 
        description="Real-time audit log of all equipment movements and system changes."
      />

      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground text-lg">Activity Feed</h3>
          </div>
        </div>

        <div className="divide-y divide-border/50">
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground font-medium animate-pulse">Fetching latest logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-20 text-center space-y-3">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Info className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">No activity recorded yet.</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-6 hover:bg-muted/30 transition-colors flex gap-4 group">
                <div className="shrink-0 mt-1">
                  <div className={`p-2.5 rounded-xl ${
                    log.action.includes('Approved') || log.action.includes('Cleared') ? 'bg-emerald-500/10 text-emerald-600' :
                    log.action.includes('Rejected') || log.action.includes('Deleted') ? 'bg-destructive/10 text-destructive' :
                    'bg-primary/10 text-primary'
                  }`}>
                    {log.action.includes('Login') ? <User className="w-4 h-4" /> :
                     log.action.includes('System') ? <Shield className="w-4 h-4" /> :
                     <Activity className="w-4 h-4" />}
                  </div>
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-bold text-foreground">{log.action}</p>
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-muted-foreground opacity-60">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {log.details}
                  </p>
                  <div className="flex items-center gap-2 pt-1.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                      ID: {log.id.split('-')[0].toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
