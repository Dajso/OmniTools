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
  { code: 'NOK', name: 'Norske kroner', symbol: 'kr' },
  { code: 'USD', name: 'Amerikanske dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'Britiske pund', symbol: '£' },
  { code: 'JPY', name: 'Japanske yen', symbol: '¥' },
  { code: 'CHF', name: 'Sveitsiske franc', symbol: 'CHF' },
  { code: 'CAD', name: 'Kanadiske dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australske dollar', symbol: 'A$' },
  { code: 'NZD', name: 'New Zealand-dollar', symbol: 'NZ$' },
  { code: 'CNY', name: 'Kinesiske yuan', symbol: '¥' },
  { code: 'HKD', name: 'Hongkong-dollar', symbol: 'HK$' },
  { code: 'SGD', name: 'Singapore-dollar', symbol: 'S$' },
  { code: 'SEK', name: 'Svenske kroner', symbol: 'kr' },
  { code: 'DKK', name: 'Danske kroner', symbol: 'kr' },
  { code: 'MXN', name: 'Meksikanske peso', symbol: '$' },
  { code: 'BRL', name: 'Brasilianske real', symbol: 'R$' },
  { code: 'INR', name: 'Indiske rupi', symbol: '₹' },
  { code: 'KRW', name: 'Sørkoreanske won', symbol: '₩' },
  { code: 'THB', name: 'Thailandske baht', symbol: '฿' },
  { code: 'PLN', name: 'Polske zloty', symbol: 'zł' },
  { code: 'CZK', name: 'Tsjekkiske kroner', symbol: 'Kč' },
  { code: 'HUF', name: 'Ungarske forint', symbol: 'Ft' },
  { code: 'TRY', name: 'Tyrkiske lira', symbol: '₺' },
  { code: 'ZAR', name: 'Sørafrikanske rand', symbol: 'R' },
  { code: 'AED', name: 'Emiratiske dirham', symbol: 'د.إ' },
  { code: 'SAR', name: 'Saudiarabiske riyal', symbol: '﷼' },
  { code: 'ILS', name: 'Israelske shekel', symbol: '₪' },
  { code: 'PHP', name: 'Filippinske peso', symbol: '₱' },
  { code: 'MYR', name: 'Malaysiske ringgit', symbol: 'RM' },
  { code: 'IDR', name: 'Indonesiske rupiah', symbol: 'Rp' },
];

/**
 * Veiledende valutakurser (USD som referanse) som brukes når ingen nyere kurser er lagret.
 * Kursene er statiske og omtrentlige, og må oppdateres jevnlig. De egner seg ikke til faktiske vekslinger.
 */
export const DEFAULT_RATES: ExchangeRates = {
  base: 'USD',
  date: '2026-01-01',
  rates: {
    USD: 1.0,
    EUR: 0.855,
    GBP: 0.745,
    JPY: 150.0,
    CHF: 0.8,
    CAD: 1.38,
    AUD: 1.52,
    NZD: 1.68,
    CNY: 7.1,
    HKD: 7.8,
    SGD: 1.3,
    SEK: 9.4,
    NOK: 10.1,
    DKK: 6.4,
    MXN: 18.3,
    BRL: 5.4,
    INR: 88.0,
    KRW: 1400.0,
    THB: 32.5,
    PLN: 3.65,
    CZK: 21.0,
    HUF: 335.0,
    TRY: 41.0,
    ZAR: 17.5,
    AED: 3.67,
    SAR: 3.75,
    ILS: 3.4,
    PHP: 58.0,
    MYR: 4.2,
    IDR: 16500.0,
  },
  lastUpdated: Date.now(),
};

const CACHE_KEY = 'kalkulator_valutakurser';
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
 * @param fromCurrency - Source currency code (f.eks. 'USD')
 * @param toCurrency - Target currency code (f.eks. 'EUR')
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
    throw new Error('Beløpet kan ikke være negativt');
  }
  
  const { rates, isOffline } = customRates 
    ? { rates: customRates, isOffline: false }
    : getExchangeRates();
  
  const fromCode = fromCurrency.toUpperCase();
  const toCode = toCurrency.toUpperCase();
  
  if (!(fromCode in rates.rates)) {
    throw new Error(`Valutaen støttes ikke: ${fromCurrency}`);
  }
  
  if (!(toCode in rates.rates)) {
    throw new Error(`Valutaen støttes ikke: ${toCurrency}`);
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
  const formattedAmount = amount.toLocaleString('nb-NO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  if (currencyCode.toUpperCase() === 'NOK') {
    return `${formattedAmount} kr`;
  }
  
  return `${formattedAmount} ${currency ? currency.code : currencyCode}`;
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
