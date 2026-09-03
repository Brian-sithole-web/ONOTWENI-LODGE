import { Link } from 'react-router-dom';
import { useLodgeData } from '../../context/lodge-data-context';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/explore', label: 'Explore Manguzi' },
  { to: '/contact', label: 'Contact' },
];

export function Footer() {
  const { settings } = useLodgeData();

  return (
    <footer className="bg-forest-950 text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-4">
        <div>
          <img src="/images/logo.jpg" alt="" className="mb-4 h-16 w-16 rounded-full object-cover ring-1 ring-gold-400/40" />
          <h3 className="font-serif text-2xl tracking-[0.16em]">ONOTHWENI LODGE</h3>
          <p className="mt-3 text-sm leading-relaxed text-cream/75">
            Peaceful accommodation in Manguzi, KwaZulu-Natal — a quiet place to rest, close to nature and the Maputaland
            landscape.
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-xs uppercase tracking-[0.24em] text-gold-400">Quick Links</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-gold-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs uppercase tracking-[0.24em] text-gold-400">Guest Services</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            <li>
              <Link to="/book" className="hover:text-gold-400">
                Book Now
              </Link>
            </li>
            <li>
              <Link to="/account/bookings" className="hover:text-gold-400">
                My Bookings
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-gold-400">
                Login
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs uppercase tracking-[0.24em] text-gold-400">Contact Information</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            <li>{settings.lodgeName}</li>
            <li>{settings.address}</li>
            <li>{settings.email || 'Email will appear once configured by the lodge.'}</li>
            <li>{settings.phone || 'Phone will appear once configured by the lodge.'}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Onothweni Lodge. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-gold-400">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-gold-400">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
