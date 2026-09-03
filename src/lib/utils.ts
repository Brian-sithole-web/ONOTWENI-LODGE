export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function createId(): string {
  return crypto.randomUUID();
}

export function createBookingReference(): string {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ONI-${stamp}-${suffix}`;
}

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDisplayDate(value: string): string {
  if (!value) {
    return '—';
  }
  return parseDateOnly(value).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatCurrency(amount: number | null): string {
  if (amount === null || Number.isNaN(amount)) {
    return 'Rate on request';
  }
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function nightsBetween(checkInDate: string, checkOutDate: string): number {
  const milliseconds = parseDateOnly(checkOutDate).getTime() - parseDateOnly(checkInDate).getTime();
  return Math.round(milliseconds / (1000 * 60 * 60 * 24));
}

export function eachNight(checkInDate: string, checkOutDate: string): string[] {
  const nights: string[] = [];
  const cursor = parseDateOnly(checkInDate);
  const end = parseDateOnly(checkOutDate);
  while (cursor < end) {
    nights.push(toDateInputValue(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return nights;
}

export function todayDateInput(): string {
  return toDateInputValue(new Date());
}

export function addDays(value: string, days: number): string {
  const date = parseDateOnly(value);
  date.setDate(date.getDate() + days);
  return toDateInputValue(date);
}

export function isPastDate(value: string): boolean {
  return parseDateOnly(value) < parseDateOnly(todayDateInput());
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Unable to read the selected image.'));
    reader.readAsDataURL(file);
  });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
