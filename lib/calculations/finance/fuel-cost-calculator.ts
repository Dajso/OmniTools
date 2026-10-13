/**
 * Fuel Cost Trip Calculator (MPG and L/100km)
 * 
 * @module lib/calculations/finance/fuel-cost-calculator
 * @see Requirements 5.16
 */

export interface FuelCostInputs {
  distance: number;
  fuelEfficiency: number;
  fuelPrice: number;
  unit: 'imperial' | 'metric';
}

export interface FuelCostResults {
  fuelNeeded: number;
  totalCost: number;
  costPerMile: number;
  costPerKm: number;
}

export function calculateFuelCost(inputs: FuelCostInputs): FuelCostResults {
  const { distance, fuelEfficiency, fuelPrice, unit } = inputs;
  
  if (distance < 0) throw new Error('Avstanden kan ikke være negativ');
  if (fuelEfficiency <= 0) throw new Error('Forbruket må være større enn null');
  if (fuelPrice < 0) throw new Error('Drivstoffprisen kan ikke være negativ');

  let fuelNeeded: number;
  let distanceInMiles: number;
  let distanceInKm: number;

  if (unit === 'imperial') {
    // MPG: gallons = miles / mpg
    fuelNeeded = distance / fuelEfficiency;
    distanceInMiles = distance;
    distanceInKm = distance * 1.60934;
  } else {
    // L/100km: liters = (km / 100) * L/100km
    fuelNeeded = (distance / 100) * fuelEfficiency;
    distanceInKm = distance;
    distanceInMiles = distance / 1.60934;
  }

  const totalCost = fuelNeeded * fuelPrice;
  const costPerMile = distanceInMiles > 0 ? totalCost / distanceInMiles : 0;
  const costPerKm = distanceInKm > 0 ? totalCost / distanceInKm : 0;

  return {
    fuelNeeded,
    totalCost,
    costPerMile,
    costPerKm,
  };
}
