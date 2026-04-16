import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Equipment } from '@/types';

const initialEquipment: Equipment[] = [
  { id: 'eq-1', name: 'Cricket Bat', category: 'Cricket', totalQuantity: 30, available: 18, inUse: 10, assignedStaffId: 'staff-1' },
  { id: 'eq-2', name: 'Football', category: 'Football', totalQuantity: 40, available: 25, inUse: 12, assignedStaffId: 'staff-2' },
  { id: 'eq-3', name: 'Volleyball', category: 'Volleyball', totalQuantity: 20, available: 12, inUse: 6, assignedStaffId: 'staff-2' },
  { id: 'eq-4', name: 'Tennis Racket', category: 'Tennis', totalQuantity: 25, available: 18, inUse: 5, assignedStaffId: 'staff-4' },
  { id: 'eq-5', name: 'Badminton Kit', category: 'Badminton', totalQuantity: 35, available: 22, inUse: 10, assignedStaffId: 'staff-3' },
  { id: 'eq-6', name: 'Cricket Pads', category: 'Cricket', totalQuantity: 15, available: 10, inUse: 4, assignedStaffId: 'staff-1' },
  { id: 'eq-7', name: 'Basketball', category: 'Basketball', totalQuantity: 25, available: 15, inUse: 8, assignedStaffId: 'staff-2' },
  { id: 'eq-8', name: 'Yoga Mat', category: 'Fitness', totalQuantity: 50, available: 45, inUse: 5, assignedStaffId: 'staff-5' },
  { id: 'eq-9', name: 'Table Tennis Racket', category: 'Indoor', totalQuantity: 20, available: 16, inUse: 4, assignedStaffId: 'staff-5' },
  { id: 'eq-10', name: 'Swimming Goggles', category: 'Aquatics', totalQuantity: 15, available: 12, inUse: 3, assignedStaffId: 'staff-5' },
];

interface EquipmentContextType {
  equipment: Equipment[];
  addEquipment: (item: Equipment) => void;
  updateEquipment: (updated: Equipment) => void;
  deleteEquipment: (id: string) => void;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

export function EquipmentProvider({ children }: { children: ReactNode }) {
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);

  const addEquipment = (item: Equipment) => {
    setEquipment(prev => [...prev, item]);
  };

  const updateEquipment = (updated: Equipment) => {
    setEquipment(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  const deleteEquipment = (id: string) => {
    setEquipment(prev => prev.filter(e => e.id !== id));
  };

  return (
    <EquipmentContext.Provider value={{ equipment, addEquipment, updateEquipment, deleteEquipment }}>
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
