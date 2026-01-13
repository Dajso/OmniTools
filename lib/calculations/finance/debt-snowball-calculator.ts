/**
 * Debt Snowball Calculator
 * 
 * @module lib/calculations/finance/debt-snowball-calculator
 * @see Requirements 5.18
 */

export interface Debt {
  name: string;
  balance: number;
  minimumPayment: number;
  apr: number;
}

export interface DebtSnowballInputs {
  debts: Debt[];
  extraPayment: number;
  method: 'snowball' | 'avalanche';
}

export interface DebtPayoffSchedule {
  debtName: string;
  monthsToPayoff: number;
  totalInterest: number;
  payoffOrder: number;
}

export interface DebtSnowballResults {
  totalMonths: number;
  totalInterest: number;
  totalPaid: number;
  schedule: DebtPayoffSchedule[];
  monthlyBreakdown: Array<{
    month: number;
    payments: Array<{ name: string; payment: number; balance: number }>;
    totalBalance: number;
  }>;
}

export function calculateDebtSnowball(inputs: DebtSnowballInputs): DebtSnowballResults {
  const { debts, extraPayment, method } = inputs;
  
  if (debts.length === 0) throw new Error('At least one debt is required');

  // Sort debts based on method
  const sortedDebts = [...debts].sort((a, b) => {
    if (method === 'snowball') {
      return a.balance - b.balance; // Smallest balance first
    } else {
      return b.apr - a.apr; // Highest APR first
    }
  });

  // Track balances and results
  const balances = new Map(sortedDebts.map(d => [d.name, d.balance]));
  const interestPaid = new Map(sortedDebts.map(d => [d.name, 0]));
  const payoffMonths = new Map<string, number>();
  const monthlyBreakdown: DebtSnowballResults['monthlyBreakdown'] = [];
  
  let month = 0;
  let payoffOrder = 0;

  while (Array.from(balances.values()).some(b => b > 0.01) && month < 600) {
    month++;
    const payments: Array<{ name: string; payment: number; balance: number }> = [];
    let availableExtra = extraPayment;

    for (const debt of sortedDebts) {
      const balance = balances.get(debt.name) || 0;
      if (balance <= 0.01) continue;

      // Calculate interest
      const monthlyRate = debt.apr / 100 / 12;
      const interest = balance * monthlyRate;
      interestPaid.set(debt.name, (interestPaid.get(debt.name) || 0) + interest);

      // Calculate payment
      let payment = debt.minimumPayment;
      
      // Add extra payment to first unpaid debt
      if (availableExtra > 0 && !payoffMonths.has(debt.name)) {
        payment += availableExtra;
        availableExtra = 0;
      }

      // Don't overpay
      payment = Math.min(payment, balance + interest);
      
      const newBalance = Math.max(0, balance + interest - payment);
      balances.set(debt.name, newBalance);

      payments.push({ name: debt.name, payment, balance: newBalance });

      // Check if paid off
      if (newBalance <= 0.01 && !payoffMonths.has(debt.name)) {
        payoffOrder++;
        payoffMonths.set(debt.name, month);
      }
    }

    monthlyBreakdown.push({
      month,
      payments,
      totalBalance: Array.from(balances.values()).reduce((a, b) => a + b, 0),
    });
  }

  const schedule: DebtPayoffSchedule[] = sortedDebts.map((debt, index) => ({
    debtName: debt.name,
    monthsToPayoff: payoffMonths.get(debt.name) || month,
    totalInterest: interestPaid.get(debt.name) || 0,
    payoffOrder: index + 1,
  }));

  const totalInterest = Array.from(interestPaid.values()).reduce((a, b) => a + b, 0);
  const totalOriginalBalance = debts.reduce((a, b) => a + b.balance, 0);

  return {
    totalMonths: month,
    totalInterest,
    totalPaid: totalOriginalBalance + totalInterest,
    schedule,
    monthlyBreakdown: monthlyBreakdown.slice(0, 60), // Limit to 5 years for display
  };
}
