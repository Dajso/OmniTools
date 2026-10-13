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
function randomElement<T>(array: readonly T[]): T {
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
    throw new Error(`Ugyldig rase: ${race}. Gyldige raser er: ${FANTASY_RACES.join(', ')}`);
  }

  if (!isValidGender(gender)) {
    throw new Error(`Ugyldig kjønn: ${gender}. Gyldige valg er: ${GENDERS.join(', ')}`);
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
    throw new Error('Antall må være mellom 1 og 100');
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
  'gylne', 'sølvblanke', 'rustne', 'spretne', 'sovende', 'dansende', 'leende',
  'gråtende', 'fulle', 'muntre', 'glade', 'omstreifende', 'tapte', 'skjulte',
  'eldgamle', 'ødelagte', 'skjeve', 'lekke', 'støvete', 'lyssky',
];

/** Substantiv i bestemt form. Intetkjønnsord er listet i NEUTER_NOUNS. */
const TAVERN_NOUNS = [
  'draken', 'griffen', 'enhjørningen', 'fønikset', 'goblinen', 'trollet', 'kjempen',
  'ridderen', 'trollmannen', 'skalden', 'tyven', 'paladinen', 'jegeren', 'munken',
  'tønna', 'kruset', 'kanna', 'gryta', 'sverdet', 'skjoldet',
];

const NEUTER_NOUNS = ['fønikset', 'trollet', 'kruset', 'sverdet', 'skjoldet'];

const TAVERN_SUFFIXES = [
  'Vertshuset', 'Kroa', 'Puben', 'Ølstua', 'Herberget', 'Gjestgiveriet',
  'Rasteplassen', 'Tilfluktet', 'Huset', 'Hallen',
];

/**
 * Generate a random tavern name
 * 
 * @returns Generated tavern name
 * 
 * @example
 * ```typescript
 * const name = generateTavernName();
 * // kan gi «Vertshuset «Den gylne draken»»
 * ```
 */
export function generateTavernName(): string {
  const adjective = randomElement(TAVERN_ADJECTIVES);
  const noun = randomElement(TAVERN_NOUNS);
  const suffix = randomElement(TAVERN_SUFFIXES);
  const article = NEUTER_NOUNS.includes(noun) ? 'Det' : 'Den';

  return `${suffix} «${article} ${adjective} ${noun}»`;
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
  'Finn', 'Skaff', 'Red', 'Beseir', 'Etterforsk', 'Eskorter', 'Lever',
  'Beskytt', 'Ødelegg', 'Stjel', 'Oppdag', 'Utforsk', 'Jakt på', 'Fang',
  'Forhandle om', 'Infiltrer', 'Saboter', 'Forsvar', 'Hevn', 'Løs',
];

const QUEST_OBJECTS = [
  'det eldgamle artefaktet', 'den savnede arvingen', 'den stjålne skatten',
  'den forbannede amuletten', 'det legendariske sverdet', 'den hellige boka',
  'den bortførte kjøpmannen', 'den forsvunne ekspedisjonen', 'den mystiske fremmede',
  'dragens skatt', 'goblinkongen', 'den udøde hæren',
  'de hjemsøkte ruinene', 'den hemmelige gangen', 'den forbudte kunnskapen',
  'det kongelige seglet', 'den fortryllede edelsteinen', 'profetirullen',
  'røverhøvdingen', 'den korrupte embetsmannen',
];

const QUEST_LOCATIONS = [
  'i Mørkeskogen', 'under Tåkefjellene', 'i det sunkne tempelet',
  'over den brennende ørkenen', 'hinsides de frosne ødemarkene', 'i det hjemsøkte slottet',
  'gjennom de endeløse hulene', 'på de flytende øyene', 'i skyggeriket',
  'ved verdens ende', 'i tyvenes by', 'under de eldgamle ruinene',
  'i dragens hule', 'over de stormfulle havene', 'i den fortryllede lunden',
  'ved skjebnens veikryss', 'i trollmannens tårn', 'under kirkegården',
  'i den forlatte gruva', 'ved grensefestningen',
];

const QUEST_REWARDS = [
  'for en raus belønning', 'for å redde riket', 'før tiden går ut',
  'for å løfte forbannelsen', 'for evig ære', 'for å hindre krig',
  'for å oppfylle profetien', 'til det felles beste', 'for å gjenopprette balansen',
  'før fienden slår til', 'for å bevise hva du duger til', 'for ære og gull',
  'for å avdekke sannheten', 'før mørket faller på', 'for å vinne kongens gunst',
  'for en edel sak', 'for å rette opp en gammel urett', 'før det er for sent',
  'for å innfri skjebnen din', 'for de uskyldiges skyld',
];

/**
 * Generate a random quest hook/idea
 * 
 * @returns Generated quest hook string
 * 
 * @example
 * ```typescript
 * const quest = generateQuestHook();
 * // kan gi «Finn det eldgamle artefaktet i Mørkeskogen for en raus belønning»
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
