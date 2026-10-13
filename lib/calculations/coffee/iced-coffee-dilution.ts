/**
 * Iced Coffee Dilution Calculator
 * 
 * Calculates ice and hot coffee amounts for target concentration.
 * Accounts for ice dilution to maintain desired strength after melting.
 * 
 * @module lib/calculations/coffee/iced-coffee-dilution
 * @see Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
 */

import { CoffeeCalculationError } from './extraction-yield';

/**
 * Input parameters for iced coffee dilution calculation
 */
export interface IcedCoffeeDilutionInputs {
  /** Target final volume in milliliters (100ml - 2000ml) */
  targetVolume: number;
  /** Target TDS percentage (0.5% - 3%) */
  targetTDS: number;
  /** Ice as percentage of final volume (10% - 70%) */
  icePercentage: number;
}

/**
 * Results from iced coffee dilution calculation
 */
export interface IcedCoffeeDilutionResults {
  /** Hot coffee to brew in milliliters */
  hotCoffeeAmount: number;
  /** Ice needed in grams */
  iceAmount: number;
  /** TDS to brew hot coffee at (%) */
  brewingTDS: number;
  /** Warning for excessive dilution (if applicable) */
  warning?: string;
}

/**
 * Excessive dilution threshold
 */
const EXCESSIVE_DILUTION_THRESHOLD = 50; // 50%

/**
 * Warning message for excessive dilution
 */
const EXCESSIVE_DILUTION_WARNING = 
  'Advarsel: Over 50 % is kan gi for mye fortynning.' +
  'Bruk litt mindre is eller brygg en sterkere konsentrat for å beholde smaken.';

/**
 * Calculates ice and hot coffee amounts for iced coffee
 * 
 * The calculator accounts for ice dilution to maintain target strength.
 * When ice melts, it dilutes the hot coffee, so the hot coffee must be
 * brewed stronger to compensate.
 * 
 * Formulas:
 * - Ice Amount = Target Volume × (Ice Percentage / 100)
 * - Hot Coffee Amount = Target Volume - Ice Amount
 * - Brewing TDS = (Target TDS × Target Volume) / Hot Coffee Amount
 * 
 * Example: For 400ml final volume at 1.2% TDS with 40% ice:
 * - Ice: 160g (400ml × 0.4)
 * - Hot Coffee: 240ml (400ml - 160ml)
 * - Brewing TDS: 2.0% ((1.2 × 400) / 240)
 * 
 * This ensures that when 160g of ice melts into 240ml of 2.0% TDS coffee,
 * the final 400ml beverage will have the target 1.2% TDS.
 * 
 * @param inputs - Iced coffee dilution calculation inputs
 * @returns Complete iced coffee dilution calculation results
 * 
 * @throws {CoffeeCalculationError} When inputs are invalid or out of range
 * 
 * @example
 * ```ts
 * const result = calculateIcedCoffeeDilution({
 *   targetVolume: 400,    // 400ml final volume
 *   targetTDS: 1.2,       // 1.2% target TDS
 *   icePercentage: 40     // 40% ice
 * });
 * console.log(result.hotCoffeeAmount); // 240ml
 * console.log(result.iceAmount);       // 160g
 * console.log(result.brewingTDS);      // 2.0%
 * ```
 */
export function calculateIcedCoffeeDilution(
  inputs: IcedCoffeeDilutionInputs
): IcedCoffeeDilutionResults {
  const { targetVolume, targetTDS, icePercentage } = inputs;

  // Validate target volume
  if (targetVolume <= 0) {
    throw new CoffeeCalculationError(
      'Volumet må være et positivt tall',
      'invalid_input',
      'targetVolume'
    );
  }
  if (targetVolume < 100 || targetVolume > 2000) {
    throw new CoffeeCalculationError(
      'Volumet må være mellom 100 ml og 2000 ml',
      'out_of_range',
      'targetVolume'
    );
  }

  // Validate target TDS
  if (targetTDS <= 0) {
    throw new CoffeeCalculationError(
      'TDS må være et positivt tall',
      'invalid_input',
      'targetTDS'
    );
  }
  if (targetTDS < 0.5 || targetTDS > 3) {
    throw new CoffeeCalculationError(
      'TDS må være mellom 0,5 % og 3 %',
      'out_of_range',
      'targetTDS'
    );
  }

  // Validate ice percentage
  if (icePercentage < 0 || icePercentage > 100) {
    throw new CoffeeCalculationError(
      'Andelen is må være mellom 0 % og 100 %',
      'invalid_input',
      'icePercentage'
    );
  }
  if (icePercentage < 10 || icePercentage > 70) {
    throw new CoffeeCalculationError(
      'Andelen is må være mellom 10 % og 70 %',
      'out_of_range',
      'icePercentage'
    );
  }

  // Calculate ice amount
  // Formula: Ice Amount = Target Volume × (Ice Percentage / 100)
  const iceAmount = targetVolume * (icePercentage / 100);

  // Calculate hot coffee amount
  // Formula: Hot Coffee Amount = Target Volume - Ice Amount
  const hotCoffeeAmount = targetVolume - iceAmount;

  // Calculate brewing TDS
  // Formula: Brewing TDS = (Target TDS × Target Volume) / Hot Coffee Amount
  const brewingTDS = (targetTDS * targetVolume) / hotCoffeeAmount;

  // Round to appropriate decimal places
  const roundedHotCoffeeAmount = Math.round(hotCoffeeAmount * 10) / 10;
  const roundedIceAmount = Math.round(iceAmount * 10) / 10;
  const roundedBrewingTDS = Math.round(brewingTDS * 100) / 100;

  // Check for excessive dilution warning
  const warning = icePercentage > EXCESSIVE_DILUTION_THRESHOLD 
    ? EXCESSIVE_DILUTION_WARNING 
    : undefined;

  return {
    hotCoffeeAmount: roundedHotCoffeeAmount,
    iceAmount: roundedIceAmount,
    brewingTDS: roundedBrewingTDS,
    warning,
  };
}
