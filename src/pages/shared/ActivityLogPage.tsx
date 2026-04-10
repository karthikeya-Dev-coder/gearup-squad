import { PageHeader } from '@/components/PageHeader';
import { Activity } from 'lucide-react';
import { mockActivityLogs } from '@/data/mockData';

export default function ActivityLogPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Activity Log" description="Recent system activity" />
      <div className="bg-card rounded-xl border border-border p-5 shadow-card">
        <div className="space-y-3">
          {mockActivityLogs.map(log => (
            <div key={log.id} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
              <Activity className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-foreground"><span className="font-medium">{log.userName}</span> — {log.action}</p>
                <p className="text-xs text-muted-foreground">{log.details}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
