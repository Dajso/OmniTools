/**
 * Tallsystem-omregner: binær (2), oktal (8), desimal (10) og heksadesimal (16).
 * Bruker BigInt, så også svært store tall regnes riktig.
 *
 * @module lib/calculations/productivity/number-base-converter
 */

export type NumberBase = 2 | 8 | 10 | 16;

export const NUMBER_BASES: Array<{ base: NumberBase; name: string }> = [
  { base: 2, name: 'Binær (2)' },
  { base: 8, name: 'Oktal (8)' },
  { base: 10, name: 'Desimal (10)' },
  { base: 16, name: 'Heksadesimal (16)' },
];

export interface NumberBaseResults {
  binary: string;
  octal: string;
  decimal: string;
  hexadecimal: string;
}

const DIGITS: Record<NumberBase, RegExp> = {
  2: /^[01]+$/,
  8: /^[0-7]+$/,
  10: /^[0-9]+$/,
  16: /^[0-9a-fA-F]+$/,
};

/** Fjerner mellomrom, understreker og vanlige prefikser (0b, 0o, 0x) */
function clean(input: string, base: NumberBase): string {
  let s = input.trim().replace(/[\s_ ]/g, '');
  const prefix = { 2: /^0b/i, 8: /^0o/i, 10: /^$/, 16: /^0x/i }[base];
  s = s.replace(prefix, '');
  return s;
}

export function convertNumberBase(input: string, fromBase: NumberBase): NumberBaseResults {
  const negative = input.trim().startsWith('-');
  const body = clean(negative ? input.trim().slice(1) : input, fromBase);

  if (!body) {
    throw new Error('Skriv inn et tall');
  }
  if (!DIGITS[fromBase].test(body)) {
    throw new Error(`«${input.trim()}» er ikke et gyldig tall i ${NUMBER_BASES.find((b) => b.base === fromBase)?.name.toLowerCase()}`);
  }

  // BigInt har ingen parseInt med grunntall, så vi bygger verdien siffer for siffer
  let value = BigInt(0);
  const radix = BigInt(fromBase);
  for (const ch of body.toLowerCase()) {
    value = value * radix + BigInt(parseInt(ch, 16));
  }
  if (negative && value !== BigInt(0)) value = -value;

  return {
    binary: value.toString(2),
    octal: value.toString(8),
    decimal: value.toString(10),
    hexadecimal: value.toString(16).toUpperCase(),
  };
}

/** Deler en binær eller heksadesimal streng i grupper for lesbarhet */
export function groupDigits(value: string, size: number): string {
  const negative = value.startsWith('-');
  const digits = negative ? value.slice(1) : value;
  const padded = digits.padStart(Math.ceil(digits.length / size) * size, '0');
  const grouped = padded.match(new RegExp(`.{1,${size}}`, 'g'))?.join(' ') ?? digits;
  return (negative ? '-' : '') + grouped;
}
