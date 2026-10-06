// Eat By dates are stored as local calendar days ("YYYY-MM-DD"), never via toISOString(),
// which would shift the day in non-UTC timezones.

const pad = (n: number) => String(n).padStart(2, '0');

export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key: string, days: number): string {
  const d = parseDateKey(key);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

// Whole calendar days from `from` to `key` (negative = past). UTC math avoids DST off-by-one.
export function daysUntil(key: string, from: string = todayKey()): number {
  const utc = (k: string) => {
    const [y, m, d] = k.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((utc(key) - utc(from)) / 86_400_000);
}

export type EatByGroup = 'today' | 'soon' | 'later';

export function eatByGroup(days: number): EatByGroup {
  if (days <= 0) return 'today';
  if (days <= 5) return 'soon';
  return 'later';
}

export function relativeLabel(days: number): string {
  if (days < 0) return `${-days} ${-days === 1 ? 'day' : 'days'} past Eat By`;
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `${days} days`;
}

export function formatDateKey(key: string): string {
  return parseDateKey(key).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

export function formatTimestamp(iso: string): string {
  return formatDateKey(toDateKey(new Date(iso)));
}
