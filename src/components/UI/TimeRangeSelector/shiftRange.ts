const DATE_ONLY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export type ShiftUnit = 'week' | 'month';

function parse(date: string) {
  const m = DATE_ONLY_RE.exec(date);
  if (!m) return null;
  return { y: Number(m[1]), mo: Number(m[2]) - 1, d: Number(m[3]) };
}

function format(ts: number) {
  return new Date(ts).toISOString().slice(0, 10);
}

function daysInMonth(y: number, mo: number) {
  return new Date(Date.UTC(y, mo + 1, 0)).getUTCDate();
}

function shiftDate(date: string, unit: ShiftUnit, step: number) {
  const p = parse(date);
  if (!p) return date;

  if (unit === 'week') {
    return format(Date.UTC(p.y, p.mo, p.d + 7 * step));
  }

  // Calendar month shift. The last day of a month stays the last day of
  // the target month (Nov 30 -> Dec 31), other days are clamped (Mar 31 -> Feb 28).
  const isMonthEnd = p.d === daysInMonth(p.y, p.mo);
  const target = new Date(Date.UTC(p.y, p.mo + step, 1));
  const ty = target.getUTCFullYear();
  const tm = target.getUTCMonth();
  const max = daysInMonth(ty, tm);
  const day = isMonthEnd ? max : Math.min(p.d, max);

  return format(Date.UTC(ty, tm, day));
}

/** Shifts a [start, end] YYYY-MM-DD range by `step` weeks or months. */
export function shiftRange(
  [start, end]: string[],
  unit: ShiftUnit,
  step: number,
): string[] {
  return [shiftDate(start, unit, step), shiftDate(end, unit, step)];
}
