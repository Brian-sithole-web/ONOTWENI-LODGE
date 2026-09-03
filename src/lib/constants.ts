import type { LodgeSettings, Room } from '../types';
import { exploreImages, lodgeImages } from './images';

export const AMENITY_OPTIONS = [
  'Air Conditioning',
  'Private Bathroom',
  'Shower',
  'Flat-Screen TV',
  'Kitchen Area',
  'Refrigerator',
  'Oven',
  'Stovetop',
  'Electric Kettle',
  'Wardrobe',
  'Kitchenware',
  'Balcony/Terrace',
] as const;

export const SHARED_ROOM_AMENITIES = [...AMENITY_OPTIONS];

export const DEFAULT_SETTINGS: LodgeSettings = {
  id: 'general',
  lodgeName: 'Onothweni Lodge',
  phone: '',
  email: '',
  address: 'Manguzi, KwaZulu-Natal, South Africa',
  whatsapp: '',
  checkInTime: '14:00 to 22:00',
  checkOutTime: '10:00 to 13:00',
  cancellationPolicy:
    'Guests may cancel a pending booking at any time. Confirmed bookings may be cancelled up to the configured notice period before check-in. The lodge administrator may adjust this policy.',
  cancellationHoursBeforeCheckIn: 24,
  quietHours: '22:00 to 06:00',
  curfew: '22:00 to 06:00',
  petsPolicy: 'Pets are allowed on request, with no extra charge unless the administrator changes this policy.',
  parking: 'Free private parking is available on site, including accessible parking.',
  security: '24-hour security',
  latitude: '',
  longitude: '',
  socialLinks: {
    facebook: '',
    instagram: '',
    tripadvisor: '',
  },
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_ROOMS: Room[] = [
  {
    id: 'double-room',
    name: 'Double Room',
    roomType: 'double',
    description:
      'A peaceful double room with a comfortable full bed, a private bathroom, air conditioning, a television, and kitchen facilities — designed for rest after a day in Manguzi.',
    capacityAdults: 2,
    capacityChildren: 1,
    numberOfUnits: 1,
    pricePerNight: null,
    amenities: [...SHARED_ROOM_AMENITIES],
    images: [lodgeImages.doubleRoom, lodgeImages.bathroom, lodgeImages.kitchen, lodgeImages.terrace],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'family-room',
    name: 'Family Room',
    roomType: 'family',
    description:
      'A generous family room with two full beds, a private bathroom, air conditioning, a television, and kitchen facilities — suited to families and small groups travelling together.',
    capacityAdults: 4,
    capacityChildren: 2,
    numberOfUnits: 1,
    pricePerNight: null,
    amenities: [...SHARED_ROOM_AMENITIES],
    images: [lodgeImages.familyRoom, lodgeImages.familyRoomAlt, lodgeImages.bathroom, lodgeImages.kitchen],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const FACILITIES = [
  {
    title: 'Free Private Parking',
    description: 'Complimentary private parking is available for guests during their stay.',
    icon: 'Car',
  },
  {
    title: 'Accessible Parking',
    description: 'Accessible parking is available on the property.',
    icon: 'ParkingCircle',
  },
  {
    title: 'Private Bathrooms',
    description: 'Every room includes a private bathroom with a shower.',
    icon: 'Bath',
  },
  {
    title: 'Terrace',
    description: 'An outdoor terrace for quiet mornings and unhurried evenings.',
    icon: 'Sunset',
  },
  {
    title: 'Garden',
    description: 'Garden surroundings that keep the stay close to nature.',
    icon: 'Trees',
  },
  {
    title: 'Pet Friendly on Request',
    description: 'Pets may be welcomed on request, subject to the lodge’s current policy.',
    icon: 'PawPrint',
  },
  {
    title: '24-Hour Security',
    description: 'The property is supported by around-the-clock security.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Air Conditioning',
    description: 'Rooms are air-conditioned for a comfortable rest in any season.',
    icon: 'Snowflake',
  },
] as const;

export const EXPLORE_PLACES = [
  {
    name: 'Kosi Bay region',
    theme: 'Coastal experiences',
    description:
      'A string of lakes, estuary channels and quiet beaches that define the far north of KwaZulu-Natal — a gentle introduction to Maputaland’s coastal world.',
    image: exploreImages.kosiBayRegion,
  },
  {
    name: 'Kosi Bay Nature Reserve',
    theme: 'Nature',
    description:
      'A protected mosaic of lakes, raffia palms and traditional fish traps. Visit as a nearby exploration opportunity from Manguzi.',
    image: exploreImages.kosiBayNatureReserve,
  },
  {
    name: 'Tembe Elephant Park',
    theme: 'Wildlife',
    description:
      'Home to some of Southern Africa’s largest elephants, Tembe is a celebrated wildlife destination in the region surrounding Manguzi.',
    image: exploreImages.tembeElephantPark,
  },
  {
    name: 'Lake Sibaya',
    theme: 'Nature',
    description:
      'South Africa’s largest natural freshwater lake, known for still water, birdlife and a sense of remote quiet.',
    image: exploreImages.lakeSibaya,
  },
  {
    name: 'iSimangaliso Wetland Park',
    theme: 'Nearby attractions',
    description:
      'A UNESCO World Heritage Site of wetlands, coastline and wilderness stretching across this part of KwaZulu-Natal.',
    image: exploreImages.isimangalisoWetlandPark,
  },
] as const;
