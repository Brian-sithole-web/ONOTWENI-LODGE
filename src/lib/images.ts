const lodgePhoto = (fileName: string) => `/images/lodge/${fileName}`;

export const lodgeImages = {
  hero: lodgePhoto('exterior.jpg'),
  welcome: lodgePhoto('exterior.jpg'),
  terrace: lodgePhoto('terrace.jpg'),
  garden: lodgePhoto('bedroom-garden.jpg'),
  doubleRoom: lodgePhoto('bedroom-double.jpg'),
  doubleRoomAlt: lodgePhoto('bedroom-garden.jpg'),
  familyRoom: lodgePhoto('bedroom-family.jpg'),
  familyRoomAlt: lodgePhoto('bedroom-garden.jpg'),
  interior: lodgePhoto('bedroom-family.jpg'),
  bathroom: lodgePhoto('bathroom.jpg'),
  kitchen: lodgePhoto('kitchen.jpg'),
  forest: lodgePhoto('balcony-view.jpg'),
  sunset: lodgePhoto('balcony-view.jpg'),
  elephants: lodgePhoto('balcony-view.jpg'),
  wetlands: lodgePhoto('balcony-view.jpg'),
  coast: lodgePhoto('terrace.jpg'),
  reserve: lodgePhoto('balcony-view.jpg'),
  lounge: lodgePhoto('bedroom-family.jpg'),
  pathway: lodgePhoto('terrace.jpg'),
} as const;

const explorePhoto = (fileName: string) => `/images/explore/${fileName}`;

export const exploreImages = {
  kosiBayRegion: explorePhoto('kosi-bay-region.jpg'),
  kosiBayNatureReserve: explorePhoto('kosi-bay-nature-reserve.jpg'),
  tembeElephantPark: explorePhoto('tembe-elephant-park.jpg'),
  lakeSibaya: explorePhoto('lake-sibaya.jpg'),
  isimangalisoWetlandPark: explorePhoto('isimangaliso-wetland-park.jpg'),
} as const;

export const placeholderGallery = [
  { category: 'rooms' as const, imageUrl: lodgeImages.doubleRoom, caption: 'Double Room' },
  { category: 'rooms' as const, imageUrl: lodgeImages.familyRoom, caption: 'Family Room' },
  { category: 'rooms' as const, imageUrl: lodgeImages.doubleRoomAlt, caption: 'Garden-facing bedroom' },
  { category: 'rooms' as const, imageUrl: lodgeImages.bathroom, caption: 'Private bathroom' },
  { category: 'interiors' as const, imageUrl: lodgeImages.kitchen, caption: 'Kitchenette' },
  { category: 'interiors' as const, imageUrl: lodgeImages.interior, caption: 'Comfortable interiors' },
  { category: 'lodge' as const, imageUrl: lodgeImages.terrace, caption: 'Outdoor terrace' },
  { category: 'lodge' as const, imageUrl: lodgeImages.hero, caption: 'Lodge exterior' },
  { category: 'garden' as const, imageUrl: lodgeImages.terrace, caption: 'Terrace seating' },
  { category: 'garden' as const, imageUrl: lodgeImages.garden, caption: 'Garden outlook' },
  { category: 'surroundings' as const, imageUrl: lodgeImages.forest, caption: 'Natural surrounds' },
];
