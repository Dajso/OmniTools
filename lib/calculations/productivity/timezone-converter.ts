/**
 * Tidssoneomregner.
 * Klokkeslettet tolkes som veggklokke i «fra»-sonen (ikke i nettleserens sone),
 * og vises med 24-timersklokke i «til»-sonen.
 *
 * @module lib/calculations/productivity/timezone-converter
 */

export interface TimezoneInputs {
  /** Format `YYYY-MM-DDTHH:mm` (som datetime-local) */
  dateTime: string;
  fromTimezone: string;
  toTimezone: string;
}

export interface TimezoneResults {
  fromTime: string;
  toTime: string;
  fromTimezone: string;
  toTimezone: string;
  offset: string;
  /** Om sommertid er i bruk i «til»-sonen på det aktuelle tidspunktet */
  isDST: boolean;
}

export const COMMON_TIMEZONES = [
  { value: 'Europe/Oslo', label: 'Norge (CET/CEST)' },
  { value: 'UTC', label: 'UTC (koordinert universaltid)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Atlantic/Reykjavik', label: 'Reykjavik (GMT)' },
  { value: 'Europe/Helsinki', label: 'Helsinki (EET/EEST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Europe/Istanbul', label: 'Istanbul (TRT)' },
  { value: 'America/New_York', label: 'New York / østkysten (ET)' },
  { value: 'America/Chicago', label: 'Chicago (CT)' },
  { value: 'America/Denver', label: 'Denver (MT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles / vestkysten (PT)' },
  { value: 'America/Anchorage', label: 'Alaska (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii (HST)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Asia/Bangkok', label: 'Bangkok (ICT)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Hong_Kong', label: 'Hongkong (HKT)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Australia/Perth', label: 'Perth (AWST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)' },
];

/** Forskjellen (i minutter) mellom sonens veggklokke og UTC på et gitt tidspunkt */
function zoneOffsetMinutes(timeZone: string, instant: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(instant);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return Math.round((asUtc - Math.floor(instant.getTime() / 1000) * 1000) / 60000);
}

/** Gjør om veggklokke i en sone til et faktisk tidspunkt */
function wallTimeToInstant(dateTime: string, timeZone: string): Date | null {
  const m = dateTime.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  const [y, mo, d, h, mi, s] = [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4]), Number(m[5]), Number(m[6] ?? 0)];
  const guess = Date.UTC(y, mo - 1, d, h, mi, s);
  let instant = new Date(guess - zoneOffsetMinutes(timeZone, new Date(guess)) * 60000);
  // Andre gjennomløp håndterer datoer nær sommertidsskifte
  instant = new Date(guess - zoneOffsetMinutes(timeZone, instant) * 60000);
  return isNaN(instant.getTime()) ? null : instant;
}

function formatOffset(minutes: number): string {
  const sign = minutes < 0 ? '−' : '+';
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? ':' + String(m).padStart(2, '0') : ''}`;
}

function formatWall(instant: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('nb-NO', {
    timeZone,
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).format(instant);
}

function isDaylightSaving(timeZone: string, instant: Date): boolean {
  const year = instant.getUTCFullYear();
  const jan = zoneOffsetMinutes(timeZone, new Date(Date.UTC(year, 0, 1)));
  const jul = zoneOffsetMinutes(timeZone, new Date(Date.UTC(year, 6, 1)));
  if (jan === jul) return false;
  return zoneOffsetMinutes(timeZone, instant) === Math.max(jan, jul);
}

export function convertTimezone(inputs: TimezoneInputs): TimezoneResults {
  const { dateTime, fromTimezone, toTimezone } = inputs;

  if (!dateTime) {
    throw new Error('Skriv inn dato og klokkeslett');
  }

  const instant = wallTimeToInstant(dateTime, fromTimezone);
  if (!instant) {
    throw new Error('Ugyldig datoformat');
  }

  const fromOffset = zoneOffsetMinutes(fromTimezone, instant);
  const toOffset = zoneOffsetMinutes(toTimezone, instant);
  const diffH = (toOffset - fromOffset) / 60;
  const diffText = diffH === 0
    ? 'Ingen tidsforskjell'
    : `${toTimezone.split('/').pop()?.replace(/_/g, ' ')} er ${String(Math.abs(diffH)).replace('.', ',')} t ${diffH > 0 ? 'foran' : 'bak'}`;

  return {
    fromTime: formatWall(instant, fromTimezone),
    toTime: formatWall(instant, toTimezone),
    fromTimezone: `${fromTimezone} (${formatOffset(fromOffset)})`,
    toTimezone: `${toTimezone} (${formatOffset(toOffset)})`,
    offset: `${formatOffset(fromOffset)} → ${formatOffset(toOffset)} (${diffText})`,
    isDST: isDaylightSaving(toTimezone, instant),
  };
}
