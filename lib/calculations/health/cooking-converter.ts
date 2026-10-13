/**
 * Målkonverterer for matlaging
 *
 * Gjør om mellom norske mål (dl, ss, ts, krm, g, kg) og utenlandske
 * (cups, fl oz, oz, lb), slik at du kan bruke oppskrifter fra andre land.
 *
 * @module lib/calculations/health/cooking-converter
 */

export type CookingUnit =
  | 'ml' | 'dl' | 'liters' | 'krm' | 'teaspoons' | 'tablespoons'
  | 'cups' | 'fluid_oz'
  | 'grams' | 'kg' | 'oz' | 'pounds';

export interface CookingConversionInputs {
  value: number;
  fromUnit: CookingUnit;
  toUnit: CookingUnit;
  /** Trengs når du går mellom volum og vekt */
  ingredient?: string;
}

export interface CookingConversionResults {
  value: number;
  fromUnit: CookingUnit;
  toUnit: CookingUnit;
  formatted: string;
}

/** Volumenheter i ml. Norsk ss = 15 ml, ts = 5 ml, krm = 1 ml. Amerikansk cup = 236,588 ml. */
export const VOLUME_TO_ML: Record<string, number> = {
  ml: 1,
  dl: 100,
  liters: 1000,
  krm: 1,
  teaspoons: 5,
  tablespoons: 15,
  cups: 236.588,
  fluid_oz: 29.5735,
};

/** Vektenheter i gram */
export const WEIGHT_TO_GRAMS: Record<string, number> = {
  grams: 1,
  kg: 1000,
  oz: 28.3495,
  pounds: 453.592,
};

/** Tetthet i gram per dl for vanlige ingredienser */
export const INGREDIENT_G_PER_DL: Record<string, { label: string; gPerDl: number }> = {
  flour: { label: 'Hvetemel', gPerDl: 60 },
  sugar: { label: 'Sukker', gPerDl: 85 },
  powdered_sugar: { label: 'Melis', gPerDl: 60 },
  brown_sugar: { label: 'Brunt sukker', gPerDl: 90 },
  butter: { label: 'Smør', gPerDl: 95 },
  milk: { label: 'Melk', gPerDl: 100 },
  water: { label: 'Vann', gPerDl: 100 },
  oil: { label: 'Matolje', gPerDl: 90 },
  honey: { label: 'Honning', gPerDl: 140 },
  syrup: { label: 'Sirup', gPerDl: 140 },
  rice: { label: 'Ris (ukokt)', gPerDl: 80 },
  oats: { label: 'Havregryn', gPerDl: 40 },
  cocoa: { label: 'Kakaopulver', gPerDl: 45 },
  salt: { label: 'Salt', gPerDl: 120 },
};

function isVolumeUnit(unit: CookingUnit): boolean {
  return unit in VOLUME_TO_ML;
}

function isWeightUnit(unit: CookingUnit): boolean {
  return unit in WEIGHT_TO_GRAMS;
}

export function convertCookingUnit(inputs: CookingConversionInputs): CookingConversionResults {
  const { value, fromUnit, toUnit, ingredient } = inputs;

  let result: number;

  if (isVolumeUnit(fromUnit) && isVolumeUnit(toUnit)) {
    result = (value * VOLUME_TO_ML[fromUnit]) / VOLUME_TO_ML[toUnit];
  } else if (isWeightUnit(fromUnit) && isWeightUnit(toUnit)) {
    result = (value * WEIGHT_TO_GRAMS[fromUnit]) / WEIGHT_TO_GRAMS[toUnit];
  } else if (ingredient && INGREDIENT_G_PER_DL[ingredient]) {
    const gPerMl = INGREDIENT_G_PER_DL[ingredient].gPerDl / 100;
    if (isVolumeUnit(fromUnit)) {
      const grams = value * VOLUME_TO_ML[fromUnit] * gPerMl;
      result = grams / WEIGHT_TO_GRAMS[toUnit];
    } else {
      const ml = (value * WEIGHT_TO_GRAMS[fromUnit]) / gPerMl;
      result = ml / VOLUME_TO_ML[toUnit];
    }
  } else {
    throw new Error('Velg ingrediens når du går mellom volum og vekt');
  }

  let decimals = 1;
  if (result < 0.01) decimals = 3;
  else if (result < 1) decimals = 2;
  else if (result < 100) decimals = 2;
  const formatted = result < 0.001
    ? result.toExponential(2).replace('.', ',')
    : new Intl.NumberFormat('nb-NO', { maximumFractionDigits: decimals }).format(result);

  return { value: result, fromUnit, toUnit, formatted };
}

export function getIngredientOptions(): Array<{ value: string; label: string }> {
  return Object.entries(INGREDIENT_G_PER_DL).map(([value, v]) => ({ value, label: v.label }));
}
