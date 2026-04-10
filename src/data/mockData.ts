import { User, Equipment, Booking, Warning, ActivityLog } from '@/types';

export const mockUsers: User[] = [
  { id: 'admin-1', name: 'Dr. Rajesh Kumar', email: 'admin@sports.edu', role: 'admin', department: 'Sports Administration', createdAt: '2024-01-01', isActive: true },
  { id: 'staff-1', name: 'Priya Sharma', email: 'priya@sports.edu', role: 'staff', department: 'Cricket', createdAt: '2024-01-15', isActive: true },
  { id: 'staff-2', name: 'Amit Patel', email: 'amit@sports.edu', role: 'staff', department: 'Football', createdAt: '2024-02-01', isActive: true },
  { id: 'staff-3', name: 'Sneha Reddy', email: 'sneha@sports.edu', role: 'staff', department: 'Badminton', createdAt: '2024-02-15', isActive: true },
  { id: 'staff-4', name: 'Vikram Singh', email: 'vikram@sports.edu', role: 'staff', department: 'Tennis', createdAt: '2024-03-01', isActive: true },
  { id: 'student-1', name: 'Arjun Mehta', email: 'arjun@student.edu', role: 'student', phone: '+91 9876543210', createdAt: '2024-03-15', isActive: true },
  { id: 'student-2', name: 'Kavya Nair', email: 'kavya@student.edu', role: 'student', phone: '+91 9876543211', createdAt: '2024-03-20', isActive: true },
  { id: 'student-3', name: 'Rohan Gupta', email: 'rohan@student.edu', role: 'student', phone: '+91 9876543212', createdAt: '2024-04-01', isActive: true },
  { id: 'student-4', name: 'Meera Joshi', email: 'meera@student.edu', role: 'student', phone: '+91 9876543213', createdAt: '2024-04-05', isActive: false },
];

export const mockEquipment: Equipment[] = [
  { id: 'eq-1', name: 'Cricket Bat', category: 'Cricket', totalQuantity: 20, available: 12, inUse: 6, damaged: 2, assignedStaffId: 'staff-1', description: 'Professional grade cricket bats' },
  { id: 'eq-2', name: 'Football', category: 'Football', totalQuantity: 30, available: 22, inUse: 7, damaged: 1, assignedStaffId: 'staff-2', description: 'FIFA standard footballs' },
  { id: 'eq-3', name: 'Volleyball', category: 'Volleyball', totalQuantity: 15, available: 10, inUse: 4, damaged: 1, assignedStaffId: 'staff-2', description: 'Indoor volleyballs' },
  { id: 'eq-4', name: 'Tennis Racket', category: 'Tennis', totalQuantity: 25, available: 18, inUse: 5, damaged: 2, assignedStaffId: 'staff-4', description: 'Lightweight tennis rackets' },
  { id: 'eq-5', name: 'Badminton Kit', category: 'Badminton', totalQuantity: 20, available: 14, inUse: 5, damaged: 1, assignedStaffId: 'staff-3', description: 'Complete badminton set with rackets and shuttlecocks' },
  { id: 'eq-6', name: 'Cricket Pads', category: 'Cricket', totalQuantity: 10, available: 6, inUse: 3, damaged: 1, assignedStaffId: 'staff-1', description: 'Protective cricket pads' },
  { id: 'eq-7', name: 'Basketball', category: 'Basketball', totalQuantity: 18, available: 13, inUse: 4, damaged: 1, assignedStaffId: 'staff-2', description: 'Official size basketballs' },
];

export const mockBookings: Booking[] = [
  { id: 'bk-1', studentId: 'student-1', studentName: 'Arjun Mehta', equipmentId: 'eq-1', equipmentName: 'Cricket Bat', date: '2024-04-10', timeSlot: '09:00 - 10:00', quantity: 2, status: 'approved', createdAt: '2024-04-08' },
  { id: 'bk-2', studentId: 'student-2', studentName: 'Kavya Nair', equipmentId: 'eq-5', equipmentName: 'Badminton Kit', date: '2024-04-10', timeSlot: '10:00 - 11:00', quantity: 1, status: 'pending', createdAt: '2024-04-09' },
  { id: 'bk-3', studentId: 'student-3', studentName: 'Rohan Gupta', equipmentId: 'eq-2', equipmentName: 'Football', date: '2024-04-11', timeSlot: '14:00 - 15:00', quantity: 3, status: 'pending', createdAt: '2024-04-09' },
  { id: 'bk-4', studentId: 'student-1', studentName: 'Arjun Mehta', equipmentId: 'eq-4', equipmentName: 'Tennis Racket', date: '2024-04-09', timeSlot: '16:00 - 17:00', quantity: 1, status: 'returned', createdAt: '2024-04-07' },
  { id: 'bk-5', studentId: 'student-4', studentName: 'Meera Joshi', equipmentId: 'eq-3', equipmentName: 'Volleyball', date: '2024-04-12', timeSlot: '11:00 - 12:00', quantity: 2, status: 'rejected', createdAt: '2024-04-10' },
];

export const mockWarnings: Warning[] = [
  { id: 'w-1', studentId: 'student-3', studentName: 'Rohan Gupta', reason: 'Late return of Football', level: 1, issuedBy: 'Amit Patel', issuedAt: '2024-04-05' },
  { id: 'w-2', studentId: 'student-4', studentName: 'Meera Joshi', reason: 'Damaged equipment - Volleyball', level: 2, issuedBy: 'Amit Patel', issuedAt: '2024-04-06' },
  { id: 'w-3', studentId: 'student-4', studentName: 'Meera Joshi', reason: 'Repeated late returns', level: 3, issuedBy: 'Priya Sharma', issuedAt: '2024-04-08' },
];

export const mockActivityLogs: ActivityLog[] = [
  { id: 'log-1', userId: 'student-1', userName: 'Arjun Mehta', action: 'Booking Created', details: 'Booked 2x Cricket Bat for Apr 10', timestamp: '2024-04-08T10:30:00' },
  { id: 'log-2', userId: 'staff-1', userName: 'Priya Sharma', action: 'Booking Approved', details: 'Approved booking BK-1', timestamp: '2024-04-08T11:00:00' },
  { id: 'log-3', userId: 'student-3', userName: 'Rohan Gupta', action: 'Warning Issued', details: 'Level 1 warning for late return', timestamp: '2024-04-05T14:00:00' },
  { id: 'log-4', userId: 'admin-1', userName: 'Dr. Rajesh Kumar', action: 'Equipment Added', details: 'Added 5 new Basketballs', timestamp: '2024-04-07T09:00:00' },
  { id: 'log-5', userId: 'staff-2', userName: 'Amit Patel', action: 'Equipment Updated', details: 'Marked 1 Football as damaged', timestamp: '2024-04-06T16:00:00' },
];

export const timeSlots = [
  '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
  '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
  '16:00 - 17:00', '17:00 - 18:00',
];
