import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function PublicLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />
      <main className={isHome ? '' : 'pt-20'}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
