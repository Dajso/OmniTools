/**
 * Tip Calculator with Split Bill Functionality
 * 
 * @module lib/calculations/finance/tip-calculator
 * @see Requirements 5.6
 */

export interface TipInputs {
  billAmount: number;
  tipPercent: number;
  numberOfPeople: number;
}

export interface TipResults {
  tipAmount: number;
  totalAmount: number;
  tipPerPerson: number;
  totalPerPerson: number;
}

export function calculateTip(inputs: TipInputs): TipResults {
  const { billAmount, tipPercent, numberOfPeople } = inputs;
  
  if (billAmount < 0) throw new Error('Regningen kan ikke være negativ');
  if (tipPercent < 0) throw new Error('Drikkepengene kan ikke være negative');
  if (numberOfPeople < 1) throw new Error('Antall personer må være minst 1');

  const tipAmount = billAmount * (tipPercent / 100);
  const totalAmount = billAmount + tipAmount;
  const tipPerPerson = tipAmount / numberOfPeople;
  const totalPerPerson = totalAmount / numberOfPeople;

  return { tipAmount, totalAmount, tipPerPerson, totalPerPerson };
}
