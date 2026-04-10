import { Users, Package, Calendar, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { PageHeader } from '@/components/PageHeader';
import { mockUsers, mockEquipment, mockBookings, mockWarnings, mockActivityLogs } from '@/data/mockData';

export default function AdminDashboard() {
  const staff = mockUsers.filter(u => u.role === 'staff');
  const students = mockUsers.filter(u => u.role === 'student');
  const pendingBookings = mockBookings.filter(b => b.status === 'pending');

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" description="Welcome back, Dr. Rajesh Kumar" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Staff" value={staff.length} icon={Users} trend="+1 this month" trendUp />
        <StatCard title="Total Students" value={students.length} icon={Users} trend="+2 this month" trendUp />
        <StatCard title="Equipment Items" value={mockEquipment.length} icon={Package} />
        <StatCard title="Pending Bookings" value={pendingBookings.length} icon={Calendar} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {mockBookings.slice(0, 4).map(b => (
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

        {/* Equipment Status */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">Equipment Overview</h3>
          <div className="space-y-3">
            {mockEquipment.slice(0, 5).map(eq => (
              <div key={eq.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{eq.name}</p>
                  <p className="text-xs text-muted-foreground">{eq.category}</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-success">{eq.available} avail</span>
                  <span className="text-info">{eq.inUse} in use</span>
                  <span className="text-destructive">{eq.damaged} dmg</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-card">
        <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {mockActivityLogs.map(log => (
            <div key={log.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
              <Activity className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-foreground"><span className="font-medium">{log.userName}</span> — {log.action}</p>
                <p className="text-xs text-muted-foreground">{log.details}</p>
              </div>
              <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
                {new Date(log.timestamp).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
