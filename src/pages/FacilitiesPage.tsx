import { Bath, Car, ParkingCircle, PawPrint, ShieldCheck, Snowflake, Sunset, Trees } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { FACILITIES } from '../lib/constants';
import { lodgeImages } from '../lib/images';

const icons = {
  Car,
  ParkingCircle,
  Bath,
  Sunset,
  Trees,
  PawPrint,
  ShieldCheck,
  Snowflake,
} as const;

export function FacilitiesPage() {
  return (
    <div>
      <section className="relative overflow-hidden py-24">
        <img src={lodgeImages.garden} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-forest-950/65" />
        <div className="relative mx-auto max-w-3xl px-4 text-center text-cream">
          <h1 className="font-serif text-5xl">Facilities</h1>
          <p className="mt-4 text-cream/80">The comforts and practical features available during your stay.</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeader title="What you will find here" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FACILITIES.map((facility) => {
            const Icon = icons[facility.icon];
            return (
              <article key={facility.title} className="luxury-card rounded-3xl p-6 text-center">
                <Icon className="mx-auto h-10 w-10 text-gold-600" />
                <h2 className="mt-4 font-serif text-2xl text-forest-900">{facility.title}</h2>
                <p className="mt-2 text-sm text-stone-ink">{facility.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
