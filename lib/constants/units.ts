import { ConversionUnit, UnitCategory } from './types';

// Length units (base unit: meters)
export const lengthUnits: Record<string, ConversionUnit> = {
  meter: {
    id: 'meter',
    name: 'Meter',
    symbol: 'm',
    category: 'length',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  kilometer: {
    id: 'kilometer',
    name: 'Kilometer',
    symbol: 'km',
    category: 'length',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  centimeter: {
    id: 'centimeter',
    name: 'Centimeter',
    symbol: 'cm',
    category: 'length',
    toBase: (v) => v * 0.01,
    fromBase: (v) => v / 0.01,
  },
  millimeter: {
    id: 'millimeter',
    name: 'Millimeter',
    symbol: 'mm',
    category: 'length',
    toBase: (v) => v * 0.001,
    fromBase: (v) => v / 0.001,
  },
  foot: {
    id: 'foot',
    name: 'Foot',
    symbol: 'ft',
    category: 'length',
    toBase: (v) => v * 0.3048,
    fromBase: (v) => v / 0.3048,
  },
  inch: {
    id: 'inch',
    name: 'Inch',
    symbol: 'in',
    category: 'length',
    toBase: (v) => v * 0.0254,
    fromBase: (v) => v / 0.0254,
  },
  yard: {
    id: 'yard',
    name: 'Yard',
    symbol: 'yd',
    category: 'length',
    toBase: (v) => v * 0.9144,
    fromBase: (v) => v / 0.9144,
  },
  mile: {
    id: 'mile',
    name: 'Mile',
    symbol: 'mi',
    category: 'length',
    toBase: (v) => v * 1609.344,
    fromBase: (v) => v / 1609.344,
  },
};

// Weight units (base unit: kilograms)
export const weightUnits: Record<string, ConversionUnit> = {
  kilogram: {
    id: 'kilogram',
    name: 'Kilogram',
    symbol: 'kg',
    category: 'weight',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  gram: {
    id: 'gram',
    name: 'Gram',
    symbol: 'g',
    category: 'weight',
    toBase: (v) => v * 0.001,
    fromBase: (v) => v / 0.001,
  },
  milligram: {
    id: 'milligram',
    name: 'Milligram',
    symbol: 'mg',
    category: 'weight',
    toBase: (v) => v * 0.000001,
    fromBase: (v) => v / 0.000001,
  },
  pound: {
    id: 'pound',
    name: 'Pound',
    symbol: 'lb',
    category: 'weight',
    toBase: (v) => v * 0.45359237,
    fromBase: (v) => v / 0.45359237,
  },
  ounce: {
    id: 'ounce',
    name: 'Ounce',
    symbol: 'oz',
    category: 'weight',
    toBase: (v) => v * 0.028349523125,
    fromBase: (v) => v / 0.028349523125,
  },
  stone: {
    id: 'stone',
    name: 'Stone',
    symbol: 'st',
    category: 'weight',
    toBase: (v) => v * 6.35029318,
    fromBase: (v) => v / 6.35029318,
  },
};

// Temperature units (special handling - not linear)
export const temperatureUnits: Record<string, ConversionUnit> = {
  celsius: {
    id: 'celsius',
    name: 'Celsius',
    symbol: '°C',
    category: 'temperature',
    toBase: (v) => v, // Celsius is base
    fromBase: (v) => v,
  },
  fahrenheit: {
    id: 'fahrenheit',
    name: 'Fahrenheit',
    symbol: '°F',
    category: 'temperature',
    toBase: (v) => (v - 32) * 5 / 9,
    fromBase: (v) => v * 9 / 5 + 32,
  },
  kelvin: {
    id: 'kelvin',
    name: 'Kelvin',
    symbol: 'K',
    category: 'temperature',
    toBase: (v) => v - 273.15,
    fromBase: (v) => v + 273.15,
  },
};

// Volume units (base unit: liters)
export const volumeUnits: Record<string, ConversionUnit> = {
  liter: {
    id: 'liter',
    name: 'Liter',
    symbol: 'L',
    category: 'volume',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  milliliter: {
    id: 'milliliter',
    name: 'Milliliter',
    symbol: 'mL',
    category: 'volume',
    toBase: (v) => v * 0.001,
    fromBase: (v) => v / 0.001,
  },
  gallon: {
    id: 'gallon',
    name: 'Gallon (US)',
    symbol: 'gal',
    category: 'volume',
    toBase: (v) => v * 3.785411784,
    fromBase: (v) => v / 3.785411784,
  },
  quart: {
    id: 'quart',
    name: 'Quart (US)',
    symbol: 'qt',
    category: 'volume',
    toBase: (v) => v * 0.946352946,
    fromBase: (v) => v / 0.946352946,
  },
  pint: {
    id: 'pint',
    name: 'Pint (US)',
    symbol: 'pt',
    category: 'volume',
    toBase: (v) => v * 0.473176473,
    fromBase: (v) => v / 0.473176473,
  },
  cup: {
    id: 'cup',
    name: 'Cup (US)',
    symbol: 'cup',
    category: 'volume',
    toBase: (v) => v * 0.2365882365,
    fromBase: (v) => v / 0.2365882365,
  },
  fluidOunce: {
    id: 'fluidOunce',
    name: 'Fluid Ounce (US)',
    symbol: 'fl oz',
    category: 'volume',
    toBase: (v) => v * 0.0295735295625,
    fromBase: (v) => v / 0.0295735295625,
  },
  tablespoon: {
    id: 'tablespoon',
    name: 'Tablespoon',
    symbol: 'tbsp',
    category: 'volume',
    toBase: (v) => v * 0.01478676478125,
    fromBase: (v) => v / 0.01478676478125,
  },
  teaspoon: {
    id: 'teaspoon',
    name: 'Teaspoon',
    symbol: 'tsp',
    category: 'volume',
    toBase: (v) => v * 0.00492892159375,
    fromBase: (v) => v / 0.00492892159375,
  },
};

// Area units (base unit: square meters)
export const areaUnits: Record<string, ConversionUnit> = {
  squareMeter: {
    id: 'squareMeter',
    name: 'Square Meter',
    symbol: 'm²',
    category: 'area',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  squareKilometer: {
    id: 'squareKilometer',
    name: 'Square Kilometer',
    symbol: 'km²',
    category: 'area',
    toBase: (v) => v * 1000000,
    fromBase: (v) => v / 1000000,
  },
  squareFoot: {
    id: 'squareFoot',
    name: 'Square Foot',
    symbol: 'ft²',
    category: 'area',
    toBase: (v) => v * 0.09290304,
    fromBase: (v) => v / 0.09290304,
  },
  squareYard: {
    id: 'squareYard',
    name: 'Square Yard',
    symbol: 'yd²',
    category: 'area',
    toBase: (v) => v * 0.83612736,
    fromBase: (v) => v / 0.83612736,
  },
  acre: {
    id: 'acre',
    name: 'Acre',
    symbol: 'ac',
    category: 'area',
    toBase: (v) => v * 4046.8564224,
    fromBase: (v) => v / 4046.8564224,
  },
  hectare: {
    id: 'hectare',
    name: 'Hectare',
    symbol: 'ha',
    category: 'area',
    toBase: (v) => v * 10000,
    fromBase: (v) => v / 10000,
  },
};

// Speed units (base unit: meters per second)
export const speedUnits: Record<string, ConversionUnit> = {
  meterPerSecond: {
    id: 'meterPerSecond',
    name: 'Meter per Second',
    symbol: 'm/s',
    category: 'speed',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  kilometerPerHour: {
    id: 'kilometerPerHour',
    name: 'Kilometer per Hour',
    symbol: 'km/h',
    category: 'speed',
    toBase: (v) => v / 3.6,
    fromBase: (v) => v * 3.6,
  },
  milePerHour: {
    id: 'milePerHour',
    name: 'Mile per Hour',
    symbol: 'mph',
    category: 'speed',
    toBase: (v) => v * 0.44704,
    fromBase: (v) => v / 0.44704,
  },
  knot: {
    id: 'knot',
    name: 'Knot',
    symbol: 'kn',
    category: 'speed',
    toBase: (v) => v * 0.514444,
    fromBase: (v) => v / 0.514444,
  },
  footPerSecond: {
    id: 'footPerSecond',
    name: 'Foot per Second',
    symbol: 'ft/s',
    category: 'speed',
    toBase: (v) => v * 0.3048,
    fromBase: (v) => v / 0.3048,
  },
};

// Time units (base unit: seconds)
export const timeUnits: Record<string, ConversionUnit> = {
  second: {
    id: 'second',
    name: 'Second',
    symbol: 's',
    category: 'time',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  millisecond: {
    id: 'millisecond',
    name: 'Millisecond',
    symbol: 'ms',
    category: 'time',
    toBase: (v) => v * 0.001,
    fromBase: (v) => v / 0.001,
  },
  minute: {
    id: 'minute',
    name: 'Minute',
    symbol: 'min',
    category: 'time',
    toBase: (v) => v * 60,
    fromBase: (v) => v / 60,
  },
  hour: {
    id: 'hour',
    name: 'Hour',
    symbol: 'h',
    category: 'time',
    toBase: (v) => v * 3600,
    fromBase: (v) => v / 3600,
  },
  day: {
    id: 'day',
    name: 'Day',
    symbol: 'd',
    category: 'time',
    toBase: (v) => v * 86400,
    fromBase: (v) => v / 86400,
  },
  week: {
    id: 'week',
    name: 'Week',
    symbol: 'wk',
    category: 'time',
    toBase: (v) => v * 604800,
    fromBase: (v) => v / 604800,
  },
  month: {
    id: 'month',
    name: 'Month (30 days)',
    symbol: 'mo',
    category: 'time',
    toBase: (v) => v * 2592000,
    fromBase: (v) => v / 2592000,
  },
  year: {
    id: 'year',
    name: 'Year (365 days)',
    symbol: 'yr',
    category: 'time',
    toBase: (v) => v * 31536000,
    fromBase: (v) => v / 31536000,
  },
};

// Data size units (base unit: bytes)
export const dataUnits: Record<string, ConversionUnit> = {
  byte: {
    id: 'byte',
    name: 'Byte',
    symbol: 'B',
    category: 'data',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  kilobyte: {
    id: 'kilobyte',
    name: 'Kilobyte',
    symbol: 'KB',
    category: 'data',
    toBase: (v) => v * 1024,
    fromBase: (v) => v / 1024,
  },
  megabyte: {
    id: 'megabyte',
    name: 'Megabyte',
    symbol: 'MB',
    category: 'data',
    toBase: (v) => v * 1048576,
    fromBase: (v) => v / 1048576,
  },
  gigabyte: {
    id: 'gigabyte',
    name: 'Gigabyte',
    symbol: 'GB',
    category: 'data',
    toBase: (v) => v * 1073741824,
    fromBase: (v) => v / 1073741824,
  },
  terabyte: {
    id: 'terabyte',
    name: 'Terabyte',
    symbol: 'TB',
    category: 'data',
    toBase: (v) => v * 1099511627776,
    fromBase: (v) => v / 1099511627776,
  },
  bit: {
    id: 'bit',
    name: 'Bit',
    symbol: 'b',
    category: 'data',
    toBase: (v) => v * 0.125,
    fromBase: (v) => v / 0.125,
  },
};

// Pressure units (base unit: Pascal)
export const pressureUnits: Record<string, ConversionUnit> = {
  pascal: {
    id: 'pascal',
    name: 'Pascal',
    symbol: 'Pa',
    category: 'pressure',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  kilopascal: {
    id: 'kilopascal',
    name: 'Kilopascal',
    symbol: 'kPa',
    category: 'pressure',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  bar: {
    id: 'bar',
    name: 'Bar',
    symbol: 'bar',
    category: 'pressure',
    toBase: (v) => v * 100000,
    fromBase: (v) => v / 100000,
  },
  psi: {
    id: 'psi',
    name: 'PSI',
    symbol: 'psi',
    category: 'pressure',
    toBase: (v) => v * 6894.757293168,
    fromBase: (v) => v / 6894.757293168,
  },
  atmosphere: {
    id: 'atmosphere',
    name: 'Atmosphere',
    symbol: 'atm',
    category: 'pressure',
    toBase: (v) => v * 101325,
    fromBase: (v) => v / 101325,
  },
};

// Energy units (base unit: Joules)
export const energyUnits: Record<string, ConversionUnit> = {
  joule: {
    id: 'joule',
    name: 'Joule',
    symbol: 'J',
    category: 'energy',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  kilojoule: {
    id: 'kilojoule',
    name: 'Kilojoule',
    symbol: 'kJ',
    category: 'energy',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  calorie: {
    id: 'calorie',
    name: 'Calorie',
    symbol: 'cal',
    category: 'energy',
    toBase: (v) => v * 4.184,
    fromBase: (v) => v / 4.184,
  },
  kilocalorie: {
    id: 'kilocalorie',
    name: 'Kilocalorie',
    symbol: 'kcal',
    category: 'energy',
    toBase: (v) => v * 4184,
    fromBase: (v) => v / 4184,
  },
  wattHour: {
    id: 'wattHour',
    name: 'Watt Hour',
    symbol: 'Wh',
    category: 'energy',
    toBase: (v) => v * 3600,
    fromBase: (v) => v / 3600,
  },
  kilowattHour: {
    id: 'kilowattHour',
    name: 'Kilowatt Hour',
    symbol: 'kWh',
    category: 'energy',
    toBase: (v) => v * 3600000,
    fromBase: (v) => v / 3600000,
  },
  btu: {
    id: 'btu',
    name: 'BTU',
    symbol: 'BTU',
    category: 'energy',
    toBase: (v) => v * 1055.06,
    fromBase: (v) => v / 1055.06,
  },
};

// All units by category
export const unitsByCategory: Record<UnitCategory, Record<string, ConversionUnit>> = {
  length: lengthUnits,
  weight: weightUnits,
  temperature: temperatureUnits,
  volume: volumeUnits,
  area: areaUnits,
  speed: speedUnits,
  time: timeUnits,
  data: dataUnits,
  pressure: pressureUnits,
  energy: energyUnits,
};

// Get all unit pairs for a category
export function getUnitPairs(category: UnitCategory): Array<[string, string]> {
  const units = Object.keys(unitsByCategory[category]);
  const pairs: Array<[string, string]> = [];
  
  for (let i = 0; i < units.length; i++) {
    for (let j = 0; j < units.length; j++) {
      if (i !== j) {
        pairs.push([units[i], units[j]]);
      }
    }
  }
  
  return pairs;
}

// Get unit by ID and category
export function getUnit(category: UnitCategory, unitId: string): ConversionUnit | undefined {
  return unitsByCategory[category]?.[unitId];
}
