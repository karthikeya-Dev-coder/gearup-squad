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
  onConfirm: () => void;
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
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white text-left">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-primary" />
              Confirm Return
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-sm mt-1">
              Verify equipment condition and return time
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6 text-left">
          {booking && (
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="font-bold text-lg text-foreground">{booking.equipmentName}</h3>
                <p className="text-sm text-muted-foreground font-medium">Issued to {booking.studentName}</p>
              </div>
              <Badge variant="outline" className="h-6 font-mono text-xs">{booking.id}</Badge>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 p-3 rounded-xl border border-border/50 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase font-black tracking-wider">
                <Calendar className="w-3 h-3" /> Scheduled End
              </div>
              <div className="font-mono text-sm font-semibold">{booking?.timeSlot.split(' - ').length === 2 ? booking?.timeSlot.split(' - ')[1] : booking?.timeSlot.split('-')[1]}</div>
            </div>
            <div className="bg-muted/30 p-3 rounded-xl border border-border/50 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase font-black tracking-wider">
                <Clock className="w-3 h-3" /> Actual Return
              </div>
              <div className="font-mono text-sm font-semibold">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
            </div>
          </div>

          {delayInfo?.isLate ? (
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                Delayed Return Detected
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-muted-foreground">Delay Duration</span>
                <span className="text-destructive">{delayInfo.diffMins} Minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Penalty Total</span>
                <span className="text-xl font-black text-destructive">₹ {delayInfo.penaltyAmount}</span>
              </div>
              <p className="text-[10px] text-muted-foreground italic text-center">* Auto-penalty calculated at ₹50/hour</p>
            </div>
          ) : (
            <div className="bg-success/5 border border-success/20 rounded-xl p-4 flex items-center gap-3 text-success font-semibold text-sm">
              <Check className="w-5 h-5" />
              Returned on time. No penalty applied.
            </div>
          )}
        </div>

        <DialogFooter className="p-6 pt-0 flex gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 font-medium hover:bg-muted">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="flex-1 gradient-primary text-white shadow-lg shadow-primary/20 font-bold border-none">
            Confirm Return
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
