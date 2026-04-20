import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GraduationCap, ShieldCheck, Mail, Download, Upload, CheckCircle2, Trash2, Keyboard, Loader2 } from 'lucide-react';
import { User } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (students: Partial<User>[], sendCredentials: boolean) => Promise<void>;
}

interface ManualRow {
  name: string;
  email: string;
}

export function BulkImportDialog({ open, onOpenChange, onConfirm }: BulkImportDialogProps) {
  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  const [entryMode, setEntryMode] = useState<'file' | 'manual'>('file');
  const [pendingStudents, setPendingStudents] = useState<Partial<User>[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualRows, setManualRows] = useState<ManualRow[]>([
    { name: '', email: '' },
    { name: '', email: '' },
    { name: '', email: '' },
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    const headers = ['Full Name', 'Email Address'];
    const rows = [
      ['John Doe', 'john@university.edu'],
      ['Jane Smith', 'jane@university.edu'],
    ];
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'student_bulk_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Template downloaded successfully');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Invalid file type. Please upload a CSV file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const students: Partial<User>[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const [name, email] = line.split(',').map(s => s.trim());
        
        if (name && email && email.includes('@')) {
          students.push({
            name,
            email,
            role: 'student'
          });
        }
      }

      if (students.length === 0) {
        toast.error('No valid student records found in the CSV.');
        return;
      }

      setPendingStudents(students);
      setStep('preview');
      toast.success(`Successfully parsed ${students.length} records`);
    };
    reader.readAsText(file);
  };

  const handleRemoveRow = (index: number) => {
    if (manualRows.length <= 1) return;
    setManualRows(manualRows.filter((_, i) => i !== index));
  };

  const handleManualInputChange = (index: number, field: keyof ManualRow, value: string) => {
    const newRows = [...manualRows];
    newRows[index][field] = value;
    setManualRows(newRows);
  };

  const handleProcessManual = () => {
    const validRows = manualRows.filter(row => row.name.trim() && row.email.trim() && row.email.includes('@'));
    
    if (validRows.length === 0) {
      toast.error('Please fill in at least one valid student record.');
      return;
    }

    const students: Partial<User>[] = validRows.map((row) => ({
      name: row.name.trim(),
      email: row.email.trim(),
      role: 'student'
    }));

    setPendingStudents(students);
    setStep('preview');
  };

  const handleFinalConfirm = async (sendCredentials: boolean) => {
    if (pendingStudents.length === 0) return;
    setIsSubmitting(true);
    try {
      await onConfirm(pendingStudents, sendCredentials);
      onOpenChange(false);
    } catch (err) {
      // Error handled by UserContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setStep('upload');
    setEntryMode('file');
    setPendingStudents([]);
    setIsSubmitting(false);
    setManualRows([
      { name: '', email: '' },
      { name: '', email: '' },
      { name: '', email: '' },
    ]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDialogClose = (newOpen: boolean) => {
    if (isSubmitting) return; // Prevent closing while processing
    onOpenChange(newOpen);
    if (!newOpen) {
      setTimeout(reset, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className={cn(
        "bg-card border-border shadow-elevated overflow-hidden p-0 gap-0 transition-all duration-300 w-[95vw] sm:w-full",
        step === 'upload' && entryMode === 'manual' ? "sm:max-w-2xl" : "sm:max-w-md"
      )}>
        <DialogHeader className="p-6 border-b border-border/50 bg-muted/20">
          <DialogTitle className="text-xl font-bold tracking-tight">
            {step === 'upload' ? 'Bulk Student Enrollment' : 'Confirm Enrollment'}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {step === 'upload' ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex p-1 bg-muted rounded-xl gap-1">
                <button 
                  disabled={isSubmitting}
                  onClick={() => setEntryMode('file')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all",
                    entryMode === 'file' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Upload className="w-3.5 h-3.5" />
                  File Upload
                </button>
                <button 
                  disabled={isSubmitting}
                  onClick={() => setEntryMode('manual')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all",
                    entryMode === 'manual' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Keyboard className="w-3.5 h-3.5" />
                  Quick Entry
                </button>
              </div>

              {entryMode === 'file' ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Download className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-foreground">Download Template</p>
                      <p className="text-xs text-muted-foreground">
                        Use our template to ensure your CSV formatting is correct.
                      </p>
                      <Button variant="link" onClick={handleDownloadTemplate} className="h-auto p-0 text-primary text-xs font-bold">
                        Download (.csv)
                      </Button>
                    </div>
                  </div>

                  <div 
                    className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm font-bold">Select CSV File</p>
                      <p className="text-xs text-muted-foreground">Drag and drop supported</p>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileChange} />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    {manualRows.map((row, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <div className="flex-1 space-y-2">
                          <Input 
                            placeholder="Full Name" 
                            value={row.name} 
                            onChange={(e) => handleManualInputChange(index, 'name', e.target.value)}
                            className="h-10 text-sm"
                          />
                        </div>
                        <div className="flex-[1.5] space-y-2">
                          <Input 
                            placeholder="University Email" 
                            type="email"
                            value={row.email} 
                            onChange={(e) => handleManualInputChange(index, 'email', e.target.value)}
                            className="h-10 text-sm"
                          />
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 text-muted-foreground hover:text-destructive shrink-0"
                          onClick={() => handleRemoveRow(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setManualRows([...manualRows, { name: '', email: '' }])}
                      className="flex-1 h-10 border-dashed border-2 font-bold gap-2 text-xs"
                    >
                      Add Row
                    </Button>
                    <Button 
                      onClick={handleProcessManual}
                      className="flex-1 h-10 gradient-primary text-white font-bold gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Validate Data
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-black tracking-widest justify-center opacity-60">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Verified Institutional Enrollment
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-400">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-primary to-primary-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40">
                  <GraduationCap className="w-12 h-12 text-white" />
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-white w-9 h-9 rounded-full border-4 border-card flex items-center justify-center font-bold text-sm">
                    {pendingStudents.length}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-foreground tracking-tight">Records Processed</h4>
                <p className="text-sm text-muted-foreground max-w-[300px] leading-relaxed">
                    We've validated <span className="font-extrabold text-primary">{pendingStudents.length} students</span>.
                </p>
              </div>

              <div className="w-full space-y-3 pt-2">
                <Button 
                  onClick={() => handleFinalConfirm(true)} 
                  disabled={isSubmitting}
                  className="w-full h-14 gradient-primary text-white font-black text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all rounded-2xl flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                  {isSubmitting ? 'Enrolling Students...' : 'Enroll & Send Credentials'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleFinalConfirm(false)} 
                  disabled={isSubmitting}
                  className="w-full h-12 border-2 font-bold hover:bg-muted transition-colors rounded-xl"
                >
                  Enroll without email
                </Button>
                <Button 
                  variant="ghost" 
                  disabled={isSubmitting}
                  onClick={() => setStep('upload')} 
                  className="w-full text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  Back
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

