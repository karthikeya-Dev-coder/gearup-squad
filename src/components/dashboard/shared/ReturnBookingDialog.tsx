import { Booking } from '@/types';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RotateCcw, Clock, Calendar, AlertTriangle, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ReturnBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
  onConfirm: (penalty?: { amount: number, reason: string }) => void;
}

export function ReturnBookingDialog({
  open,
  onOpenChange,
  booking,
  onConfirm,
}: ReturnBookingDialogProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [open]);

  const calculateDelayInfo = (booking: Booking | null) => {
    if (!booking) return null;
    const timeParts = booking.timeSlot.split(' - ');
    const endTimeStr = timeParts.length === 2 ? timeParts[1].trim() : (booking.timeSlot.split('-')[1]?.trim());

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

  const delayInfo = calculateDelayInfo(booking);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[450px] p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white text-left shrink-0">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl font-black flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-primary" />
              </div>
              Confirm Return
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-sm mt-2 font-medium">
              Verify equipment condition and return time
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-6 text-left overflow-y-auto flex-1 custom-scrollbar">
          {booking && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
              <div className="min-w-0">
                <h3 className="font-black text-2xl text-foreground tracking-tight truncate">{booking.equipmentName}</h3>
                <p className="text-sm text-muted-foreground font-semibold mt-1">Issued to <span className="text-primary font-bold">{booking.studentName}</span></p>
              </div>
              <Badge variant="secondary" className="h-7 px-3 font-mono text-[10px] w-fit opacity-80 rounded-full border-border bg-muted/50">ID: {booking.id.split('-')[0].toUpperCase()}...</Badge>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-muted/30 p-5 rounded-3xl border border-border/40 space-y-2 hover:bg-muted/50 transition-all">
              <div className="flex items-center gap-2 text-muted-foreground text-[10px] uppercase font-black tracking-widest">
                <Calendar className="w-4 h-4 text-primary/70" /> Scheduled End
              </div>
              <div className="font-mono text-lg font-black text-foreground">
                {booking?.timeSlot.split(' - ').length === 2 ? booking?.timeSlot.split(' - ')[1] : (booking?.timeSlot.split('-')[1]?.trim() || booking?.timeSlot)}
              </div>
            </div>
            <div className="bg-muted/30 p-5 rounded-3xl border border-border/40 space-y-2 hover:bg-muted/50 transition-all">
              <div className="flex items-center gap-2 text-muted-foreground text-[10px] uppercase font-black tracking-widest">
                <Clock className="w-4 h-4 text-primary/70" /> Actual Return
              </div>
              <div className="font-mono text-lg font-black text-foreground">
                {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {delayInfo?.isLate ? (
            <div className="bg-destructive/5 border border-destructive/10 rounded-[1.5rem] p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 text-destructive font-black text-sm uppercase tracking-tight">
                <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                Delayed Return Detected
              </div>
              <Separator className="bg-destructive/10" />
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-muted-foreground">Delay Duration</span>
                <span className="text-destructive font-black bg-destructive/10 px-3 py-1 rounded-full">{delayInfo.diffMins} Minutes</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-bold text-foreground">Penalty Total</span>
                <span className="text-3xl font-black text-destructive tracking-tighter">₹ {delayInfo.penaltyAmount}</span>
              </div>
              <p className="text-[10px] text-muted-foreground/60 italic text-center font-medium">* Auto-penalty calculated at ₹50/hour</p>
            </div>
          ) : (
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-[1.5rem] p-5 flex items-center gap-4 text-emerald-600 font-bold text-sm shadow-sm">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <p>Status: On Time</p>
                <p className="text-xs text-emerald-600/70 font-medium mt-0.5">No penalty applied to this session.</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-8 pt-4 flex flex-col sm:flex-row gap-4 border-t bg-muted/10 shrink-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 font-black text-sm hover:bg-muted rounded-2xl h-14 border border-border/50">
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (delayInfo?.isLate) {
                onConfirm({ 
                  amount: delayInfo.penaltyAmount, 
                  reason: `Late return of ${booking?.equipmentName} (Delayed by ${delayInfo.diffMins} mins)` 
                });
              } else {
                onConfirm();
              }
            }} 
            className="flex-1 gradient-primary text-white shadow-xl shadow-primary/20 font-black text-sm rounded-2xl h-14 border-none hover:scale-[1.02] transition-transform"
          >
            Confirm Return
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
