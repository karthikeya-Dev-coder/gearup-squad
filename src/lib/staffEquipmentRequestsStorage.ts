import { StaffEquipmentRequest } from '@/types';

const KEY = 'sportsSyncStaffEquipmentRequests';

function notifyChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('staff-equipment-requests-changed'));
  }
}

export function getStaffEquipmentRequests(): StaffEquipmentRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addStaffEquipmentRequest(
  payload: Omit<StaffEquipmentRequest, 'id' | 'createdAt' | 'status'>
): StaffEquipmentRequest {
  const list = getStaffEquipmentRequests();
  const item: StaffEquipmentRequest = {
    ...payload,
    id: `ser-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  localStorage.setItem(KEY, JSON.stringify([item, ...list]));
  notifyChanged();
  return item;
}

export function updateStaffEquipmentRequestStatus(
  id: string,
  status: StaffEquipmentRequest['status']
): void {
  const list = getStaffEquipmentRequests();
  localStorage.setItem(
    KEY,
    JSON.stringify(list.map(r => (r.id === id ? { ...r, status } : r)))
  );
  notifyChanged();
}
