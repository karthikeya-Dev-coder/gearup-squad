import StaffEquipmentComponent from '@/components/dashboard/staff/StaffEquipment';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import DashboardLayout from '@/app/dashboard/layout';

export default function StaffEquipment() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'staff']}>
      <DashboardLayout>
        <StaffEquipmentComponent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
