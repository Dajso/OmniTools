'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateLEDResistor, LED_COLORS, type LEDResistorResult } from '@/lib/calculations/electronics/led-resistor';
import { formatFixed } from '@/lib/utils/formatting';

const LED_OPTIONS = Object.entries(LED_COLORS).map(([value, data]) => ({
  value,
  label: `${data.name} (${data.vf}V)`,
}));

export function LEDResistorCalculator() {
  const [supplyVoltage, setSupplyVoltage] = React.useState('5');
  const [ledColor, setLedColor] = React.useState('red');
  const [forwardVoltage, setForwardVoltage] = React.useState('2.0');
  const [forwardCurrent, setForwardCurrent] = React.useState('20');
  const [ledsInSeries, setLedsInSeries] = React.useState('1');
  const [result, setResult] = React.useState<LEDResistorResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const handleLedColorChange = (color: string) => {
    setLedColor(color);
    const led = LED_COLORS[color];
    if (led) {
      setForwardVoltage(led.vf.toString());
      setForwardCurrent((led.ifTypical * 1000).toString());
    }
  };

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const vs = parseFloat(supplyVoltage);
      const vf = parseFloat(forwardVoltage);
      const ifMa = parseFloat(forwardCurrent);
      const count = parseInt(ledsInSeries, 10);

      if (isNaN(vs) || isNaN(vf) || isNaN(ifMa) || isNaN(count)) {
        setResult(null);
        return;
      }

      const res = calculateLEDResistor({
        supplyVoltage: vs,
        forwardVoltage: vf,
        forwardCurrent: ifMa / 1000,
        ledsInSeries: count,
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Feil i beregningen');
      setResult(null);
    }
  }, [supplyVoltage, forwardVoltage, forwardCurrent, ledsInSeries]);

  const reset = () => {
    setSupplyVoltage('5');
    setLedColor('red');
    setForwardVoltage('2.0');
    setForwardCurrent('20');
    setLedsInSeries('1');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="LED-motstand"
      description="Regn ut seriemotstanden du trenger til en lysdiode (LED)"
      formula="R = (Vs − Vf) ÷ If"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay label="Nødvendig motstand" value={result.formattedResistance} copyable />
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Utregnet verdi" value={`${formatFixed(result.resistance, 1)}Ω`} />
            <ResultDisplay label="Nærmeste standardverdi" value={`${result.nearestStandard}Ω`} />
            <ResultDisplay label="Effektrating" value={`≥${result.recommendedPowerRating}W`} />
            <ResultDisplay label="Faktisk strøm" value={`${formatFixed((result.actualCurrent * 1000), 1)}mA`} />
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <NumberInput id="supply-voltage" label="Forsyningsspenning (V)" value={supplyVoltage} onChange={setSupplyVoltage} min={0} step={0.5} />
        <SelectInput id="led-color" label="LED-farge (forhåndsvalg)" value={ledColor} onChange={handleLedColorChange} options={LED_OPTIONS} />
        <div className="grid grid-cols-2 gap-4">
          <NumberInput id="forward-voltage" label="Framspenning (V)" value={forwardVoltage} onChange={setForwardVoltage} min={0} step={0.1} />
          <NumberInput id="forward-current" label="Framstrøm (mA)" value={forwardCurrent} onChange={setForwardCurrent} min={0} step={1} />
        </div>
        <NumberInput id="leds-series" label="LED-er i serie" value={ledsInSeries} onChange={setLedsInSeries} min={1} step={1} />
      </div>
    </CalculatorBase>
  );
}

export default LEDResistorCalculator;
