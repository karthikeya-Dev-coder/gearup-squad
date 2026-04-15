import { User, Equipment, Booking, Warning, ActivityLog } from '@/types';
import React, { useState, useRef } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Upload, Mail, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';

// Import Modular Components
import { AddStudent } from './add';
import { EditStudent } from './edit';
import { DeleteStudent } from './delete';
import { ViewStudent } from './view';
import { BulkImportDialog } from './bulk-import';

import { useUsers } from '@/lib/UserContext';
import { useData } from '@/lib/BookingContext';

export default function ManageStudents() {
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const { getWarningCount, isStudentSuspended } = useData();
  
  const students = users.filter(u => u.role === 'student');
  const [search, setSearch] = useState('');
  const [viewStudent, setViewStudent] = useState<User | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Bulk Import State
  const [bulkOpen, setBulkOpen] = useState(false);
  const [pendingStudents, setPendingStudents] = useState<User[]>([]);

  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedStudents = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to first page when searching
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleAdd = (newStudent: User) => {
    addUser(newStudent);
  };

  const handleUpdate = (updated: User) => {
    updateUser(updated);
  };

  const handleDelete = (id: string) => {
    deleteUser(id);
  };

  const handleSendCredentials = (s: User) => {
    toast.success(`Credentials sent to ${s.email}`, {
      description: `User ID: ${s.id} | Password: sports@123`,
      duration: 5000,
    });
  };

  const handleBulkConfirm = (students: User[], sendCredentials: boolean) => {
    students.forEach(s => addUser(s));
    
    if (sendCredentials) {
        toast.success(`Success! Bulk enrollment complete`, {
            description: `Credentials sent to ${students.length} students via university email.`,
            duration: 5000,
        });
    } else {
        toast.success(`Enrolled ${students.length} students successfully.`);
    }

    setBulkOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Students"
        description={`${students.length} enrollment records found`}
        action={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setBulkOpen(true)} className="hidden md:flex">
              <Upload className="w-4 h-4 mr-2" />CSV Import
            </Button>
            <AddStudent onAdd={handleAdd} />
          </div>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search students..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="pl-10" 
        />
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden sm:table-cell text-center">Warnings</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.map(s => (
                <TableRow key={s.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">
                      <div className="flex items-center gap-3 text-left">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                              {s.name.charAt(0)}
                          </div>
                          <span className="truncate max-w-[150px]">{s.name}</span>
                      </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.email}</TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                      <span className={`font-mono font-bold ${getWarningCount(s.id) >= 2 ? 'text-destructive' : 'text-foreground'}`}>
                          {getWarningCount(s.id)}/3
                      </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <StatusBadge status={isStudentSuspended(s.id) ? 'Suspended' : (s.isActive ? 'Active' : 'Inactive')} />
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex items-center justify-end gap-2">

                      <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hover:text-primary"
                          onClick={() => { setViewStudent(s); setViewOpen(true); }}
                      >
                          <Eye className="w-4 h-4" />
                      </Button>
                      <EditStudent student={s} onUpdate={handleUpdate} />
                      <DeleteStudent student={s} onDelete={handleDelete} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
