import React, { useState } from 'react';
import { User, Equipment, Booking, Warning, ActivityLog } from '@/types';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Clock, Package, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/AuthContext';
import { useData } from '@/lib/BookingContext';
import { useEquipment } from '@/lib/EquipmentContext';
import { toast } from 'sonner';
import { BookingTimer } from '@/components/dashboard/shared/BookingTimer';

const timeSlots = [
  '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
  '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
  '16:00 - 17:00', '17:00 - 18:00',
];

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
  const { bookings, addBooking, isStudentSuspended } = useData();
  const { equipment } = useEquipment();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');

  const myBookings = bookings.filter(b => b.studentId === user?.id);
  const isSuspended = user ? isStudentSuspended(user.id) : false;

  const handleCreateBooking = () => {
    if (!selectedEquipmentId || !date || !timeSlot) {
      return toast.error('Please fill in all fields');
    }

    const eq = equipment.find(e => e.id === selectedEquipmentId);
    if (!eq) return;

    if (eq.available <= 0) {
      return toast.error('Equipment currently out of stock');
    }

    if (user) {
      addBooking({
        id: `bk-${Date.now()}-${selectedEquipmentId}`,
        studentId: user.id,
        studentName: user.name,
        equipmentId: eq.id,
        equipmentName: eq.name,
        date,
        timeSlot,
        quantity: 1,
        status: 'approved',
        createdAt: new Date().toISOString()
      });

      toast.success(`Successfully booked ${eq.name}!`);
      setDialogOpen(false);
      setSelectedEquipmentId('');
      setDate('');
      setTimeSlot('');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Bookings" 
        description="View your booking history and create new bookings" 
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={isSuspended} className="gradient-primary text-primary-foreground font-bold shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" /> New Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black gradient-text">Create Booking</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {isSuspended && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-xs text-destructive">Account suspended. Booking is disabled.</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-bold">
                    <Package className="w-4 h-4 text-primary" /> Select Equipment
                  </Label>
                  <Select value={selectedEquipmentId} onValueChange={setSelectedEquipmentId}>
                    <SelectTrigger className="rounded-xl border-border bg-muted/50 focus:ring-primary/20">
                      <SelectValue placeholder="Choose an item..." />
                    </SelectTrigger>
                    <SelectContent>
                      {equipment.map(eq => (
                        <SelectItem key={eq.id} value={eq.id} disabled={eq.available === 0}>
                          {eq.name} ({eq.available} left)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-bold">
                    <Calendar className="w-4 h-4 text-primary" /> Date
                  </Label>
                  <Input 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)}
                    className="rounded-xl border-border bg-muted/50 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-bold">
                    <Clock className="w-4 h-4 text-primary" /> Time Slot
                  </Label>
                  <Select value={timeSlot} onValueChange={setTimeSlot}>
                    <SelectTrigger className="rounded-xl border-border bg-muted/50 focus:ring-primary/20">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(ts => (
                        <SelectItem key={ts} value={ts}>{ts}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleCreateBooking} 
                  disabled={isSuspended}
                  className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                >
                  Confirm Booking
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
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
                      <p className="text-xs">Your history will appear here once you book some equipment.</p>
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
