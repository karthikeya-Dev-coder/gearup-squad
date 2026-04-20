import { Equipment, StaffEquipmentRequest } from '@/types';
import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/lib/AuthContext';
import { useEquipment } from '@/lib/EquipmentContext';
import { SendHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

export default function StaffEquipment() {
  const { user } = useAuth();
  const { equipment: allEquipment, staffRequests, addStaffRequest } = useEquipment();

  const assignedEquipment = allEquipment.filter(
    e => e.assignedStaffId != null && e.assignedStaffId === user?.id
  );

  const [requestOpen, setRequestOpen] = useState(false);
  const [reqName, setReqName] = useState('');
  const [reqQty, setReqQty] = useState('1');

  const myPendingRequests = staffRequests.filter(
    r => r.staffId === user?.id && r.status === 'pending'
  );

  const submitRequest = async () => {
    if (!user) {
      toast.error('Sign in required');
      return;
    }
    const name = reqName.trim();
    if (!name) {
      toast.error('Enter equipment name or type');
      return;
    }
    const qty = parseInt(reqQty, 10);
    if (Number.isNaN(qty) || qty < 1) {
      toast.error('Enter a valid quantity (1 or more)');
      return;
    }
    
    try {
      await addStaffRequest({
        staffId: user.id,
        equipmentName: name,
        quantity: qty,
      });
      toast.success('Request sent to admin');
      setReqName('');
      setReqQty('1');
      setRequestOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Equipment"
        description="Assigned inventory and extra stock requests in one place."
        action={
          <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <SendHorizontal className="w-4 h-4" />
                Send request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Request equipment from admin</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  1) Submit here → 2) Admin sees it under Equipment Management → 3) You’ll see it cleared from Pending when they mark Done or Decline.
                </p>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="req-equipment">Equipment name / type</Label>
                  <Input
                    id="req-equipment"
                    placeholder="e.g. Cricket balls, nets…"
                    value={reqName}
                    onChange={e => setReqName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="req-qty">Quantity needed</Label>
                  <Input
                    id="req-qty"
                    type="number"
                    min={1}
                    value={reqQty}
                    onChange={e => setReqQty(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRequestOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submitRequest}>Send request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="bg-card rounded-xl border border-border shadow-card overflow-x-auto">
        <div className="px-5 py-3 border-b border-border bg-muted/15">
          <h3 className="text-sm font-semibold text-foreground">Assigned equipment</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Only items your admin assigned to you.</p>
        </div>
        {assignedEquipment.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No equipment assigned yet. Ask admin to assign items, or use <span className="font-medium text-foreground">Send request</span> for more stock.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Available</TableHead>
                <TableHead className="text-center">In Use</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedEquipment.map((e: Equipment) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell className="text-muted-foreground">{e.category}</TableCell>
                  <TableCell className="text-center text-success font-medium">{e.available}</TableCell>
                  <TableCell className="text-center text-info font-medium">{e.inUse}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-x-auto">
        <div className="px-5 py-3 border-b border-border bg-muted/15">
          <h3 className="text-sm font-semibold text-foreground">Your pending requests</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Open until admin marks Done or Decline in Equipment Management.</p>
        </div>
        {myPendingRequests.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No pending requests. Use <span className="font-medium text-foreground">Send request</span> above if you need more equipment.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead className="text-center w-24">Qty</TableHead>
                <TableHead className="w-36">Status</TableHead>
                <TableHead className="hidden sm:table-cell text-muted-foreground">Sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myPendingRequests.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.equipmentName}</TableCell>
                  <TableCell className="text-center">{r.quantity}</TableCell>
                  <TableCell>
                    <StatusBadge status="Pending" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
