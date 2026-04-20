import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Package, CheckCircle2 } from 'lucide-react';
import { Equipment, User } from '@/types';
import { toast } from 'sonner';

interface AddEquipmentProps {
  onAdd: (item: Partial<Equipment>) => Promise<void>;
  staff: User[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  prefill?: Partial<Pick<Equipment, 'name' | 'category' | 'assignedStaffId'>> & { totalQuantity?: number };
  onAdded?: () => void;
}

export function AddEquipment({ onAdd, staff, open: controlledOpen, onOpenChange, prefill, onAdded }: AddEquipmentProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [step, setStep] = useState(0); // 0: Form, 1: Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: '',
    totalQuantity: '',
    assignedStaffId: '',
  });
  const isControlled = typeof controlledOpen === 'boolean';
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isControlled) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
    if (!nextOpen) setStep(0);
  };

  React.useEffect(() => {
    if (!open || !prefill) return;
    setForm({
      name: prefill.name ?? '',
      category: prefill.category ?? '',
      totalQuantity: prefill.totalQuantity != null ? String(prefill.totalQuantity) : '',
      assignedStaffId: prefill.assignedStaffId ?? '',
    });
  }, [open, prefill]);

  const handleAdd = async () => {
    if (!form.name || !form.category || !form.totalQuantity) {
      return toast.error('Please fill in all required fields');
    }
    
    const qty = parseInt(form.totalQuantity);
    if (isNaN(qty) || qty < 0) {
      return toast.error('Please enter a valid quantity');
    }

    setIsSubmitting(true);
    try {
      await onAdd({
        name: form.name,
        category: form.category,
        totalQuantity: qty,
        assignedStaffId: form.assignedStaffId || undefined,
      });
      
      onAdded?.();
      setStep(1);
    } catch (err: any) {
      toast.error(err.message || 'Failed to sync with inventory');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setForm({ name: '', category: '', totalQuantity: '', assignedStaffId: '' });
    setStep(0);
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gradient-primary text-primary-foreground font-bold shadow-lg hover:opacity-90 transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Add Equipment
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-md bg-card border-border shadow-elevated">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            {step === 0 ? 'Add New Equipment' : 'Item Added Successfully!'}
          </DialogTitle>
        </DialogHeader>

        {step === 0 ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="eq-name">Equipment Name *</Label>
                <Input 
                  id="eq-name" 
                  placeholder="e.g. Cricket Bat"
                  value={form.name} 
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="eq-category">Category *</Label>
                  <Input 
                    id="eq-category" 
                    placeholder="e.g. Cricket"
                    value={form.category} 
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="eq-qty">Total Quantity *</Label>
                  <Input 
                    id="eq-qty" 
                    type="number"
                    placeholder="20"
                    value={form.totalQuantity} 
                    onChange={e => setForm(f => ({ ...f, totalQuantity: e.target.value }))} 
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="eq-staff">Assign to Staff</Label>
                <Select value={form.assignedStaffId} onValueChange={v => setForm(f => ({ ...f, assignedStaffId: v }))}>
                  <SelectTrigger id="eq-staff">
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
              <Button onClick={handleAdd} disabled={isSubmitting} className="gradient-primary text-white font-bold px-6 min-w-[120px]">
                {isSubmitting ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding...</span> : 'Add Item'}
              </Button>
            </div>
          </>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-2xl font-black text-foreground tracking-tight">Success!</h4>
              <p className="text-sm text-muted-foreground max-w-[280px]">
                <span className="font-bold text-primary">{form.name}</span> has been successfully added to the sports inventory.
              </p>
            </div>

            <Button 
              onClick={handleFinish} 
              className="w-full h-12 gradient-primary text-white font-black text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
