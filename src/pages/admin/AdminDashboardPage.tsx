import { BedDouble, CalendarCheck, CalendarMinus2, CircleAlert, ClipboardList, LogOut } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DashboardCard } from '../../components/admin/DashboardCard';
import { useLodgeData } from '../../context/lodge-data-context';
import { todayDateInput } from '../../lib/utils';

export function AdminDashboardPage() {
  const { bookings } = useLodgeData();
  const today = todayDateInput();
  const total = bookings.length;
  const pending = bookings.filter((booking) => booking.status === 'pending').length;
  const confirmed = bookings.filter((booking) => booking.status === 'confirmed').length;
  const checkIns = bookings.filter((booking) => booking.checkInDate === today && booking.status !== 'cancelled').length;
  const checkOuts = bookings.filter((booking) => booking.checkOutDate === today && booking.status !== 'cancelled').length;
  const cancelled = bookings.filter((booking) => booking.status === 'cancelled').length;

  const chart = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return {
      month: date.toLocaleDateString('en-ZA', { month: 'short' }),
      bookings: bookings.filter((booking) => booking.createdAt.startsWith(key)).length,
    };
  });

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest-900">Dashboard</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DashboardCard label="Total Bookings" value={total} icon={ClipboardList} />
        <DashboardCard label="Pending Bookings" value={pending} icon={CircleAlert} />
        <DashboardCard label="Confirmed Bookings" value={confirmed} icon={CalendarCheck} />
        <DashboardCard label="Today's Check-ins" value={checkIns} icon={BedDouble} />
        <DashboardCard label="Today's Check-outs" value={checkOuts} icon={LogOut} />
        <DashboardCard label="Cancelled Bookings" value={cancelled} icon={CalendarMinus2} />
      </div>
      <div className="luxury-card mt-8 rounded-3xl p-6">
        <h2 className="font-serif text-2xl">Booking activity</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#0A2A1B" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
