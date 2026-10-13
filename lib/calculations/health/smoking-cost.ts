/**
 * Røykekalkulator
 *
 * Regner ut hva røyking koster i kroner over tid.
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
    { item: 'helgeturer med fly (à ca. 4 000 kr)', quantity: Math.floor(yearly / 4000) },
    { item: 'middager på restaurant (à ca. 600 kr)', quantity: Math.floor(yearly / 600) },
    { item: 'kinobilletter (à ca. 170 kr)', quantity: Math.floor(yearly / 170) },
    { item: 'bøker (à ca. 300 kr)', quantity: Math.floor(yearly / 300) },
    { item: 'måneder på treningssenter (à ca. 500 kr)', quantity: Math.floor(yearly / 500) },
    { item: 'måneder med strømmetjeneste (à ca. 150 kr)', quantity: Math.floor(yearly / 150) },
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
    { time: '20 minutter', benefit: 'Puls og blodtrykk går ned' },
    { time: '12 timer', benefit: 'Nivået av karbonmonoksid i blodet er normalt' },
    { time: '2–12 uker', benefit: 'Blodsirkulasjonen bedres og lungefunksjonen øker' },
    { time: '1–9 måneder', benefit: 'Hoste og tungpusthet avtar' },
    { time: '1 år', benefit: 'Risikoen for hjerteinfarkt er halvert sammenlignet med en røyker' },
    { time: '5 år', benefit: 'Risikoen for hjerneslag nærmer seg risikoen hos en som aldri har røykt' },
    { time: '10 år', benefit: 'Risikoen for å dø av lungekreft er omtrent halvert' },
    { time: '15 år', benefit: 'Risikoen for hjerteinfarkt er omtrent som hos en som aldri har røykt' },
  ];
}
