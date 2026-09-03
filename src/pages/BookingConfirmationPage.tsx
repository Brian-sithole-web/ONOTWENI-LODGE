import { Link, useParams } from 'react-router-dom';
import { BookingStatusBadge } from '../components/ui/BookingStatusBadge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/auth-context';
import { useLodgeData } from '../context/lodge-data-context';
import { formatDisplayDate } from '../lib/utils';

export function BookingConfirmationPage() {
  const { reference } = useParams();
  const { user } = useAuth();
  const { bookings } = useLodgeData();
  const booking = bookings.find(
    (item) => item.bookingReference === reference && (!user || item.userId === user.id || user.role === 'admin'),
  );

  if (!booking) {
    return (
      <section className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-serif text-4xl">Booking not found</h1>
        <Link to="/account/bookings" className="mt-4 inline-block text-gold-700">
          View my bookings
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <div className="luxury-card rounded-3xl p-8 text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-gold-700">Onothweni Lodge</p>
        <h1 className="mt-3 font-serif text-4xl text-forest-900">Booking Request Received!</h1>
        <p className="mt-3 text-stone-ink">The lodge will review your request and update the status once it is confirmed.</p>
        <div className="mt-8 space-y-3 text-left text-sm">
          <Row label="Booking reference" value={booking.bookingReference} />
          <Row label="Guest name" value={booking.guestName} />
          <Row label="Room" value={booking.roomName} />
          <Row label="Check-in" value={formatDisplayDate(booking.checkInDate)} />
          <Row label="Check-out" value={formatDisplayDate(booking.checkOutDate)} />
          <Row label="Guests" value={String(booking.numberOfAdults + booking.numberOfChildren)} />
          <div className="flex items-center justify-between">
            <span className="text-stone-ink">Status</span>
            <BookingStatusBadge status={booking.status} />
          </div>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/account/bookings">
            <Button>View My Bookings</Button>
          </Link>
          <Link to="/">
            <Button variant="forest">Back to Home</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-stone-ink">{label}</span>
      <span className="font-medium text-forest-900">{value}</span>
    </div>
  );
}
