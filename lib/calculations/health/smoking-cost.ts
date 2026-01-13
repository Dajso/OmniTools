/**
 * Smoking Cost Calculator
 * 
 * Calculates the financial cost of smoking over time.
 * 
 * @module lib/calculations/health/smoking-cost
 * @see Requirements 6.20
 */

export interface SmokingCostInputs {
  cigarettesPerDay: number;
  pricePerPack: number;
  cigarettesPerPack: number;
  yearsSmoked?: number;
}

export interface SmokingCostResults {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  fiveYear: number;
  tenYear: number;
  lifetime: number; // 30 years
  totalSpent?: number; // If years smoked provided
  packsPerYear: number;
  cigarettesPerYear: number;
  alternativeUses: Array<{ item: string; quantity: number }>;
}

export function calculateSmokingCost(inputs: SmokingCostInputs): SmokingCostResults {
  const { cigarettesPerDay, pricePerPack, cigarettesPerPack, yearsSmoked } = inputs;

  const packsPerDay = cigarettesPerDay / cigarettesPerPack;
  const dailyCost = packsPerDay * pricePerPack;

  const weekly = dailyCost * 7;
  const monthly = dailyCost * 30.44; // Average days per month
  const yearly = dailyCost * 365;
  const fiveYear = yearly * 5;
  const tenYear = yearly * 10;
  const lifetime = yearly * 30;

  const totalSpent = yearsSmoked ? yearly * yearsSmoked : undefined;

  // Alternative uses for yearly cost
  const alternativeUses = [
    { item: 'Vacation days', quantity: Math.floor(yearly / 200) },
    { item: 'Nice dinners', quantity: Math.floor(yearly / 75) },
    { item: 'Movie tickets', quantity: Math.floor(yearly / 15) },
    { item: 'Books', quantity: Math.floor(yearly / 20) },
    { item: 'Gym memberships (months)', quantity: Math.floor(yearly / 50) },
    { item: 'Streaming subscriptions (months)', quantity: Math.floor(yearly / 15) },
  ];

  return {
    daily: Math.round(dailyCost * 100) / 100,
    weekly: Math.round(weekly * 100) / 100,
    monthly: Math.round(monthly * 100) / 100,
    yearly: Math.round(yearly * 100) / 100,
    fiveYear: Math.round(fiveYear * 100) / 100,
    tenYear: Math.round(tenYear * 100) / 100,
    lifetime: Math.round(lifetime * 100) / 100,
    totalSpent: totalSpent ? Math.round(totalSpent * 100) / 100 : undefined,
    packsPerYear: Math.round(packsPerDay * 365),
    cigarettesPerYear: cigarettesPerDay * 365,
    alternativeUses,
  };
}

export function getHealthBenefitsTimeline(): Array<{ time: string; benefit: string }> {
  return [
    { time: '20 minutes', benefit: 'Heart rate and blood pressure drop' },
    { time: '12 hours', benefit: 'Carbon monoxide level in blood drops to normal' },
    { time: '2-12 weeks', benefit: 'Circulation improves and lung function increases' },
    { time: '1-9 months', benefit: 'Coughing and shortness of breath decrease' },
    { time: '1 year', benefit: 'Risk of coronary heart disease is half that of a smoker' },
    { time: '5 years', benefit: 'Stroke risk reduced to that of a non-smoker' },
    { time: '10 years', benefit: 'Lung cancer death rate is half that of a smoker' },
    { time: '15 years', benefit: 'Risk of coronary heart disease equals non-smoker' },
  ];
}
