/**
 * PayPal Fee Calculator
 * 
 * @module lib/calculations/finance/paypal-fee-calculator
 * @see Requirements 5.15
 */

export type PayPalTransactionType = 
  | 'domestic'
  | 'international'
  | 'micropayment';

export interface PayPalFeeInputs {
  amount: number;
  transactionType: PayPalTransactionType;
  isReceiving: boolean;
}

export interface PayPalFeeResults {
  fee: number;
  netAmount: number;
  feePercent: number;
  amountToRequest: number; // Amount to request to receive desired net
}

// PayPal fee structure (as of 2024)
const PAYPAL_FEES = {
  domestic: { percent: 2.99, fixed: 0.49 },
  international: { percent: 4.99, fixed: 0.49 },
  micropayment: { percent: 5.00, fixed: 0.05 },
};

export function calculatePayPalFee(inputs: PayPalFeeInputs): PayPalFeeResults {
  const { amount, transactionType, isReceiving } = inputs;
  
  if (amount <= 0) throw new Error('Amount must be positive');

  const feeStructure = PAYPAL_FEES[transactionType];
  
  if (isReceiving) {
    // Calculate fee on received amount
    const fee = (amount * feeStructure.percent / 100) + feeStructure.fixed;
    const netAmount = amount - fee;
    const feePercent = (fee / amount) * 100;
    
    // Calculate amount to request to receive the desired net
    const amountToRequest = (amount + feeStructure.fixed) / (1 - feeStructure.percent / 100);

    return { fee, netAmount, feePercent, amountToRequest };
  } else {
    // Sending money - no fee for sender in most cases
    return {
      fee: 0,
      netAmount: amount,
      feePercent: 0,
      amountToRequest: amount,
    };
  }
}
