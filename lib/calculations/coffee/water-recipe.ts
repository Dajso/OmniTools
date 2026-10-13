/**
 * Water Recipe for Coffee Calculator
 * 
 * Calculates mineral additions to create SCA-standard brewing water.
 * Provides Epsom salt and baking soda amounts for target hardness and alkalinity.
 * 
 * @module lib/calculations/coffee/water-recipe
 * @see Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7
 */

import { formatFixed } from '@/lib/utils/formatting';

import { CoffeeCalculationError } from './extraction-yield';

/**
 * Input parameters for water recipe calculation
 */
export interface WaterRecipeInputs {
  /** Water volume in liters (0.5L - 20L) */
  waterVolume: number;
  /** Target hardness in ppm (0 - 300 ppm) */
  targetHardness: number;
  /** Target alkalinity in ppm (0 - 150 ppm) */
  targetAlkalinity: number;
}

/**
 * Results from water recipe calculation
 */
export interface WaterRecipeResults {
  /** Epsom salt (MgSO4·7H2O) amount in grams */
  epsomSalt: number;
  /** Baking soda (NaHCO3) amount in grams */
  bakingSoda: number;
  /** Whether the recipe meets SCA standards */
  scaCompliant: boolean;
  /** Step-by-step mixing instructions */
  instructions: string[];
  /** Compliance details for hardness and alkalinity */
  complianceDetails: {
    hardness: {
      value: number;
      compliant: boolean;
      range: string;
    };
    alkalinity: {
      value: number;
      compliant: boolean;
      range: string;
    };
  };
}

/**
 * SCA water quality standards
 */
const SCA_STANDARDS = {
  hardness: {
    min: 50,   // 50 ppm minimum
    max: 175,  // 175 ppm maximum
  },
  alkalinity: {
    min: 40,   // 40 ppm minimum
    max: 70,   // 70 ppm maximum
  },
};

/**
 * Mineral conversion factors
 * These represent how much ppm each gram of mineral provides per liter
 */
const CONVERSION_FACTORS = {
  // 1g MgSO4·7H2O per liter provides ~100 ppm hardness (as CaCO3)
  epsomSaltToPPM: 100,
  // 1g NaHCO3 per liter provides ~120 ppm alkalinity (as CaCO3)
  bakingSodaToPPM: 120,
};

/**
 * Checks if hardness value is within SCA standards
 * 
 * @param hardness - Hardness value in ppm
 * @returns True if within SCA standards (50-175 ppm)
 */
export function isHardnessCompliant(hardness: number): boolean {
  return hardness >= SCA_STANDARDS.hardness.min && 
         hardness <= SCA_STANDARDS.hardness.max;
}

/**
 * Checks if alkalinity value is within SCA standards
 * 
 * @param alkalinity - Alkalinity value in ppm
 * @returns True if within SCA standards (40-70 ppm)
 */
export function isAlkalinityCompliant(alkalinity: number): boolean {
  return alkalinity >= SCA_STANDARDS.alkalinity.min && 
         alkalinity <= SCA_STANDARDS.alkalinity.max;
}

/**
 * Generates step-by-step mixing instructions
 * 
 * @param waterVolume - Water volume in liters
 * @param epsomSalt - Epsom salt amount in grams
 * @param bakingSoda - Baking soda amount in grams
 * @returns Array of instruction strings
 */
function generateInstructions(
  waterVolume: number,
  epsomSalt: number,
  bakingSoda: number
): string[] {
  const instructions: string[] = [
    `Start with ${waterVolume}L of distilled or reverse osmosis (RO) water.`,
  ];

  if (epsomSalt > 0) {
    instructions.push(
      `Add ${formatFixed(epsomSalt, 2)}g of Epsom salt (MgSO4·7H2O) to provide magnesium hardness.`
    );
  }

  if (bakingSoda > 0) {
    instructions.push(
      `Add ${formatFixed(bakingSoda, 2)}g of baking soda (NaHCO3) to provide alkalinity buffer.`
    );
  }

  instructions.push(
    'Rør eller rist kraftig til alle mineralene er helt oppløst.',
    'La vannet hvile i 10–15 minutter før du bruker det, så mineralene løser seg helt opp.',
    'Oppbevar vannet i en ren, lukket beholder og bruk det innen en uke.'
  );

  return instructions;
}

/**
 * Calculates mineral additions for SCA-standard brewing water
 * 
 * This calculator helps create optimal brewing water by adding minerals to
 * distilled or RO water. Water chemistry significantly affects coffee extraction:
 * 
 * - **Hardness** (from Epsom salt): Magnesium ions enhance extraction and
 *   contribute to body and mouthfeel. Too little results in flat, under-extracted
 *   coffee. Too much can cause over-extraction and bitterness.
 * 
 * - **Alkalinity** (from baking soda): Bicarbonate ions buffer acidity and
 *   prevent sour flavors. Too little results in overly acidic coffee. Too much
 *   can neutralize desirable acidity and cause chalky flavors.
 * 
 * Formulas:
 * - Epsom Salt (g) = (Target Hardness / 100) × Water Volume
 * - Baking Soda (g) = (Target Alkalinity / 120) × Water Volume
 * 
 * SCA Standards:
 * - Hardness: 50-175 ppm (as CaCO3)
 * - Alkalinity: 40-70 ppm (as CaCO3)
 * 
 * @param inputs - Water recipe calculation inputs
 * @returns Complete water recipe calculation results
 * 
 * @throws {CoffeeCalculationError} When inputs are invalid or out of range
 * 
 * @example
 * ```ts
 * const result = calculateWaterRecipe({
 *   waterVolume: 5,        // 5 liters
 *   targetHardness: 100,   // 100 ppm hardness
 *   targetAlkalinity: 50   // 50 ppm alkalinity
 * });
 * console.log(result.epsomSalt);    // 5.0g
 * console.log(result.bakingSoda);   // 2.08g
 * console.log(result.scaCompliant); // true
 * ```
 */
export function calculateWaterRecipe(
  inputs: WaterRecipeInputs
): WaterRecipeResults {
  const { waterVolume, targetHardness, targetAlkalinity } = inputs;

  // Validate water volume
  if (waterVolume <= 0) {
    throw new CoffeeCalculationError(
      'Vannvolumet må være et positivt tall',
      'invalid_input',
      'waterVolume'
    );
  }
  if (waterVolume < 0.5 || waterVolume > 20) {
    throw new CoffeeCalculationError(
      'Vannvolumet må være mellom 0,5 liter og 20 liter',
      'out_of_range',
      'waterVolume'
    );
  }

  // Validate target hardness
  if (targetHardness < 0) {
    throw new CoffeeCalculationError(
      'Hardheten kan ikke være negativ',
      'invalid_input',
      'targetHardness'
    );
  }
  if (targetHardness > 300) {
    throw new CoffeeCalculationError(
      'Hardheten må være mellom 0 og 300 ppm',
      'out_of_range',
      'targetHardness'
    );
  }

  // Validate target alkalinity
  if (targetAlkalinity < 0) {
    throw new CoffeeCalculationError(
      'Alkaliniteten kan ikke være negativ',
      'invalid_input',
      'targetAlkalinity'
    );
  }
  if (targetAlkalinity > 150) {
    throw new CoffeeCalculationError(
      'Alkaliniteten må være mellom 0 og 150 ppm',
      'out_of_range',
      'targetAlkalinity'
    );
  }

  // Calculate Epsom salt amount
  // Formula: Epsom Salt (g) = (Target Hardness / 100) × Water Volume
  // 1g MgSO4·7H2O per liter provides ~100 ppm hardness
  const epsomSalt = (targetHardness / CONVERSION_FACTORS.epsomSaltToPPM) * waterVolume;

  // Calculate baking soda amount
  // Formula: Baking Soda (g) = (Target Alkalinity / 120) × Water Volume
  // 1g NaHCO3 per liter provides ~120 ppm alkalinity
  const bakingSoda = (targetAlkalinity / CONVERSION_FACTORS.bakingSodaToPPM) * waterVolume;

  // Round to 2 decimal places
  const roundedEpsomSalt = Math.round(epsomSalt * 100) / 100;
  const roundedBakingSoda = Math.round(bakingSoda * 100) / 100;

  // Check SCA compliance
  const hardnessCompliant = isHardnessCompliant(targetHardness);
  const alkalinityCompliant = isAlkalinityCompliant(targetAlkalinity);
  const scaCompliant = hardnessCompliant && alkalinityCompliant;

  // Generate instructions
  const instructions = generateInstructions(
    waterVolume,
    roundedEpsomSalt,
    roundedBakingSoda
  );

  // Build compliance details
  const complianceDetails = {
    hardness: {
      value: targetHardness,
      compliant: hardnessCompliant,
      range: `${SCA_STANDARDS.hardness.min}-${SCA_STANDARDS.hardness.max} ppm`,
    },
    alkalinity: {
      value: targetAlkalinity,
      compliant: alkalinityCompliant,
      range: `${SCA_STANDARDS.alkalinity.min}-${SCA_STANDARDS.alkalinity.max} ppm`,
    },
  };

  return {
    epsomSalt: roundedEpsomSalt,
    bakingSoda: roundedBakingSoda,
    scaCompliant,
    instructions,
    complianceDetails,
  };
}
