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
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  totalQuantity: number;
  available: number;
  inUse: number;
  damaged: number;
  assignedStaffId?: string;
  image?: string;
  description?: string;
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
  issuedAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}
