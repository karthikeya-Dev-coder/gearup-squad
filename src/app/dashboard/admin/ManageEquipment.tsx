import ManageEquipmentComponent from '@/components/dashboard/admin/ManageEquipment/ManageEquipment';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import DashboardLayout from '@/app/dashboard/layout';

export default function ManageEquipment() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <ManageEquipmentComponent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
