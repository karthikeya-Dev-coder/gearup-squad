import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Booking, Warning, ActivityLog } from '@/types';

interface BookingContextType {
  bookings: Booking[];
  warnings: Warning[];
  activityLogs: ActivityLog[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  deleteBooking: (id: string) => void;
  issueWarning: (warning: Warning) => void;
  payPenalty: (id: string) => void;
  clearWarnings: (studentId: string) => void;
  getWarningCount: (studentId: string) => number;
  isStudentSuspended: (studentId: string) => boolean;
  getMonthlyUnpaidCount: (studentId: string) => number;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Rich mock data for realistic role-based dashboard flow.
const initialBookings: Booking[] = [
  { id: 'bk-1', studentId: 'student-1', studentName: 'Arjun Mehta', equipmentId: 'eq-1', equipmentName: 'Cricket Bat', date: '2026-04-15', timeSlot: '09:00 - 10:00', quantity: 2, status: 'approved', createdAt: '2026-04-14T08:20:00.000Z' },
  { id: 'bk-2', studentId: 'student-2', studentName: 'Kavya Nair', equipmentId: 'eq-5', equipmentName: 'Badminton Kit', date: '2026-04-16', timeSlot: '10:00 - 11:00', quantity: 1, status: 'approved', createdAt: '2026-04-15T06:10:00.000Z' },
  { id: 'bk-3', studentId: 'student-3', studentName: 'Rohan Gupta', equipmentId: 'eq-2', equipmentName: 'Football', date: '2026-04-15', timeSlot: '14:00 - 15:00', quantity: 3, status: 'approved', createdAt: '2026-04-15T07:05:00.000Z' },
  { id: 'bk-4', studentId: 'student-5', studentName: 'Rahul Dravid', equipmentId: 'eq-6', equipmentName: 'Cricket Pads', date: '2026-04-14', timeSlot: '16:00 - 17:00', quantity: 1, status: 'returned', createdAt: '2026-04-13T10:40:00.000Z' },
  { id: 'bk-5', studentId: 'student-6', studentName: 'Ananya Pandey', equipmentId: 'eq-4', equipmentName: 'Tennis Racket', date: '2026-04-15', timeSlot: '08:00 - 09:00', quantity: 1, status: 'overdue', createdAt: '2026-04-14T12:30:00.000Z' },
  { id: 'bk-6', studentId: 'student-7', studentName: 'Siddharth Malhotra', equipmentId: 'eq-7', equipmentName: 'Basketball', date: '2026-04-16', timeSlot: '11:00 - 12:00', quantity: 2, status: 'approved', createdAt: '2026-04-15T09:00:00.000Z' },
  { id: 'bk-7', studentId: 'student-8', studentName: 'Isha Singh', equipmentId: 'eq-9', equipmentName: 'Table Tennis Racket', date: '2026-04-15', timeSlot: '17:00 - 18:00', quantity: 1, status: 'approved', createdAt: '2026-04-15T11:20:00.000Z' },
  { id: 'bk-8', studentId: 'student-9', studentName: 'Varun Dhawan', equipmentId: 'eq-3', equipmentName: 'Volleyball', date: '2026-04-15', timeSlot: '12:00 - 13:00', quantity: 2, status: 'rejected', createdAt: '2026-04-14T14:50:00.000Z' },
  { id: 'bk-9', studentId: 'student-10', studentName: 'Sara Ali Khan', equipmentId: 'eq-10', equipmentName: 'Swimming Goggles', date: '2026-04-15', timeSlot: '07:00 - 08:00', quantity: 1, status: 'returned', createdAt: '2026-04-13T05:45:00.000Z' },
  { id: 'bk-10', studentId: 'student-11', studentName: 'Karthik Aryan', equipmentId: 'eq-8', equipmentName: 'Yoga Mat', date: '2026-04-15', timeSlot: '15:00 - 16:00', quantity: 4, status: 'overdue', createdAt: '2026-04-14T16:10:00.000Z' },
  { id: 'bk-11', studentId: 'student-4', studentName: 'Meera Joshi', equipmentId: 'eq-2', equipmentName: 'Football', date: '2026-04-16', timeSlot: '08:00 - 09:00', quantity: 1, status: 'approved', createdAt: '2026-04-15T12:35:00.000Z' },
  { id: 'bk-12', studentId: 'student-1', studentName: 'Arjun Mehta', equipmentId: 'eq-6', equipmentName: 'Cricket Pads', date: '2026-04-16', timeSlot: '13:00 - 14:00', quantity: 1, status: 'approved', createdAt: '2026-04-15T13:45:00.000Z' },
];

const initialWarnings: Warning[] = [
  { id: 'w-1', studentId: 'student-3', studentName: 'Rohan Gupta', reason: 'Late return of Football (30 mins)', level: 1, issuedBy: 'Amit Patel', issuedAt: '2026-04-05', amount: 50, isPaid: false },
  { id: 'w-2', studentId: 'student-4', studentName: 'Meera Joshi', reason: 'Damaged volleyball', level: 2, issuedBy: 'Amit Patel', issuedAt: '2026-04-06', amount: 300, isPaid: true, paidAt: '2026-04-07' },
  { id: 'w-3', studentId: 'student-11', studentName: 'Karthik Aryan', reason: 'Non-return of equipment', level: 3, issuedBy: 'Priya Sharma', issuedAt: '2026-04-10', amount: 750, isPaid: false },
  { id: 'w-4', studentId: 'student-6', studentName: 'Ananya Pandey', reason: 'Racket returned with torn grip', level: 1, issuedBy: 'Vikram Singh', issuedAt: '2026-04-12', amount: 120, isPaid: false },
  { id: 'w-5', studentId: 'student-1', studentName: 'Arjun Mehta', reason: 'Delayed return by 1 hour', level: 1, issuedBy: 'Priya Sharma', issuedAt: '2026-04-14', amount: 50, isPaid: true, paidAt: '2026-04-15' },
  { id: 'w-6', studentId: 'student-11', studentName: 'Karthik Aryan', reason: 'Second non-compliance this month', level: 2, issuedBy: 'Dr. Rajesh Kumar', issuedAt: '2026-04-13', amount: 450, isPaid: false },
];

const initialActivityLogs: ActivityLog[] = [
  { id: 'log-1', userId: 'student-2', userName: 'Kavya Nair', action: 'Booking Created', details: 'Booked Badminton Kit for Apr 16 (10:00 - 11:00)', timestamp: '2026-04-15T06:10:00.000Z' },
  { id: 'log-2', userId: 'staff-1', userName: 'Priya Sharma', action: 'Booking Approved', details: 'Approved booking bk-1 for Arjun Mehta', timestamp: '2026-04-15T06:30:00.000Z' },
  { id: 'log-3', userId: 'staff-2', userName: 'Amit Patel', action: 'Booking Rejected', details: 'Rejected booking bk-8 due to low stock', timestamp: '2026-04-15T07:10:00.000Z' },
  { id: 'log-4', userId: 'student-11', userName: 'Karthik Aryan', action: 'Return Delayed', details: 'Return pending beyond slot for Yoga Mat', timestamp: '2026-04-15T07:40:00.000Z' },
  { id: 'log-5', userId: 'staff-4', userName: 'Vikram Singh', action: 'Warning Issued', details: 'Issued penalty to Ananya Pandey for damaged racket grip', timestamp: '2026-04-15T08:20:00.000Z' },
  { id: 'log-6', userId: 'admin-1', userName: 'Dr. Rajesh Kumar', action: 'Penalty Reviewed', details: 'Escalated Karthik Aryan to level 3 suspension', timestamp: '2026-04-15T08:45:00.000Z' },
  { id: 'log-7', userId: 'student-1', userName: 'Arjun Mehta', action: 'Penalty Paid', details: 'Paid delayed-return fine of ₹50', timestamp: '2026-04-15T09:05:00.000Z' },
  { id: 'log-8', userId: 'staff-3', userName: 'Sneha Reddy', action: 'Booking Approved', details: 'Approved booking bk-6 for Basketball', timestamp: '2026-04-15T09:40:00.000Z' },
  { id: 'log-9', userId: 'student-10', userName: 'Sara Ali Khan', action: 'Booking Returned', details: 'Returned Swimming Goggles on time', timestamp: '2026-04-15T10:15:00.000Z' },
  { id: 'log-10', userId: 'staff-1', userName: 'Priya Sharma', action: 'Return Processed', details: 'Closed returned booking bk-4', timestamp: '2026-04-15T10:50:00.000Z' },
  { id: 'log-11', userId: 'student-8', userName: 'Isha Singh', action: 'Booking Created', details: 'Requested Table Tennis Racket for evening slot', timestamp: '2026-04-15T11:20:00.000Z' },
  { id: 'log-12', userId: 'admin-1', userName: 'Dr. Rajesh Kumar', action: 'Audit Completed', details: 'Reviewed active bookings, penalties, and overdue returns', timestamp: '2026-04-15T12:00:00.000Z' },
];

const getBookingEndTime = (booking: Booking): number | null => {
  const endSlot = booking.timeSlot.split('-')[1]?.trim();
  if (!endSlot) return null;

  const endDate = new Date(`${booking.date}T${endSlot}:00`);
  const endTime = endDate.getTime();
  return Number.isNaN(endTime) ? null : endTime;
};

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    // Auto-approve any initial pending bookings (although constants are already approved, keeping logic just in case)
    return initialBookings.map(b => b.status === 'pending' ? { ...b, status: 'approved' as const } : b);
  });

  const [warnings, setWarnings] = useState<Warning[]>(initialWarnings);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);

  useEffect(() => {
    const markOverdueBookings = () => {
      const now = Date.now();
      setBookings(prev =>
        prev.map(booking => {
          if (booking.status !== 'approved') return booking;
          const endTime = getBookingEndTime(booking);
          if (endTime === null || endTime > now) return booking;
          return { ...booking, status: 'overdue' };
        })
      );
    };

    // Run once immediately and then keep the time limit moving.
    markOverdueBookings();
    const intervalId = window.setInterval(markOverdueBookings, 30000);
    return () => window.clearInterval(intervalId);
  }, []);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
    addLog(booking.studentId, booking.studentName, 'Booking Created', `Booked ${booking.quantity}x ${booking.equipmentName}`);
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      addLog('system', 'System', `Status Updated`, `Booking ${id} set to ${status}`);
    }
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const issueWarning = (warning: Warning) => {
    setWarnings(prev => [warning, ...prev]);
    addLog(warning.studentId, warning.studentName, 'Warning Issued', `Warning level ${warning.level}: ${warning.reason}`);
  };

  const payPenalty = (id: string) => {
    setWarnings(prev =>
      prev.map(w =>
        w.id === id ? { ...w, isPaid: true, paidAt: new Date().toISOString() } : w
      )
    );
    const warning = warnings.find(w => w.id === id);
    if (warning) {
      addLog(warning.studentId, warning.studentName, 'Penalty Paid', `Penalty for ${warning.reason} has been cleared.`);
    }
  };

  const clearWarnings = (studentId: string) => {
    setWarnings(prev => prev.filter(w => w.studentId !== studentId));
    addLog(studentId, 'Student', 'Warnings Cleared', 'All disciplinary records cleared by admin');
  };

  const getWarningCount = (studentId: string) => warnings.filter(w => w.studentId === studentId).length;
  
  const isStudentSuspended = (studentId: string) => {
    const studentWarnings = warnings.filter(w => w.studentId === studentId);
    return studentWarnings.length >= 3 || studentWarnings.some(w => w.level === 3);
  };

  const getMonthlyUnpaidCount = (studentId: string) => 
    warnings.filter(w => w.studentId === studentId && !w.isPaid).length;

  const addLog = (userId: string, userName: string, action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      userId,
      userName,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setActivityLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep last 100 logs
  };

  return (
    <BookingContext.Provider value={{ 
      bookings, warnings, activityLogs, addBooking, updateBookingStatus, 
      deleteBooking, issueWarning, payPenalty, clearWarnings,
      getWarningCount, isStudentSuspended, getMonthlyUnpaidCount
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useData() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useData must be used within a BookingProvider');
  }
  return context;
}
