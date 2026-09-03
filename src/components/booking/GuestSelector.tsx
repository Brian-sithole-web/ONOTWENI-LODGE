import { Minus, Plus } from 'lucide-react';

interface GuestSelectorProps {
  adults: number;
  childrenCount: number;
  rooms: number;
  onChange: (next: { adults: number; childrenCount: number; rooms: number }) => void;
  showChildren?: boolean;
}

function Stepper({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm text-stone-ink">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-500/40"
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-6 text-center font-medium">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-500/40"
          onClick={() => onChange(value + 1)}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function GuestSelector({
  adults,
  childrenCount,
  rooms,
  onChange,
  showChildren = true,
}: GuestSelectorProps) {
  return (
    <div className="divide-y divide-gold-500/15">
      <Stepper label="Adults" value={adults} min={1} onChange={(value) => onChange({ adults: value, childrenCount, rooms })} />
      {showChildren ? (
        <Stepper
          label="Children"
          value={childrenCount}
          min={0}
          onChange={(value) => onChange({ adults, childrenCount: value, rooms })}
        />
      ) : null}
      <Stepper label="Rooms" value={rooms} min={1} onChange={(value) => onChange({ adults, childrenCount, rooms: value })} />
    </div>
  );
}
