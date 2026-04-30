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
  const { bookings, isLoading, error, updateBookingStatus, deleteBooking, refreshData } = useData();
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openReturnDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setReturnDialogOpen(true);
  };

  const openDeleteDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setDeleteDialogOpen(true);
  };

  const handleConfirmReturn = async (penalty?: { amount: number, reason: string }) => {
    if (selectedBooking) {
      setIsSubmitting(true);
      try {
        await updateBookingStatus(selectedBooking.id, 'returned', penalty);
        toast.success('Equipment returned successfully!');
        setReturnDialogOpen(false);
        setSelectedBooking(null);
      } catch (err: any) {
        toast.error(err.message || 'Failed to process return');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedBooking) {
      setIsSubmitting(true);
      try {
        await deleteBooking(selectedBooking.id);
        toast.success('Booking record deleted');
        setDeleteDialogOpen(false);
        setSelectedBooking(null);
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete record');
      } finally {
        setIsSubmitting(false);
      }
    }
  };


  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrative Booking Portal"
        description="Oversee and manage the complete lifecycle of equipment loans"
      />

      {error ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
          <p className="text-destructive font-bold mb-2">Booking System Error</p>
          <p className="text-sm text-destructive/80 mb-4">{error}</p>
          <Button variant="outline" onClick={() => refreshData()} className="font-bold">
            Try Again
          </Button>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-bold animate-pulse">Syncing Bookings...</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold py-4 px-4 sm:px-6">Borrower</TableHead>
                  <TableHead className="font-bold">Equipment</TableHead>
                  <TableHead className="hidden lg:table-cell font-bold">Schedule</TableHead>
                  <TableHead className="text-center font-bold hidden sm:table-cell">Time Limit</TableHead>
                  <TableHead className="text-center font-bold">Qty</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right pr-4 sm:pr-6 font-bold">Actions</TableHead>
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
                      <TableCell className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black shrink-0 uppercase">
                            {b.studentName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-foreground truncate max-w-[100px] sm:max-w-none">{b.studentName}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none mt-1 hidden xs:block">ID: {b.id.split('-')[0].toUpperCase()}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-bold text-foreground truncate block max-w-[120px] sm:max-w-none">{b.equipmentName}</span>
                        <div className="lg:hidden mt-2 space-y-1 bg-muted/30 p-1.5 rounded-md border border-border/50">
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                            <Calendar className="w-3 h-3 text-primary opacity-70" /> {b.date}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-foreground font-black">
                            <Clock className="w-3 h-3 text-primary opacity-70" /> {b.timeSlot}
                          </div>
                          <div className="sm:hidden mt-1 pt-1 border-t border-border/50">
                            <BookingTimer booking={b} />
                          </div>
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
                      <TableCell className="text-center hidden sm:table-cell">
                        <BookingTimer booking={b} />
                      </TableCell>
                      <TableCell className="text-center font-black text-primary/80">{b.quantity}</TableCell>
                      <TableCell>
                        <StatusBadge status={b.status} />
                      </TableCell>
                      <TableCell className="text-right pr-4 sm:pr-6">
                        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                          {['approved', 'overdue', 'pending'].includes(b.status?.toLowerCase()) && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 sm:h-9 gradient-primary text-white border-0 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center gap-2 px-3 sm:px-4 rounded-xl font-bold text-[10px] sm:text-xs"
                              onClick={() => openReturnDialog(b)}
                            >
                              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              Return
                            </Button>
                          )}
                          {['returned', 'rejected'].includes(b.status?.toLowerCase()) ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 sm:h-9 sm:w-9 text-destructive/40 hover:text-destructive hover:bg-destructive/10 transition-colors rounded-xl"
                              onClick={() => openDeleteDialog(b)}
                              title="Purge record"
                            >
                              <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

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
        <DialogContent className="w-[95vw] sm:max-w-[400px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
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
          <DialogFooter className="p-6 pt-0 flex flex-col-reverse sm:flex-row gap-3">
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)} disabled={isSubmitting} className="flex-1 rounded-xl h-11 font-bold w-full sm:w-auto">Cancel</Button>
            <Button onClick={handleConfirmDelete} disabled={isSubmitting} variant="destructive" className="flex-1 rounded-xl h-11 font-black shadow-xl shadow-destructive/20 min-w-full sm:min-w-[140px]">
              {isSubmitting ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Deleting...</span> : 'Delete Record'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
