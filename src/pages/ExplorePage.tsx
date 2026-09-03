import { SectionHeader } from '../components/ui/SectionHeader';
import { useLodgeData } from '../context/lodge-data-context';
import { EXPLORE_PLACES } from '../lib/constants';
import { lodgeImages } from '../lib/images';

export function ExplorePage() {
  const { settings } = useLodgeData();
  const mapQuery = encodeURIComponent(settings.address || 'Manguzi, KwaZulu-Natal, South Africa');

  return (
    <div>
      <section className="relative overflow-hidden py-24">
        <img src={lodgeImages.elephants} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-forest-950/65" />
        <div className="relative mx-auto max-w-3xl px-4 text-center text-cream">
          <h1 className="font-serif text-5xl">Explore Manguzi</h1>
          <p className="mt-4 text-cream/80">
            Northern KwaZulu-Natal is a landscape of lakes, wildlife and quiet coastline. Distances are not shown unless
            they have been verified by the lodge.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeader title="Nearby exploration opportunities" />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {EXPLORE_PLACES.map((place) => (
            <article key={place.name} className="luxury-card overflow-hidden rounded-3xl">
              <img src={place.image} alt={place.name} className="h-56 w-full object-cover" />
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-gold-700">{place.theme}</p>
                <h2 className="mt-2 font-serif text-3xl text-forest-900">{place.name}</h2>
                <p className="mt-3 text-stone-ink">{place.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-cream py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader title="Manguzi on the map" description="The map shows the Manguzi area. An exact lodge pin can be added in administrator settings." />
          <div className="mt-8 overflow-hidden rounded-3xl border border-gold-500/20 bg-white">
            <iframe
              title="Manguzi location map"
              className="h-[28rem] w-full"
              src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
