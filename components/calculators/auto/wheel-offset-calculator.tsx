'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import {
  calculateWheelDimensions,
  compareWheelFitment,
  willWheelFit,
  type WheelSpec,
  type WheelComparison,
} from '@/lib/calculations/auto/wheel-offset-calculator';

export function WheelOffsetCalculator() {
  const [origDiameter, setOrigDiameter] = React.useState(17);
  const [origWidth, setOrigWidth] = React.useState(8);
  const [origOffset, setOrigOffset] = React.useState(45);
  
  const [newDiameter, setNewDiameter] = React.useState(18);
  const [newWidth, setNewWidth] = React.useState(8.5);
  const [newOffset, setNewOffset] = React.useState(40);
  
  const [result, setResult] = React.useState<WheelComparison | null>(null);
  const [fitCheck, setFitCheck] = React.useState<{ fits: boolean; issues: string[] } | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      const originalSpec: WheelSpec = {
        diameter: origDiameter,
        width: origWidth,
        offset: origOffset,
      };
      
      const newSpec: WheelSpec = {
        diameter: newDiameter,
        width: newWidth,
        offset: newOffset,
      };
      
      const comparison = compareWheelFitment(originalSpec, newSpec);
      const fit = willWheelFit(comparison);
      
      setResult(comparison);
      setFitCheck(fit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
      setFitCheck(null);
    }
  }, [origDiameter, origWidth, origOffset, newDiameter, newWidth, newOffset]);

  const reset = () => {
    setOrigDiameter(17);
    setOrigWidth(8);
    setOrigOffset(45);
    setNewDiameter(18);
    setNewWidth(8.5);
    setNewOffset(40);
    setResult(null);
    setFitCheck(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Wheel Offset (ET) Calculator"
      description="Calculate wheel fitment changes when changing wheel specifications"
      formula="Backspacing = (Width / 2) + Offset"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium mb-2">Original Wheel</p>
              <p className="text-xs text-muted-foreground">{result.original.formattedSize}</p>
              <p className="text-xs text-muted-foreground">Backspacing: {result.original.backspacing.toFixed(2)}"</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium mb-2">New Wheel</p>
              <p className="text-xs text-muted-foreground">{result.newWheel.formattedSize}</p>
              <p className="text-xs text-muted-foreground">Backspacing: {result.newWheel.backspacing.toFixed(2)}"</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Track Width Change (per side)" 
              value={`${result.trackWidthChangePerSide > 0 ? '+' : ''}${result.trackWidthChangePerSide.toFixed(1)}mm`}
            />
            <ResultDisplay 
              label="Total Track Width Change" 
              value={`${result.totalTrackWidthChange > 0 ? '+' : ''}${result.totalTrackWidthChange.toFixed(1)}mm`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Inner Clearance Change" 
              value={`${result.innerClearanceChange > 0 ? '+' : ''}${result.innerClearanceChange.toFixed(1)}mm`}
            />
            <ResultDisplay 
              label="Outer Clearance Change" 
              value={`${result.outerClearanceChange > 0 ? '+' : ''}${result.outerClearanceChange.toFixed(1)}mm`}
            />
          </div>

          <div className={`p-3 rounded-lg ${fitCheck?.fits ? 'bg-green-500/10 border border-green-500/30' : 'bg-orange-500/10 border border-orange-500/30'}`}>
            <p className="font-medium mb-1">
              {fitCheck?.fits ? '✅ Likely to Fit' : '⚠️ Potential Fitment Issues'}
            </p>
            <p className="text-sm text-muted-foreground">{result.fitmentAssessment}</p>
            {fitCheck && !fitCheck.fits && fitCheck.issues.length > 0 && (
              <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside">
                {fitCheck.issues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• {result.willPokeMore ? 'Wheel will poke out more' : result.willTuckMore ? 'Wheel will tuck in more' : 'Similar poke/tuck'}</p>
            <p>• {result.closerToSuspension ? 'Closer to suspension components' : 'More suspension clearance'}</p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="p-3 bg-muted/30 rounded-lg space-y-3">
          <p className="text-sm font-medium">Original Wheel</p>
          <div className="grid grid-cols-3 gap-2">
            <NumberInput id="orig-diameter" label="Diameter" value={origDiameter} onChange={setOrigDiameter} min={13} max={26} unit="in" />
            <NumberInput id="orig-width" label="Width" value={origWidth} onChange={setOrigWidth} min={4} max={16} step={0.5} unit="in" />
            <NumberInput id="orig-offset" label="Offset (ET)" value={origOffset} onChange={setOrigOffset} min={-100} max={100} unit="mm" />
          </div>
        </div>
        
        <div className="p-3 bg-muted/30 rounded-lg space-y-3">
          <p className="text-sm font-medium">New Wheel</p>
          <div className="grid grid-cols-3 gap-2">
            <NumberInput id="new-diameter" label="Diameter" value={newDiameter} onChange={setNewDiameter} min={13} max={26} unit="in" />
            <NumberInput id="new-width" label="Width" value={newWidth} onChange={setNewWidth} min={4} max={16} step={0.5} unit="in" />
            <NumberInput id="new-offset" label="Offset (ET)" value={newOffset} onChange={setNewOffset} min={-100} max={100} unit="mm" />
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default WheelOffsetCalculator;
