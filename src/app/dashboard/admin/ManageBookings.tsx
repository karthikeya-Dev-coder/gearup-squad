import ManageBookingsComponent from '@/components/dashboard/admin/ManageBookings';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import DashboardLayout from '@/app/dashboard/layout';

export default function ManageBookings() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <ManageBookingsComponent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
