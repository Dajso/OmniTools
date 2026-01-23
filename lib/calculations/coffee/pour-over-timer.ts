/**
 * Pour Over Timer
 * 
 * Multi-stage pour timer with method presets.
 * Supports 4:6 method and custom pour distributions.
 * 
 * @module lib/calculations/coffee/pour-over-timer
 * @see Requirements 8.1, 8.2, 8.5, 8.6
 */

import { CoffeeCalculationError } from './extraction-yield';

/**
 * Pour over brewing method
 */
export type PourMethod = '4:6' | 'tetsu-kasuya' | 'custom';

/**
 * Individual pour stage
 */
export interface PourStage {
  /** Stage number (1-indexed) */
  stageNumber: number;
  /** Water amount for this pour in grams */
  waterAmount: number;
  /** Start time in seconds */
  startTime: number;
  /** End time in seconds */
  endTime: number;
  /** Description of this stage */
  description: string;
}

/**
 * Input parameters for pour over timer
 */
export interface PourOverInputs {
  /** Total water amount in grams (100g - 1000g) */
  totalWater: number;
  /** Brewing method */
  method: PourMethod;
  /** Number of pours for custom method (1 - 10) */
  numberOfPours?: number;
}

/**
 * Results from pour over timer calculation
 */
export interface PourOverResults {
  /** Array of pour stages with timing */
  stages: PourStage[];
  /** Total brew time in seconds */
  totalTime: number;
  /** Brewing instructions */
  instructions: string[];
  /** Method name for display */
  methodName: string;
}

/**
 * Timing constants (in seconds)
 */
const TIMING = {
  bloomDuration: 45,      // 0:00 - 0:45
  pourInterval: 45,       // 45 seconds between pours
};

/**
 * Calculates pour schedule for 4:6 method
 * 
 * The 4:6 method divides water into:
 * - First 40% (2 pours): Controls sweetness/acidity
 * - Remaining 60% (3 pours): Controls strength
 * 
 * @param totalWater - Total water amount in grams
 * @returns Array of pour stages
 */
function calculate46Method(totalWater: number): PourStage[] {
  // First 40% divided into 2 pours
  const first40Percent = totalWater * 0.4;
  const pourAmount1and2 = first40Percent / 2;

  // Remaining 60% divided into 3 pours
  const remaining60Percent = totalWater * 0.6;
  const pourAmount3to5 = remaining60Percent / 3;

  // Round to 1 decimal place
  const round = (n: number) => Math.round(n * 10) / 10;

  const stages: PourStage[] = [
    {
      stageNumber: 1,
      waterAmount: round(pourAmount1and2),
      startTime: 0,
      endTime: TIMING.bloomDuration,
      description: 'Bloom pour - wet all grounds evenly',
    },
    {
      stageNumber: 2,
      waterAmount: round(pourAmount1and2),
      startTime: TIMING.bloomDuration,
      endTime: TIMING.bloomDuration + TIMING.pourInterval,
      description: 'Second pour - controls sweetness',
    },
    {
      stageNumber: 3,
      waterAmount: round(pourAmount3to5),
      startTime: TIMING.bloomDuration + TIMING.pourInterval,
      endTime: TIMING.bloomDuration + TIMING.pourInterval * 2,
      description: 'Third pour - builds strength',
    },
    {
      stageNumber: 4,
      waterAmount: round(pourAmount3to5),
      startTime: TIMING.bloomDuration + TIMING.pourInterval * 2,
      endTime: TIMING.bloomDuration + TIMING.pourInterval * 3,
      description: 'Fourth pour - continues extraction',
    },
    {
      stageNumber: 5,
      waterAmount: round(pourAmount3to5),
      startTime: TIMING.bloomDuration + TIMING.pourInterval * 3,
      endTime: TIMING.bloomDuration + TIMING.pourInterval * 4,
      description: 'Final pour - completes extraction',
    },
  ];

  return stages;
}

/**
 * Calculates pour schedule for custom method
 * 
 * Divides total water evenly across specified number of pours
 * 
 * @param totalWater - Total water amount in grams
 * @param numberOfPours - Number of pours
 * @returns Array of pour stages
 */
function calculateCustomMethod(totalWater: number, numberOfPours: number): PourStage[] {
  const waterPerPour = totalWater / numberOfPours;
  const round = (n: number) => Math.round(n * 10) / 10;

  const stages: PourStage[] = [];

  for (let i = 0; i < numberOfPours; i++) {
    const isFirstPour = i === 0;
    const isLastPour = i === numberOfPours - 1;

    stages.push({
      stageNumber: i + 1,
      waterAmount: round(waterPerPour),
      startTime: i * TIMING.pourInterval,
      endTime: (i + 1) * TIMING.pourInterval,
      description: isFirstPour
        ? 'Bloom pour - wet all grounds evenly'
        : isLastPour
        ? 'Final pour - completes extraction'
        : `Pour ${i + 1} - continue extraction`,
    });
  }

  return stages;
}

/**
 * Generates brewing instructions based on method
 * 
 * @param method - Brewing method
 * @param stages - Pour stages
 * @returns Array of instruction strings
 */
function generateInstructions(method: PourMethod, stages: PourStage[]): string[] {
  const baseInstructions = [
    'Rinse filter with hot water and discard rinse water',
    'Add coffee grounds and create a flat bed',
    'Start timer and begin first pour',
  ];

  const methodInstructions: Record<PourMethod, string[]> = {
    '4:6': [
      'First 2 pours (40%) control sweetness and acidity',
      'Last 3 pours (60%) control strength',
      'Pour in slow, circular motions',
      'Wait for water to drain between pours',
    ],
    'tetsu-kasuya': [
      'First 2 pours (40%) control sweetness and acidity',
      'Last 3 pours (60%) control strength',
      'Pour in slow, circular motions',
      'Wait for water to drain between pours',
    ],
    'custom': [
      'Pour evenly across all stages',
      'Pour in slow, circular motions',
      'Wait for water to drain between pours',
    ],
  };

  return [...baseInstructions, ...methodInstructions[method]];
}

/**
 * Calculates pour over timer schedule
 * 
 * Generates a multi-stage pour schedule with timing for pour over brewing.
 * Supports the 4:6 method (Tetsu Kasuya) and custom pour distributions.
 * 
 * The 4:6 method:
 * - Divides water into 5 pours
 * - First 40% (2 pours): Controls sweetness/acidity balance
 * - Remaining 60% (3 pours): Controls strength
 * - Each pour is 45 seconds apart
 * 
 * Custom method:
 * - Divides water evenly across specified number of pours
 * - Flexible timing based on number of pours
 * 
 * @param inputs - Pour over timer inputs
 * @returns Complete pour schedule with timing and instructions
 * 
 * @throws {CoffeeCalculationError} When inputs are invalid or out of range
 * 
 * @example
 * ```ts
 * // 4:6 method with 300g water
 * const result = calculatePourSchedule({
 *   totalWater: 300,
 *   method: '4:6'
 * });
 * console.log(result.stages.length);  // 5 pours
 * console.log(result.stages[0].waterAmount);  // 60g (20% of 300g)
 * console.log(result.totalTime);  // 225 seconds (3:45)
 * 
 * // Custom method with 4 pours
 * const custom = calculatePourSchedule({
 *   totalWater: 400,
 *   method: 'custom',
 *   numberOfPours: 4
 * });
 * console.log(custom.stages[0].waterAmount);  // 100g (400g / 4)
 * ```
 */
export function calculatePourSchedule(inputs: PourOverInputs): PourOverResults {
  const { totalWater, method, numberOfPours } = inputs;

  // Validate total water
  if (totalWater <= 0) {
    throw new CoffeeCalculationError(
      'Total water must be a positive number',
      'invalid_input',
      'totalWater'
    );
  }
  if (totalWater < 100 || totalWater > 1000) {
    throw new CoffeeCalculationError(
      'Total water must be between 100g and 1000g',
      'out_of_range',
      'totalWater'
    );
  }

  // Validate number of pours for custom method
  if (method === 'custom') {
    if (numberOfPours === undefined || numberOfPours === null) {
      throw new CoffeeCalculationError(
        'Number of pours is required for custom method',
        'invalid_input',
        'numberOfPours'
      );
    }
    if (numberOfPours < 1) {
      throw new CoffeeCalculationError(
        'Number of pours must be at least 1',
        'invalid_input',
        'numberOfPours'
      );
    }
    if (numberOfPours > 10) {
      throw new CoffeeCalculationError(
        'Number of pours must be between 1 and 10',
        'out_of_range',
        'numberOfPours'
      );
    }
  }

  // Calculate stages based on method
  let stages: PourStage[];
  let methodName: string;

  switch (method) {
    case '4:6':
    case 'tetsu-kasuya':
      stages = calculate46Method(totalWater);
      methodName = '4:6 Method (Tetsu Kasuya)';
      break;
    case 'custom':
      stages = calculateCustomMethod(totalWater, numberOfPours!);
      methodName = `Custom (${numberOfPours} pours)`;
      break;
    default:
      throw new CoffeeCalculationError(
        `Unknown method: ${method}`,
        'invalid_input',
        'method'
      );
  }

  // Calculate total time (end time of last stage)
  const totalTime = stages[stages.length - 1].endTime;

  // Generate instructions
  const instructions = generateInstructions(method, stages);

  return {
    stages,
    totalTime,
    instructions,
    methodName,
  };
}

/**
 * Formats time in seconds to MM:SS format
 * 
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "3:45")
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Gets the current stage based on elapsed time
 * 
 * @param stages - Array of pour stages
 * @param elapsedSeconds - Elapsed time in seconds
 * @returns Current stage or undefined if timer hasn't started or is complete
 */
export function getCurrentStage(stages: PourStage[], elapsedSeconds: number): PourStage | undefined {
  return stages.find(
    stage => elapsedSeconds >= stage.startTime && elapsedSeconds < stage.endTime
  );
}

/**
 * Gets the next stage based on elapsed time
 * 
 * @param stages - Array of pour stages
 * @param elapsedSeconds - Elapsed time in seconds
 * @returns Next stage or undefined if no more stages
 */
export function getNextStage(stages: PourStage[], elapsedSeconds: number): PourStage | undefined {
  return stages.find(stage => elapsedSeconds < stage.startTime);
}
