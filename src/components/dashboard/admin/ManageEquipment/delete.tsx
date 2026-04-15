import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Equipment } from '@/types';
import { toast } from 'sonner';

interface DeleteEquipmentProps {
  equipment: Equipment;
  onDelete: (id: string) => void;
}

export function DeleteEquipment({ equipment, onDelete }: DeleteEquipmentProps) {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    onDelete(equipment.id);
    setOpen(false);
    toast.error(`${equipment.name} removed from inventory`, {
        description: "The item records have been deleted.",
        icon: <Trash2 className="w-4 h-4 text-destructive" />
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
                <AlertTriangle className="w-8 h-8 text-destructive animate-pulse" />
            </div>
            <DialogTitle className="text-xl font-bold">Remove Equipment?</DialogTitle>
            <DialogDescription className="mt-2">
                Are you sure you want to remove <span className="font-bold text-foreground">{equipment.name}</span>? 
                This action cannot be undone and will delete all associated inventory data.
            </DialogDescription>
        </div>
        
        <DialogFooter className="flex sm:flex-row gap-3 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
            Keep Item
          </Button>
          <Button variant="destructive" onClick={handleDelete} className="flex-1 font-bold">
            Yes, Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
