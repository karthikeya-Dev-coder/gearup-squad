import StudentEquipmentComponent from '@/components/dashboard/student/StudentEquipment';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import DashboardLayout from '@/app/dashboard/layout';

export default function StudentEquipment() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'student']}>
      <DashboardLayout>
        <StudentEquipmentComponent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
