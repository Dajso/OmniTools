/**
 * Time Zone Meeting Planner
 * Helps find optimal meeting times across multiple time zones
 * 
 * Features:
 * - Convert times between time zones
 * - Find overlapping business hours
 * - Suggest optimal meeting times
 * - Visual slider interface support
 * 
 * @module lib/calculations/travel/timezone-planner
 * @see Requirements 16.2, 16.11
 */

export interface TimeZone {
  id: string;
  name: string;
  abbreviation: string;
  offset: number; // UTC offset in hours
  city: string;
}

export interface MeetingTime {
  hour: number; // 0-23
  minute: number; // 0-59
}

export interface TimeSlot {
  startHour: number;
  endHour: number;
}

export interface ZoneTime {
  zone: TimeZone;
  time: MeetingTime;
  isBusinessHours: boolean;
  isOvernight: boolean;
}

export interface MeetingPlanResult {
  baseTime: MeetingTime;
  baseZone: TimeZone;
  zoneTimes: ZoneTime[];
  allInBusinessHours: boolean;
  overlappingHours: TimeSlot[];
}

/**
 * Vanlige tidssoner for reise og jobb.
 * `offset` er normaltid (vintertid) og brukes bare som reserve.
 * Bruk `zonesForDate` for å få riktig forskyvning med sommertid på en gitt dato.
 */
export const COMMON_TIMEZONES: TimeZone[] = [
  { id: 'Europe/Oslo', name: 'Sentraleuropeisk tid', abbreviation: 'UTC+1', offset: 1, city: 'Oslo' },
  { id: 'UTC', name: 'Koordinert universaltid', abbreviation: 'UTC', offset: 0, city: 'UTC' },
  { id: 'Europe/London', name: 'Greenwich-tid', abbreviation: 'UTC', offset: 0, city: 'London' },
  { id: 'Europe/Paris', name: 'Sentraleuropeisk tid', abbreviation: 'UTC+1', offset: 1, city: 'Paris' },
  { id: 'Europe/Berlin', name: 'Sentraleuropeisk tid', abbreviation: 'UTC+1', offset: 1, city: 'Berlin' },
  { id: 'Europe/Amsterdam', name: 'Sentraleuropeisk tid', abbreviation: 'UTC+1', offset: 1, city: 'Amsterdam' },
  { id: 'Europe/Helsinki', name: 'Østeuropeisk tid', abbreviation: 'UTC+2', offset: 2, city: 'Helsinki' },
  { id: 'Europe/Istanbul', name: 'Tyrkisk tid', abbreviation: 'UTC+3', offset: 3, city: 'Istanbul' },
  { id: 'Europe/Moscow', name: 'Moskva-tid', abbreviation: 'UTC+3', offset: 3, city: 'Moskva' },
  { id: 'Asia/Dubai', name: 'Golf-tid', abbreviation: 'UTC+4', offset: 4, city: 'Dubai' },
  { id: 'Asia/Kolkata', name: 'Indisk tid', abbreviation: 'UTC+5:30', offset: 5.5, city: 'Mumbai' },
  { id: 'Asia/Bangkok', name: 'Indokina-tid', abbreviation: 'UTC+7', offset: 7, city: 'Bangkok' },
  { id: 'Asia/Singapore', name: 'Singapore-tid', abbreviation: 'UTC+8', offset: 8, city: 'Singapore' },
  { id: 'Asia/Hong_Kong', name: 'Hongkong-tid', abbreviation: 'UTC+8', offset: 8, city: 'Hongkong' },
  { id: 'Asia/Shanghai', name: 'Kinesisk tid', abbreviation: 'UTC+8', offset: 8, city: 'Shanghai' },
  { id: 'Asia/Tokyo', name: 'Japansk tid', abbreviation: 'UTC+9', offset: 9, city: 'Tokyo' },
  { id: 'Asia/Seoul', name: 'Koreansk tid', abbreviation: 'UTC+9', offset: 9, city: 'Seoul' },
  { id: 'Australia/Sydney', name: 'Østlig australsk tid', abbreviation: 'UTC+10', offset: 10, city: 'Sydney' },
  { id: 'Pacific/Auckland', name: 'New Zealand-tid', abbreviation: 'UTC+12', offset: 12, city: 'Auckland' },
  { id: 'America/Sao_Paulo', name: 'Brasília-tid', abbreviation: 'UTC-3', offset: -3, city: 'São Paulo' },
  { id: 'America/New_York', name: 'Østkysten (USA)', abbreviation: 'UTC-5', offset: -5, city: 'New York' },
  { id: 'America/Toronto', name: 'Østlig tid (Canada)', abbreviation: 'UTC-5', offset: -5, city: 'Toronto' },
  { id: 'America/Chicago', name: 'Sentral tid (USA)', abbreviation: 'UTC-6', offset: -6, city: 'Chicago' },
  { id: 'America/Mexico_City', name: 'Sentral tid (Mexico)', abbreviation: 'UTC-6', offset: -6, city: 'Mexico by' },
  { id: 'America/Denver', name: 'Fjelltid (USA)', abbreviation: 'UTC-7', offset: -7, city: 'Denver' },
  { id: 'America/Los_Angeles', name: 'Vestkysten (USA)', abbreviation: 'UTC-8', offset: -8, city: 'Los Angeles' },
  { id: 'America/Anchorage', name: 'Alaska-tid', abbreviation: 'UTC-9', offset: -9, city: 'Anchorage' },
  { id: 'Pacific/Honolulu', name: 'Hawaii-tid', abbreviation: 'UTC-10', offset: -10, city: 'Honolulu' },
];

/**
 * Vanlig arbeidstid i Norge: 08:00 til 16:00
 */
export const DEFAULT_BUSINESS_HOURS: TimeSlot = {
  startHour: 8,
  endHour: 16,
};

/** Skriver en forskyvning som «UTC+2» eller «UTC+5:30». */
export function formatUtcOffset(offsetHours: number): string {
  if (offsetHours === 0) return 'UTC';
  const sign = offsetHours > 0 ? '+' : '-';
  const abs = Math.abs(offsetHours);
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  return `UTC${sign}${h}${m ? ':' + String(m).padStart(2, '0') : ''}`;
}

/**
 * Forskyvning mot UTC i timer for en IANA-tidssone på et gitt tidspunkt (tar med sommertid).
 * Faller tilbake til normaltid hvis nettleseren ikke støtter tidssonen.
 */
export function getUtcOffsetHours(zone: TimeZone, date: Date = new Date()): number {
  if (zone.id === 'UTC') return 0;
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: zone.id,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).formatToParts(date);
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
    const asUTC = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
    const offset = (asUTC - Math.floor(date.getTime() / 1000) * 1000) / 3600000;
    return Number.isFinite(offset) ? offset : zone.offset;
  } catch {
    return zone.offset;
  }
}

/** Gir tidssonene med riktig forskyvning (sommertid) for en gitt dato. */
export function zonesForDate(zones: TimeZone[], date: Date = new Date()): TimeZone[] {
  return zones.map((zone) => {
    const offset = getUtcOffsetHours(zone, date);
    return { ...zone, offset, abbreviation: formatUtcOffset(offset) };
  });
}

/**
 * Converts a time from one timezone to another
 * 
 * @param time - The time to convert
 * @param fromZone - Source timezone
 * @param toZone - Target timezone
 * @returns Converted time in target timezone
 */
export function convertTime(
  time: MeetingTime,
  fromZone: TimeZone,
  toZone: TimeZone
): MeetingTime {
  // Convert to UTC first
  const totalMinutes = time.hour * 60 + time.minute;
  const utcMinutes = totalMinutes - (fromZone.offset * 60);
  
  // Convert from UTC to target timezone
  let targetMinutes = utcMinutes + (toZone.offset * 60);
  
  // Handle day wraparound
  while (targetMinutes < 0) {
    targetMinutes += 24 * 60;
  }
  while (targetMinutes >= 24 * 60) {
    targetMinutes -= 24 * 60;
  }
  
  return {
    hour: Math.floor(targetMinutes / 60),
    minute: targetMinutes % 60,
  };
}

/**
 * Checks if a time falls within business hours
 * 
 * @param time - The time to check
 * @param businessHours - Business hours definition
 * @returns True if time is within business hours
 */
export function isBusinessHours(
  time: MeetingTime,
  businessHours: TimeSlot = DEFAULT_BUSINESS_HOURS
): boolean {
  const hour = time.hour;
  return hour >= businessHours.startHour && hour < businessHours.endHour;
}

/**
 * Sjekker om klokkeslettet er natt (før 06:00 eller etter 22:00)
 * 
 * @param time - The time to check
 * @returns True if time is overnight
 */
export function isOvernight(time: MeetingTime): boolean {
  return time.hour < 6 || time.hour >= 22;
}

/**
 * Plans a meeting across multiple time zones
 * 
 * @param baseTime - The proposed meeting time
 * @param baseZone - The timezone of the proposed time
 * @param targetZones - Array of timezones to include
 * @param businessHours - Optional custom business hours
 * @returns MeetingPlanResult with times in all zones
 */
export function planMeeting(
  baseTime: MeetingTime,
  baseZone: TimeZone,
  targetZones: TimeZone[],
  businessHours: TimeSlot = DEFAULT_BUSINESS_HOURS
): MeetingPlanResult {
  const zoneTimes: ZoneTime[] = targetZones.map(zone => {
    const convertedTime = convertTime(baseTime, baseZone, zone);
    return {
      zone,
      time: convertedTime,
      isBusinessHours: isBusinessHours(convertedTime, businessHours),
      isOvernight: isOvernight(convertedTime),
    };
  });

  const allInBusinessHours = zoneTimes.every(zt => zt.isBusinessHours);
  const overlappingHours = findOverlappingBusinessHours(targetZones, businessHours);

  return {
    baseTime,
    baseZone,
    zoneTimes,
    allInBusinessHours,
    overlappingHours,
  };
}

/**
 * Finds overlapping business hours across multiple time zones
 * Returns hours in UTC that are business hours in all zones
 * 
 * @param zones - Array of timezones to check
 * @param businessHours - Business hours definition
 * @returns Array of overlapping time slots in UTC
 */
export function findOverlappingBusinessHours(
  zones: TimeZone[],
  businessHours: TimeSlot = DEFAULT_BUSINESS_HOURS
): TimeSlot[] {
  if (zones.length === 0) {
    return [];
  }

  // For each hour of the day (in UTC), check if it's business hours in all zones
  const overlappingHours: number[] = [];

  for (let utcHour = 0; utcHour < 24; utcHour++) {
    const isBusinessInAllZones = zones.every(zone => {
      // Convert UTC hour to local hour
      let localHour = utcHour + zone.offset;
      
      // Handle day wraparound
      while (localHour < 0) localHour += 24;
      while (localHour >= 24) localHour -= 24;
      
      return localHour >= businessHours.startHour && localHour < businessHours.endHour;
    });

    if (isBusinessInAllZones) {
      overlappingHours.push(utcHour);
    }
  }

  // Convert consecutive hours into time slots
  return hoursToSlots(overlappingHours);
}

/**
 * Converts an array of hours into time slots
 */
function hoursToSlots(hours: number[]): TimeSlot[] {
  if (hours.length === 0) {
    return [];
  }

  const slots: TimeSlot[] = [];
  let startHour = hours[0];
  let endHour = hours[0] + 1;

  for (let i = 1; i < hours.length; i++) {
    if (hours[i] === endHour) {
      endHour = hours[i] + 1;
    } else {
      slots.push({ startHour, endHour });
      startHour = hours[i];
      endHour = hours[i] + 1;
    }
  }

  slots.push({ startHour, endHour });
  return slots;
}

/**
 * Suggests optimal meeting times for a group of time zones
 * 
 * @param zones - Array of timezones to include
 * @param businessHours - Business hours definition
 * @returns Array of suggested meeting times in UTC
 */
export function suggestMeetingTimes(
  zones: TimeZone[],
  businessHours: TimeSlot = DEFAULT_BUSINESS_HOURS
): MeetingTime[] {
  const overlappingSlots = findOverlappingBusinessHours(zones, businessHours);
  
  if (overlappingSlots.length === 0) {
    // No overlapping business hours, suggest middle of the day for the first zone
    return [{ hour: 12, minute: 0 }];
  }

  // Suggest the middle of each overlapping slot
  return overlappingSlots.map(slot => ({
    hour: Math.floor((slot.startHour + slot.endHour) / 2),
    minute: 0,
  }));
}

/**
 * Formats a time for display
 * 
 * @param time - The time to format
 * @param use24Hour - Whether to use 24-hour format
 * @returns Formatted time string
 */
export function formatTime(time: MeetingTime, use24Hour: boolean = true): string {
  if (use24Hour) {
    return `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
  }

  const hour12 = time.hour % 12 || 12;
  const ampm = time.hour < 12 ? 'AM' : 'PM';
  return `${hour12}:${time.minute.toString().padStart(2, '0')} ${ampm}`;
}

/**
 * Parses a time string into MeetingTime
 * 
 * @param timeStr - Time string (e.g., "14:30" or "2:30 PM")
 * @returns Parsed MeetingTime
 */
export function parseTime(timeStr: string): MeetingTime {
  // Try 24-hour format first
  const match24 = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    return {
      hour: parseInt(match24[1], 10),
      minute: parseInt(match24[2], 10),
    };
  }

  // Try 12-hour format
  const match12 = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12) {
    let hour = parseInt(match12[1], 10);
    const minute = parseInt(match12[2], 10);
    const isPM = match12[3].toUpperCase() === 'PM';

    if (isPM && hour !== 12) {
      hour += 12;
    } else if (!isPM && hour === 12) {
      hour = 0;
    }

    return { hour, minute };
  }

  throw new Error(`Ugyldig klokkeslett: ${timeStr}`);
}

/**
 * Gets timezone by ID
 */
export function getTimezoneById(id: string): TimeZone | undefined {
  return COMMON_TIMEZONES.find(tz => tz.id === id);
}

/**
 * Gets timezone by city name
 */
export function getTimezoneByCity(city: string): TimeZone | undefined {
  return COMMON_TIMEZONES.find(
    tz => tz.city.toLowerCase() === city.toLowerCase()
  );
}

/**
 * Calculates the time difference between two zones in hours
 */
export function getTimeDifference(zone1: TimeZone, zone2: TimeZone): number {
  return zone2.offset - zone1.offset;
}

/**
 * Formats a time difference for display
 */
export function formatTimeDifference(hours: number): string {
  const sign = hours >= 0 ? '+' : '−';
  if (hours === Math.floor(hours)) {
    return `${sign}${Math.abs(hours)} t`;
  }
  const wholeHours = Math.floor(Math.abs(hours));
  const minutes = Math.round((Math.abs(hours) - wholeHours) * 60);
  return `${sign}${wholeHours} t ${minutes} min`;
}
