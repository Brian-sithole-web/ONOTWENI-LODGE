import { useMemo, useState } from 'react';
import type { Booking, BookingStatus, Room } from '../../types';
import { formatCurrency, formatDisplayDate } from '../../lib/utils';
import { BookingStatusBadge } from '../ui/BookingStatusBadge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

interface BookingTableProps {
  bookings: Booking[];
  rooms: Room[];
  onView: (booking: Booking) => void;
}

const PAGE_SIZE = 8;

export function BookingTable({ bookings, rooms, onView }: BookingTableProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<BookingStatus | 'all'>('all');
  const [roomId, setRoomId] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return bookings
      .filter((booking) => {
        const haystack = `${booking.bookingReference} ${booking.guestName} ${booking.guestEmail} ${booking.phoneNumber}`.toLowerCase();
        const matchesSearch = haystack.includes(search.toLowerCase());
        const matchesStatus = status === 'all' || booking.status === status;
        const matchesRoom = roomId === 'all' || booking.roomId === roomId;
        const matchesFrom = !fromDate || booking.checkInDate >= fromDate;
        const matchesTo = !toDate || booking.checkOutDate <= toDate;
        return matchesSearch && matchesStatus && matchesRoom && matchesFrom && matchesTo;
      })
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }, [bookings, search, status, roomId, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-5">
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search guest, email, reference"
          className="rounded-xl border border-gold-500/20 bg-white px-3 py-2 text-sm md:col-span-2"
        />
        <select value={status} onChange={(event) => setStatus(event.target.value as BookingStatus | 'all')} className="rounded-xl border border-gold-500/20 px-3 py-2 text-sm">
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked_in">Checked In</option>
          <option value="checked_out">Checked Out</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={roomId} onChange={(event) => setRoomId(event.target.value)} className="rounded-xl border border-gold-500/20 px-3 py-2 text-sm">
          <option value="all">All rooms</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="rounded-xl border border-gold-500/20 px-2 py-2 text-sm" />
          <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="rounded-xl border border-gold-500/20 px-2 py-2 text-sm" />
        </div>
      </div>
      {pageItems.length === 0 ? (
        <EmptyState title="No bookings found" description="Adjust your filters or wait for new guest requests." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gold-500/15 bg-white">
          <table className="min-w-[1100px] w-full text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wider text-stone-ink">
              <tr>
                {['Reference', 'Guest', 'Email', 'Phone', 'Room', 'Check-in', 'Check-out', 'Guests', 'Total', 'Status', 'Created', 'Actions'].map((heading) => (
                  <th key={heading} className="px-3 py-3 font-medium">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.map((booking) => (
                <tr key={booking.id} className="border-t border-gold-500/10">
                  <td className="px-3 py-3 font-medium">{booking.bookingReference}</td>
                  <td className="px-3 py-3">{booking.guestName}</td>
                  <td className="px-3 py-3">{booking.guestEmail}</td>
                  <td className="px-3 py-3">{booking.phoneNumber || '—'}</td>
                  <td className="px-3 py-3">{booking.roomName}</td>
                  <td className="px-3 py-3">{formatDisplayDate(booking.checkInDate)}</td>
                  <td className="px-3 py-3">{formatDisplayDate(booking.checkOutDate)}</td>
                  <td className="px-3 py-3">{booking.numberOfAdults + booking.numberOfChildren}</td>
                  <td className="px-3 py-3">{formatCurrency(booking.totalAmount)}</td>
                  <td className="px-3 py-3">
                    <BookingStatusBadge status={booking.status} />
                  </td>
                  <td className="px-3 py-3">{formatDisplayDate(booking.createdAt.slice(0, 10))}</td>
                  <td className="px-3 py-3">
                    <Button size="sm" variant="ghost" onClick={() => onView(booking)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center justify-end gap-2">
        <Button size="sm" variant="ghost" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>
          Previous
        </Button>
        <span className="text-sm text-stone-ink">
          Page {page} of {totalPages}
        </span>
        <Button size="sm" variant="ghost" disabled={page === totalPages} onClick={() => setPage((value) => value + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
