import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { mockWarnings } from '@/data/mockData';
import { AlertTriangle, ShieldX } from 'lucide-react';

export default function StudentWarnings() {
  const { user } = useAuth();
  const myWarnings = mockWarnings.filter(w => w.studentId === user?.id);
  const isSuspended = myWarnings.some(w => w.level >= 3);

  return (
    <div className="space-y-6">
      <PageHeader title="Warnings" description="View your warning status" />

      {isSuspended && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-5 flex items-start gap-3">
          <ShieldX className="w-6 h-6 text-destructive mt-0.5" />
          <div>
            <p className="font-semibold text-destructive">Account Suspended</p>
            <p className="text-sm text-destructive/80 mt-1">You have received 3 warnings. Your booking privileges are suspended. Contact administration for more information.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(level => {
          const hasWarning = myWarnings.some(w => w.level >= level);
          return (
            <div key={level} className={`rounded-xl border p-4 text-center ${hasWarning ? 'border-destructive/30 bg-destructive/5' : 'border-border bg-card'}`}>
              <AlertTriangle className={`w-8 h-8 mx-auto mb-2 ${hasWarning ? 'text-destructive' : 'text-muted-foreground/30'}`} />
              <p className="text-xs font-medium text-muted-foreground">
                {level === 1 ? 'Warning' : level === 2 ? 'Final Warning' : 'Suspension'}
              </p>
            </div>
          );
        })}
      </div>

      {myWarnings.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">Warning History</h3>
          <div className="space-y-3">
            {myWarnings.map(w => (
              <div key={w.id} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                <AlertTriangle className={`w-4 h-4 mt-0.5 ${w.level >= 3 ? 'text-destructive' : w.level === 2 ? 'text-warning' : 'text-info'}`} />
                <div>
                  <p className="text-sm font-medium text-foreground">Level {w.level} — {w.reason}</p>
                  <p className="text-xs text-muted-foreground">By {w.issuedBy} · {w.issuedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {myWarnings.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No warnings. Keep it up! 🎉</p>
        </div>
      )}
    </div>
  );
}
