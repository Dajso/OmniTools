/**
 * Grinder Database
 * 
 * Defines grinder conversion table with popular models and grind size categories.
 * Used by the Grind Size Converter calculator to convert settings between grinders.
 * 
 * @module lib/calculations/coffee/grinder-database
 * @see Requirement 6: Grind Size Converter
 */

/**
 * Grind size categories from finest to coarsest
 */
export type GrindSize = 
  | 'extra-fine'      // Turkish coffee, very fine espresso
  | 'fine'            // Espresso, Moka pot
  | 'medium-fine'     // Pour over (V60, Kalita), AeroPress
  | 'medium'          // Drip coffee, Chemex
  | 'medium-coarse'   // Clever dripper, Siphon
  | 'coarse'          // French press, Cold brew
  | 'extra-coarse';   // Cowboy coffee, Cold brew (long steep)

/**
 * Grinder setting range for a specific brew method
 */
export interface BrewMethodRange {
  /** Minimum setting for this brew method */
  min: number;
  /** Maximum setting for this brew method */
  max: number;
}

/**
 * Grinder model configuration
 */
export interface GrinderConfig {
  /** Display name of the grinder */
  name: string;
  /** Valid setting range [min, max] */
  range: [number, number];
  /** Recommended settings for espresso */
  espresso: BrewMethodRange;
  /** Recommended settings for pour over */
  pourOver: BrewMethodRange;
  /** Recommended settings for French press */
  frenchPress: BrewMethodRange;
  /** Optional: Recommended settings for cold brew */
  coldBrew?: BrewMethodRange;
  /** Optional: Recommended settings for AeroPress */
  aeroPress?: BrewMethodRange;
}

/**
 * Grind size category definitions with typical setting ranges
 */
export interface GrindSizeCategory {
  /** Category name */
  name: GrindSize;
  /** Description of the grind size */
  description: string;
  /** Typical particle size in microns */
  microns: [number, number];
}

/**
 * Grind size category definitions
 */
export const GRIND_SIZE_CATEGORIES: GrindSizeCategory[] = [
  {
    name: 'extra-fine',
    description: 'Turkish coffee, very fine espresso - powder-like consistency',
    microns: [100, 300],
  },
  {
    name: 'fine',
    description: 'Espresso, Moka pot - fine like table salt',
    microns: [300, 500],
  },
  {
    name: 'medium-fine',
    description: 'Pour over (V60, Kalita), AeroPress - finer than sand',
    microns: [500, 700],
  },
  {
    name: 'medium',
    description: 'Drip coffee, Chemex - like coarse sand',
    microns: [700, 900],
  },
  {
    name: 'medium-coarse',
    description: 'Clever dripper, Siphon - slightly coarser than sand',
    microns: [900, 1100],
  },
  {
    name: 'coarse',
    description: 'French press, Cold brew - like sea salt',
    microns: [1100, 1400],
  },
  {
    name: 'extra-coarse',
    description: 'Cowboy coffee, Cold brew (long steep) - like peppercorns',
    microns: [1400, 2000],
  },
];

/**
 * Grinder database with popular models
 * 
 * Each grinder includes:
 * - Valid setting range
 * - Recommended settings for common brew methods
 * - Settings are based on manufacturer recommendations and community consensus
 */
export const GRINDER_DATABASE: Record<string, GrinderConfig> = {
  'comandante': {
    name: 'Comandante C40',
    range: [0, 40],
    espresso: { min: 8, max: 12 },
    pourOver: { min: 18, max: 24 },
    frenchPress: { min: 28, max: 35 },
    coldBrew: { min: 30, max: 38 },
    aeroPress: { min: 14, max: 20 },
  },
  'timemore-c2': {
    name: 'Timemore C2',
    range: [0, 36],
    espresso: { min: 6, max: 10 },
    pourOver: { min: 14, max: 20 },
    frenchPress: { min: 24, max: 30 },
    coldBrew: { min: 26, max: 34 },
    aeroPress: { min: 12, max: 18 },
  },
  'timemore-c3': {
    name: 'Timemore C3',
    range: [0, 36],
    espresso: { min: 6, max: 10 },
    pourOver: { min: 14, max: 20 },
    frenchPress: { min: 24, max: 30 },
    coldBrew: { min: 26, max: 34 },
    aeroPress: { min: 12, max: 18 },
  },
  'baratza-encore': {
    name: 'Baratza Encore',
    range: [1, 40],
    espresso: { min: 5, max: 10 },
    pourOver: { min: 15, max: 20 },
    frenchPress: { min: 28, max: 35 },
    coldBrew: { min: 30, max: 38 },
    aeroPress: { min: 12, max: 18 },
  },
  'baratza-virtuoso': {
    name: 'Baratza Virtuoso+',
    range: [1, 40],
    espresso: { min: 5, max: 9 },
    pourOver: { min: 14, max: 19 },
    frenchPress: { min: 27, max: 34 },
    coldBrew: { min: 29, max: 37 },
    aeroPress: { min: 11, max: 17 },
  },
  'baratza-vario': {
    name: 'Baratza Vario',
    range: [1, 10],
    espresso: { min: 1, max: 3 },
    pourOver: { min: 4, max: 6 },
    frenchPress: { min: 7, max: 9 },
    coldBrew: { min: 8, max: 10 },
    aeroPress: { min: 3, max: 5 },
  },
  'baratza-sette-270': {
    name: 'Baratza Sette 270',
    range: [1, 40],
    espresso: { min: 5, max: 12 },
    pourOver: { min: 18, max: 25 },
    frenchPress: { min: 30, max: 38 },
    coldBrew: { min: 32, max: 40 },
    aeroPress: { min: 15, max: 22 },
  },
  'hario-mini-mill': {
    name: 'Hario Mini Mill',
    range: [1, 12],
    espresso: { min: 2, max: 4 },
    pourOver: { min: 6, max: 8 },
    frenchPress: { min: 10, max: 12 },
    coldBrew: { min: 11, max: 12 },
    aeroPress: { min: 5, max: 7 },
  },
  'hario-skerton': {
    name: 'Hario Skerton Pro',
    range: [1, 12],
    espresso: { min: 2, max: 4 },
    pourOver: { min: 6, max: 8 },
    frenchPress: { min: 10, max: 12 },
    coldBrew: { min: 11, max: 12 },
    aeroPress: { min: 5, max: 7 },
  },
  'porlex-mini': {
    name: 'Porlex Mini',
    range: [1, 12],
    espresso: { min: 2, max: 4 },
    pourOver: { min: 6, max: 8 },
    frenchPress: { min: 10, max: 12 },
    coldBrew: { min: 11, max: 12 },
    aeroPress: { min: 5, max: 7 },
  },
  'porlex-tall': {
    name: 'Porlex Tall',
    range: [1, 12],
    espresso: { min: 2, max: 4 },
    pourOver: { min: 6, max: 8 },
    frenchPress: { min: 10, max: 12 },
    coldBrew: { min: 11, max: 12 },
    aeroPress: { min: 5, max: 7 },
  },
  'wilfa-svart': {
    name: 'Wilfa Svart',
    range: [1, 17],
    espresso: { min: 2, max: 5 },
    pourOver: { min: 8, max: 11 },
    frenchPress: { min: 14, max: 17 },
    coldBrew: { min: 15, max: 17 },
    aeroPress: { min: 6, max: 9 },
  },
  'fellow-ode': {
    name: 'Fellow Ode',
    range: [1, 11],
    espresso: { min: 1, max: 2 },
    pourOver: { min: 4, max: 6 },
    frenchPress: { min: 8, max: 10 },
    coldBrew: { min: 9, max: 11 },
    aeroPress: { min: 3, max: 5 },
  },
  'niche-zero': {
    name: 'Niche Zero',
    range: [0, 100],
    espresso: { min: 10, max: 20 },
    pourOver: { min: 40, max: 55 },
    frenchPress: { min: 70, max: 85 },
    coldBrew: { min: 75, max: 95 },
    aeroPress: { min: 30, max: 45 },
  },
  'eureka-mignon': {
    name: 'Eureka Mignon',
    range: [1, 10],
    espresso: { min: 1, max: 3 },
    pourOver: { min: 4, max: 6 },
    frenchPress: { min: 7, max: 9 },
    coldBrew: { min: 8, max: 10 },
    aeroPress: { min: 3, max: 5 },
  },
  'rancilio-rocky': {
    name: 'Rancilio Rocky',
    range: [1, 55],
    espresso: { min: 5, max: 15 },
    pourOver: { min: 25, max: 35 },
    frenchPress: { min: 42, max: 52 },
    coldBrew: { min: 45, max: 55 },
    aeroPress: { min: 18, max: 28 },
  },
  '1zpresso-jx-pro': {
    name: '1Zpresso JX-Pro',
    range: [0, 90],
    espresso: { min: 10, max: 18 },
    pourOver: { min: 30, max: 40 },
    frenchPress: { min: 60, max: 75 },
    coldBrew: { min: 65, max: 85 },
    aeroPress: { min: 22, max: 35 },
  },
  '1zpresso-k-plus': {
    name: '1Zpresso K-Plus',
    range: [0, 90],
    espresso: { min: 8, max: 16 },
    pourOver: { min: 28, max: 38 },
    frenchPress: { min: 58, max: 73 },
    coldBrew: { min: 63, max: 83 },
    aeroPress: { min: 20, max: 33 },
  },
  'kinu-m47': {
    name: 'Kinu M47',
    range: [0, 100],
    espresso: { min: 10, max: 20 },
    pourOver: { min: 35, max: 50 },
    frenchPress: { min: 65, max: 85 },
    coldBrew: { min: 70, max: 95 },
    aeroPress: { min: 25, max: 40 },
  },
};

/**
 * Get list of all available grinder IDs
 */
function getGrinderIds(): string[] {
  return Object.keys(GRINDER_DATABASE);
}

/**
 * Get grinder configuration by ID
 * 
 * @param grinderId - Grinder ID (e.g., 'comandante')
 * @returns Grinder configuration or undefined if not found
 */
function getGrinderConfig(grinderId: string): GrinderConfig | undefined {
  return GRINDER_DATABASE[grinderId];
}

/**
 * Get list of all grinders with their IDs and names
 */
function getGrinderList(): Array<{ id: string; name: string }> {
  return Object.entries(GRINDER_DATABASE).map(([id, config]) => ({
    id,
    name: config.name,
  }));
}

/**
 * Check if a setting is valid for a grinder
 * 
 * @param grinderId - Grinder ID
 * @param setting - Setting value
 * @returns True if setting is within valid range
 */
function isValidSetting(grinderId: string, setting: number): boolean {
  const config = getGrinderConfig(grinderId);
  if (!config) return false;
  
  const [min, max] = config.range;
  return setting >= min && setting <= max;
}

/**
 * Get grind size category for a setting on a specific grinder
 * 
 * @param grinderId - Grinder ID
 * @param setting - Setting value
 * @returns Grind size category
 */
function getGrindSizeForSetting(
  grinderId: string,
  setting: number
): GrindSize {
  const config = getGrinderConfig(grinderId);
  if (!config) {
    throw new Error(`Grinder not found: ${grinderId}`);
  }

  const [min, max] = config.range;
  const normalizedSetting = (setting - min) / (max - min);

  // Map normalized setting (0-1) to grind size categories
  if (normalizedSetting < 0.14) return 'extra-fine';
  if (normalizedSetting < 0.28) return 'fine';
  if (normalizedSetting < 0.42) return 'medium-fine';
  if (normalizedSetting < 0.56) return 'medium';
  if (normalizedSetting < 0.70) return 'medium-coarse';
  if (normalizedSetting < 0.85) return 'coarse';
  return 'extra-coarse';
}

/**
 * Get description for a grind size category
 * 
 * @param grindSize - Grind size category
 * @returns Description of the grind size
 */
function getGrindSizeDescription(grindSize: GrindSize): string {
  const category = GRIND_SIZE_CATEGORIES.find(c => c.name === grindSize);
  return category?.description || 'Unknown grind size';
}

// Export all functions
export {
  getGrinderIds,
  getGrinderConfig,
  getGrinderList,
  isValidSetting,
  getGrindSizeForSetting,
  getGrindSizeDescription,
};
