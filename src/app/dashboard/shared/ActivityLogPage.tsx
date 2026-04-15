import ActivityLogPageComponent from '@/components/dashboard/shared/ActivityLogPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import DashboardLayout from '@/app/dashboard/layout';

export default function ActivityLogPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'staff', 'student']}>
      <DashboardLayout>
        <ActivityLogPageComponent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
