/**
 * Solar Panel Calculator
 * 
 * Calculates solar panel requirements and savings.
 * 
 * @module lib/calculations/home/solar-panel-calculator
 * @see Requirements 7.19
 */

export interface SolarPanelInputs {
  /** Monthly electricity usage in kWh */
  monthlyUsageKwh: number;
  /** Average sun hours per day */
  sunHoursPerDay: number;
  /** Panel wattage (typically 300-400W) */
  panelWattage: number;
  /** System efficiency (0.75-0.85) */
  systemEfficiency: number;
  /** Cost per kWh from utility */
  costPerKwh: number;
  /** Cost per watt for installation */
  costPerWatt: number;
}

export interface SolarPanelResults {
  /** Daily energy need in kWh */
  dailyEnergyNeed: number;
  /** System size needed in kW */
  systemSizeKw: number;
  /** Number of panels needed */
  numberOfPanels: number;
  /** Estimated annual production in kWh */
  annualProductionKwh: number;
  /** Annual savings in dollars */
  annualSavings: number;
  /** Estimated system cost */
  systemCost: number;
  /** Payback period in years */
  paybackYears: number;
  /** 25-year savings */
  savings25Year: number;
}

/**
 * Calculates solar panel requirements
 */
export function calculateSolarPanels(inputs: SolarPanelInputs): SolarPanelResults {
  const {
    monthlyUsageKwh,
    sunHoursPerDay,
    panelWattage,
    systemEfficiency,
    costPerKwh,
    costPerWatt,
  } = inputs;

  if (monthlyUsageKwh <= 0 || sunHoursPerDay <= 0 || panelWattage <= 0) {
    throw new Error('All values must be positive');
  }

  const dailyEnergyNeed = monthlyUsageKwh / 30;
  
  // System size = Daily need / (Sun hours × Efficiency)
  const systemSizeKw = dailyEnergyNeed / (sunHoursPerDay * systemEfficiency);
  
  // Number of panels
  const panelKw = panelWattage / 1000;
  const numberOfPanels = Math.ceil(systemSizeKw / panelKw);
  
  // Actual system size
  const actualSystemSizeKw = numberOfPanels * panelKw;
  
  // Annual production
  const annualProductionKwh = actualSystemSizeKw * sunHoursPerDay * 365 * systemEfficiency;
  
  // Savings
  const annualSavings = Math.min(annualProductionKwh, monthlyUsageKwh * 12) * costPerKwh;
  
  // System cost
  const systemCost = actualSystemSizeKw * 1000 * costPerWatt;
  
  // Payback period
  const paybackYears = systemCost / annualSavings;
  
  // 25-year savings (accounting for 0.5% annual degradation)
  let totalSavings = 0;
  let currentProduction = annualProductionKwh;
  for (let year = 1; year <= 25; year++) {
    totalSavings += Math.min(currentProduction, monthlyUsageKwh * 12) * costPerKwh;
    currentProduction *= 0.995; // 0.5% degradation
  }
  const savings25Year = totalSavings - systemCost;

  return {
    dailyEnergyNeed: Math.round(dailyEnergyNeed * 10) / 10,
    systemSizeKw: Math.round(actualSystemSizeKw * 100) / 100,
    numberOfPanels,
    annualProductionKwh: Math.round(annualProductionKwh),
    annualSavings: Math.round(annualSavings),
    systemCost: Math.round(systemCost),
    paybackYears: Math.round(paybackYears * 10) / 10,
    savings25Year: Math.round(savings25Year),
  };
}
