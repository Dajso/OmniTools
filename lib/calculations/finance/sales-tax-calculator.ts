/**
 * MVA-kalkulator (merverdiavgift)
 *
 * Regner ut MVA fra pris uten MVA, eller trekker MVA ut av en pris som
 * allerede inkluderer MVA. Satsene er veiledende; sjekk Skatteetaten for
 * gjeldende satser og unntak.
 *
 * @module lib/calculations/finance/sales-tax-calculator
 */

export const MVA_RATES: Record<string, { name: string; rate: number }> = {
  general: { name: 'Alminnelig sats', rate: 25 },
  food: { name: 'Mat og drikke (næringsmidler)', rate: 15 },
  reduced: { name: 'Lav sats (persontransport, overnatting, kino m.m.)', rate: 12 },
  zero: { name: 'Fritatt / null-sats (f.eks. bøker og aviser)', rate: 0 },
};

export interface SalesTaxInputs {
  amount: number;
  taxRate: number;
  /** true: beløpet er uten MVA. false: beløpet inkluderer MVA. */
  isBeforeTax: boolean;
}

export interface SalesTaxResults {
  /** Pris uten MVA */
  subtotal: number;
  /** MVA-beløp */
  taxAmount: number;
  /** Pris med MVA */
  total: number;
  effectiveRate: number;
}

export function calculateSalesTax(inputs: SalesTaxInputs): SalesTaxResults {
  const { amount, taxRate, isBeforeTax } = inputs;

  if (amount < 0) throw new Error('Beløpet kan ikke være negativt');
  if (taxRate < 0) throw new Error('MVA-satsen kan ikke være negativ');

  let subtotal: number;
  let taxAmount: number;
  let total: number;

  if (isBeforeTax) {
    subtotal = amount;
    taxAmount = amount * (taxRate / 100);
    total = subtotal + taxAmount;
  } else {
    total = amount;
    subtotal = amount / (1 + taxRate / 100);
    taxAmount = total - subtotal;
  }

  return { subtotal, taxAmount, total, effectiveRate: taxRate };
}
