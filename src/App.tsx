import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/layouts/DashboardLayout";

import LoginPage from "@/pages/auth/LoginPage";
import NotAuthorizedPage from "@/pages/NotAuthorized";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageStaff from "@/pages/admin/ManageStaff";
import ManageStudents from "@/pages/admin/ManageStudents";
import ManageEquipment from "@/pages/admin/ManageEquipment";
import ManageBookings from "@/pages/admin/ManageBookings";
import ManagePenalties from "@/pages/admin/ManagePenalties";

import StaffDashboard from "@/pages/staff/StaffDashboard";
import StaffEquipment from "@/pages/staff/StaffEquipment";
import StaffBookings from "@/pages/staff/StaffBookings";
import StaffWarnings from "@/pages/staff/StaffWarnings";

import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentEquipment from "@/pages/student/StudentEquipment";
import StudentBookings from "@/pages/student/StudentBookings";
import StudentWarnings from "@/pages/student/StudentWarnings";

import ActivityLogPage from "@/pages/shared/ActivityLogPage";
import SettingsPage from "@/pages/shared/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/not-authorized" element={<NotAuthorizedPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/staff" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><ManageStaff /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><ManageStudents /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/equipment" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><ManageEquipment /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><ManageBookings /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/penalties" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><ManagePenalties /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><SettingsPage /></DashboardLayout></ProtectedRoute>} />

            {/* Staff Routes */}
            <Route path="/staff" element={<ProtectedRoute allowedRoles={['staff']}><DashboardLayout><StaffDashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/staff/equipment" element={<ProtectedRoute allowedRoles={['staff']}><DashboardLayout><StaffEquipment /></DashboardLayout></ProtectedRoute>} />
            <Route path="/staff/bookings" element={<ProtectedRoute allowedRoles={['staff']}><DashboardLayout><StaffBookings /></DashboardLayout></ProtectedRoute>} />
            <Route path="/staff/warnings" element={<ProtectedRoute allowedRoles={['staff']}><DashboardLayout><StaffWarnings /></DashboardLayout></ProtectedRoute>} />
            <Route path="/staff/activity" element={<ProtectedRoute allowedRoles={['staff']}><DashboardLayout><ActivityLogPage /></DashboardLayout></ProtectedRoute>} />
            <Route path="/staff/settings" element={<ProtectedRoute allowedRoles={['staff']}><DashboardLayout><SettingsPage /></DashboardLayout></ProtectedRoute>} />

            {/* Student Routes */}
            <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><DashboardLayout><StudentDashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/student/equipment" element={<ProtectedRoute allowedRoles={['student']}><DashboardLayout><StudentEquipment /></DashboardLayout></ProtectedRoute>} />
            <Route path="/student/bookings" element={<ProtectedRoute allowedRoles={['student']}><DashboardLayout><StudentBookings /></DashboardLayout></ProtectedRoute>} />
            <Route path="/student/warnings" element={<ProtectedRoute allowedRoles={['student']}><DashboardLayout><StudentWarnings /></DashboardLayout></ProtectedRoute>} />
            <Route path="/student/activity" element={<ProtectedRoute allowedRoles={['student']}><DashboardLayout><ActivityLogPage /></DashboardLayout></ProtectedRoute>} />
            <Route path="/student/settings" element={<ProtectedRoute allowedRoles={['student']}><DashboardLayout><SettingsPage /></DashboardLayout></ProtectedRoute>} />

            <Route path="*" element={<NotAuthorizedPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
