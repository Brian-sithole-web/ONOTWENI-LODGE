import { Link, useNavigate, useParams } from 'react-router-dom';
import { AmenityList } from '../components/rooms/AmenityList';
import { RoomGallery } from '../components/rooms/RoomGallery';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { useLodgeData } from '../context/lodge-data-context';
import { formatCurrency } from '../lib/utils';

export function RoomDetailPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { rooms, isLoading } = useLodgeData();
  const room = rooms.find((item) => item.id === roomId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <Skeleton className="h-[32rem]" />
      </div>
    );
  }

  if (!room) {
    return (
      <section className="mx-auto max-w-xl px-4 py-32 text-center">
        <h1 className="font-serif text-4xl">Room not found</h1>
        <Link to="/rooms" className="mt-4 inline-block text-gold-700">
          Back to rooms
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2">
      <RoomGallery images={room.images} roomName={room.name} />
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-gold-700">{room.roomType}</p>
        <h1 className="mt-2 font-serif text-5xl text-forest-900">{room.name}</h1>
        <p className="mt-4 text-lg text-stone-ink">{room.description}</p>
        <p className="mt-4 text-sm text-forest-800">
          Capacity: {room.capacityAdults} adults{room.capacityChildren ? `, ${room.capacityChildren} children` : ''}
        </p>
        <p className="mt-2 font-serif text-3xl text-forest-900">{formatCurrency(room.pricePerNight)}</p>
        <div className="mt-8">
          <AmenityList amenities={room.amenities} />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={() => navigate(`/book?room=${room.id}`)}>Book Now</Button>
          <Button variant="forest" onClick={() => navigate(`/book?room=${room.id}`)}>
            Check availability
          </Button>
        </div>
      </div>
    </section>
  );
}
