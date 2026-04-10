import React, { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/StatusBadge';
import { mockEquipment, mockUsers } from '@/data/mockData';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Equipment } from '@/types';

export default function ManageEquipment() {
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', totalQuantity: '', assignedStaffId: '', description: '' });

  const staff = mockUsers.filter(u => u.role === 'staff');
  const filtered = equipment.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!form.name || !form.category || !form.totalQuantity) return toast.error('Fill required fields');
    const qty = parseInt(form.totalQuantity);
    const item: Equipment = { id: `eq-${Date.now()}`, name: form.name, category: form.category, totalQuantity: qty, available: qty, inUse: 0, damaged: 0, assignedStaffId: form.assignedStaffId, description: form.description };
    setEquipment(prev => [...prev, item]);
    setForm({ name: '', category: '', totalQuantity: '', assignedStaffId: '', description: '' });
    setDialogOpen(false);
    toast.success('Equipment added');
  };

  const handleDelete = (id: string) => {
    setEquipment(prev => prev.filter(e => e.id !== id));
    toast.success('Equipment removed');
  };

  const getStaffName = (id?: string) => staff.find(s => s.id === id)?.name || '—';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipment Management"
        description="Manage all sports equipment inventory"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground"><Plus className="w-4 h-4 mr-2" />Add Equipment</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Equipment</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Equipment name" /></div>
                <div><Label>Category</Label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Cricket" /></div>
                <div><Label>Quantity</Label><Input type="number" value={form.totalQuantity} onChange={e => setForm(f => ({ ...f, totalQuantity: e.target.value }))} placeholder="Total quantity" /></div>
                <div>
                  <Label>Assign to Staff</Label>
                  <Select value={form.assignedStaffId} onValueChange={v => setForm(f => ({ ...f, assignedStaffId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
                    <SelectContent>
                      {staff.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Description</Label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description" /></div>
                <Button onClick={handleAdd} className="w-full gradient-primary text-primary-foreground">Add Equipment</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search equipment..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Equipment</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">Available</TableHead>
              <TableHead className="text-center hidden sm:table-cell">In Use</TableHead>
              <TableHead className="text-center hidden sm:table-cell">Damaged</TableHead>
              <TableHead className="hidden md:table-cell">Assigned Staff</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(e => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">{e.name}</TableCell>
                <TableCell className="text-muted-foreground">{e.category}</TableCell>
                <TableCell className="text-center">{e.totalQuantity}</TableCell>
                <TableCell className="text-center"><span className="text-success font-medium">{e.available}</span></TableCell>
                <TableCell className="text-center hidden sm:table-cell"><span className="text-info font-medium">{e.inUse}</span></TableCell>
                <TableCell className="text-center hidden sm:table-cell"><span className="text-destructive font-medium">{e.damaged}</span></TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{getStaffName(e.assignedStaffId)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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
