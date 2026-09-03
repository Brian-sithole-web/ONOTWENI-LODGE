import { toast } from 'sonner';
import type { Booking, BookingStatus } from '../../types';
import { getAvailableUnits } from '../../lib/availability';
import { formatCurrency, formatDisplayDate } from '../../lib/utils';
import { saveBooking } from '../../services/store';
import { useLodgeData } from '../../context/lodge-data-context';
import { BookingStatusBadge } from '../ui/BookingStatusBadge';
import { Button } from '../ui/Button';
import { BookingSummary } from '../booking/BookingSummary';

interface BookingDetailsModalProps {
  booking: Booking;
  onClose: () => void;
}

export function BookingDetailsModal({ booking, onClose }: BookingDetailsModalProps) {
  const { rooms, occupancy, blockedDates, refresh } = useLodgeData();

  async function setStatus(status: BookingStatus) {
    if (status === 'confirmed') {
      const room = rooms.find((item) => item.id === booking.roomId);
      if (room) {
        const available = getAvailableUnits(
          room,
          booking.checkInDate,
          booking.checkOutDate,
          occupancy,
          blockedDates,
          booking.id,
        );
        if (available < booking.numberOfRooms) {
          toast.error('This room is no longer available for the selected dates.');
          return;
        }
      }
    }
    await saveBooking({ ...booking, status, updatedAt: new Date().toISOString() });
    toast.success(`Booking marked as ${status.replace('_', ' ')}.`);
    await refresh();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-forest-950/50 p-4">
      <div className="mx-auto grid max-w-5xl gap-6 rounded-3xl bg-ivory p-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold-700">Booking</p>
          <h2 className="mt-1 font-serif text-4xl text-forest-900">{booking.bookingReference}</h2>
          <div className="mt-3">
            <BookingStatusBadge status={booking.status} />
          </div>
          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-stone-ink">Guest</dt>
              <dd className="font-medium">{booking.guestName}</dd>
            </div>
            <div>
              <dt className="text-stone-ink">Email</dt>
              <dd className="font-medium">{booking.guestEmail}</dd>
            </div>
            <div>
              <dt className="text-stone-ink">Phone</dt>
              <dd className="font-medium">{booking.phoneNumber || '—'}</dd>
            </div>
            <div>
              <dt className="text-stone-ink">Arrival time</dt>
              <dd className="font-medium">{booking.expectedArrivalTime || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-stone-ink">Created</dt>
              <dd className="font-medium">{formatDisplayDate(booking.createdAt.slice(0, 10))}</dd>
            </div>
            <div>
              <dt className="text-stone-ink">Total</dt>
              <dd className="font-medium">{formatCurrency(booking.totalAmount)}</dd>
            </div>
          </dl>
          {booking.specialRequests ? (
            <p className="mt-4 rounded-2xl bg-cream p-4 text-sm text-stone-ink">{booking.specialRequests}</p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => void setStatus('confirmed')}>
              Confirm
            </Button>
            <Button size="sm" variant="forest" onClick={() => void setStatus('checked_in')}>
              Mark Checked In
            </Button>
            <Button size="sm" variant="cream" onClick={() => void setStatus('checked_out')}>
              Mark Checked Out
            </Button>
            <Button size="sm" variant="ghost" onClick={() => void setStatus('cancelled')}>
              Cancel Booking
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
        <BookingSummary
          roomName={booking.roomName}
          checkInDate={booking.checkInDate}
          checkOutDate={booking.checkOutDate}
          numberOfNights={booking.numberOfNights}
          numberOfAdults={booking.numberOfAdults}
          numberOfChildren={booking.numberOfChildren}
          numberOfRooms={booking.numberOfRooms}
          pricePerNight={booking.pricePerNight}
          totalAmount={booking.totalAmount}
          collapsibleOnMobile={false}
        />
      </div>
    </div>
  );
}
