'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { Label } from '@/components/ui/label';

/**
 * Tidsforskjell mellom byer.
 * Bruker IANA-tidssoner via Intl, så sommertid håndteres riktig.
 *
 * @see Requirements 30.6
 */

interface City {
  id: string;
  city: string;
  tz: string; // IANA-tidssone
}

const CITIES: City[] = [
  { id: 'oslo', city: 'Oslo', tz: 'Europe/Oslo' },
  { id: 'reykjavik', city: 'Reykjavik', tz: 'Atlantic/Reykjavik' },
  { id: 'london', city: 'London', tz: 'Europe/London' },
  { id: 'helsinki', city: 'Helsingfors', tz: 'Europe/Helsinki' },
  { id: 'athens', city: 'Athen', tz: 'Europe/Athens' },
  { id: 'istanbul', city: 'Istanbul', tz: 'Europe/Istanbul' },
  { id: 'moscow', city: 'Moskva', tz: 'Europe/Moscow' },
  { id: 'dubai', city: 'Dubai', tz: 'Asia/Dubai' },
  { id: 'mumbai', city: 'Mumbai', tz: 'Asia/Kolkata' },
  { id: 'bangkok', city: 'Bangkok', tz: 'Asia/Bangkok' },
  { id: 'beijing', city: 'Beijing', tz: 'Asia/Shanghai' },
  { id: 'tokyo', city: 'Tokyo', tz: 'Asia/Tokyo' },
  { id: 'sydney', city: 'Sydney', tz: 'Australia/Sydney' },
  { id: 'auckland', city: 'Auckland', tz: 'Pacific/Auckland' },
  { id: 'cape-town', city: 'Cape Town', tz: 'Africa/Johannesburg' },
  { id: 'sao-paulo', city: 'São Paulo', tz: 'America/Sao_Paulo' },
  { id: 'new-york', city: 'New York', tz: 'America/New_York' },
  { id: 'chicago', city: 'Chicago', tz: 'America/Chicago' },
  { id: 'denver', city: 'Denver', tz: 'America/Denver' },
  { id: 'los-angeles', city: 'Los Angeles', tz: 'America/Los_Angeles' },
  { id: 'honolulu', city: 'Honolulu', tz: 'Pacific/Honolulu' },
];

/** Forskjell mot UTC i timer for en tidssone på et gitt tidspunkt. */
function getOffsetHours(tz: string, date: Date): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
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
  return (asUTC - Math.floor(date.getTime() / 1000) * 1000) / 3600000;
}

function formatOffset(offset: number): string {
  const sign = offset >= 0 ? '+' : '−';
  const abs = Math.abs(offset);
  const hours = Math.floor(abs);
  const minutes = Math.round((abs - hours) * 60);
  return minutes === 0 ? `UTC${sign}${hours}` : `UTC${sign}${hours}:${String(minutes).padStart(2, '0')}`;
}

function formatTime(date: Date, tz: string): string {
  return date.toLocaleTimeString('nb-NO', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatDate(date: Date, tz: string): string {
  return date.toLocaleDateString('nb-NO', { timeZone: tz, weekday: 'short', day: 'numeric', month: 'short' });
}

function hourIn(date: Date, tz: string): number {
  return Number(
    new Intl.DateTimeFormat('en-GB', { timeZone: tz, hourCycle: 'h23', hour: '2-digit' }).format(date)
  );
}

function getTimeOfDayClass(hour: number): string {
  if (hour >= 6 && hour < 9) return 'bg-yellow-100 text-yellow-800'; // morgen
  if (hour >= 9 && hour < 17) return 'bg-green-100 text-green-800'; // arbeidstid
  if (hour >= 17 && hour < 21) return 'bg-orange-100 text-orange-800'; // kveld
  return 'bg-gray-200 text-gray-600'; // natt
}

/** Finner tidspunktet (UTC) når klokka er hh:mm i sone tz på dagens dato der. */
function instantFor(tz: string, now: Date, hh: number, mm: number): Date {
  const dayParts = new Intl.DateTimeFormat('en-GB', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const get = (type: string) => Number(dayParts.find((p) => p.type === type)?.value);
  const naive = Date.UTC(get('year'), get('month') - 1, get('day'), hh, mm);
  let guess = new Date(naive - getOffsetHours(tz, new Date(naive)) * 3600000);
  guess = new Date(naive - getOffsetHours(tz, guess) * 3600000);
  return guess;
}

export function TimeZoneDifferenceMap() {
  const [zone1Id, setZone1Id] = React.useState('oslo');
  const [zone2Id, setZone2Id] = React.useState('new-york');
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [selectedTime, setSelectedTime] = React.useState<string>('12:00');

  React.useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const zone1 = CITIES.find((z) => z.id === zone1Id)!;
  const zone2 = CITIES.find((z) => z.id === zone2Id)!;

  const offset1 = getOffsetHours(zone1.tz, currentTime);
  const offset2 = getOffsetHours(zone2.tz, currentTime);
  const difference = offset2 - offset1;
  const absDifference = Math.abs(difference);
  const differenceText = `${absDifference.toLocaleString('nb-NO', { maximumFractionDigits: 2 })} ${absDifference === 1 ? 'time' : 'timer'}`;

  const [selectedHour, selectedMinute] = selectedTime.split(':').map(Number);
  const converted = instantFor(zone1.tz, currentTime, selectedHour || 0, selectedMinute || 0);

  return (
    <CalculatorBase
      title="Tidsforskjell mellom byer"
      description="Sammenlign klokkeslett i ulike tidssoner"
      results={(
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { z: zone1, offset: offset1 },
              { z: zone2, offset: offset2 },
            ].map(({ z, offset }) => (
              <div key={z.id} className={`p-4 rounded-lg ${getTimeOfDayClass(hourIn(currentTime, z.tz))}`}>
                <p className="text-sm font-medium opacity-75">{z.city}</p>
                <p className="text-2xl font-bold">{formatTime(currentTime, z.tz)}</p>
                <p className="text-sm">{formatDate(currentTime, z.tz)}</p>
                <p className="text-xs mt-1">{formatOffset(offset)}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Tidsforskjell</p>
            <p className="text-3xl font-bold text-blue-700">
              {absDifference === 0 ? 'Samme tid' : `${differenceText} ${difference > 0 ? 'foran' : 'bak'}`}
            </p>
            {absDifference !== 0 && (
              <p className="text-sm text-blue-600 mt-1">
                {zone2.city} er {difference > 0 ? 'foran' : 'bak'} {zone1.city}
              </p>
            )}
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Regn om et bestemt klokkeslett</p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="selected-time" className="text-xs">Når klokka er</Label>
                <input
                  type="time"
                  id="selected-time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md bg-background"
                />
                <p className="text-xs text-muted-foreground mt-1">i {zone1.city}</p>
              </div>
              <div className="text-2xl">→</div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">er den</p>
                <p className="text-xl font-bold mt-1">{formatTime(converted, zone2.tz)}</p>
                <p className="text-xs text-muted-foreground mt-1">i {zone2.city} ({formatDate(converted, zone2.tz)})</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Sammenligning over 24 timer</p>
            <div className="space-y-2">
              {[
                { z: zone1, shift: 0 },
                { z: zone2, shift: Math.floor(difference) },
              ].map(({ z, shift }) => (
                <div key={z.id} className="flex items-center gap-2">
                  <span className="text-xs w-20 text-right">{z.city}</span>
                  <div className="flex-1 flex">
                    {Array.from({ length: 24 }, (_, i) => {
                      let hour = (i + shift) % 24;
                      if (hour < 0) hour += 24;
                      return (
                        <div
                          key={i}
                          className={`flex-1 h-6 ${getTimeOfDayClass(hour)} border-r border-white/50 flex items-center justify-center`}
                          title={`${String(hour).padStart(2, '0')}:00`}
                        >
                          <span className="text-[8px]">{hour}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Midnatt</span>
              <span>Middag</span>
              <span>Midnatt</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
              <span>Natt (21–06)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-100 rounded"></div>
              <span>Morgen (06–09)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 rounded"></div>
              <span>Arbeidstid (09–17)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-100 rounded"></div>
              <span>Kveld (17–21)</span>
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="zone1">Første by</Label>
          <select
            id="zone1"
            value={zone1Id}
            onChange={(e) => setZone1Id(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md bg-background"
          >
            {CITIES.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.city} ({formatOffset(getOffsetHours(zone.tz, currentTime))})
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="zone2">Andre by</Label>
          <select
            id="zone2"
            value={zone2Id}
            onChange={(e) => setZone2Id(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md bg-background"
          >
            {CITIES.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.city} ({formatOffset(getOffsetHours(zone.tz, currentTime))})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm text-muted-foreground">
            ⏰ Klokkeslettene oppdateres hvert minutt. Sommertid er tatt hensyn til.
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default TimeZoneDifferenceMap;
