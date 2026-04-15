import { Package, Calendar, AlertTriangle, Clock } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { useAuth } from '@/lib/AuthContext';
import { useData } from '@/lib/BookingContext';
import { useEquipment } from '@/lib/EquipmentContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { bookings, warnings, isStudentSuspended } = useData();
  const { equipment } = useEquipment();

  const myBookings = bookings.filter(b => b.studentId === user?.id);
  const myWarnings = warnings.filter(w => w.studentId === user?.id);
  const isSuspended = user ? isStudentSuspended(user.id) : false;
  const recentBookings = myBookings
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  const unpaidFineTotal = myWarnings
    .filter(w => !w.isPaid)
    .reduce((sum, w) => sum + (w.amount || 0), 0);

  const overdueLongTerm = myBookings.filter(b => {
    if (b.status !== 'approved' && b.status !== 'overdue') return false;
    
    const timeParts = b.timeSlot.split(' - ');
    const endTimeStr = timeParts.length === 2 ? timeParts[1] : null;
    if (!endTimeStr) return false;

    const [hours, minutes] = endTimeStr.split(':').map(Number);
    const deadline = new Date(b.date);
    deadline.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const threeHoursMs = 3 * 60 * 60 * 1000;
    
    return (now.getTime() - deadline.getTime()) > threeHoursMs;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" description={`Welcome, ${user?.name}`} />

      {isSuspended && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <p className="text-sm font-bold text-destructive">Account Suspended: You have reached 3 strikes. Please contact admin.</p>
        </div>
      )}

      {overdueLongTerm.length > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex flex-col gap-2">
           <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-500 animate-pulse" />
              <p className="text-sm font-bold text-orange-600">Action Required: Late Equipment Return</p>
           </div>
           <p className="text-xs text-orange-600/80 ml-8 leading-relaxed">
             You have {overdueLongTerm.length} item(s) that are more than 3 hours overdue. 
             Please return them to the sports department immediately to avoid maximum penalties.
             <span className="block mt-1 font-bold">Current Fine Rate: ₹50 / Hour</span>
           </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Equipment" value={equipment.reduce((a, e) => a + e.totalQuantity, 0)} icon={Package} trend="Live Inventory" color="indigo" />
        <StatCard title="My Active Bookings" value={myBookings.filter(b => b.status === 'approved' || b.status === 'overdue').length} icon={Calendar} trend="Booked Now" color="amber" />
        <StatCard title="Warnings" value={`${myWarnings.length}/3`} icon={AlertTriangle} trend="Penalty Status" color="rose" />
        <StatCard title="Unpaid Fines" value={`₹${unpaidFineTotal}`} icon={Clock} trend="Current Dues" color="info" />
      </div>

      <div className="bg-card rounded-xl border border-border p-5 shadow-card">
        <h3 className="font-semibold text-foreground mb-4">Recent Bookings</h3>
        {recentBookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bookings yet. Browse equipment to get started!</p>
        ) : (
          <div className="space-y-3">
            {recentBookings.map(b => (
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
