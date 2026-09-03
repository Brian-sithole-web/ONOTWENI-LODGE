import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { evaluateAvailability } from '../lib/availability';
import { DEFAULT_SETTINGS } from '../lib/constants';
import {
  getBlockedDates,
  getBookings,
  getBookingsForUser,
  getGallery,
  getOccupancy,
  getRooms,
  getSettings,
  initializeData,
  subscribeCollection,
} from '../services/store';
import type {
  BlockedDate,
  Booking,
  BookingSearchValues,
  GalleryImage,
  LodgeSettings,
  OccupancyRecord,
  Room,
} from '../types';
import { useAuth } from './auth-context';
import { LodgeDataContext } from './lodge-data-context';

export function LodgeDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [occupancy, setOccupancy] = useState<OccupancyRecord[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [settings, setSettings] = useState<LodgeSettings>(DEFAULT_SETTINGS);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    await initializeData();
    const nextBookings = user?.role === 'admin' ? await getBookings() : user ? await getBookingsForUser(user.id) : [];
    const [nextRooms, nextOccupancy, nextBlockedDates, nextSettings, nextGallery] = await Promise.all([
      getRooms(),
      getOccupancy(),
      getBlockedDates(),
      getSettings(),
      getGallery(),
    ]);
    setRooms(nextRooms);
    setBookings(nextBookings);
    setOccupancy(nextOccupancy);
    setBlockedDates(nextBlockedDates);
    setSettings(nextSettings);
    setGallery(nextGallery);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    void refresh();
    const unsubscribers = [
      subscribeCollection('rooms', () => void refresh()),
      subscribeCollection('bookings', () => void refresh()),
      subscribeCollection('occupancy', () => void refresh()),
      subscribeCollection('blockedDates', () => void refresh()),
      subscribeCollection('settings', () => void refresh()),
      subscribeCollection('gallery', () => void refresh()),
    ];
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [refresh]);

  const searchAvailability = useCallback(
    (search: BookingSearchValues) => evaluateAvailability(rooms, search, occupancy, blockedDates),
    [rooms, occupancy, blockedDates],
  );

  const value = useMemo(
    () => ({
      rooms,
      bookings,
      occupancy,
      blockedDates,
      settings,
      gallery,
      isLoading,
      refresh,
      searchAvailability,
    }),
    [rooms, bookings, occupancy, blockedDates, settings, gallery, isLoading, refresh, searchAvailability],
  );

  return <LodgeDataContext.Provider value={value}>{children}</LodgeDataContext.Provider>;
}
