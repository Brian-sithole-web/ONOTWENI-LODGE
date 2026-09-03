import type { AvailabilityResult, BlockedDate, Booking, OccupancyRecord, Room } from '../types';
import { eachNight, nightsBetween } from './utils';

const BLOCKING_STATUSES: OccupancyRecord['status'][] = ['pending', 'confirmed', 'checked_in'];

function occupiesNight(startDate: string, endDate: string, night: string): boolean {
  return night >= startDate && night < endDate;
}

export function getBookedUnitsForNight(
  roomId: string,
  night: string,
  occupancy: OccupancyRecord[],
  ignoreBookingId?: string,
): number {
  return occupancy
    .filter(
      (record) =>
        record.roomId === roomId &&
        record.id !== ignoreBookingId &&
        BLOCKING_STATUSES.includes(record.status) &&
        occupiesNight(record.checkInDate, record.checkOutDate, night),
    )
    .reduce((total, record) => total + record.numberOfRooms, 0);
}

export function isNightBlocked(
  roomId: string,
  night: string,
  blockedDates: BlockedDate[],
): boolean {
  return blockedDates.some(
    (block) => block.roomId === roomId && occupiesNight(block.startDate, block.endDate, night),
  );
}

export function getAvailableUnits(
  room: Room,
  checkInDate: string,
  checkOutDate: string,
  occupancy: OccupancyRecord[],
  blockedDates: BlockedDate[],
  ignoreBookingId?: string,
): number {
  const nights = eachNight(checkInDate, checkOutDate);
  if (nights.length === 0) {
    return 0;
  }

  let lowest = room.numberOfUnits;
  for (const night of nights) {
    if (isNightBlocked(room.id, night, blockedDates)) {
      return 0;
    }
    const remaining = room.numberOfUnits - getBookedUnitsForNight(room.id, night, occupancy, ignoreBookingId);
    lowest = Math.min(lowest, remaining);
  }
  return Math.max(0, lowest);
}

export function evaluateAvailability(
  rooms: Room[],
  search: {
    checkInDate: string;
    checkOutDate: string;
    numberOfAdults: number;
    numberOfChildren: number;
    numberOfRooms: number;
  },
  occupancy: OccupancyRecord[],
  blockedDates: BlockedDate[],
): AvailabilityResult[] {
  const numberOfNights = nightsBetween(search.checkInDate, search.checkOutDate);

  return rooms
    .filter((room) => room.isActive)
    .map((room) => {
      const availableUnits = getAvailableUnits(
        room,
        search.checkInDate,
        search.checkOutDate,
        occupancy,
        blockedDates,
      );
      const capacityFits =
        search.numberOfAdults <= room.capacityAdults * search.numberOfRooms &&
        search.numberOfChildren <= room.capacityChildren * search.numberOfRooms;
      const isAvailable = availableUnits >= search.numberOfRooms && capacityFits;
      const estimatedTotal =
        room.pricePerNight === null ? null : room.pricePerNight * numberOfNights * search.numberOfRooms;

      return {
        room,
        availableUnits,
        isAvailable,
        numberOfNights,
        estimatedTotal,
      };
    });
}

export function canGuestCancel(booking: Booking, hoursNotice: number): boolean {
  if (booking.status === 'cancelled' || booking.status === 'checked_out' || booking.status === 'checked_in') {
    return false;
  }
  if (booking.status === 'pending') {
    return true;
  }
  const checkIn = new Date(`${booking.checkInDate}T14:00:00`);
  const hoursUntilCheckIn = (checkIn.getTime() - Date.now()) / (1000 * 60 * 60);
  return hoursUntilCheckIn >= hoursNotice;
}

export function toOccupancy(booking: Booking): OccupancyRecord {
  return {
    id: booking.id,
    roomId: booking.roomId,
    checkInDate: booking.checkInDate,
    checkOutDate: booking.checkOutDate,
    numberOfRooms: booking.numberOfRooms,
    status: booking.status,
  };
}
