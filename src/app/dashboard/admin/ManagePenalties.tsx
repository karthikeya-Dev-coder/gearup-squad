import ManagePenaltiesComponent from '@/components/dashboard/admin/ManagePenalties';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import DashboardLayout from '@/app/dashboard/layout';

export default function ManagePenalties() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <ManagePenaltiesComponent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
