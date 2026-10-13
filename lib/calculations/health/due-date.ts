/**
 * Due Date Calculator
 * 
 * Calculates pregnancy due date and milestones.
 * 
 * @module lib/calculations/health/due-date
 * @see Requirements 6.7
 */

export type CalculationMethod = 'lmp' | 'conception' | 'ultrasound';

export interface DueDateInputs {
  date: Date;
  method: CalculationMethod;
  cycleLength?: number; // For LMP method
}

export interface DueDateResults {
  dueDate: Date;
  conceptionDate: Date;
  currentWeek: number;
  currentDay: number;
  trimester: 1 | 2 | 3;
  daysRemaining: number;
  milestones: Array<{ week: number; description: string; date: Date }>;
}

const MILESTONES = [
  { week: 4, description: 'Implantasjonen er ferdig' },
  { week: 6, description: 'Hjerteslag kan påvises' },
  { week: 8, description: 'Alle hovedorganer dannes' },
  { week: 12, description: 'Slutten av første trimester' },
  { week: 16, description: 'Kjønn kan være synlig' },
  { week: 20, description: 'Halvveis, rutineultralyd' },
  { week: 24, description: 'Fosteret kan overleve utenfor livmoren' },
  { week: 28, description: 'Tredje trimester begynner' },
  { week: 37, description: 'Fullbåren' },
  { week: 40, description: 'Termin' },
];

export function calculateDueDate(inputs: DueDateInputs): DueDateResults {
  const { date, method, cycleLength = 28 } = inputs;
  const today = new Date();
  
  let lmpDate: Date;
  let conceptionDate: Date;
  let dueDate: Date;

  if (method === 'lmp') {
    lmpDate = new Date(date);
    // Adjust for cycle length (ovulation typically 14 days before next period)
    const ovulationDay = cycleLength - 14;
    conceptionDate = new Date(lmpDate);
    conceptionDate.setDate(conceptionDate.getDate() + ovulationDay);
    // Due date is 280 days (40 weeks) from LMP
    dueDate = new Date(lmpDate);
    dueDate.setDate(dueDate.getDate() + 280);
  } else if (method === 'conception') {
    conceptionDate = new Date(date);
    // LMP is approximately 14 days before conception
    lmpDate = new Date(conceptionDate);
    lmpDate.setDate(lmpDate.getDate() - 14);
    // Due date is 266 days from conception
    dueDate = new Date(conceptionDate);
    dueDate.setDate(dueDate.getDate() + 266);
  } else {
    // Ultrasound - use provided date as due date
    dueDate = new Date(date);
    // Work backwards
    lmpDate = new Date(dueDate);
    lmpDate.setDate(lmpDate.getDate() - 280);
    conceptionDate = new Date(lmpDate);
    conceptionDate.setDate(conceptionDate.getDate() + 14);
  }

  // Calculate current progress
  const daysSinceLMP = Math.floor((today.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));
  const currentWeek = Math.floor(daysSinceLMP / 7);
  const currentDay = daysSinceLMP % 7;
  const daysRemaining = Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  // Determine trimester
  let trimester: 1 | 2 | 3;
  if (currentWeek < 13) trimester = 1;
  else if (currentWeek < 27) trimester = 2;
  else trimester = 3;

  // Calculate milestone dates
  const milestones = MILESTONES.map(m => {
    const milestoneDate = new Date(lmpDate);
    milestoneDate.setDate(milestoneDate.getDate() + m.week * 7);
    return { ...m, date: milestoneDate };
  });

  return {
    dueDate,
    conceptionDate,
    currentWeek,
    currentDay,
    trimester,
    daysRemaining,
    milestones,
  };
}
