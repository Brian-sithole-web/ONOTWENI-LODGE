import type { ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { Skeleton } from '../ui/Skeleton';

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-24">
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user.role !== 'admin') {
    return (
      <section className="mx-auto max-w-xl px-4 py-32 text-center">
        <h1 className="font-serif text-4xl text-forest-900">Access denied</h1>
        <p className="mt-4 text-stone-ink">This area is reserved for lodge administrators.</p>
        <Link to="/" className="mt-6 inline-block text-gold-700 underline">
          Return home
        </Link>
      </section>
    );
  }

  return children;
}
