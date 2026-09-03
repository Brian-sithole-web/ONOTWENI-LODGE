import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { Booking } from '../../types';
import { formatCurrency, formatDisplayDate } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface BookingSummaryProps {
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfAdults: number;
  numberOfChildren: number;
  numberOfRooms: number;
  pricePerNight: number | null;
  totalAmount: number | null;
  collapsibleOnMobile?: boolean;
}

export function BookingSummary({
  roomName,
  checkInDate,
  checkOutDate,
  numberOfNights,
  numberOfAdults,
  numberOfChildren,
  numberOfRooms,
  pricePerNight,
  totalAmount,
  collapsibleOnMobile = true,
}: BookingSummaryProps) {
  const [open, setOpen] = useState(false);
  const rows = [
    ['Selected room', roomName],
    ['Check-in', formatDisplayDate(checkInDate)],
    ['Check-out', formatDisplayDate(checkOutDate)],
    ['Nights', String(numberOfNights)],
    ['Guests', `${numberOfAdults} adult${numberOfAdults === 1 ? '' : 's'}${numberOfChildren ? `, ${numberOfChildren} children` : ''}`],
    ['Rooms', String(numberOfRooms)],
    ['Price per night', formatCurrency(pricePerNight)],
  ];

  return (
    <aside className="luxury-card overflow-hidden rounded-3xl">
      <button
        type="button"
        className={cn(
          'flex w-full items-center justify-between bg-forest-900 px-6 py-4 text-left text-cream',
          !collapsibleOnMobile && 'pointer-events-none lg:pointer-events-none',
        )}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="font-serif text-2xl">Booking summary</span>
        <ChevronDown className={cn('h-5 w-5 lg:hidden', open && 'rotate-180')} />
      </button>
      <div className={cn('space-y-3 px-6 py-5', collapsibleOnMobile && !open && 'hidden lg:block')}>
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-4 text-sm">
            <span className="text-stone-ink">{label}</span>
            <span className="text-right font-medium text-forest-900">{value}</span>
          </div>
        ))}
        <div className="gold-rule" />
        <div className="flex items-center justify-between">
          <span className="text-stone-ink">Total amount</span>
          <span className="font-serif text-2xl text-forest-900">{formatCurrency(totalAmount)}</span>
        </div>
      </div>
    </aside>
  );
}

export function bookingToSummary(booking: Booking) {
  return {
    roomName: booking.roomName,
    checkInDate: booking.checkInDate,
    checkOutDate: booking.checkOutDate,
    numberOfNights: booking.numberOfNights,
    numberOfAdults: booking.numberOfAdults,
    numberOfChildren: booking.numberOfChildren,
    numberOfRooms: booking.numberOfRooms,
    pricePerNight: booking.pricePerNight,
    totalAmount: booking.totalAmount,
  };
}
