import { RoomCard } from '../components/rooms/RoomCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Skeleton } from '../components/ui/Skeleton';
import { useLodgeData } from '../context/lodge-data-context';
import { lodgeImages } from '../lib/images';

export function RoomsPage() {
  const { rooms, isLoading } = useLodgeData();
  const visibleRooms = rooms.filter((room) => room.isActive);

  return (
    <div>
      <section className="relative overflow-hidden py-24">
        <img src={lodgeImages.interior} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-forest-950/65" />
        <div className="relative mx-auto max-w-4xl px-4 text-center text-cream">
          <h1 className="font-serif text-5xl">Rooms & Accommodation</h1>
          <p className="mt-4 text-cream/80">Comfortable rooms with the space and amenities needed for a restful stay.</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeader title="Choose your room" description="Availability and nightly rates are managed by the lodge administrator." />
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {isLoading ? (
            <>
              <Skeleton className="h-[30rem]" />
              <Skeleton className="h-[30rem]" />
            </>
          ) : (
            visibleRooms.map((room) => <RoomCard key={room.id} room={room} bookTo={`/book?room=${room.id}`} />)
          )}
        </div>
      </section>
    </div>
  );
}
