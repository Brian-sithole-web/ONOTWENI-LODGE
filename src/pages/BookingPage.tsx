import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { GoogleLoginButton } from '../components/auth/GoogleLoginButton';
import { BookingSearchForm } from '../components/booking/BookingSearchForm';
import { BookingSummary } from '../components/booking/BookingSummary';
import { AmenityList } from '../components/rooms/AmenityList';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useAuth } from '../context/auth-context';
import { useLodgeData } from '../context/lodge-data-context';
import { getAvailableUnits } from '../lib/availability';
import { addDays, createBookingReference, createId, formatCurrency, nightsBetween, todayDateInput } from '../lib/utils';
import { saveBooking } from '../services/store';
import type { AvailabilityResult, BookingSearchValues } from '../types';

export function BookingPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { occupancy, blockedDates, searchAvailability, refresh } = useLodgeData();
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState<BookingSearchValues>({
    checkInDate: params.get('checkIn') || todayDateInput(),
    checkOutDate: params.get('checkOut') || addDays(todayDateInput(), 1),
    numberOfAdults: Number(params.get('adults') || 2),
    numberOfChildren: Number(params.get('children') || 0),
    numberOfRooms: Number(params.get('rooms') || 1),
  });
  const [selectedRoomId, setSelectedRoomId] = useState(params.get('room') || '');
  const [guestName, setGuestName] = useState(user?.name ?? '');
  const [guestEmail, setGuestEmail] = useState(user?.email ?? '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? '');
  const [expectedArrivalTime, setExpectedArrivalTime] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const results = useMemo(() => searchAvailability(search), [search, searchAvailability]);
  const selected = results.find((item) => item.room.id === selectedRoomId);

  useEffect(() => {
    if (!user) {
      return;
    }
    setGuestName((current) => current || user.name);
    setGuestEmail((current) => current || user.email);
    setPhoneNumber((current) => current || user.phoneNumber);
    if (step === 3) {
      setStep(4);
    }
  }, [user, step]);

  function onSearch(value: BookingSearchValues) {
    setSearch(value);
    setStep(2);
  }

  function selectRoom(result: AvailabilityResult) {
    if (!result.isAvailable) {
      toast.error('This room is not available for the selected dates.');
      return;
    }
    setSelectedRoomId(result.room.id);
    setStep(user ? 4 : 3);
  }

  async function confirmBooking() {
    if (!user || !selected) {
      toast.error('Please sign in and select a room.');
      return;
    }
    if (!guestName.trim() || !guestEmail.trim() || !phoneNumber.trim()) {
      toast.error('Please complete your name, email and phone number.');
      return;
    }
    const available = getAvailableUnits(
      selected.room,
      search.checkInDate,
      search.checkOutDate,
      occupancy,
      blockedDates,
    );
    if (available < search.numberOfRooms) {
      toast.error('Those dates are no longer available.');
      return;
    }
    setSubmitting(true);
    const numberOfNights = nightsBetween(search.checkInDate, search.checkOutDate);
    const totalAmount =
      selected.room.pricePerNight === null ? null : selected.room.pricePerNight * numberOfNights * search.numberOfRooms;
    const bookingReference = createBookingReference();
    await saveBooking({
      id: createId(),
      bookingReference,
      userId: user.id,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      phoneNumber: phoneNumber.trim(),
      roomId: selected.room.id,
      roomName: selected.room.name,
      checkInDate: search.checkInDate,
      checkOutDate: search.checkOutDate,
      numberOfAdults: search.numberOfAdults,
      numberOfChildren: search.numberOfChildren,
      numberOfRooms: search.numberOfRooms,
      numberOfNights,
      pricePerNight: selected.room.pricePerNight,
      totalAmount,
      specialRequests,
      expectedArrivalTime,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await refresh();
    setSubmitting(false);
    navigate(`/book/confirmation/${bookingReference}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.28em] text-gold-700">Booking</p>
      <h1 className="mt-2 font-serif text-5xl text-forest-900">Reserve your stay</h1>
      <ol className="mt-6 flex flex-wrap gap-3 text-sm">
        {['Search', 'Select room', 'Sign in', 'Details'].map((label, index) => (
          <li key={label} className={`rounded-full px-3 py-1 ${step === index + 1 ? 'bg-forest-900 text-cream' : 'bg-cream'}`}>
            {index + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 1 ? (
        <div className="mt-8">
          <BookingSearchForm initialValue={search} variant="page" onSearch={onSearch} />
        </div>
      ) : null}

      {step === 2 ? (
        <div className="mt-8 space-y-6">
          <Button variant="ghost" onClick={() => setStep(1)}>
            Edit search
          </Button>
          {results.length === 0 ? (
            <EmptyState title="No rooms to show" description="The administrator has not published rooms yet." />
          ) : (
            results.map((result) => (
              <article key={result.room.id} className="luxury-card grid gap-6 rounded-3xl p-4 md:grid-cols-[220px_1fr_auto]">
                {result.room.images[0] ? (
                  <img src={result.room.images[0]} alt="" className="h-44 w-full rounded-2xl object-cover" />
                ) : (
                  <div className="flex h-44 items-center justify-center rounded-2xl bg-sand">No image</div>
                )}
                <div>
                  <h2 className="font-serif text-3xl text-forest-900">{result.room.name}</h2>
                  <p className="mt-2 text-stone-ink">{result.room.description}</p>
                  <p className="mt-2 text-sm">
                    Capacity: {result.room.capacityAdults} adults, {result.room.capacityChildren} children · {result.availableUnits} unit
                    {result.availableUnits === 1 ? '' : 's'} open
                  </p>
                  <div className="mt-3">
                    <AmenityList amenities={result.room.amenities.slice(0, 6)} />
                  </div>
                </div>
                <div className="flex flex-col items-start justify-between gap-4 md:items-end">
                  <div className="text-right">
                    <p className="font-serif text-2xl">{formatCurrency(result.room.pricePerNight)}</p>
                    <p className="text-sm text-stone-ink">{result.numberOfNights} night{result.numberOfNights === 1 ? '' : 's'}</p>
                    <p className="text-sm">Est. {formatCurrency(result.estimatedTotal)}</p>
                  </div>
                  <Button disabled={!result.isAvailable} onClick={() => selectRoom(result)}>
                    {result.isAvailable ? 'Select room' : 'Unavailable'}
                  </Button>
                </div>
              </article>
            ))
          )}
        </div>
      ) : null}

      {step === 3 ? (
        <div className="mx-auto mt-10 max-w-md luxury-card rounded-3xl p-8">
          <h2 className="font-serif text-3xl">Continue with Google</h2>
          <p className="mt-2 text-stone-ink">Sign in securely to confirm your booking request. We never ask for your Google password.</p>
          <div className="mt-6">
            <GoogleLoginButton />
          </div>
        </div>
      ) : null}

      {step === 4 && selected ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            className="luxury-card space-y-4 rounded-3xl p-6"
            onSubmit={(event) => {
              event.preventDefault();
              void confirmBooking();
            }}
          >
            <h2 className="font-serif text-3xl">Booking details</h2>
            <input value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="Full Name" className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" required />
            <input value={guestEmail} onChange={(event) => setGuestEmail(event.target.value)} type="email" placeholder="Email" className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" required />
            <input value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="Phone Number" className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" required />
            <input value={search.checkInDate} readOnly className="w-full rounded-2xl bg-cream px-4 py-3" />
            <input value={search.checkOutDate} readOnly className="w-full rounded-2xl bg-cream px-4 py-3" />
            <input value={selected.room.name} readOnly className="w-full rounded-2xl bg-cream px-4 py-3" />
            <input value={`${search.numberOfAdults} adults, ${search.numberOfChildren} children`} readOnly className="w-full rounded-2xl bg-cream px-4 py-3" />
            <input value={expectedArrivalTime} onChange={(event) => setExpectedArrivalTime(event.target.value)} placeholder="Expected arrival time (recommended)" className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" />
            <textarea value={specialRequests} onChange={(event) => setSpecialRequests(event.target.value)} placeholder="Special requests" rows={4} className="w-full rounded-2xl border border-gold-500/20 px-4 py-3" />
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Sending request…' : 'Confirm booking request'}
            </Button>
          </form>
          <BookingSummary
            roomName={selected.room.name}
            checkInDate={search.checkInDate}
            checkOutDate={search.checkOutDate}
            numberOfNights={selected.numberOfNights}
            numberOfAdults={search.numberOfAdults}
            numberOfChildren={search.numberOfChildren}
            numberOfRooms={search.numberOfRooms}
            pricePerNight={selected.room.pricePerNight}
            totalAmount={selected.estimatedTotal}
          />
        </div>
      ) : null}
    </div>
  );
}
