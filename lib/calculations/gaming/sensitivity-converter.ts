/**
 * Mouse Sensitivity Converter
 * 
 * Converts mouse sensitivity between different games while preserving
 * the cm/360 (centimeters per 360-degree turn) value.
 * 
 * @module lib/calculations/gaming/sensitivity-converter
 * @see Requirements 17.1, 17.11
 */

/**
 * Game-specific multipliers for sensitivity calculation
 * These values represent the relationship between in-game sensitivity
 * and actual mouse movement (yaw per count)
 */
export const GAME_MULTIPLIERS: Record<string, number> = {
  'valorant': 0.07,
  'cs2': 0.022,
  'csgo': 0.022,
  'apex': 1.0,
  'overwatch2': 0.0066,
  'fortnite': 0.5555,
  'pubg': 0.002222,
  'rainbow6': 0.00572,
  'cod-warzone': 0.0066,
  'battlefield': 0.0022,
  'quake': 0.022,
  'source': 0.022,
};

/**
 * Supported games with display names
 */
export const SUPPORTED_GAMES = [
  { id: 'valorant', name: 'Valorant' },
  { id: 'cs2', name: 'Counter-Strike 2' },
  { id: 'csgo', name: 'CS:GO' },
  { id: 'apex', name: 'Apex Legends' },
  { id: 'overwatch2', name: 'Overwatch 2' },
  { id: 'fortnite', name: 'Fortnite' },
  { id: 'pubg', name: 'PUBG' },
  { id: 'rainbow6', name: 'Rainbow Six Siege' },
  { id: 'cod-warzone', name: 'Call of Duty: Warzone' },
  { id: 'battlefield', name: 'Battlefield' },
  { id: 'quake', name: 'Quake' },
  { id: 'source', name: 'Source Engine' },
] as const;

export type GameId = typeof SUPPORTED_GAMES[number]['id'];

export interface GameSensitivity {
  game: string;
  sensitivity: number;
  dpi: number;
}

export interface SensitivityConversion {
  sourceGame: string;
  targetGame: string;
  sourceSensitivity: number;
  convertedSensitivity: number;
  dpi: number;
  cm360: number;
}

/**
 * Calculate cm/360 (centimeters per 360-degree turn)
 * 
 * Formula: cm/360 = (2.54 * 360) / (dpi * sensitivity * gameMultiplier)
 * 
 * @param dpi - Mouse DPI setting
 * @param sensitivity - In-game sensitivity value
 * @param gameMultiplier - Game-specific multiplier
 * @returns cm/360 value
 */
export function calculateCm360(
  dpi: number,
  sensitivity: number,
  gameMultiplier: number
): number {
  if (dpi <= 0) throw new Error('DPI must be positive');
  if (sensitivity <= 0) throw new Error('Sensitivity must be positive');
  if (gameMultiplier <= 0) throw new Error('Game multiplier must be positive');

  // 2.54 converts inches to cm, 360 is degrees for full rotation
  return (2.54 * 360) / (dpi * sensitivity * gameMultiplier);
}

/**
 * Calculate sensitivity from cm/360
 * 
 * Formula: sensitivity = (2.54 * 360) / (dpi * cm360 * gameMultiplier)
 * 
 * @param dpi - Mouse DPI setting
 * @param cm360 - Target cm/360 value
 * @param gameMultiplier - Game-specific multiplier
 * @returns Sensitivity value
 */
export function sensitivityFromCm360(
  dpi: number,
  cm360: number,
  gameMultiplier: number
): number {
  if (dpi <= 0) throw new Error('DPI must be positive');
  if (cm360 <= 0) throw new Error('cm/360 must be positive');
  if (gameMultiplier <= 0) throw new Error('Game multiplier must be positive');

  return (2.54 * 360) / (dpi * cm360 * gameMultiplier);
}

/**
 * Get the multiplier for a game
 * 
 * @param game - Game identifier
 * @returns Game multiplier
 */
export function getGameMultiplier(game: string): number {
  const multiplier = GAME_MULTIPLIERS[game.toLowerCase()];
  if (multiplier === undefined) {
    throw new Error(`Unsupported game: ${game}`);
  }
  return multiplier;
}

/**
 * Convert mouse sensitivity between games
 * 
 * This function preserves the cm/360 value when converting between games,
 * ensuring the physical mouse movement required for a 360-degree turn
 * remains the same.
 * 
 * @param source - Source game sensitivity configuration
 * @param targetGame - Target game to convert to
 * @returns Conversion result with converted sensitivity and cm/360
 */
export function convertSensitivity(
  source: GameSensitivity,
  targetGame: string
): SensitivityConversion {
  const sourceMultiplier = getGameMultiplier(source.game);
  const targetMultiplier = getGameMultiplier(targetGame);

  // Calculate cm/360 from source
  const cm360 = calculateCm360(source.dpi, source.sensitivity, sourceMultiplier);

  // Calculate target sensitivity to preserve cm/360
  const convertedSensitivity = sensitivityFromCm360(source.dpi, cm360, targetMultiplier);

  return {
    sourceGame: source.game,
    targetGame,
    sourceSensitivity: source.sensitivity,
    convertedSensitivity,
    dpi: source.dpi,
    cm360,
  };
}

/**
 * Calculate eDPI (effective DPI)
 * 
 * eDPI = DPI × in-game sensitivity
 * This is a common metric for comparing sensitivity across different DPI settings.
 * 
 * @param dpi - Mouse DPI setting
 * @param sensitivity - In-game sensitivity value
 * @returns eDPI value
 */
export function calculateEDPI(dpi: number, sensitivity: number): number {
  if (dpi <= 0) throw new Error('DPI must be positive');
  if (sensitivity < 0) throw new Error('Sensitivity cannot be negative');

  return dpi * sensitivity;
}

/**
 * Convert eDPI to sensitivity for a given DPI
 * 
 * @param edpi - Target eDPI value
 * @param dpi - Mouse DPI setting
 * @returns Sensitivity value
 */
export function edpiToSensitivity(edpi: number, dpi: number): number {
  if (dpi <= 0) throw new Error('DPI must be positive');
  if (edpi < 0) throw new Error('eDPI cannot be negative');

  return edpi / dpi;
}

/**
 * Get inches per 360-degree turn
 * 
 * @param dpi - Mouse DPI setting
 * @param sensitivity - In-game sensitivity value
 * @param gameMultiplier - Game-specific multiplier
 * @returns inches/360 value
 */
export function calculateInches360(
  dpi: number,
  sensitivity: number,
  gameMultiplier: number
): number {
  const cm360 = calculateCm360(dpi, sensitivity, gameMultiplier);
  return cm360 / 2.54;
}
