import { PageHeader } from '@/components/dashboard/PageHeader';
import { useAuth } from '@/lib/AuthContext';
import { useData } from '@/lib/BookingContext';
import React from 'react';

import { AlertTriangle, ShieldX, BadgeIndianRupee, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function StudentWarnings() {
  const { user } = useAuth();
  const { warnings, isStudentSuspended, getMonthlyUnpaidCount } = useData();
  
  const myWarnings = warnings.filter(w => w.studentId === user?.id);
  const isSuspended = user ? isStudentSuspended(user.id) : false;
  const monthlyUnpaidCount = user ? getMonthlyUnpaidCount(user.id) : 0;
  const unpaidWarnings = myWarnings.filter(w => !w.isPaid);
  const totalUnpaidFine = unpaidWarnings.reduce((sum, w) => sum + (w.amount || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Warnings & Penalties" description="View your warning status and pending fines" />

      {isSuspended && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
             <ShieldX className="w-7 h-7 text-destructive" />
          </div>
          <div>
            <p className="font-bold text-destructive text-lg">Account Suspended</p>
            <p className="text-sm text-destructive/80 mt-1 leading-relaxed">
              Booking privileges suspended — you have 3 unpaid penalties this month.
              Pay your pending fines to restore access. Suspensions also auto-expire after 3 weeks.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Monthly strike indicators */}
        {[1, 2, 3].map(level => {
          const active = monthlyUnpaidCount >= level;
          return (
            <div key={level} className={`rounded-xl border p-5 text-center transition-all ${active ? 'border-destructive/30 bg-destructive/5 shadow-sm' : 'border-border bg-card'}`}>
              <AlertTriangle className={`w-8 h-8 mx-auto mb-3 ${active ? 'text-destructive' : 'text-muted-foreground/20'}`} />
              <p className={`text-xs font-bold uppercase tracking-wider ${active ? 'text-destructive' : 'text-muted-foreground'}`}>
                {level === 1 ? '1st Warning' : level === 2 ? 'Final Warning' : 'Suspension'}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {active ? (level === 3 ? 'Suspended!' : 'Unpaid') : 'Clear'}
              </p>
            </div>
          );
        })}

        {/* Pending fines card */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-center">
           <BadgeIndianRupee className="w-8 h-8 mx-auto mb-3 text-primary" />
           <p className="text-xs font-bold uppercase tracking-wider text-primary">Unpaid Fines</p>
           <p className="text-lg font-black text-primary mt-1">₹ {totalUnpaidFine}</p>
           <p className="text-[10px] text-muted-foreground mt-1">{monthlyUnpaidCount}/3 this month</p>
        </div>
      </div>

      {/* Penalty history */}
      {myWarnings.length > 0 && (
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
          <div className="bg-muted/30 px-5 py-3 border-b border-border">
             <h3 className="font-bold text-foreground text-sm">Penalty History</h3>
          </div>
          <div className="divide-y divide-border">
            {myWarnings.map(w => (
              <div key={w.id} className={`p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-colors ${w.isPaid ? 'opacity-50 hover:opacity-70' : 'hover:bg-muted/10'}`}>
                <div className="flex items-start gap-4 min-w-0">
                   <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                     w.isPaid ? 'bg-green-500/10' : w.level >= 3 ? 'bg-destructive/10' : 'bg-orange-500/10'
                   }`}>
                     {w.isPaid ? (
                       <CheckCircle2 className="w-5 h-5 text-green-500" />
                     ) : (
                       <AlertTriangle className={`w-5 h-5 ${w.level >= 3 ? 'text-destructive' : 'text-orange-500'}`} />
                     )}
                   </div>
                   <div>
                      <p className="text-sm font-bold text-foreground">{w.reason}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">By {w.issuedBy} · {new Date(w.issuedAt).toLocaleDateString()}</p>
                   </div>
                </div>
                <div className="flex items-center gap-2 sm:justify-end">
                  {w.isPaid ? (
                    <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10 border-transparent font-bold">
                      ✓ Paid {w.paidAt ? `· ${new Date(w.paidAt).toLocaleDateString()}` : ''}
                    </Badge>
                  ) : (
                    w.amount ? (
                      <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10 border-transparent font-bold">
                        ₹ {w.amount} due
                      </Badge>
                    ) : (
                      <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10 border-transparent font-bold">
                        Unpaid
                      </Badge>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {myWarnings.length === 0 && (
        <div className="text-center py-16 bg-card rounded-xl border border-dashed border-border">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
             <ShieldX className="w-8 h-8 text-success rotate-180" />
          </div>
          <h3 className="font-bold text-foreground">Clean Record</h3>
          <p className="text-sm text-muted-foreground mt-1">You have no active warnings or penalties. Good job! 🎉</p>
        </div>
      )}
    </div>
  );
}
