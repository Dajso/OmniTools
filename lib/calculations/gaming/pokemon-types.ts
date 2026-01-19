/**
 * Pokemon Type Calculator
 * 
 * Calculates type effectiveness for Pokemon battles.
 * Includes all 18 types and their interactions.
 * 
 * @module lib/calculations/gaming/pokemon-types
 * @see Requirements 17.5
 */

/**
 * All Pokemon types
 */
export const POKEMON_TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
] as const;

export type PokemonType = typeof POKEMON_TYPES[number];

/**
 * Type effectiveness multipliers
 */
export type Effectiveness = 0 | 0.5 | 1 | 2;

/**
 * Type effectiveness chart
 * Key: attacking type
 * Value: Record of defending type -> effectiveness multiplier
 * 
 * 2 = Super effective
 * 1 = Normal effectiveness
 * 0.5 = Not very effective
 * 0 = No effect (immune)
 */
export const TYPE_CHART: Record<PokemonType, Partial<Record<PokemonType, Effectiveness>>> = {
  normal: {
    rock: 0.5,
    ghost: 0,
    steel: 0.5,
  },
  fire: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 2,
    bug: 2,
    rock: 0.5,
    dragon: 0.5,
    steel: 2,
  },
  water: {
    fire: 2,
    water: 0.5,
    grass: 0.5,
    ground: 2,
    rock: 2,
    dragon: 0.5,
  },
  electric: {
    water: 2,
    electric: 0.5,
    grass: 0.5,
    ground: 0,
    flying: 2,
    dragon: 0.5,
  },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
    steel: 0.5,
  },
  ice: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 0.5,
    ground: 2,
    flying: 2,
    dragon: 2,
    steel: 0.5,
  },
  fighting: {
    normal: 2,
    ice: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2,
    ghost: 0,
    dark: 2,
    steel: 2,
    fairy: 0.5,
  },
  poison: {
    grass: 2,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
    fairy: 2,
  },
  ground: {
    fire: 2,
    electric: 2,
    grass: 0.5,
    poison: 2,
    flying: 0,
    bug: 0.5,
    rock: 2,
    steel: 2,
  },
  flying: {
    electric: 0.5,
    grass: 2,
    fighting: 2,
    bug: 2,
    rock: 0.5,
    steel: 0.5,
  },
  psychic: {
    fighting: 2,
    poison: 2,
    psychic: 0.5,
    dark: 0,
    steel: 0.5,
  },
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
    dark: 2,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: {
    fire: 2,
    ice: 2,
    fighting: 0.5,
    ground: 0.5,
    flying: 2,
    bug: 2,
    steel: 0.5,
  },
  ghost: {
    normal: 0,
    psychic: 2,
    ghost: 2,
    dark: 0.5,
  },
  dragon: {
    dragon: 2,
    steel: 0.5,
    fairy: 0,
  },
  dark: {
    fighting: 0.5,
    psychic: 2,
    ghost: 2,
    dark: 0.5,
    fairy: 0.5,
  },
  steel: {
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    ice: 2,
    rock: 2,
    steel: 0.5,
    fairy: 2,
  },
  fairy: {
    fire: 0.5,
    fighting: 2,
    poison: 0.5,
    dragon: 2,
    dark: 2,
    steel: 0.5,
  },
};

export interface TypeEffectivenessResult {
  attackingType: PokemonType;
  defendingTypes: PokemonType[];
  multiplier: number;
  description: string;
}

export interface DefensiveAnalysis {
  types: PokemonType[];
  weaknesses: { type: PokemonType; multiplier: number }[];
  resistances: { type: PokemonType; multiplier: number }[];
  immunities: PokemonType[];
  neutral: PokemonType[];
}

export interface OffensiveAnalysis {
  type: PokemonType;
  superEffective: PokemonType[];
  notVeryEffective: PokemonType[];
  noEffect: PokemonType[];
  neutral: PokemonType[];
}

/**
 * Get the effectiveness multiplier for an attack
 * 
 * @param attackingType - The type of the attacking move
 * @param defendingType - The type of the defending Pokemon
 * @returns Effectiveness multiplier (0, 0.5, 1, or 2)
 */
export function getTypeEffectiveness(
  attackingType: PokemonType,
  defendingType: PokemonType
): Effectiveness {
  const typeData = TYPE_CHART[attackingType];
  return typeData[defendingType] ?? 1;
}

/**
 * Calculate combined effectiveness against a dual-type Pokemon
 * 
 * @param attackingType - The type of the attacking move
 * @param defendingTypes - Array of defending Pokemon's types (1 or 2)
 * @returns Combined effectiveness multiplier
 */
export function calculateEffectiveness(
  attackingType: PokemonType,
  defendingTypes: PokemonType[]
): TypeEffectivenessResult {
  if (defendingTypes.length === 0) {
    throw new Error('At least one defending type is required');
  }
  if (defendingTypes.length > 2) {
    throw new Error('Pokemon can have at most 2 types');
  }

  let multiplier = 1;
  for (const defType of defendingTypes) {
    multiplier *= getTypeEffectiveness(attackingType, defType);
  }

  const description = getEffectivenessDescription(multiplier);

  return {
    attackingType,
    defendingTypes,
    multiplier,
    description,
  };
}

/**
 * Get a description for an effectiveness multiplier
 * 
 * @param multiplier - Effectiveness multiplier
 * @returns Description string
 */
export function getEffectivenessDescription(multiplier: number): string {
  if (multiplier === 0) return 'No effect';
  if (multiplier === 0.25) return 'Not very effective (×0.25)';
  if (multiplier === 0.5) return 'Not very effective (×0.5)';
  if (multiplier === 1) return 'Normal effectiveness';
  if (multiplier === 2) return 'Super effective! (×2)';
  if (multiplier === 4) return 'Super effective! (×4)';
  return `×${multiplier}`;
}

/**
 * Analyze defensive matchups for a Pokemon
 * 
 * @param types - The Pokemon's types (1 or 2)
 * @returns Defensive analysis with weaknesses, resistances, and immunities
 */
export function analyzeDefensiveMatchups(types: PokemonType[]): DefensiveAnalysis {
  if (types.length === 0) {
    throw new Error('At least one type is required');
  }
  if (types.length > 2) {
    throw new Error('Pokemon can have at most 2 types');
  }

  const weaknesses: { type: PokemonType; multiplier: number }[] = [];
  const resistances: { type: PokemonType; multiplier: number }[] = [];
  const immunities: PokemonType[] = [];
  const neutral: PokemonType[] = [];

  for (const attackType of POKEMON_TYPES) {
    const result = calculateEffectiveness(attackType, types);
    
    if (result.multiplier === 0) {
      immunities.push(attackType);
    } else if (result.multiplier > 1) {
      weaknesses.push({ type: attackType, multiplier: result.multiplier });
    } else if (result.multiplier < 1) {
      resistances.push({ type: attackType, multiplier: result.multiplier });
    } else {
      neutral.push(attackType);
    }
  }

  // Sort by multiplier (highest weakness first, lowest resistance first)
  weaknesses.sort((a, b) => b.multiplier - a.multiplier);
  resistances.sort((a, b) => a.multiplier - b.multiplier);

  return {
    types,
    weaknesses,
    resistances,
    immunities,
    neutral,
  };
}

/**
 * Analyze offensive matchups for a type
 * 
 * @param type - The attacking type
 * @returns Offensive analysis with super effective, not very effective, and no effect types
 */
export function analyzeOffensiveMatchups(type: PokemonType): OffensiveAnalysis {
  const superEffective: PokemonType[] = [];
  const notVeryEffective: PokemonType[] = [];
  const noEffect: PokemonType[] = [];
  const neutral: PokemonType[] = [];

  for (const defType of POKEMON_TYPES) {
    const effectiveness = getTypeEffectiveness(type, defType);
    
    if (effectiveness === 0) {
      noEffect.push(defType);
    } else if (effectiveness === 2) {
      superEffective.push(defType);
    } else if (effectiveness === 0.5) {
      notVeryEffective.push(defType);
    } else {
      neutral.push(defType);
    }
  }

  return {
    type,
    superEffective,
    notVeryEffective,
    noEffect,
    neutral,
  };
}

/**
 * Find the best attacking types against a Pokemon
 * 
 * @param defendingTypes - The defending Pokemon's types
 * @returns Array of types sorted by effectiveness (best first)
 */
export function findBestAttackingTypes(
  defendingTypes: PokemonType[]
): { type: PokemonType; multiplier: number }[] {
  const results: { type: PokemonType; multiplier: number }[] = [];

  for (const attackType of POKEMON_TYPES) {
    const result = calculateEffectiveness(attackType, defendingTypes);
    results.push({ type: attackType, multiplier: result.multiplier });
  }

  // Sort by multiplier (highest first)
  results.sort((a, b) => b.multiplier - a.multiplier);

  return results;
}

/**
 * Get type color for UI display
 * 
 * @param type - Pokemon type
 * @returns Hex color code
 */
export function getTypeColor(type: PokemonType): string {
  const colors: Record<PokemonType, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };

  return colors[type];
}
