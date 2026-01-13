/**
 * Student Loan Payoff Calculator
 * 
 * @module lib/calculations/finance/student-loan-calculator
 * @see Requirements 5.9
 */

export interface StudentLoanInputs {
  loanBalance: number;
  interestRate: number;
  loanTermYears: number;
  extraMonthlyPayment: number;
}

export interface StudentLoanResults {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  payoffDate: Date;
  monthsToPayoff: number;
  interestSaved: number;
  timeSaved: number;
  schedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

export function calculateStudentLoan(inputs: StudentLoanInputs): StudentLoanResults {
  const { loanBalance, interestRate, loanTermYears, extraMonthlyPayment } = inputs;
  
  if (loanBalance <= 0) throw new Error('Loan balance must be positive');
  if (interestRate < 0) throw new Error('Interest rate cannot be negative');
  if (loanTermYears <= 0) throw new Error('Loan term must be positive');

  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanTermYears * 12;

  // Calculate standard monthly payment
  let standardPayment: number;
  if (monthlyRate > 0) {
    standardPayment = loanBalance * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  } else {
    standardPayment = loanBalance / totalMonths;
  }

  const actualPayment = standardPayment + extraMonthlyPayment;

  // Calculate payoff with extra payments
  let balance = loanBalance;
  let month = 0;
  let totalInterest = 0;
  const schedule: StudentLoanResults['schedule'] = [];

  while (balance > 0.01 && month < 600) {
    month++;
    const interest = balance * monthlyRate;
    const payment = Math.min(actualPayment, balance + interest);
    const principal = payment - interest;
    
    totalInterest += interest;
    balance = Math.max(0, balance - principal);

    schedule.push({
      month,
      payment,
      principal,
      interest,
      balance,
    });
  }

  // Calculate standard payoff for comparison
  const standardTotalInterest = (standardPayment * totalMonths) - loanBalance;
  const interestSaved = standardTotalInterest - totalInterest;
  const timeSaved = totalMonths - month;

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + month);

  return {
    monthlyPayment: actualPayment,
    totalPayment: loanBalance + totalInterest,
    totalInterest,
    payoffDate,
    monthsToPayoff: month,
    interestSaved: Math.max(0, interestSaved),
    timeSaved: Math.max(0, timeSaved),
    schedule,
  };
}
