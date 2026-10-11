import { LiveEvent } from 'store/live';
import { rangeBoundsMs } from 'store/reports';

export const LIVE_DATE_INTERVAL_LS_KEY = 'live.dateInterval';

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;
const today = new Date().setHours(0, 0, 0, 0);
const todayEnd = new Date().setHours(23, 59, 59, 999);
const week = 1000 * 60 * 60 * 24 * 7;

export const lastWeekInterval = [
  new Date(today - week).toLocaleDateString('sv-SE'),
  new Date(todayEnd).toLocaleDateString('sv-SE'),
];

export function readLiveDateInterval(stored: unknown): string[] {
  if (!Array.isArray(stored) || stored.length < 2) return lastWeekInterval;

  const [start, end] = stored;
  if (typeof start !== 'string' || typeof end !== 'string') {
    return lastWeekInterval;
  }
  if (!DATE_ONLY_RE.test(start) || !DATE_ONLY_RE.test(end)) {
    return lastWeekInterval;
  }

  return start <= end ? [start, end] : [end, start];
}

export function eventsInRange(
  fetched: LiveEvent[],
  live: LiveEvent[],
  startDate: string,
  endDate: string,
): LiveEvent[] {
  const { start, end } = rangeBoundsMs(startDate, endDate);
  if (Number.isNaN(start) || Number.isNaN(end)) return [];

  const byId = new Map<string, LiveEvent>();

  const add = (event: LiveEvent) => {
    const ts = new Date(event.time).getTime();
    if (Number.isNaN(ts) || ts < start || ts > end) return;
    byId.set(event.id, event);
  };

  fetched.forEach(add);
  live.forEach(add);

  return [...byId.values()].sort((a, b) => (a.time < b.time ? 1 : -1));
}
