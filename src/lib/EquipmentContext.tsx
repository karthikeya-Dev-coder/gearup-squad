import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Equipment } from '@/types';

const initialEquipment: Equipment[] = [
  { id: 'eq-1', name: 'Cricket Bat', category: 'Cricket', totalQuantity: 30, available: 18, inUse: 10, damaged: 2, assignedStaffId: 'staff-1', description: 'Professional grade willow cricket bats' },
  { id: 'eq-2', name: 'Football', category: 'Football', totalQuantity: 40, available: 25, inUse: 12, damaged: 3, assignedStaffId: 'staff-2', description: 'FIFA Quality Pro match footballs' },
  { id: 'eq-3', name: 'Volleyball', category: 'Volleyball', totalQuantity: 20, available: 12, inUse: 6, damaged: 2, assignedStaffId: 'staff-2', description: 'Official indoor volleyballs' },
  { id: 'eq-4', name: 'Tennis Racket', category: 'Tennis', totalQuantity: 25, available: 18, inUse: 5, damaged: 2, assignedStaffId: 'staff-4', description: 'Graphite composite professional rackets' },
  { id: 'eq-5', name: 'Badminton Kit', category: 'Badminton', totalQuantity: 35, available: 22, inUse: 10, damaged: 3, assignedStaffId: 'staff-3', description: 'Professional rackets with shuttlecock sets' },
  { id: 'eq-6', name: 'Cricket Pads', category: 'Cricket', totalQuantity: 15, available: 10, inUse: 4, damaged: 1, assignedStaffId: 'staff-1', description: 'Lightweight protective leg guards' },
  { id: 'eq-7', name: 'Basketball', category: 'Basketball', totalQuantity: 25, available: 15, inUse: 8, damaged: 2, assignedStaffId: 'staff-2', description: 'Official size 7 composite basketballs' },
  { id: 'eq-8', name: 'Yoga Mat', category: 'Fitness', totalQuantity: 50, available: 45, inUse: 5, damaged: 0, assignedStaffId: 'staff-5', description: 'High-density eco-friendly yoga mats' },
  { id: 'eq-9', name: 'Table Tennis Racket', category: 'Indoor', totalQuantity: 20, available: 16, inUse: 4, damaged: 0, assignedStaffId: 'staff-5', description: 'Competition grade TT paddles' },
  { id: 'eq-10', name: 'Swimming Goggles', category: 'Aquatics', totalQuantity: 15, available: 12, inUse: 3, damaged: 0, assignedStaffId: 'staff-5', description: 'Anti-fog UV protection goggles' },
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
