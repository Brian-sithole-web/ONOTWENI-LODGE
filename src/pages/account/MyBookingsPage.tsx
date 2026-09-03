import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { BookingStatusBadge } from '../../components/ui/BookingStatusBadge';
import { AccountNav } from '../../components/layout/AccountNav';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../context/auth-context';
import { useLodgeData } from '../../context/lodge-data-context';
import { canGuestCancel } from '../../lib/availability';
import { formatCurrency, formatDisplayDate, todayDateInput } from '../../lib/utils';
import { saveBooking } from '../../services/store';

type Filter = 'upcoming' | 'past' | 'cancelled';

export function MyBookingsPage() {
  const { user } = useAuth();
  const { bookings, settings, refresh } = useLodgeData();
  const [filter, setFilter] = useState<Filter>('upcoming');
  const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);
  const today = todayDateInput();

  const mine = useMemo(
    () => bookings.filter((booking) => booking.userId === user?.id).sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    [bookings, user?.id],
  );

  const visible = mine.filter((booking) => {
    if (filter === 'cancelled') {
      return booking.status === 'cancelled';
    }
    if (filter === 'past') {
      return booking.status !== 'cancelled' && booking.checkOutDate < today;
    }
    return booking.status !== 'cancelled' && booking.checkOutDate >= today;
  });

  async function cancelBooking(bookingId: string) {
    const booking = mine.find((item) => item.id === bookingId);
    if (!booking || !canGuestCancel(booking, settings.cancellationHoursBeforeCheckIn)) {
      toast.error('This booking cannot be cancelled under the current lodge policy.');
      return;
    }
    await saveBooking({ ...booking, status: 'cancelled', updatedAt: new Date().toISOString() });
    await refresh();
    toast.success('Booking cancelled.');
    setPendingCancelId(null);
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <AccountNav />
      <h1 className="font-serif text-4xl text-forest-900">My Bookings</h1>
      <div className="mt-6 flex gap-2">
        {(['upcoming', 'past', 'cancelled'] as Filter[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full px-4 py-2 text-sm capitalize ${filter === item ? 'bg-forest-900 text-cream' : 'bg-cream'}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-8 space-y-4">
        {visible.length === 0 ? (
          <EmptyState title="No bookings in this view" description="When you request a stay, it will appear here." />
        ) : (
          visible.map((booking) => (
            <article key={booking.id} className="luxury-card rounded-3xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gold-700">{booking.bookingReference}</p>
                  <h2 className="mt-1 font-serif text-3xl text-forest-900">{booking.roomName}</h2>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="text-stone-ink">Check-in</dt>
                  <dd>{formatDisplayDate(booking.checkInDate)}</dd>
                </div>
                <div>
                  <dt className="text-stone-ink">Check-out</dt>
                  <dd>{formatDisplayDate(booking.checkOutDate)}</dd>
                </div>
                <div>
                  <dt className="text-stone-ink">Nights</dt>
                  <dd>{booking.numberOfNights}</dd>
                </div>
                <div>
                  <dt className="text-stone-ink">Total</dt>
                  <dd>{formatCurrency(booking.totalAmount)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-stone-ink">Requested {formatDisplayDate(booking.createdAt.slice(0, 10))}</p>
              {canGuestCancel(booking, settings.cancellationHoursBeforeCheckIn) ? (
                <Button className="mt-4" size="sm" variant="ghost" onClick={() => setPendingCancelId(booking.id)}>
                  Cancel booking
                </Button>
              ) : null}
            </article>
          ))
        )}
      </div>
      {pendingCancelId ? (
        <ConfirmDialog
          title="Cancel this booking?"
          message="This follows the lodge cancellation policy configured by the administrator."
          confirmLabel="Cancel booking"
          onClose={() => setPendingCancelId(null)}
          onConfirm={() => void cancelBooking(pendingCancelId)}
        />
      ) : null}
    </section>
  );
}
