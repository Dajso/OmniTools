import { describe, it, expect } from 'vitest';
import { calculateClosingCosts } from '@/lib/calculations/realestate/closing-costs';
import { calculateHouseAffordability } from '@/lib/calculations/realestate/house-affordability';
import { calculateCapRate } from '@/lib/calculations/realestate/cap-rate';
import { calculateAirbnbProfit } from '@/lib/calculations/realestate/airbnb-profit';
import { calculateProratedRent } from '@/lib/calculations/realestate/prorated-rent';
import { calculateRenovationROI } from '@/lib/calculations/realestate/renovation-roi';

describe('Eiendom: norsk tilpasning', () => {
  it('dokumentavgift er 2,5 % for selveier', () => {
    const r = calculateClosingCosts({ purchasePrice: 4_000_000, downPaymentPercent: 15, ownership: 'selveier' });
    expect(r.documentFee).toBe(100_000);
    expect(r.titleRegistration).toBe(585);
    expect(r.mortgageRegistration).toBe(585);
    expect(r.totalClosingCosts).toBe(100_000 + 585 + 585 + 1000);
  });

  it('ingen dokumentavgift i borettslag', () => {
    const r = calculateClosingCosts({ purchasePrice: 4_000_000, downPaymentPercent: 15, ownership: 'andel' });
    expect(r.documentFee).toBe(0);
    expect(r.titleRegistration).toBe(0);
  });

  it('boligkjøp uten lån har ingen pantegebyr', () => {
    const r = calculateClosingCosts({ purchasePrice: 1_000_000, downPaymentPercent: 100 });
    expect(r.mortgageRegistration).toBe(0);
    expect(r.establishmentFee).toBe(0);
  });

  it('5×-regelen begrenser når egenkapitalen er stor', () => {
    const r = calculateHouseAffordability({ annualIncome: 600_000, existingDebt: 0, equity: 2_000_000, interestRate: 5, loanTermYears: 25 });
    expect(r.limitingFactor).toBe('income');
    expect(r.maxLoanAmount).toBe(3_000_000);
    expect(r.maxHomePrice).toBe(5_000_000);
    expect(r.monthlyPaymentStress).toBeGreaterThan(r.monthlyPayment);
  });

  it('15 % egenkapital begrenser når egenkapitalen er liten', () => {
    const r = calculateHouseAffordability({ annualIncome: 1_000_000, existingDebt: 0, equity: 600_000, interestRate: 5, loanTermYears: 25 });
    expect(r.limitingFactor).toBe('equity');
    expect(r.maxHomePrice).toBe(4_000_000);
    expect(r.maxLoanAmount).toBe(3_400_000);
  });

  it('annen gjeld reduserer lånet', () => {
    const a = calculateHouseAffordability({ annualIncome: 600_000, existingDebt: 0, equity: 2_000_000, interestRate: 5, loanTermYears: 25 });
    const b = calculateHouseAffordability({ annualIncome: 600_000, existingDebt: 300_000, equity: 2_000_000, interestRate: 5, loanTermYears: 25 });
    expect(a.maxLoanAmount - b.maxLoanAmount).toBe(300_000);
  });

  it('yield', () => {
    const r = calculateCapRate({ purchasePrice: 3_500_000, annualGrossRent: 180_000, annualExpenses: 50_000 });
    expect(r.grossYield).toBeCloseTo(5.14, 2);
    expect(r.capRate).toBeCloseTo(3.71, 2);
  });

  it('Airbnb med skatt', () => {
    const r = calculateAirbnbProfit({ nightlyRate: 1000, cleaningFee: 0, occupancyRate: 50, daysPerMonth: 30, monthlyExpenses: 5000, platformFeePercent: 0, taxPercent: 22 });
    expect(r.monthlyProfit).toBe(10_000);
    expect(r.annualTax).toBe(26_400);
    expect(r.annualProfitAfterTax).toBe(93_600);
  });

  it('forholdsmessig husleie', () => {
    const r = calculateProratedRent({ monthlyRent: 12_000, moveInDay: 16, daysInMonth: 30 });
    expect(r.remainingDays).toBe(15);
    expect(r.proratedAmount).toBe(6_000);
  });

  it('oppussing kan overstyres', () => {
    const r = calculateRenovationROI({ type: 'bathroom', cost: 100_000, roiPercent: 50 });
    expect(r.estimatedValueAdded).toBe(50_000);
    expect(r.netGain).toBe(-50_000);
  });
});
