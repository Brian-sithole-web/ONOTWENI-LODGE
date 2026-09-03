import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Users } from 'lucide-react';
import type { BookingSearchValues } from '../../types';
import { addDays, isPastDate, todayDateInput } from '../../lib/utils';
import { Button } from '../ui/Button';
import { DateRangePicker } from './DateRangePicker';
import { GuestSelector } from './GuestSelector';

interface BookingSearchFormProps {
  initialValue?: Partial<BookingSearchValues>;
  variant?: 'hero' | 'page';
  onSearch?: (value: BookingSearchValues) => void;
}

export function BookingSearchForm({ initialValue, variant = 'hero', onSearch }: BookingSearchFormProps) {
  const navigate = useNavigate();
  const [checkInDate, setCheckInDate] = useState(initialValue?.checkInDate || todayDateInput());
  const [checkOutDate, setCheckOutDate] = useState(initialValue?.checkOutDate || addDays(todayDateInput(), 1));
  const [numberOfAdults, setNumberOfAdults] = useState(initialValue?.numberOfAdults || 2);
  const [numberOfChildren, setNumberOfChildren] = useState(initialValue?.numberOfChildren || 0);
  const [numberOfRooms, setNumberOfRooms] = useState(initialValue?.numberOfRooms || 1);
  const [error, setError] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuests, setShowGuests] = useState(false);

  function submit() {
    if (isPastDate(checkInDate)) {
      setError('Check-in cannot be in the past.');
      return;
    }
    if (checkOutDate <= checkInDate) {
      setError('Check-out must be after check-in.');
      return;
    }
    setError('');
    const value: BookingSearchValues = {
      checkInDate,
      checkOutDate,
      numberOfAdults,
      numberOfChildren,
      numberOfRooms,
    };
    if (onSearch) {
      onSearch(value);
      return;
    }
    const params = new URLSearchParams({
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adults: String(numberOfAdults),
      children: String(numberOfChildren),
      rooms: String(numberOfRooms),
    });
    navigate(`/book?${params.toString()}`);
  }

  return (
    <div className={variant === 'hero' ? 'luxury-card rounded-3xl p-4 md:p-6' : 'luxury-card rounded-3xl p-6'}>
      <div className="grid gap-3 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-2xl border border-gold-500/20 bg-ivory px-4 py-3 text-left"
            onClick={() => {
              setShowCalendar((open) => !open);
              setShowGuests(false);
            }}
          >
            <CalendarDays className="h-5 w-5 text-gold-600" />
            <span>
              <span className="block text-[11px] uppercase tracking-[0.18em] text-stone-ink">Stay dates</span>
              <span className="text-sm text-forest-900">
                {checkInDate} → {checkOutDate}
              </span>
            </span>
          </button>
          {showCalendar ? (
            <div className="absolute left-0 right-0 z-20 mt-2">
              <DateRangePicker
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                onChange={({ checkInDate: nextIn, checkOutDate: nextOut }) => {
                  setCheckInDate(nextIn);
                  setCheckOutDate(nextOut);
                }}
              />
            </div>
          ) : null}
        </div>
        <div className="relative">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-2xl border border-gold-500/20 bg-ivory px-4 py-3 text-left"
            onClick={() => {
              setShowGuests((open) => !open);
              setShowCalendar(false);
            }}
          >
            <Users className="h-5 w-5 text-gold-600" />
            <span>
              <span className="block text-[11px] uppercase tracking-[0.18em] text-stone-ink">Guests & rooms</span>
              <span className="text-sm text-forest-900">
                {numberOfAdults} adults, {numberOfRooms} room{numberOfRooms > 1 ? 's' : ''}
              </span>
            </span>
          </button>
          {showGuests ? (
            <div className="absolute left-0 right-0 z-20 mt-2 rounded-2xl border border-gold-500/20 bg-white p-4 shadow-xl">
              <GuestSelector
                adults={numberOfAdults}
                childrenCount={numberOfChildren}
                rooms={numberOfRooms}
                onChange={({ adults, childrenCount, rooms }) => {
                  setNumberOfAdults(adults);
                  setNumberOfChildren(childrenCount);
                  setNumberOfRooms(rooms);
                }}
              />
            </div>
          ) : null}
        </div>
        <Button className="h-full min-h-14 w-full rounded-2xl" onClick={submit}>
          Search Availability
        </Button>
      </div>
      {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}
    </div>
  );
}
