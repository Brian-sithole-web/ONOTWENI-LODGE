import { useState } from 'react';
import { BookingDetailsModal } from '../../components/admin/BookingDetailsModal';
import { BookingTable } from '../../components/admin/BookingTable';
import { useLodgeData } from '../../context/lodge-data-context';
import type { Booking } from '../../types';

export function AdminBookingsPage() {
  const { bookings, rooms } = useLodgeData();
  const [selected, setSelected] = useState<Booking | null>(null);

  return (
    <div>
      <h1 className="mb-6 font-serif text-4xl text-forest-900">Booking management</h1>
      <BookingTable bookings={bookings} rooms={rooms} onView={setSelected} />
      {selected ? <BookingDetailsModal booking={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  );
}
