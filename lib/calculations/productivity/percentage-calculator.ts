/**
 * Percentage Calculator
 * 
 * @module lib/calculations/productivity/percentage-calculator
 * @see Requirements 9.11
 */

export type PercentageMode = 
  | 'what-is-x-percent-of-y'      // What is X% of Y?
  | 'x-is-what-percent-of-y'      // X is what % of Y?
  | 'percent-change'              // % change from X to Y
  | 'percent-increase'            // Increase X by Y%
  | 'percent-decrease';           // Decrease X by Y%

export interface PercentageInputs {
  mode: PercentageMode;
  value1: number;
  value2: number;
}

export interface PercentageResults {
  result: number;
  formula: string;
  explanation: string;
}

export function calculatePercentage(inputs: PercentageInputs): PercentageResults {
  const { mode, value1, value2 } = inputs;
  
  let result: number;
  let formula: string;
  let explanation: string;

  switch (mode) {
    case 'what-is-x-percent-of-y':
      result = (value1 / 100) * value2;
      formula = `${value1}% × ${value2} = ${result}`;
      explanation = `${value1}% of ${value2} is ${result}`;
      break;
      
    case 'x-is-what-percent-of-y':
      if (value2 === 0) throw new Error('Cannot divide by zero');
      result = (value1 / value2) * 100;
      formula = `(${value1} ÷ ${value2}) × 100 = ${result.toFixed(2)}%`;
      explanation = `${value1} is ${result.toFixed(2)}% of ${value2}`;
      break;
      
    case 'percent-change':
      if (value1 === 0) throw new Error('Cannot calculate change from zero');
      result = ((value2 - value1) / value1) * 100;
      formula = `((${value2} - ${value1}) ÷ ${value1}) × 100 = ${result.toFixed(2)}%`;
      explanation = result >= 0 
        ? `${result.toFixed(2)}% increase from ${value1} to ${value2}`
        : `${Math.abs(result).toFixed(2)}% decrease from ${value1} to ${value2}`;
      break;
      
    case 'percent-increase':
      result = value1 * (1 + value2 / 100);
      formula = `${value1} × (1 + ${value2}/100) = ${result}`;
      explanation = `${value1} increased by ${value2}% is ${result}`;
      break;
      
    case 'percent-decrease':
      result = value1 * (1 - value2 / 100);
      formula = `${value1} × (1 - ${value2}/100) = ${result}`;
      explanation = `${value1} decreased by ${value2}% is ${result}`;
      break;
      
    default:
      throw new Error('Invalid calculation mode');
  }

  return { result, formula, explanation };
}
