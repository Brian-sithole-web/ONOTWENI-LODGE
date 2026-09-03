interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-gold-500/40 bg-cream/60 px-6 py-12 text-center">
      <h3 className="font-serif text-2xl text-forest-900">{title}</h3>
      <p className="mt-2 text-stone-ink">{description}</p>
    </div>
  );
}
