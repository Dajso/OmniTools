/**
 * Random Number Generator
 * 
 * @module lib/calculations/productivity/random-number-generator
 * @see Requirements 9.4
 */

export interface RandomNumberInputs {
  min: number;
  max: number;
  count: number;
  allowDuplicates: boolean;
  sortResults: boolean;
}

export interface RandomNumberResults {
  numbers: number[];
  sum: number;
  average: number;
}

export function generateRandomNumbers(inputs: RandomNumberInputs): RandomNumberResults {
  const { min, max, count, allowDuplicates, sortResults } = inputs;
  
  if (min > max) {
    throw new Error('Minimum must be less than or equal to maximum');
  }
  
  if (count < 1) {
    throw new Error('Count must be at least 1');
  }

  const range = max - min + 1;
  
  if (!allowDuplicates && count > range) {
    throw new Error(`Cannot generate ${count} unique numbers in range ${min}-${max}`);
  }

  let numbers: number[] = [];
  
  if (allowDuplicates) {
    for (let i = 0; i < count; i++) {
      numbers.push(Math.floor(Math.random() * range) + min);
    }
  } else {
    const available = Array.from({ length: range }, (_, i) => min + i);
    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * available.length);
      numbers.push(available[index]);
      available.splice(index, 1);
    }
  }

  if (sortResults) {
    numbers.sort((a, b) => a - b);
  }

  const sum = numbers.reduce((a, b) => a + b, 0);
  const average = sum / numbers.length;

  return { numbers, sum, average };
}
