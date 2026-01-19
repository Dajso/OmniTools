/**
 * Fantasy Name Generator
 * 
 * Generates culturally appropriate fantasy names for various races.
 * Names are constructed by combining prefixes and suffixes from pre-defined pools.
 * 
 * @module lib/calculations/rpg/name-generator
 * @see Requirements 21.2, 21.12
 */

import {
  FANTASY_NAMES,
  FANTASY_RACES,
  GENDERS,
  getNamePool,
  isValidRace,
  isValidGender,
  type FantasyRace,
  type Gender,
  type NamePool,
} from '@/lib/data/fantasy-names';

// Re-export types and constants for convenience
export { FANTASY_RACES, GENDERS, type FantasyRace, type Gender };

/**
 * Configuration for name generation
 */
export interface NameGeneratorConfig {
  race: FantasyRace;
  gender?: Gender;
  count?: number;
}

/**
 * Result of name generation
 */
export interface GeneratedName {
  name: string;
  race: FantasyRace;
  gender: Gender;
  prefix: string;
  suffix: string;
}

/**
 * Pick a random element from an array
 */
function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate a single fantasy name for a given race and gender
 * 
 * @param race - Fantasy race
 * @param gender - Gender (defaults to 'neutral')
 * @returns Generated name with metadata
 * 
 * @example
 * ```typescript
 * const name = generateFantasyName('elf', 'male');
 * // name.name might be "Aelandil"
 * ```
 */
export function generateFantasyName(race: FantasyRace, gender: Gender = 'neutral'): GeneratedName {
  if (!isValidRace(race)) {
    throw new Error(`Invalid race: ${race}. Valid races are: ${FANTASY_RACES.join(', ')}`);
  }
  
  if (!isValidGender(gender)) {
    throw new Error(`Invalid gender: ${gender}. Valid genders are: ${GENDERS.join(', ')}`);
  }
  
  const pool = getNamePool(race, gender);
  const prefix = randomElement(pool.prefixes);
  const suffix = randomElement(pool.suffixes);
  
  return {
    name: prefix + suffix,
    race,
    gender,
    prefix,
    suffix,
  };
}

/**
 * Generate multiple fantasy names
 * 
 * @param config - Name generation configuration
 * @returns Array of generated names
 * 
 * @example
 * ```typescript
 * const names = generateFantasyNames({ race: 'dwarf', gender: 'female', count: 5 });
 * ```
 */
export function generateFantasyNames(config: NameGeneratorConfig): GeneratedName[] {
  const { race, gender = 'neutral', count = 1 } = config;
  
  if (count < 1 || count > 100) {
    throw new Error('Count must be between 1 and 100');
  }
  
  const names: GeneratedName[] = [];
  for (let i = 0; i < count; i++) {
    names.push(generateFantasyName(race, gender));
  }
  
  return names;
}

/**
 * Check if a name was generated from a specific race's name pool
 * 
 * @param name - The generated name to check
 * @param race - The race to check against
 * @param gender - The gender to check against
 * @returns True if the name could have been generated from the pool
 */
export function isNameFromPool(name: string, race: FantasyRace, gender: Gender): boolean {
  const pool = getNamePool(race, gender);
  
  // Check if the name starts with any prefix and ends with any suffix
  for (const prefix of pool.prefixes) {
    if (name.startsWith(prefix)) {
      const remainder = name.slice(prefix.length);
      if (pool.suffixes.includes(remainder)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Get the prefix and suffix components of a generated name
 * 
 * @param name - The name to decompose
 * @param race - The race the name was generated for
 * @param gender - The gender the name was generated for
 * @returns Object with prefix and suffix, or null if not found
 */
export function decomposeNameFromPool(
  name: string,
  race: FantasyRace,
  gender: Gender
): { prefix: string; suffix: string } | null {
  const pool = getNamePool(race, gender);
  
  for (const prefix of pool.prefixes) {
    if (name.startsWith(prefix)) {
      const remainder = name.slice(prefix.length);
      if (pool.suffixes.includes(remainder)) {
        return { prefix, suffix: remainder };
      }
    }
  }
  
  return null;
}

// ============================================
// Tavern Name Generator
// ============================================

/**
 * Tavern name components
 */
const TAVERN_ADJECTIVES = [
  'Golden', 'Silver', 'Rusty', 'Prancing', 'Sleeping', 'Dancing', 'Laughing',
  'Weeping', 'Drunken', 'Merry', 'Jolly', 'Wandering', 'Lost', 'Hidden',
  'Ancient', 'Broken', 'Crooked', 'Leaky', 'Dusty', 'Shady',
];

const TAVERN_NOUNS = [
  'Dragon', 'Griffin', 'Unicorn', 'Phoenix', 'Goblin', 'Troll', 'Giant',
  'Knight', 'Wizard', 'Bard', 'Rogue', 'Paladin', 'Ranger', 'Monk',
  'Barrel', 'Tankard', 'Flagon', 'Cauldron', 'Sword', 'Shield',
];

const TAVERN_SUFFIXES = [
  'Inn', 'Tavern', 'Pub', 'Alehouse', 'Lodge', 'Rest', 'Haven',
  'Retreat', 'House', 'Hall',
];

/**
 * Generate a random tavern name
 * 
 * @returns Generated tavern name
 * 
 * @example
 * ```typescript
 * const name = generateTavernName();
 * // might return "The Golden Dragon Inn"
 * ```
 */
export function generateTavernName(): string {
  const adjective = randomElement(TAVERN_ADJECTIVES);
  const noun = randomElement(TAVERN_NOUNS);
  const suffix = randomElement(TAVERN_SUFFIXES);
  
  return `The ${adjective} ${noun} ${suffix}`;
}

/**
 * Get tavern name components for validation
 */
export function getTavernNameComponents() {
  return {
    adjectives: TAVERN_ADJECTIVES,
    nouns: TAVERN_NOUNS,
    suffixes: TAVERN_SUFFIXES,
  };
}

// ============================================
// Quest Hook Generator
// ============================================

/**
 * Quest hook components
 */
const QUEST_VERBS = [
  'Find', 'Retrieve', 'Rescue', 'Defeat', 'Investigate', 'Escort', 'Deliver',
  'Protect', 'Destroy', 'Steal', 'Discover', 'Explore', 'Hunt', 'Capture',
  'Negotiate', 'Infiltrate', 'Sabotage', 'Defend', 'Avenge', 'Solve',
];

const QUEST_OBJECTS = [
  'the ancient artifact', 'the missing heir', 'the stolen treasure',
  'the cursed amulet', 'the legendary sword', 'the sacred tome',
  'the kidnapped merchant', 'the lost expedition', 'the mysterious stranger',
  'the dragon\'s hoard', 'the goblin king', 'the undead army',
  'the haunted ruins', 'the secret passage', 'the forbidden knowledge',
  'the royal seal', 'the enchanted gem', 'the prophecy scroll',
  'the bandit leader', 'the corrupt official',
];

const QUEST_LOCATIONS = [
  'in the Darkwood Forest', 'beneath the Misty Mountains', 'within the Sunken Temple',
  'across the Burning Desert', 'beyond the Frozen Wastes', 'inside the Haunted Castle',
  'through the Endless Caverns', 'upon the Floating Islands', 'within the Shadow Realm',
  'at the Edge of the World', 'in the City of Thieves', 'beneath the Ancient Ruins',
  'within the Dragon\'s Lair', 'across the Stormy Seas', 'in the Enchanted Grove',
  'at the Crossroads of Fate', 'within the Wizard\'s Tower', 'beneath the Graveyard',
  'in the Abandoned Mine', 'at the Border Fortress',
];

const QUEST_REWARDS = [
  'for a handsome reward', 'to save the kingdom', 'before time runs out',
  'to lift the curse', 'for eternal glory', 'to prevent war',
  'to fulfill the prophecy', 'for the good of all', 'to restore balance',
  'before the enemy strikes', 'to prove your worth', 'for honor and gold',
  'to uncover the truth', 'before darkness falls', 'to earn the king\'s favor',
  'for a noble cause', 'to right an ancient wrong', 'before it\'s too late',
  'to claim your destiny', 'for the sake of the innocent',
];

/**
 * Generate a random quest hook/idea
 * 
 * @returns Generated quest hook string
 * 
 * @example
 * ```typescript
 * const quest = generateQuestHook();
 * // might return "Find the ancient artifact in the Darkwood Forest for a handsome reward"
 * ```
 */
export function generateQuestHook(): string {
  const verb = randomElement(QUEST_VERBS);
  const object = randomElement(QUEST_OBJECTS);
  const location = randomElement(QUEST_LOCATIONS);
  const reward = randomElement(QUEST_REWARDS);
  
  return `${verb} ${object} ${location} ${reward}`;
}

/**
 * Get quest hook components for validation
 */
export function getQuestHookComponents() {
  return {
    verbs: QUEST_VERBS,
    objects: QUEST_OBJECTS,
    locations: QUEST_LOCATIONS,
    rewards: QUEST_REWARDS,
  };
}
