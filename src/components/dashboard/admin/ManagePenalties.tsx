import { User, Warning } from '@/types';
import React, { useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/lib/BookingContext';
import { IndianRupee, ShieldAlert, CreditCard, Plus, Users, FileText, AlertCircle, Trash2, History, AlertTriangle, CheckCircle2, RotateCcw, Check, ChevronsUpDown, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useUsers } from '@/lib/UserContext';
import { useAuth } from '@/lib/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

export default function ManagePenalties() {
  const { warnings, isLoading, error, clearWarnings, payPenalty, issueWarning, isStudentSuspended, getMonthlyUnpaidCount, refreshData } = useData();
  const { users } = useUsers();
  const { user } = useAuth();

  const [selectedWarning, setSelectedWarning] = useState<Warning | null>(null);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();

  // Form state
  const [newPenalty, setNewPenalty] = useState({
    studentId: '',
    reason: '',
    amount: 0,
    level: 1 as 1 | 2 | 3
  });

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

  const handleIssuePenalty = async () => {
    if (!newPenalty.studentId || !newPenalty.reason) {
      toast.error('Please select a student and provide a reason');
      return;
    }

    setIsSubmitting(true);
    try {
      const student = students.find(s => s.id === newPenalty.studentId);
      await issueWarning({
        ...newPenalty,
        studentName: student?.name,
        issuedBy: user?.id
      });
      toast.success('Penalty issued successfully!');
      setIssueDialogOpen(false);
      setNewPenalty({ studentId: '', reason: '', amount: 0, level: 1 });
    } catch (err: any) {
      toast.error(err.message || 'Failed to issue penalty');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader title="Penalty Management" description="Track and manage student penalties per month" />
        <Button onClick={() => setIssueDialogOpen(true)} className="gradient-primary text-white shadow-lg shadow-primary/20 font-black rounded-2xl h-12 px-6 flex items-center gap-2 w-fit">
          <Plus className="w-5 h-5" />
          Issue Manual Penalty
        </Button>
      </div>

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

      {/* Issue Manual Penalty Dialog */}
      <Dialog open={issueDialogOpen} onOpenChange={setIssueDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md p-0 overflow-hidden rounded-[2.5rem] border-none shadow-3xl bg-card">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 pb-6 text-white shrink-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <DialogHeader className="text-left relative z-10">
              <DialogTitle className="text-2xl font-black flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center backdrop-blur-md border border-white/10">
                  <ShieldAlert className="w-7 h-7 text-primary" />
                </div>
                Issue Penalty
              </DialogTitle>
              <DialogDescription className="text-slate-400 font-bold text-sm mt-3 leading-relaxed">
                Manually record a disciplinary action. This will affect the student's status immediately.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-5 py-6 space-y-5 bg-card/50 backdrop-blur-sm -mt-5 rounded-t-[2rem] relative z-20">
            <div className="space-y-5">
              <div className="space-y-3">
                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-1 opacity-70">
                  <Users className="w-3.5 h-3.5" /> Select Student
                </Label>

                {isMobile ? (
                  <Drawer open={popoverOpen} onOpenChange={setPopoverOpen} modal={false}>
                    <DrawerTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-12 rounded-xl border-primary/20 bg-primary/5 hover:bg-primary/10 focus:ring-primary/20 transition-all group flex items-center justify-between px-5"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-wider text-primary/60">Select Student</p>
                            <p className="font-black text-foreground">
                              {newPenalty.studentId
                                ? students.find((s) => s.id === newPenalty.studentId)?.name
                                : "Click to select"}
                            </p>
                          </div>
                        </div>
                        <ChevronsUpDown className="h-5 w-5 opacity-30 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent
                      onOpenAutoFocus={(e) => e.preventDefault()}
                      onCloseAutoFocus={(e) => e.preventDefault()}
                      className="rounded-t-[2.5rem] border-none shadow-3xl pb-10"
                    >
                      <DrawerHeader className="text-left px-6">
                        <DrawerTitle className="text-2xl font-black">Select Student</DrawerTitle>
                        <DrawerDescription className="font-bold text-slate-500">Search and select a student to issue penalty</DrawerDescription>
                      </DrawerHeader>
                      <div className="px-2">
                        <Command className="bg-transparent">
                          <CommandInput placeholder="Search student..." className="h-14 border-none focus:ring-0 font-bold" />
                          <CommandEmpty className="py-10 text-center font-bold text-muted-foreground">No student found.</CommandEmpty>
                          <CommandList className="max-h-[350px]">
                            <ScrollArea className="h-[300px]">
                              <CommandGroup>
                                {students.map((s) => (
                                  <CommandItem
                                    key={s.id}
                                    value={`${s.name} ${s.email}`}
                                    onSelect={() => {
                                      setNewPenalty(prev => ({ ...prev, studentId: s.id }));
                                      setPopoverOpen(false);
                                    }}
                                    className="flex items-center justify-between py-3 px-4 rounded-xl my-1 mx-2 cursor-pointer font-bold data-[selected='true']:bg-emerald-600 data-[selected='true']:text-white transition-all border border-transparent data-[selected='true']:border-emerald-500/20"
                                  >
                                    <div className="flex flex-col">
                                      <span>{s.name}</span>
                                      <span className="text-[10px] font-medium opacity-50">{s.email}</span>
                                    </div>
                                    {newPenalty.studentId === s.id && <Check className="h-5 w-5 text-primary" />}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </ScrollArea>
                          </CommandList>
                        </Command>
                      </div>
                    </DrawerContent>
                  </Drawer>
                ) : (
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen} modal={false}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={popoverOpen}
                        className="w-full h-12 rounded-xl border-primary/20 bg-primary/5 hover:bg-primary/10 focus:ring-primary/20 transition-all group flex items-center justify-between px-5"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-wider text-primary/60">Select Student</p>
                            <p className="font-black text-foreground">
                              {newPenalty.studentId
                                ? students.find((s) => s.id === newPenalty.studentId)?.name
                                : "Click to select"}
                            </p>
                          </div>
                        </div>
                        <ChevronsUpDown className="h-5 w-5 opacity-30 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      onOpenAutoFocus={(e) => e.preventDefault()}
                      onCloseAutoFocus={(e) => e.preventDefault()}
                      className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-border/50 shadow-3xl overflow-hidden bg-card h-[220px]"
                      align="start"
                    >
                      <Command className="bg-transparent h-full flex flex-col">
                        <CommandInput placeholder="Search student name or email..." className="h-12 border-none focus:ring-0 font-bold shrink-0" />
                        <CommandEmpty className="py-6 text-center text-xs font-bold text-muted-foreground shrink-0">No student found.</CommandEmpty>
                        <CommandList className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
                          <CommandGroup>
                            {students.map((s) => (
                              <CommandItem
                                key={s.id}
                                value={`${s.name} ${s.email}`}
                                onSelect={() => {
                                  setNewPenalty(prev => ({ ...prev, studentId: s.id }));
                                  setPopoverOpen(false);
                                }}
                                className="flex items-center justify-between py-2 px-4 rounded-lg my-1 mx-1 cursor-pointer font-bold data-[selected='true']:bg-emerald-600 data-[selected='true']:text-white transition-all"
                              >
                                <div className="flex flex-col">
                                  <span>{s.name}</span>
                                  <span className="text-[10px] font-medium opacity-50">{s.email}</span>
                                </div>
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    newPenalty.studentId === s.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-1 opacity-70">
                  <FileText className="w-3.5 h-3.5" /> Reason for Penalty
                </Label>
                <div className="relative group">
                  <Input
                    placeholder="e.g. Broken equipment, lost item..."
                    className="h-12 rounded-xl border-border/50 bg-muted/30 focus:ring-primary/20 font-bold text-sm pl-4 pr-10"
                    value={newPenalty.reason}
                    onChange={(e) => setNewPenalty(prev => ({ ...prev, reason: e.target.value }))}
                  />
                  <AlertCircle className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-1 opacity-70">
                    <History className="w-3.5 h-3.5" /> Level
                  </Label>
                  <Select
                    value={String(newPenalty.level)}
                    onValueChange={(val) => setNewPenalty(prev => ({ ...prev, level: parseInt(val) as any }))}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-border/50 bg-muted/30 focus:ring-primary/20 font-bold text-sm">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border/50 shadow-2xl">
                      <SelectItem value="1" className="rounded-xl my-1 font-bold text-yellow-600">Level 1 (Warning)</SelectItem>
                      <SelectItem value="2" className="rounded-xl my-1 font-bold text-orange-600">Level 2 (Final Warning)</SelectItem>
                      <SelectItem value="3" className="rounded-xl my-1 font-bold text-destructive">Level 3 (Suspension)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-1 opacity-70">
                    <IndianRupee className="w-3.5 h-3.5" /> Fine (₹)
                  </Label>
                  <Input
                    type="number"
                    className="h-12 rounded-xl border-border/50 bg-muted/30 focus:ring-primary/20 font-bold text-sm"
                    value={newPenalty.amount}
                    onChange={(e) => setNewPenalty(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 pt-2 flex flex-col sm:flex-row gap-4 border-t border-border/50 bg-muted/10">
            <Button variant="ghost" onClick={() => setIssueDialogOpen(false)} disabled={isSubmitting} className="flex-1 font-black rounded-xl h-12 border border-border/50 hover:bg-muted text-sm tracking-tight transition-all">
              Cancel
            </Button>
            <Button onClick={handleIssuePenalty} disabled={isSubmitting} className="flex-1 gradient-primary text-white shadow-xl shadow-primary/20 font-black rounded-xl h-12 border-none hover:scale-[1.02] active:scale-[0.98] transition-all text-sm tracking-tight">
              {isSubmitting ? 'Recording Violation...' : 'Confirm Penalty Strike'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
