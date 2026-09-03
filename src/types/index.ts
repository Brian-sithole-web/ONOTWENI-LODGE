export type UserRole = 'guest' | 'admin';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'checked_out'
  | 'cancelled';

export type RoomType = 'double' | 'family' | 'other';

export type GalleryCategory =
  | 'rooms'
  | 'lodge'
  | 'interiors'
  | 'garden'
  | 'surroundings';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  phoneNumber: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  name: string;
  roomType: RoomType;
  description: string;
  capacityAdults: number;
  capacityChildren: number;
  numberOfUnits: number;
  pricePerNight: number | null;
  amenities: string[];
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  bookingReference: string;
  userId: string;
  guestName: string;
  guestEmail: string;
  phoneNumber: string;
  roomId: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfAdults: number;
  numberOfChildren: number;
  numberOfRooms: number;
  numberOfNights: number;
  pricePerNight: number | null;
  totalAmount: number | null;
  specialRequests: string;
  status: BookingStatus;
  expectedArrivalTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlockedDate {
  id: string;
  roomId: string;
  startDate: string;
  endDate: string;
  reason: string;
  createdBy: string;
  createdAt: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  tripadvisor: string;
}

export interface LodgeSettings {
  id: string;
  lodgeName: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  cancellationHoursBeforeCheckIn: number;
  quietHours: string;
  curfew: string;
  petsPolicy: string;
  parking: string;
  security: string;
  latitude: string;
  longitude: string;
  socialLinks: SocialLinks;
  updatedAt: string;
}

export interface GalleryImage {
  id: string;
  category: GalleryCategory;
  imageUrl: string;
  caption: string;
  sortOrder: number;
  createdAt: string;
}

export interface OccupancyRecord {
  id: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfRooms: number;
  status: BookingStatus;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface BookingSearchValues {
  checkInDate: string;
  checkOutDate: string;
  numberOfAdults: number;
  numberOfChildren: number;
  numberOfRooms: number;
}

export interface AvailabilityResult {
  room: Room;
  availableUnits: number;
  isAvailable: boolean;
  numberOfNights: number;
  estimatedTotal: number | null;
}
