/**
 * French Press Timer
 * 
 * Timer with bloom and stir reminders for French press brewing.
 * Calculates brew ratio and provides timeline with reminders.
 * 
 * @module lib/calculations/coffee/french-press-timer
 * @see Requirements 10.1, 10.5, 10.6, 10.7
 */

import { CoffeeCalculationError } from './extraction-yield';

/**
 * Timeline event type
 */
export type TimelineEventType = 'bloom' | 'stir' | 'press';

/**
 * Individual timeline event
 */
export interface TimelineEvent {
  /** Time in seconds from start */
  time: number;
  /** Action description */
  action: string;
  /** Event type */
  type: TimelineEventType;
}

/**
 * Input parameters for French press timer
 */
export interface FrenchPressInputs {
  /** Coffee dose in grams (10g - 100g) */
  coffeeDose: number;
  /** Water amount in grams (100g - 2000g) */
  waterAmount: number;
  /** Steep time in minutes (2 - 10) */
  steepTime: number;
}

/**
 * Results from French press timer calculation
 */
export interface FrenchPressResults {
  /** Brew ratio (water / coffee) */
  brewRatio: number;
  /** Brew ratio display string (e.g., "1:15") */
  brewRatioDisplay: string;
  /** Strength estimate based on ratio */
  strengthEstimate: string;
  /** Timeline of events with reminders */
  timeline: TimelineEvent[];
  /** Total brew time in seconds */
  totalTime: number;
  /** Brewing instructions */
  instructions: string[];
}

/**
 * Determines strength estimate based on brew ratio
 * 
 * @param ratio - Brew ratio (water / coffee)
 * @returns Strength description
 */
function getStrengthEstimate(ratio: number): string {
  if (ratio <= 12) {
    return 'Very Strong - Intense, bold flavor';
  } else if (ratio <= 15) {
    return 'Strong - Rich, full-bodied';
  } else if (ratio <= 17) {
    return 'Balanced - Classic French press strength';
  } else if (ratio <= 20) {
    return 'Mild - Lighter, more delicate';
  } else {
    return 'Very Mild - Subtle, tea-like';
  }
}

/**
 * Generates brewing instructions
 * 
 * @returns Array of instruction strings
 */
function generateInstructions(): string[] {
  return [
    'Preheat French press with hot water, then discard',
    'Add coarse ground coffee to the press',
    'Start timer and add water just off boil (195-205°F)',
    'Stir gently at bloom reminder (30 seconds)',
    'Place lid on press but do not plunge yet',
    'Stir again at halfway point to ensure even extraction',
    'When timer completes, press plunger slowly and steadily',
    'Pour immediately to prevent over-extraction',
  ];
}

/**
 * Calculates French press brewing timeline
 * 
 * Generates a timeline with bloom, stir, and press reminders for French press brewing.
 * Calculates brew ratio and provides strength estimate.
 * 
 * Timeline structure:
 * - 0:00: Start brewing, add water
 * - 0:30: Bloom reminder (stir)
 * - Halfway point: Stir reminder
 * - End of steep time: Press reminder
 * 
 * @param inputs - French press timer inputs
 * @returns Complete timeline with brew ratio and instructions
 * 
 * @throws {CoffeeCalculationError} When inputs are invalid or out of range
 * 
 * @example
 * ```ts
 * // Standard French press with 30g coffee, 500g water, 4 minutes
 * const result = calculateFrenchPressTimeline({
 *   coffeeDose: 30,
 *   waterAmount: 500,
 *   steepTime: 4
 * });
 * console.log(result.brewRatio);  // 16.67
 * console.log(result.brewRatioDisplay);  // "1:16.7"
 * console.log(result.strengthEstimate);  // "Balanced - Classic French press strength"
 * console.log(result.timeline.length);  // 3 events (bloom, stir, press)
 * console.log(result.totalTime);  // 240 seconds (4 minutes)
 * ```
 */
export function calculateFrenchPressTimeline(inputs: FrenchPressInputs): FrenchPressResults {
  const { coffeeDose, waterAmount, steepTime } = inputs;

  // Validate coffee dose
  if (coffeeDose <= 0) {
    throw new CoffeeCalculationError(
      'Coffee dose must be a positive number',
      'invalid_input',
      'coffeeDose'
    );
  }
  if (coffeeDose < 10 || coffeeDose > 100) {
    throw new CoffeeCalculationError(
      'Coffee dose must be between 10g and 100g',
      'out_of_range',
      'coffeeDose'
    );
  }

  // Validate water amount
  if (waterAmount <= 0) {
    throw new CoffeeCalculationError(
      'Water amount must be a positive number',
      'invalid_input',
      'waterAmount'
    );
  }
  if (waterAmount < 100 || waterAmount > 2000) {
    throw new CoffeeCalculationError(
      'Water amount must be between 100g and 2000g',
      'out_of_range',
      'waterAmount'
    );
  }

  // Validate steep time
  if (steepTime <= 0) {
    throw new CoffeeCalculationError(
      'Steep time must be a positive number',
      'invalid_input',
      'steepTime'
    );
  }
  if (steepTime < 2 || steepTime > 10) {
    throw new CoffeeCalculationError(
      'Steep time must be between 2 and 10 minutes',
      'out_of_range',
      'steepTime'
    );
  }

  // Calculate brew ratio
  const brewRatio = waterAmount / coffeeDose;
  const brewRatioDisplay = `1:${brewRatio.toFixed(1)}`;
  const strengthEstimate = getStrengthEstimate(brewRatio);

  // Convert steep time to seconds
  const totalTime = steepTime * 60;

  // Calculate timeline events
  const bloomTime = 30; // 30 seconds for bloom
  const stirTime = Math.floor(totalTime / 2); // Halfway point

  const timeline: TimelineEvent[] = [
    {
      time: bloomTime,
      action: 'Stir gently to saturate all grounds',
      type: 'bloom',
    },
    {
      time: stirTime,
      action: 'Stir again to ensure even extraction',
      type: 'stir',
    },
    {
      time: totalTime,
      action: 'Press plunger slowly and serve immediately',
      type: 'press',
    },
  ];

  // Generate instructions
  const instructions = generateInstructions();

  return {
    brewRatio,
    brewRatioDisplay,
    strengthEstimate,
    timeline,
    totalTime,
    instructions,
  };
}

/**
 * Formats time in seconds to MM:SS format
 * 
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "4:00")
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Gets the next upcoming event based on elapsed time
 * 
 * @param timeline - Array of timeline events
 * @param elapsedSeconds - Elapsed time in seconds
 * @returns Next event or undefined if no more events
 */
export function getNextEvent(timeline: TimelineEvent[], elapsedSeconds: number): TimelineEvent | undefined {
  return timeline.find(event => elapsedSeconds < event.time);
}

/**
 * Gets the most recent completed event based on elapsed time
 * 
 * @param timeline - Array of timeline events
 * @param elapsedSeconds - Elapsed time in seconds
 * @returns Most recent event or undefined if no events completed
 */
export function getLastCompletedEvent(timeline: TimelineEvent[], elapsedSeconds: number): TimelineEvent | undefined {
  const completedEvents = timeline.filter(event => elapsedSeconds >= event.time);
  return completedEvents[completedEvents.length - 1];
}
