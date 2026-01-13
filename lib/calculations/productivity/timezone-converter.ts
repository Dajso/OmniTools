/**
 * Time Zone Converter
 * 
 * @module lib/calculations/productivity/timezone-converter
 * @see Requirements 9.14
 */

export interface TimezoneInputs {
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
  isDST: boolean;
}

export const COMMON_TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  { value: 'Australia/Perth', label: 'Perth (AWST)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)' },
];

export function convertTimezone(inputs: TimezoneInputs): TimezoneResults {
  const { dateTime, fromTimezone, toTimezone } = inputs;
  
  if (!dateTime) {
    throw new Error('Please enter a date and time');
  }

  // Parse the input date
  const inputDate = new Date(dateTime);
  if (isNaN(inputDate.getTime())) {
    throw new Error('Invalid date format');
  }

  // Format in source timezone
  const fromFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: fromTimezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  // Format in target timezone
  const toFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: toTimezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  // Get timezone offset
  const getOffset = (tz: string) => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(inputDate);
    const offsetPart = parts.find(p => p.type === 'timeZoneName');
    return offsetPart?.value || '';
  };

  const fromOffset = getOffset(fromTimezone);
  const toOffset = getOffset(toTimezone);

  // Check if DST is in effect
  const isDST = (() => {
    const jan = new Date(inputDate.getFullYear(), 0, 1);
    const jul = new Date(inputDate.getFullYear(), 6, 1);
    const janOffset = jan.getTimezoneOffset();
    const julOffset = jul.getTimezoneOffset();
    const currentOffset = inputDate.getTimezoneOffset();
    return currentOffset < Math.max(janOffset, julOffset);
  })();

  return {
    fromTime: fromFormatter.format(inputDate),
    toTime: toFormatter.format(inputDate),
    fromTimezone: `${fromTimezone} (${fromOffset})`,
    toTimezone: `${toTimezone} (${toOffset})`,
    offset: `${fromOffset} → ${toOffset}`,
    isDST,
  };
}
