import { ActivityLog } from '@/types';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Activity } from 'lucide-react';
import { useData } from '@/lib/BookingContext';

export default function ActivityLogPage() {
  const { activityLogs } = useData();

  return (
    <div className="space-y-6">
      <PageHeader title="Activity Log" description="Recent system activity" />
      <div className="bg-card rounded-xl border border-border p-5 shadow-card overflow-hidden">
        <div className="space-y-3">
          {activityLogs.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">No recent activity logs found.</div>
          )}
          {activityLogs.map(log => (
            <div key={log.id} className="flex flex-col sm:flex-row sm:items-start gap-3 py-3 border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-foreground text-left"><span className="font-bold">{log.userName}</span> — {log.action}</p>
                <p className="text-xs text-muted-foreground text-left">{log.details}</p>
              </div>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter whitespace-nowrap sm:self-center sm:text-right">
                {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
