import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { Button } from '../ui/Button';

interface MobileMenuProps {
  links: Array<{ to: string; label: string }>;
  onClose: () => void;
}

export function MobileMenu({ links, onClose }: MobileMenuProps) {
  const { user, signOutUser } = useAuth();

  return (
    <div className="animate-fade-up border-t border-white/10 bg-forest-950 px-4 py-6 xl:hidden">
      <nav className="flex flex-col gap-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className="py-2 text-cream/90"
          >
            {link.label}
          </NavLink>
        ))}
        <Link to="/book" onClick={onClose}>
          <Button className="w-full">Book Now</Button>
        </Link>
        {user ? (
          <>
            <Link to="/account/bookings" onClick={onClose} className="py-2 text-cream/90">
              My Bookings
            </Link>
            {user.role === 'admin' ? (
              <Link to="/admin" onClick={onClose} className="py-2 text-cream/90">
                Admin Dashboard
              </Link>
            ) : null}
            <button
              type="button"
              className="py-2 text-left text-cream/90"
              onClick={() => {
                void signOutUser();
                onClose();
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" onClick={onClose} className="py-2 text-cream/90">
            Login
          </Link>
        )}
      </nav>
    </div>
  );
}
