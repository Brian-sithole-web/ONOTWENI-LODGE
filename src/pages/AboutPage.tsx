import { SectionHeader } from '../components/ui/SectionHeader';
import { lodgeImages } from '../lib/images';

export function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden py-28">
        <img src={lodgeImages.forest} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-forest-950/70" />
        <div className="relative mx-auto max-w-4xl px-4 text-center text-cream">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-400">About Us</p>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl">About Onothweni Lodge</h1>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
        <img src={lodgeImages.welcome} alt="Onothweni Lodge exterior" className="h-[28rem] w-full rounded-[2rem] object-cover" />
        <div>
          <SectionHeader
            align="left"
            eyebrow="Our story"
            title="A quiet stay, close to nature"
            description="Onothweni Lodge provides peaceful accommodation in Manguzi. The lodge is designed to help guests experience comfort while remaining close to nature — a restful base rather than a busy resort."
          />
        </div>
      </section>
      <section className="bg-cream py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
          <div>
            <SectionHeader
              align="left"
              eyebrow="Our location"
              title="Manguzi, KwaZulu-Natal"
              description="The lodge is conveniently positioned for exploring the surrounding region and nearby natural attractions of northern KwaZulu-Natal, including the Maputaland landscape around Kosi Bay, Lake Sibaya and iSimangaliso."
            />
          </div>
          <img src={lodgeImages.reserve} alt="Natural landscape around the lodge" className="h-[26rem] w-full rounded-[2rem] object-cover" />
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <SectionHeader eyebrow="Languages" title="We welcome you in" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {['English', 'isiZulu'].map((language) => (
            <div key={language} className="luxury-card rounded-3xl px-6 py-10">
              <p className="font-serif text-3xl text-forest-900">{language}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
