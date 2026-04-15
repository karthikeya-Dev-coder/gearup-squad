import { Warning } from '@/types';
import React, { useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import { CheckCircle2, AlertTriangle, CreditCard, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '@/lib/BookingContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

export default function StaffWarnings() {
  const { warnings, payPenalty, clearWarnings } = useData();
  const [selectedWarning, setSelectedWarning] = useState<Warning | null>(null);
  const [payDialogOpen, setPayDialogOpen] = useState(false);

  const handlePayClick = (warning: Warning) => {
    setSelectedWarning(warning);
    setPayDialogOpen(true);
  };

  const handleConfirmPay = () => {
    if (selectedWarning) {
      payPenalty(selectedWarning.id);
      toast.success(`Penalty marked as paid successfully!`, {
        description: `Fine of ₹${selectedWarning.amount ?? 0} has been cleared for ${selectedWarning.studentName}.`
      });
      setPayDialogOpen(false);
      setSelectedWarning(null);
    }
  };

  const handleReset = (studentId: string, studentName: string) => {
    clearWarnings(studentId);
    toast.success('All penalties cleared successfully!', {
      description: `Disciplinary history reset for ${studentName}.`
    });
  };

  // Show all warnings from global context
  const allWarnings = warnings;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warnings & Penalties"
        description="Track student penalties and mark payments"
      />

      <div className="bg-card rounded-xl border border-border shadow-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Issued By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allWarnings.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                  No penalties on record
                </TableCell>
              </TableRow>
            )}
            {allWarnings.map(w => (
              <TableRow key={w.id} className={w.isPaid ? 'opacity-50' : ''}>
                <TableCell className="font-medium">{w.studentName}</TableCell>
                <TableCell>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    w.level === 3 ? 'bg-destructive/10 text-destructive'
                    : w.level === 2 ? 'bg-orange-500/10 text-orange-600'
                    : 'bg-yellow-500/10 text-yellow-600'
                  }`}>
                    Level {w.level}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{w.reason}</TableCell>
                <TableCell>
                  {w.amount
                    ? <span className="font-bold text-destructive">₹{w.amount}</span>
                    : <span className="text-muted-foreground">—</span>
                  }
                </TableCell>
                <TableCell>
                  {w.isPaid ? (
                    <Badge className="bg-green-500/10 text-green-600 border-transparent font-bold">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Paid
                    </Badge>
                  ) : (
                    <Badge className="bg-destructive/10 text-destructive border-transparent font-bold">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Unpaid
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{w.issuedBy}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(w.issuedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                   <div className="flex items-center justify-end gap-1">
                      {!w.isPaid ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[10px] h-7 px-3 border-green-500/50 text-green-600 hover:bg-green-50 font-bold"
                          onClick={() => handlePayClick(w)}
                        >
                          Pay
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground px-2">Cleared</span>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Reset all penalties for student"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => handleReset(w.studentId, w.studentName)}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </Button>
                   </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Confirm Payment Dialog */}
      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Confirm Penalty Payment
            </DialogTitle>
            <DialogDescription>
              Verify the payment details before marking this penalty as cleared.
            </DialogDescription>
          </DialogHeader>
          {selectedWarning && (
            <div className="py-4 space-y-4">
              <div className="bg-muted/50 p-4 rounded-xl border space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Student</span>
                  <span className="font-bold">{selectedWarning.studentName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reason</span>
                  <span className="font-medium text-right max-w-[200px]">{selectedWarning.reason}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Penalty Level</span>
                  <Badge variant="outline" className={
                    selectedWarning.level === 3 ? 'text-destructive border-destructive/20 bg-destructive/5' :
                    selectedWarning.level === 2 ? 'text-orange-600 border-orange-200 bg-orange-50' :
                    'text-yellow-600 border-yellow-200 bg-yellow-50'
                  }>Level {selectedWarning.level}</Badge>
                </div>
                <div className="pt-2 border-t border-border flex justify-between items-center text-lg">
                  <span className="font-bold">Total Amount</span>
                  <span className="font-black text-primary">₹ {selectedWarning.amount ?? 0}</span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground italic text-center">
                * Marking this as paid will count towards the student's monthly strike reset.
              </p>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="ghost" onClick={() => setPayDialogOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleConfirmPay} className="flex-1 gradient-primary text-white shadow-lg shadow-primary/20 font-bold">
              Mark as Paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
