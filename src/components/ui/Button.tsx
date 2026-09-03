import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'forest' | 'outline' | 'ghost' | 'cream';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  className,
  variant = 'gold',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition duration-300 disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' && 'px-4 py-2 text-xs',
        size === 'md' && 'px-6 py-3 text-sm',
        size === 'lg' && 'px-8 py-3.5 text-base',
        variant === 'gold' && 'bg-gold-400 text-forest-950 hover:bg-gold-300 shadow-[0_10px_30px_rgba(201,162,39,0.28)]',
        variant === 'forest' && 'bg-forest-900 text-cream hover:bg-forest-800',
        variant === 'outline' && 'border border-gold-500/60 text-gold-400 hover:bg-gold-400/10',
        variant === 'ghost' && 'text-forest-900 hover:bg-forest-900/5',
        variant === 'cream' && 'bg-cream text-forest-900 hover:bg-white',
        className,
      )}
      {...props}
    />
  );
}
