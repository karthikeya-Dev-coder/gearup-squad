import React from 'react';
import { Booking } from '@/types';
import { CheckCircle2 } from 'lucide-react';

interface BookingTimerProps {
  booking: Booking;
}

const getEndDateTime = (booking: Booking): Date | null => {
  const slot = booking.timeSlot.split('-')[1]?.trim();
  if (!slot) return null;

  const dateTime = new Date(`${booking.date}T${slot}:00`);
  return Number.isNaN(dateTime.getTime()) ? null : dateTime;
};

const formatRemaining = (ms: number) => {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

const formatOverdue = (ms: number) => {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m late`;
};

export function BookingTimer({ booking }: BookingTimerProps) {
  const [, tick] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => tick((v) => v + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (booking.status === 'returned') {
    return (
      <div className="flex items-center justify-center gap-1 text-emerald-600">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span className="text-xs font-bold uppercase tracking-tight">Completed</span>
      </div>
    );
  }

  const endDateTime = getEndDateTime(booking);
  if (!endDateTime) {
    return <span className="text-xs text-muted-foreground">--</span>;
  }

  const remaining = endDateTime.getTime() - Date.now();
  if (remaining <= 0) {
    return <span className="text-xs font-semibold text-destructive">{formatOverdue(Math.abs(remaining))}</span>;
  }

  return <span className="text-xs font-medium text-amber-600">{formatRemaining(remaining)}</span>;
}
