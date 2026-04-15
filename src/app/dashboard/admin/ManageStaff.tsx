import ManageStaffComponent from '@/components/dashboard/admin/ManageStaff/ManageStaff';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import DashboardLayout from '@/app/dashboard/layout';

export default function ManageStaff() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <ManageStaffComponent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
