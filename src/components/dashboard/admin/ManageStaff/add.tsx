import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, CheckCircle2 } from 'lucide-react';
import { User } from '@/types';
import { toast } from 'sonner';

interface AddStaffProps {
  onAdd: (staff: User) => void;
}

export function AddStaff({ onAdd }: AddStaffProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0); // 0: Form, 1: Success/Send
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
  });

  const handleCreate = () => {
    if (!form.name || !form.email) {
      return toast.error('Name and Email are required');
    }
    setStep(1); // Move to "Send Credentials" step
  };

  const handleSendCredentials = () => {
    const newStaff: User = {
      id: `staff-${Date.now()}`,
      name: form.name,
      email: form.email,
      department: form.department,
      role: 'staff',
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true,
    };

    onAdd(newStaff);
    toast.success(`Temporary password sent to ${form.email}`, {
      description: 'The user can now log in using the credentials in their Gmail.',
      duration: 5000,
    });
    
    // Reset and close
    setForm({ name: '', email: '', department: '' });
    setStep(0);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) setStep(0); }}>
      <DialogTrigger asChild>
        <Button className="gradient-primary text-primary-foreground font-bold shadow-lg hover:opacity-90 transition-all">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-elevated overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            {step === 0 ? 'Add New Staff Member' : 'Account Created!'}
          </DialogTitle>
        </DialogHeader>

        {step === 0 ? (
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Full Name</Label>
                <Input 
                  id="add-name" 
                  placeholder="e.g. John Doe"
                  value={form.name} 
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-email">Email Address</Label>
                <Input 
                  id="add-email" 
                  type="email" 
                  placeholder="name@university.edu"
                  value={form.email} 
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-dept">Department</Label>
                <Input 
                  id="add-dept" 
                  placeholder="e.g. Cricket, Football"
                  value={form.department} 
                  onChange={e => setForm(f => ({ ...f, department: e.target.value }))} 
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} className="gradient-primary text-white font-bold px-6">Create Account</Button>
            </div>
          </>
        ) : (
          <div className="py-10 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30 transform rotate-12">
                <CheckCircle2 className="w-12 h-12 text-white transform -rotate-12" />
              </div>
            </div>
            
            <div className="space-y-2">
                <h4 className="text-2xl font-black text-foreground tracking-tight">Security Checkpoint</h4>
                <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed">
                    The account for <span className="font-bold text-emerald-600 underline underline-offset-4">{form.name}</span> is ready for activation.
                </p>
            </div>

            <div className="w-full space-y-3 pt-6">
              <Button 
                onClick={handleSendCredentials} 
                className="w-full h-14 gradient-primary text-white font-black text-lg shadow-[0_10px_40px_-10px_rgba(var(--primary-rgb),0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all rounded-2xl"
              >
                Send Secure Credentials
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setOpen(false)} 
                className="w-full text-muted-foreground font-bold hover:bg-transparent hover:text-foreground transition-colors"
              >
                Finish without sending
              </Button>
            </div>
            
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-50">
                End-to-End Encrypted Invitation
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
