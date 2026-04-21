import { User, Equipment, Booking, Warning, ActivityLog } from '@/types';
import React, { useState } from 'react';
import { useData } from '@/lib/BookingContext';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

import { Check, X, RotateCcw, Clock, Calendar, AlertTriangle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { BookingTimer } from '@/components/dashboard/shared/BookingTimer';
import { Separator } from '@radix-ui/react-select';

export default function StaffBookings() {
  const { bookings, updateBookingStatus, deleteBooking } = useData();
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const updateStatus = (id: string, status: Booking['status']) => {
    updateBookingStatus(id, status);
    toast.success(`Booking ${status}`);
  };

  const openReturnDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setReturnDialogOpen(true);
  };

  const openDeleteDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setDeleteDialogOpen(true);
  };

  const handleConfirmReturn = () => {
    if (selectedBooking) {
      updateBookingStatus(selectedBooking.id, 'returned');
      toast.success('Equipment returned successfully!');
      setReturnDialogOpen(false);
      setSelectedBooking(null);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedBooking) {
      deleteBooking(selectedBooking.id);
      toast.success('Booking record deleted');
      setDeleteDialogOpen(false);
      setSelectedBooking(null);
    }
  };

  const calculateDelayInfo = (booking: Booking | null) => {
    if (!booking) return null;
    const now = new Date();
    const timeParts = booking.timeSlot.split(' - ');
    const endTimeStr = timeParts.length === 2 ? timeParts[1] : null;

    if (!endTimeStr) return null;

    const [hours, minutes] = endTimeStr.split(':').map(Number);
    const expectedEndDate = new Date(booking.date);
    expectedEndDate.setHours(hours, minutes, 0, 0);

    const isLate = now > expectedEndDate;
    const diffMs = Math.abs(now.getTime() - expectedEndDate.getTime());
    const diffMins = Math.floor(diffMs / 60000);
    const penaltyAmount = isLate ? Math.max(1, Math.round((diffMins / 60) * 50)) : 0;

    return { isLate, diffMins, penaltyAmount, expectedEndDate };
  };

  const delayInfo = calculateDelayInfo(selectedBooking);

  return (
    <div className="space-y-6">
      <PageHeader title="Bookings" description="Manage student equipment bookings" />
      <div className="bg-card rounded-xl border border-border shadow-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead className="hidden sm:table-cell">Time Slot</TableHead>
              <TableHead className="text-center">Time limit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map(b => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">{b.studentName}</TableCell>
                <TableCell>{b.equipmentName}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{b.timeSlot}</TableCell>
                <TableCell className="text-center">
                  <BookingTimer booking={b} />
                </TableCell>
                <TableCell>
                  {(b.status?.toLowerCase() === 'approved' && (() => {
                    const slot = b.timeSlot.split('-')[1]?.trim();
                    if (!slot) return false;
                    const end = new Date(`${b.date}T${slot}:00`);
                    return !isNaN(end.getTime()) && end < new Date();
                  })()) ? (
                    <StatusBadge status="overdue" />
                  ) : (
                    <StatusBadge status={b.status} />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* Manual approval buttons removed for auto-approval workflow */}
                    {['approved', 'overdue', 'pending'].includes(b.status?.toLowerCase()) && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary gap-2"
                        onClick={() => openReturnDialog(b)}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Return
                      </Button>
                    )}
                    {['returned', 'rejected'].includes(b.status?.toLowerCase()) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => openDeleteDialog(b)}
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-primary" />
                Confirm Return
              </DialogTitle>
              <p className="text-slate-400 text-sm mt-1">Verify equipment condition and return time</p>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="font-bold text-lg">{selectedBooking?.equipmentName}</h3>
                <p className="text-sm text-muted-foreground">Issued to {selectedBooking?.studentName}</p>
              </div>
              <Badge variant="outline" className="h-6">{selectedBooking?.id.split('-')[0].toUpperCase()}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-3 rounded-xl border space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                  <Calendar className="w-3 h-3" /> Scheduled End
                </div>
                <div className="font-mono text-sm">{selectedBooking?.timeSlot.split(' - ')[1]}</div>
              </div>
              <div className="bg-muted/30 p-3 rounded-xl border space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                  <Clock className="w-3 h-3" /> Actual Return
                </div>
                <div className="font-mono text-sm">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>

            {delayInfo?.isLate ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-destructive font-bold">
                  <AlertTriangle className="w-5 h-5" />
                  Delayed Return Detected
                </div>
                <Separator className="bg-destructive/10" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Delay Duration</span>
                  <span className="font-bold text-destructive">{delayInfo.diffMins} Minutes</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium text-foreground">Penalty Total</span>
                  <span className="font-black text-destructive">₹ {delayInfo.penaltyAmount}</span>
                </div>
                <p className="text-[10px] text-muted-foreground italic text-center">* Auto-penalty calculated at ₹50/hour</p>
              </div>
            ) : (
              <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-center gap-3 text-success font-medium">
                <Check className="w-5 h-5" />
                Returned on time. No penalty applied.
              </div>
            )}
          </div>

          <DialogFooter className="p-6 pt-0 flex gap-3">
            <Button variant="ghost" onClick={() => setReturnDialogOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleConfirmReturn} className="flex-1 gradient-primary text-white shadow-lg shadow-primary/20">
              Confirm Return
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" /> Delete Booking Record
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <p className="text-sm text-foreground font-medium">Are you sure you want to delete this record?</p>
            <p className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg border italic">
              Student: {selectedBooking?.studentName}<br />
              Equipment: {selectedBooking?.equipmentName}<br />
              Status: {selectedBooking?.status}
            </p>
            <p className="text-[10px] text-destructive font-bold uppercase tracking-wider">Warning: This action cannot be undone.</p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleConfirmDelete} variant="destructive" className="flex-1">Delete Permanently</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
