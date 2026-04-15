import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { Trash2, AlertCircle } from 'lucide-react';

interface DeleteStaffProps {
  staff: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => void;
}

export function DeleteStaff({ staff, open, onOpenChange, onConfirm }: DeleteStaffProps) {
  if (!staff) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-elevated">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <Trash2 className="w-8 h-8 text-destructive" />
          </div>
          <DialogTitle className="text-xl font-bold">Remove Staff Member</DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to remove <span className="font-bold text-foreground">{staff.name}</span>? 
            This action cannot be undone and will revoke all access.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3 mt-2">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-xs text-destructive font-medium leading-relaxed">
            All equipment assigned to this staff member will be orphaned and need reassignment.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancel</Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              onConfirm(staff.id);
              onOpenChange(false);
            }} 
            className="flex-1 font-bold"
          >
            Delete Staff
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
