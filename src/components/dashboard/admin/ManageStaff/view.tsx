import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { User } from '@/types';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Mail, Briefcase, Calendar, Shield } from 'lucide-react';

interface ViewStaffProps {
  staff: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewStaff({ staff, open, onOpenChange }: ViewStaffProps) {
  if (!staff) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-elevated">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
             <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm">
                {staff.name.charAt(0)}
             </div>
             Staff Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                <Shield className="w-3 h-3" />
                Name
              </Label>
              <p className="text-sm font-bold text-foreground">{staff.name}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                <Shield className="w-3 h-3" />
                Status
              </Label>
              <div>
                <StatusBadge status={staff.isActive ? 'Active' : 'Suspended'} />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
              <Mail className="w-3 h-3" />
              Email Address
            </Label>
            <p className="text-sm font-medium text-foreground">{staff.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                <Briefcase className="w-3 h-3" />
                Department
              </Label>
              <p className="text-sm font-medium text-foreground">{staff.department}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                Joined Date
              </Label>
              <p className="text-sm font-medium text-foreground">{staff.createdAt}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
