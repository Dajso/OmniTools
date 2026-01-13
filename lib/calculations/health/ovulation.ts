/**
 * Ovulation Calendar Calculator
 * 
 * Calculates fertile window and ovulation date.
 * 
 * @module lib/calculations/health/ovulation
 * @see Requirements 6.8
 */

export interface OvulationInputs {
  lastPeriodDate: Date;
  cycleLength: number; // days
  periodLength?: number; // days
}

export interface OvulationResults {
  ovulationDate: Date;
  fertileWindowStart: Date;
  fertileWindowEnd: Date;
  nextPeriodDate: Date;
  safeDays: Array<{ date: Date; type: 'safe' | 'fertile' | 'ovulation' | 'period' }>;
  cycleDay: number;
}

export function calculateOvulation(inputs: OvulationInputs): OvulationResults {
  const { lastPeriodDate, cycleLength, periodLength = 5 } = inputs;
  const today = new Date();

  // Ovulation typically occurs 14 days before next period
  const ovulationDay = cycleLength - 14;
  
  const ovulationDate = new Date(lastPeriodDate);
  ovulationDate.setDate(ovulationDate.getDate() + ovulationDay);

  // Fertile window is typically 5 days before ovulation + ovulation day
  const fertileWindowStart = new Date(ovulationDate);
  fertileWindowStart.setDate(fertileWindowStart.getDate() - 5);

  const fertileWindowEnd = new Date(ovulationDate);
  fertileWindowEnd.setDate(fertileWindowEnd.getDate() + 1);

  // Next period
  const nextPeriodDate = new Date(lastPeriodDate);
  nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);

  // Calculate current cycle day
  const daysSinceLastPeriod = Math.floor(
    (today.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const cycleDay = (daysSinceLastPeriod % cycleLength) + 1;

  // Generate calendar for current cycle
  const safeDays: OvulationResults['safeDays'] = [];
  for (let i = 0; i < cycleLength; i++) {
    const date = new Date(lastPeriodDate);
    date.setDate(date.getDate() + i);
    
    let type: 'safe' | 'fertile' | 'ovulation' | 'period';
    
    if (i < periodLength) {
      type = 'period';
    } else if (i === ovulationDay) {
      type = 'ovulation';
    } else if (i >= ovulationDay - 5 && i <= ovulationDay + 1) {
      type = 'fertile';
    } else {
      type = 'safe';
    }
    
    safeDays.push({ date, type });
  }

  return {
    ovulationDate,
    fertileWindowStart,
    fertileWindowEnd,
    nextPeriodDate,
    safeDays,
    cycleDay,
  };
}
