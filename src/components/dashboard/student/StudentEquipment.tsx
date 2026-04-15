import { User, Equipment, Booking, Warning, ActivityLog } from '@/types';
import React, { useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/AuthContext';
import { useEquipment } from '@/lib/EquipmentContext';
import { useData } from '@/lib/BookingContext';
import { Search, Package, AlertCircle } from 'lucide-react';

export default function StudentEquipment() {
  const { user } = useAuth();
  const { equipment } = useEquipment();
  const { isStudentSuspended } = useData();

  const [search, setSearch] = useState('');

  // The 3-strike suspension rule
  const isSuspended = user ? isStudentSuspended(user.id) : false;

  const filtered = equipment.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) || 
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipment Inventory"
        description="Browse available sports equipment"
      />

      {isSuspended && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive font-bold mt-0.5" />
          <div>
            <h4 className="font-bold text-destructive">Account Suspended (3 Strikes Reached)</h4>
            <p className="text-sm text-destructive/80 mt-1">You have reached the maximum penalty threshold. Booking privileges are currently disabled on your My Bookings page.</p>
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
            className={`bg-card rounded-xl border p-5 shadow-card transition-all group border-border hover:shadow-elevated ${eq.available === 0 ? 'opacity-50 grayscale' : ''}`}
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
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[32px]">{eq.description || 'No description available.'}</p>
            
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
            
            <div className="mt-4 pt-2 text-xs text-center text-muted-foreground italic">
              Book this via "My Bookings" page
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
