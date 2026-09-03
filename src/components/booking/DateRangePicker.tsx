import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, parseDateOnly, toDateInputValue, todayDateInput } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface DateRangePickerProps {
  checkInDate: string;
  checkOutDate: string;
  onChange: (next: { checkInDate: string; checkOutDate: string }) => void;
}

export function DateRangePicker({ checkInDate, checkOutDate, onChange }: DateRangePickerProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => parseDateOnly(checkInDate || todayDateInput()));
  const today = todayDateInput();

  const days = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const first = new Date(year, month, 1);
    const startOffset = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<{ date: string; inMonth: boolean }> = [];
    for (let index = 0; index < startOffset; index += 1) {
      const date = new Date(year, month, index - startOffset + 1);
      cells.push({ date: toDateInputValue(date), inMonth: false });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({ date: toDateInputValue(new Date(year, month, day)), inMonth: true });
    }
    return cells;
  }, [visibleMonth]);

  function selectDate(date: string) {
    if (date < today) {
      return;
    }
    if (!checkInDate || (checkInDate && checkOutDate) || date <= checkInDate) {
      onChange({ checkInDate: date, checkOutDate: addDays(date, 1) });
      return;
    }
    onChange({ checkInDate, checkOutDate: date });
  }

  return (
    <div className="rounded-2xl border border-gold-500/20 bg-ivory p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}
          className="rounded-full p-1 hover:bg-sand"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-serif text-lg text-forest-900">
          {visibleMonth.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}
        </p>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}
          className="rounded-full p-1 hover:bg-sand"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wider text-stone-ink">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {days.map((cell) => {
          const selected = cell.date === checkInDate || cell.date === checkOutDate;
          const inRange = checkInDate && checkOutDate && cell.date > checkInDate && cell.date < checkOutDate;
          const disabled = cell.date < today;
          return (
            <button
              key={cell.date + String(cell.inMonth)}
              type="button"
              disabled={disabled}
              onClick={() => selectDate(cell.date)}
              className={cn(
                'h-9 rounded-full text-sm',
                !cell.inMonth && 'text-stone-300',
                disabled && 'cursor-not-allowed opacity-40',
                selected && 'bg-forest-900 text-cream',
                inRange && 'bg-gold-400/20 text-forest-900',
                !selected && !inRange && !disabled && 'hover:bg-sand',
              )}
            >
              {Number(cell.date.slice(-2))}
            </button>
          );
        })}
      </div>
    </div>
  );
}
