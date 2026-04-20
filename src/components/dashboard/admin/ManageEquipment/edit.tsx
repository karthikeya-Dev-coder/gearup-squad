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
  onUpdate: (id: string, updated: Partial<Equipment>) => Promise<void>;
  staff: User[];
}

export function EditEquipment({ equipment, onUpdate, staff }: EditEquipmentProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: equipment.name,
    category: equipment.category,
    totalQuantity: equipment.totalQuantity.toString(),
    available: equipment.available.toString(),
    inUse: equipment.inUse.toString(),
    assignedStaffId: equipment.assignedStaffId || '',
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
    });
  }, [equipment, open]);

  const handleUpdate = async () => {
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

    setIsSubmitting(true);
    try {
      await onUpdate(equipment.id, {
        name: form.name,
        category: form.category,
        totalQuantity: total,
        available: avail,
        inUse: use,
        assignedStaffId: form.assignedStaffId || undefined,
      });

      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update equipment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="bg-transparent hover:bg-transparent text-blue-500 hover:text-blue-500 shadow-none ring-0 focus:ring-0"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-lg bg-card border-border shadow-elevated">
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
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting} className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive text-muted-foreground transition-colors w-full sm:w-auto">Cancel</Button>
          <Button onClick={handleUpdate} disabled={isSubmitting} className="gradient-primary text-white font-bold px-6 min-w-full sm:min-w-[140px]">
            {isSubmitting ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</span> : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
