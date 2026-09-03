import { Link } from 'react-router-dom';
import {
  Car,
  Home,
  PawPrint,
  ShieldCheck,
  Snowflake,
  Trees,
} from 'lucide-react';
import { HeroSection } from '../components/home/HeroSection';
import { RoomCard } from '../components/rooms/RoomCard';
import { Button } from '../components/ui/Button';
import { CTASection } from '../components/ui/CTASection';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Skeleton } from '../components/ui/Skeleton';
import { useLodgeData } from '../context/lodge-data-context';
import { lodgeImages } from '../lib/images';
import { cn } from '../lib/utils';
import { useInView } from '../hooks/useInView';

const features = [
  { title: 'Comfortable Accommodation', text: 'Thoughtfully appointed rooms made for rest after a day in Maputaland.', icon: Home },
  { title: 'Peaceful Natural Environment', text: 'A setting designed to keep guests close to the quiet of the surrounding landscape.', icon: Trees },
  { title: 'Air-Conditioned Rooms', text: 'Every room is air-conditioned for a comfortable night’s sleep.', icon: Snowflake },
  { title: 'Free Private Parking', text: 'Complimentary private parking is available on site.', icon: Car },
  { title: '24-Hour Security', text: 'The lodge is supported by around-the-clock security.', icon: ShieldCheck },
  { title: 'Pet Friendly on Request', text: 'Pets may be welcomed on request, with no extra charge unless the lodge changes this policy.', icon: PawPrint },
];

export function HomePage() {
  const { rooms, isLoading } = useLodgeData();
  const welcome = useInView<HTMLElement>();
  const featured = rooms.filter((room) => room.isActive).slice(0, 2);

  return (
    <>
      <HeroSection />
      <section ref={welcome.reference} className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 lg:grid-cols-2">
        <div className={cn(welcome.isInView && 'animate-fade-up')}>
          <SectionHeader
            align="left"
            eyebrow="Welcome"
            title="Your Home Away From Home"
            description="Onothweni Lodge offers peaceful accommodation designed to create a close connection with nature. Guests can enjoy comfortable rooms and modern amenities in Manguzi, KwaZulu-Natal."
          />
          <Link to="/about" className="mt-8 inline-block">
            <Button>Discover Onothweni Lodge</Button>
          </Link>
        </div>
        <div className="overflow-hidden rounded-[2rem] shadow-2xl">
          <img src={lodgeImages.welcome} alt="Onothweni Lodge exterior" className="h-full w-full object-cover" />
        </div>
      </section>
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader eyebrow="Why stay" title="Why Choose Us" description="A calm stay with the essentials that make a lodge visit easy and restful." />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="luxury-card rounded-3xl p-6">
                <feature.icon className="h-8 w-8 text-gold-600" />
                <h3 className="mt-4 font-serif text-2xl text-forest-900">{feature.title}</h3>
                <p className="mt-2 text-stone-ink">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-24">
        <SectionHeader eyebrow="Stay" title="Featured Rooms" description="Two generous room types, both with private bathrooms, air conditioning, television and kitchen facilities." />
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {isLoading ? (
            <>
              <Skeleton className="h-[28rem]" />
              <Skeleton className="h-[28rem]" />
            </>
          ) : (
            featured.map((room) => <RoomCard key={room.id} room={room} />)
          )}
        </div>
        <div className="mt-10 text-center">
          <Link to="/rooms">
            <Button variant="forest">View All Rooms</Button>
          </Link>
        </div>
      </section>
      <CTASection
        title="Your Perfect Stay in Manguzi Awaits"
        text="Check availability for your dates and send a booking request. The lodge will confirm your stay once the dates are reviewed."
        buttonLabel="Book Your Stay"
        to="/book"
        backgroundImage={lodgeImages.sunset}
      />
    </>
  );
}
