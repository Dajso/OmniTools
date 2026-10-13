/**
 * Tempokalkulator
 *
 * Regner ut tempo (min/km), tid og distanse for løping og gange.
 * Beregningene gjøres i kilometer.
 *
 * @module lib/calculations/health/pace-calculator
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

const KM_PER_MILE = 1.609344;

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

  // Distanse i km
  let distanceKmInput: number;
  if (distanceUnit === 'km') distanceKmInput = distance;
  else if (distanceUnit === 'miles') distanceKmInput = distance * KM_PER_MILE;
  else distanceKmInput = distance / 1000;

  const totalTimeSeconds = hours * 3600 + minutes * 60 + seconds;

  // Tempo i sekunder per km
  const inputPaceSeconds = paceMinutes * 60 + paceSeconds;
  const paceSecondsPerKm = paceUnit === 'min/mile' ? inputPaceSeconds / KM_PER_MILE : inputPaceSeconds;

  let resultKm: number;
  let resultTime: number;
  let resultPacePerKm: number;

  if (calculationType === 'pace') {
    resultKm = distanceKmInput;
    resultTime = totalTimeSeconds;
    resultPacePerKm = distanceKmInput > 0 ? totalTimeSeconds / distanceKmInput : 0;
  } else if (calculationType === 'time') {
    resultKm = distanceKmInput;
    resultPacePerKm = paceSecondsPerKm;
    resultTime = distanceKmInput * paceSecondsPerKm;
  } else {
    resultPacePerKm = paceSecondsPerKm;
    resultTime = totalTimeSeconds;
    resultKm = paceSecondsPerKm > 0 ? totalTimeSeconds / paceSecondsPerKm : 0;
  }

  const speedKmh = resultPacePerKm > 0 ? 3600 / resultPacePerKm : 0;
  const pacePerMile = resultPacePerKm * KM_PER_MILE;

  // Mellomtider på vanlige distanser
  const splitDistances: Array<{ km: number; label: string }> = [
    { km: 1, label: '1 km' },
    { km: 3, label: '3 km' },
    { km: 5, label: '5 km' },
    { km: 10, label: '10 km' },
    { km: 15, label: '15 km' },
    { km: 21.0975, label: 'Halvmaraton' },
    { km: 42.195, label: 'Maraton' },
  ];
  const splits: Array<{ distance: string; time: string }> = [];
  for (const d of splitDistances) {
    if (d.km <= resultKm + 1e-9) {
      splits.push({ distance: d.label, time: formatTime(d.km * resultPacePerKm) });
    }
  }

  return {
    pace: {
      minutes: Math.floor(resultPacePerKm / 60),
      seconds: Math.round(resultPacePerKm % 60),
      perMile: formatPace(pacePerMile),
      perKm: formatPace(resultPacePerKm),
    },
    time: {
      hours: Math.floor(resultTime / 3600),
      minutes: Math.floor((resultTime % 3600) / 60),
      seconds: Math.round(resultTime % 60),
      total: formatTime(resultTime),
    },
    distance: {
      miles: Math.round((resultKm / KM_PER_MILE) * 100) / 100,
      km: Math.round(resultKm * 100) / 100,
      meters: Math.round(resultKm * 1000),
    },
    speed: {
      mph: Math.round((speedKmh / KM_PER_MILE) * 10) / 10,
      kmh: Math.round(speedKmh * 10) / 10,
    },
    splits,
  };
}
