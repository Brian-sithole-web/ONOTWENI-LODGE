import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { DEFAULT_ROOMS, DEFAULT_SETTINGS } from '../lib/constants';
import { placeholderGallery } from '../lib/images';
import { db, isFirebaseConfigured, storage } from '../lib/firebase';
import { createId, fileToDataUrl } from '../lib/utils';
import type {
  AppUser,
  BlockedDate,
  Booking,
  ContactMessage,
  GalleryImage,
  LodgeSettings,
  OccupancyRecord,
  Room,
} from '../types';
import { toOccupancy } from '../lib/availability';

const KEYS = {
  users: 'onothweni.users',
  rooms: 'onothweni.rooms',
  bookings: 'onothweni.bookings',
  blockedDates: 'onothweni.blockedDates',
  settings: 'onothweni.settings',
  gallery: 'onothweni.gallery',
  messages: 'onothweni.contactMessages',
  occupancy: 'onothweni.occupancy',
  session: 'onothweni.sessionUserId',
  seedVersion: 'onothweni.seedVersion',
} as const;

const CURRENT_SEED_VERSION = '2026-09-03-lodge-exterior';

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('onothweni-store-change', { detail: key }));
}

function seedLocalStore(): void {
  const seedVersion = localStorage.getItem(KEYS.seedVersion);
  const shouldRefreshMedia = seedVersion !== CURRENT_SEED_VERSION;

  if (!readLocal<Room[] | null>(KEYS.rooms, null) || shouldRefreshMedia) {
    writeLocal(KEYS.rooms, DEFAULT_ROOMS);
  }
  if (!readLocal<LodgeSettings | null>(KEYS.settings, null)) {
    writeLocal(KEYS.settings, DEFAULT_SETTINGS);
  }
  if (!readLocal<GalleryImage[] | null>(KEYS.gallery, null) || shouldRefreshMedia) {
    writeLocal(
      KEYS.gallery,
      placeholderGallery.map((item, index) => ({
        id: createId(),
        category: item.category,
        imageUrl: item.imageUrl,
        caption: item.caption,
        sortOrder: index,
        createdAt: new Date().toISOString(),
      })),
    );
  }
  if (!readLocal<Booking[] | null>(KEYS.bookings, null)) {
    writeLocal(KEYS.bookings, []);
  }
  if (!readLocal<BlockedDate[] | null>(KEYS.blockedDates, null)) {
    writeLocal(KEYS.blockedDates, []);
  }
  if (!readLocal<AppUser[] | null>(KEYS.users, null)) {
    writeLocal(KEYS.users, []);
  }
  if (!readLocal<ContactMessage[] | null>(KEYS.messages, null)) {
    writeLocal(KEYS.messages, []);
  }
  localStorage.setItem(KEYS.seedVersion, CURRENT_SEED_VERSION);
}

seedLocalStore();

async function ensureFirebaseSeed(): Promise<void> {
  const firestore = db;
  if (!firestore) {
    return;
  }
  const settingsSnap = await getDoc(doc(firestore, 'settings', 'general'));
  if (!settingsSnap.exists()) {
    await setDoc(doc(firestore, 'settings', 'general'), DEFAULT_SETTINGS);
  }
  const roomsSnap = await getDocs(collection(firestore, 'rooms'));
  if (roomsSnap.empty) {
    await Promise.all(DEFAULT_ROOMS.map((room) => setDoc(doc(firestore, 'rooms', room.id), room)));
  }
  const gallerySnap = await getDocs(collection(firestore, 'gallery'));
  if (gallerySnap.empty) {
    await Promise.all(
      placeholderGallery.map((item, index) => {
        const image: GalleryImage = {
          id: createId(),
          category: item.category,
          imageUrl: item.imageUrl,
          caption: item.caption,
          sortOrder: index,
          createdAt: new Date().toISOString(),
        };
        return setDoc(doc(firestore, 'gallery', image.id), image);
      }),
    );
  }
}

let firebaseSeedPromise: Promise<void> | null = null;
export function initializeData(): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return Promise.resolve();
  }
  firebaseSeedPromise ??= ensureFirebaseSeed();
  return firebaseSeedPromise;
}

export async function uploadLodgeImage(file: File, folder: string): Promise<string> {
  if (storage) {
    const storageRef = ref(storage, `${folder}/${createId()}-${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }
  return fileToDataUrl(file);
}

export async function getUsers(): Promise<AppUser[]> {
  if (db) {
    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs.map((item) => item.data() as AppUser);
  }
  return readLocal<AppUser[]>(KEYS.users, []);
}

export async function getUserById(userId: string): Promise<AppUser | null> {
  if (db) {
    const snapshot = await getDoc(doc(db, 'users', userId));
    return snapshot.exists() ? (snapshot.data() as AppUser) : null;
  }
  return readLocal<AppUser[]>(KEYS.users, []).find((user) => user.id === userId) ?? null;
}

export async function upsertUser(user: AppUser): Promise<void> {
  if (db) {
    await setDoc(doc(db, 'users', user.id), user, { merge: true });
    return;
  }
  const users = readLocal<AppUser[]>(KEYS.users, []);
  writeLocal(
    KEYS.users,
    users.some((item) => item.id === user.id)
      ? users.map((item) => (item.id === user.id ? user : item))
      : [...users, user],
  );
}

export function getLocalSessionUserId(): string | null {
  return localStorage.getItem(KEYS.session);
}

export function setLocalSessionUserId(userId: string | null): void {
  if (userId) {
    localStorage.setItem(KEYS.session, userId);
  } else {
    localStorage.removeItem(KEYS.session);
  }
}

export async function getRooms(): Promise<Room[]> {
  if (db) {
    const snapshot = await getDocs(collection(db, 'rooms'));
    return snapshot.docs.map((item) => item.data() as Room);
  }
  return readLocal<Room[]>(KEYS.rooms, DEFAULT_ROOMS);
}

export async function saveRoom(room: Room): Promise<void> {
  if (db) {
    await setDoc(doc(db, 'rooms', room.id), room);
    return;
  }
  const rooms = readLocal<Room[]>(KEYS.rooms, []);
  writeLocal(
    KEYS.rooms,
    rooms.some((item) => item.id === room.id)
      ? rooms.map((item) => (item.id === room.id ? room : item))
      : [...rooms, room],
  );
}

export async function archiveRoom(roomId: string): Promise<void> {
  const rooms = await getRooms();
  const room = rooms.find((item) => item.id === roomId);
  if (!room) {
    return;
  }
  await saveRoom({ ...room, isActive: false, updatedAt: new Date().toISOString() });
}

export async function getBookings(): Promise<Booking[]> {
  if (db) {
    const snapshot = await getDocs(collection(db, 'bookings'));
    return snapshot.docs.map((item) => item.data() as Booking);
  }
  return readLocal<Booking[]>(KEYS.bookings, []);
}

export async function getBookingsForUser(userId: string): Promise<Booking[]> {
  if (db) {
    const snapshot = await getDocs(query(collection(db, 'bookings'), where('userId', '==', userId)));
    return snapshot.docs.map((item) => item.data() as Booking);
  }
  return readLocal<Booking[]>(KEYS.bookings, []).filter((booking) => booking.userId === userId);
}

export async function getBookingByReference(reference: string): Promise<Booking | null> {
  const bookings = await getBookings();
  return bookings.find((booking) => booking.bookingReference === reference) ?? null;
}

export async function saveBooking(booking: Booking): Promise<void> {
  const occupancy = toOccupancy(booking);
  if (db) {
    await setDoc(doc(db, 'bookings', booking.id), booking);
    await setDoc(doc(db, 'occupancy', booking.id), occupancy);
    return;
  }
  const bookings = readLocal<Booking[]>(KEYS.bookings, []);
  writeLocal(
    KEYS.bookings,
    bookings.some((item) => item.id === booking.id)
      ? bookings.map((item) => (item.id === booking.id ? booking : item))
      : [...bookings, booking],
  );
  const occupancyRecords = readLocal<OccupancyRecord[]>(KEYS.occupancy, []);
  writeLocal(
    KEYS.occupancy,
    occupancyRecords.some((item) => item.id === occupancy.id)
      ? occupancyRecords.map((item) => (item.id === occupancy.id ? occupancy : item))
      : [...occupancyRecords, occupancy],
  );
}

export async function getOccupancy(): Promise<OccupancyRecord[]> {
  if (db) {
    const snapshot = await getDocs(collection(db, 'occupancy'));
    return snapshot.docs.map((item) => item.data() as OccupancyRecord);
  }
  const stored = readLocal<OccupancyRecord[] | null>(KEYS.occupancy, null);
  if (stored) {
    return stored;
  }
  return readLocal<Booking[]>(KEYS.bookings, []).map(toOccupancy);
}

export async function getBlockedDates(): Promise<BlockedDate[]> {
  if (db) {
    const snapshot = await getDocs(collection(db, 'blockedDates'));
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as BlockedDate);
  }
  return readLocal<BlockedDate[]>(KEYS.blockedDates, []);
}

export async function saveBlockedDate(block: BlockedDate): Promise<void> {
  if (db) {
    await setDoc(doc(db, 'blockedDates', block.id), block);
    return;
  }
  const blocks = readLocal<BlockedDate[]>(KEYS.blockedDates, []);
  writeLocal(KEYS.blockedDates, [...blocks.filter((item) => item.id !== block.id), block]);
}

export async function deleteBlockedDate(blockId: string): Promise<void> {
  if (db) {
    await deleteDoc(doc(db, 'blockedDates', blockId));
    return;
  }
  writeLocal(
    KEYS.blockedDates,
    readLocal<BlockedDate[]>(KEYS.blockedDates, []).filter((item) => item.id !== blockId),
  );
}

export async function getSettings(): Promise<LodgeSettings> {
  if (db) {
    const snapshot = await getDoc(doc(db, 'settings', 'general'));
    return snapshot.exists() ? (snapshot.data() as LodgeSettings) : DEFAULT_SETTINGS;
  }
  return readLocal<LodgeSettings>(KEYS.settings, DEFAULT_SETTINGS);
}

export async function saveSettings(settings: LodgeSettings): Promise<void> {
  const next = { ...settings, id: 'general', updatedAt: new Date().toISOString() };
  if (db) {
    await setDoc(doc(db, 'settings', 'general'), next);
    return;
  }
  writeLocal(KEYS.settings, next);
}

export async function getGallery(): Promise<GalleryImage[]> {
  if (db) {
    const snapshot = await getDocs(collection(db, 'gallery'));
    return snapshot.docs
      .map((item) => item.data() as GalleryImage)
      .sort((left, right) => left.sortOrder - right.sortOrder);
  }
  return readLocal<GalleryImage[]>(KEYS.gallery, []).sort((left, right) => left.sortOrder - right.sortOrder);
}

export async function saveGalleryImage(image: GalleryImage): Promise<void> {
  if (db) {
    await setDoc(doc(db, 'gallery', image.id), image);
    return;
  }
  const images = readLocal<GalleryImage[]>(KEYS.gallery, []);
  writeLocal(
    KEYS.gallery,
    images.some((item) => item.id === image.id)
      ? images.map((item) => (item.id === image.id ? image : item))
      : [...images, image],
  );
}

export async function deleteGalleryImage(imageId: string): Promise<void> {
  if (db) {
    await deleteDoc(doc(db, 'gallery', imageId));
    return;
  }
  writeLocal(
    KEYS.gallery,
    readLocal<GalleryImage[]>(KEYS.gallery, []).filter((item) => item.id !== imageId),
  );
}

export async function saveContactMessage(message: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<void> {
  const record: ContactMessage = {
    ...message,
    id: createId(),
    createdAt: new Date().toISOString(),
  };
  if (db) {
    await addDoc(collection(db, 'contactMessages'), record);
    return;
  }
  writeLocal(KEYS.messages, [...readLocal<ContactMessage[]>(KEYS.messages, []), record]);
}

export function subscribeToLocalStore(onChange: () => void): () => void {
  const handler = () => onChange();
  window.addEventListener('onothweni-store-change', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('onothweni-store-change', handler);
    window.removeEventListener('storage', handler);
  };
}

export function subscribeCollection(
  collectionName: 'rooms' | 'bookings' | 'blockedDates' | 'gallery' | 'settings' | 'occupancy',
  onChange: () => void,
): Unsubscribe | (() => void) {
  if (db) {
    if (collectionName === 'settings') {
      return onSnapshot(doc(db, 'settings', 'general'), onChange);
    }
    return onSnapshot(collection(db, collectionName), onChange);
  }
  return subscribeToLocalStore(onChange);
}
