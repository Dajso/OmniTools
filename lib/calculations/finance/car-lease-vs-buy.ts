/**
 * Car Lease vs Buy Calculator
 * 
 * @module lib/calculations/finance/car-lease-vs-buy
 * @see Requirements 5.8
 */

export interface CarLeaseVsBuyInputs {
  // Purchase inputs
  purchasePrice: number;
  downPayment: number;
  loanTermMonths: number;
  loanAPR: number;
  salesTaxRate: number;
  
  // Lease inputs
  leaseMonthlyPayment: number;
  leaseTermMonths: number;
  leaseDownPayment: number;
  
  // Common inputs
  yearsToCompare: number;
  annualDepreciation: number;
  annualInsuranceBuy: number;
  annualInsuranceLease: number;
}

export interface CarLeaseVsBuyResults {
  buyTotalCost: number;
  leaseTotalCost: number;
  buyMonthlyAverage: number;
  leaseMonthlyAverage: number;
  buyResidualValue: number;
  buyNetCost: number;
  recommendation: 'buy' | 'lease' | 'similar';
  savings: number;
}

export function calculateCarLeaseVsBuy(inputs: CarLeaseVsBuyInputs): CarLeaseVsBuyResults {
  const {
    purchasePrice,
    downPayment,
    loanTermMonths,
    loanAPR,
    salesTaxRate,
    leaseMonthlyPayment,
    leaseTermMonths,
    leaseDownPayment,
    yearsToCompare,
    annualDepreciation,
    annualInsuranceBuy,
    annualInsuranceLease,
  } = inputs;

  const totalMonths = yearsToCompare * 12;

  // Calculate buy costs
  const purchaseWithTax = purchasePrice * (1 + salesTaxRate / 100);
  const loanAmount = purchaseWithTax - downPayment;
  const monthlyRate = loanAPR / 100 / 12;
  
  let monthlyLoanPayment = 0;
  if (monthlyRate > 0) {
    monthlyLoanPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) / 
      (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
  } else {
    monthlyLoanPayment = loanAmount / loanTermMonths;
  }

  const totalLoanPayments = monthlyLoanPayment * Math.min(loanTermMonths, totalMonths);
  const buyInsuranceCost = annualInsuranceBuy * yearsToCompare;
  const buyTotalCost = downPayment + totalLoanPayments + buyInsuranceCost;
  
  // Calculate residual value after depreciation
  const buyResidualValue = purchasePrice * Math.pow(1 - annualDepreciation / 100, yearsToCompare);
  const buyNetCost = buyTotalCost - buyResidualValue;

  // Calculate lease costs
  const numLeases = Math.ceil(totalMonths / leaseTermMonths);
  const leasePayments = leaseMonthlyPayment * totalMonths;
  const leaseDownPayments = leaseDownPayment * numLeases;
  const leaseInsuranceCost = annualInsuranceLease * yearsToCompare;
  const leaseTotalCost = leaseDownPayments + leasePayments + leaseInsuranceCost;

  // Calculate monthly averages
  const buyMonthlyAverage = buyNetCost / totalMonths;
  const leaseMonthlyAverage = leaseTotalCost / totalMonths;

  // Determine recommendation
  const difference = Math.abs(buyNetCost - leaseTotalCost);
  const threshold = Math.min(buyNetCost, leaseTotalCost) * 0.05; // 5% threshold
  
  let recommendation: 'buy' | 'lease' | 'similar';
  if (difference < threshold) {
    recommendation = 'similar';
  } else if (buyNetCost < leaseTotalCost) {
    recommendation = 'buy';
  } else {
    recommendation = 'lease';
  }

  return {
    buyTotalCost,
    leaseTotalCost,
    buyMonthlyAverage,
    leaseMonthlyAverage,
    buyResidualValue,
    buyNetCost,
    recommendation,
    savings: Math.abs(buyNetCost - leaseTotalCost),
  };
}
