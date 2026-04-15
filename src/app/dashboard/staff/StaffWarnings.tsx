import StaffWarningsComponent from '@/components/dashboard/staff/StaffWarnings';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import DashboardLayout from '@/app/dashboard/layout';

export default function StaffWarnings() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'staff']}>
      <DashboardLayout>
        <StaffWarningsComponent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
