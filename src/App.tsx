import "./app/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/AuthContext";
import { EquipmentProvider } from "@/lib/EquipmentContext";
import { BookingProvider } from "@/lib/BookingContext";


import LoginPage from "@/app/login/page";
import Index from "@/app/page";

import AdminDashboard from "@/app/dashboard/admin/AdminDashboard";
import ManageStaff from "@/app/dashboard/admin/ManageStaff";
import ManageStudents from "@/app/dashboard/admin/ManageStudents";
import ManageEquipment from "@/app/dashboard/admin/ManageEquipment";
import ManageBookings from "@/app/dashboard/admin/ManageBookings";
import ManagePenalties from "@/app/dashboard/admin/ManagePenalties";

import StaffDashboard from "@/app/dashboard/staff/StaffDashboard";
import StaffEquipment from "@/app/dashboard/staff/StaffEquipment";
import StaffBookings from "@/app/dashboard/staff/StaffBookings";
import StaffPenalties from "@/app/dashboard/staff/StaffWarnings";

import StudentDashboard from "@/app/dashboard/student/StudentDashboard";
import StudentEquipment from "@/app/dashboard/student/StudentEquipment";
import StudentBookings from "@/app/dashboard/student/StudentBookings";
import StudentWarnings from "@/app/dashboard/student/StudentWarnings";

import ActivityLogPage from "@/app/dashboard/shared/ActivityLogPage";
import ProfilePage from "@/app/dashboard/shared/ProfilePage";

import { UserProvider } from "@/lib/UserContext";

const queryClient = new QueryClient();

import RootLayout from "@/app/layout";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AuthProvider>
        <UserProvider>
          <EquipmentProvider>
            <BookingProvider>
              <BrowserRouter>
                <RootLayout>
                <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/staff" element={<ManageStaff />} />
                <Route path="/admin/students" element={<ManageStudents />} />
                <Route path="/admin/equipment" element={<ManageEquipment />} />
                <Route path="/admin/bookings" element={<ManageBookings />} />
                <Route path="/admin/penalties" element={<ManagePenalties />} />
                <Route path="/admin/profile" element={<ProfilePage />} />
                <Route path="/admin/settings" element={<Navigate to="/admin/profile" replace />} />

                {/* Staff Routes */}
                <Route path="/staff" element={<StaffDashboard />} />
                <Route path="/staff/equipment" element={<StaffEquipment />} />
                <Route path="/staff/bookings" element={<StaffBookings />} />
                <Route path="/staff/penalties" element={<StaffPenalties />} />
                <Route path="/staff/warnings" element={<Navigate to="/staff" replace />} />
                <Route path="/staff/activity" element={<ActivityLogPage />} />
                <Route path="/staff/profile" element={<ProfilePage />} />
                <Route path="/staff/settings" element={<Navigate to="/staff/profile" replace />} />

                {/* Student Routes */}
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/student/equipment" element={<StudentEquipment />} />
                <Route path="/student/bookings" element={<StudentBookings />} />
                <Route path="/student/penalties" element={<StudentWarnings />} />
                <Route path="/student/warnings" element={<Navigate to="/student/penalties" replace />} />
                <Route path="/student/activity" element={<ActivityLogPage />} />
                <Route path="/student/profile" element={<ProfilePage />} />
                <Route path="/student/settings" element={<Navigate to="/student/profile" replace />} />

                <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </RootLayout>
            </BrowserRouter>
            </BookingProvider>
          </EquipmentProvider>
        </UserProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
