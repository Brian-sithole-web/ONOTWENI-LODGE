import { NavLink } from 'react-router-dom';
import { BedDouble, CalendarRange, Images, LayoutDashboard, NotebookTabs, Settings } from 'lucide-react';

const items = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: NotebookTabs, end: false },
  { to: '/admin/rooms', label: 'Rooms', icon: BedDouble, end: false },
  { to: '/admin/availability', label: 'Availability', icon: CalendarRange, end: false },
  { to: '/admin/gallery', label: 'Gallery', icon: Images, end: false },
  { to: '/admin/settings', label: 'Settings', icon: Settings, end: false },
];

export function AdminSidebar() {
  return (
    <aside className="w-full shrink-0 bg-forest-950 p-4 text-cream lg:min-h-screen lg:w-64">
      <p className="px-3 pb-4 font-serif text-2xl tracking-[0.12em]">Admin</p>
      <nav className="flex gap-2 overflow-x-auto lg:flex-col">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2 text-sm whitespace-nowrap ${isActive ? 'bg-gold-400 text-forest-950' : 'hover:bg-white/10'}`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
