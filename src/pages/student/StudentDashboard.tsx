import { Package, Calendar, AlertTriangle, Clock } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { mockEquipment, mockBookings, mockWarnings } from '@/data/mockData';

export default function StudentDashboard() {
  const { user } = useAuth();
  const myBookings = mockBookings.filter(b => b.studentId === user?.id);
  const myWarnings = mockWarnings.filter(w => w.studentId === user?.id);
  const isSuspended = myWarnings.some(w => w.level >= 3);

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" description={`Welcome, ${user?.name}`} />

      {isSuspended && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <p className="text-sm font-medium text-destructive">Your account is suspended. Booking is disabled.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Available Equipment" value={mockEquipment.reduce((a, e) => a + e.available, 0)} icon={Package} />
        <StatCard title="My Bookings" value={myBookings.length} icon={Calendar} />
        <StatCard title="Warnings" value={`${myWarnings.length}/3`} icon={AlertTriangle} />
        <StatCard title="Pending" value={myBookings.filter(b => b.status === 'pending').length} icon={Clock} />
      </div>

      <div className="bg-card rounded-xl border border-border p-5 shadow-card">
        <h3 className="font-semibold text-foreground mb-4">Recent Bookings</h3>
        {myBookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bookings yet. Browse equipment to get started!</p>
        ) : (
          <div className="space-y-3">
            {myBookings.map(b => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{b.equipmentName}</p>
                  <p className="text-xs text-muted-foreground">{b.date} · {b.timeSlot}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
