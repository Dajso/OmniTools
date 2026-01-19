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
 * Common time zones for travel and business
 */
export const COMMON_TIMEZONES: TimeZone[] = [
  { id: 'UTC', name: 'Coordinated Universal Time', abbreviation: 'UTC', offset: 0, city: 'UTC' },
  { id: 'America/New_York', name: 'Eastern Time', abbreviation: 'ET', offset: -5, city: 'New York' },
  { id: 'America/Chicago', name: 'Central Time', abbreviation: 'CT', offset: -6, city: 'Chicago' },
  { id: 'America/Denver', name: 'Mountain Time', abbreviation: 'MT', offset: -7, city: 'Denver' },
  { id: 'America/Los_Angeles', name: 'Pacific Time', abbreviation: 'PT', offset: -8, city: 'Los Angeles' },
  { id: 'America/Anchorage', name: 'Alaska Time', abbreviation: 'AKT', offset: -9, city: 'Anchorage' },
  { id: 'Pacific/Honolulu', name: 'Hawaii Time', abbreviation: 'HST', offset: -10, city: 'Honolulu' },
  { id: 'Europe/London', name: 'Greenwich Mean Time', abbreviation: 'GMT', offset: 0, city: 'London' },
  { id: 'Europe/Paris', name: 'Central European Time', abbreviation: 'CET', offset: 1, city: 'Paris' },
  { id: 'Europe/Berlin', name: 'Central European Time', abbreviation: 'CET', offset: 1, city: 'Berlin' },
  { id: 'Europe/Moscow', name: 'Moscow Time', abbreviation: 'MSK', offset: 3, city: 'Moscow' },
  { id: 'Asia/Dubai', name: 'Gulf Standard Time', abbreviation: 'GST', offset: 4, city: 'Dubai' },
  { id: 'Asia/Kolkata', name: 'India Standard Time', abbreviation: 'IST', offset: 5.5, city: 'Mumbai' },
  { id: 'Asia/Bangkok', name: 'Indochina Time', abbreviation: 'ICT', offset: 7, city: 'Bangkok' },
  { id: 'Asia/Singapore', name: 'Singapore Time', abbreviation: 'SGT', offset: 8, city: 'Singapore' },
  { id: 'Asia/Hong_Kong', name: 'Hong Kong Time', abbreviation: 'HKT', offset: 8, city: 'Hong Kong' },
  { id: 'Asia/Shanghai', name: 'China Standard Time', abbreviation: 'CST', offset: 8, city: 'Shanghai' },
  { id: 'Asia/Tokyo', name: 'Japan Standard Time', abbreviation: 'JST', offset: 9, city: 'Tokyo' },
  { id: 'Asia/Seoul', name: 'Korea Standard Time', abbreviation: 'KST', offset: 9, city: 'Seoul' },
  { id: 'Australia/Sydney', name: 'Australian Eastern Time', abbreviation: 'AET', offset: 10, city: 'Sydney' },
  { id: 'Pacific/Auckland', name: 'New Zealand Time', abbreviation: 'NZST', offset: 12, city: 'Auckland' },
  { id: 'America/Sao_Paulo', name: 'Brasilia Time', abbreviation: 'BRT', offset: -3, city: 'São Paulo' },
  { id: 'America/Mexico_City', name: 'Central Time', abbreviation: 'CST', offset: -6, city: 'Mexico City' },
  { id: 'America/Toronto', name: 'Eastern Time', abbreviation: 'ET', offset: -5, city: 'Toronto' },
  { id: 'Europe/Amsterdam', name: 'Central European Time', abbreviation: 'CET', offset: 1, city: 'Amsterdam' },
];

/**
 * Default business hours (9 AM to 6 PM)
 */
export const DEFAULT_BUSINESS_HOURS: TimeSlot = {
  startHour: 9,
  endHour: 18,
};

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
 * Checks if a time is overnight (before 6 AM or after 10 PM)
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
export function formatTime(time: MeetingTime, use24Hour: boolean = false): string {
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

  throw new Error(`Invalid time format: ${timeStr}`);
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
  const sign = hours >= 0 ? '+' : '';
  if (hours === Math.floor(hours)) {
    return `${sign}${hours}h`;
  }
  const wholeHours = Math.floor(Math.abs(hours));
  const minutes = Math.round((Math.abs(hours) - wholeHours) * 60);
  const signStr = hours >= 0 ? '+' : '-';
  return `${signStr}${wholeHours}h ${minutes}m`;
}
