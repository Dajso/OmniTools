'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Luggage, Check, X, AlertTriangle, Plane } from 'lucide-react';

interface AirlineLimits {
  name: string;
  code: string;
  carryOn: {
    length: number;
    width: number;
    height: number;
    weight: number;
    linearTotal?: number;
  };
  checked: {
    length: number;
    width: number;
    height: number;
    weight: number;
    linearTotal: number;
  };
  personalItem?: {
    length: number;
    width: number;
    height: number;
  };
}

// Veiledende grenser per flyselskap (billigste billettype med håndbagasje). Kontroller alltid hos flyselskapet.
const AIRLINE_LIMITS: AirlineLimits[] = [
  {
    name: 'SAS',
    code: 'SK',
    carryOn: { length: 55, width: 40, height: 23, weight: 8 },
    checked: { length: 158, width: 0, height: 0, weight: 23, linearTotal: 158 },
    personalItem: { length: 40, width: 30, height: 15 },
  },
  {
    name: 'Norwegian',
    code: 'DY',
    carryOn: { length: 55, width: 40, height: 23, weight: 10 },
    checked: { length: 300, width: 0, height: 0, weight: 32, linearTotal: 300 },
    personalItem: { length: 40, width: 30, height: 20 },
  },
  {
    name: 'Widerøe',
    code: 'WF',
    carryOn: { length: 55, width: 40, height: 20, weight: 8 },
    checked: { length: 158, width: 0, height: 0, weight: 23, linearTotal: 158 },
    personalItem: { length: 40, width: 30, height: 15 },
  },
  {
    name: 'Lufthansa',
    code: 'LH',
    carryOn: { length: 55, width: 40, height: 23, weight: 8 },
    checked: { length: 158, width: 0, height: 0, weight: 23, linearTotal: 158 },
    personalItem: { length: 40, width: 30, height: 10 },
  },
  {
    name: 'KLM',
    code: 'KL',
    carryOn: { length: 55, width: 35, height: 25, weight: 12 },
    checked: { length: 158, width: 0, height: 0, weight: 23, linearTotal: 158 },
    personalItem: { length: 40, width: 30, height: 15 },
  },
  {
    name: 'Finnair',
    code: 'AY',
    carryOn: { length: 55, width: 40, height: 23, weight: 8 },
    checked: { length: 158, width: 0, height: 0, weight: 23, linearTotal: 158 },
    personalItem: { length: 40, width: 30, height: 15 },
  },
  {
    name: 'Ryanair',
    code: 'FR',
    carryOn: { length: 55, width: 40, height: 20, weight: 10 },
    checked: { length: 81, width: 119, height: 119, weight: 20, linearTotal: 319 },
    personalItem: { length: 40, width: 30, height: 20 },
  },
  {
    name: 'Wizz Air',
    code: 'W6',
    carryOn: { length: 55, width: 40, height: 23, weight: 10 },
    checked: { length: 158, width: 0, height: 0, weight: 20, linearTotal: 158 },
    personalItem: { length: 40, width: 30, height: 20 },
  },
  {
    name: 'easyJet',
    code: 'U2',
    carryOn: { length: 56, width: 45, height: 25, weight: 15 },
    checked: { length: 275, width: 0, height: 0, weight: 23, linearTotal: 275 },
  },
  {
    name: 'British Airways',
    code: 'BA',
    carryOn: { length: 56, width: 45, height: 25, weight: 23 },
    checked: { length: 90, width: 75, height: 43, weight: 23, linearTotal: 208 },
    personalItem: { length: 40, width: 30, height: 15 },
  },
];

type BagType = 'carryOn' | 'checked' | 'personalItem';

interface CheckResult {
  airline: AirlineLimits;
  bagType: BagType;
  fits: boolean;
  issues: string[];
  linearTotal: number;
}

export function LuggageSizeChecker() {
  const [length, setLength] = React.useState<number>(55);
  const [width, setWidth] = React.useState<number>(35);
  const [height, setHeight] = React.useState<number>(22);
  const [weight, setWeight] = React.useState<number>(8);
  const [bagType, setBagType] = React.useState<BagType>('carryOn');
  const [selectedAirline, setSelectedAirline] = React.useState<string>('all');
  const [results, setResults] = React.useState<CheckResult[]>([]);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);

      if (length <= 0 || width <= 0 || height <= 0) {
        setResults([]);
        return;
      }

      const linearTotal = length + width + height;
      const checkResults: CheckResult[] = [];

      const airlinesToCheck = selectedAirline === 'all'
        ? AIRLINE_LIMITS
        : AIRLINE_LIMITS.filter(a => a.code === selectedAirline);

      airlinesToCheck.forEach(airline => {
        const issues: string[] = [];

        if (bagType === 'checked') {
          const limits = airline.checked;
          // Check linear total for checked bags
          if (limits.linearTotal && linearTotal > limits.linearTotal) {
            issues.push(`Sum av lengde, bredde og høyde (${linearTotal} cm) er over grensen på ${limits.linearTotal} cm`);
          }
          // Check weight
          if (limits.weight && weight > limits.weight) {
            issues.push(`Vekten ${weight} kg er over grensen på ${limits.weight} kg`);
          }
          checkResults.push({
            airline,
            bagType,
            fits: issues.length === 0,
            issues,
            linearTotal,
          });
        } else if (bagType === 'carryOn') {
          const limits = airline.carryOn;
          // Sort dimensions to compare (bags can be oriented differently)
          const bagDims = [length, width, height].sort((a, b) => b - a);
          const limitDims = [limits.length, limits.width, limits.height].sort((a, b) => b - a);

          if (bagDims[0] > limitDims[0]) {
            issues.push(`Lengden ${bagDims[0]} cm er over grensen på ${limitDims[0]} cm`);
          }
          if (bagDims[1] > limitDims[1]) {
            issues.push(`Bredden ${bagDims[1]} cm er over grensen på ${limitDims[1]} cm`);
          }
          if (bagDims[2] > limitDims[2]) {
            issues.push(`Høyden ${bagDims[2]} cm er over grensen på ${limitDims[2]} cm`);
          }
          // Check weight
          if (limits.weight && weight > limits.weight) {
            issues.push(`Vekten ${weight} kg er over grensen på ${limits.weight} kg`);
          }
          checkResults.push({
            airline,
            bagType,
            fits: issues.length === 0,
            issues,
            linearTotal,
          });
        } else if (bagType === 'personalItem') {
          const limits = airline.personalItem;
          if (!limits) {
            checkResults.push({
              airline,
              bagType,
              fits: false,
              issues: ['Liten ekstragjenstand er ikke tillatt, eller grensene er ikke oppgitt'],
              linearTotal,
            });
            return;
          }
          // Sort dimensions to compare
          const bagDims = [length, width, height].sort((a, b) => b - a);
          const limitDims = [limits.length, limits.width, limits.height].sort((a, b) => b - a);

          if (bagDims[0] > limitDims[0]) {
            issues.push(`Lengden ${bagDims[0]} cm er over grensen på ${limitDims[0]} cm`);
          }
          if (bagDims[1] > limitDims[1]) {
            issues.push(`Bredden ${bagDims[1]} cm er over grensen på ${limitDims[1]} cm`);
          }
          if (bagDims[2] > limitDims[2]) {
            issues.push(`Høyden ${bagDims[2]} cm er over grensen på ${limitDims[2]} cm`);
          }
          checkResults.push({
            airline,
            bagType,
            fits: issues.length === 0,
            issues,
            linearTotal,
          });
        }
      });

      // Sort: fits first, then by airline name
      checkResults.sort((a, b) => {
        if (a.fits !== b.fits) return a.fits ? -1 : 1;
        return a.airline.name.localeCompare(b.airline.name);
      });

      setResults(checkResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kontrollfeil');
      setResults([]);
    }
  }, [length, width, height, weight, bagType, selectedAirline]);

  const reset = () => {
    setLength(55);
    setWidth(35);
    setHeight(22);
    setWeight(8);
    setBagType('carryOn');
    setSelectedAirline('all');
    setResults([]);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const fitsCount = results.filter(r => r.fits).length;
  const totalCount = results.length;

  return (
    <CalculatorBase
      title="Bagasjemål"
      description="Sjekk om bagasjen oppfyller flyselskapenes mål- og vektgrenser"
      onReset={reset}
      error={error}
      results={results.length > 0 && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Din bagasje</p>
              <p className="font-bold">{length} × {width} × {height} cm, {weight} kg</p>
              <p className="text-sm text-muted-foreground">Sum av alle tre mål: {length + width + height} cm</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Passer</p>
              <p className={`text-2xl font-bold ${fitsCount === totalCount ? 'text-green-600' : fitsCount > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                {fitsCount}/{totalCount}
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-2">
            {results.map((result, index) => (
              <Card
                key={index}
                className={`p-4 ${result.fits ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {result.fits ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <X className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium">{result.airline.name}</p>
                      <p className="text-sm text-muted-foreground">{result.airline.code}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${result.fits ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {result.fits ? 'Passer' : 'For stor'}
                  </span>
                </div>
                {result.issues.length > 0 && (
                  <div className="mt-2 pl-8">
                    <ul className="text-sm text-red-600 space-y-1">
                      {result.issues.map((issue, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            * Grensene varierer med billettype og rute, og kan endres. Kontroller alltid hos flyselskapet før du reiser.
          </p>
        </div>
      )}
    >
      <div className="space-y-4">
        {/* Type bagasje */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Type bagasje</p>
          <div className="flex gap-2">
            {[
              { value: 'carryOn', label: 'Håndbagasje' },
              { value: 'checked', label: 'Innsjekket' },
              { value: 'personalItem', label: 'Liten veske/sekk' },
            ].map(type => (
              <Button
                key={type.value}
                type="button"
                variant={bagType === type.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setBagType(type.value as BagType)}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Dimensions */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Mål (cm)</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground" htmlFor="length">
                Lengde
              </label>
              <input
                id="length"
                type="number"
                value={length}
                onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                min="0"
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground" htmlFor="width">
                Bredde
              </label>
              <input
                id="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                min="0"
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground" htmlFor="height">
                Høyde
              </label>
              <input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                min="0"
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>
          </div>
        </div>

        {/* Weight */}
        {bagType !== 'personalItem' && (
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="weight">
              Vekt (kg)
            </label>
            <input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border rounded-md bg-background"
            />
          </div>
        )}

        {/* Airline Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="airline">
            Flyselskap
          </label>
          <select
            id="airline"
            value={selectedAirline}
            onChange={(e) => setSelectedAirline(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">Alle flyselskaper</option>
            {AIRLINE_LIMITS.map(airline => (
              <option key={airline.code} value={airline.code}>
                {airline.name} ({airline.code})
              </option>
            ))}
          </select>
        </div>

        {/* Common Bag Sizes */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Vanlige størrelser</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Kabinkoffert (55×35×20)', l: 55, w: 35, h: 20 },
              { label: 'Mellomstor (65×45×25)', l: 65, w: 45, h: 25 },
              { label: 'Stor (75×50×30)', l: 75, w: 50, h: 30 },
              { label: 'Ryggsekk (45×35×20)', l: 45, w: 35, h: 20 },
            ].map(size => (
              <Button
                key={size.label}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setLength(size.l);
                  setWidth(size.w);
                  setHeight(size.h);
                }}
              >
                {size.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default LuggageSizeChecker;
