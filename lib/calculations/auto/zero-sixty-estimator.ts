/**
 * 0-60 Time Estimator
 * 
 * Estimates 0-60 mph acceleration time based on vehicle power-to-weight ratio.
 * Uses empirical formulas derived from real-world vehicle data.
 * 
 * @module lib/calculations/auto/zero-sixty-estimator
 * @see Requirements 28.7
 */

/**
 * Vehicle specification for acceleration estimation
 */
export interface VehicleSpec {
  /** Engine power in horsepower */
  horsepower: number;
  /** Vehicle weight in pounds */
  weightLbs: number;
  /** Drivetrain type */
  drivetrain: 'fwd' | 'rwd' | 'awd';
  /** Transmission type */
  transmission: 'manual' | 'automatic' | 'dct' | 'cvt';
  /** Whether the vehicle has launch control */
  hasLaunchControl?: boolean;
  /** Torque in lb-ft (optional, improves accuracy) */
  torqueLbFt?: number;
}

/**
 * Acceleration estimation result
 */
export interface AccelerationEstimate {
  /** Estimated 0-60 mph time in seconds */
  zeroToSixty: number;
  /** Estimated 0-100 km/h time in seconds */
  zeroTo100Kmh: number;
  /** Estimated quarter mile time in seconds */
  quarterMile: number;
  /** Estimated quarter mile trap speed in mph */
  quarterMileTrapSpeed: number;
  /** Power-to-weight ratio (hp per lb) */
  powerToWeight: number;
  /** Power-to-weight ratio (hp per ton) */
  powerToWeightPerTon: number;
  /** Weight-to-power ratio (lbs per hp) */
  weightToPower: number;
  /** Confidence level of estimate */
  confidence: 'high' | 'medium' | 'low';
  /** Factors affecting the estimate */
  factors: string[];
}

/**
 * Drivetrain efficiency factors
 * AWD has best traction but drivetrain losses
 * RWD has good traction for powerful cars
 * FWD limited by traction (wheel spin)
 */
const DRIVETRAIN_FACTORS: Record<string, number> = {
  'awd': 0.92,  // Best launch, some drivetrain loss
  'rwd': 1.0,   // Baseline
  'fwd': 1.08,  // Traction limited
};

/**
 * Transmission efficiency factors
 * DCT and good automatics are fastest
 * Manual depends on driver skill
 * CVT typically slower
 */
const TRANSMISSION_FACTORS: Record<string, number> = {
  'dct': 0.95,       // Dual-clutch is fastest
  'automatic': 1.0,  // Modern automatics are baseline
  'manual': 1.02,    // Slightly slower (average driver)
  'cvt': 1.08,       // CVT typically slower
};

/**
 * Launch control benefit (reduces time by ~5%)
 */
const LAUNCH_CONTROL_FACTOR = 0.95;

/**
 * Validate vehicle specification
 */
function validateVehicleSpec(spec: VehicleSpec): void {
  if (spec.horsepower <= 0) {
    throw new Error('Horsepower must be positive');
  }
  if (spec.weightLbs <= 0) {
    throw new Error('Weight must be positive');
  }
  if (spec.horsepower > 2000) {
    throw new Error('Horsepower seems unrealistic (max 2000 hp)');
  }
  if (spec.weightLbs < 1000 || spec.weightLbs > 10000) {
    throw new Error('Weight should be between 1000 and 10000 lbs');
  }
  if (spec.torqueLbFt !== undefined && spec.torqueLbFt <= 0) {
    throw new Error('Torque must be positive');
  }
}

/**
 * Calculate power-to-weight ratio
 * 
 * @param horsepower - Engine power in hp
 * @param weightLbs - Vehicle weight in lbs
 * @returns Power-to-weight ratio (hp/lb)
 */
export function calculatePowerToWeight(horsepower: number, weightLbs: number): number {
  return horsepower / weightLbs;
}

/**
 * Calculate weight-to-power ratio
 * 
 * @param horsepower - Engine power in hp
 * @param weightLbs - Vehicle weight in lbs
 * @returns Weight-to-power ratio (lbs/hp)
 */
export function calculateWeightToPower(horsepower: number, weightLbs: number): number {
  return weightLbs / horsepower;
}

/**
 * Estimate 0-60 mph time using empirical formula
 * 
 * Base formula: t = k * (weight/power)^0.5
 * where k is a constant derived from real-world data (~3.5)
 * 
 * This is then adjusted for drivetrain, transmission, etc.
 * 
 * @param spec - Vehicle specification
 * @returns Estimated 0-60 time in seconds
 */
export function estimateZeroToSixty(spec: VehicleSpec): number {
  validateVehicleSpec(spec);
  
  const weightToPower = spec.weightLbs / spec.horsepower;
  
  // Base formula: empirically derived constant
  // For a typical car with 10 lbs/hp, this gives about 6.3 seconds
  const baseTime = 2.0 * Math.sqrt(weightToPower);
  
  // Apply drivetrain factor
  let adjustedTime = baseTime * DRIVETRAIN_FACTORS[spec.drivetrain];
  
  // Apply transmission factor
  adjustedTime *= TRANSMISSION_FACTORS[spec.transmission];
  
  // Apply launch control benefit
  if (spec.hasLaunchControl && spec.drivetrain === 'awd') {
    adjustedTime *= LAUNCH_CONTROL_FACTOR;
  }
  
  // Torque adjustment: high torque helps low-end acceleration
  if (spec.torqueLbFt) {
    const torqueRatio = spec.torqueLbFt / spec.horsepower;
    // Typical ratio is around 1.0, higher is better for acceleration
    if (torqueRatio > 1.2) {
      adjustedTime *= 0.97; // High torque helps
    } else if (torqueRatio < 0.8) {
      adjustedTime *= 1.03; // Low torque hurts
    }
  }
  
  // Minimum realistic time (even hypercars have limits)
  return Math.max(adjustedTime, 1.8);
}

/**
 * Estimate 0-100 km/h time
 * 
 * 100 km/h ≈ 62.14 mph, so slightly longer than 0-60
 * 
 * @param zeroToSixty - 0-60 mph time in seconds
 * @returns 0-100 km/h time in seconds
 */
export function estimateZeroTo100Kmh(zeroToSixty: number): number {
  // 100 km/h is about 3.6% faster than 60 mph
  // Time increases roughly proportionally
  return zeroToSixty * 1.04;
}

/**
 * Estimate quarter mile time using empirical formula
 * 
 * Formula: ET = 6.269 * (weight/power)^0.3333
 * This is the classic "Huntington" formula
 * 
 * @param spec - Vehicle specification
 * @returns Quarter mile time in seconds
 */
export function estimateQuarterMile(spec: VehicleSpec): number {
  validateVehicleSpec(spec);
  
  const weightToPower = spec.weightLbs / spec.horsepower;
  
  // Huntington formula
  let quarterMile = 6.269 * Math.pow(weightToPower, 1/3);
  
  // Apply drivetrain factor (less impact at higher speeds)
  quarterMile *= Math.pow(DRIVETRAIN_FACTORS[spec.drivetrain], 0.5);
  
  // Apply transmission factor
  quarterMile *= Math.pow(TRANSMISSION_FACTORS[spec.transmission], 0.5);
  
  return quarterMile;
}

/**
 * Estimate quarter mile trap speed
 * 
 * Formula: speed = 224 * (power/weight)^0.3333
 * 
 * @param spec - Vehicle specification
 * @returns Trap speed in mph
 */
export function estimateQuarterMileTrapSpeed(spec: VehicleSpec): number {
  validateVehicleSpec(spec);
  
  const powerToWeight = spec.horsepower / spec.weightLbs;
  
  // Trap speed formula
  return 224 * Math.pow(powerToWeight, 1/3);
}

/**
 * Get comprehensive acceleration estimate
 * 
 * @param spec - Vehicle specification
 * @returns Complete acceleration estimate with all metrics
 */
export function getAccelerationEstimate(spec: VehicleSpec): AccelerationEstimate {
  validateVehicleSpec(spec);
  
  const zeroToSixty = estimateZeroToSixty(spec);
  const zeroTo100Kmh = estimateZeroTo100Kmh(zeroToSixty);
  const quarterMile = estimateQuarterMile(spec);
  const quarterMileTrapSpeed = estimateQuarterMileTrapSpeed(spec);
  
  const powerToWeight = calculatePowerToWeight(spec.horsepower, spec.weightLbs);
  const weightToPower = calculateWeightToPower(spec.horsepower, spec.weightLbs);
  
  // Determine confidence level
  let confidence: 'high' | 'medium' | 'low';
  const factors: string[] = [];
  
  // High confidence for typical performance cars
  if (weightToPower >= 5 && weightToPower <= 20) {
    confidence = 'high';
  } else if (weightToPower >= 3 && weightToPower <= 30) {
    confidence = 'medium';
    if (weightToPower < 5) {
      factors.push('Very high power-to-weight ratio - traction may be limiting factor');
    } else {
      factors.push('Low power-to-weight ratio - estimate may vary');
    }
  } else {
    confidence = 'low';
    factors.push('Extreme power-to-weight ratio - estimate is approximate');
  }
  
  // Add relevant factors
  if (spec.drivetrain === 'fwd' && spec.horsepower > 300) {
    factors.push('High-power FWD may experience significant wheel spin');
    confidence = confidence === 'high' ? 'medium' : confidence;
  }
  
  if (spec.drivetrain === 'awd' && spec.hasLaunchControl) {
    factors.push('AWD with launch control provides optimal traction');
  }
  
  if (spec.transmission === 'dct') {
    factors.push('DCT provides fastest shifts');
  }
  
  if (spec.torqueLbFt && spec.torqueLbFt / spec.horsepower > 1.2) {
    factors.push('High torque-to-power ratio aids acceleration');
  }
  
  return {
    zeroToSixty,
    zeroTo100Kmh,
    quarterMile,
    quarterMileTrapSpeed,
    powerToWeight,
    powerToWeightPerTon: (spec.horsepower / spec.weightLbs) * 2000,
    weightToPower,
    confidence,
    factors,
  };
}

/**
 * Compare acceleration of two vehicles
 * 
 * @param spec1 - First vehicle specification
 * @param spec2 - Second vehicle specification
 * @returns Comparison results
 */
export function compareAcceleration(
  spec1: VehicleSpec,
  spec2: VehicleSpec
): {
  vehicle1: AccelerationEstimate;
  vehicle2: AccelerationEstimate;
  zeroToSixtyDifference: number;
  quarterMileDifference: number;
  fasterVehicle: 1 | 2;
} {
  const vehicle1 = getAccelerationEstimate(spec1);
  const vehicle2 = getAccelerationEstimate(spec2);
  
  return {
    vehicle1,
    vehicle2,
    zeroToSixtyDifference: vehicle1.zeroToSixty - vehicle2.zeroToSixty,
    quarterMileDifference: vehicle1.quarterMile - vehicle2.quarterMile,
    fasterVehicle: vehicle1.zeroToSixty < vehicle2.zeroToSixty ? 1 : 2,
  };
}

/**
 * Calculate required horsepower for target 0-60 time
 * 
 * @param targetTime - Target 0-60 time in seconds
 * @param weightLbs - Vehicle weight in pounds
 * @param drivetrain - Drivetrain type
 * @param transmission - Transmission type
 * @returns Required horsepower
 */
export function calculateRequiredHorsepower(
  targetTime: number,
  weightLbs: number,
  drivetrain: 'fwd' | 'rwd' | 'awd' = 'rwd',
  transmission: 'manual' | 'automatic' | 'dct' | 'cvt' = 'automatic'
): number {
  if (targetTime <= 0) {
    throw new Error('Target time must be positive');
  }
  if (weightLbs <= 0) {
    throw new Error('Weight must be positive');
  }
  
  // Reverse the formula: t = 2.0 * sqrt(weight/power) * factors
  // power = weight / (t / (2.0 * factors))^2
  
  const drivetrainFactor = DRIVETRAIN_FACTORS[drivetrain];
  const transmissionFactor = TRANSMISSION_FACTORS[transmission];
  const totalFactor = drivetrainFactor * transmissionFactor;
  
  const adjustedTime = targetTime / totalFactor;
  const sqrtWeightToPower = adjustedTime / 2.0;
  const weightToPower = sqrtWeightToPower * sqrtWeightToPower;
  
  return weightLbs / weightToPower;
}

/**
 * Convert horsepower to kilowatts
 * 
 * @param hp - Horsepower
 * @returns Kilowatts
 */
export function hpToKw(hp: number): number {
  return hp * 0.7457;
}

/**
 * Convert kilowatts to horsepower
 * 
 * @param kw - Kilowatts
 * @returns Horsepower
 */
export function kwToHp(kw: number): number {
  return kw / 0.7457;
}

/**
 * Convert pounds to kilograms
 * 
 * @param lbs - Pounds
 * @returns Kilograms
 */
export function lbsToKg(lbs: number): number {
  return lbs * 0.453592;
}

/**
 * Convert kilograms to pounds
 * 
 * @param kg - Kilograms
 * @returns Pounds
 */
export function kgToLbs(kg: number): number {
  return kg / 0.453592;
}
