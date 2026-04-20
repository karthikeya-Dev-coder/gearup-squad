import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { Trash2, AlertCircle, Loader2 } from 'lucide-react';

interface DeleteStudentProps {
  student: User;
  onDelete: (id: string) => Promise<void>;
}

export function DeleteStudent({ student, onDelete }: DeleteStudentProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(student.id);
      setOpen(false);
    } catch (error) {
      // Error handled by context
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="bg-transparent hover:bg-transparent text-destructive hover:text-destructive shadow-none ring-0 focus:ring-0"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-elevated">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <Trash2 className="w-8 h-8 text-destructive" />
          </div>
          <DialogTitle className="text-xl font-bold">Remove Student</DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to remove <span className="font-bold text-foreground">{student.name}</span>? 
            This will permanently delete their record and all booking history.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3 mt-2">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-xs text-destructive font-medium leading-relaxed">
            Warning: This action is irreversible. All data associated with this student will be lost.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting} className="flex-1">Cancel</Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 font-bold"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isDeleting ? 'Deleting...' : 'Remove Student'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
