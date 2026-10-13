'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { formatCurrency } from '@/lib/utils/formatting';
import {
  calculateChargingTime,
  CHARGER_TYPES,
  EV_MODELS,
  type EVChargingInput,
  type EVChargingResult,
} from '@/lib/calculations/auto/ev-charging-calculator';

const CHARGER_OPTIONS = CHARGER_TYPES.map(charger => ({
  value: charger.id,
  label: `${charger.name} (${charger.power} kW)`,
}));

const EV_MODEL_OPTIONS = [
  { value: 'custom', label: 'Egendefinert / skriv inn selv' },
  ...EV_MODELS.map(model => ({
    value: model.id,
    label: `${model.name} (${model.batteryCapacity} kWh)`,
  })),
];

export function EVChargingCalculator() {
  const [selectedModel, setSelectedModel] = React.useState('custom');
  const [batteryCapacity, setBatteryCapacity] = React.useState(75);
  const [currentCharge, setCurrentCharge] = React.useState(20);
  const [targetCharge, setTargetCharge] = React.useState(80);
  const [selectedCharger, setSelectedCharger] = React.useState('ac-1ph-32a');
  const [customChargerPower, setCustomChargerPower] = React.useState(7.4);
  const [maxChargingRate, setMaxChargingRate] = React.useState(11);
  const [electricityRate, setElectricityRate] = React.useState(1);
  
  const [result, setResult] = React.useState<EVChargingResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  // Update values when model is selected
  React.useEffect(() => {
    if (selectedModel !== 'custom') {
      const model = EV_MODELS.find(m => m.id === selectedModel);
      if (model) {
        setBatteryCapacity(model.batteryCapacity);
        setMaxChargingRate(
          selectedCharger.startsWith('dcfc') 
            ? model.maxDCChargingRate 
            : model.maxACChargingRate
        );
      }
    }
  }, [selectedModel, selectedCharger]);

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      if (currentCharge >= targetCharge) {
        setError('Ladenivå må være høyere enn dagens ladenivå');
        setResult(null);
        return;
      }
      
      const charger = CHARGER_TYPES.find(c => c.id === selectedCharger);
      const chargerPower = charger ? charger.power : customChargerPower;
      
      const input: EVChargingInput = {
        batteryCapacity,
        currentCharge,
        targetCharge,
        chargerPower,
        maxChargingRate,
        efficiency: 0.9,
      };
      
      const calcResult = calculateChargingTime(input);
      setResult(calcResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
      setResult(null);
    }
  }, [batteryCapacity, currentCharge, targetCharge, selectedCharger, customChargerPower, maxChargingRate]);

  const reset = () => {
    setSelectedModel('custom');
    setBatteryCapacity(75);
    setCurrentCharge(20);
    setTargetCharge(80);
    setSelectedCharger('ac-1ph-32a');
    setCustomChargerPower(7.4);
    setMaxChargingRate(11);
    setElectricityRate(1);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  const charger = CHARGER_TYPES.find(c => c.id === selectedCharger);

  return (
    <CalculatorBase
      title="Ladetid for elbil"
      description="Regn ut hvor lang tid det tar å lade elbilen"
      formula="Tid = energi som trengs ÷ (effektiv effekt × virkningsgrad)"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay 
            label="Ladetid" 
            value={result.formattedTime}
            copyable
          />

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Energi som trengs" 
              value={`${result.energyNeeded.toFixed(1).replace('.', ',')} kWh`}
            />
            <ResultDisplay 
              label="Effektiv ladeeffekt" 
              value={`${result.effectiveChargingPower.toFixed(1).replace('.', ',')} kW`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Energi fra nettet" 
              value={`${result.energyFromGrid.toFixed(1).replace('.', ',')} kWh`}
            />
            <ResultDisplay 
              label="Anslått kostnad" 
              value={formatCurrency(result.costEstimate(electricityRate))}
            />
          </div>

          {charger && (
            <div className="bg-muted/50 p-3 rounded-lg text-sm">
              <p className="font-medium mb-1">{charger.name}</p>
              <p className="text-muted-foreground text-xs">{charger.description}</p>
              <p className="text-muted-foreground text-xs mt-1">
                {charger.voltage}V @ {charger.amperage}A = {charger.power}kW
              </p>
            </div>
          )}

          <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-2">
            <p className="font-medium">Ladetips:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Hurtiglading går saktere over 80 % for å skåne batteriet</li>
              <li>• Lading hjemme er billigst for daglig bruk</li>
              <li>• Ladetapet er vanligvis 5–15 %</li>
              <li>• Kaldt vær kan redusere ladefarten med 20–30 %</li>
            </ul>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <SelectInput
          id="ev-model"
          label="Elbilmodell (valgfritt)"
          value={selectedModel}
          onChange={setSelectedModel}
          options={EV_MODEL_OPTIONS}
        />

        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="battery-capacity"
            label="Batterikapasitet"
            value={batteryCapacity}
            onChange={setBatteryCapacity}
            min={10}
            max={200}
            step={1}
            unit="kWh"
            disabled={selectedModel !== 'custom'}
          />
          <NumberInput
            id="max-charging-rate"
            label="Maks ladeeffekt"
            value={maxChargingRate}
            onChange={setMaxChargingRate}
            min={1}
            max={350}
            step={0.5}
            unit="kW"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="current-charge"
            label="Ladenivå nå"
            value={currentCharge}
            onChange={setCurrentCharge}
            min={0}
            max={99}
            step={5}
            unit="%"
          />
          <NumberInput
            id="target-charge"
            label="Ønsket ladenivå"
            value={targetCharge}
            onChange={setTargetCharge}
            min={1}
            max={100}
            step={5}
            unit="%"
          />
        </div>

        <SelectInput
          id="charger-type"
          label="Type lader"
          value={selectedCharger}
          onChange={setSelectedCharger}
          options={CHARGER_OPTIONS}
        />

        <NumberInput
          id="electricity-rate"
          label="Strømpris"
          value={electricityRate}
          onChange={setElectricityRate}
          min={0.01}
          max={10}
          step={0.05}
          unit="kr/kWh"
        />
      </div>
    </CalculatorBase>
  );
}

export default EVChargingCalculator;
