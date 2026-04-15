import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit } from 'lucide-react';
import { Equipment, User } from '@/types';
import { toast } from 'sonner';

interface EditEquipmentProps {
  equipment: Equipment;
  onUpdate: (updated: Equipment) => void;
  staff: User[];
}

export function EditEquipment({ equipment, onUpdate, staff }: EditEquipmentProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: equipment.name,
    category: equipment.category,
    totalQuantity: equipment.totalQuantity.toString(),
    available: equipment.available.toString(),
    inUse: equipment.inUse.toString(),
    assignedStaffId: equipment.assignedStaffId || '',
    description: equipment.description || '',
  });

  // Keep form in sync with equipment prop if it changes
  useEffect(() => {
    setForm({
      name: equipment.name,
      category: equipment.category,
      totalQuantity: equipment.totalQuantity.toString(),
      available: equipment.available.toString(),
      inUse: equipment.inUse.toString(),
      assignedStaffId: equipment.assignedStaffId || '',
      description: equipment.description || '',
    });
  }, [equipment, open]);

  const handleUpdate = () => {
    if (!form.name || !form.category || !form.totalQuantity) {
      return toast.error('Required fields missing');
    }

    const total = parseInt(form.totalQuantity);
    const avail = parseInt(form.available);
    const use = parseInt(form.inUse);

    if (avail + use !== total) {
      return toast.error('Inventory mismatch', {
        description: 'Available + In Use must equal Total Quantity.',
      });
    }

    onUpdate({
      ...equipment,
      name: form.name,
      category: form.category,
      totalQuantity: total,
      available: avail,
      inUse: use,
      damaged: 0,
      assignedStaffId: form.assignedStaffId,
      description: form.description,
    });

    setOpen(false);
    toast.success('Equipment updated');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:text-primary transition-colors">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-card border-border shadow-elevated">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Edit Equipment</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="edit-name">Equipment Name</Label>
              <Input 
                id="edit-name" 
                value={form.name} 
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input 
                id="edit-category" 
                value={form.category} 
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-staff">Assigned Staff</Label>
              <Select value={form.assignedStaffId} onValueChange={v => setForm(f => ({ ...f, assignedStaffId: v }))}>
                <SelectTrigger id="edit-staff">
                  <SelectValue placeholder="Select staff" />
                </SelectTrigger>
                <SelectContent>
                  {staff.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-muted/30 p-4 rounded-xl border border-border/50">
            <div className="grid gap-1.5 text-center">
              <Label htmlFor="edit-total" className="text-xs uppercase font-bold text-muted-foreground">Total</Label>
              <Input 
                id="edit-total" 
                type="number"
                className="text-center font-bold"
                value={form.totalQuantity} 
                onChange={e => setForm(f => ({ ...f, totalQuantity: e.target.value }))} 
              />
            </div>
            <div className="grid gap-1.5 text-center">
              <Label htmlFor="edit-avail" className="text-xs uppercase font-bold text-success">Avail</Label>
              <Input 
                id="edit-avail" 
                type="number"
                className="text-center font-bold text-success border-success/30 focus-visible:ring-success"
                value={form.available} 
                onChange={e => setForm(f => ({ ...f, available: e.target.value }))} 
              />
            </div>
            <div className="grid gap-1.5 text-center">
              <Label htmlFor="edit-use" className="text-xs uppercase font-bold text-info">In Use</Label>
              <Input 
                id="edit-use" 
                type="number"
                className="text-center font-bold text-info border-info/30 focus-visible:ring-info"
                value={form.inUse} 
                onChange={e => setForm(f => ({ ...f, inUse: e.target.value }))} 
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-desc">Description</Label>
            <Input 
              id="edit-desc" 
              value={form.description} 
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdate} className="gradient-primary text-white font-bold px-6">Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
