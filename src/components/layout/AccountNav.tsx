import { NavLink } from 'react-router-dom';

export function AccountNav() {
  return (
    <nav className="mb-8 flex gap-2">
      <NavLink
        to="/account/profile"
        className={({ isActive }) =>
          `rounded-full px-4 py-2 text-sm ${isActive ? 'bg-forest-900 text-cream' : 'bg-cream text-forest-900'}`
        }
      >
        My Profile
      </NavLink>
      <NavLink
        to="/account/bookings"
        className={({ isActive }) =>
          `rounded-full px-4 py-2 text-sm ${isActive ? 'bg-forest-900 text-cream' : 'bg-cream text-forest-900'}`
        }
      >
        My Bookings
      </NavLink>
    </nav>
  );
}
