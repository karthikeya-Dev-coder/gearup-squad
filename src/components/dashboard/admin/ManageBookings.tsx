import { User, Equipment, Booking, Warning, ActivityLog } from '@/types';
import React, { useState } from 'react';
import { useData } from '@/lib/BookingContext';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

import { RotateCcw, Trash2, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ReturnBookingDialog } from '@/components/dashboard/shared/ReturnBookingDialog';
import { BookingTimer } from '@/components/dashboard/shared/BookingTimer';

export default function ManageBookings() {
  const { bookings, updateBookingStatus, deleteBooking } = useData();
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

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

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Administrative Booking Portal" 
        description="Oversee and manage the complete lifecycle of equipment loans" 
      />

      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold py-4">Borrower Details</TableHead>
                <TableHead className="font-bold">Equipment</TableHead>
                <TableHead className="hidden lg:table-cell font-bold">Schedule</TableHead>
                <TableHead className="text-center font-bold">Time Limit</TableHead>
                <TableHead className="text-center font-bold">Qty</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right pr-6 font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground italic">No booking records found.</TableCell>
                </TableRow>
              ) : (
                bookings.map(b => (
                  <TableRow key={b.id} className="group hover:bg-muted/20 transition-all border-b border-border/50 last:border-0 text-left">
                    <TableCell className="font-bold py-5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black shrink-0 uppercase">
                                {b.studentName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <p className="text-sm font-black text-foreground">{b.studentName}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none mt-1">ID: {b.id.split('-')[2] || b.id}</p>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-bold text-foreground">{b.equipmentName}</span>
                        </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                                <Calendar className="w-3 h-3 text-primary opacity-60" /> {b.date}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-black">
                                <Clock className="w-3 h-3" /> {b.timeSlot}
                            </div>
                        </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <BookingTimer booking={b} />
                    </TableCell>
                    <TableCell className="text-center font-black text-primary/80">{b.quantity}</TableCell>
                    <TableCell>
                        <StatusBadge status={b.status} />
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        {(b.status === 'approved' || b.status === 'overdue') && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 gradient-primary text-white border-0 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center gap-2 px-4 rounded-xl font-bold"
                            onClick={() => openReturnDialog(b)}
                          >
                            <RotateCcw className="w-4 h-4" />
                            Return
                          </Button>
                        )}
                        {b.status === 'returned' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-destructive/40 hover:text-destructive hover:bg-destructive/10 transition-colors rounded-xl"
                            onClick={() => openDeleteDialog(b)}
                            title="Purge record"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ReturnBookingDialog
        open={returnDialogOpen}
        onOpenChange={(o) => {
          setReturnDialogOpen(o);
          if (!o) setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onConfirm={handleConfirmReturn}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-destructive/10 p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-destructive font-black text-xl">
                <Trash2 className="w-6 h-6" /> Purge Record
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-foreground font-bold">This booking history record will be permanently deleted from the system.</p>
            <div className="p-4 bg-muted/50 rounded-xl border border-border/50 text-xs space-y-2">
              <div className="flex justify-between"><span className="text-muted-foreground uppercase font-black">Student</span><span className="font-bold">{selectedBooking?.studentName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground uppercase font-black">Equipment</span><span className="font-bold">{selectedBooking?.equipmentName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground uppercase font-black">Status</span><StatusBadge status={selectedBooking?.status || ''} /></div>
            </div>
            <p className="text-[10px] text-destructive font-black uppercase tracking-widest text-center mt-2">Critical Action: IRREVERSIBLE</p>
          </div>
          <DialogFooter className="p-6 pt-0 flex gap-3">
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)} className="flex-1 rounded-xl h-11 font-bold">Cancel</Button>
            <Button onClick={handleConfirmDelete} variant="destructive" className="flex-1 rounded-xl h-11 font-black shadow-xl shadow-destructive/20">Delete Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
