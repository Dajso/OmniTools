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
  {
    id: 'level1',
    name: 'Level 1 (120V)',
    power: 1.4,
    voltage: 120,
    amperage: 12,
    description: 'Standard household outlet',
  },
  {
    id: 'level1-high',
    name: 'Level 1 (120V 16A)',
    power: 1.9,
    voltage: 120,
    amperage: 16,
    description: 'Standard outlet with higher amperage',
  },
  {
    id: 'level2-16a',
    name: 'Level 2 (240V 16A)',
    power: 3.8,
    voltage: 240,
    amperage: 16,
    description: 'Basic home charger',
  },
  {
    id: 'level2-32a',
    name: 'Level 2 (240V 32A)',
    power: 7.7,
    voltage: 240,
    amperage: 32,
    description: 'Standard home charger',
  },
  {
    id: 'level2-40a',
    name: 'Level 2 (240V 40A)',
    power: 9.6,
    voltage: 240,
    amperage: 40,
    description: 'High-power home charger',
  },
  {
    id: 'level2-48a',
    name: 'Level 2 (240V 48A)',
    power: 11.5,
    voltage: 240,
    amperage: 48,
    description: 'Maximum home charger',
  },
  {
    id: 'level2-80a',
    name: 'Level 2 (240V 80A)',
    power: 19.2,
    voltage: 240,
    amperage: 80,
    description: 'Commercial Level 2',
  },
  {
    id: 'dcfc-50',
    name: 'DC Fast Charger (50kW)',
    power: 50,
    voltage: 400,
    amperage: 125,
    description: 'Basic DC fast charger',
  },
  {
    id: 'dcfc-150',
    name: 'DC Fast Charger (150kW)',
    power: 150,
    voltage: 400,
    amperage: 375,
    description: 'High-power DC fast charger',
  },
  {
    id: 'dcfc-250',
    name: 'DC Fast Charger (250kW)',
    power: 250,
    voltage: 800,
    amperage: 312,
    description: 'Ultra-fast charger (Tesla V3, etc.)',
  },
  {
    id: 'dcfc-350',
    name: 'DC Fast Charger (350kW)',
    power: 350,
    voltage: 800,
    amperage: 437,
    description: 'Maximum speed charger (Electrify America, etc.)',
  },
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
  /** EPA range in miles */
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
    id: 'chevy-bolt-ev',
    name: 'Chevrolet Bolt EV',
    batteryCapacity: 66,
    maxACChargingRate: 11.5,
    maxDCChargingRate: 55,
    epaRange: 259,
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
    id: 'rivian-r1t',
    name: 'Rivian R1T Large Pack',
    batteryCapacity: 135,
    maxACChargingRate: 11.5,
    maxDCChargingRate: 220,
    epaRange: 352,
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
    throw new Error('Battery capacity must be positive');
  }
  if (input.currentCharge < 0 || input.currentCharge > 100) {
    throw new Error('Current charge must be between 0 and 100%');
  }
  if (input.targetCharge < 0 || input.targetCharge > 100) {
    throw new Error('Target charge must be between 0 and 100%');
  }
  if (input.targetCharge <= input.currentCharge) {
    throw new Error('Target charge must be greater than current charge');
  }
  if (input.chargerPower <= 0) {
    throw new Error('Charger power must be positive');
  }
  if (input.maxChargingRate !== undefined && input.maxChargingRate <= 0) {
    throw new Error('Maximum charging rate must be positive');
  }
  if (input.efficiency !== undefined && (input.efficiency <= 0 || input.efficiency > 1)) {
    throw new Error('Efficiency must be between 0 and 1');
  }
}

/**
 * Format duration in hours to human-readable string
 */
function formatDuration(hours: number): string {
  if (hours < 1 / 60) {
    return 'Less than 1 minute';
  }
  
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  
  if (h === 0) {
    return `${m} minute${m !== 1 ? 's' : ''}`;
  }
  if (m === 0) {
    return `${h} hour${h !== 1 ? 's' : ''}`;
  }
  return `${h} hour${h !== 1 ? 's' : ''} ${m} minute${m !== 1 ? 's' : ''}`;
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
