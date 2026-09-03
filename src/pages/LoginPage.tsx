import { Navigate, useLocation } from 'react-router-dom';
import { GoogleLoginButton } from '../components/auth/GoogleLoginButton';
import { useAuth } from '../context/auth-context';

export function LoginPage() {
  const { user } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/account/bookings';

  if (user) {
    return <Navigate to={from} replace />;
  }

  return (
    <section className="mx-auto max-w-md px-4 py-20">
      <div className="luxury-card rounded-3xl p-8 text-center">
        <img src="/images/logo.jpg" alt="" className="mx-auto h-20 w-20 rounded-full object-cover ring-1 ring-gold-400/50" />
        <h1 className="mt-4 font-serif text-4xl text-forest-900">Guest login</h1>
        <p className="mt-3 text-stone-ink">Sign in with Google to manage bookings. You will never be asked for your Google password on this site.</p>
        <div className="mt-6 text-left">
          <GoogleLoginButton />
        </div>
      </div>
    </section>
  );
}
