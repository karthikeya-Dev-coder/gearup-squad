import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { mockBookings } from '@/data/mockData';

export default function StudentBookings() {
  const { user } = useAuth();
  const myBookings = mockBookings.filter(b => b.studentId === user?.id);

  return (
    <div className="space-y-6">
      <PageHeader title="My Bookings" description="View your booking history" />
      <div className="bg-card rounded-xl border border-border shadow-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Equipment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="hidden sm:table-cell">Time Slot</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myBookings.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No bookings yet</TableCell></TableRow>
            ) : (
              myBookings.map(b => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.equipmentName}</TableCell>
                  <TableCell className="text-muted-foreground">{b.date}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{b.timeSlot}</TableCell>
                  <TableCell className="text-center">{b.quantity}</TableCell>
                  <TableCell><StatusBadge status={b.status} /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
