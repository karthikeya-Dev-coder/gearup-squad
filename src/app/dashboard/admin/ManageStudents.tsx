import ManageStudentsComponent from '@/components/dashboard/admin/ManageStudents/ManageStudents';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import DashboardLayout from '@/app/dashboard/layout';

export default function ManageStudents() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <ManageStudentsComponent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
