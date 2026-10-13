/**
 * Cost Per Cup Calculator
 * 
 * Calculates the actual cost per cup from bag price.
 * Provides monthly and annual cost projections.
 * 
 * @module lib/calculations/coffee/cost-per-cup
 * @see Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6
 */

import { CoffeeCalculationError } from './extraction-yield';

/**
 * Input parameters for cost per cup calculation
 */
export interface CostPerCupInputs {
  /** Bag price in NOK (10 - 2000 kr) */
  bagPrice: number;
  /** Bag weight in grams (100g - 5000g) */
  bagWeight: number;
  /** Dose per cup in grams (5g - 50g) */
  dosePerCup: number;
  /** Optional: Cups per day for monthly/annual calculations (0 - 20) */
  cupsPerDay?: number;
}

/**
 * Results from cost per cup calculation
 */
export interface CostPerCupResults {
  /** Cost per cup in NOK */
  costPerCup: number;
  /** Cost per gram in dollars */
  costPerGram: number;
  /** Number of cups from one bag */
  cupsPerBag: number;
  /** Optional: Monthly cost in dollars */
  monthlyCost?: number;
  /** Optional: Annual cost in dollars */
  annualCost?: number;
}

/**
 * Calculates cost per cup from bag price
 * 
 * Formulas:
 * - Cost Per Gram = Bag Price / Bag Weight
 * - Cost Per Cup = Cost Per Gram × Dose Per Cup
 * - Cups Per Bag = Bag Weight / Dose Per Cup
 * - Monthly Cost = Cost Per Cup × Cups Per Day × 30
 * - Annual Cost = Monthly Cost × 12
 * 
 * This calculator helps coffee enthusiasts understand their actual coffee expenses
 * and make informed purchasing decisions. It accounts for:
 * - Different bag sizes (from 100g samples to 5kg bulk bags)
 * - Various dose sizes (from espresso to large pour overs)
 * - Daily consumption patterns for budget planning
 * 
 * @param inputs - Cost per cup calculation inputs
 * @returns Complete cost per cup calculation results
 * 
 * @throws {CoffeeCalculationError} When inputs are invalid or out of range
 * 
 * @example
 * ```ts
 * const result = calculateCostPerCup({
 *   bagPrice: 18,      // $18 bag
 *   bagWeight: 340,    // 12oz (340g)
 *   dosePerCup: 20,    // 20g per cup
 *   cupsPerDay: 2      // 2 cups per day
 * });
 * console.log(result.costPerCup);    // $1.06
 * console.log(result.cupsPerBag);    // 17 cups
 * console.log(result.monthlyCost);   // $63.53
 * console.log(result.annualCost);    // $762.35
 * ```
 */
export function calculateCostPerCup(inputs: CostPerCupInputs): CostPerCupResults {
  const { bagPrice, bagWeight, dosePerCup, cupsPerDay } = inputs;

  // Validate bag price
  if (bagPrice <= 0) {
    throw new CoffeeCalculationError(
      'Prisen må være et positivt tall',
      'invalid_input',
      'bagPrice'
    );
  }
  if (bagPrice < 10 || bagPrice > 2000) {
    throw new CoffeeCalculationError(
      'Prisen må være mellom 10 kr og 2000 kr',
      'out_of_range',
      'bagPrice'
    );
  }

  // Validate bag weight
  if (bagWeight <= 0) {
    throw new CoffeeCalculationError(
      'Vekten må være et positivt tall',
      'invalid_input',
      'bagWeight'
    );
  }
  if (bagWeight < 100 || bagWeight > 5000) {
    throw new CoffeeCalculationError(
      'Vekten må være mellom 100 g og 5000 g',
      'out_of_range',
      'bagWeight'
    );
  }

  // Validate dose per cup
  if (dosePerCup <= 0) {
    throw new CoffeeCalculationError(
      'Mengden per kopp må være et positivt tall',
      'invalid_input',
      'dosePerCup'
    );
  }
  if (dosePerCup < 5 || dosePerCup > 50) {
    throw new CoffeeCalculationError(
      'Mengden per kopp må være mellom 5 g og 50 g',
      'out_of_range',
      'dosePerCup'
    );
  }

  // Validate cups per day (if provided)
  if (cupsPerDay !== undefined) {
    if (cupsPerDay < 0) {
      throw new CoffeeCalculationError(
        'Antall kopper per dag kan ikke være negativt',
        'invalid_input',
        'cupsPerDay'
      );
    }
    if (cupsPerDay > 20) {
      throw new CoffeeCalculationError(
        'Antall kopper per dag kan ikke være over 20',
        'out_of_range',
        'cupsPerDay'
      );
    }
  }

  // Calculate cost per gram
  // Formula: Cost Per Gram = Bag Price / Bag Weight
  const costPerGram = bagPrice / bagWeight;

  // Calculate cost per cup
  // Formula: Cost Per Cup = Cost Per Gram × Dose Per Cup
  const costPerCup = costPerGram * dosePerCup;

  // Calculate cups per bag
  // Formula: Cups Per Bag = Bag Weight / Dose Per Cup
  const cupsPerBag = bagWeight / dosePerCup;

  // Round to appropriate decimal places
  const roundedCostPerGram = Math.round(costPerGram * 10000) / 10000; // 4 decimal places
  const roundedCostPerCup = Math.round(costPerCup * 100) / 100; // 2 decimal places
  const roundedCupsPerBag = Math.round(cupsPerBag * 10) / 10; // 1 decimal place

  // Build results object
  const results: CostPerCupResults = {
    costPerCup: roundedCostPerCup,
    costPerGram: roundedCostPerGram,
    cupsPerBag: roundedCupsPerBag,
  };

  // Calculate monthly and annual costs if cups per day is provided
  if (cupsPerDay !== undefined && cupsPerDay > 0) {
    // Formula: Monthly Cost = Cost Per Cup × Cups Per Day × 30
    const monthlyCost = costPerCup * cupsPerDay * 30;
    
    // Formula: Annual Cost = Monthly Cost × 12
    const annualCost = monthlyCost * 12;

    results.monthlyCost = Math.round(monthlyCost * 100) / 100; // 2 decimal places
    results.annualCost = Math.round(annualCost * 100) / 100; // 2 decimal places
  }

  return results;
}
