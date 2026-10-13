/**
 * Tall-, valuta- og datoformatering for Hjemmetavla Kalkulator.
 *
 * Standard er norsk: kroner (NOK), mellomrom som tusenskille, komma som
 * desimaltegn og datoformatet dd.mm.åååå (nb-NO).
 * Funksjonene beholder de opprinnelige navnene, så alle kalkulatorene som
 * allerede bruker formatCurrency, formatNumber osv. blir norske automatisk.
 */

/** Støttede språkkoder */
export type Locale = 'nb-NO' | 'en-US' | 'en-GB';

/** Støttede valutakoder */
export type CurrencyCode = 'NOK' | 'SEK' | 'DKK' | 'EUR' | 'USD' | 'GBP';

/** Datoformater */
export type DateFormat = 'DD.MM.YYYY' | 'DD/MM/YYYY' | 'MM/DD/YYYY';

export const DEFAULT_LOCALE: Locale = 'nb-NO';
export const DEFAULT_CURRENCY: CurrencyCode = 'NOK';

/** Hardt mellomrom, brukes mellom tall og enhet (1 234 kr, 15 %) */
export const NBSP = ' ';

/**
 * Intl bruker det typografiske minustegnet (U+2212) for nb-NO. Det kan ikke
 * limes inn i regneark eller leses av parseFloat, så vi bytter til vanlig bindestrek.
 */
function normalizeMinus(text: string): string {
  return text.replace(/−/g, '-');
}

/**
 * Options for number formatting
 */
export interface FormatNumberOptions {
  /** Språk for formatering (standard: 'nb-NO') */
  locale?: Locale;
  /** Minste antall desimaler */
  minimumFractionDigits?: number;
  /** Største antall desimaler */
  maximumFractionDigits?: number;
  /** Bruk tusenskille */
  useGrouping?: boolean;
}

/**
 * Options for currency formatting
 */
export interface FormatCurrencyOptions {
  /** Språk for formatering (standard: 'nb-NO') */
  locale?: Locale;
  /** Valutakode (standard: 'NOK') */
  currency?: CurrencyCode;
  /** Vis valutategn eller -kode */
  showSymbol?: boolean;
  /** Antall desimaler (standard: 2). Bruk 0 for hele kroner. */
  decimals?: number;
}

/**
 * Options for percentage formatting
 */
export interface FormatPercentOptions {
  /** Språk for formatering (standard: 'nb-NO') */
  locale?: Locale;
  /** Antall desimaler (standard: 2) */
  decimals?: number;
  /** Ta med %-tegnet (standard: true) */
  showSymbol?: boolean;
}

/**
 * Formaterer et tall med tusenskille og desimaler.
 *
 * @example
 * formatNumber(1234567.89) // "1 234 567,89"  (hardt mellomrom som tusenskille)
 * formatNumber(1234567.89, { locale: 'en-US' }) // "1,234,567.89"
 * formatNumber(1234.5, { maximumFractionDigits: 0 }) // "1 235"
 */
export function formatNumber(
  value: number,
  options: FormatNumberOptions = {}
): string {
  const {
    locale = DEFAULT_LOCALE,
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping = true,
  } = options;

  // Spesialtilfeller
  if (!Number.isFinite(value)) {
    return String(value);
  }

  return normalizeMinus(
    new Intl.NumberFormat(locale, {
      minimumFractionDigits,
      maximumFractionDigits,
      useGrouping,
    }).format(value)
  );
}

/**
 * Formaterer et tall som valuta. Norske kroner skrives "1 234,50 kr".
 *
 * @example
 * formatCurrency(1234.5) // "1 234,50 kr"
 * formatCurrency(1234.5, { decimals: 0 }) // "1 235 kr"
 * formatCurrency(1234.5, { currency: 'EUR' }) // "1 234,50 €"
 * formatCurrency(1234.5, { showSymbol: false }) // "1 234,50"
 */
export function formatCurrency(
  value: number,
  options: FormatCurrencyOptions = {}
): string {
  const {
    locale = DEFAULT_LOCALE,
    currency = DEFAULT_CURRENCY,
    showSymbol = true,
    decimals = 2,
  } = options;

  // Spesialtilfeller
  if (!Number.isFinite(value)) {
    return String(value);
  }

  const amount = formatNumber(value, {
    locale,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (!showSymbol) {
    return amount;
  }

  // Norsk skrivemåte: beløpet først, så "kr"
  if (locale === 'nb-NO' && currency === 'NOK') {
    return `${amount}${NBSP}kr`;
  }

  return normalizeMinus(
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  );
}

/**
 * Formaterer et tall som prosent.
 *
 * @example
 * formatPercent(0.156) // "15,60 %"
 * formatPercent(0.156, { decimals: 1 }) // "15,6 %"
 * formatPercent(15.6, { isDecimal: false }) // "15,60 %"
 */
export function formatPercent(
  value: number,
  options: FormatPercentOptions & { isDecimal?: boolean } = {}
): string {
  const {
    locale = DEFAULT_LOCALE,
    decimals = 2,
    showSymbol = true,
    isDecimal = true,
  } = options;

  // Spesialtilfeller
  if (!Number.isFinite(value)) {
    return String(value);
  }

  // Gjør om til desimaltall om nødvendig (15,6 -> 0,156)
  const decimalValue = isDecimal ? value : value / 100;

  if (!showSymbol) {
    const percentValue = decimalValue * 100;
    return formatNumber(percentValue, {
      locale,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  return normalizeMinus(
    new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(decimalValue)
  );
}

/**
 * Formaterer en dato. Standard er norsk dd.mm.åååå.
 *
 * @example
 * formatDate(new Date('2024-03-15')) // "15.03.2024"
 * formatDate(new Date('2024-03-15'), 'MM/DD/YYYY') // "03/15/2024"
 */
export function formatDate(
  date: Date,
  format: DateFormat = 'DD.MM.YYYY',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _locale: Locale = DEFAULT_LOCALE
): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Ugyldig dato';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());

  switch (format) {
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'DD.MM.YYYY':
    default:
      return `${day}.${month}.${year}`;
  }
}

/**
 * Runder av til et gitt antall desimaler.
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
 * Leser et formatert tall tilbake til et tall.
 *
 * Norsk: mellomrom (også hardt) er tusenskille og komma er desimaltegn.
 * Engelsk: komma er tusenskille og punktum er desimaltegn.
 *
 * @example
 * parseFormattedNumber("1 234,56") // 1234.56
 * parseFormattedNumber("1 234,56 kr") // 1234.56
 * parseFormattedNumber("1,234.56", 'en-US') // 1234.56
 */
export function parseFormattedNumber(
  value: string,
  locale: Locale = DEFAULT_LOCALE
): number {
  if (!value || typeof value !== 'string') {
    return NaN;
  }

  // Fjern valutategn/-koder, prosent og alle typer mellomrom
  let cleaned = normalizeMinus(value)
    .replace(/kr\.?|NOK|SEK|DKK|EUR|USD|GBP|[£$€%]/gi, '')
    .replace(/[\s  ]/g, '');

  if (locale === 'nb-NO') {
    if (cleaned.includes(',')) {
      // "1.234,56": punktum er tusenskille, komma er desimaltegn
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    }
  } else {
    // Engelsk: komma er tusenskille
    cleaned = cleaned.replace(/,/g, '');
  }

  return parseFloat(cleaned);
}

/**
 * Som Number.toFixed, men med norsk skrivemåte (komma som desimaltegn og
 * hardt mellomrom som tusenskille). Brukes til visning, ikke til utregning.
 *
 * @example
 * formatFixed(1234.5, 2) // "1 234,50"
 */
export function formatFixed(value: number, digits: number = 0): string {
  if (!Number.isFinite(value)) {
    return '–';
  }
  return value.toLocaleString('nb-NO', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/**
 * Kompakt visning av store tall på norsk: «1,2 mill.», «12,3 tusen», «1,5 mrd.».
 * Tall under 1 000 vises som vanlig tall.
 *
 * @example
 * formatCompact(1234567) // "1,2 mill."
 * formatCompact(12345)   // "12,3 tusen"
 * formatCompact(999)     // "999"
 */
export function formatCompact(value: number, digits: number = 1): string {
  const abs = Math.abs(value);
  const fmt = (v: number) => formatFixed(v, digits);
  if (abs >= 1_000_000_000) return `${fmt(value / 1_000_000_000)}${NBSP}mrd.`;
  if (abs >= 1_000_000) return `${fmt(value / 1_000_000)}${NBSP}mill.`;
  if (abs >= 1_000) return `${fmt(value / 1_000)}${NBSP}tusen`;
  return formatNumber(value, { maximumFractionDigits: 2 });
}
