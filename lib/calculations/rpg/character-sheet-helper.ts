/**
 * Character Sheet Helper
 * 
 * Provides calculations for D&D 5e character sheets including
 * ability modifiers, proficiency bonuses, skill modifiers, and more.
 * 
 * @module lib/calculations/rpg/character-sheet-helper
 * @see Requirements 21.7
 */

import { SKILL_NAMES_NO, ABILITY_NAMES_NO } from './labels';

/**
 * D&D 5e ability scores
 */
export type AbilityScore = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

/**
 * D&D 5e skills mapped to their governing ability
 */
export const SKILL_ABILITIES: Record<string, AbilityScore> = {
  // Strength
  athletics: 'strength',
  // Dexterity
  acrobatics: 'dexterity',
  'sleight-of-hand': 'dexterity',
  stealth: 'dexterity',
  // Intelligence
  arcana: 'intelligence',
  history: 'intelligence',
  investigation: 'intelligence',
  nature: 'intelligence',
  religion: 'intelligence',
  // Wisdom
  'animal-handling': 'wisdom',
  insight: 'wisdom',
  medicine: 'wisdom',
  perception: 'wisdom',
  survival: 'wisdom',
  // Charisma
  deception: 'charisma',
  intimidation: 'charisma',
  performance: 'charisma',
  persuasion: 'charisma',
};

/**
 * All D&D 5e skills
 */
export const ALL_SKILLS = Object.keys(SKILL_ABILITIES);

/**
 * Ability score abbreviations
 */
export const ABILITY_ABBREVIATIONS: Record<AbilityScore, string> = {
  strength: 'STR',
  dexterity: 'DEX',
  constitution: 'CON',
  intelligence: 'INT',
  wisdom: 'WIS',
  charisma: 'CHA',
};

/**
 * Character ability scores
 */
export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

/**
 * Skill proficiency level
 */
export type ProficiencyLevel = 'none' | 'proficient' | 'expertise';

/**
 * Character skill proficiencies
 */
export type SkillProficiencies = Record<string, ProficiencyLevel>;

/**
 * Calculated character stats
 */
export interface CharacterStats {
  abilityModifiers: Record<AbilityScore, number>;
  proficiencyBonus: number;
  skillModifiers: Record<string, number>;
  savingThrows: Record<AbilityScore, number>;
  passivePerception: number;
  passiveInvestigation: number;
  passiveInsight: number;
  initiative: number;
  armorClass: number;
  hitPointMaximum: number;
  speed: number;
}

/**
 * Character input for calculations
 */
export interface CharacterInput {
  level: number;
  abilityScores: AbilityScores;
  skillProficiencies: SkillProficiencies;
  savingThrowProficiencies: AbilityScore[];
  baseArmorClass?: number;
  hitDice?: number;
  baseSpeed?: number;
}

/**
 * Calculate ability modifier from ability score
 * 
 * @param score - Ability score (1-30)
 * @returns Ability modifier
 * 
 * @example
 * ```typescript
 * calculateAbilityModifier(10); // 0
 * calculateAbilityModifier(14); // +2
 * calculateAbilityModifier(8);  // -1
 * ```
 */
export function calculateAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/**
 * Calculate proficiency bonus from character level
 * 
 * @param level - Character level (1-20)
 * @returns Proficiency bonus
 * 
 * @example
 * ```typescript
 * calculateProficiencyBonus(1);  // +2
 * calculateProficiencyBonus(5);  // +3
 * calculateProficiencyBonus(17); // +6
 * ```
 */
export function calculateProficiencyBonus(level: number): number {
  if (level < 1) return 2;
  if (level > 20) return 6;
  return Math.floor((level - 1) / 4) + 2;
}

/**
 * Calculate skill modifier
 * 
 * @param abilityModifier - The governing ability's modifier
 * @param proficiencyBonus - Character's proficiency bonus
 * @param proficiencyLevel - Skill proficiency level
 * @returns Total skill modifier
 */
export function calculateSkillModifier(
  abilityModifier: number,
  proficiencyBonus: number,
  proficiencyLevel: ProficiencyLevel
): number {
  switch (proficiencyLevel) {
    case 'expertise':
      return abilityModifier + (proficiencyBonus * 2);
    case 'proficient':
      return abilityModifier + proficiencyBonus;
    default:
      return abilityModifier;
  }
}

/**
 * Calculate saving throw modifier
 * 
 * @param abilityModifier - The ability's modifier
 * @param proficiencyBonus - Character's proficiency bonus
 * @param isProficient - Whether character is proficient in this save
 * @returns Total saving throw modifier
 */
export function calculateSavingThrow(
  abilityModifier: number,
  proficiencyBonus: number,
  isProficient: boolean
): number {
  return isProficient ? abilityModifier + proficiencyBonus : abilityModifier;
}

/**
 * Calculate passive skill score
 * 
 * @param skillModifier - The skill's modifier
 * @returns Passive score (10 + modifier)
 */
export function calculatePassiveScore(skillModifier: number): number {
  return 10 + skillModifier;
}

/**
 * Calculate hit point maximum
 * 
 * @param level - Character level
 * @param hitDice - Hit die size (d6, d8, d10, d12)
 * @param constitutionModifier - Constitution modifier
 * @returns Maximum hit points
 */
export function calculateHitPointMaximum(
  level: number,
  hitDice: number,
  constitutionModifier: number
): number {
  // First level: max hit die + CON mod
  // Each additional level: average hit die (rounded up) + CON mod
  const firstLevelHP = hitDice + constitutionModifier;
  const averageRoll = Math.ceil(hitDice / 2) + 1;
  const additionalLevelsHP = (level - 1) * (averageRoll + constitutionModifier);
  return Math.max(1, firstLevelHP + additionalLevelsHP);
}

/**
 * Calculate armor class
 * 
 * @param baseAC - Base armor class (from armor)
 * @param dexterityModifier - Dexterity modifier
 * @param maxDexBonus - Maximum dex bonus allowed by armor (undefined = no limit)
 * @returns Total armor class
 */
export function calculateArmorClass(
  baseAC: number,
  dexterityModifier: number,
  maxDexBonus?: number
): number {
  const dexBonus = maxDexBonus !== undefined 
    ? Math.min(dexterityModifier, maxDexBonus)
    : dexterityModifier;
  return baseAC + dexBonus;
}

/**
 * Calculate all character stats
 * 
 * @param input - Character input data
 * @returns Complete calculated stats
 */
export function calculateCharacterStats(input: CharacterInput): CharacterStats {
  const { level, abilityScores, skillProficiencies, savingThrowProficiencies } = input;
  const baseAC = input.baseArmorClass ?? 10;
  const hitDice = input.hitDice ?? 8;
  const baseSpeed = input.baseSpeed ?? 30;
  
  // Calculate ability modifiers
  const abilityModifiers: Record<AbilityScore, number> = {
    strength: calculateAbilityModifier(abilityScores.strength),
    dexterity: calculateAbilityModifier(abilityScores.dexterity),
    constitution: calculateAbilityModifier(abilityScores.constitution),
    intelligence: calculateAbilityModifier(abilityScores.intelligence),
    wisdom: calculateAbilityModifier(abilityScores.wisdom),
    charisma: calculateAbilityModifier(abilityScores.charisma),
  };
  
  // Calculate proficiency bonus
  const proficiencyBonus = calculateProficiencyBonus(level);
  
  // Calculate skill modifiers
  const skillModifiers: Record<string, number> = {};
  for (const skill of ALL_SKILLS) {
    const ability = SKILL_ABILITIES[skill];
    const proficiency = skillProficiencies[skill] || 'none';
    skillModifiers[skill] = calculateSkillModifier(
      abilityModifiers[ability],
      proficiencyBonus,
      proficiency
    );
  }
  
  // Calculate saving throws
  const savingThrows: Record<AbilityScore, number> = {
    strength: calculateSavingThrow(abilityModifiers.strength, proficiencyBonus, savingThrowProficiencies.includes('strength')),
    dexterity: calculateSavingThrow(abilityModifiers.dexterity, proficiencyBonus, savingThrowProficiencies.includes('dexterity')),
    constitution: calculateSavingThrow(abilityModifiers.constitution, proficiencyBonus, savingThrowProficiencies.includes('constitution')),
    intelligence: calculateSavingThrow(abilityModifiers.intelligence, proficiencyBonus, savingThrowProficiencies.includes('intelligence')),
    wisdom: calculateSavingThrow(abilityModifiers.wisdom, proficiencyBonus, savingThrowProficiencies.includes('wisdom')),
    charisma: calculateSavingThrow(abilityModifiers.charisma, proficiencyBonus, savingThrowProficiencies.includes('charisma')),
  };
  
  // Calculate passive scores
  const passivePerception = calculatePassiveScore(skillModifiers.perception);
  const passiveInvestigation = calculatePassiveScore(skillModifiers.investigation);
  const passiveInsight = calculatePassiveScore(skillModifiers.insight);
  
  // Calculate other stats
  const initiative = abilityModifiers.dexterity;
  const armorClass = calculateArmorClass(baseAC, abilityModifiers.dexterity);
  const hitPointMaximum = calculateHitPointMaximum(level, hitDice, abilityModifiers.constitution);
  
  return {
    abilityModifiers,
    proficiencyBonus,
    skillModifiers,
    savingThrows,
    passivePerception,
    passiveInvestigation,
    passiveInsight,
    initiative,
    armorClass,
    hitPointMaximum,
    speed: baseSpeed,
  };
}

/**
 * Format modifier for display (with + or - sign)
 * 
 * @param modifier - The modifier value
 * @returns Formatted string like "+2" or "-1"
 */
export function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

/**
 * Get skill display name
 * 
 * @param skill - Skill key
 * @returns Formatted skill name
 */
export function getSkillDisplayName(skill: string): string {
  return (
    SKILL_NAMES_NO[skill] ??
    skill
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
}

/**
 * Get ability display name
 * 
 * @param ability - Ability key
 * @returns Formatted ability name
 */
export function getAbilityDisplayName(ability: AbilityScore): string {
  return ABILITY_NAMES_NO[ability] ?? ability.charAt(0).toUpperCase() + ability.slice(1);
}

/**
 * Standard point buy costs
 */
export const POINT_BUY_COSTS: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

/**
 * Calculate total point buy cost
 * 
 * @param scores - Ability scores
 * @returns Total point cost
 */
export function calculatePointBuyCost(scores: AbilityScores): number {
  let total = 0;
  for (const ability of Object.keys(scores) as AbilityScore[]) {
    const score = scores[ability];
    if (score >= 8 && score <= 15) {
      total += POINT_BUY_COSTS[score];
    }
  }
  return total;
}

/**
 * Standard array for ability scores
 */
export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

/**
 * Hit dice by class
 */
export const CLASS_HIT_DICE: Record<string, number> = {
  barbarian: 12,
  fighter: 10,
  paladin: 10,
  ranger: 10,
  bard: 8,
  cleric: 8,
  druid: 8,
  monk: 8,
  rogue: 8,
  warlock: 8,
  sorcerer: 6,
  wizard: 6,
};

/**
 * Saving throw proficiencies by class
 */
export const CLASS_SAVING_THROWS: Record<string, AbilityScore[]> = {
  barbarian: ['strength', 'constitution'],
  bard: ['dexterity', 'charisma'],
  cleric: ['wisdom', 'charisma'],
  druid: ['intelligence', 'wisdom'],
  fighter: ['strength', 'constitution'],
  monk: ['strength', 'dexterity'],
  paladin: ['wisdom', 'charisma'],
  ranger: ['strength', 'dexterity'],
  rogue: ['dexterity', 'intelligence'],
  sorcerer: ['constitution', 'charisma'],
  warlock: ['wisdom', 'charisma'],
  wizard: ['intelligence', 'wisdom'],
};
