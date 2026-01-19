'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import {
  calculateChargingTime,
  CHARGER_TYPES,
  EV_MODELS,
  type EVChargingInput,
  type EVChargingResult,
} from '@/lib/calculations/auto/ev-charging-calculator';

const CHARGER_OPTIONS = CHARGER_TYPES.map(charger => ({
  value: charger.id,
  label: `${charger.name} (${charger.power}kW)`,
}));

const EV_MODEL_OPTIONS = [
  { value: 'custom', label: 'Custom / Enter Manually' },
  ...EV_MODELS.map(model => ({
    value: model.id,
    label: `${model.name} (${model.batteryCapacity}kWh)`,
  })),
];

export function EVChargingCalculator() {
  const [selectedModel, setSelectedModel] = React.useState('custom');
  const [batteryCapacity, setBatteryCapacity] = React.useState(75);
  const [currentCharge, setCurrentCharge] = React.useState(20);
  const [targetCharge, setTargetCharge] = React.useState(80);
  const [selectedCharger, setSelectedCharger] = React.useState('level2-32a');
  const [customChargerPower, setCustomChargerPower] = React.useState(7.7);
  const [maxChargingRate, setMaxChargingRate] = React.useState(11.5);
  const [electricityRate, setElectricityRate] = React.useState(0.12);
  
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
        setError('Target charge must be greater than current charge');
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
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [batteryCapacity, currentCharge, targetCharge, selectedCharger, customChargerPower, maxChargingRate]);

  const reset = () => {
    setSelectedModel('custom');
    setBatteryCapacity(75);
    setCurrentCharge(20);
    setTargetCharge(80);
    setSelectedCharger('level2-32a');
    setCustomChargerPower(7.7);
    setMaxChargingRate(11.5);
    setElectricityRate(0.12);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  const charger = CHARGER_TYPES.find(c => c.id === selectedCharger);

  return (
    <CalculatorBase
      title="EV Charging Time Calculator"
      description="Calculate how long it takes to charge your electric vehicle"
      formula="Time = Energy Needed / (Effective Power × Efficiency)"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay 
            label="Charging Time" 
            value={result.formattedTime}
            copyable
          />

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Energy Needed" 
              value={`${result.energyNeeded.toFixed(1)} kWh`}
            />
            <ResultDisplay 
              label="Effective Power" 
              value={`${result.effectiveChargingPower.toFixed(1)} kW`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Energy from Grid" 
              value={`${result.energyFromGrid.toFixed(1)} kWh`}
            />
            <ResultDisplay 
              label="Estimated Cost" 
              value={`$${result.costEstimate(electricityRate).toFixed(2)}`}
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
            <p className="font-medium">Charging Tips:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• DC fast charging slows down above 80% to protect battery</li>
              <li>• Level 2 charging is most cost-effective for daily use</li>
              <li>• Charging efficiency is typically 85-95%</li>
              <li>• Cold weather can reduce charging speed by 20-30%</li>
            </ul>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <SelectInput
          id="ev-model"
          label="EV Model (Optional)"
          value={selectedModel}
          onChange={setSelectedModel}
          options={EV_MODEL_OPTIONS}
        />

        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="battery-capacity"
            label="Battery Capacity"
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
            label="Max Charging Rate"
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
            label="Current Charge"
            value={currentCharge}
            onChange={setCurrentCharge}
            min={0}
            max={99}
            step={5}
            unit="%"
          />
          <NumberInput
            id="target-charge"
            label="Target Charge"
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
          label="Charger Type"
          value={selectedCharger}
          onChange={setSelectedCharger}
          options={CHARGER_OPTIONS}
        />

        <NumberInput
          id="electricity-rate"
          label="Electricity Rate"
          value={electricityRate}
          onChange={setElectricityRate}
          min={0.01}
          max={1}
          step={0.01}
          unit="$/kWh"
        />
      </div>
    </CalculatorBase>
  );
}

export default EVChargingCalculator;
