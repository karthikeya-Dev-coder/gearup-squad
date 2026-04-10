import React, { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { mockEquipment } from '@/data/mockData';
import { toast } from 'sonner';
import { Equipment } from '@/types';

export default function StaffEquipment() {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment.filter(e => e.assignedStaffId === user?.id));

  const updateQuality = (id: string, status: string) => {
    if (status === 'damaged') {
      setEquipment(prev => prev.map(e => e.id === id ? { ...e, damaged: e.damaged + 1, available: Math.max(0, e.available - 1) } : e));
    }
    toast.success(`Equipment quality updated to ${status}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="My Equipment" description="Track and update assigned equipment" />
      <div className="bg-card rounded-xl border border-border shadow-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Equipment</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Available</TableHead>
              <TableHead className="text-center">In Use</TableHead>
              <TableHead className="text-center">Damaged</TableHead>
              <TableHead>Update Quality</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipment.map(e => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">{e.name}</TableCell>
                <TableCell className="text-muted-foreground">{e.category}</TableCell>
                <TableCell className="text-center text-success font-medium">{e.available}</TableCell>
                <TableCell className="text-center text-info font-medium">{e.inUse}</TableCell>
                <TableCell className="text-center text-destructive font-medium">{e.damaged}</TableCell>
                <TableCell>
                  <Select onValueChange={v => updateQuality(e.id, v)}>
                    <SelectTrigger className="w-[120px]"><SelectValue placeholder="Quality" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="damaged">Damaged</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
