import React, { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/StatusBadge';
import { mockBookings } from '@/data/mockData';
import { Check, X, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Booking } from '@/types';

export default function StaffBookings() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  const updateStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    toast.success(`Booking ${status}`);
  };

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
                <TableCell><StatusBadge status={b.status} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {b.status === 'pending' && (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => updateStatus(b.id, 'approved')}><Check className="w-4 h-4 text-success" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => updateStatus(b.id, 'rejected')}><X className="w-4 h-4 text-destructive" /></Button>
                      </>
                    )}
                    {b.status === 'approved' && (
                      <Button variant="ghost" size="icon" onClick={() => updateStatus(b.id, 'returned')}><RotateCcw className="w-4 h-4" /></Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
