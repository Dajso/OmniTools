/**
 * Oven Temperature Converter
 * 
 * Converts between Fahrenheit, Celsius, and gas marks.
 * 
 * @module lib/calculations/health/oven-temperature
 * @see Requirements 6.19
 */

export type TemperatureUnit = 'fahrenheit' | 'celsius' | 'gas_mark';

export interface OvenTempInputs {
  value: number;
  fromUnit: TemperatureUnit;
}

export interface OvenTempResults {
  fahrenheit: number;
  celsius: number;
  gasMark: number | string;
  description: string;
}

// Gas mark to Fahrenheit mapping
const GAS_MARK_TO_F: Record<number, number> = {
  0.25: 225, 0.5: 250, 1: 275, 2: 300, 3: 325, 4: 350,
  5: 375, 6: 400, 7: 425, 8: 450, 9: 475, 10: 500,
};

const TEMP_DESCRIPTIONS: Array<{ maxF: number; description: string }> = [
  { maxF: 250, description: 'Very Low / Warming' },
  { maxF: 300, description: 'Low / Slow' },
  { maxF: 350, description: 'Moderate' },
  { maxF: 400, description: 'Moderately Hot' },
  { maxF: 450, description: 'Hot' },
  { maxF: 500, description: 'Very Hot' },
  { maxF: 600, description: 'Extremely Hot / Broil' },
];

function fahrenheitToCelsius(f: number): number {
  return (f - 32) * 5 / 9;
}

function celsiusToFahrenheit(c: number): number {
  return c * 9 / 5 + 32;
}

function fahrenheitToGasMark(f: number): number | string {
  // Find closest gas mark
  let closest = 0.25;
  let minDiff = Math.abs(f - GAS_MARK_TO_F[0.25]);
  
  for (const [mark, temp] of Object.entries(GAS_MARK_TO_F)) {
    const diff = Math.abs(f - temp);
    if (diff < minDiff) {
      minDiff = diff;
      closest = parseFloat(mark);
    }
  }
  
  if (f < 225) return '< 1/4';
  if (f > 500) return '> 10';
  return closest;
}

function gasMarkToFahrenheit(mark: number): number {
  return GAS_MARK_TO_F[mark] || 350;
}

export function convertOvenTemperature(inputs: OvenTempInputs): OvenTempResults {
  const { value, fromUnit } = inputs;
  let fahrenheit: number;

  switch (fromUnit) {
    case 'fahrenheit':
      fahrenheit = value;
      break;
    case 'celsius':
      fahrenheit = celsiusToFahrenheit(value);
      break;
    case 'gas_mark':
      fahrenheit = gasMarkToFahrenheit(value);
      break;
    default:
      fahrenheit = value;
  }

  const celsius = fahrenheitToCelsius(fahrenheit);
  const gasMark = fahrenheitToGasMark(fahrenheit);
  
  const description = TEMP_DESCRIPTIONS.find(d => fahrenheit <= d.maxF)?.description || 'Extremely Hot';

  return {
    fahrenheit: Math.round(fahrenheit),
    celsius: Math.round(celsius),
    gasMark,
    description,
  };
}

export function getCommonTemperatures(): Array<{ fahrenheit: number; celsius: number; use: string }> {
  return [
    { fahrenheit: 250, celsius: 120, use: 'Slow roasting, drying' },
    { fahrenheit: 300, celsius: 150, use: 'Slow cooking, braising' },
    { fahrenheit: 325, celsius: 165, use: 'Roasting meats' },
    { fahrenheit: 350, celsius: 175, use: 'Baking cakes, cookies' },
    { fahrenheit: 375, celsius: 190, use: 'Baking bread, pastries' },
    { fahrenheit: 400, celsius: 200, use: 'Roasting vegetables' },
    { fahrenheit: 425, celsius: 220, use: 'Pizza, high-heat roasting' },
    { fahrenheit: 450, celsius: 230, use: 'Searing, crispy crusts' },
    { fahrenheit: 500, celsius: 260, use: 'Pizza stone, broiling' },
  ];
}
