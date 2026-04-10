import { User, Equipment, Booking, Warning } from '@/types';

// API placeholder functions — ready for backend integration
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function login(email: string, password?: string, otp?: string): Promise<User | null> {
  await delay(800);
  // Mock: detect role from email
  const { mockUsers } = await import('@/data/mockData');
  const user = mockUsers.find(u => u.email === email);
  if (!user) return null;
  if (user.role === 'student' && otp && otp !== '123456') return null;
  return user;
}

export async function sendOtp(email: string): Promise<boolean> {
  await delay(600);
  return true; // Mock: always succeeds
}

export async function getUsers(role?: string): Promise<User[]> {
  await delay(400);
  const { mockUsers } = await import('@/data/mockData');
  return role ? mockUsers.filter(u => u.role === role) : mockUsers;
}

export async function createUser(user: Partial<User>): Promise<User> {
  await delay(500);
  return { id: `user-${Date.now()}`, createdAt: new Date().toISOString(), isActive: true, ...user } as User;
}

export async function getEquipment(): Promise<Equipment[]> {
  await delay(400);
  const { mockEquipment } = await import('@/data/mockData');
  return mockEquipment;
}

export async function createBooking(booking: Partial<Booking>): Promise<Booking> {
  await delay(500);
  return { id: `bk-${Date.now()}`, status: 'pending', createdAt: new Date().toISOString(), ...booking } as Booking;
}

export async function getBookings(userId?: string): Promise<Booking[]> {
  await delay(400);
  const { mockBookings } = await import('@/data/mockData');
  return userId ? mockBookings.filter(b => b.studentId === userId) : mockBookings;
}

export async function getWarnings(studentId?: string): Promise<Warning[]> {
  await delay(400);
  const { mockWarnings } = await import('@/data/mockData');
  return studentId ? mockWarnings.filter(w => w.studentId === studentId) : mockWarnings;
}

export async function getActivityLogs(userId?: string) {
  await delay(400);
  const { mockActivityLogs } = await import('@/data/mockData');
  return userId ? mockActivityLogs.filter(l => l.userId === userId) : mockActivityLogs;
}
