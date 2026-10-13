/**
 * Promillekalkulator
 *
 * Anslår promille i blodet ut fra drikke, vekt og tid med Widmarks formel.
 * Den norske promillegrensen for å føre kjøretøy er 0,2 promille.
 *
 * @module lib/calculations/health/bac-calculator
 */

export type BiologicalSex = 'male' | 'female';

export interface BACInputs {
  /** Kroppsvekt i kg */
  weight: number;
  sex: BiologicalSex;
  /** Antall drinker (eller alkoholenheter à 12 g når typen er «unit») */
  drinks: number;
  /** Timer siden første drink */
  hours: number;
  drinkType: 'beer' | 'wine' | 'spirits' | 'unit';
}

export interface BACResults {
  /** Anslått promille (‰) */
  bac: number;
  status: 'sober' | 'buzzed' | 'impaired' | 'drunk' | 'dangerous';
  /** Timer til promillen er null */
  timeToSober: number;
  /** Timer til promillen er under 0,2 */
  hoursUntilLegal: number;
  /** Under promillegrensen på 0,2 */
  legalToDrive: boolean;
  effects: string;
  /** Gram ren alkohol totalt */
  alcoholGrams: number;
  /** Antall alkoholenheter (12 g) */
  units: number;
}

/** Widmark-faktorer: andel av kroppsvekten alkoholen fordeles i */
export const WIDMARK_FACTOR = {
  male: 0.68,
  female: 0.55,
};

/** Gram ren alkohol per servering */
export const DRINK_ALCOHOL_GRAMS = {
  /** 0,5 liter øl, 4,7 % */
  beer: 18.5,
  /** 15 cl vin, 12,5 % */
  wine: 14.8,
  /** 4 cl sprit, 40 % */
  spirits: 12.6,
  /** Én alkoholenhet i Norge */
  unit: 12,
};

/** Forbrenning i promille per time (norsk veiledning: 0,10–0,15). Vi bruker nedre verdi. */
export const ELIMINATION_PER_HOUR = 0.1;

/** Promillegrensen i vegtrafikkloven */
export const LEGAL_LIMIT = 0.2;

const EFFECTS: Array<{ threshold: number; status: BACResults['status']; effects: string }> = [
  { threshold: 0, status: 'sober', effects: 'Ingen eller svært liten påvirkning.' },
  { threshold: 0.2, status: 'buzzed', effects: 'Over promillegrensen. Lett påvirkning, redusert dømmekraft og reaksjonsevne.' },
  { threshold: 0.5, status: 'impaired', effects: 'Tydelig påvirket, dårligere koordinasjon og synsfelt. Straffbart å kjøre.' },
  { threshold: 1.2, status: 'drunk', effects: 'Kraftig påvirket, sløret tale og dårlig balanse. Over grensen for grov ruspåvirkning.' },
  { threshold: 2.5, status: 'dangerous', effects: 'Svært kraftig påvirket, fare for hukommelsestap og alkoholforgiftning. Søk hjelp ved bevisstløshet.' },
];

export function calculateBAC(inputs: BACInputs): BACResults {
  const { weight, sex, drinks, hours, drinkType } = inputs;

  if (!(weight > 0)) throw new Error('Vekten må være større enn null');
  if (drinks < 0 || hours < 0) throw new Error('Antall drinker og timer kan ikke være negative');

  const alcoholGrams = DRINK_ALCOHOL_GRAMS[drinkType] * drinks;

  // Widmark: C (‰) = A / (m × r) − β × t
  const peak = alcoholGrams / (weight * WIDMARK_FACTOR[sex]);
  const bac = Math.round(Math.max(0, peak - ELIMINATION_PER_HOUR * hours) * 100) / 100;

  let level = EFFECTS[0];
  for (const e of EFFECTS) if (bac >= e.threshold) level = e;

  return {
    bac,
    status: level.status,
    effects: level.effects,
    timeToSober: bac > 0 ? Math.ceil((bac / ELIMINATION_PER_HOUR) * 2) / 2 : 0,
    hoursUntilLegal: bac >= LEGAL_LIMIT ? Math.ceil(((bac - LEGAL_LIMIT) / ELIMINATION_PER_HOUR) * 2) / 2 : 0,
    legalToDrive: bac < LEGAL_LIMIT,
    alcoholGrams: Math.round(alcoholGrams * 10) / 10,
    units: Math.round((alcoholGrams / DRINK_ALCOHOL_GRAMS.unit) * 10) / 10,
  };
}
