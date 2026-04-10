import React, { useState, useRef } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/StatusBadge';
import { mockUsers, mockWarnings } from '@/data/mockData';
import { UserPlus, Upload, Mail, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';

export default function ManageStudents() {
  const [students, setStudents] = useState<User[]>(mockUsers.filter(u => u.role === 'student'));
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const fileRef = useRef<HTMLInputElement>(null);

  const getWarningCount = (id: string) => mockWarnings.filter(w => w.studentId === id).length;
  const isSuspended = (id: string) => mockWarnings.some(w => w.studentId === id && w.level === 3);

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!form.name || !form.email) return toast.error('Fill required fields');
    const newStudent: User = { id: `student-${Date.now()}`, ...form, role: 'student', createdAt: new Date().toISOString().split('T')[0], isActive: true };
    setStudents(prev => [...prev, newStudent]);
    setForm({ name: '', email: '', phone: '' });
    setDialogOpen(false);
    toast.success('Student added successfully');
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.success(`CSV "${file.name}" uploaded. Processing mock data...`);
    // Mock: add some students
    const csv: User[] = [
      { id: `student-csv-1`, name: 'CSV Student 1', email: 'csv1@student.edu', role: 'student', createdAt: new Date().toISOString().split('T')[0], isActive: true },
      { id: `student-csv-2`, name: 'CSV Student 2', email: 'csv2@student.edu', role: 'student', createdAt: new Date().toISOString().split('T')[0], isActive: true },
    ];
    setStudents(prev => [...prev, ...csv]);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDelete = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    toast.success('Student removed');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Students"
        description={`${students.length} students enrolled`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />CSV Upload
            </Button>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} />
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-primary-foreground"><UserPlus className="w-4 h-4 mr-2" />Add Student</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add New Student</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-2">
                  <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" /></div>
                  <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email address" /></div>
                  <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91..." /></div>
                  <Button onClick={handleAdd} className="w-full gradient-primary text-primary-foreground">Add Student</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden sm:table-cell">Warnings</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell className="text-muted-foreground">{s.email}</TableCell>
                <TableCell className="hidden sm:table-cell">{getWarningCount(s.id)}/3</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <StatusBadge status={isSuspended(s.id) ? 'Suspended' : 'Active'} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => toast.success(`Credentials sent to ${s.email}`)}><Mail className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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
