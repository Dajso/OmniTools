/**
 * Battery Life Calculator
 * 
 * Calculates battery life based on capacity and current draw.
 * Time (hours) = Capacity (mAh) / Current (mA)
 * 
 * @module lib/calculations/electronics/battery-life
 * @see Requirements 26.5
 */

/**
 * Common battery types with typical capacities
 */
export const BATTERY_TYPES: Record<string, { capacity: number; voltage: number; name: string }> = {
  'aaa-alkaline': { capacity: 1200, voltage: 1.5, name: 'AAA Alkaline' },
  'aa-alkaline': { capacity: 2800, voltage: 1.5, name: 'AA Alkaline' },
  'c-alkaline': { capacity: 8000, voltage: 1.5, name: 'C Alkaline' },
  'd-alkaline': { capacity: 12000, voltage: 1.5, name: 'D Alkaline' },
  '9v-alkaline': { capacity: 565, voltage: 9, name: '9V Alkaline' },
  'cr2032': { capacity: 225, voltage: 3, name: 'CR2032 Coin Cell' },
  'cr2025': { capacity: 165, voltage: 3, name: 'CR2025 Coin Cell' },
  '18650': { capacity: 2600, voltage: 3.7, name: '18650 Li-ion' },
  '21700': { capacity: 4000, voltage: 3.7, name: '21700 Li-ion' },
  'lipo-1s-1000': { capacity: 1000, voltage: 3.7, name: '1S 1000mAh LiPo' },
  'lipo-2s-2200': { capacity: 2200, voltage: 7.4, name: '2S 2200mAh LiPo' },
  'lipo-3s-2200': { capacity: 2200, voltage: 11.1, name: '3S 2200mAh LiPo' },
};

/**
 * Input for battery life calculation
 */
export interface BatteryLifeInput {
  /** Battery capacity in mAh */
  capacityMah: number;
  /** Average current draw in mA */
  currentMa: number;
  /** Efficiency factor (0-1, default 0.8 for typical discharge) */
  efficiency?: number;
  /** Duty cycle (0-1, default 1 for continuous use) */
  dutyCycle?: number;
}

/**
 * Result of battery life calculation
 */
export interface BatteryLifeResult {
  /** Battery life in hours */
  hours: number;
  /** Battery life in minutes */
  minutes: number;
  /** Battery life in days (if > 24 hours) */
  days: number;
  /** Formatted duration string */
  formatted: string;
  /** Energy capacity in Wh (if voltage provided) */
  energyWh?: number;
  /** Effective capacity after efficiency */
  effectiveCapacity: number;
}

/**
 * Calculate battery life
 * 
 * @param input - Battery and load parameters
 * @returns Calculated battery life
 */
export function calculateBatteryLife(input: BatteryLifeInput): BatteryLifeResult {
  const { capacityMah, currentMa, efficiency = 0.8, dutyCycle = 1 } = input;
  
  if (capacityMah <= 0) {
    throw new Error('Battery capacity must be positive');
  }
  
  if (currentMa <= 0) {
    throw new Error('Current draw must be positive');
  }
  
  if (efficiency <= 0 || efficiency > 1) {
    throw new Error('Efficiency must be between 0 and 1');
  }
  
  if (dutyCycle <= 0 || dutyCycle > 1) {
    throw new Error('Duty cycle must be between 0 and 1');
  }
  
  // Effective capacity considering efficiency
  const effectiveCapacity = capacityMah * efficiency;
  
  // Effective current considering duty cycle
  const effectiveCurrent = currentMa * dutyCycle;
  
  // Time in hours = Capacity / Current
  const hours = effectiveCapacity / effectiveCurrent;
  const minutes = hours * 60;
  const days = hours / 24;
  
  return {
    hours,
    minutes,
    days,
    formatted: formatDuration(hours),
    effectiveCapacity,
  };
}

/**
 * Format duration in human-readable format
 */
function formatDuration(hours: number): string {
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    if (remainingHours === 0) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    }
    return `${days} day${days !== 1 ? 's' : ''}, ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
  } else if (hours >= 1) {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes === 0) {
      return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''}`;
    }
    return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''}, ${minutes} min`;
  } else {
    const minutes = Math.round(hours * 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
}

/**
 * Calculate required battery capacity for desired runtime
 * 
 * @param currentMa - Current draw in mA
 * @param desiredHours - Desired runtime in hours
 * @param efficiency - Efficiency factor (default 0.8)
 * @returns Required capacity in mAh
 */
export function calculateRequiredCapacity(
  currentMa: number,
  desiredHours: number,
  efficiency: number = 0.8
): number {
  return (currentMa * desiredHours) / efficiency;
}

/**
 * Calculate maximum current for desired battery life
 * 
 * @param capacityMah - Battery capacity in mAh
 * @param desiredHours - Desired runtime in hours
 * @param efficiency - Efficiency factor (default 0.8)
 * @returns Maximum current in mA
 */
export function calculateMaxCurrent(
  capacityMah: number,
  desiredHours: number,
  efficiency: number = 0.8
): number {
  return (capacityMah * efficiency) / desiredHours;
}

/**
 * Calculate energy in Watt-hours
 * 
 * @param capacityMah - Capacity in mAh
 * @param voltage - Nominal voltage
 * @returns Energy in Wh
 */
export function calculateEnergyWh(capacityMah: number, voltage: number): number {
  return (capacityMah * voltage) / 1000;
}
