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
    name: 'Fot',
    symbol: 'ft',
    category: 'length',
    toBase: (v) => v * 0.3048,
    fromBase: (v) => v / 0.3048,
  },
  inch: {
    id: 'inch',
    name: 'Tomme',
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
    name: 'Engelsk mil',
    symbol: 'mi',
    category: 'length',
    toBase: (v) => v * 1609.344,
    fromBase: (v) => v / 1609.344,
  },
  norwegianMile: {
    id: 'norwegianMile',
    name: 'Norsk mil',
    symbol: 'mil',
    category: 'length',
    toBase: (v) => v * 10000,
    fromBase: (v) => v / 10000,
  },
  nauticalMile: {
    id: 'nauticalMile',
    name: 'Nautisk mil',
    symbol: 'nmi',
    category: 'length',
    toBase: (v) => v * 1852,
    fromBase: (v) => v / 1852,
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
    name: 'Pund',
    symbol: 'lb',
    category: 'weight',
    toBase: (v) => v * 0.45359237,
    fromBase: (v) => v / 0.45359237,
  },
  ounce: {
    id: 'ounce',
    name: 'Unse',
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
  tonne: {
    id: 'tonne',
    name: 'Tonn',
    symbol: 't',
    category: 'weight',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
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
    symbol: 'l',
    category: 'volume',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  milliliter: {
    id: 'milliliter',
    name: 'Milliliter',
    symbol: 'ml',
    category: 'volume',
    toBase: (v) => v * 0.001,
    fromBase: (v) => v / 0.001,
  },
  deciliter: {
    id: 'deciliter',
    name: 'Desiliter',
    symbol: 'dl',
    category: 'volume',
    toBase: (v) => v * 0.1,
    fromBase: (v) => v / 0.1,
  },
  centiliter: {
    id: 'centiliter',
    name: 'Centiliter',
    symbol: 'cl',
    category: 'volume',
    toBase: (v) => v * 0.01,
    fromBase: (v) => v / 0.01,
  },
  cubicMeter: {
    id: 'cubicMeter',
    name: 'Kubikkmeter',
    symbol: 'm³',
    category: 'volume',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
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
    name: 'Kopp (US)',
    symbol: 'kopp',
    category: 'volume',
    toBase: (v) => v * 0.2365882365,
    fromBase: (v) => v / 0.2365882365,
  },
  fluidOunce: {
    id: 'fluidOunce',
    name: 'Flytende unse (US)',
    symbol: 'fl oz',
    category: 'volume',
    toBase: (v) => v * 0.0295735295625,
    fromBase: (v) => v / 0.0295735295625,
  },
  tablespoon: {
    id: 'tablespoon',
    name: 'Spiseskje',
    symbol: 'ss',
    category: 'volume',
    toBase: (v) => v * 0.015,
    fromBase: (v) => v / 0.015,
  },
  teaspoon: {
    id: 'teaspoon',
    name: 'Teskje',
    symbol: 'ts',
    category: 'volume',
    toBase: (v) => v * 0.005,
    fromBase: (v) => v / 0.005,
  },
};

// Area units (base unit: square meters)
export const areaUnits: Record<string, ConversionUnit> = {
  squareMeter: {
    id: 'squareMeter',
    name: 'Kvadratmeter',
    symbol: 'm²',
    category: 'area',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  squareCentimeter: {
    id: 'squareCentimeter',
    name: 'Kvadratcentimeter',
    symbol: 'cm²',
    category: 'area',
    toBase: (v) => v * 0.0001,
    fromBase: (v) => v / 0.0001,
  },
  squareKilometer: {
    id: 'squareKilometer',
    name: 'Kvadratkilometer',
    symbol: 'km²',
    category: 'area',
    toBase: (v) => v * 1000000,
    fromBase: (v) => v / 1000000,
  },
  squareFoot: {
    id: 'squareFoot',
    name: 'Kvadratfot',
    symbol: 'ft²',
    category: 'area',
    toBase: (v) => v * 0.09290304,
    fromBase: (v) => v / 0.09290304,
  },
  squareYard: {
    id: 'squareYard',
    name: 'Kvadratyard',
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
    name: 'Hektar',
    symbol: 'ha',
    category: 'area',
    toBase: (v) => v * 10000,
    fromBase: (v) => v / 10000,
  },
  decare: {
    id: 'decare',
    name: 'Dekar (mål)',
    symbol: 'daa',
    category: 'area',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
};

// Speed units (base unit: meters per second)
export const speedUnits: Record<string, ConversionUnit> = {
  meterPerSecond: {
    id: 'meterPerSecond',
    name: 'Meter per sekund',
    symbol: 'm/s',
    category: 'speed',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  kilometerPerHour: {
    id: 'kilometerPerHour',
    name: 'Kilometer i timen',
    symbol: 'km/t',
    category: 'speed',
    toBase: (v) => v / 3.6,
    fromBase: (v) => v * 3.6,
  },
  milePerHour: {
    id: 'milePerHour',
    name: 'Engelsk mil i timen',
    symbol: 'mph',
    category: 'speed',
    toBase: (v) => v * 0.44704,
    fromBase: (v) => v / 0.44704,
  },
  knot: {
    id: 'knot',
    name: 'Knop',
    symbol: 'kn',
    category: 'speed',
    toBase: (v) => v * 0.514444,
    fromBase: (v) => v / 0.514444,
  },
  footPerSecond: {
    id: 'footPerSecond',
    name: 'Fot per sekund',
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
    name: 'Sekund',
    symbol: 's',
    category: 'time',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  millisecond: {
    id: 'millisecond',
    name: 'Millisekund',
    symbol: 'ms',
    category: 'time',
    toBase: (v) => v * 0.001,
    fromBase: (v) => v / 0.001,
  },
  minute: {
    id: 'minute',
    name: 'Minutt',
    symbol: 'min',
    category: 'time',
    toBase: (v) => v * 60,
    fromBase: (v) => v / 60,
  },
  hour: {
    id: 'hour',
    name: 'Time',
    symbol: 't',
    category: 'time',
    toBase: (v) => v * 3600,
    fromBase: (v) => v / 3600,
  },
  day: {
    id: 'day',
    name: 'Døgn',
    symbol: 'd',
    category: 'time',
    toBase: (v) => v * 86400,
    fromBase: (v) => v / 86400,
  },
  week: {
    id: 'week',
    name: 'Uke',
    symbol: 'u',
    category: 'time',
    toBase: (v) => v * 604800,
    fromBase: (v) => v / 604800,
  },
  month: {
    id: 'month',
    name: 'Måned (30 dager)',
    symbol: 'md',
    category: 'time',
    toBase: (v) => v * 2592000,
    fromBase: (v) => v / 2592000,
  },
  year: {
    id: 'year',
    name: 'År (365 dager)',
    symbol: 'år',
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
  hectopascal: {
    id: 'hectopascal',
    name: 'Hektopascal (millibar)',
    symbol: 'hPa',
    category: 'pressure',
    toBase: (v) => v * 100,
    fromBase: (v) => v / 100,
  },
  mmHg: {
    id: 'mmHg',
    name: 'Millimeter kvikksølv',
    symbol: 'mmHg',
    category: 'pressure',
    toBase: (v) => v * 133.322387415,
    fromBase: (v) => v / 133.322387415,
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
    name: 'Atmosfære',
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
  megajoule: {
    id: 'megajoule',
    name: 'Megajoule',
    symbol: 'MJ',
    category: 'energy',
    toBase: (v) => v * 1000000,
    fromBase: (v) => v / 1000000,
  },
  calorie: {
    id: 'calorie',
    name: 'Kalori',
    symbol: 'cal',
    category: 'energy',
    toBase: (v) => v * 4.184,
    fromBase: (v) => v / 4.184,
  },
  kilocalorie: {
    id: 'kilocalorie',
    name: 'Kilokalori',
    symbol: 'kcal',
    category: 'energy',
    toBase: (v) => v * 4184,
    fromBase: (v) => v / 4184,
  },
  wattHour: {
    id: 'wattHour',
    name: 'Wattime',
    symbol: 'Wh',
    category: 'energy',
    toBase: (v) => v * 3600,
    fromBase: (v) => v / 3600,
  },
  kilowattHour: {
    id: 'kilowattHour',
    name: 'Kilowattime',
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


// Vinkel (grunnenhet: grader)
export const angleUnits: Record<string, ConversionUnit> = {
  degree: {
    id: 'degree',
    name: 'Grader',
    symbol: '°',
    category: 'angle',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  radian: {
    id: 'radian',
    name: 'Radianer',
    symbol: 'rad',
    category: 'angle',
    toBase: (v) => v * (180 / Math.PI),
    fromBase: (v) => v / (180 / Math.PI),
  },
  gradian: {
    id: 'gradian',
    name: 'Gon (nygrader)',
    symbol: 'gon',
    category: 'angle',
    toBase: (v) => v * 0.9,
    fromBase: (v) => v / 0.9,
  },
  arcMinute: {
    id: 'arcMinute',
    name: 'Bueminutter',
    symbol: '′',
    category: 'angle',
    toBase: (v) => v * (1 / 60),
    fromBase: (v) => v / (1 / 60),
  },
  arcSecond: {
    id: 'arcSecond',
    name: 'Buesekunder',
    symbol: '″',
    category: 'angle',
    toBase: (v) => v * (1 / 3600),
    fromBase: (v) => v / (1 / 3600),
  },
  turn: {
    id: 'turn',
    name: 'Hele omdreininger',
    symbol: 'omdr.',
    category: 'angle',
    toBase: (v) => v * 360,
    fromBase: (v) => v / 360,
  },
};

// Frekvens (grunnenhet: hertz)
export const frequencyUnits: Record<string, ConversionUnit> = {
  hertz: {
    id: 'hertz',
    name: 'Hertz',
    symbol: 'Hz',
    category: 'frequency',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  kilohertz: {
    id: 'kilohertz',
    name: 'Kilohertz',
    symbol: 'kHz',
    category: 'frequency',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  megahertz: {
    id: 'megahertz',
    name: 'Megahertz',
    symbol: 'MHz',
    category: 'frequency',
    toBase: (v) => v * 1000000,
    fromBase: (v) => v / 1000000,
  },
  gigahertz: {
    id: 'gigahertz',
    name: 'Gigahertz',
    symbol: 'GHz',
    category: 'frequency',
    toBase: (v) => v * 1000000000,
    fromBase: (v) => v / 1000000000,
  },
  revolutionsPerMinute: {
    id: 'revolutionsPerMinute',
    name: 'Omdreininger per minutt',
    symbol: 'o/min',
    category: 'frequency',
    toBase: (v) => v * (1 / 60),
    fromBase: (v) => v / (1 / 60),
  },
};

// Drivstofforbruk (grunnenhet: liter per 100 km). Enkelte enheter er omvendte (km per liter, mpg).
export const fuelEconomyUnits: Record<string, ConversionUnit> = {
  litersPer100Km: {
    id: 'litersPer100Km',
    name: 'Liter per 100 km',
    symbol: 'l/100 km',
    category: 'fuelEconomy',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  litersPerMil: {
    id: 'litersPerMil',
    name: 'Liter per mil (10 km)',
    symbol: 'l/mil',
    category: 'fuelEconomy',
    toBase: (v) => v * 10,
    fromBase: (v) => v / 10,
  },
  kmPerLiter: {
    id: 'kmPerLiter',
    name: 'Kilometer per liter',
    symbol: 'km/l',
    category: 'fuelEconomy',
    toBase: (v) => 100 / v,
    fromBase: (v) => 100 / v,
  },
  mpgUs: {
    id: 'mpgUs',
    name: 'Miles per gallon (US)',
    symbol: 'mpg (US)',
    category: 'fuelEconomy',
    toBase: (v) => 235.214583 / v,
    fromBase: (v) => 235.214583 / v,
  },
  mpgUk: {
    id: 'mpgUk',
    name: 'Miles per gallon (UK)',
    symbol: 'mpg (UK)',
    category: 'fuelEconomy',
    toBase: (v) => 282.480936 / v,
    fromBase: (v) => 282.480936 / v,
  },
};

// Effekt (grunnenhet: watt)
export const powerUnits: Record<string, ConversionUnit> = {
  watt: {
    id: 'watt',
    name: 'Watt',
    symbol: 'W',
    category: 'power',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  kilowatt: {
    id: 'kilowatt',
    name: 'Kilowatt',
    symbol: 'kW',
    category: 'power',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  megawatt: {
    id: 'megawatt',
    name: 'Megawatt',
    symbol: 'MW',
    category: 'power',
    toBase: (v) => v * 1000000,
    fromBase: (v) => v / 1000000,
  },
  horsepowerMetric: {
    id: 'horsepowerMetric',
    name: 'Hestekrefter (hk, metrisk)',
    symbol: 'hk',
    category: 'power',
    toBase: (v) => v * 735.49875,
    fromBase: (v) => v / 735.49875,
  },
  horsepowerMechanical: {
    id: 'horsepowerMechanical',
    name: 'Hestekrefter (hp, engelsk)',
    symbol: 'hp',
    category: 'power',
    toBase: (v) => v * 745.699872,
    fromBase: (v) => v / 745.699872,
  },
  btuPerHour: {
    id: 'btuPerHour',
    name: 'BTU per time',
    symbol: 'BTU/t',
    category: 'power',
    toBase: (v) => v * 0.29307107,
    fromBase: (v) => v / 0.29307107,
  },
};

// Dreiemoment (grunnenhet: newtonmeter)
export const torqueUnits: Record<string, ConversionUnit> = {
  newtonMeter: {
    id: 'newtonMeter',
    name: 'Newtonmeter',
    symbol: 'Nm',
    category: 'torque',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  kilonewtonMeter: {
    id: 'kilonewtonMeter',
    name: 'Kilonewtonmeter',
    symbol: 'kNm',
    category: 'torque',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  kilopondMeter: {
    id: 'kilopondMeter',
    name: 'Kilopondmeter',
    symbol: 'kpm',
    category: 'torque',
    toBase: (v) => v * 9.80665,
    fromBase: (v) => v / 9.80665,
  },
  footPound: {
    id: 'footPound',
    name: 'Fot-pund',
    symbol: 'ft·lb',
    category: 'torque',
    toBase: (v) => v * 1.3558179483,
    fromBase: (v) => v / 1.3558179483,
  },
  inchPound: {
    id: 'inchPound',
    name: 'Tomme-pund',
    symbol: 'in·lb',
    category: 'torque',
    toBase: (v) => v * 0.1129848290,
    fromBase: (v) => v / 0.1129848290,
  },
};

// Kraft (grunnenhet: newton)
export const forceUnits: Record<string, ConversionUnit> = {
  newton: {
    id: 'newton',
    name: 'Newton',
    symbol: 'N',
    category: 'force',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  kilonewton: {
    id: 'kilonewton',
    name: 'Kilonewton',
    symbol: 'kN',
    category: 'force',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  kilopond: {
    id: 'kilopond',
    name: 'Kilopond (kp)',
    symbol: 'kp',
    category: 'force',
    toBase: (v) => v * 9.80665,
    fromBase: (v) => v / 9.80665,
  },
  poundForce: {
    id: 'poundForce',
    name: 'Pund-kraft',
    symbol: 'lbf',
    category: 'force',
    toBase: (v) => v * 4.4482216153,
    fromBase: (v) => v / 4.4482216153,
  },
};

// Tetthet (grunnenhet: kg/m³)
export const densityUnits: Record<string, ConversionUnit> = {
  kilogramPerCubicMeter: {
    id: 'kilogramPerCubicMeter',
    name: 'Kilogram per kubikkmeter',
    symbol: 'kg/m³',
    category: 'density',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  kilogramPerLiter: {
    id: 'kilogramPerLiter',
    name: 'Kilogram per liter',
    symbol: 'kg/l',
    category: 'density',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  gramPerCubicCentimeter: {
    id: 'gramPerCubicCentimeter',
    name: 'Gram per kubikkcentimeter',
    symbol: 'g/cm³',
    category: 'density',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  poundPerCubicFoot: {
    id: 'poundPerCubicFoot',
    name: 'Pund per kubikkfot',
    symbol: 'lb/ft³',
    category: 'density',
    toBase: (v) => v * 16.01846337,
    fromBase: (v) => v / 16.01846337,
  },
};

// Belysningsstyrke (grunnenhet: lux)
export const illuminanceUnits: Record<string, ConversionUnit> = {
  lux: {
    id: 'lux',
    name: 'Lux',
    symbol: 'lx',
    category: 'illuminance',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  kilolux: {
    id: 'kilolux',
    name: 'Kilolux',
    symbol: 'klx',
    category: 'illuminance',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  footCandle: {
    id: 'footCandle',
    name: 'Foot-candle',
    symbol: 'fc',
    category: 'illuminance',
    toBase: (v) => v * 10.7639104,
    fromBase: (v) => v / 10.7639104,
  },
  phot: {
    id: 'phot',
    name: 'Phot',
    symbol: 'ph',
    category: 'illuminance',
    toBase: (v) => v * 10000,
    fromBase: (v) => v / 10000,
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
  angle: angleUnits,
  frequency: frequencyUnits,
  fuelEconomy: fuelEconomyUnits,
  power: powerUnits,
  torque: torqueUnits,
  force: forceUnits,
  density: densityUnits,
  illuminance: illuminanceUnits,
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
