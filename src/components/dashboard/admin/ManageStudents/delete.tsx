import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2, UserX } from 'lucide-react';
import { User } from '@/types';
import { toast } from 'sonner';

interface DeleteStudentProps {
  student: User;
  onDelete: (id: string) => void;
}

export function DeleteStudent({ student, onDelete }: DeleteStudentProps) {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    onDelete(student.id);
    setOpen(false);
    toast.error(`Student record deleted`, {
        description: `${student.name} has been removed from the system.`,
        icon: <UserX className="w-4 h-4 text-destructive" />
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:text-destructive transition-colors">
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-card border-border shadow-elevated">
        <div className="flex flex-col items-center justify-center pt-6 pb-2 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-8 h-8 text-destructive animate-pulse" />
            </div>
            <DialogTitle className="text-xl font-bold">Delete Student Record?</DialogTitle>
            <DialogDescription className="mt-2 text-muted-foreground">
                This will permanently delete the account for <span className="font-bold text-foreground">{student.name}</span>. 
                All booking history and profile data will be lost.
            </DialogDescription>
        </div>
        
        <DialogFooter className="flex sm:flex-row gap-3 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
            Keep Record
          </Button>
          <Button variant="destructive" onClick={handleDelete} className="flex-1 font-bold">
            Delete Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
