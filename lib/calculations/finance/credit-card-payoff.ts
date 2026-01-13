/**
 * Credit Card Payoff Calculator
 * 
 * @module lib/calculations/finance/credit-card-payoff
 * @see Requirements 5.3
 */

export interface CreditCardPayoffInputs {
  balance: number;
  apr: number;
  monthlyPayment: number;
}

export interface CreditCardPayoffResults {
  monthsToPayoff: number;
  totalInterest: number;
  totalPayment: number;
  payoffDate: Date;
  schedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

export function calculateCreditCardPayoff(inputs: CreditCardPayoffInputs): CreditCardPayoffResults {
  const { balance, apr, monthlyPayment } = inputs;
  
  if (balance <= 0) throw new Error('Balance must be positive');
  if (apr < 0) throw new Error('APR cannot be negative');
  
  const monthlyRate = apr / 100 / 12;
  const minPayment = balance * monthlyRate * 1.01; // Minimum to make progress
  
  if (monthlyPayment < minPayment) {
    throw new Error(`Payment too low. Minimum payment needed: $${minPayment.toFixed(2)}`);
  }

  let remainingBalance = balance;
  let totalInterest = 0;
  let month = 0;
  const schedule: CreditCardPayoffResults['schedule'] = [];

  while (remainingBalance > 0.01 && month < 600) { // Max 50 years
    month++;
    const interest = remainingBalance * monthlyRate;
    const payment = Math.min(monthlyPayment, remainingBalance + interest);
    const principal = payment - interest;
    
    totalInterest += interest;
    remainingBalance = Math.max(0, remainingBalance - principal);

    schedule.push({
      month,
      payment,
      principal,
      interest,
      balance: remainingBalance,
    });
  }

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + month);

  return {
    monthsToPayoff: month,
    totalInterest,
    totalPayment: balance + totalInterest,
    payoffDate,
    schedule,
  };
}
