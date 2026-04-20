import { User } from '@/types';
import React, { useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Upload, Search, Eye, Loader2, AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// Import Modular Components
import { AddStudent } from './add';
import { EditStudent } from './edit';
import { DeleteStudent } from './delete';
import { ViewStudent } from './view';
import { BulkImportDialog } from './bulk-import';

import { useUsers } from '@/lib/UserContext';
import { useData } from '@/lib/BookingContext';

export default function ManageStudents() {
  const { users, addUser, updateUser, deleteUser, bulkImportUsers, isLoading, error, refreshUsers } = useUsers();
  const { getWarningCount, isStudentSuspended } = useData();
  
  const students = users.filter(u => u.role === 'student');
  const [search, setSearch] = useState('');
  const [filterWarnings, setFilterWarnings] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewStudent, setViewStudent] = useState<User | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Bulk Import State
  const [bulkOpen, setBulkOpen] = useState(false);

  const filtered = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                         s.email.toLowerCase().includes(search.toLowerCase());
    
    const wCount = getWarningCount(s.id);
    const matchesWarnings = filterWarnings === 'All' || 
                           (filterWarnings === '0' && wCount === 0) ||
                           (filterWarnings === '1' && wCount === 1) ||
                           (filterWarnings === '2' && wCount === 2) ||
                           (filterWarnings === '3' && wCount === 3);
    
    const isSuspended = isStudentSuspended(s.id);
    const matchesStatus = filterStatus === 'All' ||
                         (filterStatus === 'Active' && s.isActive && !isSuspended) ||
                         (filterStatus === 'Suspended' && isSuspended) ||
                         (filterStatus === 'Inactive' && !s.isActive && !isSuspended);

    return matchesSearch && matchesWarnings && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedStudents = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to first page when searching or filtering
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, filterWarnings, filterStatus]);

  const handleAdd = async (newStudent: Partial<User>) => {
    await addUser({ ...newStudent, role: 'student' });
  };

  const handleUpdate = async (updated: Partial<User> & { id: string }) => {
    await updateUser(updated);
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
  };

  const handleBulkConfirm = async (students: User[], sendCredentials: boolean) => {
    await bulkImportUsers(students, sendCredentials);
    setBulkOpen(false);
  };

  if (isLoading && students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium">Loading students record...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Students"
        description={`${students.length} enrollment records found`}
        action={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setBulkOpen(true)} className="hidden md:flex hover:bg-primary hover:text-white border-primary/50 text-primary transition-all duration-300">
              <Upload className="w-4 h-4 mr-2" />CSV Import
            </Button>
            <AddStudent onAdd={handleAdd} />
          </div>
        }
      />

      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive animate-fade-in">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between w-full">
            <span>Failed to load student data. Please check your connection.</span>
            <Button variant="outline" size="sm" onClick={() => refreshUsers()} className="h-7 text-xs bg-card hover:bg-muted">
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Advanced Filter Section */}
      <div className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search students by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary/30 focus:ring-primary/10 transition-all rounded-xl shadow-inner-sm"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-background/50 p-1 rounded-xl border border-border/50 shadow-inner-sm">
              <Select value={filterWarnings} onValueChange={setFilterWarnings}>
                <SelectTrigger className="w-[140px] h-9 bg-transparent border-0 focus:ring-0 text-xs font-bold ring-offset-0 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer rounded-lg">
                  <SelectValue placeholder="Warnings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All" className="text-xs font-medium">All Warnings</SelectItem>
                  <SelectItem value="0" className="text-xs font-medium">No Warnings</SelectItem>
                  <SelectItem value="1" className="text-xs font-medium">1 Warning</SelectItem>
                  <SelectItem value="2" className="text-xs font-medium">2 Warnings</SelectItem>
                  <SelectItem value="3" className="text-xs font-medium">3 Warnings</SelectItem>
                </SelectContent>
              </Select>

              <div className="w-px h-4 bg-border/50 mx-1" />

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px] h-9 bg-transparent border-0 focus:ring-0 text-xs font-bold ring-offset-0 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer rounded-lg">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All" className="text-xs font-medium">All Status</SelectItem>
                  <SelectItem value="Active" className="text-xs font-medium">Active Only</SelectItem>
                  <SelectItem value="Suspended" className="text-xs font-medium">Suspended</SelectItem>
                  <SelectItem value="Inactive" className="text-xs font-medium">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(search || filterWarnings !== 'All' || filterStatus !== 'All') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearch(''); setFilterWarnings('All'); setFilterStatus('All'); }}
                className="text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3 mr-2" /> Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px] sm:w-[80px]">No.</TableHead>
                <TableHead>Student</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell text-center">Warnings</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right px-4 sm:px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((s, index) => (
                  <TableRow key={s.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="font-bold text-muted-foreground/30">
                      {((currentPage - 1) * itemsPerPage) + index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-3 text-left">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                                {s.name.charAt(0)}
                            </div>
                            <span className="truncate max-w-[150px]">{s.name}</span>
                        </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{s.email}</TableCell>
                    <TableCell className="hidden sm:table-cell text-center">
                        <span className={`font-mono font-bold ${getWarningCount(s.id) >= 2 ? 'text-destructive' : 'text-foreground'}`}>
                            {getWarningCount(s.id)}/3
                        </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <StatusBadge status={isStudentSuspended(s.id) ? 'Suspended' : (s.isActive ? 'Active' : 'Inactive')} />
                    </TableCell>
                    <TableCell className="text-right px-4 sm:px-6">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-8 h-8 sm:w-9 sm:h-9 bg-transparent hover:bg-transparent text-emerald-500 hover:text-emerald-500 shadow-none ring-0 focus:ring-0"
                            onClick={() => { setViewStudent(s); setViewOpen(true); }}
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                        <EditStudent student={s} onUpdate={handleUpdate} />
                        <DeleteStudent student={s} onDelete={handleDelete} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    {search ? 'No students match your search.' : 'No students registered yet.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
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

      <ViewStudent 
        student={viewStudent} 
        open={viewOpen} 
        onOpenChange={setViewOpen}
        warningCount={viewStudent ? getWarningCount(viewStudent.id) : 0}
        isSuspended={viewStudent ? isStudentSuspended(viewStudent.id) : false}
      />

      <BulkImportDialog 
        open={bulkOpen} 
        onOpenChange={setBulkOpen} 
        onConfirm={handleBulkConfirm} 
      />
    </div>
  );
}
