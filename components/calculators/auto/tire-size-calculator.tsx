'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import {
  calculateTireDimensions,
  compareTireSizes,
  COMMON_TIRE_SIZES,
  type TireSize,
  type TireComparison,
} from '@/lib/calculations/auto/tire-calculator';

const COMMON_TIRE_OPTIONS = COMMON_TIRE_SIZES.map(size => ({
  value: `${size.width}/${size.aspectRatio}R${size.rimDiameter}`,
  label: `${size.width}/${size.aspectRatio}R${size.rimDiameter}`,
}));

function TireVisual({ 
  original, 
  newTire, 
  comparison 
}: { 
  original: { diameter: number; width: number }; 
  newTire: { diameter: number; width: number };
  comparison: TireComparison;
}) {
  const maxDiameter = Math.max(original.diameter, newTire.diameter);
  const scale = 120 / maxDiameter;
  
  const origHeight = original.diameter * scale;
  const origWidth = Math.max(original.width * scale * 0.3, 20);
  const newHeight = newTire.diameter * scale;
  const newWidth = Math.max(newTire.width * scale * 0.3, 20);

  return (
    <div className="flex justify-center items-end gap-8 p-4 bg-muted/30 rounded-lg">
      <div className="flex flex-col items-center">
        <div 
          className="rounded-full border-4 border-gray-600 bg-gray-800 flex items-center justify-center"
          style={{ 
            width: `${origWidth}px`, 
            height: `${origHeight}px`,
          }}
        >
          <div className="rounded-full bg-gray-400 w-1/3 h-1/3" />
        </div>
        <span className="text-xs mt-2 text-muted-foreground">Opprinnelig</span>
        <span className="text-xs text-muted-foreground">{original.diameter.toFixed(1)}mm</span>
      </div>
      <div className="flex flex-col items-center">
        <div 
          className={`rounded-full border-4 flex items-center justify-center ${
            comparison.isLarger ? 'border-green-600 bg-green-900' : 'border-orange-600 bg-orange-900'
          }`}
          style={{ 
            width: `${newWidth}px`, 
            height: `${newHeight}px`,
          }}
        >
          <div className="rounded-full bg-gray-400 w-1/3 h-1/3" />
        </div>
        <span className="text-xs mt-2 text-muted-foreground">Ny</span>
        <span className="text-xs text-muted-foreground">{newTire.diameter.toFixed(1)}mm</span>
      </div>
    </div>
  );
}

export function TireSizeCalculator() {
  const [usePreset, setUsePreset] = React.useState(true);
  const [originalPreset, setOriginalPreset] = React.useState('225/45R17');
  const [newPreset, setNewPreset] = React.useState('235/45R18');
  
  const [origWidth, setOrigWidth] = React.useState(225);
  const [origAspect, setOrigAspect] = React.useState(45);
  const [origRim, setOrigRim] = React.useState(17);
  
  const [newWidth, setNewWidth] = React.useState(235);
  const [newAspect, setNewAspect] = React.useState(45);
  const [newRim, setNewRim] = React.useState(18);
  
  const [result, setResult] = React.useState<TireComparison | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const parsePreset = (preset: string): TireSize | null => {
    const match = preset.match(/^(\d+)\/(\d+)R(\d+)$/);
    if (!match) return null;
    return {
      width: parseInt(match[1]),
      aspectRatio: parseInt(match[2]),
      rimDiameter: parseInt(match[3]),
    };
  };

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      let originalSize: TireSize;
      let newSize: TireSize;
      
      if (usePreset) {
        const orig = parsePreset(originalPreset);
        const newS = parsePreset(newPreset);
        if (!orig || !newS) {
          setError('Ugyldig dekkstørrelse');
          return;
        }
        originalSize = orig;
        newSize = newS;
      } else {
        originalSize = { width: origWidth, aspectRatio: origAspect, rimDiameter: origRim };
        newSize = { width: newWidth, aspectRatio: newAspect, rimDiameter: newRim };
      }
      
      const comparison = compareTireSizes(originalSize, newSize);
      setResult(comparison);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
      setResult(null);
    }
  }, [usePreset, originalPreset, newPreset, origWidth, origAspect, origRim, newWidth, newAspect, newRim]);

  const reset = () => {
    setUsePreset(true);
    setOriginalPreset('225/45R17');
    setNewPreset('235/45R18');
    setOrigWidth(225);
    setOrigAspect(45);
    setOrigRim(17);
    setNewWidth(235);
    setNewAspect(45);
    setNewRim(18);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Dekkstørrelse"
      description="Sammenlign dekkstørrelser og se hvor mye speedometeret ditt avviker"
      formula="Omkrets = π × (2 × flankehøyde + felg × 25,4)"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <TireVisual 
            original={{ 
              diameter: result.original.overallDiameter, 
              width: result.original.sectionWidth 
            }}
            newTire={{ 
              diameter: result.newTire.overallDiameter, 
              width: result.newTire.sectionWidth 
            }}
            comparison={result}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Endring i diameter" 
              value={`${result.diameterDifference > 0 ? '+' : ''}${result.diameterDifference.toFixed(1)}mm (${result.diameterDifferencePercent > 0 ? '+' : ''}${result.diameterDifferencePercent.toFixed(2)}%)`} 
            />
            <ResultDisplay 
              label="Avvik i speedometer" 
              value={`${result.speedometerError > 0 ? '+' : ''}${result.speedometerError.toFixed(2)}%`}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Reell fart når speedometeret viser 80 km/t" 
              value={`${(result.actualSpeedAt60 * 80 / 60).toFixed(1).replace('.', ',')} km/t`}
            />
            <ResultDisplay 
              label="Speedometeret viser ved reell fart 80 km/t" 
              value={`${(result.speedoReadingAt60 * 80 / 60).toFixed(1).replace('.', ',')} km/t`}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Endring i bakkeklaring" 
              value={`${result.groundClearanceChange > 0 ? '+' : ''}${result.groundClearanceChange.toFixed(1)}mm`}
            />
            <ResultDisplay 
              label="Omdreininger per km (nytt)" 
              value={(result.newTire.revolutionsPerMile / 1.609344).toFixed(0)}
            />
          </div>

          <div className="bg-muted/50 p-3 rounded-lg text-sm">
            <p className="font-medium mb-1">
              {result.isLarger ? '📈 Større dekk' : '📉 Mindre dekk'}
            </p>
            <p className="text-muted-foreground">
              {result.speedometerError > 0 
                ? `Speedometeret viser for lavt. Når det viser 80 km/t, kjører du i virkeligheten ${(result.actualSpeedAt60 * 80 / 60).toFixed(1).replace('.', ',')} km/t.`
                : `Speedometeret viser for høyt. Når det viser 80 km/t, kjører du i virkeligheten ${(result.actualSpeedAt60 * 80 / 60).toFixed(1).replace('.', ',')} km/t.`
              }
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <SelectInput
          id="input-mode"
          label="Inndata"
          value={usePreset ? 'preset' : 'manual'}
          onChange={(v) => setUsePreset(v === 'preset')}
          options={[
            { value: 'preset', label: 'Vanlige størrelser' },
            { value: 'manual', label: 'Skriv inn selv' },
          ]}
        />

        {usePreset ? (
          <>
            <SelectInput
              id="original-preset"
              label="Opprinnelig dekkstørrelse"
              value={originalPreset}
              onChange={setOriginalPreset}
              options={COMMON_TIRE_OPTIONS}
            />
            <SelectInput
              id="new-preset"
              label="Ny dekkstørrelse"
              value={newPreset}
              onChange={setNewPreset}
              options={COMMON_TIRE_OPTIONS}
            />
          </>
        ) : (
          <>
            <div className="p-3 bg-muted/30 rounded-lg space-y-3">
              <p className="text-sm font-medium">Opprinnelig dekk</p>
              <div className="grid grid-cols-3 gap-2">
                <NumberInput id="orig-width" label="Bredde" value={origWidth} onChange={setOrigWidth} min={100} max={400} unit="mm" />
                <NumberInput id="orig-aspect" label="Profil" value={origAspect} onChange={setOrigAspect} min={20} max={90} unit="%" />
                <NumberInput id="orig-rim" label="Felg" value={origRim} onChange={setOrigRim} min={10} max={30} unit="″" />
              </div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg space-y-3">
              <p className="text-sm font-medium">Nytt dekk</p>
              <div className="grid grid-cols-3 gap-2">
                <NumberInput id="new-width" label="Bredde" value={newWidth} onChange={setNewWidth} min={100} max={400} unit="mm" />
                <NumberInput id="new-aspect" label="Profil" value={newAspect} onChange={setNewAspect} min={20} max={90} unit="%" />
                <NumberInput id="new-rim" label="Felg" value={newRim} onChange={setNewRim} min={10} max={30} unit="″" />
              </div>
            </div>
          </>
        )}
      </div>
    </CalculatorBase>
  );
}

export default TireSizeCalculator;
