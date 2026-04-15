import StudentWarningsComponent from '@/components/dashboard/student/StudentWarnings';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import DashboardLayout from '@/app/dashboard/layout';

export default function StudentWarnings() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'student']}>
      <DashboardLayout>
        <StudentWarningsComponent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
