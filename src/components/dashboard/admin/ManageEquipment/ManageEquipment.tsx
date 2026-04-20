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
  const { 
    equipment, 
    staffRequests,
    isLoading, 
    error, 
    addEquipment, 
    updateEquipment, 
    deleteEquipment, 
    refreshEquipment,
    updateStaffRequestStatus
  } = useEquipment();
  const { users } = useUsers();
  
  const staff = users.filter(u => u.role === 'staff');
  const [search, setSearch] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [prefillFromRequest, setPrefillFromRequest] = useState<
    | null
    | (Partial<Pick<Equipment, 'name' | 'category' | 'assignedStaffId'>> & { totalQuantity?: number })
  >(null);
  const [requestToAutoFulfill, setRequestToAutoFulfill] = useState<StaffEquipmentRequest | null>(null);

  const pendingRequests = staffRequests.filter(r => r.status === 'pending');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Sort by name for stability
  const sorted = [...equipment].sort((a, b) => a.name.localeCompare(b.name));

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

  const handleAdd = async (item: Partial<Equipment>) => {
    try {
      await addEquipment(item);
      toast.success('Equipment added successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add equipment');
    }
  };

  const handleUpdate = async (id: string, updated: Partial<Equipment>) => {
    try {
      await updateEquipment(id, updated);
      toast.success('Equipment updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update equipment');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEquipment(id);
      toast.success('Equipment removed from inventory');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete equipment');
    }
  };

  const getStaffName = (id?: string) => staff.find(s => s.id === id)?.name || '—';

  const openAddFromRequest = (req: StaffEquipmentRequest) => {
    setRequestToAutoFulfill(req);
    setPrefillFromRequest({
      name: req.equipmentName,
      totalQuantity: req.quantity,
      assignedStaffId: req.staffId,
    });
    setAddDialogOpen(true);
  };

  const declineStaffRequest = async (id: string) => {
    try {
      await updateStaffRequestStatus(id, 'dismissed');
      toast.success('Declined — staff will no longer see this as pending');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Activity className="w-10 h-10 text-primary animate-pulse" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading inventory data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto text-destructive">
          <Activity className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-destructive">Inventory Sync Error</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
        <Button onClick={() => refreshEquipment()} variant="outline" className="border-destructive/30 hover:bg-destructive/10">
          Try Again
        </Button>
      </div>
    );
  }

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
            onAdded={async () => {
              if (!requestToAutoFulfill) return;
              try {
                await updateStaffRequestStatus(requestToAutoFulfill.id, 'fulfilled');
                toast.success('Done — request fulfilled and staff updated');
              } catch (err: any) {
                toast.error(err.message);
              }
            }}
          />
        }
      />


      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-muted/20 space-y-1">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-muted-foreground shrink-0" />
            <h3 className="text-sm font-semibold text-foreground">Staff equipment requests</h3>
            {pendingRequests.length > 0 && (
              <span className="text-xs font-medium text-primary">{pendingRequests.length} pending</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground pl-6">
            Flow: Staff → My Equipment → Send request → you review here → <span className="font-medium text-foreground">Done</span> after stocking / assigning, or <span className="font-medium text-foreground">Decline</span> if you can’t fulfill.
          </p>
        </div>
        {pendingRequests.length === 0 ? (
          <div className="py-10 px-5 text-center text-sm text-muted-foreground">
            No pending requests. When staff submit a request, it will show up in this table.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead className="text-center w-20">Qty</TableHead>
                <TableHead className="hidden lg:table-cell w-44">Received</TableHead>
                <TableHead className="text-right px-4 sm:px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRequests.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.staffName}</TableCell>
                  <TableCell>{r.equipmentName}</TableCell>
                  <TableCell className="text-center">{r.quantity}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right px-4 sm:px-6">
                    <div className="flex flex-wrap justify-end gap-1.5 sm:gap-2">
                      <Button size="sm" onClick={() => openAddFromRequest(r)} className="h-8 px-3 text-xs">
                        Done
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => declineStaffRequest(r.id)} className="h-8 px-3 text-xs">
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
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">Available</TableHead>
              <TableHead className="text-center hidden md:table-cell">In Use</TableHead>
              <TableHead className="hidden lg:table-cell">Assigned Staff</TableHead>
              <TableHead className="text-right px-4 sm:px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEquipment.map(e => (
              <TableRow key={e.id} className="group hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium text-sm">{e.name}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">{e.category}</TableCell>
                <TableCell className="text-center font-semibold">{e.totalQuantity}</TableCell>
                <TableCell className="text-center font-bold text-success">{e.available}</TableCell>
                <TableCell className="text-center hidden md:table-cell text-info font-medium">{e.inUse}</TableCell>
                <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{getStaffName(e.assignedStaffId)}</TableCell>
                <TableCell className="text-right px-4 sm:px-6">
                  <div className="flex items-center justify-end gap-1 sm:gap-2">
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
