import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/components/login/login';
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import { UserProvider } from "@/lib/UserContext";
import { EquipmentProvider } from "@/lib/EquipmentContext";
import { BookingProvider } from "@/lib/BookingContext";
import { PageLoader } from "@/components/ui/PageLoader";
import { ProtectedRoute, RoleRedirect } from "@/components/ProtectedRoute";
import { DashboardLayout } from '@/components/dashboard/layout';

// Admin Imports
import AdminDashboard from '@/app/dashboard/admin/AdminDashboard';
import ManageStaff from '@/components/dashboard/admin/ManageStaff/ManageStaff';
import ManageStudents from '@/components/dashboard/admin/ManageStudents/ManageStudents';
import ManageEquipment from '@/components/dashboard/admin/ManageEquipment/ManageEquipment';
import ManageBookings from '@/components/dashboard/admin/ManageBookings';
import ManagePenalties from '@/components/dashboard/admin/ManagePenalties';

// Student Imports
import StudentDashboard from '@/components/dashboard/student/StudentDashboard';
import StudentEquipment from '@/components/dashboard/student/StudentEquipment';
import StudentBookings from '@/components/dashboard/student/StudentBookings';
import StudentPenalty from '@/components/dashboard/student/StudentWarnings';

// Staff Imports
import StaffDashboard from '@/components/dashboard/staff/StaffDashboard';
import StaffEquipment from '@/components/dashboard/staff/StaffEquipment';
import StaffBookings from '@/components/dashboard/staff/StaffBookings';
import StaffWarnings from '@/components/dashboard/staff/StaffWarnings';

import ActivityLogPage from '@/components/dashboard/shared/ActivityLogPage';

const AppContent = () => {
  const { isTransitioning } = useAuth();

  return (
    <>
      {isTransitioning && <PageLoader message="Loading SportSync Dashboard..." />}
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Redirect Root based on Role */}
        <Route path="/" element={<RoleRedirect />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/staff" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><ManageStaff /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><ManageStudents /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/equipment" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><ManageEquipment /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><ManageBookings /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/penalties" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><ManagePenalties /></DashboardLayout></ProtectedRoute>} />

        {/* Student Routes */}
        <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><DashboardLayout><StudentDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/student/inventory" element={<ProtectedRoute allowedRoles={['student']}><DashboardLayout><StudentEquipment /></DashboardLayout></ProtectedRoute>} />
        <Route path="/student/bookings" element={<ProtectedRoute allowedRoles={['student']}><DashboardLayout><StudentBookings /></DashboardLayout></ProtectedRoute>} />
        <Route path="/student/penalties" element={<ProtectedRoute allowedRoles={['student']}><DashboardLayout><StudentPenalty /></DashboardLayout></ProtectedRoute>} />

        {/* Staff Routes */}
        <Route path="/staff" element={<ProtectedRoute allowedRoles={['staff']}><DashboardLayout><StaffDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/staff/inventory" element={<ProtectedRoute allowedRoles={['staff']}><DashboardLayout><StaffEquipment /></DashboardLayout></ProtectedRoute>} />
        <Route path="/staff/bookings" element={<ProtectedRoute allowedRoles={['staff']}><DashboardLayout><StaffBookings /></DashboardLayout></ProtectedRoute>} />
        <Route path="/staff/penalties" element={<ProtectedRoute allowedRoles={['staff']}><DashboardLayout><StaffWarnings /></DashboardLayout></ProtectedRoute>} />
        <Route path="/staff/activity" element={<ProtectedRoute allowedRoles={['staff']}><DashboardLayout><ActivityLogPage /></DashboardLayout></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <EquipmentProvider>
            <BookingProvider>
              <AppContent />
            </BookingProvider>
          </EquipmentProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
