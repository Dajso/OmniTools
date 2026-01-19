/**
 * Ethereum Unit Converter
 * 
 * Converts between Ethereum units (Wei, Gwei, Ether) with proper
 * handling of 18 decimal precision using BigInt for accuracy.
 * 
 * @module lib/calculations/crypto/ethereum-units
 * @see Requirements 22.10, 22.12
 */

/**
 * Error class for Ethereum unit conversion errors
 */
export class EthereumUnitError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'overflow' | 'precision_loss',
    public field?: string
  ) {
    super(message);
    this.name = 'EthereumUnitError';
  }
}

/**
 * Ethereum unit types
 */
export type EthereumUnit = 'wei' | 'kwei' | 'mwei' | 'gwei' | 'szabo' | 'finney' | 'ether';

/**
 * Conversion factors to Wei (base unit)
 * Using BigInt for 18 decimal precision
 */
export const UNIT_FACTORS: Record<EthereumUnit, bigint> = {
  wei: 1n,
  kwei: 1000n,                          // 10^3
  mwei: 1000000n,                       // 10^6
  gwei: 1000000000n,                    // 10^9
  szabo: 1000000000000n,                // 10^12
  finney: 1000000000000000n,            // 10^15
  ether: 1000000000000000000n,          // 10^18
};

/**
 * Unit display names
 */
export const UNIT_NAMES: Record<EthereumUnit, string> = {
  wei: 'Wei',
  kwei: 'Kwei (Babbage)',
  mwei: 'Mwei (Lovelace)',
  gwei: 'Gwei (Shannon)',
  szabo: 'Szabo',
  finney: 'Finney',
  ether: 'Ether',
};

/**
 * Decimal places for each unit relative to Ether
 */
export const UNIT_DECIMALS: Record<EthereumUnit, number> = {
  wei: 18,
  kwei: 15,
  mwei: 12,
  gwei: 9,
  szabo: 6,
  finney: 3,
  ether: 0,
};


/**
 * Input for Ethereum unit conversion
 */
export interface EthereumConversionInput {
  /** The value to convert */
  value: string | number | bigint;
  /** The source unit */
  fromUnit: EthereumUnit;
  /** The target unit */
  toUnit: EthereumUnit;
}

/**
 * Result of Ethereum unit conversion
 */
export interface EthereumConversionResult {
  /** The converted value as a string (to preserve precision) */
  value: string;
  /** The converted value as a number (may lose precision for very large/small values) */
  valueNumber: number;
  /** The source unit */
  fromUnit: EthereumUnit;
  /** The target unit */
  toUnit: EthereumUnit;
  /** Formatted display string */
  formatted: string;
  /** Whether precision was potentially lost in number conversion */
  precisionWarning: boolean;
}

/**
 * Convert scientific notation to decimal string
 * 
 * @param value - The value that may be in scientific notation
 * @returns The value as a decimal string
 */
function scientificToDecimal(value: string | number): string {
  const strValue = String(value);
  
  // Check if it's in scientific notation
  if (!/[eE]/.test(strValue)) {
    return strValue;
  }
  
  const num = parseFloat(strValue);
  if (!Number.isFinite(num)) {
    throw new EthereumUnitError(
      'Invalid numeric value',
      'invalid_input',
      'value'
    );
  }
  
  // Convert to fixed notation with enough precision
  // Use toFixed with max precision to avoid scientific notation
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  
  if (absNum === 0) {
    return '0';
  }
  
  // Determine the number of decimal places needed
  const exponent = Math.floor(Math.log10(absNum));
  const decimalPlaces = Math.max(0, -exponent + 18);
  
  let result = absNum.toFixed(Math.min(decimalPlaces, 20));
  
  // Remove trailing zeros after decimal point
  if (result.includes('.')) {
    result = result.replace(/\.?0+$/, '');
  }
  
  return isNegative ? '-' + result : result;
}

/**
 * Parse a decimal string to Wei (BigInt)
 * Handles decimal values by scaling appropriately
 * 
 * @param value - The value to parse
 * @param unit - The unit of the value
 * @returns The value in Wei as BigInt
 */
export function parseToWei(value: string | number | bigint, unit: EthereumUnit): bigint {
  const factor = UNIT_FACTORS[unit];
  
  if (typeof value === 'bigint') {
    return value * factor;
  }
  
  // Convert scientific notation to decimal string
  const strValue = scientificToDecimal(value);
  
  // Validate input - allow decimal numbers
  if (!/^-?\d*\.?\d+$/.test(strValue)) {
    throw new EthereumUnitError(
      'Invalid numeric value',
      'invalid_input',
      'value'
    );
  }
  
  // Handle negative values
  const isNegative = strValue.startsWith('-');
  const absValue = isNegative ? strValue.slice(1) : strValue;
  
  // Split into integer and decimal parts
  const [intPart, decPart = ''] = absValue.split('.');
  
  // Calculate how many decimal places we need to handle
  const unitDecimals = 18 - UNIT_DECIMALS[unit];
  
  // Pad or truncate decimal part
  const paddedDecimal = decPart.padEnd(unitDecimals, '0').slice(0, unitDecimals);
  
  // Combine integer and decimal parts
  const combinedStr = intPart + paddedDecimal;
  
  // Remove leading zeros but keep at least one digit
  const cleanedStr = combinedStr.replace(/^0+/, '') || '0';
  
  let result = BigInt(cleanedStr);
  
  if (isNegative) {
    result = -result;
  }
  
  return result;
}


/**
 * Convert Wei (BigInt) to a decimal string in the target unit
 * 
 * @param weiValue - The value in Wei
 * @param unit - The target unit
 * @returns The value as a decimal string
 */
export function weiToString(weiValue: bigint, unit: EthereumUnit): string {
  const factor = UNIT_FACTORS[unit];
  const isNegative = weiValue < 0n;
  const absWei = isNegative ? -weiValue : weiValue;
  
  // Calculate integer and remainder
  const integerPart = absWei / factor;
  const remainder = absWei % factor;
  
  if (remainder === 0n) {
    return (isNegative ? '-' : '') + integerPart.toString();
  }
  
  // Calculate decimal places needed
  const unitDecimals = 18 - UNIT_DECIMALS[unit];
  
  // Convert remainder to decimal string
  let decimalStr = remainder.toString().padStart(unitDecimals, '0');
  
  // Remove trailing zeros
  decimalStr = decimalStr.replace(/0+$/, '');
  
  const result = `${integerPart}.${decimalStr}`;
  return (isNegative ? '-' : '') + result;
}

/**
 * Convert between Ethereum units
 * 
 * @param input - Conversion input parameters
 * @returns Conversion result with value and metadata
 */
export function convertEthereumUnits(input: EthereumConversionInput): EthereumConversionResult {
  const { value, fromUnit, toUnit } = input;
  
  // Validate units
  if (!UNIT_FACTORS[fromUnit]) {
    throw new EthereumUnitError(
      `Invalid source unit: ${fromUnit}`,
      'invalid_input',
      'fromUnit'
    );
  }
  if (!UNIT_FACTORS[toUnit]) {
    throw new EthereumUnitError(
      `Invalid target unit: ${toUnit}`,
      'invalid_input',
      'toUnit'
    );
  }
  
  // Convert to Wei first
  const weiValue = parseToWei(value, fromUnit);
  
  // Convert from Wei to target unit
  const resultStr = weiToString(weiValue, toUnit);
  
  // Convert to number (may lose precision)
  const resultNumber = parseFloat(resultStr);
  
  // Check for precision loss - use BigInt comparison for BigInt values
  const absWeiValue = weiValue < 0n ? -weiValue : weiValue;
  const precisionWarning = 
    !Number.isFinite(resultNumber) ||
    absWeiValue > BigInt(Number.MAX_SAFE_INTEGER);
  
  return {
    value: resultStr,
    valueNumber: resultNumber,
    fromUnit,
    toUnit,
    formatted: `${resultStr} ${UNIT_NAMES[toUnit]}`,
    precisionWarning,
  };
}


/**
 * Convenience function: Convert Wei to Gwei
 * 
 * @param wei - Value in Wei (as bigint or string)
 * @returns Value in Gwei as number
 */
export function weiToGwei(wei: bigint | string): number {
  const result = convertEthereumUnits({
    value: wei,
    fromUnit: 'wei',
    toUnit: 'gwei',
  });
  return result.valueNumber;
}

/**
 * Convenience function: Convert Wei to Ether
 * 
 * @param wei - Value in Wei (as bigint or string)
 * @returns Value in Ether as number
 */
export function weiToEther(wei: bigint | string): number {
  const result = convertEthereumUnits({
    value: wei,
    fromUnit: 'wei',
    toUnit: 'ether',
  });
  return result.valueNumber;
}

/**
 * Convenience function: Convert Ether to Wei
 * 
 * @param ether - Value in Ether
 * @returns Value in Wei as bigint
 */
export function etherToWei(ether: number | string): bigint {
  return parseToWei(ether, 'ether');
}

/**
 * Convenience function: Convert Gwei to Wei
 * 
 * @param gwei - Value in Gwei
 * @returns Value in Wei as bigint
 */
export function gweiToWei(gwei: number | string): bigint {
  return parseToWei(gwei, 'gwei');
}

/**
 * Convenience function: Convert Gwei to Ether
 * 
 * @param gwei - Value in Gwei
 * @returns Value in Ether as number
 */
export function gweiToEther(gwei: number | string): number {
  const result = convertEthereumUnits({
    value: gwei,
    fromUnit: 'gwei',
    toUnit: 'ether',
  });
  return result.valueNumber;
}

/**
 * Convenience function: Convert Ether to Gwei
 * 
 * @param ether - Value in Ether
 * @returns Value in Gwei as number
 */
export function etherToGwei(ether: number | string): number {
  const result = convertEthereumUnits({
    value: ether,
    fromUnit: 'ether',
    toUnit: 'gwei',
  });
  return result.valueNumber;
}

/**
 * Format a Wei value with appropriate unit suffix
 * Automatically selects the most readable unit
 * 
 * @param wei - Value in Wei
 * @returns Formatted string with appropriate unit
 */
export function formatWeiAuto(wei: bigint | string): string {
  const weiValue = typeof wei === 'string' ? BigInt(wei) : wei;
  const absWei = weiValue < 0n ? -weiValue : weiValue;
  
  // Choose appropriate unit based on magnitude
  if (absWei >= UNIT_FACTORS.ether) {
    return convertEthereumUnits({ value: weiValue, fromUnit: 'wei', toUnit: 'ether' }).formatted;
  } else if (absWei >= UNIT_FACTORS.finney) {
    return convertEthereumUnits({ value: weiValue, fromUnit: 'wei', toUnit: 'finney' }).formatted;
  } else if (absWei >= UNIT_FACTORS.gwei) {
    return convertEthereumUnits({ value: weiValue, fromUnit: 'wei', toUnit: 'gwei' }).formatted;
  } else if (absWei >= UNIT_FACTORS.mwei) {
    return convertEthereumUnits({ value: weiValue, fromUnit: 'wei', toUnit: 'mwei' }).formatted;
  } else {
    return convertEthereumUnits({ value: weiValue, fromUnit: 'wei', toUnit: 'wei' }).formatted;
  }
}
