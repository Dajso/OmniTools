/**
 * Pace Calculator
 * 
 * Calculates running/walking pace, time, and distance.
 * 
 * @module lib/calculations/health/pace-calculator
 * @see Requirements 6.10
 */

export type CalculationType = 'pace' | 'time' | 'distance';

export interface PaceInputs {
  calculationType: CalculationType;
  distance?: number;
  distanceUnit: 'miles' | 'km' | 'meters';
  hours?: number;
  minutes?: number;
  seconds?: number;
  paceMinutes?: number;
  paceSeconds?: number;
  paceUnit: 'min/mile' | 'min/km';
}

export interface PaceResults {
  pace: { minutes: number; seconds: number; perMile: string; perKm: string };
  time: { hours: number; minutes: number; seconds: number; total: string };
  distance: { miles: number; km: number; meters: number };
  speed: { mph: number; kmh: number };
  splits: Array<{ distance: string; time: string }>;
}

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function formatPace(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function calculatePace(inputs: PaceInputs): PaceResults {
  const {
    calculationType,
    distance = 0,
    distanceUnit,
    hours = 0,
    minutes = 0,
    seconds = 0,
    paceMinutes = 0,
    paceSeconds = 0,
    paceUnit,
  } = inputs;

  // Convert distance to miles
  let distanceMiles: number;
  if (distanceUnit === 'miles') distanceMiles = distance;
  else if (distanceUnit === 'km') distanceMiles = distance * 0.621371;
  else distanceMiles = distance * 0.000621371;

  // Convert time to seconds
  const totalTimeSeconds = hours * 3600 + minutes * 60 + seconds;

  // Convert pace to seconds per mile
  let paceSecondsPerMile: number;
  const inputPaceSeconds = paceMinutes * 60 + paceSeconds;
  if (paceUnit === 'min/mile') {
    paceSecondsPerMile = inputPaceSeconds;
  } else {
    paceSecondsPerMile = inputPaceSeconds * 1.60934;
  }

  let resultDistance: number;
  let resultTime: number;
  let resultPace: number;

  if (calculationType === 'pace') {
    resultDistance = distanceMiles;
    resultTime = totalTimeSeconds;
    resultPace = distanceMiles > 0 ? totalTimeSeconds / distanceMiles : 0;
  } else if (calculationType === 'time') {
    resultDistance = distanceMiles;
    resultPace = paceSecondsPerMile;
    resultTime = distanceMiles * paceSecondsPerMile;
  } else {
    resultPace = paceSecondsPerMile;
    resultTime = totalTimeSeconds;
    resultDistance = paceSecondsPerMile > 0 ? totalTimeSeconds / paceSecondsPerMile : 0;
  }

  const distanceKm = resultDistance * 1.60934;
  const pacePerKm = resultPace / 1.60934;
  const speedMph = resultPace > 0 ? 3600 / resultPace : 0;
  const speedKmh = speedMph * 1.60934;

  // Generate splits
  const splits: Array<{ distance: string; time: string }> = [];
  const splitDistances = [0.25, 0.5, 1, 2, 3, 5, 10];
  for (const d of splitDistances) {
    if (d <= resultDistance) {
      splits.push({
        distance: `${d} mi`,
        time: formatTime(d * resultPace),
      });
    }
  }

  return {
    pace: {
      minutes: Math.floor(resultPace / 60),
      seconds: Math.round(resultPace % 60),
      perMile: formatPace(resultPace),
      perKm: formatPace(pacePerKm),
    },
    time: {
      hours: Math.floor(resultTime / 3600),
      minutes: Math.floor((resultTime % 3600) / 60),
      seconds: Math.round(resultTime % 60),
      total: formatTime(resultTime),
    },
    distance: {
      miles: Math.round(resultDistance * 100) / 100,
      km: Math.round(distanceKm * 100) / 100,
      meters: Math.round(distanceKm * 1000),
    },
    speed: {
      mph: Math.round(speedMph * 10) / 10,
      kmh: Math.round(speedKmh * 10) / 10,
    },
    splits,
  };
}
