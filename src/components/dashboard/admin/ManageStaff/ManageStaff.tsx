import { User, Equipment, Booking, Warning, ActivityLog } from '@/types';
import React, { useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { UserPlus, Mail, Search, Edit, Trash2, Eye, Filter, X, Users, UserCheck, Building2, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { ViewStaff } from './view';
import { EditStaff } from './edit';
import { DeleteStaff } from './delete';
import { AddStaff } from './add';

import { useUsers } from '@/lib/UserContext';

export default function ManageStaff() {
  const { users, addUser, updateUser, deleteUser } = useUsers();
  
  const staff = users.filter(u => u.role === 'staff');
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const departments = ['All', ...Array.from(new Set(staff.map(s => s.department)))];

  const filtered = staff.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = filterDept === 'All' || s.department === filterDept;
    const matchesStatus = filterStatus === 'All' ||
      (filterStatus === 'Active' ? s.isActive : !s.isActive);
    return matchesSearch && matchesDept && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedStaff = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to first page on search or filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, filterDept, filterStatus]);

  // Action states
  const [selectedStaff, setSelectedStaff] = useState<User | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleAdd = (newStaff: User) => {
    addUser(newStaff);
  };

  const handleUpdate = (updatedStaff: User) => {
    updateUser(updatedStaff);
  };

  const handleDelete = (id: string) => {
    deleteUser(id);
    toast.success('Staff removed successfully');
  };

  const handleSendCredentials = (s: User) => {
    toast.success(`Credentials sent to ${s.email}`, {
      description: `User ID: ${s.id} | Password: sports@123`,
      duration: 5000,
    });
  };

  const activeCount = staff.filter(s => s.isActive).length;
  const inactiveCount = staff.length - activeCount;
  const departmentCount = new Set(staff.map(s => s.department)).size;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Staff"
        description={`${staff.length} staff members`}
        action={<AddStaff onAdd={handleAdd} />}
      />



      {/* Advanced Filter Section with "Shade" look */}
      <div className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary/30 focus:ring-primary/10 transition-all rounded-xl shadow-inner-sm"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-background/50 p-1 rounded-xl border border-border/50 shadow-inner-sm">
              <Select value={filterDept} onValueChange={setFilterDept}>
                <SelectTrigger className="w-[140px] h-9 bg-transparent border-0 focus:ring-0 text-xs font-bold ring-offset-0">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept} className="text-xs font-medium">
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="w-px h-4 bg-border/50 mx-1" />

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px] h-9 bg-transparent border-0 focus:ring-0 text-xs font-bold ring-offset-0">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All" className="text-xs font-medium">All Status</SelectItem>
                  <SelectItem value="Active" className="text-xs font-medium">Active Only</SelectItem>
                  <SelectItem value="Suspended" className="text-xs font-medium">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(search || filterDept !== 'All' || filterStatus !== 'All') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearch(''); setFilterDept('All'); setFilterStatus('All'); }}
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden sm:table-cell">Department</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStaff.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell className="text-muted-foreground">{s.email}</TableCell>
                <TableCell className="hidden sm:table-cell">{s.department}</TableCell>
                <TableCell className="hidden sm:table-cell"><StatusBadge status={s.isActive ? 'Active' : 'Suspended'} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => { setSelectedStaff(s); setIsViewOpen(true); }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-indigo-600 hover:text-indigo-600 hover:bg-indigo-50"
                      onClick={() => { setSelectedStaff(s); setIsEditOpen(true); }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => { setSelectedStaff(s); setIsDeleteOpen(true); }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

      {/* Action Dialogs */}
      <ViewStaff
        staff={selectedStaff}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
      />
      <EditStaff
        staff={selectedStaff}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onUpdate={handleUpdate}
      />
      <DeleteStaff
        staff={selectedStaff}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
}
