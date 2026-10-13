'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Youtube } from 'lucide-react';
import {
  estimateYouTubeEarnings,
  calculateViewsForEarnings,
  CPM_RANGES,
  formatEarnings,
  formatViews,
  type YouTubeEarnings,
} from '@/lib/calculations/creator/youtube-calculator';
import { formatFixed } from '@/lib/utils/formatting';

const CATEGORY_OPTIONS = Object.entries(CPM_RANGES).map(([key, value]) => ({
  value: key,
  label: value.label,
}));

export function YouTubeMoneyCalculator() {
  const [views, setViews] = React.useState(100000);
  const [category, setCategory] = React.useState('general');
  const [customCpmLow, setCustomCpmLow] = React.useState<number | null>(null);
  const [customCpmHigh, setCustomCpmHigh] = React.useState<number | null>(null);
  const [useCustomCpm, setUseCustomCpm] = React.useState(false);
  const [results, setResults] = React.useState<YouTubeEarnings | null>(null);

  const categoryData = CPM_RANGES[category] || CPM_RANGES.general;

  React.useEffect(() => {
    try {
      const cpmLow = useCustomCpm && customCpmLow !== null ? customCpmLow : categoryData.low;
      const cpmHigh = useCustomCpm && customCpmHigh !== null ? customCpmHigh : categoryData.high;
      
      const earnings = estimateYouTubeEarnings({
        views,
        cpmLow,
        cpmHigh,
      });
      setResults(earnings);
    } catch {
      setResults(null);
    }
  }, [views, category, customCpmLow, customCpmHigh, useCustomCpm, categoryData]);

  const viewsFor1000 = React.useMemo(() => {
    const avgCpm = (categoryData.low + categoryData.high) / 2;
    return calculateViewsForEarnings(1000, avgCpm);
  }, [categoryData]);

  const viewsFor10000 = React.useMemo(() => {
    const avgCpm = (categoryData.low + categoryData.high) / 2;
    return calculateViewsForEarnings(10000, avgCpm);
  }, [categoryData]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Youtube className="h-5 w-5 text-red-600" />
          YouTube-inntekter
        </CardTitle>
        <CardDescription>
          Anslå annonseinntekter på YouTube ut fra visninger og innholdstype
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="space-y-4">
          <NumberInput
            id="views"
            label="Visninger totalt"
            value={views}
            onChange={setViews}
            min={0}
            step={1000}
          />

          <div className="space-y-2">
            <Label htmlFor="category">Innholdskategori</Label>
            <Select
              id="category"
              options={CATEGORY_OPTIONS}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Typisk CPM: {formatFixed(categoryData.low, 1)}–{formatFixed(categoryData.high, 1)} kr
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useCustomCpm}
              onChange={(e) => setUseCustomCpm(e.target.checked)}
              className="h-4 w-4 rounded"
            />
            <span className="text-sm">Bruk egne CPM-verdier</span>
          </label>

          {useCustomCpm && (
            <div className="grid grid-cols-2 gap-4 pl-6">
              <NumberInput
                id="customCpmLow"
                label="Lav CPM"
                value={customCpmLow ?? categoryData.low}
                onChange={setCustomCpmLow}
                min={0}
                step={2.5}
                unit="kr"
              />
              <NumberInput
                id="customCpmHigh"
                label="Høy CPM"
                value={customCpmHigh ?? categoryData.high}
                onChange={setCustomCpmHigh}
                min={0}
                step={2.5}
                unit="kr"
              />
            </div>
          )}
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-4 pt-4 border-t">
            <ResultDisplay
              label="Anslått inntekt"
              value={`${formatEarnings(results.estimatedLow)} – ${formatEarnings(results.estimatedHigh)}`}
              highlight
              copyable
            />

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Lavt anslag"
                value={`${formatEarnings(results.estimatedLow)}`}
                copyable
              />
              <ResultDisplay
                label="Høyt anslag"
                value={`${formatEarnings(results.estimatedHigh)}`}
                copyable
              />
              <ResultDisplay
                label="Gjennomsnittlig anslag"
                value={formatEarnings(results.estimatedAverage)}
                copyable
              />
              <ResultDisplay
                label="Visninger"
                value={formatViews(results.views)}
              />
            </div>

            {/* Earnings Projections */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium">Inntektsprognoser</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Per 1 000 visninger</p>
                  <p className="font-medium">
                    {formatEarnings((results.estimatedAverage / views) * 1000)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Per million visninger</p>
                  <p className="font-medium">
                    {formatEarnings((results.estimatedAverage / views) * 1000000)}
                  </p>
                </div>
              </div>
            </div>

            {/* Views Needed */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium">Visninger som trengs for å tjene</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">1 000 kr</p>
                  <p className="font-medium">{formatViews(viewsFor1000)} visninger</p>
                </div>
                <div>
                  <p className="text-muted-foreground">10 000 kr</p>
                  <p className="font-medium">{formatViews(viewsFor10000)} visninger</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md space-y-2">
          <p className="font-medium">Slik fungerer det:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>CPM (kostnad per mille) er det annonsørene betaler per 1 000 annonsevisninger</li>
            <li>YouTube betaler skaperne omtrent 55 % av annonseinntektene</li>
            <li>Faktisk inntekt varierer med hvor publikummet er, annonseblokkere og engasjement</li>
            <li>Ikke alle visninger gir inntekt (noen hopper over annonser eller bruker annonseblokkere)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default YouTubeMoneyCalculator;
