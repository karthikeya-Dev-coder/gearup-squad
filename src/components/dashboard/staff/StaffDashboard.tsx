import React from 'react';
import { Package, Calendar, AlertTriangle, Activity } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { useAuth } from '@/lib/AuthContext';
import { useData } from '@/lib/BookingContext';
import { useEquipment } from '@/lib/EquipmentContext';

export default function StaffDashboard() {
  const { user } = useAuth();
  const { bookings, warnings, activityLogs } = useData();
  const { equipment } = useEquipment();

  const myEquipment = equipment.filter(e => e.assignedStaffId === user?.id);
  const returnBookings = bookings.filter(b => b.status === 'approved' || b.status === 'overdue');
  const recentBookings = bookings
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  const sortedReturnBookings = returnBookings
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const myActivityLogs = activityLogs.filter(log => log.userId === user?.id || log.details.includes(user?.name || ''));

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" description={`Welcome back, ${user?.name}`} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="My Items" value={myEquipment.length} icon={Package} trend="Live inventory" color="indigo" />
        <StatCard title="Returns Pending" value={returnBookings.length} icon={Calendar} trend="Returns" color="amber" />
        <StatCard title="Total Warnings" value={warnings.length} icon={AlertTriangle} trend="Issued System-wide" color="rose" />
        <StatCard title="Recent Feed" value={myActivityLogs.length} icon={Activity} trend="System logs" color="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border p-5 shadow-card overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">My Equipment Stocks</h3>
            <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2 py-1 rounded-md">Live Sync</span>
          </div>
          <div className="space-y-4">
            {myEquipment.length === 0 && <p className="text-sm text-muted-foreground text-center py-10 italic">No equipment currently assigned to you.</p>}
            {myEquipment.map(eq => (
              <div key={eq.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b border-border/50 last:border-0 group hover:bg-muted/30 transition-all px-2 rounded-xl">
                <div className="min-w-0">
                  <p className="text-sm font-black text-foreground">{eq.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{eq.category}</p>
                </div>
                <div className="flex items-center gap-4 text-xs sm:justify-end">
                  <div className="text-right">
                    <p className="text-emerald-600 font-black">{eq.available}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Ready</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-600 font-black">{eq.inUse}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">In Use</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-5 shadow-card overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">Returns</h3>
            <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-600 px-2 py-1 rounded-md">Attention Needed</span>
          </div>
          <div className="space-y-4">
            {returnBookings.length === 0 ? (
              <>
                <p className="text-sm text-muted-foreground text-center py-2 italic">
                  No returns pending right now. Showing latest bookings.
                </p>
                {recentBookings.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6 italic">No booking activity yet.</p>
                ) : (
                  recentBookings.map(b => (
                    <div key={b.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-all px-2 rounded-xl group">
                      <div className="text-left min-w-0">
                        <p className="text-sm font-black text-foreground text-left">{b.studentName}</p>
                        <p className="text-[10px] text-muted-foreground text-left uppercase font-bold">
                          {b.equipmentName} · {b.timeSlot}
                        </p>
                        <p className="text-[10px] text-muted-foreground text-left">
                          Date: {b.date} · Qty: {b.quantity}
                        </p>
                        <p className="text-[10px] text-muted-foreground text-left">
                          Requested At: {new Date(b.createdAt).toLocaleString()}
                        </p>
                      </div>
                  <div className="sm:ml-4"><StatusBadge status={b.status} /></div>
                    </div>
                  ))
                )}
              </>
            ) : (
              sortedReturnBookings.map(b => (
                <div key={b.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-all px-2 rounded-xl group">
                  <div className="text-left min-w-0">
                    <p className="text-sm font-black text-foreground text-left">{b.studentName}</p>
                    <p className="text-[10px] text-muted-foreground text-left uppercase font-bold">
                      {b.equipmentName} · {b.timeSlot}
                    </p>
                    <p className="text-[10px] text-muted-foreground text-left">
                      Date: {b.date} · Qty: {b.quantity}
                    </p>
                    <p className="text-[10px] text-muted-foreground text-left">
                      Request ID: {b.id}
                    </p>
                    <p className="text-[10px] text-muted-foreground text-left">
                      Requested At: {new Date(b.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="sm:ml-4"><StatusBadge status={b.status} /></div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
