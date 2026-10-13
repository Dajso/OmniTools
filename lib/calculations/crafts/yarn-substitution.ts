/**
 * Yarn Substitution Helper
 * 
 * Helps find equivalent yarns based on weight category and provides
 * yardage conversion calculations.
 * 
 * @module lib/calculations/crafts/yarn-substitution
 * @see Requirements 24.5
 */

/**
 * Standard yarn weight categories (CYC - Craft Yarn Council)
 */
export type YarnWeight = 
  | 'lace'
  | 'super-fine'
  | 'fine'
  | 'light'
  | 'medium'
  | 'bulky'
  | 'super-bulky'
  | 'jumbo';

/**
 * Yarn weight information
 */
export interface YarnWeightInfo {
  /** CYC number (0-7) */
  cycNumber: number;
  /** Weight name */
  name: string;
  /** Alternative names */
  aliases: string[];
  /** Typical gauge (stitches per 4 inches) */
  gaugeRange: { min: number; max: number };
  /** Typical needle size (US) */
  needleRange: { min: number; max: number };
  /** Wraps per inch */
  wpiRange: { min: number; max: number };
  /** Typical yards per 100g */
  yardsPerHundredGrams: { min: number; max: number };
}

/**
 * Standard yarn weight data
 */
export const YARN_WEIGHTS: Record<YarnWeight, YarnWeightInfo> = {
  'lace': {
    cycNumber: 0,
    name: 'Lace',
    aliases: ['Cobweb', 'Thread', '10 Count Crochet Thread'],
    gaugeRange: { min: 33, max: 40 },
    needleRange: { min: 0, max: 1 },
    wpiRange: { min: 30, max: 40 },
    yardsPerHundredGrams: { min: 400, max: 800 },
  },
  'super-fine': {
    cycNumber: 1,
    name: 'Super Fine',
    aliases: ['Fingering', 'Sock', 'Baby'],
    gaugeRange: { min: 27, max: 32 },
    needleRange: { min: 1, max: 3 },
    wpiRange: { min: 14, max: 18 },
    yardsPerHundredGrams: { min: 350, max: 450 },
  },
  'fine': {
    cycNumber: 2,
    name: 'Fine',
    aliases: ['Sport', 'Baby'],
    gaugeRange: { min: 23, max: 26 },
    needleRange: { min: 3, max: 5 },
    wpiRange: { min: 12, max: 14 },
    yardsPerHundredGrams: { min: 250, max: 350 },
  },
  'light': {
    cycNumber: 3,
    name: 'Light',
    aliases: ['DK', 'Light Worsted'],
    gaugeRange: { min: 21, max: 24 },
    needleRange: { min: 5, max: 7 },
    wpiRange: { min: 11, max: 12 },
    yardsPerHundredGrams: { min: 200, max: 280 },
  },
  'medium': {
    cycNumber: 4,
    name: 'Medium',
    aliases: ['Worsted', 'Afghan', 'Aran'],
    gaugeRange: { min: 16, max: 20 },
    needleRange: { min: 7, max: 9 },
    wpiRange: { min: 9, max: 11 },
    yardsPerHundredGrams: { min: 150, max: 220 },
  },
  'bulky': {
    cycNumber: 5,
    name: 'Bulky',
    aliases: ['Chunky', 'Craft', 'Rug'],
    gaugeRange: { min: 12, max: 15 },
    needleRange: { min: 9, max: 11 },
    wpiRange: { min: 7, max: 9 },
    yardsPerHundredGrams: { min: 100, max: 150 },
  },
  'super-bulky': {
    cycNumber: 6,
    name: 'Super Bulky',
    aliases: ['Roving', 'Super Chunky'],
    gaugeRange: { min: 7, max: 11 },
    needleRange: { min: 11, max: 17 },
    wpiRange: { min: 5, max: 7 },
    yardsPerHundredGrams: { min: 50, max: 100 },
  },
  'jumbo': {
    cycNumber: 7,
    name: 'Jumbo',
    aliases: ['Roving', 'Arm Knitting'],
    gaugeRange: { min: 1, max: 6 },
    needleRange: { min: 17, max: 50 },
    wpiRange: { min: 1, max: 5 },
    yardsPerHundredGrams: { min: 20, max: 50 },
  },
};

/**
 * Input for yarn substitution calculation
 */
export interface YarnSubstitutionInput {
  /** Original yarn weight */
  originalWeight: YarnWeight;
  /** Original yardage per skein */
  originalYardage: number;
  /** Original weight per skein in grams */
  originalGrams: number;
  /** Number of skeins needed */
  skeinsNeeded: number;
  /** Substitute yarn weight */
  substituteWeight: YarnWeight;
  /** Substitute yardage per skein */
  substituteYardage: number;
  /** Substitute weight per skein in grams */
  substituteGrams: number;
}

/**
 * Result of yarn substitution calculation
 */
export interface YarnSubstitutionResult {
  /** Total yards needed */
  totalYardsNeeded: number;
  /** Number of substitute skeins needed */
  substituteSkeinsNeeded: number;
  /** Yards per gram of original */
  originalYardsPerGram: number;
  /** Yards per gram of substitute */
  substituteYardsPerGram: number;
  /** Whether weights are compatible */
  isCompatible: boolean;
  /** Compatibility warning if any */
  compatibilityWarning?: string;
  /** Gauge adjustment recommendation */
  gaugeAdjustment?: string;
}

/**
 * Calculates yarn substitution requirements
 * 
 * @param input - Yarn substitution input
 * @returns Yarn substitution result
 */
export function calculateYarnSubstitution(input: YarnSubstitutionInput): YarnSubstitutionResult {
  const {
    originalWeight,
    originalYardage,
    originalGrams,
    skeinsNeeded,
    substituteWeight,
    substituteYardage,
    substituteGrams,
  } = input;

  // Calculate total yards needed
  const totalYardsNeeded = originalYardage * skeinsNeeded;

  // Calculate yards per gram
  const originalYardsPerGram = originalYardage / originalGrams;
  const substituteYardsPerGram = substituteYardage / substituteGrams;

  // Calculate substitute skeins needed (round up)
  const substituteSkeinsNeeded = Math.ceil(totalYardsNeeded / substituteYardage);

  // Check compatibility
  const originalInfo = YARN_WEIGHTS[originalWeight];
  const substituteInfo = YARN_WEIGHTS[substituteWeight];
  
  const weightDifference = Math.abs(originalInfo.cycNumber - substituteInfo.cycNumber);
  const isCompatible = weightDifference <= 1;

  let compatibilityWarning: string | undefined;
  let gaugeAdjustment: string | undefined;

  if (weightDifference === 0) {
    // Same weight category
    gaugeAdjustment = 'Strikk en prøvelapp for å treffe oppskriftens fasthet. Det kan hende du må justere pinnestørrelsen litt.';
  } else if (weightDifference === 1) {
    // Adjacent weight category
    compatibilityWarning = 'Garntykkelsene er nesten like, men ikke helt. Strikk alltid en prøvelapp.';
    if (substituteInfo.cycNumber > originalInfo.cycNumber) {
      gaugeAdjustment = 'Prøv en til to pinnestørrelser tynnere for å treffe fastheten.';
    } else {
      gaugeAdjustment = 'Prøv en til to pinnestørrelser tykkere for å treffe fastheten.';
    }
  } else {
    // Very different weights
    compatibilityWarning = `Stor forskjell i garntykkelse (${weightDifference} trinn). Resultatet kan bli ganske annerledes.`;
    gaugeAdjustment = 'Du må justere pinnestørrelsen mye. Vurder et garn som ligger nærmere i tykkelse.';
  }

  return {
    totalYardsNeeded,
    substituteSkeinsNeeded,
    originalYardsPerGram: Math.round(originalYardsPerGram * 100) / 100,
    substituteYardsPerGram: Math.round(substituteYardsPerGram * 100) / 100,
    isCompatible,
    compatibilityWarning,
    gaugeAdjustment,
  };
}

/**
 * Gets yarn weight by CYC number
 * 
 * @param cycNumber - CYC weight number (0-7)
 * @returns Yarn weight key or undefined
 */
export function getYarnWeightByCYC(cycNumber: number): YarnWeight | undefined {
  const entries = Object.entries(YARN_WEIGHTS) as [YarnWeight, YarnWeightInfo][];
  const found = entries.find(([, info]) => info.cycNumber === cycNumber);
  return found?.[0];
}

/**
 * Estimates yards needed based on project type
 */
export const PROJECT_YARDAGE_ESTIMATES: Record<string, { min: number; max: number; description: string }> = {
  'scarf': { min: 200, max: 400, description: 'Enkelt skjerf' },
  'hat': { min: 100, max: 200, description: 'Lue til voksen' },
  'mittens': { min: 150, max: 250, description: 'Votter, ett par' },
  'socks': { min: 300, max: 450, description: 'Sokker, ett par' },
  'sweater-child': { min: 600, max: 1000, description: 'Barnegenser' },
  'sweater-adult': { min: 1200, max: 2000, description: 'Genser til voksen' },
  'blanket-baby': { min: 800, max: 1200, description: 'Babyteppe' },
  'blanket-throw': { min: 1500, max: 2500, description: 'Pledd' },
  'shawl': { min: 400, max: 800, description: 'Sjal' },
};
