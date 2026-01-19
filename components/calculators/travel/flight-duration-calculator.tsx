'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { Button } from '@/components/ui/button';
import { 
  calculateFlightDuration,
  searchAirports,
  MAJOR_AIRPORTS,
  type Airport,
  type FlightDurationResult 
} from '@/lib/calculations/travel/flight-duration-calculator';
import { Plane, ArrowRight, Clock, MapPin, Search } from 'lucide-react';

const FLIGHT_TYPE_COLORS = {
  'short-haul': 'bg-green-100 text-green-700',
  'medium-haul': 'bg-blue-100 text-blue-700',
  'long-haul': 'bg-purple-100 text-purple-700',
  'ultra-long-haul': 'bg-red-100 text-red-700',
};

const FLIGHT_TYPE_LABELS = {
  'short-haul': 'Short-haul (< 1,500 km)',
  'medium-haul': 'Medium-haul (1,500 - 4,000 km)',
  'long-haul': 'Long-haul (4,000 - 10,000 km)',
  'ultra-long-haul': 'Ultra long-haul (> 10,000 km)',
};

export function FlightDurationCalculator() {
  const [departureCode, setDepartureCode] = React.useState<string>('JFK');
  const [arrivalCode, setArrivalCode] = React.useState<string>('LHR');
  const [departureSearch, setDepartureSearch] = React.useState<string>('');
  const [arrivalSearch, setArrivalSearch] = React.useState<string>('');
  const [showDepartureSearch, setShowDepartureSearch] = React.useState(false);
  const [showArrivalSearch, setShowArrivalSearch] = React.useState(false);
  const [results, setResults] = React.useState<FlightDurationResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      if (!departureCode || !arrivalCode) {
        setResults(null);
        return;
      }

      if (departureCode === arrivalCode) {
        setError('Departure and arrival airports must be different');
        setResults(null);
        return;
      }

      const result = calculateFlightDuration(departureCode, arrivalCode);
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResults(null);
    }
  }, [departureCode, arrivalCode]);

  const swapAirports = () => {
    setDepartureCode(arrivalCode);
    setArrivalCode(departureCode);
  };

  const reset = () => {
    setDepartureCode('JFK');
    setArrivalCode('LHR');
    setDepartureSearch('');
    setArrivalSearch('');
    setResults(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const filteredDepartureAirports = departureSearch 
    ? searchAirports(departureSearch).slice(0, 10)
    : MAJOR_AIRPORTS.slice(0, 10);

  const filteredArrivalAirports = arrivalSearch 
    ? searchAirports(arrivalSearch).slice(0, 10)
    : MAJOR_AIRPORTS.slice(0, 10);

  const selectDeparture = (airport: Airport) => {
    setDepartureCode(airport.code);
    setDepartureSearch('');
    setShowDepartureSearch(false);
  };

  const selectArrival = (airport: Airport) => {
    setArrivalCode(airport.code);
    setArrivalSearch('');
    setShowArrivalSearch(false);
  };

  const getAirportDisplay = (code: string): string => {
    const airport = MAJOR_AIRPORTS.find(a => a.code === code);
    return airport ? `${airport.city} (${airport.code})` : code;
  };

  // Popular routes
  const popularRoutes = [
    { from: 'JFK', to: 'LHR' },
    { from: 'LAX', to: 'NRT' },
    { from: 'SFO', to: 'SIN' },
    { from: 'LHR', to: 'DXB' },
    { from: 'CDG', to: 'JFK' },
    { from: 'SYD', to: 'LAX' },
  ];

  return (
    <CalculatorBase
      title="Flight Duration Calculator"
      description="Estimate flight times between major world airports"
      onReset={reset}
      error={error}
      results={results && (
        <div className="space-y-4">
          {/* Route Display */}
          <div className="flex items-center justify-center gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold">{results.departureAirport.code}</p>
              <p className="text-sm text-muted-foreground">{results.departureAirport.city}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-0.5 bg-primary" />
              <Plane className="h-5 w-5 text-primary" />
              <div className="w-16 h-0.5 bg-primary" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{results.arrivalAirport.code}</p>
              <p className="text-sm text-muted-foreground">{results.arrivalAirport.city}</p>
            </div>
          </div>

          {/* Main Result */}
          <div className="p-6 bg-primary/5 rounded-lg text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground mb-1">Estimated Flight Time</p>
            <p className="text-4xl font-bold text-primary">
              {results.estimatedDurationFormatted}
            </p>
          </div>

          {/* Flight Type Badge */}
          <div className="flex justify-center">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${FLIGHT_TYPE_COLORS[results.flightType]}`}>
              {FLIGHT_TYPE_LABELS[results.flightType]}
            </span>
          </div>

          {/* Distance */}
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Distance" 
              value={results.distanceKm.toLocaleString()}
              unit="km"
              copyable 
            />
            <ResultDisplay 
              label="Distance" 
              value={results.distanceMiles.toLocaleString()}
              unit="miles"
              copyable 
            />
          </div>

          {/* Airport Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium mb-1">Departure</p>
              <p className="text-muted-foreground">{results.departureAirport.name}</p>
              <p className="text-muted-foreground">{results.departureAirport.country}</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium mb-1">Arrival</p>
              <p className="text-muted-foreground">{results.arrivalAirport.name}</p>
              <p className="text-muted-foreground">{results.arrivalAirport.country}</p>
            </div>
          </div>

          {/* Note */}
          <p className="text-xs text-muted-foreground text-center">
            * Estimated time includes typical taxi, takeoff, and landing overhead. 
            Actual flight times may vary based on weather, routing, and aircraft type.
          </p>
        </div>
      )}
    >
      <div className="space-y-4">
        {/* Airport Selection */}
        <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
          {/* Departure */}
          <div className="space-y-2 relative">
            <label className="text-sm font-medium">From</label>
            <div 
              className="p-3 border rounded-md bg-background cursor-pointer hover:border-primary transition-colors"
              onClick={() => setShowDepartureSearch(!showDepartureSearch)}
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{getAirportDisplay(departureCode)}</span>
              </div>
            </div>
            
            {showDepartureSearch && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg max-h-64 overflow-auto">
                <div className="p-2 border-b sticky top-0 bg-background">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={departureSearch}
                      onChange={(e) => setDepartureSearch(e.target.value)}
                      placeholder="Search airports..."
                      className="w-full pl-8 pr-3 py-1.5 text-sm border rounded bg-background"
                      autoFocus
                    />
                  </div>
                </div>
                {filteredDepartureAirports.map(airport => (
                  <button
                    key={airport.code}
                    type="button"
                    className="w-full p-2 text-left hover:bg-muted text-sm"
                    onClick={() => selectDeparture(airport)}
                  >
                    <span className="font-medium">{airport.code}</span>
                    <span className="text-muted-foreground ml-2">{airport.city}, {airport.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={swapAirports}
            className="mb-0.5"
            aria-label="Swap airports"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>

          {/* Arrival */}
          <div className="space-y-2 relative">
            <label className="text-sm font-medium">To</label>
            <div 
              className="p-3 border rounded-md bg-background cursor-pointer hover:border-primary transition-colors"
              onClick={() => setShowArrivalSearch(!showArrivalSearch)}
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{getAirportDisplay(arrivalCode)}</span>
              </div>
            </div>
            
            {showArrivalSearch && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg max-h-64 overflow-auto">
                <div className="p-2 border-b sticky top-0 bg-background">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={arrivalSearch}
                      onChange={(e) => setArrivalSearch(e.target.value)}
                      placeholder="Search airports..."
                      className="w-full pl-8 pr-3 py-1.5 text-sm border rounded bg-background"
                      autoFocus
                    />
                  </div>
                </div>
                {filteredArrivalAirports.map(airport => (
                  <button
                    key={airport.code}
                    type="button"
                    className="w-full p-2 text-left hover:bg-muted text-sm"
                    onClick={() => selectArrival(airport)}
                  >
                    <span className="font-medium">{airport.code}</span>
                    <span className="text-muted-foreground ml-2">{airport.city}, {airport.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Popular Routes */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Popular Routes</p>
          <div className="flex flex-wrap gap-2">
            {popularRoutes.map(route => (
              <Button
                key={`${route.from}-${route.to}`}
                type="button"
                variant={departureCode === route.from && arrivalCode === route.to ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setDepartureCode(route.from);
                  setArrivalCode(route.to);
                }}
              >
                {route.from} → {route.to}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default FlightDurationCalculator;
