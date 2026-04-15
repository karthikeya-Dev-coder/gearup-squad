import { User, Equipment, StaffEquipmentRequest } from '@/types';
import React, { useState, useEffect, useCallback } from 'react';
import { useEquipment } from '@/lib/EquipmentContext';
import {
  getStaffEquipmentRequests,
  updateStaffEquipmentRequestStatus,
} from '@/lib/staffEquipmentRequestsStorage';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Package, Layers, CircleCheck, Activity, Inbox } from 'lucide-react';
import { toast } from 'sonner';

// Import Modular Dialogs
import { AddEquipment } from './add';
import { EditEquipment } from './edit';
import { DeleteEquipment } from './delete';

import { useUsers } from '@/lib/UserContext';

export default function ManageEquipment() {
  const { equipment, addEquipment, updateEquipment, deleteEquipment } = useEquipment();
  const { users } = useUsers();
  
  const staff = users.filter(u => u.role === 'staff');
  const [search, setSearch] = useState('');
  const [staffRequests, setStaffRequests] = useState(() =>
    getStaffEquipmentRequests().filter(r => r.status === 'pending')
  );
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [prefillFromRequest, setPrefillFromRequest] = useState<
    | null
    | (Partial<Pick<Equipment, 'name' | 'category' | 'assignedStaffId'>> & { totalQuantity?: number })
  >(null);
  const [requestToAutoFulfill, setRequestToAutoFulfill] = useState<StaffEquipmentRequest | null>(null);

  const refreshStaffRequests = useCallback(() => {
    setStaffRequests(getStaffEquipmentRequests().filter(r => r.status === 'pending'));
  }, []);

  useEffect(() => {
    refreshStaffRequests();
    window.addEventListener('staff-equipment-requests-changed', refreshStaffRequests);
    return () => window.removeEventListener('staff-equipment-requests-changed', refreshStaffRequests);
  }, [refreshStaffRequests]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Sort by ID descending (newest first) so added items appear at the top
  const sorted = [...equipment].sort((a, b) => b.id.localeCompare(a.id));

  const filtered = sorted.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) || 
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedEquipment = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to first page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleAdd = (item: Equipment) => {
    addEquipment(item);
  };

  const handleUpdate = (updated: Equipment) => {
    updateEquipment(updated);
  };

  const handleDelete = (id: string) => {
    deleteEquipment(id);
  };

  const getStaffName = (id?: string) => staff.find(s => s.id === id)?.name || '—';

  const totalSkus = equipment.length;
  const totalUnits = equipment.reduce((sum, e) => sum + e.totalQuantity, 0);
  const totalAvailable = equipment.reduce((sum, e) => sum + e.available, 0);
  const totalInUse = equipment.reduce((sum, e) => sum + e.inUse, 0);

  const openAddFromRequest = (req: StaffEquipmentRequest) => {
    setRequestToAutoFulfill(req);
    setPrefillFromRequest({
      name: req.equipmentName,
      totalQuantity: req.quantity,
      assignedStaffId: req.staffId,
    });
    setAddDialogOpen(true);
  };

  const declineStaffRequest = (id: string) => {
    updateStaffEquipmentRequestStatus(id, 'dismissed');
    toast.success('Declined — staff will no longer see this as pending');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipment Management"
        description="Manage all sports equipment inventory"
        action={
          <AddEquipment
            onAdd={handleAdd}
            staff={staff}
            open={addDialogOpen}
            onOpenChange={(o) => {
              setAddDialogOpen(o);
              if (!o) {
                setPrefillFromRequest(null);
                setRequestToAutoFulfill(null);
              }
            }}
            prefill={prefillFromRequest ?? undefined}
            onAdded={() => {
              if (!requestToAutoFulfill) return;
              updateStaffEquipmentRequestStatus(requestToAutoFulfill.id, 'fulfilled');
              toast.success('Done — request fulfilled and staff updated');
            }}
          />
        }
      />


      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-muted/20 space-y-1">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-muted-foreground shrink-0" />
            <h3 className="text-sm font-semibold text-foreground">Staff equipment requests</h3>
            {staffRequests.length > 0 && (
              <span className="text-xs font-medium text-primary">{staffRequests.length} pending</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground pl-6">
            Flow: Staff → My Equipment → Send request → you review here → <span className="font-medium text-foreground">Done</span> after stocking / assigning, or <span className="font-medium text-foreground">Decline</span> if you can’t fulfill.
          </p>
        </div>
        {staffRequests.length === 0 ? (
          <div className="py-10 px-5 text-center text-sm text-muted-foreground">
            No pending requests. When staff submit a request, it will show up in this table.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead className="text-center w-24">Qty</TableHead>
                <TableHead className="hidden md:table-cell w-44">Received</TableHead>
                <TableHead className="text-right min-w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffRequests.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.staffName}</TableCell>
                  <TableCell>{r.equipmentName}</TableCell>
                  <TableCell className="text-center">{r.quantity}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button size="sm" onClick={() => openAddFromRequest(r)}>
                        Done
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => declineStaffRequest(r.id)}>
                        Decline
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-x-auto">
        <div className="px-6 py-4 border-b border-border bg-muted/10">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search equipment..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Equipment</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">Available</TableHead>
              <TableHead className="text-center hidden sm:table-cell">In Use</TableHead>
              <TableHead className="hidden md:table-cell">Assigned Staff</TableHead>
              <TableHead className="text-right px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEquipment.map(e => (
              <TableRow key={e.id} className="group hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">{e.name}</TableCell>
                <TableCell className="text-muted-foreground">{e.category}</TableCell>
                <TableCell className="text-center font-semibold">{e.totalQuantity}</TableCell>
                <TableCell className="text-center font-bold text-success">{e.available}</TableCell>
                <TableCell className="text-center hidden sm:table-cell text-info font-medium">{e.inUse}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{getStaffName(e.assignedStaffId)}</TableCell>
                <TableCell className="text-right px-6">
                  <div className="flex items-center justify-end gap-2">
                    <EditEquipment equipment={e} onUpdate={handleUpdate} staff={staff} />
                    <DeleteEquipment equipment={e} onDelete={handleDelete} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/10">
            <div className="text-sm text-muted-foreground hidden sm:block">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="text-sm font-medium text-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
