import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/auth-context';
import { cn, getInitials } from '../../lib/utils';
import { Button } from '../ui/Button';
import { MobileMenu } from './MobileMenu';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/explore', label: 'Explore Manguzi' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const { user, signOutUser } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const solid = scrolled || !isHome;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition duration-500',
        solid ? 'bg-forest-950/95 shadow-lg backdrop-blur' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src="/images/logo.jpg" alt="Onothweni Lodge" className="h-14 w-14 rounded-full object-cover ring-1 ring-gold-400/50" />
          <span className="hidden font-serif text-xl tracking-[0.18em] text-cream sm:block">ONOTHWENI</span>
        </Link>
        <nav className="hidden items-center gap-5 xl:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'text-sm tracking-wide text-cream/80 transition hover:text-gold-400',
                  isActive && 'text-gold-400',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/book" className="hidden sm:block">
            <Button size="sm">Book Now</Button>
          </Link>
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full bg-white/10 px-2 py-1 text-cream"
                aria-label="Account menu"
              >
                {user.profileImage ? (
                  <img src={user.profileImage} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-400 text-xs text-forest-950">
                    {getInitials(user.name)}
                  </span>
                )}
              </button>
              {menuOpen ? (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white p-2 shadow-xl">
                  <Link to="/account/bookings" className="block rounded-xl px-3 py-2 text-sm hover:bg-cream">
                    My Bookings
                  </Link>
                  <Link to="/account/profile" className="block rounded-xl px-3 py-2 text-sm hover:bg-cream">
                    My Profile
                  </Link>
                  {user.role === 'admin' ? (
                    <Link to="/admin" className="block rounded-xl px-3 py-2 text-sm hover:bg-cream">
                      Admin Dashboard
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-cream"
                    onClick={() => void signOutUser()}
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link to="/login" className="text-sm text-cream hover:text-gold-400">
              Login
            </Link>
          )}
          <button
            type="button"
            className="rounded-full p-2 text-cream xl:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {mobileOpen ? <MobileMenu links={links} onClose={() => setMobileOpen(false)} /> : null}
    </header>
  );
}
