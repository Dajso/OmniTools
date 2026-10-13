'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  COMMON_TIMEZONES,
  planMeeting,
  zonesForDate,
  formatUtcOffset,
  formatTime,
  formatTimeDifference,
  getTimeDifference,
  type TimeZone,
  type MeetingPlanResult 
} from '@/lib/calculations/travel/timezone-planner';
import { Plus, Trash2, Clock, Sun, Moon, Check, X } from 'lucide-react';

const DEFAULT_BASE_ID = 'Europe/Oslo';
const DEFAULT_SELECTED_IDS = ['America/New_York', 'Asia/Tokyo'];

export function TimezonePlanner() {
  const todayStr = React.useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [dateStr, setDateStr] = React.useState<string>(todayStr);
  const [baseZoneId, setBaseZoneId] = React.useState<string>(DEFAULT_BASE_ID);
  const [selectedZoneIds, setSelectedZoneIds] = React.useState<string[]>(DEFAULT_SELECTED_IDS);
  const [selectedHour, setSelectedHour] = React.useState<number>(10);

  // Forskyvninger regnes ut for valgt dato, så sommertid blir riktig
  const zones = React.useMemo(() => {
    const date = new Date(`${dateStr || todayStr}T12:00:00Z`);
    return zonesForDate(COMMON_TIMEZONES, Number.isNaN(date.getTime()) ? new Date() : date);
  }, [dateStr, todayStr]);
  const baseZone = zones.find(z => z.id === baseZoneId) ?? zones[0];
  const selectedZones = React.useMemo(
    () => selectedZoneIds
      .map(id => zones.find(z => z.id === id))
      .filter((z): z is TimeZone => Boolean(z)),
    [selectedZoneIds, zones]
  );
  const [results, setResults] = React.useState<MeetingPlanResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const addZone = (zoneId: string) => {
    if (zoneId !== baseZoneId && !selectedZoneIds.includes(zoneId)) {
      setSelectedZoneIds(prev => [...prev, zoneId]);
    }
  };

  const removeZone = (zoneId: string) => {
    setSelectedZoneIds(prev => prev.filter(id => id !== zoneId));
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
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
      setResults(null);
    }
  }, [baseZone, selectedZones, selectedHour]);

  const reset = () => {
    setBaseZoneId(DEFAULT_BASE_ID);
    setSelectedZoneIds(DEFAULT_SELECTED_IDS);
    setDateStr(todayStr);
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

  const availableZones = zones.filter(
    z => z.id !== baseZone.id && !selectedZones.find(sz => sz.id === z.id)
  );

  return (
    <CalculatorBase
      title="Møteplanlegger på tvers av tidssoner"
      description="Finn et møtetidspunkt som passer for deltakere i flere tidssoner, med sommertid"
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
                <span className="font-medium">Alle deltakerne er innenfor arbeidstid</span>
              </>
            ) : (
              <>
                <X className="h-5 w-5" />
                <span className="font-medium">Noen deltakere er utenfor arbeidstid</span>
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
                        {formatUtcOffset(zt.zone.offset)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{formatTime(zt.time)}</p>
                    <p className="text-sm opacity-75">
                      {index === 0 ? 'Din tid' : formatTimeDifference(getTimeDifference(baseZone, zt.zone))}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  {zt.isBusinessHours && (
                    <span className="text-xs px-2 py-0.5 bg-white/50 rounded">Arbeidstid</span>
                  )}
                  {zt.isOvernight && (
                    <span className="text-xs px-2 py-0.5 bg-white/50 rounded">Natt</span>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Overlapping Hours */}
          {results.overlappingHours.length > 0 && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Felles arbeidstid (UTC)</p>
              <div className="flex flex-wrap gap-2">
                {results.overlappingHours.map((slot, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    {String(slot.startHour).padStart(2, '0')}:00–{String(slot.endHour).padStart(2, '0')}:00
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
            Din tidssone
          </label>
          <select
            id="base-zone"
            value={baseZone.id}
            onChange={(e) => {
              const id = e.target.value;
              setBaseZoneId(id);
              setSelectedZoneIds(prev => prev.filter(z => z !== id));
            }}
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            {zones.map(zone => (
              <option key={zone.id} value={zone.id}>
                {zone.city} ({formatUtcOffset(zone.offset)})
              </option>
            ))}
          </select>
        </div>

        {/* Dato */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="meeting-date">
            Dato for møtet
          </label>
          <input
            id="meeting-date"
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background"
          />
          <p className="text-xs text-muted-foreground">Sommertid og vintertid regnes ut for denne datoen.</p>
        </div>

        {/* Time Slider */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Møtetidspunkt hos deg: kl. {formatTime({ hour: selectedHour, minute: 0 })}
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
              <span>00</span>
              <span>06</span>
              <span>12</span>
              <span>18</span>
              <span>23</span>
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
            <p className="text-sm font-medium">Deltakernes tidssoner</p>
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
                  ({formatUtcOffset(zone.offset)})
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeZone(zone.id)}
                aria-label={`Fjern ${zone.city}`}
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
                <option value="">Legg til tidssone …</option>
                {availableZones.map(zone => (
                  <option key={zone.id} value={zone.id}>
                    {zone.city} ({formatUtcOffset(zone.offset)})
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
