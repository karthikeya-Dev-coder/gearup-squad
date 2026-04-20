import { User, Warning } from '@/types';
import React, { useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/lib/BookingContext';
import { AlertTriangle, RotateCcw, CheckCircle2, IndianRupee, ShieldAlert, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useUsers } from '@/lib/UserContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

export default function ManagePenalties() {
  const { warnings, isLoading, error, clearWarnings, payPenalty, isStudentSuspended, getMonthlyUnpaidCount, refreshData } = useData();
  const { users } = useUsers();

  const [selectedWarning, setSelectedWarning] = useState<Warning | null>(null);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const students = users.filter(u => u.role === 'student');

  const getStudentWarnings = (studentId: string) =>
    warnings.filter(w => w.studentId === studentId);

  const handlePayClick = (warning: Warning) => {
    setSelectedWarning(warning);
    setPayDialogOpen(true);
  };

  const handleConfirmPay = async () => {
    if (selectedWarning) {
      setIsSubmitting(true);
      try {
        await payPenalty(selectedWarning.id);
        toast.success(`Penalty marked as paid successfully!`, {
          description: `Fine of ₹${selectedWarning.amount ?? 0} has been cleared for ${selectedWarning.studentName}.`
        });
        setPayDialogOpen(false);
        setSelectedWarning(null);
      } catch (err: any) {
        toast.error(err.message || 'Failed to process penalty payment');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleReset = async (studentId: string) => {
    try {
      await clearWarnings(studentId);
      toast.success('All penalties cleared successfully!', {
        description: 'The student history has been reset and account status updated.'
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset penalties');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Penalty Management" description="Track and manage student penalties per month" />

      {/* Rule summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: '1st Unpaid Penalty', desc: 'Warning issued', color: 'text-yellow-500', dot: 'bg-yellow-500' },
          { label: '2nd Unpaid Penalty', desc: 'Final warning', color: 'text-orange-500', dot: 'bg-orange-500' },
          { label: '3rd Unpaid Penalty', desc: 'Account suspended', color: 'text-destructive', dot: 'bg-destructive' },
        ].map((item, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-5 shadow-card flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full ${item.dot}/10 flex items-center justify-center shrink-0`}>
              <ShieldAlert className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
              <p className={`font-bold text-sm ${item.color}`}>{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {error ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
          <p className="text-destructive font-bold mb-2">Penalty System Error</p>
          <p className="text-sm text-destructive/80 mb-4">{error}</p>
          <Button variant="outline" onClick={() => refreshData()} className="font-bold">
            Try Again
          </Button>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-bold animate-pulse">Loading Penalties...</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border shadow-card overflow-x-auto">

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 sm:px-6">Student</TableHead>
                <TableHead className="hidden sm:table-cell">Monthly Strikes</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead>History</TableHead>
                <TableHead className="text-right px-4 sm:px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(s => {
                const sw = getStudentWarnings(s.id);
                if (sw.length === 0) return null;

                const isSuspended = isStudentSuspended(s.id);
                const monthlyUnpaidCount = getMonthlyUnpaidCount(s.id);
                const unpaidPenalties = sw.filter(w => !w.isPaid);
                const totalUnpaidFine = unpaidPenalties.reduce((sum, w) => sum + (w.amount || 0), 0);

                return (
                  <TableRow key={s.id}>
                    {/* Student */}
                    <TableCell className="px-4 sm:px-6">
                      <div className="font-bold text-foreground text-sm sm:text-base">{s.name}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-none">{s.email}</div>
                      {totalUnpaidFine > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <IndianRupee className="w-3 h-3 text-destructive" />
                          <span className="text-[10px] sm:text-xs font-bold text-destructive">₹{totalUnpaidFine}</span>
                        </div>
                      )}
                    </TableCell>

                    {/* Monthly count */}
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[1, 2, 3].map(i => (
                            <div
                              key={i}
                              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-colors ${i <= monthlyUnpaidCount
                                  ? i === 3 ? 'bg-destructive' : i === 2 ? 'bg-orange-500' : 'bg-yellow-500'
                                  : 'bg-muted/30'
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="hidden md:table-cell">
                      <StatusBadge status={isSuspended ? 'Suspended' : 'Active'} />
                    </TableCell>

                    {/* Individual penalties */}
                    <TableCell>
                      <div className="flex flex-col gap-2 max-w-xs">
                        {sw.map(w => (
                          <div
                            key={w.id}
                            className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 border transition-all ${w.isPaid
                                ? 'bg-muted/20 border-border opacity-60'
                                : 'bg-destructive/5 border-destructive/20 shadow-sm'
                              }`}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {w.isPaid ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-foreground truncate">{w.reason}</p>
                                {w.isPaid ? (
                                  <p className="text-[10px] text-green-600">Paid · {new Date(w.paidAt!).toLocaleDateString()}</p>
                                ) : (
                                  w.amount && <p className="text-[10px] text-destructive font-bold">₹{w.amount} due</p>
                                )}
                              </div>
                            </div>
                            {!w.isPaid && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-[10px] h-6 px-2 border-green-500/50 text-green-600 hover:bg-green-50 shrink-0 font-bold"
                                onClick={() => handlePayClick(w)}
                              >
                                Pay
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>

                    {/* Admin override */}
                    <TableCell className="text-right px-4 sm:px-6">
                      <Button variant="ghost" size="sm" onClick={() => handleReset(s.id)} className="text-muted-foreground hover:text-destructive h-8 px-2 text-[10px] sm:text-xs">
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Reset
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {students.every(s => getStudentWarnings(s.id).length === 0) && (
            <div className="text-center py-16">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="font-bold text-foreground">No penalties on record</p>
              <p className="text-sm text-muted-foreground mt-1">All students are in good standing</p>
            </div>
          )}
        </div>
      )}

      {/* Confirm Payment Dialog */}
      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md">
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
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button variant="ghost" onClick={() => setPayDialogOpen(false)} disabled={isSubmitting} className="flex-1 w-full sm:w-auto">Cancel</Button>
            <Button onClick={handleConfirmPay} disabled={isSubmitting} className="flex-1 gradient-primary text-white shadow-lg shadow-primary/20 font-bold w-full sm:w-auto">
              {isSubmitting ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</span> : 'Mark as Paid'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
