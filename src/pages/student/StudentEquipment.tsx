import React, { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockEquipment, timeSlots, mockWarnings } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { Search, ShoppingCart, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function StudentEquipment() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [timeSlot, setTimeSlot] = useState('');
  const [date, setDate] = useState('');

  const isSuspended = mockWarnings.some(w => w.studentId === user?.id && w.level >= 3);
  const filtered = mockEquipment.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()));

  const toggleSelect = (id: string) => {
    setSelectedEquipment(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBook = () => {
    if (!date || !timeSlot) return toast.error('Select date and time slot');
    toast.success(`Booking request submitted for ${selectedEquipment.length} item(s)`);
    setSelectedEquipment([]);
    setDialogOpen(false);
    setDate('');
    setTimeSlot('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipment"
        description="Browse and book sports equipment"
        action={
          selectedEquipment.length > 0 && !isSuspended ? (
            <Button onClick={() => setDialogOpen(true)} className="gradient-primary text-primary-foreground">
              <ShoppingCart className="w-4 h-4 mr-2" />Book ({selectedEquipment.length})
            </Button>
          ) : null
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search equipment..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(eq => {
          const isSelected = selectedEquipment.includes(eq.id);
          return (
            <div
              key={eq.id}
              onClick={() => !isSuspended && eq.available > 0 && toggleSelect(eq.id)}
              className={`bg-card rounded-xl border p-5 shadow-card transition-all cursor-pointer hover:shadow-elevated ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border'} ${eq.available === 0 || isSuspended ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                {isSelected && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary text-primary-foreground">Selected</span>}
              </div>
              <h3 className="font-semibold text-foreground">{eq.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{eq.category}</p>
              <p className="text-xs text-muted-foreground mt-1">{eq.description}</p>
              <div className="flex items-center gap-3 mt-3 text-xs">
                <span className="text-success font-medium">{eq.available} available</span>
                <span className="text-muted-foreground">{eq.totalQuantity} total</span>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Book Equipment</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">{selectedEquipment.length} item(s) selected</p>
            <div>
              <Label>Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <Label>Time Slot (1 hour)</Label>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger><SelectValue placeholder="Select time slot" /></SelectTrigger>
                <SelectContent>
                  {timeSlots.map(ts => <SelectItem key={ts} value={ts}>{ts}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleBook} className="w-full gradient-primary text-primary-foreground">Submit Booking</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
