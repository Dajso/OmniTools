/**
 * Discount Calculator with Sales Tax
 * 
 * @module lib/calculations/finance/discount-calculator
 * @see Requirements 5.11
 */

export interface DiscountInputs {
  originalPrice: number;
  discountPercent: number;
  salesTaxPercent: number;
}

export interface DiscountResults {
  discountAmount: number;
  priceAfterDiscount: number;
  taxAmount: number;
  finalPrice: number;
  totalSavings: number;
}

export function calculateDiscount(inputs: DiscountInputs): DiscountResults {
  const { originalPrice, discountPercent, salesTaxPercent } = inputs;
  
  if (originalPrice < 0) throw new Error('Prisen kan ikke være negativ');
  if (discountPercent < 0 || discountPercent > 100) throw new Error('Rabatten må være mellom 0 og 100 %');
  if (salesTaxPercent < 0) throw new Error('MVA-satsen kan ikke være negativ');

  const discountAmount = originalPrice * (discountPercent / 100);
  const priceAfterDiscount = originalPrice - discountAmount;
  const taxAmount = priceAfterDiscount * (salesTaxPercent / 100);
  const finalPrice = priceAfterDiscount + taxAmount;
  const originalWithTax = originalPrice * (1 + salesTaxPercent / 100);
  const totalSavings = originalWithTax - finalPrice;

  return {
    discountAmount,
    priceAfterDiscount,
    taxAmount,
    finalPrice,
    totalSavings,
  };
}
