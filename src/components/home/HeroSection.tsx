import { Link } from 'react-router-dom';
import { lodgeImages } from '../../lib/images';
import { BookingSearchForm } from '../booking/BookingSearchForm';
import { Button } from '../ui/Button';

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <img src={lodgeImages.hero} alt="Onothweni Lodge set among the hills of Manguzi" className="hero-kenburns absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/45 to-forest-950/80" />
      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-10 pt-32">
        <div className="animate-fade-up max-w-3xl text-cream">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-gold-400">Manguzi, KwaZulu-Natal</p>
          <h1 className="font-serif text-5xl leading-tight md:text-7xl">Welcome to Onothweni Lodge</h1>
          <p className="mt-5 max-w-xl text-lg text-cream/85 md:text-xl">
            Experience comfort, peace and the beauty of Manguzi.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/book">
              <Button size="lg">Book Your Stay</Button>
            </Link>
            <Link to="/rooms">
              <Button size="lg" variant="outline">
                Explore Our Rooms
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-10">
          <BookingSearchForm />
        </div>
      </div>
    </section>
  );
}
