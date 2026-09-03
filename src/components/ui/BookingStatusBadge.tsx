import type { BookingStatus } from '../../types';
import { cn } from '../../lib/utils';

const labels: Record<BookingStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  checked_in: 'Checked In',
  checked_out: 'Checked Out',
  cancelled: 'Cancelled',
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide',
        status === 'pending' && 'bg-amber-100 text-amber-800',
        status === 'confirmed' && 'bg-emerald-100 text-emerald-800',
        status === 'checked_in' && 'bg-sky-100 text-sky-800',
        status === 'checked_out' && 'bg-stone-200 text-stone-700',
        status === 'cancelled' && 'bg-rose-100 text-rose-800',
      )}
    >
      {labels[status]}
    </span>
  );
}
