'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { Label } from '@/components/ui/label';

/**
 * Time Zone Difference Map Component
 * 
 * Displays time zone differences with visual representation.
 * 
 * @see Requirements 30.6
 */

interface TimeZone {
  id: string;
  name: string;
  offset: number; // Hours from UTC
  abbreviation: string;
  city: string;
}

const COMMON_TIMEZONES: TimeZone[] = [
  { id: 'utc', name: 'UTC', offset: 0, abbreviation: 'UTC', city: 'London (Winter)' },
  { id: 'gmt', name: 'GMT', offset: 0, abbreviation: 'GMT', city: 'London' },
  { id: 'est', name: 'Eastern Time', offset: -5, abbreviation: 'EST', city: 'New York' },
  { id: 'cst', name: 'Central Time', offset: -6, abbreviation: 'CST', city: 'Chicago' },
  { id: 'mst', name: 'Mountain Time', offset: -7, abbreviation: 'MST', city: 'Denver' },
  { id: 'pst', name: 'Pacific Time', offset: -8, abbreviation: 'PST', city: 'Los Angeles' },
  { id: 'akst', name: 'Alaska Time', offset: -9, abbreviation: 'AKST', city: 'Anchorage' },
  { id: 'hst', name: 'Hawaii Time', offset: -10, abbreviation: 'HST', city: 'Honolulu' },
  { id: 'cet', name: 'Central European', offset: 1, abbreviation: 'CET', city: 'Paris' },
  { id: 'eet', name: 'Eastern European', offset: 2, abbreviation: 'EET', city: 'Athens' },
  { id: 'msk', name: 'Moscow Time', offset: 3, abbreviation: 'MSK', city: 'Moscow' },
  { id: 'ist', name: 'India Standard', offset: 5.5, abbreviation: 'IST', city: 'Mumbai' },
  { id: 'cst_china', name: 'China Standard', offset: 8, abbreviation: 'CST', city: 'Beijing' },
  { id: 'jst', name: 'Japan Standard', offset: 9, abbreviation: 'JST', city: 'Tokyo' },
  { id: 'aest', name: 'Australian Eastern', offset: 10, abbreviation: 'AEST', city: 'Sydney' },
  { id: 'nzst', name: 'New Zealand', offset: 12, abbreviation: 'NZST', city: 'Auckland' },
];

function formatOffset(offset: number): string {
  const sign = offset >= 0 ? '+' : '';
  const hours = Math.floor(Math.abs(offset));
  const minutes = (Math.abs(offset) % 1) * 60;
  if (minutes === 0) {
    return `UTC${sign}${offset}`;
  }
  return `UTC${sign}${Math.floor(offset)}:${minutes.toString().padStart(2, '0')}`;
}

function getTimeInZone(baseTime: Date, offset: number): Date {
  const utc = baseTime.getTime() + baseTime.getTimezoneOffset() * 60000;
  return new Date(utc + offset * 3600000);
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function getTimeOfDayClass(hour: number): string {
  if (hour >= 6 && hour < 9) return 'bg-yellow-100 text-yellow-800'; // Morning
  if (hour >= 9 && hour < 17) return 'bg-green-100 text-green-800'; // Business hours
  if (hour >= 17 && hour < 21) return 'bg-orange-100 text-orange-800'; // Evening
  return 'bg-gray-200 text-gray-600'; // Night
}

export function TimeZoneDifferenceMap() {
  const [zone1Id, setZone1Id] = React.useState('est');
  const [zone2Id, setZone2Id] = React.useState('cet');
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [selectedTime, setSelectedTime] = React.useState<string>('12:00');

  // Update current time every minute
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const zone1 = COMMON_TIMEZONES.find(z => z.id === zone1Id)!;
  const zone2 = COMMON_TIMEZONES.find(z => z.id === zone2Id)!;
  
  const difference = zone2.offset - zone1.offset;
  const absDifference = Math.abs(difference);
  
  const time1 = getTimeInZone(currentTime, zone1.offset);
  const time2 = getTimeInZone(currentTime, zone2.offset);

  // Calculate time in zone2 when it's selectedTime in zone1
  const [selectedHour, selectedMinute] = selectedTime.split(':').map(Number);
  const selectedDate = new Date(currentTime);
  selectedDate.setHours(selectedHour, selectedMinute, 0, 0);
  
  // Adjust for zone1's offset from local
  const localOffset = currentTime.getTimezoneOffset() / 60;
  const zone1Adjusted = new Date(selectedDate.getTime() + (localOffset + zone1.offset) * 3600000);
  const zone2Adjusted = new Date(zone1Adjusted.getTime() + difference * 3600000);

  return (
    <CalculatorBase
      title="Time Zone Difference Map"
      description="Compare times across different time zones with visual display"
      results={(
        <div className="space-y-6">
          {/* Current time comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${getTimeOfDayClass(time1.getHours())}`}>
              <p className="text-sm font-medium opacity-75">{zone1.city}</p>
              <p className="text-2xl font-bold">{formatTime(time1)}</p>
              <p className="text-sm">{formatDate(time1)}</p>
              <p className="text-xs mt-1">{zone1.abbreviation} ({formatOffset(zone1.offset)})</p>
            </div>
            <div className={`p-4 rounded-lg ${getTimeOfDayClass(time2.getHours())}`}>
              <p className="text-sm font-medium opacity-75">{zone2.city}</p>
              <p className="text-2xl font-bold">{formatTime(time2)}</p>
              <p className="text-sm">{formatDate(time2)}</p>
              <p className="text-xs mt-1">{zone2.abbreviation} ({formatOffset(zone2.offset)})</p>
            </div>
          </div>

          {/* Difference display */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Time Difference</p>
            <p className="text-3xl font-bold text-blue-700">
              {absDifference === 0 ? 'Same time' : (
                <>
                  {absDifference} hour{absDifference !== 1 ? 's' : ''}
                  {difference > 0 ? ' ahead' : ' behind'}
                </>
              )}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              {zone2.city} is {difference >= 0 ? 'ahead of' : 'behind'} {zone1.city}
            </p>
          </div>

          {/* Time converter */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Convert Specific Time</p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="selected-time" className="text-xs">When it&apos;s</Label>
                <input
                  type="time"
                  id="selected-time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md bg-background"
                />
                <p className="text-xs text-muted-foreground mt-1">in {zone1.city}</p>
              </div>
              <div className="text-2xl">→</div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">It will be</p>
                <p className="text-xl font-bold mt-1">{formatTime(zone2Adjusted)}</p>
                <p className="text-xs text-muted-foreground mt-1">in {zone2.city}</p>
              </div>
            </div>
          </div>

          {/* Visual timeline */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">24-Hour Comparison</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs w-20 text-right">{zone1.abbreviation}</span>
                <div className="flex-1 flex">
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i;
                    return (
                      <div
                        key={i}
                        className={`flex-1 h-6 ${getTimeOfDayClass(hour)} border-r border-white/50 flex items-center justify-center`}
                        title={`${hour}:00`}
                      >
                        <span className="text-[8px]">{hour}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-20 text-right">{zone2.abbreviation}</span>
                <div className="flex-1 flex">
                  {Array.from({ length: 24 }, (_, i) => {
                    let hour = (i + difference) % 24;
                    if (hour < 0) hour += 24;
                    return (
                      <div
                        key={i}
                        className={`flex-1 h-6 ${getTimeOfDayClass(hour)} border-r border-white/50 flex items-center justify-center`}
                        title={`${hour}:00`}
                      >
                        <span className="text-[8px]">{hour}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Midnight</span>
              <span>Noon</span>
              <span>Midnight</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
              <span>Night (9pm-6am)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-100 rounded"></div>
              <span>Morning (6am-9am)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 rounded"></div>
              <span>Business (9am-5pm)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-100 rounded"></div>
              <span>Evening (5pm-9pm)</span>
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="zone1">First Time Zone</Label>
          <select
            id="zone1"
            value={zone1Id}
            onChange={(e) => setZone1Id(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md bg-background"
          >
            {COMMON_TIMEZONES.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.city} - {zone.name} ({formatOffset(zone.offset)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="zone2">Second Time Zone</Label>
          <select
            id="zone2"
            value={zone2Id}
            onChange={(e) => setZone2Id(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md bg-background"
          >
            {COMMON_TIMEZONES.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.city} - {zone.name} ({formatOffset(zone.offset)})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm text-muted-foreground">
            ⏰ Times update automatically every minute
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default TimeZoneDifferenceMap;
