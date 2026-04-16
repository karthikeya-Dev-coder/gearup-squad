import React from 'react';
import { Booking } from '@/types';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useData } from '@/lib/BookingContext';
import { BookingTimer } from '@/components/dashboard/shared/BookingTimer';

const calculateDueAmount = (booking: Booking) => {
  if (booking.status !== 'overdue') return 0;

  const endTime = booking.timeSlot.split(' - ')[1]?.trim() ?? booking.timeSlot.split('-')[1]?.trim();
  if (!endTime) return 0;

  const [hours, minutes] = endTime.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;

  const deadline = new Date(booking.date);
  deadline.setHours(hours, minutes, 0, 0);
  const lateMs = Date.now() - deadline.getTime();
  if (lateMs <= 0) return 0;

  const lateMinutes = Math.floor(lateMs / 60000);
  return Math.max(1, Math.round((lateMinutes / 60) * 50));
};

export default function StudentBookings() {
  const { user } = useAuth();
  const { bookings, isStudentSuspended } = useData();

  const myBookings = bookings.filter(b => b.studentId === user?.id);
  const isSuspended = user ? isStudentSuspended(user.id) : false;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Bookings" 
        description="View your sports equipment booking history" 
      />

      {isSuspended && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h4 className="font-bold text-red-500">Booking Privileges Suspended</h4>
            <p className="text-sm text-red-500/80">You have reached the maximum penalty threshold. Please clear pending warnings to resume booking.</p>
          </div>
        </div>
      )}

      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold py-4">Equipment</TableHead>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="hidden sm:table-cell font-bold">Time Slot</TableHead>
                <TableHead className="text-center font-bold">Time Limit</TableHead>
                <TableHead className="text-center font-bold">Qty</TableHead>
                <TableHead className="text-right font-bold">Due Amount</TableHead>
                <TableHead className="font-bold text-right pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <Package className="w-8 h-8 opacity-20" />
                      </div>
                      <p className="text-lg">No bookings found yet.</p>
                      <p className="text-xs">Go to the Equipment page to make your first booking!</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                myBookings.map(b => (
                  <TableRow key={b.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-bold py-4">{b.equipmentName}</TableCell>
                    <TableCell className="text-muted-foreground">{b.date}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{b.timeSlot}</TableCell>
                    <TableCell className="text-center">
                      <BookingTimer booking={b} />
                    </TableCell>
                    <TableCell className="text-center font-medium">{b.quantity}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {calculateDueAmount(b) > 0 ? (
                        <span className="text-destructive">₹ {calculateDueAmount(b)}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6"><StatusBadge status={b.status} /></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
