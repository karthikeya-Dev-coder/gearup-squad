import StudentDashboardComponent from '@/components/dashboard/student/StudentDashboard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import DashboardLayout from '@/app/dashboard/layout';

export default function StudentDashboard() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'student']}>
      <DashboardLayout>
        <StudentDashboardComponent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
