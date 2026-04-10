import { Package, Calendar, AlertTriangle, Activity } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { mockEquipment, mockBookings, mockWarnings, mockActivityLogs } from '@/data/mockData';

export default function StaffDashboard() {
  const { user } = useAuth();
  const myEquipment = mockEquipment.filter(e => e.assignedStaffId === user?.id);
  const pendingBookings = mockBookings.filter(b => b.status === 'pending');

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" description={`Welcome, ${user?.name}`} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Assigned Equipment" value={myEquipment.length} icon={Package} />
        <StatCard title="Pending Bookings" value={pendingBookings.length} icon={Calendar} />
        <StatCard title="Active Warnings" value={mockWarnings.length} icon={AlertTriangle} />
        <StatCard title="Today's Activities" value={mockActivityLogs.length} icon={Activity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">My Equipment</h3>
          <div className="space-y-3">
            {myEquipment.map(eq => (
              <div key={eq.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{eq.name}</p>
                  <p className="text-xs text-muted-foreground">{eq.category}</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-success">{eq.available} avail</span>
                  <span className="text-destructive">{eq.damaged} dmg</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">Pending Bookings</h3>
          <div className="space-y-3">
            {pendingBookings.map(b => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{b.studentName}</p>
                  <p className="text-xs text-muted-foreground">{b.equipmentName} · {b.timeSlot}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
