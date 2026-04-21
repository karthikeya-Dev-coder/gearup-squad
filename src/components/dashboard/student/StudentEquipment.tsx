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
import { toast } from 'sonner';

export default function StudentEquipment() {
  const { user } = useAuth();
  const { equipment, updateEquipment } = useEquipment();
  const { addBooking, isStudentSuspended } = useData();

  const [search, setSearch] = useState('');
  const [selectedEq, setSelectedEq] = useState<Equipment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [formError, setFormError] = useState('');

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
    setStartTime('');
    setEndTime('');
    setQuantity(1);
    setFormError('');
  };

  const handleCreateBooking = () => {
    setFormError('');
    if (!selectedEq || !date || !startTime || !endTime || !quantity) {
      return setFormError('Please fill in all fields');
    }

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const difference = endMinutes - startMinutes;

    if (difference <= 0) {
      return setFormError('End time must be after start time');
    }

    if (difference > 120) {
      return setFormError('Maximum booking duration is 2 hours');
    }

    if (selectedEq.available < quantity) {
      return setFormError('Requested quantity not available');
    }

    if (user) {
      const computedTimeSlot = `${startTime} - ${endTime}`;

      // Create the booking - backend handles stock deduction automatically
      const performBooking = async () => {
        try {
          await addBooking({
            studentId: user.id,
            studentName: user.name,
            equipmentId: selectedEq.id,
            equipmentName: selectedEq.name,
            date,
            timeSlot: computedTimeSlot,
            quantity,
            status: 'approved',
            createdAt: new Date().toISOString()
          });
          toast.success(`Successfully booked ${quantity}x ${selectedEq.name}!`);
          setIsDialogOpen(false);
          setSelectedEq(null);
        } catch (err: any) {
          toast.error(err.message || 'Booking failed');
        }
      };

      performBooking();
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


            <div className="flex flex-wrap items-center gap-4 mt-4 py-3 border-y border-border/50">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-muted-foreground/60">Available</span>
                <span className="text-sm font-black text-foreground">{eq.available}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-muted-foreground/60">Category</span>
                <span className="text-sm font-black text-foreground">{eq.category}</span>
              </div>
              {eq.assignedStaffName && (
                <div className="flex flex-col ml-auto">
                   <span className="text-[10px] font-black uppercase text-primary/60">Holder</span>
                   <span className="text-[11px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20">
                     {eq.assignedStaffName}
                   </span>
                </div>
              )}
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
          <div className="space-y-6 py-4 pb-32">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-bold">
                <Calendar className="w-4 h-4 text-primary" /> Date
              </Label>
              <Input
                type="date"
                value={date}
                onChange={e => { setDate(e.target.value); setFormError(''); }}
                className="rounded-xl border-border bg-muted/50 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-bold">
                  <Clock className="w-4 h-4 text-primary" /> Start Time
                </Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={e => { setStartTime(e.target.value); setFormError(''); }}
                  className="rounded-xl border-border bg-muted/50 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-bold">
                  <Clock className="w-4 h-4 text-primary" /> End Time
                </Label>
                {(() => {
                  let minTime = '';
                  let maxTime = '';
                  if (startTime) {
                    const [h, m] = startTime.split(':').map(Number);

                    let minH = h, minM = m + 1;
                    if (minM >= 60) { minM -= 60; minH += 1; }
                    minTime = `${minH.toString().padStart(2, '0')}:${minM.toString().padStart(2, '0')}`;

                    let maxH = h + 2, maxM = m;
                    if (maxH >= 24) { maxH = 23; maxM = 59; }
                    maxTime = `${maxH.toString().padStart(2, '0')}:${maxM.toString().padStart(2, '0')}`;
                  }

                  return (
                    <Input
                      type="time"
                      value={endTime}
                      onChange={e => { setEndTime(e.target.value); setFormError(''); }}
                      min={minTime}
                      max={maxTime}
                      disabled={!startTime}
                      className="rounded-xl border-border bg-muted/50 focus:ring-primary/20"
                    />
                  );
                })()}
              </div>
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
                onChange={e => { setQuantity(e.target.valueAsNumber || 0); setFormError(''); }}
                className="rounded-xl border-border bg-muted/50 focus:ring-primary/20"
              />
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-destructive animate-in fade-in slide-in-from-bottom-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="text-sm font-bold">{formError}</p>
              </div>
            )}

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
