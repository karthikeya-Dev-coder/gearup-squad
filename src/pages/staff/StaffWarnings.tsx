import React, { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockWarnings, mockUsers } from '@/data/mockData';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Warning } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function StaffWarnings() {
  const { user } = useAuth();
  const [warnings, setWarnings] = useState<Warning[]>(mockWarnings);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ studentId: '', reason: '' });
  const students = mockUsers.filter(u => u.role === 'student');

  const handleAdd = () => {
    if (!form.studentId || !form.reason) return toast.error('Fill all fields');
    const studentWarnings = warnings.filter(w => w.studentId === form.studentId);
    const level = Math.min(studentWarnings.length + 1, 3) as 1 | 2 | 3;
    const student = students.find(s => s.id === form.studentId);
    const w: Warning = { id: `w-${Date.now()}`, studentId: form.studentId, studentName: student?.name || '', reason: form.reason, level, issuedBy: user?.name || '', issuedAt: new Date().toISOString().split('T')[0] };
    setWarnings(prev => [...prev, w]);
    setForm({ studentId: '', reason: '' });
    setDialogOpen(false);
    toast.success(level === 3 ? 'Student suspended!' : `Level ${level} warning issued`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Warnings" description="Issue and track student warnings"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button className="gradient-primary text-primary-foreground"><Plus className="w-4 h-4 mr-2" />Issue Warning</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Issue Warning</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <Label>Student</Label>
                  <Select value={form.studentId} onValueChange={v => setForm(f => ({ ...f, studentId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                    <SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Reason</Label><Input value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} placeholder="Reason for warning" /></div>
                <Button onClick={handleAdd} className="w-full gradient-primary text-primary-foreground">Issue Warning</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="bg-card rounded-xl border border-border shadow-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Issued By</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warnings.map(w => (
              <TableRow key={w.id}>
                <TableCell className="font-medium">{w.studentName}</TableCell>
                <TableCell><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${w.level === 3 ? 'bg-destructive/10 text-destructive' : w.level === 2 ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'}`}>Level {w.level}</span></TableCell>
                <TableCell className="text-muted-foreground">{w.reason}</TableCell>
                <TableCell className="text-muted-foreground">{w.issuedBy}</TableCell>
                <TableCell className="text-muted-foreground">{w.issuedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
