import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { Loader2 } from 'lucide-react';

interface EditStudentProps {
  student: User;
  onUpdate: (updated: Partial<User> & { id: string }) => Promise<void>;
}

export function EditStudent({ student, onUpdate }: EditStudentProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    isActive: true
  });

  useEffect(() => {
    if (student) {
      setForm({
        name: student.name,
        email: student.email,
        isActive: student.isActive
      });
    }
  }, [student]);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      await onUpdate({
        id: student.id,
        ...form
      });
      setOpen(false);
    } catch (error) {
      // Error handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="bg-transparent hover:bg-transparent text-blue-500 hover:text-blue-500 shadow-none ring-0 focus:ring-0"
        onClick={() => setOpen(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
      </Button>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-elevated">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Edit Student Record</DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">Update the student's personal details and account status.</p>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={form.name} 
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={form.email} 
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="active" 
              checked={form.isActive} 
              onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
              className="w-4 h-4 accent-primary"
            />
            <Label htmlFor="active">Account Active</Label>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting} className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive text-muted-foreground font-bold transition-all">Cancel</Button>
          <Button onClick={handleUpdate} disabled={isSubmitting} className="gradient-primary text-white font-bold min-w-[120px]">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
