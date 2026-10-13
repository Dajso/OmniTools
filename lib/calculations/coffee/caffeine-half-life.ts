/**
 * Caffeine Half-Life Tracker
 * 
 * Tracks caffeine intake and calculates current blood levels using exponential decay.
 * Provides sleep recommendations based on current caffeine levels.
 * 
 * @module lib/calculations/coffee/caffeine-half-life
 * @see Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6
 */

import { CoffeeCalculationError } from './extraction-yield';

/**
 * Caffeine half-life in hours
 * Average human caffeine half-life is approximately 5 hours
 */
const CAFFEINE_HALF_LIFE_HOURS = 5;

/**
 * Sleep recommendation thresholds in mg
 */
const SLEEP_THRESHOLDS = {
  safe: 50,      // < 50mg: Safe for sleep
  moderate: 100, // 50-100mg: May affect sleep quality
  // > 100mg: Avoid caffeine, wait for metabolism
};

/**
 * Individual caffeine intake record
 */
export interface CaffeineIntake {
  /** Unique identifier for the intake */
  id: string;
  /** Time of caffeine consumption */
  time: Date;
  /** Amount of caffeine in milligrams */
  caffeineMg: number;
  /** Source of caffeine (e.g., "Espresso", "Pour Over", "Energy Drink") */
  source: string;
}

/**
 * Input parameters for caffeine tracking
 */
export interface CaffeineTrackerInputs {
  /** Array of caffeine intake records */
  intakes: CaffeineIntake[];
  /** Current time for calculating remaining caffeine */
  currentTime: Date;
}

/**
 * Timeline point showing caffeine level at a specific time
 */
export interface CaffeineTimelinePoint {
  /** Time point */
  time: Date;
  /** Caffeine level at this time in mg */
  level: number;
}

/**
 * Results from caffeine tracking calculation
 */
export interface CaffeineTrackerResults {
  /** Current caffeine level in blood (mg) */
  currentLevel: number;
  /** Time until caffeine reduces to 50% of current level (hours) */
  halfLifeRemaining: number;
  /** Sleep recommendation based on current level */
  sleepRecommendation: string;
  /** Timeline of caffeine levels over time */
  timeline: CaffeineTimelinePoint[];
  /** Estimated time when caffeine will be below safe threshold */
  safeForSleepTime?: Date;
}

/**
 * Validates a single caffeine intake record
 * 
 * @param intake - Caffeine intake to validate
 * @param currentTime - Current time for validation
 * @throws {CoffeeCalculationError} When intake is invalid
 */
export function validateCaffeineIntake(intake: CaffeineIntake, currentTime: Date): void {
  // Validate caffeine amount
  if (intake.caffeineMg <= 0) {
    throw new CoffeeCalculationError(
      'Koffeinmengden må være et positivt tall',
      'invalid_input',
      'caffeineMg'
    );
  }
  if (intake.caffeineMg < 1 || intake.caffeineMg > 500) {
    throw new CoffeeCalculationError(
      'Koffeinmengden må være mellom 1 mg og 500 mg per inntak',
      'out_of_range',
      'caffeineMg'
    );
  }

  // Validate intake time
  if (intake.time > currentTime) {
    throw new CoffeeCalculationError(
      'Tidspunktet kan ikke være i fremtiden',
      'invalid_input',
      'time'
    );
  }
}

/**
 * Calculates remaining caffeine from a single intake using exponential decay
 * 
 * Formula: C(t) = C₀ × (1/2)^(t/t½)
 * Where:
 * - C(t) = Caffeine level at time t
 * - C₀ = Initial caffeine amount
 * - t = Time elapsed since intake
 * - t½ = Half-life (5 hours)
 * 
 * @param intake - Caffeine intake record
 * @param currentTime - Current time
 * @returns Remaining caffeine in mg
 */
export function calculateRemainingCaffeine(intake: CaffeineIntake, currentTime: Date): number {
  const hoursElapsed = (currentTime.getTime() - intake.time.getTime()) / (1000 * 60 * 60);
  
  // If intake is in the future or at current time, return full amount
  if (hoursElapsed <= 0) {
    return intake.caffeineMg;
  }
  
  // Exponential decay: C(t) = C₀ × (0.5)^(t/t½)
  const remaining = intake.caffeineMg * Math.pow(0.5, hoursElapsed / CAFFEINE_HALF_LIFE_HOURS);
  
  return remaining;
}

/**
 * Calculates total current caffeine level from all intakes
 * 
 * @param intakes - Array of caffeine intake records
 * @param currentTime - Current time
 * @param skipValidation - Skip validation (used internally by timeline generation)
 * @returns Total caffeine level in mg
 */
export function calculateCurrentCaffeineLevel(
  intakes: CaffeineIntake[], 
  currentTime: Date,
  skipValidation: boolean = false
): number {
  // Return 0 for empty intakes (validation happens in main function)
  if (intakes.length === 0) {
    return 0;
  }
  
  // Validate all intakes unless skipped
  if (!skipValidation) {
    for (const intake of intakes) {
      validateCaffeineIntake(intake, currentTime);
    }
  }
  
  // Sum remaining caffeine from all intakes
  const totalCaffeine = intakes.reduce((sum, intake) => {
    return sum + calculateRemainingCaffeine(intake, currentTime);
  }, 0);
  
  return totalCaffeine;
}

/**
 * Generates sleep recommendation based on current caffeine level
 * 
 * @param currentLevel - Current caffeine level in mg
 * @returns Sleep recommendation string
 */
export function getSleepRecommendation(currentLevel: number): string {
  if (currentLevel < SLEEP_THRESHOLDS.safe) {
    return 'Koffeinnivået ditt er lavt nok til at du kan sove godt. Du kan legge deg når som helst.';
  } else if (currentLevel < SLEEP_THRESHOLDS.moderate) {
    return 'Moderat koffeinnivå. Det kan påvirke søvnkvaliteten litt. Vent gjerne 1–2 timer før du legger deg.';
  } else {
    return 'Høyt koffeinnivå. Unngå mer koffein og vent til kroppen har brutt det ned. Det kan være lurt å utsette leggetiden.';
  }
}

/**
 * Calculates time when caffeine will be below safe threshold
 * 
 * @param currentLevel - Current caffeine level in mg
 * @param currentTime - Current time
 * @returns Date when caffeine will be below safe threshold, or undefined if already safe
 */
export function calculateSafeForSleepTime(currentLevel: number, currentTime: Date): Date | undefined {
  if (currentLevel < SLEEP_THRESHOLDS.safe) {
    return undefined; // Already safe
  }
  
  // Calculate hours needed to reach safe threshold
  // C(t) = C₀ × (0.5)^(t/t½)
  // Solving for t: t = t½ × log₂(C(t)/C₀)
  // t = t½ × ln(C(t)/C₀) / ln(0.5)
  const hoursNeeded = CAFFEINE_HALF_LIFE_HOURS * Math.log(SLEEP_THRESHOLDS.safe / currentLevel) / Math.log(0.5);
  
  const safeTime = new Date(currentTime.getTime() + hoursNeeded * 60 * 60 * 1000);
  return safeTime;
}

/**
 * Generates timeline of caffeine levels over time
 * 
 * @param intakes - Array of caffeine intake records
 * @param currentTime - Current time
 * @param hoursAhead - Number of hours to project into the future (default: 12)
 * @param intervalHours - Interval between timeline points in hours (default: 0.5)
 * @returns Array of timeline points
 */
export function generateCaffeineTimeline(
  intakes: CaffeineIntake[],
  currentTime: Date,
  hoursAhead: number = 12,
  intervalHours: number = 0.5
): CaffeineTimelinePoint[] {
  const timeline: CaffeineTimelinePoint[] = [];
  
  // Find earliest intake time
  const earliestIntake = intakes.reduce((earliest, intake) => {
    return intake.time < earliest ? intake.time : earliest;
  }, currentTime);
  
  // Start timeline from earliest intake or 2 hours before current time, whichever is later
  const startTime = new Date(Math.max(
    earliestIntake.getTime(),
    currentTime.getTime() - 2 * 60 * 60 * 1000
  ));
  
  // End timeline at current time + hoursAhead
  const endTime = new Date(currentTime.getTime() + hoursAhead * 60 * 60 * 1000);
  
  // Generate timeline points (skip validation since we're projecting into the future)
  let time = new Date(startTime);
  while (time <= endTime) {
    const level = calculateCurrentCaffeineLevel(intakes, time, true);
    timeline.push({
      time: new Date(time),
      level: Math.round(level * 10) / 10, // Round to 1 decimal place
    });
    
    // Advance to next interval
    time = new Date(time.getTime() + intervalHours * 60 * 60 * 1000);
  }
  
  return timeline;
}

/**
 * Main calculation function for caffeine half-life tracking
 * 
 * Calculates current caffeine level using exponential decay formula,
 * provides sleep recommendations, and generates a timeline visualization.
 * 
 * Caffeine Half-Life:
 * - Average human half-life: 5 hours
 * - After 5 hours: 50% remains
 * - After 10 hours: 25% remains
 * - After 15 hours: 12.5% remains
 * 
 * Sleep Recommendations:
 * - < 50mg: Safe for sleep
 * - 50-100mg: May affect sleep quality
 * - > 100mg: Avoid caffeine, wait for metabolism
 * 
 * @param inputs - Caffeine tracker calculation inputs
 * @returns Complete caffeine tracking results
 * 
 * @throws {CoffeeCalculationError} When inputs are invalid
 * 
 * @example
 * ```ts
 * const result = calculateCaffeineLevel({
 *   intakes: [
 *     {
 *       id: '1',
 *       time: new Date('2024-01-01T08:00:00'),
 *       caffeineMg: 95,
 *       source: 'Espresso'
 *     }
 *   ],
 *   currentTime: new Date('2024-01-01T13:00:00')
 * });
 * console.log(result.currentLevel);        // ~47.5mg (after 5 hours)
 * console.log(result.sleepRecommendation); // Safe for sleep
 * ```
 */
export function calculateCaffeineLevel(inputs: CaffeineTrackerInputs): CaffeineTrackerResults {
  const { intakes, currentTime } = inputs;

  // Validate inputs
  if (!intakes || intakes.length === 0) {
    throw new CoffeeCalculationError(
      'Du må oppgi minst ett koffeininntak',
      'invalid_input',
      'intakes'
    );
  }

  // Calculate current caffeine level
  const currentLevel = calculateCurrentCaffeineLevel(intakes, currentTime);
  
  // Round to 1 decimal place
  const roundedCurrentLevel = Math.round(currentLevel * 10) / 10;

  // Calculate time to 50% reduction from current level
  const halfLifeRemaining = CAFFEINE_HALF_LIFE_HOURS;

  // Get sleep recommendation
  const sleepRecommendation = getSleepRecommendation(roundedCurrentLevel);

  // Calculate safe for sleep time
  const safeForSleepTime = calculateSafeForSleepTime(roundedCurrentLevel, currentTime);

  // Generate timeline
  const timeline = generateCaffeineTimeline(intakes, currentTime);

  return {
    currentLevel: roundedCurrentLevel,
    halfLifeRemaining,
    sleepRecommendation,
    timeline,
    safeForSleepTime,
  };
}
