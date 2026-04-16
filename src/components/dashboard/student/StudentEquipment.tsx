import { User, Equipment, Booking, Warning, ActivityLog } from '@/types';
import React, { useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { useEquipment } from '@/lib/EquipmentContext';
import { useData } from '@/lib/BookingContext';
import { Search, Package, AlertCircle, Calendar, Clock, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const timeSlots = [
  '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
  '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
  '16:00 - 17:00', '17:00 - 18:00',
];

export default function StudentEquipment() {
  const { user } = useAuth();
  const { equipment, updateEquipment } = useEquipment();
  const { addBooking, isStudentSuspended } = useData();

  const [search, setSearch] = useState('');
  const [selectedEq, setSelectedEq] = useState<Equipment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [quantity, setQuantity] = useState(1);

  // The 3-strike suspension rule
  const isSuspended = user ? isStudentSuspended(user.id) : false;

  const filtered = equipment.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) || 
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenBooking = (eq: Equipment) => {
    setSelectedEq(eq);
    setIsDialogOpen(true);
    // Reset form
    setDate('');
    setTimeSlot('');
    setQuantity(1);
  };

  const handleCreateBooking = () => {
    if (!selectedEq || !date || !timeSlot || !quantity) {
      return toast.error('Please fill in all fields');
    }

    if (selectedEq.available < quantity) {
      return toast.error('Requested quantity not available');
    }

    if (user) {
      // 1. Create the booking
      addBooking({
        id: `bk-${Date.now()}-${selectedEq.id}`,
        studentId: user.id,
        studentName: user.name,
        equipmentId: selectedEq.id,
        equipmentName: selectedEq.name,
        date,
        timeSlot,
        quantity,
        status: 'approved',
        createdAt: new Date().toISOString()
      });

      // 2. Update equipment stock (available decreases, inUse increases)
      updateEquipment({
        ...selectedEq,
        available: selectedEq.available - quantity,
        inUse: selectedEq.inUse + quantity
      });

      toast.success(`Successfully booked ${quantity}x ${selectedEq.name}!`);
      setIsDialogOpen(false);
      setSelectedEq(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipment Inventory"
        description="Browse available sports equipment and book instantly"
      />

      {isSuspended && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive font-bold mt-0.5" />
          <div>
            <h4 className="font-bold text-destructive">Account Suspended (3 Strikes Reached)</h4>
            <p className="text-sm text-destructive/80 mt-1">You have reached the maximum penalty threshold. Booking privileges are currently disabled.</p>
          </div>
        </div>
      )}

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search equipment..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(eq => (
          <div
            key={eq.id}
            className={`bg-card rounded-xl border p-5 shadow-card transition-all group border-border hover:shadow-elevated flex flex-col ${eq.available === 0 ? 'opacity-50 grayscale' : ''}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <Package className="w-6 h-6 text-primary group-hover:text-white" />
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${eq.available > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive'}`}>
                  {eq.available > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
            
            <h3 className="font-bold text-lg text-foreground truncate">{eq.name}</h3>

            
            <div className="flex items-center gap-4 mt-4 py-3 border-y border-border/50">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-muted-foreground/60">Available</span>
                <span className="text-sm font-black text-foreground">{eq.available}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-muted-foreground/60">Category</span>
                <span className="text-sm font-black text-foreground">{eq.category}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-2">
              <Button 
                onClick={() => handleOpenBooking(eq)}
                disabled={isSuspended || eq.available === 0}
                className="w-full gradient-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
              >
                <Plus className="w-4 h-4 mr-2" /> Book Now
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black gradient-text">Book {selectedEq?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-bold">
                <Calendar className="w-4 h-4 text-primary" /> Date
              </Label>
              <Input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)}
                className="rounded-xl border-border bg-muted/50 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-bold">
                <Clock className="w-4 h-4 text-primary" /> Time Slot
              </Label>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger className="rounded-xl border-border bg-muted/50 focus:ring-primary/20">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(ts => (
                    <SelectItem key={ts} value={ts}>{ts}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-bold">
                <Package className="w-4 h-4 text-primary" /> Quantity (Max: {selectedEq?.available})
              </Label>
              <Input 
                type="number" 
                min={1} 
                max={selectedEq?.available}
                value={quantity} 
                onFocus={e => e.target.select()}
                onChange={e => setQuantity(e.target.valueAsNumber || 0)}
                className="rounded-xl border-border bg-muted/50 focus:ring-primary/20"
              />
            </div>

            <Button 
              onClick={handleCreateBooking} 
              className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              Confirm Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
