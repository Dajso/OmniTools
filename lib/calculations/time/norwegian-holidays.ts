/**
 * Norske helligdager og offentlige fridager.
 * Dagene er faste eller bestemt av første påskedag (påskedag beregnes med den gregorianske algoritmen).
 * Julaften og nyttårsaften er ikke offisielle fridager, men mange har fri.
 *
 * @module lib/calculations/time/norwegian-holidays
 */

export interface NorwegianHoliday {
  date: Date;
  name: string;
}

/** Første påskedag (påskesøndag) i gitt år. */
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indeksert
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Alle norske helligdager i et år, sortert etter dato. */
export function getNorwegianHolidays(year: number): NorwegianHoliday[] {
  const easter = easterSunday(year);
  const list: NorwegianHoliday[] = [
    { date: new Date(year, 0, 1), name: 'Første nyttårsdag' },
    { date: addDays(easter, -3), name: 'Skjærtorsdag' },
    { date: addDays(easter, -2), name: 'Langfredag' },
    { date: easter, name: 'Første påskedag' },
    { date: addDays(easter, 1), name: 'Andre påskedag' },
    { date: new Date(year, 4, 1), name: 'Arbeidernes dag' },
    { date: new Date(year, 4, 17), name: 'Grunnlovsdagen' },
    { date: addDays(easter, 39), name: 'Kristi himmelfartsdag' },
    { date: addDays(easter, 49), name: 'Første pinsedag' },
    { date: addDays(easter, 50), name: 'Andre pinsedag' },
    { date: new Date(year, 11, 25), name: 'Første juledag' },
    { date: new Date(year, 11, 26), name: 'Andre juledag' },
  ];
  return list.sort((x, y) => x.date.getTime() - y.date.getTime());
}

/** Navnet på helligdagen hvis datoen er en, ellers undefined. */
export function getNorwegianHolidayName(date: Date): string | undefined {
  return getNorwegianHolidays(date.getFullYear()).find(
    (h) =>
      h.date.getFullYear() === date.getFullYear() &&
      h.date.getMonth() === date.getMonth() &&
      h.date.getDate() === date.getDate()
  )?.name;
}
