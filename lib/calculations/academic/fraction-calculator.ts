/**
 * Fraction Calculator
 * Supports add, subtract, multiply, divide, and simplify operations
 * 
 * @module lib/calculations/academic/fraction-calculator
 * @see Requirements 15.5, 15.11
 */

export interface Fraction {
  numerator: number;
  denominator: number;
}

/**
 * Calculates the Greatest Common Divisor (GCD) of two numbers
 * Uses Euclidean algorithm
 * 
 * @param a - First number
 * @param b - Second number
 * @returns The GCD of a and b
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  
  return a;
}

/**
 * Calculates the Least Common Multiple (LCM) of two numbers
 * 
 * @param a - First number
 * @param b - Second number
 * @returns The LCM of a and b
 */
export function lcm(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  
  if (a === 0 || b === 0) return 0;
  
  return (a * b) / gcd(a, b);
}

/**
 * Validates a fraction
 * 
 * @param f - Fraction to validate
 * @throws Error if denominator is zero
 */
function validateFraction(f: Fraction): void {
  if (f.denominator === 0) {
    throw new Error('Denominator cannot be zero');
  }
}

/**
 * Simplifies a fraction to its lowest terms
 * Ensures denominator is always positive
 * 
 * Property: For all simplified fractions f:
 * - gcd(|f.numerator|, f.denominator) === 1
 * - f.denominator > 0
 * 
 * @param f - Fraction to simplify
 * @returns Simplified fraction with positive denominator
 */
export function simplifyFraction(f: Fraction): Fraction {
  validateFraction(f);
  
  // Handle zero numerator
  if (f.numerator === 0) {
    return { numerator: 0, denominator: 1 };
  }
  
  const divisor = gcd(Math.abs(f.numerator), Math.abs(f.denominator));
  
  let numerator = f.numerator / divisor;
  let denominator = f.denominator / divisor;
  
  // Ensure denominator is positive (move sign to numerator)
  if (denominator < 0) {
    numerator = -numerator;
    denominator = -denominator;
  }
  
  return {
    numerator: Math.round(numerator),
    denominator: Math.round(denominator),
  };
}

/**
 * Adds two fractions
 * Formula: a/b + c/d = (a*d + c*b) / (b*d)
 * 
 * @param a - First fraction
 * @param b - Second fraction
 * @returns Sum of the two fractions (simplified)
 */
export function addFractions(a: Fraction, b: Fraction): Fraction {
  validateFraction(a);
  validateFraction(b);
  
  const numerator = a.numerator * b.denominator + b.numerator * a.denominator;
  const denominator = a.denominator * b.denominator;
  
  return simplifyFraction({ numerator, denominator });
}

/**
 * Subtracts two fractions
 * Formula: a/b - c/d = (a*d - c*b) / (b*d)
 * 
 * @param a - First fraction
 * @param b - Second fraction
 * @returns Difference of the two fractions (simplified)
 */
export function subtractFractions(a: Fraction, b: Fraction): Fraction {
  validateFraction(a);
  validateFraction(b);
  
  const numerator = a.numerator * b.denominator - b.numerator * a.denominator;
  const denominator = a.denominator * b.denominator;
  
  return simplifyFraction({ numerator, denominator });
}

/**
 * Multiplies two fractions
 * Formula: a/b * c/d = (a*c) / (b*d)
 * 
 * @param a - First fraction
 * @param b - Second fraction
 * @returns Product of the two fractions (simplified)
 */
export function multiplyFractions(a: Fraction, b: Fraction): Fraction {
  validateFraction(a);
  validateFraction(b);
  
  const numerator = a.numerator * b.numerator;
  const denominator = a.denominator * b.denominator;
  
  return simplifyFraction({ numerator, denominator });
}

/**
 * Divides two fractions
 * Formula: (a/b) / (c/d) = (a*d) / (b*c)
 * 
 * @param a - First fraction (dividend)
 * @param b - Second fraction (divisor)
 * @returns Quotient of the two fractions (simplified)
 * @throws Error if dividing by zero (b.numerator === 0)
 */
export function divideFractions(a: Fraction, b: Fraction): Fraction {
  validateFraction(a);
  validateFraction(b);
  
  if (b.numerator === 0) {
    throw new Error('Cannot divide by zero');
  }
  
  const numerator = a.numerator * b.denominator;
  const denominator = a.denominator * b.numerator;
  
  return simplifyFraction({ numerator, denominator });
}

/**
 * Converts a fraction to a decimal
 * 
 * @param f - Fraction to convert
 * @returns Decimal representation
 */
export function fractionToDecimal(f: Fraction): number {
  validateFraction(f);
  return f.numerator / f.denominator;
}

/**
 * Converts a decimal to a fraction (approximation)
 * Uses continued fraction algorithm for best approximation
 * 
 * @param decimal - Decimal number to convert
 * @param maxDenominator - Maximum denominator allowed (default: 10000)
 * @returns Fraction approximation
 */
export function decimalToFraction(decimal: number, maxDenominator: number = 10000): Fraction {
  if (Number.isInteger(decimal)) {
    return { numerator: decimal, denominator: 1 };
  }
  
  const sign = decimal < 0 ? -1 : 1;
  decimal = Math.abs(decimal);
  
  let bestNumerator = 1;
  let bestDenominator = 1;
  let bestError = Math.abs(decimal - 1);
  
  for (let d = 1; d <= maxDenominator; d++) {
    const n = Math.round(decimal * d);
    const error = Math.abs(decimal - n / d);
    
    if (error < bestError) {
      bestError = error;
      bestNumerator = n;
      bestDenominator = d;
      
      if (error === 0) break;
    }
  }
  
  return simplifyFraction({
    numerator: sign * bestNumerator,
    denominator: bestDenominator,
  });
}

/**
 * Formats a fraction as a string
 * 
 * @param f - Fraction to format
 * @returns String representation (e.g., "3/4" or "-1/2")
 */
export function formatFraction(f: Fraction): string {
  const simplified = simplifyFraction(f);
  
  if (simplified.denominator === 1) {
    return simplified.numerator.toString();
  }
  
  return `${simplified.numerator}/${simplified.denominator}`;
}

/**
 * Parses a fraction string
 * Supports formats: "3/4", "-1/2", "5"
 * 
 * @param str - String to parse
 * @returns Parsed fraction
 * @throws Error if string is invalid
 */
export function parseFraction(str: string): Fraction {
  const trimmed = str.trim();
  
  if (trimmed.includes('/')) {
    const parts = trimmed.split('/');
    if (parts.length !== 2) {
      throw new Error(`Invalid fraction format: ${str}`);
    }
    
    const numerator = parseInt(parts[0], 10);
    const denominator = parseInt(parts[1], 10);
    
    if (isNaN(numerator) || isNaN(denominator)) {
      throw new Error(`Invalid fraction format: ${str}`);
    }
    
    if (denominator === 0) {
      throw new Error('Denominator cannot be zero');
    }
    
    return { numerator, denominator };
  }
  
  const numerator = parseInt(trimmed, 10);
  if (isNaN(numerator)) {
    throw new Error(`Invalid fraction format: ${str}`);
  }
  
  return { numerator, denominator: 1 };
}

/**
 * Compares two fractions
 * 
 * @param a - First fraction
 * @param b - Second fraction
 * @returns -1 if a < b, 0 if a === b, 1 if a > b
 */
export function compareFractions(a: Fraction, b: Fraction): -1 | 0 | 1 {
  validateFraction(a);
  validateFraction(b);
  
  const diff = a.numerator * b.denominator - b.numerator * a.denominator;
  
  if (diff < 0) return -1;
  if (diff > 0) return 1;
  return 0;
}

/**
 * Checks if two fractions are equal
 * 
 * @param a - First fraction
 * @param b - Second fraction
 * @returns True if fractions are equal
 */
export function fractionsEqual(a: Fraction, b: Fraction): boolean {
  return compareFractions(a, b) === 0;
}
