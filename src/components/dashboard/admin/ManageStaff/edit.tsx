import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface EditStaffProps {
  staff: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updatedStaff: Partial<User> & { id: string }) => Promise<void>;
}

export function EditStaff({ staff, open, onOpenChange, onUpdate }: EditStaffProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    isActive: true
  });

  useEffect(() => {
    if (staff) {
      setForm({
        name: staff.name,
        email: staff.email,
        department: staff.department || '',
        isActive: staff.isActive
      });
    }
  }, [staff]);

  const handleSave = async () => {
    if (!staff) return;
    if (!form.name || !form.email) return toast.error('Name and Email are required');
    
    setIsSubmitting(true);
    try {
      await onUpdate({
        id: staff.id,
        ...form
      });
      onOpenChange(false);
    } catch (error) {
      // Error handled by UserContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-elevated">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Edit Staff Member</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Modify the staff member's information and account status below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input 
              id="edit-name" 
              value={form.name} 
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input 
              id="edit-email" 
              type="email" 
              value={form.email} 
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-dept">Department</Label>
            <Input 
              id="edit-dept" 
              value={form.department} 
              onChange={e => setForm(f => ({ ...f, department: e.target.value }))} 
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="edit-active" 
              checked={form.isActive} 
              onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
              className="w-4 h-4 accent-primary"
            />
            <Label htmlFor="edit-active">Account Active</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSubmitting} className="gradient-primary text-white font-bold min-w-[120px]">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

