'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { Button } from '@/components/ui/button';

interface HardinessZone {
  zone: string;
  minTemp: number;
  maxTemp: number;
  description: string;
}

const HARDINESS_ZONES: HardinessZone[] = [
  { zone: '1a', minTemp: -60, maxTemp: -55, description: 'Extreme cold - Alaska interior' },
  { zone: '1b', minTemp: -55, maxTemp: -50, description: 'Extreme cold - Alaska' },
  { zone: '2a', minTemp: -50, maxTemp: -45, description: 'Very cold - Northern Alaska' },
  { zone: '2b', minTemp: -45, maxTemp: -40, description: 'Very cold - Northern Minnesota' },
  { zone: '3a', minTemp: -40, maxTemp: -35, description: 'Cold - Northern US/Canada border' },
  { zone: '3b', minTemp: -35, maxTemp: -30, description: 'Cold - Montana, Minnesota' },
  { zone: '4a', minTemp: -30, maxTemp: -25, description: 'Cold - Northern Midwest' },
  { zone: '4b', minTemp: -25, maxTemp: -20, description: 'Cold - Wisconsin, Michigan' },
  { zone: '5a', minTemp: -20, maxTemp: -15, description: 'Moderate cold - Iowa, Illinois' },
  { zone: '5b', minTemp: -15, maxTemp: -10, description: 'Moderate cold - Kansas, Missouri' },
  { zone: '6a', minTemp: -10, maxTemp: -5, description: 'Moderate - Ohio, Pennsylvania' },
  { zone: '6b', minTemp: -5, maxTemp: 0, description: 'Moderate - Virginia, Kentucky' },
  { zone: '7a', minTemp: 0, maxTemp: 5, description: 'Mild - Tennessee, North Carolina' },
  { zone: '7b', minTemp: 5, maxTemp: 10, description: 'Mild - Georgia, South Carolina' },
  { zone: '8a', minTemp: 10, maxTemp: 15, description: 'Warm - Texas, Louisiana' },
  { zone: '8b', minTemp: 15, maxTemp: 20, description: 'Warm - Florida panhandle' },
  { zone: '9a', minTemp: 20, maxTemp: 25, description: 'Hot - Central Florida' },
  { zone: '9b', minTemp: 25, maxTemp: 30, description: 'Hot - South Florida' },
  { zone: '10a', minTemp: 30, maxTemp: 35, description: 'Tropical - South Florida, Hawaii' },
  { zone: '10b', minTemp: 35, maxTemp: 40, description: 'Tropical - Hawaii, Puerto Rico' },
  { zone: '11a', minTemp: 40, maxTemp: 45, description: 'Tropical - Hawaii' },
  { zone: '11b', minTemp: 45, maxTemp: 50, description: 'Tropical - Hawaii' },
  { zone: '12a', minTemp: 50, maxTemp: 55, description: 'Tropical - Hawaii, Puerto Rico' },
  { zone: '12b', minTemp: 55, maxTemp: 60, description: 'Tropical - Puerto Rico' },
  { zone: '13a', minTemp: 60, maxTemp: 65, description: 'Tropical - Puerto Rico' },
  { zone: '13b', minTemp: 65, maxTemp: 70, description: 'Tropical - Puerto Rico' },
];

// Sample ZIP code to zone mapping (simplified - real implementation would use API)
const ZIP_TO_ZONE: Record<string, string> = {
  '10001': '7a', // NYC
  '90210': '10a', // Beverly Hills
  '60601': '5b', // Chicago
  '33101': '10b', // Miami
  '98101': '8b', // Seattle
  '02101': '6b', // Boston
  '30301': '7b', // Atlanta
  '75201': '8a', // Dallas
  '85001': '9b', // Phoenix
  '80201': '5b', // Denver
};

interface ZoneResult {
  zone: string;
  minTemp: number;
  maxTemp: number;
  description: string;
  plantingTips: string[];
  suitablePlants: string[];
}

export function HardinessZoneFinder() {
  const [zipCode, setZipCode] = React.useState('');
  const [minTemp, setMinTemp] = React.useState<number | null>(null);
  const [result, setResult] = React.useState<ZoneResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [searchMethod, setSearchMethod] = React.useState<'zip' | 'temp'>('zip');

  const findZoneByZip = () => {
    setError(null);
    
    if (!/^\d{5}$/.test(zipCode)) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }

    // Check our sample mapping
    const zone = ZIP_TO_ZONE[zipCode];
    if (zone) {
      const zoneData = HARDINESS_ZONES.find(z => z.zone === zone);
      if (zoneData) {
        setResult(generateResult(zoneData));
        return;
      }
    }

    // Estimate based on first digit of ZIP (very rough approximation)
    const firstDigit = parseInt(zipCode[0]);
    let estimatedZone: string;
    
    if (firstDigit <= 1) estimatedZone = '6a'; // Northeast
    else if (firstDigit <= 3) estimatedZone = '7a'; // Southeast
    else if (firstDigit <= 5) estimatedZone = '5b'; // Midwest
    else if (firstDigit <= 7) estimatedZone = '6b'; // Central
    else if (firstDigit <= 8) estimatedZone = '8a'; // Southwest
    else estimatedZone = '9a'; // West Coast

    const zoneData = HARDINESS_ZONES.find(z => z.zone === estimatedZone);
    if (zoneData) {
      setResult(generateResult(zoneData));
      setError('Note: This is an estimate. For accurate results, visit the USDA Plant Hardiness Zone Map.');
    }
  };

  const findZoneByTemp = () => {
    setError(null);
    
    if (minTemp === null) {
      setError('Please enter your average minimum winter temperature');
      return;
    }

    const zoneData = HARDINESS_ZONES.find(
      z => minTemp >= z.minTemp && minTemp < z.maxTemp
    );

    if (zoneData) {
      setResult(generateResult(zoneData));
    } else if (minTemp < -60) {
      setResult(generateResult(HARDINESS_ZONES[0]));
    } else {
      setResult(generateResult(HARDINESS_ZONES[HARDINESS_ZONES.length - 1]));
    }
  };

  const generateResult = (zoneData: HardinessZone): ZoneResult => {
    const zoneNum = parseInt(zoneData.zone);
    
    let plantingTips: string[] = [];
    let suitablePlants: string[] = [];

    if (zoneNum <= 4) {
      plantingTips = [
        'Short growing season - start seeds indoors',
        'Use cold frames and row covers',
        'Choose cold-hardy varieties',
        'Mulch heavily for winter protection',
      ];
      suitablePlants = ['Kale', 'Spinach', 'Peas', 'Potatoes', 'Rhubarb', 'Asparagus'];
    } else if (zoneNum <= 6) {
      plantingTips = [
        'Start warm-season crops indoors',
        'Wait until after last frost to transplant',
        'Use mulch to moderate soil temperature',
        'Consider season extension techniques',
      ];
      suitablePlants = ['Tomatoes', 'Peppers', 'Beans', 'Corn', 'Squash', 'Apples'];
    } else if (zoneNum <= 8) {
      plantingTips = [
        'Long growing season for most vegetables',
        'Can grow cool-season crops in fall/winter',
        'Provide afternoon shade in summer',
        'Water deeply during hot periods',
      ];
      suitablePlants = ['Tomatoes', 'Peppers', 'Citrus', 'Figs', 'Peaches', 'Okra'];
    } else {
      plantingTips = [
        'Year-round growing possible',
        'Protect from occasional cold snaps',
        'Provide shade for cool-season crops',
        'Watch for tropical pests',
      ];
      suitablePlants = ['Citrus', 'Avocado', 'Mango', 'Bananas', 'Papaya', 'Tropical flowers'];
    }

    return {
      ...zoneData,
      plantingTips,
      suitablePlants,
    };
  };

  const reset = () => {
    setZipCode('');
    setMinTemp(null);
    setResult(null);
    setError(null);
  };

  return (
    <CalculatorBase
      title="Hardiness Zone Finder"
      description="Find your USDA Plant Hardiness Zone to choose the right plants for your climate"
      formula="Based on average annual minimum winter temperature"
      onReset={reset}
      error={error || undefined}
      results={
        result && (
          <div className="space-y-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-green-800 dark:text-green-200">
                Zone {result.zone.toUpperCase()}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                {result.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Min Temperature"
                value={result.minTemp}
                unit="°F"
              />
              <ResultDisplay
                label="Max Temperature"
                value={result.maxTemp}
                unit="°F"
              />
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Planting Tips</p>
              <ul className="text-sm text-muted-foreground space-y-2">
                {result.plantingTips.map((tip, i) => (
                  <li key={i} className="flex gap-2">
                    <span>•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Suitable Plants</p>
              <div className="flex flex-wrap gap-2">
                {result.suitablePlants.map((plant) => (
                  <span
                    key={plant}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm"
                  >
                    {plant}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={searchMethod === 'zip' ? 'default' : 'outline'}
            onClick={() => setSearchMethod('zip')}
            className="flex-1"
          >
            By ZIP Code
          </Button>
          <Button
            type="button"
            variant={searchMethod === 'temp' ? 'default' : 'outline'}
            onClick={() => setSearchMethod('temp')}
            className="flex-1"
          >
            By Temperature
          </Button>
        </div>

        {searchMethod === 'zip' ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ZIP Code</label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter 5-digit ZIP code"
                maxLength={5}
              />
            </div>
            <Button onClick={findZoneByZip} className="w-full">
              Find My Zone
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Average Minimum Winter Temperature (°F)</label>
              <input
                type="number"
                value={minTemp ?? ''}
                onChange={(e) => setMinTemp(e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., -10"
                min={-70}
                max={70}
              />
              <p className="text-xs text-muted-foreground">
                The coldest temperature your area typically experiences in winter
              </p>
            </div>
            <Button onClick={findZoneByTemp} className="w-full">
              Find My Zone
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
          <p className="font-medium mb-1">About Hardiness Zones</p>
          <p>
            The USDA Plant Hardiness Zone Map divides North America into 13 zones based on 
            average annual minimum winter temperature. Each zone is 10°F warmer (or colder) 
            than the adjacent zone.
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default HardinessZoneFinder;
