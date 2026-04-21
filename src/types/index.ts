export type UserRole = 'admin' | 'staff' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  department?: string;
  createdAt: string;
  isActive: boolean;
  sendEmail?: boolean;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  totalQuantity: number;
  available: number;
  inUse: number;
  assignedStaffId?: string;
  assignedStaffName?: string;
}

export interface Booking {
  id: string;
  studentId: string;
  studentName: string;
  equipmentId: string;
  equipmentName: string;
  date: string;
  timeSlot: string;
  quantity: number;
  status: 'pending' | 'approved' | 'rejected' | 'returned' | 'overdue';
  createdAt: string;
}

export interface Warning {
  id: string;
  studentId: string;
  studentName: string;
  reason: string;
  level: 1 | 2 | 3;
  issuedBy: string;
  issuedByName?: string;
  issuedAt: string;
  amount?: number;
  isPaid?: boolean;
  paidAt?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface StaffEquipmentRequest {
  id: string;
  staffId: string;
  staffName: string;
  equipmentName: string;
  quantity: number;
  createdAt: string;
  status: 'pending' | 'fulfilled' | 'dismissed';
}
