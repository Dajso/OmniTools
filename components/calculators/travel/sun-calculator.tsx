'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sun, Sunrise, Sunset, Moon, MapPin, Calendar } from 'lucide-react';

interface SunTimes {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  goldenHourMorning: { start: Date; end: Date };
  goldenHourEvening: { start: Date; end: Date };
  blueHourMorning: { start: Date; end: Date };
  blueHourEvening: { start: Date; end: Date };
  dayLength: number; // minutes
  sunAngleAtNoon: number;
}

// Sun calculation functions
function toJulianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

function toDegrees(radians: number): number {
  return radians * 180 / Math.PI;
}

function calculateSunTimes(latitude: number, longitude: number, date: Date): SunTimes {
  const jd = toJulianDate(date);
  const n = Math.floor(jd - 2451545.0 + 0.0008);
  
  // Mean solar noon
  const jStar = n - longitude / 360;
  
  // Solar mean anomaly
  const M = (357.5291 + 0.98560028 * jStar) % 360;
  const MRad = toRadians(M);
  
  // Equation of center
  const C = 1.9148 * Math.sin(MRad) + 0.02 * Math.sin(2 * MRad) + 0.0003 * Math.sin(3 * MRad);
  
  // Ecliptic longitude
  const lambda = (M + C + 180 + 102.9372) % 360;
  const lambdaRad = toRadians(lambda);
  
  // Solar transit
  const jTransit = 2451545.0 + jStar + 0.0053 * Math.sin(MRad) - 0.0069 * Math.sin(2 * lambdaRad);
  
  // Declination of the sun
  const sinDelta = Math.sin(lambdaRad) * Math.sin(toRadians(23.44));
  const delta = Math.asin(sinDelta);
  
  // Hour angle
  const latRad = toRadians(latitude);
  const cosOmega = (Math.sin(toRadians(-0.83)) - Math.sin(latRad) * sinDelta) / 
                   (Math.cos(latRad) * Math.cos(delta));
  
  // Handle polar day/night
  const omega = Math.abs(cosOmega) <= 1 ? toDegrees(Math.acos(cosOmega)) : 0;
  
  // Sunrise and sunset Julian dates
  const jRise = jTransit - omega / 360;
  const jSet = jTransit + omega / 360;
  
  // Convert Julian dates to JavaScript dates
  const toDate = (jd: number): Date => new Date((jd - 2440587.5) * 86400000);
  
  const sunrise = toDate(jRise);
  const sunset = toDate(jSet);
  const solarNoon = toDate(jTransit);
  
  // Calculate day length in minutes
  const dayLength = (jSet - jRise) * 24 * 60;
  
  // Sun angle at solar noon
  const sunAngleAtNoon = 90 - Math.abs(latitude - toDegrees(delta));
  
  // Golden hour (sun 6° above horizon to sunset/sunrise)
  const goldenHourDuration = 60; // approximately 1 hour
  const goldenHourMorning = {
    start: new Date(sunrise.getTime()),
    end: new Date(sunrise.getTime() + goldenHourDuration * 60000),
  };
  const goldenHourEvening = {
    start: new Date(sunset.getTime() - goldenHourDuration * 60000),
    end: new Date(sunset.getTime()),
  };
  
  // Blue hour (sun 4-6° below horizon)
  const blueHourDuration = 30; // approximately 30 minutes
  const blueHourMorning = {
    start: new Date(sunrise.getTime() - blueHourDuration * 60000),
    end: new Date(sunrise.getTime()),
  };
  const blueHourEvening = {
    start: new Date(sunset.getTime()),
    end: new Date(sunset.getTime() + blueHourDuration * 60000),
  };
  
  return {
    sunrise,
    sunset,
    solarNoon,
    goldenHourMorning,
    goldenHourEvening,
    blueHourMorning,
    blueHourEvening,
    dayLength,
    sunAngleAtNoon,
  };
}

const PRESET_LOCATIONS = [
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
];

export function SunCalculator() {
  const [latitude, setLatitude] = React.useState<number>(40.7128);
  const [longitude, setLongitude] = React.useState<number>(-74.0060);
  const [date, setDate] = React.useState<string>(new Date().toISOString().split('T')[0]);
  const [locationName, setLocationName] = React.useState<string>('New York');
  const [results, setResults] = React.useState<SunTimes | null>(null);
  const [error, setError] = React.useState<string | undefined>();
  const [isLocating, setIsLocating] = React.useState(false);

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      if (latitude < -90 || latitude > 90) {
        setError('Latitude must be between -90 and 90');
        setResults(null);
        return;
      }
      
      if (longitude < -180 || longitude > 180) {
        setError('Longitude must be between -180 and 180');
        setResults(null);
        return;
      }

      const selectedDate = new Date(date);
      selectedDate.setHours(12, 0, 0, 0);
      
      const sunTimes = calculateSunTimes(latitude, longitude, selectedDate);
      setResults(sunTimes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResults(null);
    }
  }, [latitude, longitude, date]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(Math.round(position.coords.latitude * 10000) / 10000);
        setLongitude(Math.round(position.coords.longitude * 10000) / 10000);
        setLocationName('Current Location');
        setIsLocating(false);
      },
      () => {
        setError('Unable to get your location');
        setIsLocating(false);
      }
    );
  };

  const selectPreset = (preset: typeof PRESET_LOCATIONS[0]) => {
    setLatitude(preset.lat);
    setLongitude(preset.lng);
    setLocationName(preset.name);
  };

  const reset = () => {
    setLatitude(40.7128);
    setLongitude(-74.0060);
    setDate(new Date().toISOString().split('T')[0]);
    setLocationName('New York');
    setResults(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <CalculatorBase
      title="Sun Angle & Sunset Calculator"
      description="Calculate sunrise, sunset, golden hour, and blue hour times for any location"
      onReset={reset}
      error={error}
      results={results && (
        <div className="space-y-4">
          {/* Main Times */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center bg-orange-50">
              <Sunrise className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <p className="text-sm text-muted-foreground">Sunrise</p>
              <p className="text-xl font-bold text-orange-600">{formatTime(results.sunrise)}</p>
            </Card>
            <Card className="p-4 text-center bg-yellow-50">
              <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <p className="text-sm text-muted-foreground">Solar Noon</p>
              <p className="text-xl font-bold text-yellow-600">{formatTime(results.solarNoon)}</p>
            </Card>
            <Card className="p-4 text-center bg-red-50">
              <Sunset className="h-6 w-6 mx-auto mb-2 text-red-500" />
              <p className="text-sm text-muted-foreground">Sunset</p>
              <p className="text-xl font-bold text-red-600">{formatTime(results.sunset)}</p>
            </Card>
          </div>

          {/* Day Info */}
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Day Length" 
              value={formatDuration(results.dayLength)}
              copyable 
            />
            <ResultDisplay 
              label="Sun Angle at Noon" 
              value={`${results.sunAngleAtNoon.toFixed(1)}°`}
              copyable 
            />
          </div>

          {/* Photography Times */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Photography Times</p>
            
            {/* Golden Hour */}
            <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
              <div className="flex items-center gap-2 mb-3">
                <Sun className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Golden Hour</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Morning</p>
                  <p className="font-medium">
                    {formatTime(results.goldenHourMorning.start)} - {formatTime(results.goldenHourMorning.end)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Evening</p>
                  <p className="font-medium">
                    {formatTime(results.goldenHourEvening.start)} - {formatTime(results.goldenHourEvening.end)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Blue Hour */}
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-2 mb-3">
                <Moon className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Blue Hour</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Morning</p>
                  <p className="font-medium">
                    {formatTime(results.blueHourMorning.start)} - {formatTime(results.blueHourMorning.end)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Evening</p>
                  <p className="font-medium">
                    {formatTime(results.blueHourEvening.start)} - {formatTime(results.blueHourEvening.end)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Visual Timeline */}
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">Day Timeline</p>
            <div className="h-8 rounded-lg overflow-hidden flex">
              <div className="bg-blue-900 flex-1" style={{ flex: results.sunrise.getHours() / 24 }} />
              <div className="bg-blue-400" style={{ flex: 0.5 / 24 }} />
              <div className="bg-orange-300" style={{ flex: 1 / 24 }} />
              <div className="bg-yellow-200 flex-1" style={{ flex: (results.sunset.getHours() - results.sunrise.getHours() - 2) / 24 }} />
              <div className="bg-orange-300" style={{ flex: 1 / 24 }} />
              <div className="bg-blue-400" style={{ flex: 0.5 / 24 }} />
              <div className="bg-blue-900 flex-1" style={{ flex: (24 - results.sunset.getHours()) / 24 }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>12 AM</span>
              <span>6 AM</span>
              <span>12 PM</span>
              <span>6 PM</span>
              <span>12 AM</span>
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        {/* Location */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Location: {locationName}</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              disabled={isLocating}
            >
              <MapPin className="h-4 w-4 mr-1" />
              {isLocating ? 'Locating...' : 'Use My Location'}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground" htmlFor="latitude">
                Latitude
              </label>
              <input
                id="latitude"
                type="number"
                value={latitude}
                onChange={(e) => {
                  setLatitude(parseFloat(e.target.value) || 0);
                  setLocationName('Custom');
                }}
                min="-90"
                max="90"
                step="0.0001"
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground" htmlFor="longitude">
                Longitude
              </label>
              <input
                id="longitude"
                type="number"
                value={longitude}
                onChange={(e) => {
                  setLongitude(parseFloat(e.target.value) || 0);
                  setLocationName('Custom');
                }}
                min="-180"
                max="180"
                step="0.0001"
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>
          </div>
        </div>

        {/* Preset Locations */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Quick Select</p>
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

        {/* Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="date">
            Date
          </label>
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
