/**
 * Sleep Cycle Calculator
 * 
 * Calculates optimal wake/sleep times based on sleep cycles.
 * 
 * @module lib/calculations/health/sleep-cycle
 * @see Requirements 6.12
 */

export type CalculationMode = 'wake_time' | 'bed_time';

export interface SleepCycleInputs {
  mode: CalculationMode;
  time: Date;
  fallAsleepMinutes?: number;
}

export interface SleepCycleResults {
  recommendedTimes: Array<{
    time: Date;
    cycles: number;
    hours: number;
    quality: 'optimal' | 'good' | 'fair';
  }>;
  sleepDuration: { min: number; max: number };
}

const CYCLE_DURATION = 90; // minutes
const FALL_ASLEEP_DEFAULT = 15; // minutes

export function calculateSleepCycle(inputs: SleepCycleInputs): SleepCycleResults {
  const { mode, time, fallAsleepMinutes = FALL_ASLEEP_DEFAULT } = inputs;
  const recommendedTimes: SleepCycleResults['recommendedTimes'] = [];

  if (mode === 'wake_time') {
    // Calculate when to go to bed to wake at specified time
    const wakeTime = new Date(time);
    
    for (let cycles = 6; cycles >= 3; cycles--) {
      const sleepMinutes = cycles * CYCLE_DURATION;
      const bedTime = new Date(wakeTime);
      bedTime.setMinutes(bedTime.getMinutes() - sleepMinutes - fallAsleepMinutes);
      
      let quality: 'optimal' | 'good' | 'fair';
      if (cycles >= 5) quality = 'optimal';
      else if (cycles >= 4) quality = 'good';
      else quality = 'fair';

      recommendedTimes.push({
        time: bedTime,
        cycles,
        hours: sleepMinutes / 60,
        quality,
      });
    }
  } else {
    // Calculate when to wake up if going to bed at specified time
    const bedTime = new Date(time);
    const fallAsleepTime = new Date(bedTime);
    fallAsleepTime.setMinutes(fallAsleepTime.getMinutes() + fallAsleepMinutes);
    
    for (let cycles = 3; cycles <= 6; cycles++) {
      const sleepMinutes = cycles * CYCLE_DURATION;
      const wakeTime = new Date(fallAsleepTime);
      wakeTime.setMinutes(wakeTime.getMinutes() + sleepMinutes);
      
      let quality: 'optimal' | 'good' | 'fair';
      if (cycles >= 5) quality = 'optimal';
      else if (cycles >= 4) quality = 'good';
      else quality = 'fair';

      recommendedTimes.push({
        time: wakeTime,
        cycles,
        hours: sleepMinutes / 60,
        quality,
      });
    }
  }

  return {
    recommendedTimes,
    sleepDuration: { min: 4.5, max: 9 },
  };
}
