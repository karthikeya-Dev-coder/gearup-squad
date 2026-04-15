import React from 'react';
import {
  Calendar,
  ArrowUpRight,
  GraduationCap,
  Briefcase,
  Dumbbell,
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { useUsers } from '@/lib/UserContext';
import { useData } from '@/lib/BookingContext';
import { useEquipment } from '@/lib/EquipmentContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';



export default function AdminDashboard() {
  const { users } = useUsers();
  const { bookings, warnings } = useData();
  const { equipment } = useEquipment();

  const staff = users.filter(u => u.role === 'staff');
  const students = users.filter(u => u.role === 'student');
  const userStats = [
    { name: 'Students', value: students.length, fill: '#0ea5e9' },
    { name: 'Staff', value: staff.length, fill: '#10b981' },
  ];

  const categoryData = equipment
    .reduce<{ name: string; count: number; color: string }[]>((acc, item) => {
      const existing = acc.find(entry => entry.name === item.category);
      if (existing) {
        existing.count += item.inUse;
      } else {
        acc.push({
          name: item.category,
          count: item.inUse,
          color:
            item.category === 'Cricket'
              ? '#0284c7'
              : item.category === 'Football'
                ? '#059669'
                : '#ea580c',
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const dayKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const trendMap = dayKeys.reduce<Record<string, number>>((acc, day) => {
    acc[day] = 0;
    return acc;
  }, {});

  bookings.forEach(booking => {
    const day = dayKeys[new Date(booking.createdAt).getDay()];
    trendMap[day] += 1;
  });

  const bookingTrends = dayKeys.map(day => ({ day, bookings: trendMap[day] }));
  const busiestDay = bookingTrends.reduce((prev, curr) => (curr.bookings > prev.bookings ? curr : prev), bookingTrends[0]);
  const firstHalf = bookingTrends.slice(0, 3).reduce((sum, entry) => sum + entry.bookings, 0);
  const secondHalf = bookingTrends.slice(3).reduce((sum, entry) => sum + entry.bookings, 0);
  const weeklyGrowth = firstHalf === 0 ? 0 : Math.round(((secondHalf - firstHalf) / firstHalf) * 100);
  const recentBookings = bookings
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
      <div className="space-y-6 sm:space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader title="Dashboard Overview" description="Welcome back, Dr. Rajesh Kumar. Here's what's happening." />

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Staff" value={staff.length} icon={Briefcase} trend="Total Count" trendUp color="indigo" />
        <StatCard title="Total Students" value={students.length} icon={GraduationCap} trend="+12% Usage" trendUp color="amber" />
        <StatCard title="Inventory" value={equipment.length} icon={Dumbbell} trend="Items" color="emerald" />
        <StatCard title="Total Bookings" value={bookings.length} icon={Calendar} trend="All Time" color="info" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Chart */}
        <div className="xl:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-card overflow-hidden">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">Equipment Utilization</h3>
              <p className="text-sm text-muted-foreground">Category-wise usage statistics</p>
            </div>
            <button className="hidden sm:flex text-xs font-semibold text-primary hover:underline items-center gap-1">
              View Report <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                <defs>
                   {categoryData.map((item, i) => (
                     <linearGradient key={`grad-${i}`} id={`barGrad-${i}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={item.color} stopOpacity={1} />
                        <stop offset="100%" stopColor={item.color} stopOpacity={0.6} />
                     </linearGradient>
                   ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  type="number"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  dataKey="name"
                  type="category"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 'bold' }}
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--primary))', opacity: 0.1 }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    backdropFilter: 'blur(8px)',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={32}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#barGrad-${index})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-all duration-700" />
          <h3 className="text-lg font-bold text-foreground mb-6">Weekly Trends</h3>
          <div className="h-[200px] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingTrends}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" hide />
                <Tooltip
                  labelClassName="font-bold text-foreground"
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px',
                    border: '1px solid hsl(var(--border))'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#0ea5e9"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Busiest Day</span>
              <span className="text-sm font-black text-primary">{busiestDay.day} ({busiestDay.bookings})</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Weekly Growth</span>
              <span className="text-sm font-black text-emerald-600">{weeklyGrowth >= 0 ? '+' : ''}{weeklyGrowth}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-foreground">Recent Activity</h3>
            <button className="text-xs font-semibold text-primary hover:underline">View All</button>
          </div>
          <div className="divide-y divide-border">
            {recentBookings.map(b => (
              <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs text-left">
                    {b.studentName.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-foreground">{b.studentName}</p>
                    <p className="text-xs text-muted-foreground">{b.equipmentName} · {b.timeSlot}</p>
                  </div>
                </div>
                <div className="sm:ml-4"><StatusBadge status={b.status} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card flex flex-col items-center">
          <h3 className="font-bold text-foreground mb-6 text-center">User Management</h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {userStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderRadius: '12px',
                    border: '1px solid hsl(var(--border))',
                    boxShadow: 'var(--shadow-md)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-3">
              <span className="text-3xl font-black text-foreground">
                {userStats.reduce((acc, curr) => acc + curr.value, 0)}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Total Users</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 px-4">
            {userStats.map(stat => (
              <div key={stat.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: stat.fill }}
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground">{stat.name}</span>
                  <span className="text-[10px] text-muted-foreground">{stat.value} Members</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>




    </div>
  );
}
