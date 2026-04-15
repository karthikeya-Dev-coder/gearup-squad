import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

export const initialUsers: User[] = [
  { id: 'admin-1', name: 'Dr. Rajesh Kumar', email: 'admin@sports.edu', role: 'admin', department: 'Sports Administration', createdAt: '2024-01-01', isActive: true },
  
  // Staff
  { id: 'staff-1', name: 'Priya Sharma', email: 'priya@sports.edu', role: 'staff', department: 'Cricket', createdAt: '2024-01-15', isActive: true },
  { id: 'staff-2', name: 'Amit Patel', email: 'amit@sports.edu', role: 'staff', department: 'Football', createdAt: '2024-02-01', isActive: true },
  { id: 'staff-3', name: 'Sneha Reddy', email: 'sneha@sports.edu', role: 'staff', department: 'Badminton', createdAt: '2024-02-15', isActive: true },
  { id: 'staff-4', name: 'Vikram Singh', email: 'vikram@sports.edu', role: 'staff', department: 'Tennis', createdAt: '2024-03-01', isActive: true },
  { id: 'staff-5', name: 'Sunil Gavaskar', email: 'sunil@sports.edu', role: 'staff', department: 'General Sports', createdAt: '2024-03-10', isActive: true },
  
  // Students
  { id: 'student-1', name: 'Arjun Mehta', email: 'arjun@student.edu', role: 'student', phone: '+91 9876543210', createdAt: '2024-03-15', isActive: true },
  { id: 'student-2', name: 'Kavya Nair', email: 'kavya@student.edu', role: 'student', phone: '+91 9876543211', createdAt: '2024-03-20', isActive: true },
  { id: 'student-3', name: 'Rohan Gupta', email: 'rohan@student.edu', role: 'student', phone: '+91 9876543212', createdAt: '2024-04-01', isActive: true },
  { id: 'student-4', name: 'Meera Joshi', email: 'meera@student.edu', role: 'student', phone: '+91 9876543213', createdAt: '2024-04-05', isActive: false },
  { id: 'student-5', name: 'Rahul Dravid', email: 'rahul@student.edu', role: 'student', phone: '+91 9876543214', createdAt: '2024-04-08', isActive: true },
  { id: 'student-6', name: 'Ananya Pandey', email: 'ananya@student.edu', role: 'student', phone: '+91 9876543215', createdAt: '2024-04-10', isActive: true },
  { id: 'student-7', name: 'Siddharth Malhotra', email: 'siddharth@student.edu', role: 'student', phone: '+91 9876543216', createdAt: '2024-04-11', isActive: true },
  { id: 'student-8', name: 'Isha Singh', email: 'isha@student.edu', role: 'student', phone: '+91 9876543217', createdAt: '2024-04-12', isActive: true },
  { id: 'student-9', name: 'Varun Dhawan', email: 'varun@student.edu', role: 'student', phone: '+91 9876543218', createdAt: '2024-04-13', isActive: true },
  { id: 'student-10', name: 'Sara Ali Khan', email: 'sara@student.edu', role: 'student', phone: '+91 9876543219', createdAt: '2024-04-14', isActive: true },
  { id: 'student-11', name: 'Karthik Aryan', email: 'karthik@student.edu', role: 'student', phone: '+91 7654321098', createdAt: '2024-04-15', isActive: true },
];

interface UserContextType {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const addUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  const updateUser = (updated: User) => {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
}
