import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Edit } from 'lucide-react';
import { User } from '@/types';
import { toast } from 'sonner';

interface EditStudentProps {
  student: User;
  onUpdate: (updated: User) => void;
}

export function EditStudent({ student, onUpdate }: EditStudentProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: student.name,
    email: student.email,
    isActive: student.isActive,
  });

  useEffect(() => {
    setForm({
      name: student.name,
      email: student.email,
      isActive: student.isActive,
    });
  }, [student, open]);

  const handleUpdate = () => {
    if (!form.name || !form.email) {
      return toast.error('Required fields missing');
    }

    onUpdate({
      ...student,
      name: form.name,
      email: form.email,
      isActive: form.isActive,
    });

    setOpen(false);
    toast.success('Student profile updated');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:text-primary transition-colors">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-elevated">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Edit Student Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input 
                id="edit-name" 
                value={form.name} 
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input 
                id="edit-email" 
                type="email"
                value={form.email} 
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
            <div className="space-y-0.5">
              <Label>Active Status</Label>
              <p className="text-xs text-muted-foreground">Allows the student to book equipment.</p>
            </div>
            <Switch 
              checked={form.isActive} 
              onCheckedChange={v => setForm(f => ({ ...f, isActive: v }))} 
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdate} className="gradient-primary text-white font-bold px-6">Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
