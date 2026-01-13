/**
 * Number formatting utilities for the English Tools Website
 * 
 * Provides locale-aware formatting for numbers, currencies, and percentages.
 * Defaults to US conventions (1,000.00) per Requirements 14.1
 */

/** Supported locale codes */
export type Locale = 'en-US' | 'en-GB' | 'en-AU';

/** Supported currency codes */
export type CurrencyCode = 'USD' | 'GBP' | 'AUD' | 'EUR';

/** Date format patterns */
export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY';

/**
 * Options for number formatting
 */
export interface FormatNumberOptions {
  /** Locale for formatting (default: 'en-US') */
  locale?: Locale;
  /** Minimum fraction digits */
  minimumFractionDigits?: number;
  /** Maximum fraction digits */
  maximumFractionDigits?: number;
  /** Use grouping separators (thousands) */
  useGrouping?: boolean;
}

/**
 * Options for currency formatting
 */
export interface FormatCurrencyOptions {
  /** Locale for formatting (default: 'en-US') */
  locale?: Locale;
  /** Currency code (default: 'USD') */
  currency?: CurrencyCode;
  /** Whether to show currency symbol */
  showSymbol?: boolean;
}

/**
 * Options for percentage formatting
 */
export interface FormatPercentOptions {
  /** Locale for formatting (default: 'en-US') */
  locale?: Locale;
  /** Number of decimal places (default: 2) */
  decimals?: number;
  /** Whether to include the % symbol (default: true) */
  showSymbol?: boolean;
}

/**
 * Formats a number with locale-aware thousand separators and decimal places
 * 
 * @param value - The number to format
 * @param options - Formatting options
 * @returns Formatted number string
 * 
 * @example
 * formatNumber(1234567.89) // "1,234,567.89"
 * formatNumber(1234567.89, { locale: 'en-GB' }) // "1,234,567.89"
 * formatNumber(1234.5, { maximumFractionDigits: 0 }) // "1,235"
 */
export function formatNumber(
  value: number,
  options: FormatNumberOptions = {}
): string {
  const {
    locale = 'en-US',
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping = true,
  } = options;

  // Handle special cases
  if (!Number.isFinite(value)) {
    return String(value);
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping,
  }).format(value);
}

/**
 * Formats a number as currency with appropriate symbol and decimal places
 * 
 * Currency values are formatted with exactly 2 decimal places per Requirement 3.6
 * 
 * @param value - The number to format as currency
 * @param options - Formatting options
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(1234.5) // "$1,234.50"
 * formatCurrency(1234.5, { currency: 'GBP' }) // "£1,234.50"
 * formatCurrency(1234.5, { currency: 'EUR', locale: 'en-GB' }) // "€1,234.50"
 */
export function formatCurrency(
  value: number,
  options: FormatCurrencyOptions = {}
): string {
  const {
    locale = 'en-US',
    currency = 'USD',
    showSymbol = true,
  } = options;

  // Handle special cases
  if (!Number.isFinite(value)) {
    return String(value);
  }

  if (!showSymbol) {
    // Format without currency symbol, just the number with 2 decimals
    return formatNumber(value, {
      locale,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats a number as a percentage
 * 
 * @param value - The number to format (0.5 = 50%, 50 = 50% depending on isDecimal)
 * @param options - Formatting options
 * @returns Formatted percentage string
 * 
 * @example
 * formatPercent(0.156) // "15.60%"
 * formatPercent(0.156, { decimals: 1 }) // "15.6%"
 * formatPercent(15.6, { isDecimal: false }) // "15.60%"
 */
export function formatPercent(
  value: number,
  options: FormatPercentOptions & { isDecimal?: boolean } = {}
): string {
  const {
    locale = 'en-US',
    decimals = 2,
    showSymbol = true,
    isDecimal = true,
  } = options;

  // Handle special cases
  if (!Number.isFinite(value)) {
    return String(value);
  }

  // Convert to decimal if needed (e.g., 15.6 -> 0.156)
  const decimalValue = isDecimal ? value : value / 100;

  if (!showSymbol) {
    // Return just the number without % symbol
    const percentValue = decimalValue * 100;
    return formatNumber(percentValue, {
      locale,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(decimalValue);
}

/**
 * Formats a date according to the specified format
 * 
 * @param date - The date to format
 * @param format - Date format pattern (default: 'MM/DD/YYYY' for US)
 * @param locale - Locale for formatting
 * @returns Formatted date string
 * 
 * @example
 * formatDate(new Date('2024-03-15')) // "03/15/2024"
 * formatDate(new Date('2024-03-15'), 'DD/MM/YYYY') // "15/03/2024"
 */
export function formatDate(
  date: Date,
  format: DateFormat = 'MM/DD/YYYY',
  locale: Locale = 'en-US'
): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());

  if (format === 'DD/MM/YYYY') {
    return `${day}/${month}/${year}`;
  }
  
  // Default: MM/DD/YYYY (US format)
  return `${month}/${day}/${year}`;
}

/**
 * Rounds a number to a specified number of decimal places
 * 
 * @param value - The number to round
 * @param decimals - Number of decimal places (default: 2)
 * @returns Rounded number
 * 
 * @example
 * roundTo(3.14159, 2) // 3.14
 * roundTo(3.145, 2) // 3.15
 */
export function roundTo(value: number, decimals: number = 2): number {
  if (!Number.isFinite(value)) {
    return value;
  }
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Parses a formatted number string back to a number
 * 
 * @param value - The formatted string to parse
 * @param locale - Locale used for formatting (to determine separators)
 * @returns Parsed number or NaN if invalid
 * 
 * @example
 * parseFormattedNumber("1,234.56") // 1234.56
 * parseFormattedNumber("$1,234.56") // 1234.56
 */
export function parseFormattedNumber(
  value: string,
  locale: Locale = 'en-US'
): number {
  if (!value || typeof value !== 'string') {
    return NaN;
  }

  // Remove currency symbols and whitespace
  let cleaned = value.replace(/[£$€\s]/g, '');
  
  // Remove thousand separators (commas for en-US/en-GB/en-AU)
  cleaned = cleaned.replace(/,/g, '');
  
  // Remove percent sign
  cleaned = cleaned.replace(/%/g, '');

  const result = parseFloat(cleaned);
  return result;
}
