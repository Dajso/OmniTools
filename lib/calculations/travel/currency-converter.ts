/**
 * Currency Converter with Offline Support
 * Provides currency conversion with cached exchange rates for offline use
 * 
 * Features:
 * - Convert between major world currencies
 * - Cache exchange rates in localStorage for offline use
 * - Fallback to cached rates when offline
 * - Support for common travel currencies
 * 
 * @module lib/calculations/travel/currency-converter
 * @see Requirements 16.3, 16.12
 */

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>;
  lastUpdated: number; // timestamp
}

export interface ConversionResult {
  fromAmount: number;
  toAmount: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  inverseRate: number;
  isOffline: boolean;
  rateDate: string;
}

/**
 * List of supported currencies for travel
 */
export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
];

/**
 * Default exchange rates (USD base) for offline fallback
 * These are approximate rates and should be updated periodically
 */
export const DEFAULT_RATES: ExchangeRates = {
  base: 'USD',
  date: '2024-01-01',
  rates: {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 148.5,
    CHF: 0.86,
    CAD: 1.35,
    AUD: 1.53,
    NZD: 1.62,
    CNY: 7.15,
    HKD: 7.82,
    SGD: 1.34,
    SEK: 10.35,
    NOK: 10.45,
    DKK: 6.85,
    MXN: 17.15,
    BRL: 4.95,
    INR: 83.25,
    KRW: 1305.0,
    THB: 35.0,
    PLN: 4.0,
    CZK: 22.5,
    HUF: 355.0,
    TRY: 30.0,
    ZAR: 18.75,
    AED: 3.67,
    SAR: 3.75,
    ILS: 3.65,
    PHP: 55.5,
    MYR: 4.7,
    IDR: 15500.0,
  },
  lastUpdated: Date.now(),
};

const CACHE_KEY = 'omnitools_exchange_rates';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Gets cached exchange rates from localStorage
 */
export function getCachedRates(): ExchangeRates | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached) as ExchangeRates;
    }
  } catch {
    // Ignore localStorage errors
  }
  
  return null;
}

/**
 * Saves exchange rates to localStorage cache
 */
export function setCachedRates(rates: ExchangeRates): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(rates));
  } catch {
    // Ignore localStorage errors (e.g., quota exceeded)
  }
}

/**
 * Checks if cached rates are still valid (within cache duration)
 */
export function isCacheValid(rates: ExchangeRates): boolean {
  const now = Date.now();
  return now - rates.lastUpdated < CACHE_DURATION;
}

/**
 * Gets the best available exchange rates (cached or default)
 */
export function getExchangeRates(): { rates: ExchangeRates; isOffline: boolean } {
  const cached = getCachedRates();
  
  if (cached && isCacheValid(cached)) {
    return { rates: cached, isOffline: false };
  }
  
  if (cached) {
    // Use stale cache if available
    return { rates: cached, isOffline: true };
  }
  
  // Fall back to default rates
  return { rates: DEFAULT_RATES, isOffline: true };
}

/**
 * Converts an amount from one currency to another
 * 
 * @param amount - The amount to convert
 * @param fromCurrency - Source currency code (e.g., 'USD')
 * @param toCurrency - Target currency code (e.g., 'EUR')
 * @param customRates - Optional custom exchange rates to use
 * @returns ConversionResult with converted amount and rate information
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  customRates?: ExchangeRates
): ConversionResult {
  if (amount < 0) {
    throw new Error('Amount cannot be negative');
  }
  
  const { rates, isOffline } = customRates 
    ? { rates: customRates, isOffline: false }
    : getExchangeRates();
  
  const fromCode = fromCurrency.toUpperCase();
  const toCode = toCurrency.toUpperCase();
  
  if (!(fromCode in rates.rates)) {
    throw new Error(`Unsupported currency: ${fromCurrency}`);
  }
  
  if (!(toCode in rates.rates)) {
    throw new Error(`Unsupported currency: ${toCurrency}`);
  }
  
  // Convert through base currency (USD)
  const fromRate = rates.rates[fromCode];
  const toRate = rates.rates[toCode];
  
  // Calculate the direct exchange rate
  const rate = toRate / fromRate;
  const inverseRate = fromRate / toRate;
  
  // Calculate converted amount
  const toAmount = amount * rate;
  
  return {
    fromAmount: amount,
    toAmount: roundToDecimals(toAmount, getDecimalPlaces(toCode)),
    fromCurrency: fromCode,
    toCurrency: toCode,
    rate: roundToDecimals(rate, 6),
    inverseRate: roundToDecimals(inverseRate, 6),
    isOffline,
    rateDate: rates.date,
  };
}

/**
 * Gets the appropriate number of decimal places for a currency
 */
function getDecimalPlaces(currencyCode: string): number {
  // Currencies with 0 decimal places
  const noDecimals = ['JPY', 'KRW', 'IDR', 'VND', 'HUF'];
  if (noDecimals.includes(currencyCode)) {
    return 0;
  }
  
  return 2;
}

/**
 * Rounds a number to specified decimal places
 */
function roundToDecimals(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Converts currency back (inverse conversion)
 * Used for round-trip property testing
 * 
 * @param result - Previous conversion result
 * @param customRates - Optional custom exchange rates
 * @returns ConversionResult converting back to original currency
 */
export function convertBack(
  result: ConversionResult,
  customRates?: ExchangeRates
): ConversionResult {
  return convertCurrency(
    result.toAmount,
    result.toCurrency,
    result.fromCurrency,
    customRates
  );
}

/**
 * Gets currency information by code
 */
export function getCurrencyInfo(code: string): Currency | undefined {
  return SUPPORTED_CURRENCIES.find(c => c.code === code.toUpperCase());
}

/**
 * Formats an amount with currency symbol
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = getCurrencyInfo(currencyCode);
  const decimals = getDecimalPlaces(currencyCode);
  const formattedAmount = amount.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  if (currency) {
    return `${currency.symbol}${formattedAmount}`;
  }
  
  return `${formattedAmount} ${currencyCode}`;
}

/**
 * Gets all available currency codes
 */
export function getAvailableCurrencies(): string[] {
  return SUPPORTED_CURRENCIES.map(c => c.code);
}

/**
 * Checks if a currency code is supported
 */
export function isCurrencySupported(code: string): boolean {
  return SUPPORTED_CURRENCIES.some(c => c.code === code.toUpperCase());
}
