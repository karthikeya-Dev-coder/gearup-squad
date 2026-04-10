import React, { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/StatusBadge';
import { mockWarnings, mockUsers } from '@/data/mockData';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Warning } from '@/types';

export default function ManagePenalties() {
  const [warnings, setWarnings] = useState<Warning[]>(mockWarnings);

  const students = mockUsers.filter(u => u.role === 'student');
  const getStudentWarnings = (studentId: string) => warnings.filter(w => w.studentId === studentId);

  const resetWarnings = (studentId: string) => {
    setWarnings(prev => prev.filter(w => w.studentId !== studentId));
    toast.success('Warnings reset');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Penalty Management" description="Track warnings and suspensions" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <div className="flex items-center gap-2 text-warning mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Warning System</span>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>1st offense → Warning</li>
            <li>2nd offense → Final Warning</li>
            <li>3rd offense → Suspension</li>
          </ul>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Warnings</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Latest Reason</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map(s => {
              const sw = getStudentWarnings(s.id);
              if (sw.length === 0) return null;
              const latest = sw[sw.length - 1];
              const isSuspended = latest.level >= 3;
              return (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{sw.length}/3</TableCell>
                  <TableCell><StatusBadge status={isSuspended ? 'Suspended' : 'Active'} /></TableCell>
                  <TableCell className="text-muted-foreground">{latest.reason}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => resetWarnings(s.id)}>
                      <RotateCcw className="w-4 h-4 mr-1" />Reset
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
