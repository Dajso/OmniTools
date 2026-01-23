# Coffee Unit Conversion System

This directory contains unit conversion utilities specifically designed for coffee brewing calculators.

## Overview

The coffee unit conversion system provides:
- Weight conversions (grams ↔ ounces)
- Volume conversions (milliliters ↔ fluid ounces)
- Water volume conversions (liters ↔ gallons)
- Reusable UI components for unit toggles
- Helper functions for input parsing and display formatting

## Files

- **`coffee-units.ts`** - Core conversion functions and utilities
- **`README.md`** - This documentation file

## Usage in Coffee Calculators

### 1. Basic Setup

Import the necessary functions and types:

```typescript
import { 
  UnitSystem,
  parseWeightInput,
  parseVolumeInput,
  getWeightDisplayValue,
  getVolumeDisplayValue,
  getWeightUnit,
  getVolumeUnit,
  getWeightConstraints,
  getVolumeConstraints,
} from '@/lib/conversions/coffee-units';
import { UnitToggle } from '@/components/ui/unit-toggle';
```

### 2. State Management

Add unit system state to your calculator component:

```typescript
const [unitSystem, setUnitSystem] = React.useState<UnitSystem>('metric');
```

### 3. Store Values in Base Units

Always store values internally in base units (grams for weight, milliliters for volume):

```typescript
// Internal state - always in base units
const [coffeeDose, setCoffeeDose] = React.useState(18); // grams
const [waterAmount, setWaterAmount] = React.useState(300); // milliliters
```

### 4. Display Values in Current Unit System

Convert base units to display units when rendering inputs:

```typescript
const displayCoffeeDose = getWeightDisplayValue(coffeeDose, unitSystem);
const displayWaterAmount = getVolumeDisplayValue(waterAmount, unitSystem);
```

### 5. Parse Input Values

Convert user input back to base units when handling changes:

```typescript
const handleCoffeeDoseChange = (value: number) => {
  const grams = parseWeightInput(value, unitSystem);
  setCoffeeDose(grams);
};

const handleWaterAmountChange = (value: number) => {
  const ml = parseVolumeInput(value, unitSystem);
  setWaterAmount(ml);
};
```

### 6. Set Input Constraints

Get appropriate min/max/step values for the current unit system:

```typescript
const coffeeConstraints = getWeightConstraints(
  10,   // min grams
  100,  // max grams
  1,    // step grams
  unitSystem
);

<NumberInput
  value={displayCoffeeDose}
  onChange={handleCoffeeDoseChange}
  min={coffeeConstraints.min}
  max={coffeeConstraints.max}
  step={coffeeConstraints.step}
  unit={getWeightUnit(unitSystem)}
/>
```

### 7. Add Unit Toggle

Include the unit toggle component in your calculator:

```typescript
<UnitToggle 
  value={unitSystem} 
  onChange={setUnitSystem}
  className="pb-2"
/>
```

## Complete Example

```typescript
import * as React from 'react';
import { 
  UnitSystem,
  parseWeightInput,
  parseVolumeInput,
  getWeightDisplayValue,
  getVolumeDisplayValue,
  getWeightUnit,
  getVolumeUnit,
  getWeightConstraints,
  getVolumeConstraints,
} from '@/lib/conversions/coffee-units';
import { UnitToggle } from '@/components/ui/unit-toggle';
import { NumberInput } from '@/components/ui/number-input';

export function BrewRatioCalculator() {
  // Unit system state
  const [unitSystem, setUnitSystem] = React.useState<UnitSystem>('metric');
  
  // Internal state - always in base units (grams, ml)
  const [coffeeDose, setCoffeeDose] = React.useState(18);
  const [waterAmount, setWaterAmount] = React.useState(300);
  
  // Calculate brew ratio (unit-independent)
  const brewRatio = waterAmount / coffeeDose;
  
  // Get display values
  const displayCoffeeDose = getWeightDisplayValue(coffeeDose, unitSystem);
  const displayWaterAmount = getVolumeDisplayValue(waterAmount, unitSystem);
  
  // Get constraints
  const coffeeConstraints = getWeightConstraints(10, 100, 1, unitSystem);
  const waterConstraints = getVolumeConstraints(100, 1000, 10, unitSystem);
  
  // Input handlers
  const handleCoffeeDoseChange = (value: number) => {
    const grams = parseWeightInput(value, unitSystem);
    setCoffeeDose(grams);
  };
  
  const handleWaterAmountChange = (value: number) => {
    const ml = parseVolumeInput(value, unitSystem);
    setWaterAmount(ml);
  };
  
  return (
    <div>
      <UnitToggle value={unitSystem} onChange={setUnitSystem} />
      
      <NumberInput
        label="Coffee Dose"
        value={displayCoffeeDose}
        onChange={handleCoffeeDoseChange}
        min={coffeeConstraints.min}
        max={coffeeConstraints.max}
        step={coffeeConstraints.step}
        unit={getWeightUnit(unitSystem)}
      />
      
      <NumberInput
        label="Water Amount"
        value={displayWaterAmount}
        onChange={handleWaterAmountChange}
        min={waterConstraints.min}
        max={waterConstraints.max}
        step={waterConstraints.step}
        unit={getVolumeUnit(unitSystem)}
      />
      
      <div>
        Brew Ratio: 1:{brewRatio.toFixed(1)}
      </div>
    </div>
  );
}
```

## Key Principles

### 1. Store in Base Units
Always store values internally in base units (grams, milliliters). This ensures:
- Calculations are unit-independent
- No conversion errors in business logic
- Easy to switch between unit systems

### 2. Convert at Display Boundaries
Only convert units when:
- Displaying values to the user
- Receiving input from the user
- Setting input constraints (min/max/step)

### 3. Calculations are Unit-Independent
All calculations should work with base units:
```typescript
// ✅ Good - uses base units
const brewRatio = waterAmountMl / coffeeDoseGrams;

// ❌ Bad - mixes units
const brewRatio = waterAmountFlOz / coffeeDoseGrams;
```

### 4. Round-Trip Accuracy
The conversion system maintains accuracy within 0.1% for round-trip conversions:
```typescript
const original = 18; // grams
const ounces = gramsToOunces(original);
const backToGrams = ouncesToGrams(ounces);
// backToGrams ≈ 18 (within 0.1%)
```

## Available Functions

### Conversion Functions
- `gramsToOunces(grams)` - Convert weight from grams to ounces
- `ouncesToGrams(ounces)` - Convert weight from ounces to grams
- `mlToFlOz(ml)` - Convert volume from milliliters to fluid ounces
- `flOzToMl(flOz)` - Convert volume from fluid ounces to milliliters
- `litersToGallons(liters)` - Convert water volume from liters to gallons
- `gallonsToLiters(gallons)` - Convert water volume from gallons to liters

### Generic Conversion Functions
- `convertWeight(value, fromUnit, toUnit)` - Convert weight between units
- `convertVolume(value, fromUnit, toUnit)` - Convert volume between units

### Unit System Helpers
- `getWeightUnit(system)` - Get weight unit for system ('g' or 'oz')
- `getVolumeUnit(system)` - Get volume unit for system ('ml' or 'fl oz')

### Formatting Functions
- `formatWeight(grams, system, decimals?)` - Format weight for display
- `formatVolume(ml, system, decimals?)` - Format volume for display

### Input/Display Functions
- `parseWeightInput(value, system)` - Convert input to grams
- `parseVolumeInput(value, system)` - Convert input to milliliters
- `getWeightDisplayValue(grams, system)` - Convert grams to display value
- `getVolumeDisplayValue(ml, system)` - Convert ml to display value

### Constraint Functions
- `getWeightConstraints(min, max, step, system)` - Get input constraints for weight
- `getVolumeConstraints(min, max, step, system)` - Get input constraints for volume

## Testing

The conversion system includes comprehensive tests:

### Unit Tests
- `tests/unit/coffee-unit-conversions.test.ts` - Tests all conversion functions
- 31 test cases covering conversions, formatting, parsing, and edge cases

### Property-Based Tests
- `tests/property/coffee-unit-conversion-roundtrip.test.ts` - Tests round-trip accuracy
- 17 property tests with 100+ iterations each
- Validates Requirements 13.2 (round-trip accuracy) and 13.3 (calculation invariance)

Run tests with:
```bash
npm test -- tests/unit/coffee-unit-conversions.test.ts
npm test -- tests/property/coffee-unit-conversion-roundtrip.test.ts
```

## Conversion Factors

The system uses the following conversion factors:

| Conversion | Factor |
|------------|--------|
| Grams to Ounces | 0.035274 |
| Ounces to Grams | 28.3495 |
| Milliliters to Fluid Ounces | 0.033814 |
| Fluid Ounces to Milliliters | 29.5735 |
| Liters to Gallons | 0.264172 |
| Gallons to Liters | 3.78541 |

## Requirements Validation

This system validates the following requirements:

- **Requirement 13.1**: Unit toggle provided for applicable calculators
- **Requirement 13.2**: Round-trip conversion preserves values (within 0.1%)
- **Requirement 13.3**: Unit switching preserves calculation values
- **Requirement 13.4**: Weight displayed in grams (metric) or ounces (imperial)
- **Requirement 13.5**: Volume displayed in milliliters (metric) or fluid ounces (imperial)

## Migration Guide

To add unit conversion to an existing calculator:

1. Add unit system state
2. Wrap existing state values with conversion functions
3. Update input handlers to parse values
4. Update display values with conversion
5. Add unit toggle component
6. Update input constraints
7. Test round-trip conversions

See the complete example above for reference.
