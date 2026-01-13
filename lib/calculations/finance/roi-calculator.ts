/**
 * ROI (Return on Investment) Calculator
 * 
 * @module lib/calculations/finance/roi-calculator
 * @see Requirements 5.4
 */

export interface ROIInputs {
  initialInvestment: number;
  finalValue: number;
  investmentPeriodYears?: number;
}

export interface ROIResults {
  roi: number; // as percentage
  gain: number;
  annualizedROI?: number; // if period provided
}

export function calculateROI(inputs: ROIInputs): ROIResults {
  const { initialInvestment, finalValue, investmentPeriodYears } = inputs;
  
  if (initialInvestment <= 0) throw new Error('Initial investment must be positive');

  const gain = finalValue - initialInvestment;
  const roi = (gain / initialInvestment) * 100;
  
  let annualizedROI: number | undefined;
  if (investmentPeriodYears && investmentPeriodYears > 0) {
    annualizedROI = (Math.pow(finalValue / initialInvestment, 1 / investmentPeriodYears) - 1) * 100;
  }

  return { roi, gain, annualizedROI };
}
