import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  light?: boolean;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  light = false,
}: SectionHeaderProps) {
  return (
    <div className={cn('max-w-3xl', align === 'center' ? 'mx-auto text-center' : 'text-left')}>
      {eyebrow ? (
        <p
          className={cn(
            'mb-3 text-xs font-semibold uppercase tracking-[0.28em]',
            light ? 'text-gold-400' : 'text-gold-700',
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2 className={cn('font-serif text-4xl leading-tight md:text-5xl', light ? 'text-cream' : 'text-forest-900')}>
        {title}
      </h2>
      <div className="gold-rule mx-auto my-5 w-24" />
      {description ? (
        <p className={cn('text-base leading-relaxed md:text-lg', light ? 'text-cream/80' : 'text-stone-ink')}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
