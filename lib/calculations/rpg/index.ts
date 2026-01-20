/**
 * RPG & Tabletop Gaming Calculations
 * 
 * This module exports all RPG and tabletop gaming-related calculation functions.
 * 
 * @module lib/calculations/rpg
 */

export * from './dice-roller';
export * from './name-generator';
export * from './stat-roller';
export * from './encounter-calculator';
export * from './loot-generator';
export * from './tavern-generator';
export * from './quest-generator';
// character-sheet-helper has conflicts with stat-roller (AbilityScore, CharacterStats, formatModifier, STANDARD_ARRAY, POINT_BUY_COSTS, calculatePointBuyCost)
// Export only unique members with renames where necessary
export {
    SKILL_ABILITIES,
    ALL_SKILLS,
    ABILITY_ABBREVIATIONS,
    type AbilityScores,
    type ProficiencyLevel,
    type SkillProficiencies,
    type CharacterStats as CharacterSheetStats,
    type CharacterInput,
    calculateAbilityModifier,
    calculateProficiencyBonus,
    calculateSkillModifier,
    calculateSavingThrow,
    calculatePassiveScore,
    calculateHitPointMaximum,
    calculateArmorClass,
    calculateCharacterStats,
    formatModifier as formatCharacterModifier,
    getSkillDisplayName,
    getAbilityDisplayName,
    STANDARD_ARRAY as CHARACTER_STANDARD_ARRAY,
    CLASS_HIT_DICE,
    CLASS_SAVING_THROWS,
    calculatePointBuyCost as calculateCharacterPointBuyCost,
    POINT_BUY_COSTS as CHARACTER_POINT_BUY_COSTS,
} from './character-sheet-helper';
export * from './map-grid-generator';
