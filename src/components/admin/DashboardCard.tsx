import type { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
}

export function DashboardCard({ label, value, icon: Icon }: DashboardCardProps) {
  return (
    <article className="luxury-card rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-ink">{label}</p>
          <p className="mt-2 font-serif text-4xl text-forest-900">{value}</p>
        </div>
        <span className="rounded-full bg-forest-100 p-2 text-forest-800">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </article>
  );
}
