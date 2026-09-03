import { Link } from 'react-router-dom';
import { Button } from './Button';

interface CTASectionProps {
  title: string;
  text: string;
  buttonLabel: string;
  to: string;
  backgroundImage: string;
}

export function CTASection({ title, text, buttonLabel, to, backgroundImage }: CTASectionProps) {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <img src={backgroundImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-forest-950/70" />
      <div className="relative mx-auto max-w-4xl px-4 text-center text-cream">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold-400">Onothweni Lodge</p>
        <h2 className="font-serif text-4xl md:text-6xl">{title}</h2>
        <div className="gold-rule mx-auto my-6 w-28" />
        <p className="mx-auto max-w-2xl text-lg text-cream/85">{text}</p>
        <Link to={to} className="mt-8 inline-block">
          <Button size="lg">{buttonLabel}</Button>
        </Link>
      </div>
    </section>
  );
}
