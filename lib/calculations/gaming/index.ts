/**
 * Gaming Calculations
 * 
 * @module lib/calculations/gaming
 */

export {
    GAME_MULTIPLIERS,
    SUPPORTED_GAMES,
    type GameId,
    type GameSensitivity,
    type SensitivityConversion,
    calculateCm360,
    sensitivityFromCm360,
    getGameMultiplier,
    convertSensitivity,
    // calculateEDPI is excluded to avoid conflict with edpi-calculator
    edpiToSensitivity,
    calculateInches360
} from './sensitivity-converter';

export * from './edpi-calculator';
export * from './reaction-time';
export * from './pokemon-types';
export * from './minecraft-circle';
