import { useMemo, useState } from 'react';
import { parseDateOnly, toDateInputValue, todayDateInput } from '../../lib/utils';
import { getAvailableUnits, isNightBlocked } from '../../lib/availability';
import type { BlockedDate, OccupancyRecord, Room } from '../../types';
import { cn } from '../../lib/utils';

interface AvailabilityCalendarProps {
  room: Room;
  occupancy: OccupancyRecord[];
  blockedDates: BlockedDate[];
}

export function AvailabilityCalendar({ room, occupancy, blockedDates }: AvailabilityCalendarProps) {
  const [month, setMonth] = useState(() => parseDateOnly(todayDateInput()));
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  const cells = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, index) => {
      const date = toDateInputValue(new Date(month.getFullYear(), month.getMonth(), index + 1));
      const next = toDateInputValue(new Date(month.getFullYear(), month.getMonth(), index + 2));
      const blocked = isNightBlocked(room.id, date, blockedDates);
      const remaining = getAvailableUnits(room, date, next, occupancy, blockedDates);
      return { date, blocked, remaining };
    });
  }, [occupancy, blockedDates, daysInMonth, month, room]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
          Previous
        </button>
        <h3 className="font-serif text-2xl">
          {month.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}
        </h3>
        <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
          Next
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {cells.map((cell) => (
          <div
            key={cell.date}
            className={cn(
              'rounded-xl p-2 text-center text-sm',
              cell.blocked && 'bg-rose-100 text-rose-800',
              !cell.blocked && cell.remaining === 0 && 'bg-sand text-stone-ink',
              !cell.blocked && cell.remaining > 0 && 'bg-emerald-50 text-forest-800',
            )}
          >
            <p className="font-medium">{Number(cell.date.slice(-2))}</p>
            <p className="text-[11px]">{cell.blocked ? 'Blocked' : `${cell.remaining} open`}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
