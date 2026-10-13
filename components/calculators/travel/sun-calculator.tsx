'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sun, Sunrise, Sunset, Moon, MapPin, Calendar } from 'lucide-react';
import {
  calculateSunTimes,
  formatClock,
  formatDayLength,
  minutesOfDay,
  type SunTimes,
  type TimeRange,
} from '@/lib/calculations/travel/sun-calculator';
import { formatFixed } from '@/lib/utils/formatting';

interface PresetLocation {
  name: string;
  lat: number;
  lng: number;
  tz: string;
}

const PRESET_LOCATIONS: PresetLocation[] = [
  { name: 'Oslo', lat: 59.9139, lng: 10.7522, tz: 'Europe/Oslo' },
  { name: 'Bergen', lat: 60.3913, lng: 5.3221, tz: 'Europe/Oslo' },
  { name: 'Kristiansand', lat: 58.1467, lng: 7.9956, tz: 'Europe/Oslo' },
  { name: 'Trondheim', lat: 63.4305, lng: 10.3951, tz: 'Europe/Oslo' },
  { name: 'Tromsø', lat: 69.6492, lng: 18.9553, tz: 'Europe/Oslo' },
  { name: 'Longyearbyen', lat: 78.2232, lng: 15.6267, tz: 'Arctic/Longyearbyen' },
  { name: 'København', lat: 55.6761, lng: 12.5683, tz: 'Europe/Copenhagen' },
  { name: 'London', lat: 51.5074, lng: -0.1278, tz: 'Europe/London' },
  { name: 'Alicante', lat: 38.3452, lng: -0.4815, tz: 'Europe/Madrid' },
  { name: 'Bangkok', lat: 13.7563, lng: 100.5018, tz: 'Asia/Bangkok' },
  { name: 'New York', lat: 40.7128, lng: -74.006, tz: 'America/New_York' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, tz: 'Asia/Tokyo' },
];

const DEFAULT_PRESET = PRESET_LOCATIONS[0];

function todayLocal(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function SunCalculator() {
  const [latitude, setLatitude] = React.useState<number>(DEFAULT_PRESET.lat);
  const [longitude, setLongitude] = React.useState<number>(DEFAULT_PRESET.lng);
  const [timeZone, setTimeZone] = React.useState<string | undefined>(DEFAULT_PRESET.tz);
  const [date, setDate] = React.useState<string>(todayLocal);
  const [locationName, setLocationName] = React.useState<string>(DEFAULT_PRESET.name);
  const [results, setResults] = React.useState<SunTimes | null>(null);
  const [error, setError] = React.useState<string | undefined>();
  const [isLocating, setIsLocating] = React.useState(false);

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      setResults(calculateSunTimes(latitude, longitude, date));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
      setResults(null);
    }
  }, [latitude, longitude, date]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Nettleseren din støtter ikke posisjonsdeling');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(Math.round(position.coords.latitude * 10000) / 10000);
        setLongitude(Math.round(position.coords.longitude * 10000) / 10000);
        setTimeZone(undefined);
        setLocationName('Min posisjon');
        setIsLocating(false);
      },
      () => {
        setError('Fant ikke posisjonen din');
        setIsLocating(false);
      }
    );
  };

  const selectPreset = (preset: PresetLocation) => {
    setLatitude(preset.lat);
    setLongitude(preset.lng);
    setTimeZone(preset.tz);
    setLocationName(preset.name);
  };

  const reset = () => {
    selectPreset(DEFAULT_PRESET);
    setDate(todayLocal());
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  const t = (d: Date) => formatClock(d, timeZone);
  const range = (r: TimeRange | null) => (r ? `${t(r.start)}–${t(r.end)}` : '–');

  const polarNote = results?.polarState === 'midnight-sun'
    ? 'Midnattssol: sola går ikke ned denne datoen.'
    : results?.polarState === 'polar-night'
      ? 'Mørketid: sola kommer ikke over horisonten denne datoen.'
      : null;

  // Døgnlinje: dag og natt gjennom døgnet, i stedets tid
  const timeline = React.useMemo(() => {
    if (!results) return null;
    if (results.polarState === 'midnight-sun') return [{ cls: 'bg-yellow-200', flex: 24 }];
    if (results.polarState === 'polar-night') return [{ cls: 'bg-blue-900', flex: 24 }];
    const rise = minutesOfDay(results.sunrise!, timeZone) / 60;
    const set = minutesOfDay(results.sunset!, timeZone) / 60;
    if (set <= rise) return null;
    return [
      { cls: 'bg-blue-900', flex: rise },
      { cls: 'bg-yellow-200', flex: set - rise },
      { cls: 'bg-blue-900', flex: 24 - set },
    ];
  }, [results, timeZone]);

  return (
    <CalculatorBase
      title="Solhøyde og solnedgang"
      description="Regn ut soloppgang, solnedgang, gylden time og blå time for et sted og en dato"
      onReset={reset}
      error={error}
      results={results && (
        <div className="space-y-4">
          {polarNote && (
            <div className="p-3 rounded-lg bg-blue-50 text-blue-800 text-sm font-medium">{polarNote}</div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center bg-orange-50">
              <Sunrise className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <p className="text-sm text-muted-foreground">Soloppgang</p>
              <p className="text-xl font-bold text-orange-600">{results.sunrise ? t(results.sunrise) : '–'}</p>
            </Card>
            <Card className="p-4 text-center bg-yellow-50">
              <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <p className="text-sm text-muted-foreground">Sola høyest</p>
              <p className="text-xl font-bold text-yellow-600">{t(results.solarNoon)}</p>
            </Card>
            <Card className="p-4 text-center bg-red-50">
              <Sunset className="h-6 w-6 mx-auto mb-2 text-red-500" />
              <p className="text-sm text-muted-foreground">Solnedgang</p>
              <p className="text-xl font-bold text-red-600">{results.sunset ? t(results.sunset) : '–'}</p>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Dagens lengde" value={formatDayLength(results.dayLengthMinutes)} copyable />
            <ResultDisplay
              label="Solhøyde midt på dagen"
              value={`${formatFixed(results.sunAngleAtNoon, 1)}°`}
              copyable
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Fototider</p>

            <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
              <div className="flex items-center gap-2 mb-3">
                <Sun className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Gylden time</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Morgen</p>
                  <p className="font-medium">{range(results.goldenHourMorning)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Kveld</p>
                  <p className="font-medium">{range(results.goldenHourEvening)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-2 mb-3">
                <Moon className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Blå time</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Morgen</p>
                  <p className="font-medium">{range(results.blueHourMorning)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Kveld</p>
                  <p className="font-medium">{range(results.blueHourEvening)}</p>
                </div>
              </div>
            </Card>
            <p className="text-xs text-muted-foreground">
              Gylden time er når sola står mellom −4° og 6° over horisonten. Blå time er mellom −6° og −4°. På lyse sommernetter nord i Norge nås ikke alle vinklene, og da vises «–».
            </p>
          </div>

          {timeline && (
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">Døgnet</p>
              <div className="h-8 rounded-lg overflow-hidden flex" role="img" aria-label="Fordeling av dag og natt gjennom døgnet">
                {timeline.map((seg, i) => (
                  <div key={i} className={seg.cls} style={{ flex: seg.flex }} />
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>00</span>
                <span>06</span>
                <span>12</span>
                <span>18</span>
                <span>24</span>
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Klokkeslettene vises i {timeZone ? `lokal tid for ${locationName}` : 'tiden i nettleseren din'}, med sommertid der det gjelder.
          </p>
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Sted: {locationName}</label>
            <Button type="button" variant="outline" size="sm" onClick={getCurrentLocation} disabled={isLocating}>
              <MapPin className="h-4 w-4 mr-1" />
              {isLocating ? 'Finner posisjon …' : 'Bruk min posisjon'}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground" htmlFor="latitude">Breddegrad (N)</label>
              <input
                id="latitude"
                type="number"
                value={latitude}
                onChange={(e) => {
                  setLatitude(parseFloat(e.target.value) || 0);
                  setTimeZone(undefined);
                  setLocationName('Eget sted');
                }}
                min="-90"
                max="90"
                step="0.0001"
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground" htmlFor="longitude">Lengdegrad (Ø)</label>
              <input
                id="longitude"
                type="number"
                value={longitude}
                onChange={(e) => {
                  setLongitude(parseFloat(e.target.value) || 0);
                  setTimeZone(undefined);
                  setLocationName('Eget sted');
                }}
                min="-180"
                max="180"
                step="0.0001"
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Velg sted</p>
          <div className="flex flex-wrap gap-2">
            {PRESET_LOCATIONS.map(preset => (
              <Button
                key={preset.name}
                type="button"
                variant={locationName === preset.name ? 'default' : 'outline'}
                size="sm"
                onClick={() => selectPreset(preset)}
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="date">Dato</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-md bg-background"
            />
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default SunCalculator;
