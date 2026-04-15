import StudentBookingsComponent from '@/components/dashboard/student/StudentBookings';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import DashboardLayout from '@/app/dashboard/layout';

export default function StudentBookings() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'student']}>
      <DashboardLayout>
        <StudentBookingsComponent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
