/**
 * Timestamp Converter (Unix to human-readable)
 * 
 * @module lib/calculations/productivity/timestamp-converter
 * @see Requirements 9.10
 */

export interface TimestampInputs {
  value: string;
  mode: 'unix-to-date' | 'date-to-unix';
  timezone: string;
}

export interface TimestampResults {
  unix: number;
  unixMs: number;
  iso8601: string;
  utc: string;
  local: string;
  relative: string;
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);
  
  const isFuture = diffMs < 0;
  const abs = (n: number) => Math.abs(n);
  
  let result: string;
  
  if (abs(diffSec) < 60) {
    result = 'just now';
  } else if (abs(diffMin) < 60) {
    result = `${abs(diffMin)} minute${abs(diffMin) !== 1 ? 's' : ''}`;
  } else if (abs(diffHour) < 24) {
    result = `${abs(diffHour)} hour${abs(diffHour) !== 1 ? 's' : ''}`;
  } else if (abs(diffDay) < 7) {
    result = `${abs(diffDay)} day${abs(diffDay) !== 1 ? 's' : ''}`;
  } else if (abs(diffWeek) < 4) {
    result = `${abs(diffWeek)} week${abs(diffWeek) !== 1 ? 's' : ''}`;
  } else if (abs(diffMonth) < 12) {
    result = `${abs(diffMonth)} month${abs(diffMonth) !== 1 ? 's' : ''}`;
  } else {
    result = `${abs(diffYear)} year${abs(diffYear) !== 1 ? 's' : ''}`;
  }
  
  if (result === 'just now') return result;
  return isFuture ? `in ${result}` : `${result} ago`;
}

export function convertTimestamp(inputs: TimestampInputs): TimestampResults {
  const { value, mode } = inputs;
  
  if (!value.trim()) {
    throw new Error('Skriv inn en verdi');
  }

  let date: Date;
  
  if (mode === 'unix-to-date') {
    const timestamp = parseInt(value, 10);
    if (isNaN(timestamp)) {
      throw new Error('Ugyldig Unix-tidsstempel');
    }
    // Detect if milliseconds or seconds
    date = timestamp > 9999999999 ? new Date(timestamp) : new Date(timestamp * 1000);
  } else {
    date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error('Ugyldig datoformat');
    }
  }
  
  const unix = Math.floor(date.getTime() / 1000);
  const unixMs = date.getTime();
  
  return {
    unix,
    unixMs,
    iso8601: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString('nb-NO'),
    relative: getRelativeTime(date),
  };
}

export function getCurrentTimestamp(): TimestampResults {
  return convertTimestamp({ value: Date.now().toString(), mode: 'unix-to-date', timezone: 'local' });
}
