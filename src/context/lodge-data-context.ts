import { createContext, useContext } from 'react';
import type {
  AvailabilityResult,
  BlockedDate,
  Booking,
  BookingSearchValues,
  GalleryImage,
  LodgeSettings,
  OccupancyRecord,
  Room,
} from '../types';

export interface LodgeDataContextValue {
  rooms: Room[];
  bookings: Booking[];
  occupancy: OccupancyRecord[];
  blockedDates: BlockedDate[];
  settings: LodgeSettings;
  gallery: GalleryImage[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  searchAvailability: (search: BookingSearchValues) => AvailabilityResult[];
}

export const LodgeDataContext = createContext<LodgeDataContextValue | undefined>(undefined);

export function useLodgeData(): LodgeDataContextValue {
  const context = useContext(LodgeDataContext);
  if (!context) {
    throw new Error('useLodgeData must be used within LodgeDataProvider');
  }
  return context;
}
