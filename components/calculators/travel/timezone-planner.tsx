'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  COMMON_TIMEZONES,
  planMeeting,
  formatTime,
  formatTimeDifference,
  getTimeDifference,
  type TimeZone,
  type MeetingPlanResult 
} from '@/lib/calculations/travel/timezone-planner';
import { Plus, Trash2, Clock, Sun, Moon, Check, X } from 'lucide-react';

export function TimezonePlanner() {
  const [baseZone, setBaseZone] = React.useState<TimeZone>(COMMON_TIMEZONES[1]); // New York
  const [selectedZones, setSelectedZones] = React.useState<TimeZone[]>([
    COMMON_TIMEZONES[7], // London
    COMMON_TIMEZONES[17], // Tokyo
  ]);
  const [selectedHour, setSelectedHour] = React.useState<number>(10);
  const [results, setResults] = React.useState<MeetingPlanResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const addZone = (zoneId: string) => {
    const zone = COMMON_TIMEZONES.find(z => z.id === zoneId);
    if (zone && !selectedZones.find(z => z.id === zone.id) && zone.id !== baseZone.id) {
      setSelectedZones(prev => [...prev, zone]);
    }
  };

  const removeZone = (zoneId: string) => {
    setSelectedZones(prev => prev.filter(z => z.id !== zoneId));
  };

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      if (selectedZones.length === 0) {
        setResults(null);
        return;
      }

      const allZones = [baseZone, ...selectedZones];
      const result = planMeeting(
        { hour: selectedHour, minute: 0 },
        baseZone,
        allZones
      );
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResults(null);
    }
  }, [baseZone, selectedZones, selectedHour]);

  const reset = () => {
    setBaseZone(COMMON_TIMEZONES[1]);
    setSelectedZones([COMMON_TIMEZONES[7], COMMON_TIMEZONES[17]]);
    setSelectedHour(10);
    setResults(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const getTimeIcon = (hour: number) => {
    if (hour >= 6 && hour < 18) {
      return <Sun className="h-4 w-4 text-yellow-500" />;
    }
    return <Moon className="h-4 w-4 text-blue-400" />;
  };

  const getTimeColor = (isBusinessHours: boolean, isOvernight: boolean) => {
    if (isOvernight) return 'bg-red-100 border-red-300 text-red-700';
    if (isBusinessHours) return 'bg-green-100 border-green-300 text-green-700';
    return 'bg-yellow-100 border-yellow-300 text-yellow-700';
  };

  const availableZones = COMMON_TIMEZONES.filter(
    z => z.id !== baseZone.id && !selectedZones.find(sz => sz.id === z.id)
  );

  return (
    <CalculatorBase
      title="Time Zone Meeting Planner"
      description="Find the best meeting time across multiple time zones"
      onReset={reset}
      error={error}
      results={results && (
        <div className="space-y-4">
          {/* Status */}
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            results.allInBusinessHours 
              ? 'bg-green-100 text-green-700' 
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {results.allInBusinessHours ? (
              <>
                <Check className="h-5 w-5" />
                <span className="font-medium">All participants are within business hours!</span>
              </>
            ) : (
              <>
                <X className="h-5 w-5" />
                <span className="font-medium">Some participants are outside business hours</span>
              </>
            )}
          </div>

          {/* Time Cards */}
          <div className="grid gap-3">
            {results.zoneTimes.map((zt, index) => (
              <Card 
                key={zt.zone.id} 
                className={`p-4 border-2 ${getTimeColor(zt.isBusinessHours, zt.isOvernight)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTimeIcon(zt.time.hour)}
                    <div>
                      <p className="font-semibold">{zt.zone.city}</p>
                      <p className="text-sm opacity-75">
                        {zt.zone.abbreviation} (UTC{zt.zone.offset >= 0 ? '+' : ''}{zt.zone.offset})
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{formatTime(zt.time)}</p>
                    <p className="text-sm opacity-75">
                      {index === 0 ? 'Base time' : formatTimeDifference(getTimeDifference(baseZone, zt.zone))}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  {zt.isBusinessHours && (
                    <span className="text-xs px-2 py-0.5 bg-white/50 rounded">Business hours</span>
                  )}
                  {zt.isOvernight && (
                    <span className="text-xs px-2 py-0.5 bg-white/50 rounded">Overnight</span>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Overlapping Hours */}
          {results.overlappingHours.length > 0 && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Overlapping Business Hours (UTC)</p>
              <div className="flex flex-wrap gap-2">
                {results.overlappingHours.map((slot, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    {slot.startHour}:00 - {slot.endHour}:00
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    >
      <div className="space-y-4">
        {/* Base Time Zone */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="base-zone">
            Your Time Zone
          </label>
          <select
            id="base-zone"
            value={baseZone.id}
            onChange={(e) => {
              const zone = COMMON_TIMEZONES.find(z => z.id === e.target.value);
              if (zone) setBaseZone(zone);
            }}
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            {COMMON_TIMEZONES.map(zone => (
              <option key={zone.id} value={zone.id}>
                {zone.city} ({zone.abbreviation}, UTC{zone.offset >= 0 ? '+' : ''}{zone.offset})
              </option>
            ))}
          </select>
        </div>

        {/* Time Slider */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Meeting Time: {formatTime({ hour: selectedHour, minute: 0 })}
          </label>
          <div className="relative pt-2">
            <input
              type="range"
              min="0"
              max="23"
              value={selectedHour}
              onChange={(e) => setSelectedHour(parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>12 AM</span>
              <span>6 AM</span>
              <span>12 PM</span>
              <span>6 PM</span>
              <span>11 PM</span>
            </div>
          </div>
          {/* Visual time indicator */}
          <div className="h-8 bg-gradient-to-r from-blue-900 via-yellow-400 to-blue-900 rounded-lg relative">
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white border border-gray-400 rounded"
              style={{ left: `${(selectedHour / 23) * 100}%`, transform: 'translateX(-50%)' }}
            />
          </div>
        </div>

        {/* Selected Time Zones */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Participants' Time Zones</p>
          </div>

          {selectedZones.map(zone => (
            <div 
              key={zone.id}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{zone.city}</span>
                <span className="text-sm text-muted-foreground">
                  ({zone.abbreviation})
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeZone(zone.id)}
                aria-label={`Remove ${zone.city}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}

          {/* Add Zone */}
          {availableZones.length > 0 && (
            <div className="flex gap-2">
              <select
                id="add-zone"
                className="flex-1 px-3 py-2 border rounded-md bg-background text-sm"
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) {
                    addZone(e.target.value);
                    e.target.value = '';
                  }
                }}
              >
                <option value="">Add a time zone...</option>
                {availableZones.map(zone => (
                  <option key={zone.id} value={zone.id}>
                    {zone.city} ({zone.abbreviation})
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  const select = document.getElementById('add-zone') as HTMLSelectElement;
                  if (select.value) {
                    addZone(select.value);
                    select.value = '';
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </CalculatorBase>
  );
}

export default TimezonePlanner;
