import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Equipment } from '@/types';
import { useAuth } from './AuthContext';
import api from './api';

interface EquipmentContextType {
  equipment: Equipment[];
  staffRequests: any[];
  isLoading: boolean;
  error: string | null;
  addEquipment: (item: Partial<Equipment>) => Promise<void>;
  updateEquipment: (id: string, updated: Partial<Equipment>) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  refreshEquipment: () => Promise<void>;
  addStaffRequest: (req: any) => Promise<void>;
  updateStaffRequestStatus: (id: string, status: string) => Promise<void>;
  refreshStaffRequests: () => Promise<void>;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

export function EquipmentProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [staffRequests, setStaffRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipment = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/equipment');
      setEquipment(response.data);
    } catch (err: any) {
      console.error('Failed to fetch equipment:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStaffRequests = useCallback(async () => {
    if (!user) return;
    
    try {
      // Admin sees everything, staff see their own
      const endpoint = user.role === 'admin' ? '/staff-requests' : '/staff-requests/my';
      
      // Students don't need to fetch staff requests at all
      if (user.role === 'student') return;

      const response = await api.get(endpoint);
      setStaffRequests(response.data);
    } catch (err: any) {
      console.error('Failed to fetch staff requests:', err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchEquipment();
      fetchStaffRequests();
    } else {
      setEquipment([]);
      setStaffRequests([]);
    }
  }, [user, fetchEquipment, fetchStaffRequests]);

  const addEquipment = async (item: Partial<Equipment>) => {
    try {
      const response = await api.post('/equipment', item);
      setEquipment(prev => [...prev, response.data]);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to add equipment');
    }
  };

  const updateEquipment = async (id: string, updated: Partial<Equipment>) => {
    try {
      const response = await api.patch(`/equipment/${id}`, updated);
      setEquipment(prev => prev.map(e => e.id === id ? response.data : e));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update equipment');
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      await api.delete(`/equipment/${id}`);
      setEquipment(prev => prev.filter(e => e.id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete equipment');
    }
  };

  const addStaffRequest = async (staffReq: any) => {
    try {
      const response = await api.post('/staff-requests', staffReq);
      setStaffRequests(prev => [...prev, response.data]);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to submit request');
    }
  };

  const updateStaffRequestStatus = async (id: string, status: string) => {
    try {
      const response = await api.patch(`/staff-requests/${id}/status`, { status });
      setStaffRequests(prev => prev.map(r => r.id === id ? response.data : r));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update request status');
    }
  };

  return (
    <EquipmentContext.Provider value={{ 
      equipment, 
      staffRequests,
      isLoading, 
      error, 
      addEquipment, 
      updateEquipment, 
      deleteEquipment,
      refreshEquipment: fetchEquipment,
      addStaffRequest,
      updateStaffRequestStatus,
      refreshStaffRequests: fetchStaffRequests
    }}>
      {children}
    </EquipmentContext.Provider>
  );
}

export function useEquipment() {
  const context = useContext(EquipmentContext);
  if (context === undefined) {
    throw new Error('useEquipment must be used within an EquipmentProvider');
  }
  return context;
}
