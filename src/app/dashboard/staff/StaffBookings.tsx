import StaffBookingsComponent from '@/components/dashboard/staff/StaffBookings';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import DashboardLayout from '@/app/dashboard/layout';

export default function StaffBookings() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'staff']}>
      <DashboardLayout>
        <StaffBookingsComponent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
