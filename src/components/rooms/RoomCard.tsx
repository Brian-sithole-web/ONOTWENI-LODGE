import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import type { Room } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/Button';

interface RoomCardProps {
  room: Room;
  bookTo?: string;
}

export function RoomCard({ room, bookTo = '/book' }: RoomCardProps) {
  const image = room.images[0];

  return (
    <article className="luxury-card group overflow-hidden rounded-3xl">
      <div className="relative overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={room.name}
            className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center bg-sand text-stone-ink">Image coming soon</div>
        )}
        <div className="absolute left-4 top-4 rounded-full bg-forest-900/85 px-3 py-1 text-xs uppercase tracking-[0.18em] text-gold-400">
          {room.roomType}
        </div>
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-3xl text-forest-900">{room.name}</h3>
          <p className="text-right text-sm text-stone-ink">
            <span className="block font-serif text-xl text-forest-900">{formatCurrency(room.pricePerNight)}</span>
            {room.pricePerNight !== null ? 'per night' : 'Set by the lodge'}
          </p>
        </div>
        <p className="text-stone-ink">{room.description}</p>
        <p className="flex items-center gap-2 text-sm text-forest-800">
          <Users className="h-4 w-4" />
          Up to {room.capacityAdults} adults
          {room.capacityChildren ? ` and ${room.capacityChildren} children` : ''}
        </p>
        <ul className="flex flex-wrap gap-2">
          {room.amenities.slice(0, 6).map((amenity) => (
            <li key={amenity} className="rounded-full bg-cream px-3 py-1 text-xs text-forest-800">
              {amenity}
            </li>
          ))}
        </ul>
        <div className="flex gap-3">
          <Link to={`/rooms/${room.id}`} className="flex-1">
            <Button variant="ghost" className="w-full border border-gold-500/30">
              View details
            </Button>
          </Link>
          <Link to={bookTo} className="flex-1">
            <Button className="w-full">Book Now</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
