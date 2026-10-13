/**
 * EV Charging Time Calculator
 * 
 * Calculates charging time for electric vehicles based on battery capacity,
 * current charge level, target charge level, and charger power.
 * 
 * @module lib/calculations/auto/ev-charging-calculator
 * @see Requirements 28.8, 28.10
 */

/**
 * Charger type with typical power levels
 */
export interface ChargerType {
  id: string;
  name: string;
  /** Power in kW */
  power: number;
  /** Typical voltage */
  voltage: number;
  /** Typical amperage */
  amperage: number;
  /** Description */
  description: string;
}

/**
 * Common charger types
 */
export const CHARGER_TYPES: ChargerType[] = [
  { id: 'ac-1ph-10a', name: 'Vanlig stikkontakt (230 V, 10 A)', power: 2.3, voltage: 230, amperage: 10, description: 'Nødlading fra vanlig skuko-kontakt' },
  { id: 'ac-1ph-16a', name: 'Enfase 230 V, 16 A', power: 3.7, voltage: 230, amperage: 16, description: 'Enkel hjemmelader' },
  { id: 'ac-1ph-32a', name: 'Enfase 230 V, 32 A', power: 7.4, voltage: 230, amperage: 32, description: 'Vanlig hjemmelader (IT-nett)' },
  { id: 'ac-3ph-16a', name: 'Trefase 400 V, 16 A', power: 11, voltage: 400, amperage: 16, description: 'Hjemmelader i TN-nett eller på hytta' },
  { id: 'ac-3ph-32a', name: 'Trefase 400 V, 32 A', power: 22, voltage: 400, amperage: 32, description: 'Kraftig AC-lader (bilen må støtte det)' },
  { id: 'dcfc-50', name: 'Hurtiglader 50 kW', power: 50, voltage: 400, amperage: 125, description: 'Enkel hurtiglader' },
  { id: 'dcfc-150', name: 'Hurtiglader 150 kW', power: 150, voltage: 400, amperage: 375, description: 'Rask hurtiglader' },
  { id: 'dcfc-250', name: 'Hurtiglader 250 kW', power: 250, voltage: 800, amperage: 312, description: 'Superlader (Tesla V3 o.l.)' },
  { id: 'dcfc-350', name: 'Hurtiglader 350 kW', power: 350, voltage: 800, amperage: 437, description: 'Raskeste lader som finnes' },
];

/**
 * Popular EV models with battery specifications
 */
export interface EVModel {
  id: string;
  name: string;
  /** Usable battery capacity in kWh */
  batteryCapacity: number;
  /** Maximum AC charging rate in kW */
  maxACChargingRate: number;
  /** Maximum DC charging rate in kW */
  maxDCChargingRate: number;
  /** EPA-rekkevidde i miles (amerikansk testsyklus) */
  epaRange: number;
}

/**
 * Common EV models
 */
export const EV_MODELS: EVModel[] = [
  {
    id: 'tesla-model3-lr',
    name: 'Tesla Model 3 Long Range',
    batteryCapacity: 82,
    maxACChargingRate: 11.5,
    maxDCChargingRate: 250,
    epaRange: 358,
  },
  {
    id: 'tesla-model3-sr',
    name: 'Tesla Model 3 Standard Range',
    batteryCapacity: 60,
    maxACChargingRate: 11.5,
    maxDCChargingRate: 170,
    epaRange: 272,
  },
  {
    id: 'tesla-modely-lr',
    name: 'Tesla Model Y Long Range',
    batteryCapacity: 81,
    maxACChargingRate: 11.5,
    maxDCChargingRate: 250,
    epaRange: 330,
  },
  {
    id: 'tesla-models-lr',
    name: 'Tesla Model S Long Range',
    batteryCapacity: 100,
    maxACChargingRate: 11.5,
    maxDCChargingRate: 250,
    epaRange: 405,
  },
  {
    id: 'ford-mach-e-er',
    name: 'Ford Mustang Mach-E Extended Range',
    batteryCapacity: 91,
    maxACChargingRate: 10.5,
    maxDCChargingRate: 150,
    epaRange: 312,
  },
  {
    id: 'hyundai-ioniq6-lr',
    name: 'Hyundai Ioniq 6 Long Range',
    batteryCapacity: 77.4,
    maxACChargingRate: 11,
    maxDCChargingRate: 233,
    epaRange: 361,
  },
  {
    id: 'porsche-taycan',
    name: 'Porsche Taycan Performance Battery Plus',
    batteryCapacity: 93.4,
    maxACChargingRate: 22,
    maxDCChargingRate: 270,
    epaRange: 246,
  },
  {
    id: 'bmw-i4-edrive40',
    name: 'BMW i4 eDrive40',
    batteryCapacity: 83.9,
    maxACChargingRate: 11,
    maxDCChargingRate: 200,
    epaRange: 301,
  },
];

/**
 * Input for EV charging calculation
 */
export interface EVChargingInput {
  /** Battery capacity in kWh */
  batteryCapacity: number;
  /** Current state of charge as percentage (0-100) */
  currentCharge: number;
  /** Target state of charge as percentage (0-100) */
  targetCharge: number;
  /** Charger power in kW */
  chargerPower: number;
  /** Maximum vehicle charging rate in kW (optional) */
  maxChargingRate?: number;
  /** Charging efficiency as decimal (default 0.9 for 90%) */
  efficiency?: number;
}

/**
 * Result of EV charging calculation
 */
export interface EVChargingResult {
  /** Energy needed in kWh */
  energyNeeded: number;
  /** Effective charging power in kW (limited by vehicle) */
  effectiveChargingPower: number;
  /** Charging time in hours */
  chargingTimeHours: number;
  /** Charging time in minutes */
  chargingTimeMinutes: number;
  /** Formatted charging time string */
  formattedTime: string;
  /** Energy from grid (accounting for efficiency losses) */
  energyFromGrid: number;
  /** Cost estimate at given rate per kWh */
  costEstimate: (ratePerKwh: number) => number;
  /** Range added in miles (if efficiency provided) */
  rangeAdded?: number;
}

/**
 * Validate charging input parameters
 */
function validateChargingInput(input: EVChargingInput): void {
  if (input.batteryCapacity <= 0) {
    throw new Error('Batterikapasiteten må være større enn null');
  }
  if (input.currentCharge < 0 || input.currentCharge > 100) {
    throw new Error('Dagens ladenivå må være mellom 0 og 100 %');
  }
  if (input.targetCharge < 0 || input.targetCharge > 100) {
    throw new Error('Ønsket ladenivå må være mellom 0 og 100 %');
  }
  if (input.targetCharge <= input.currentCharge) {
    throw new Error('Ladenivå må være høyere enn dagens ladenivå');
  }
  if (input.chargerPower <= 0) {
    throw new Error('Ladeeffekten må være større enn null');
  }
  if (input.maxChargingRate !== undefined && input.maxChargingRate <= 0) {
    throw new Error('Maks ladeeffekt må være større enn null');
  }
  if (input.efficiency !== undefined && (input.efficiency <= 0 || input.efficiency > 1)) {
    throw new Error('Virkningsgraden må være mellom 0 og 1');
  }
}

/**
 * Format duration in hours to human-readable string
 */
function formatDuration(hours: number): string {
  if (hours < 1 / 60) {
    return 'Mindre enn 1 minutt';
  }
  
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  
  if (h === 0) {
    return `${m} min`;
  }
  if (m === 0) {
    return `${h} t`;
  }
  return `${h} t ${m} min`;
}

/**
 * Calculate EV charging time
 * 
 * Formula: time = energyNeeded / effectivePower
 * where energyNeeded = batteryCapacity × (targetCharge - currentCharge) / 100
 * and effectivePower = min(chargerPower, maxChargingRate) × efficiency
 * 
 * @param input - Charging parameters
 * @returns Charging time and related calculations
 */
export function calculateChargingTime(input: EVChargingInput): EVChargingResult {
  validateChargingInput(input);
  
  const efficiency = input.efficiency ?? 0.9;
  
  // Calculate energy needed
  const chargePercentNeeded = input.targetCharge - input.currentCharge;
  const energyNeeded = input.batteryCapacity * (chargePercentNeeded / 100);
  
  // Determine effective charging power (limited by vehicle's max rate)
  const effectiveChargingPower = input.maxChargingRate
    ? Math.min(input.chargerPower, input.maxChargingRate)
    : input.chargerPower;
  
  // Account for charging efficiency
  const actualChargingPower = effectiveChargingPower * efficiency;
  
  // Calculate time
  const chargingTimeHours = energyNeeded / actualChargingPower;
  const chargingTimeMinutes = chargingTimeHours * 60;
  
  // Energy from grid (more than what goes into battery due to losses)
  const energyFromGrid = energyNeeded / efficiency;
  
  return {
    energyNeeded,
    effectiveChargingPower,
    chargingTimeHours,
    chargingTimeMinutes,
    formattedTime: formatDuration(chargingTimeHours),
    energyFromGrid,
    costEstimate: (ratePerKwh: number) => energyFromGrid * ratePerKwh,
  };
}

/**
 * Calculate charging time with range estimation
 * 
 * @param input - Charging parameters
 * @param milesPerKwh - Vehicle efficiency in miles per kWh
 * @returns Charging result with range added
 */
export function calculateChargingTimeWithRange(
  input: EVChargingInput,
  milesPerKwh: number
): EVChargingResult {
  const result = calculateChargingTime(input);
  
  return {
    ...result,
    rangeAdded: result.energyNeeded * milesPerKwh,
  };
}

/**
 * Calculate how much charge can be added in a given time
 * 
 * @param batteryCapacity - Battery capacity in kWh
 * @param chargerPower - Charger power in kW
 * @param timeMinutes - Available charging time in minutes
 * @param maxChargingRate - Vehicle's max charging rate (optional)
 * @param efficiency - Charging efficiency (default 0.9)
 * @returns Percentage of charge that can be added
 */
export function calculateChargeInTime(
  batteryCapacity: number,
  chargerPower: number,
  timeMinutes: number,
  maxChargingRate?: number,
  efficiency: number = 0.9
): number {
  const effectivePower = maxChargingRate
    ? Math.min(chargerPower, maxChargingRate)
    : chargerPower;
  
  const actualPower = effectivePower * efficiency;
  const timeHours = timeMinutes / 60;
  const energyAdded = actualPower * timeHours;
  
  return (energyAdded / batteryCapacity) * 100;
}

/**
 * Estimate charging cost
 * 
 * @param energyKwh - Energy needed in kWh
 * @param ratePerKwh - Electricity rate per kWh
 * @param efficiency - Charging efficiency (default 0.9)
 * @returns Estimated cost
 */
export function estimateChargingCost(
  energyKwh: number,
  ratePerKwh: number,
  efficiency: number = 0.9
): number {
  const energyFromGrid = energyKwh / efficiency;
  return energyFromGrid * ratePerKwh;
}

/**
 * Calculate miles per dollar for EV
 * 
 * @param milesPerKwh - Vehicle efficiency
 * @param ratePerKwh - Electricity rate
 * @param efficiency - Charging efficiency (default 0.9)
 * @returns Miles per dollar
 */
export function calculateMilesPerDollar(
  milesPerKwh: number,
  ratePerKwh: number,
  efficiency: number = 0.9
): number {
  const effectiveMilesPerKwh = milesPerKwh * efficiency;
  return effectiveMilesPerKwh / ratePerKwh;
}

/**
 * Compare charging options
 * 
 * @param input - Base charging input (without charger power)
 * @param chargerOptions - Array of charger powers to compare
 * @returns Array of results for each charger option
 */
export function compareChargingOptions(
  input: Omit<EVChargingInput, 'chargerPower'>,
  chargerOptions: number[]
): Array<EVChargingResult & { chargerPower: number }> {
  return chargerOptions.map(chargerPower => ({
    chargerPower,
    ...calculateChargingTime({ ...input, chargerPower }),
  }));
}

/**
 * Get recommended charger for daily driving needs
 * 
 * @param dailyMiles - Average daily miles driven
 * @param milesPerKwh - Vehicle efficiency
 * @param availableHours - Hours available for charging per day
 * @param efficiency - Charging efficiency (default 0.9)
 * @returns Minimum charger power needed in kW
 */
export function getRecommendedChargerPower(
  dailyMiles: number,
  milesPerKwh: number,
  availableHours: number,
  efficiency: number = 0.9
): number {
  const dailyKwhNeeded = dailyMiles / milesPerKwh;
  const chargerPowerNeeded = dailyKwhNeeded / (availableHours * efficiency);
  return chargerPowerNeeded;
}
