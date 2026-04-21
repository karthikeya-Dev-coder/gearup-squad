import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Booking, Warning, ActivityLog } from '@/types';
import api from './api';
import { useAuth } from './AuthContext';

interface BookingContextType {
  bookings: Booking[];
  warnings: Warning[];
  activityLogs: ActivityLog[];
  isLoading: boolean;
  error: string | null;
  addBooking: (booking: Partial<Booking>) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  issueWarning: (warning: Partial<Warning>) => Promise<void>;
  payPenalty: (id: string) => Promise<void>;
  clearWarnings: (studentId: string) => Promise<void>;
  getWarningCount: (studentId: string) => number;
  isStudentSuspended: (studentId: string) => boolean;
  getMonthlyUnpaidCount: (studentId: string) => number;
  refreshData: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    try {
      // Fetch bookings and warnings based on role
      const bookingsEndpoint = user.role === 'student' ? '/bookings/my' : '/bookings';
      const warningsEndpoint = user.role === 'student' ? '/warnings/my' : '/warnings';
      
      const [bookingsRes, warningsRes] = await Promise.all([
        api.get(bookingsEndpoint).catch(() => ({ data: [] })),
        api.get(warningsEndpoint).catch(() => ({ data: [] })),
      ]);

      setBookings(bookingsRes.data);
      setWarnings(warningsRes.data);

      // Fetch dashboard activities only if admin/staff
      if (user.role === 'admin' || user.role === 'staff') {
        const activitiesRes = await api.get('/dashboard/logs').catch(() => ({ data: [] }));
        setActivityLogs(activitiesRes.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch booking data:', err);
      setError(err.message || 'Failed to load data. Please check server connection.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addBooking = async (booking: Partial<Booking>) => {
    try {
      await api.post('/bookings', booking);
      await fetchData(); // Refresh to get the created booking with ID
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create booking');
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      await fetchData();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      // Assuming backend has a delete endpoint or we cancel it depending on status.
      // E.g., if there's a delete or cancel endpoint. For exact matches we'll use a specific endpoint if exists, else generic generic delete
      await api.delete(`/bookings/${id}`);
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete booking');
    }
  };

  const issueWarning = async (warning: Partial<Warning>) => {
    try {
      await api.post('/warnings', warning);
      await fetchData();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to issue warning');
    }
  };

  const payPenalty = async (id: string) => {
    try {
      await api.patch(`/warnings/${id}/pay`);
      await fetchData();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to pay penalty');
    }
  };

  const clearWarnings = async (studentId: string) => {
    try {
      await api.delete(`/warnings/student/${studentId}`);
      await fetchData();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to clear warnings');
    }
  };

  const getWarningCount = (studentId: string) => warnings.filter(w => w.studentId === studentId).length;
  
  const isStudentSuspended = (studentId: string) => {
    const studentWarnings = warnings.filter(w => w.studentId === studentId);
    if (studentWarnings.length === 0) return false;

    const hasReasonToSuspend = studentWarnings.length >= 3 || studentWarnings.some(w => w.level === 3);
    if (!hasReasonToSuspend) return false;

    // Standard 3-week suspension check (consistent with backend)
    const latestWarning = studentWarnings.reduce((latest, current) => 
      new Date(current.issuedAt).getTime() > new Date(latest.issuedAt).getTime() ? current : latest
    , studentWarnings[0]);

    const suspensionDurationDays = 21;
    const suspensionEndDate = new Date(latestWarning.issuedAt);
    suspensionEndDate.setDate(suspensionEndDate.getDate() + suspensionDurationDays);

    return new Date() < suspensionEndDate;
  };

  const getMonthlyUnpaidCount = (studentId: string) => 
    warnings.filter(w => w.studentId === studentId && !w.isPaid).length;

  return (
    <BookingContext.Provider value={{ 
      bookings, warnings, activityLogs, isLoading, error, addBooking, updateBookingStatus, 
      deleteBooking, issueWarning, payPenalty, clearWarnings,
      getWarningCount, isStudentSuspended, getMonthlyUnpaidCount,
      refreshData: fetchData
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
