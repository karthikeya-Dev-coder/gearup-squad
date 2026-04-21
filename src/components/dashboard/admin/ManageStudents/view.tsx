import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { User } from '@/types';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Mail, Phone, Calendar, Shield, AlertCircle } from 'lucide-react';

interface ViewStudentProps {
  student: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warningCount: number;
  isSuspended: boolean;
}

export function ViewStudent({ student, open, onOpenChange, warningCount, isSuspended }: ViewStudentProps) {
  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-elevated">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
             <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white text-lg">
                {student.name.charAt(0)}
             </div>
             Student Profile
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">Detailed view of the student's information and current standing.</p>
        </DialogHeader>
        
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                Status
              </Label>
              <div>
                <StatusBadge status={isSuspended ? 'Suspended' : (student.isActive ? 'Active' : 'Inactive')} />
              </div>
            </div>
            <div className="text-right space-y-1">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5 justify-end">
                Warnings
              </Label>
              <div className="flex items-center gap-1.5 justify-end">
                <span className={`text-sm font-black ${warningCount >= 2 ? 'text-destructive' : 'text-foreground'}`}>
                    {warningCount} / 3
                </span>
                {warningCount > 0 && <AlertCircle className={`w-4 h-4 ${warningCount >= 2 ? 'text-destructive' : 'text-amber-500'}`} />}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                <Shield className="w-3 h-3" />
                Full Name
              </Label>
              <p className="text-sm font-bold text-foreground">{student.name}</p>
            </div>
            
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                <Mail className="w-3 h-3" />
                Email Address
              </Label>
              <p className="text-sm font-medium text-foreground">{student.email}</p>
            </div>

            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                Enrolled Since
              </Label>
              <p className="text-sm font-medium text-foreground">{student.createdAt}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
