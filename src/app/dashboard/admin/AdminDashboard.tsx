import AdminDashboardComponent from '@/components/dashboard/admin/AdminDashboard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import DashboardLayout from '@/app/dashboard/layout';

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <AdminDashboardComponent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
