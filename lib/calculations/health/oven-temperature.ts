/**
 * Ovnstemperatur
 *
 * Gjør om mellom Fahrenheit, Celsius og gas mark (britiske oppskrifter).
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
  /** Anbefalt temperatur ved varmluft (ca. 20 °C lavere) */
  fanCelsius: number;
  gasMark: number | string;
  description: string;
}

// Gas mark to Fahrenheit mapping
const GAS_MARK_TO_F: Record<number, number> = {
  0.25: 225, 0.5: 250, 1: 275, 2: 300, 3: 325, 4: 350,
  5: 375, 6: 400, 7: 425, 8: 450, 9: 475, 10: 500,
};

const TEMP_DESCRIPTIONS: Array<{ maxF: number; description: string }> = [
  { maxF: 250, description: 'Svært lav / holde varm' },
  { maxF: 300, description: 'Lav / langtidssteking' },
  { maxF: 350, description: 'Middels' },
  { maxF: 400, description: 'Middels høy' },
  { maxF: 450, description: 'Høy' },
  { maxF: 500, description: 'Svært høy' },
  { maxF: 600, description: 'Ekstremt høy / grill' },
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
  
  const description = TEMP_DESCRIPTIONS.find(d => fahrenheit <= d.maxF)?.description || 'Ekstremt høy';

  return {
    fahrenheit: Math.round(fahrenheit),
    celsius: Math.round(celsius),
    fanCelsius: Math.round(celsius - 20),
    gasMark,
    description,
  };
}

export function getCommonTemperatures(): Array<{ fahrenheit: number; celsius: number; use: string }> {
  return [
    { fahrenheit: 250, celsius: 120, use: 'Langtidssteking, tørking' },
    { fahrenheit: 300, celsius: 150, use: 'Langtidskoking, grytestek' },
    { fahrenheit: 325, celsius: 165, use: 'Steking av kjøtt' },
    { fahrenheit: 350, celsius: 175, use: 'Kaker og kjeks' },
    { fahrenheit: 375, celsius: 190, use: 'Brød og bakverk' },
    { fahrenheit: 400, celsius: 200, use: 'Ovnsbakte grønnsaker' },
    { fahrenheit: 425, celsius: 220, use: 'Pizza, sterk varme' },
    { fahrenheit: 450, celsius: 230, use: 'Sprø skorper, avsvidning' },
    { fahrenheit: 500, celsius: 260, use: 'Pizzastein, grilling' },
  ];
}
