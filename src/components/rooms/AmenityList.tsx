import { Check } from 'lucide-react';

export function AmenityList({ amenities }: { amenities: string[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {amenities.map((amenity) => (
        <li key={amenity} className="flex items-center gap-2 text-sm text-stone-ink">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest-100 text-forest-700">
            <Check className="h-3.5 w-3.5" />
          </span>
          {amenity}
        </li>
      ))}
    </ul>
  );
}
