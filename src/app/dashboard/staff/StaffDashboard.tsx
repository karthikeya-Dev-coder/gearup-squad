import StaffDashboardComponent from '@/components/dashboard/staff/StaffDashboard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import DashboardLayout from '@/app/dashboard/layout';

export default function StaffDashboard() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'staff']}>
      <DashboardLayout>
        <StaffDashboardComponent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
