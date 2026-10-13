/**
 * Property Tests: RPG Calculations
 * Feature: expanded-tools-categories
 * 
 * Tests for Dice Roller and Fantasy Name Generator
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  rollDice,
  parseDiceNotation,
  rollMultipleDice,
  getMinRoll,
  getMaxRoll,
  getAverageRoll,
  roll4d6DropLowest,
  type DiceRoll,
} from '@/lib/calculations/rpg/dice-roller';

/**
 * Arbitrary for generating valid number of dice (1-20)
 */
const validNumDiceArb = fc.integer({ min: 1, max: 20 });

/**
 * Arbitrary for generating valid dice faces (common dice types)
 */
const validFacesArb = fc.constantFrom(4, 6, 8, 10, 12, 20, 100);

/**
 * Arbitrary for generating valid modifiers (-20 to +20)
 */
const validModifierArb = fc.integer({ min: -20, max: 20 });

/**
 * Arbitrary for generating valid dice notation strings
 */
const validDiceNotationArb = fc.tuple(validNumDiceArb, validFacesArb, validModifierArb).map(
  ([numDice, faces, modifier]) => {
    if (modifier === 0) {
      return `${numDice}d${faces}`;
    } else if (modifier > 0) {
      return `${numDice}d${faces}+${modifier}`;
    } else {
      return `${numDice}d${faces}${modifier}`;
    }
  }
);

describe('Dice Roller - Property 10: Dice Roll Sum Invariant', () => {
  /**
   * Property 10: Dice Roll Sum Invariant
   * Feature: expanded-tools-categories, Property 10: Dice Roll Sum Invariant
   * 
   * *For any* dice notation (e.g., "3d6+2"), the total SHALL equal the sum of 
   * individual die results plus the modifier, and each die result SHALL be 
   * within [1, die_faces].
   * 
   * **Validates: Requirements 21.11**
   */
  it('total should equal sum of individual results plus modifier', () => {
    fc.assert(
      fc.property(
        validDiceNotationArb,
        (notation) => {
          const result = rollDice(notation);
          
          // Calculate expected total from individual results
          const diceSum = result.results.reduce((sum, val) => sum + val, 0);
          const expectedTotal = diceSum + result.modifier;
          
          // Total should equal sum of results plus modifier
          expect(result.total).toBe(expectedTotal);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Each die result should be within valid range [1, faces]
   * **Validates: Requirements 21.11**
   */
  it('each die result should be within [1, faces]', () => {
    fc.assert(
      fc.property(
        validDiceNotationArb,
        (notation) => {
          const result = rollDice(notation);
          
          // Each die result should be between 1 and faces (inclusive)
          for (const dieResult of result.results) {
            expect(dieResult).toBeGreaterThanOrEqual(1);
            expect(dieResult).toBeLessThanOrEqual(result.faces);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Number of results should equal number of dice
   * **Validates: Requirements 21.11**
   */
  it('number of results should equal number of dice', () => {
    fc.assert(
      fc.property(
        validDiceNotationArb,
        (notation) => {
          const result = rollDice(notation);
          
          // Number of results should match numDice
          expect(result.results.length).toBe(result.numDice);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Total should be within [min, max] range
   * **Validates: Requirements 21.11**
   */
  it('total should be within min and max range', () => {
    fc.assert(
      fc.property(
        validDiceNotationArb,
        (notation) => {
          const result = rollDice(notation);
          const minPossible = getMinRoll(notation);
          const maxPossible = getMaxRoll(notation);
          
          // Total should be within valid range
          expect(result.total).toBeGreaterThanOrEqual(minPossible);
          expect(result.total).toBeLessThanOrEqual(maxPossible);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Min roll should be numDice + modifier (all 1s)
   * **Validates: Requirements 21.11**
   */
  it('min roll should be numDice + modifier', () => {
    fc.assert(
      fc.property(
        validNumDiceArb,
        validFacesArb,
        validModifierArb,
        (numDice, faces, modifier) => {
          const notation = modifier === 0 
            ? `${numDice}d${faces}` 
            : modifier > 0 
              ? `${numDice}d${faces}+${modifier}` 
              : `${numDice}d${faces}${modifier}`;
          
          const minRoll = getMinRoll(notation);
          
          // Min roll is when all dice show 1
          expect(minRoll).toBe(numDice + modifier);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Max roll should be (numDice * faces) + modifier
   * **Validates: Requirements 21.11**
   */
  it('max roll should be (numDice * faces) + modifier', () => {
    fc.assert(
      fc.property(
        validNumDiceArb,
        validFacesArb,
        validModifierArb,
        (numDice, faces, modifier) => {
          const notation = modifier === 0 
            ? `${numDice}d${faces}` 
            : modifier > 0 
              ? `${numDice}d${faces}+${modifier}` 
              : `${numDice}d${faces}${modifier}`;
          
          const maxRoll = getMaxRoll(notation);
          
          // Max roll is when all dice show max face value
          expect(maxRoll).toBe((numDice * faces) + modifier);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Average roll should be numDice * (1 + faces) / 2 + modifier
   * **Validates: Requirements 21.11**
   */
  it('average roll should follow expected value formula', () => {
    fc.assert(
      fc.property(
        validNumDiceArb,
        validFacesArb,
        validModifierArb,
        (numDice, faces, modifier) => {
          const notation = modifier === 0 
            ? `${numDice}d${faces}` 
            : modifier > 0 
              ? `${numDice}d${faces}+${modifier}` 
              : `${numDice}d${faces}${modifier}`;
          
          const avgRoll = getAverageRoll(notation);
          const expectedAvg = (numDice * (1 + faces) / 2) + modifier;
          
          expect(avgRoll).toBeCloseTo(expectedAvg, 10);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('4d6 Drop Lowest - Property Tests', () => {
  /**
   * Property: 4d6 drop lowest should return 4 dice with 3 kept
   * **Validates: Requirements 21.3**
   */
  it('should roll 4 dice and keep 3', () => {
    fc.assert(
      fc.property(
        fc.constant(null), // No input needed, just run multiple times
        () => {
          const result = roll4d6DropLowest();
          
          expect(result.allRolls.length).toBe(4);
          expect(result.kept.length).toBe(3);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Dropped die should be the minimum of all rolls
   * **Validates: Requirements 21.3**
   */
  it('dropped die should be the minimum', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const result = roll4d6DropLowest();
          const minRoll = Math.min(...result.allRolls);
          
          expect(result.dropped).toBe(minRoll);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Total should equal sum of kept dice
   * **Validates: Requirements 21.3**
   */
  it('total should equal sum of kept dice', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const result = roll4d6DropLowest();
          const keptSum = result.kept.reduce((sum, val) => sum + val, 0);
          
          expect(result.total).toBe(keptSum);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Total should be between 3 and 18 (3d6 range)
   * **Validates: Requirements 21.3**
   */
  it('total should be between 3 and 18', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const result = roll4d6DropLowest();
          
          expect(result.total).toBeGreaterThanOrEqual(3);
          expect(result.total).toBeLessThanOrEqual(18);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: All dice results should be between 1 and 6
   * **Validates: Requirements 21.3**
   */
  it('all dice results should be between 1 and 6', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const result = roll4d6DropLowest();
          
          for (const die of result.allRolls) {
            expect(die).toBeGreaterThanOrEqual(1);
            expect(die).toBeLessThanOrEqual(6);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});


// Import name generator functions
import {
  generateFantasyName,
  generateFantasyNames,
  isNameFromPool,
  decomposeNameFromPool,
  generateTavernName,
  generateQuestHook,
  getTavernNameComponents,
  getQuestHookComponents,
  FANTASY_RACES,
  GENDERS,
  type FantasyRace,
  type Gender,
} from '@/lib/calculations/rpg/name-generator';
import { getNamePool } from '@/lib/data/fantasy-names';

/**
 * Arbitrary for generating valid fantasy races
 */
const validRaceArb = fc.constantFrom(...FANTASY_RACES);

/**
 * Arbitrary for generating valid genders
 */
const validGenderArb = fc.constantFrom(...GENDERS);

describe('Fantasy Name Generator - Property 11: Fantasy Name Pool Membership', () => {
  /**
   * Property 11: Fantasy Name Pool Membership
   * Feature: expanded-tools-categories, Property 11: Fantasy Name Pool Membership
   * 
   * *For any* generated fantasy name for a given race, the name components SHALL be 
   * drawn from the corresponding race's name pool (prefixes and suffixes).
   * 
   * **Validates: Requirements 21.12**
   */
  it('generated name should start with a prefix from the race pool', () => {
    fc.assert(
      fc.property(
        validRaceArb,
        validGenderArb,
        (race, gender) => {
          const result = generateFantasyName(race, gender);
          const pool = getNamePool(race, gender);
          
          // The name should start with one of the prefixes
          const startsWithPrefix = pool.prefixes.some(prefix => 
            result.name.startsWith(prefix)
          );
          
          expect(startsWithPrefix).toBe(true);
          expect(pool.prefixes).toContain(result.prefix);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Generated name should end with a suffix from the race pool
   * **Validates: Requirements 21.12**
   */
  it('generated name should end with a suffix from the race pool', () => {
    fc.assert(
      fc.property(
        validRaceArb,
        validGenderArb,
        (race, gender) => {
          const result = generateFantasyName(race, gender);
          const pool = getNamePool(race, gender);
          
          // The name should end with one of the suffixes
          const endsWithSuffix = pool.suffixes.some(suffix => 
            result.name.endsWith(suffix)
          );
          
          expect(endsWithSuffix).toBe(true);
          expect(pool.suffixes).toContain(result.suffix);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Generated name should equal prefix + suffix
   * **Validates: Requirements 21.12**
   */
  it('generated name should equal prefix concatenated with suffix', () => {
    fc.assert(
      fc.property(
        validRaceArb,
        validGenderArb,
        (race, gender) => {
          const result = generateFantasyName(race, gender);
          
          expect(result.name).toBe(result.prefix + result.suffix);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: isNameFromPool should return true for generated names
   * **Validates: Requirements 21.12**
   */
  it('isNameFromPool should return true for generated names', () => {
    fc.assert(
      fc.property(
        validRaceArb,
        validGenderArb,
        (race, gender) => {
          const result = generateFantasyName(race, gender);
          
          expect(isNameFromPool(result.name, race, gender)).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: decomposeNameFromPool should recover original components
   * **Validates: Requirements 21.12**
   */
  it('decomposeNameFromPool should recover original prefix and suffix', () => {
    fc.assert(
      fc.property(
        validRaceArb,
        validGenderArb,
        (race, gender) => {
          const result = generateFantasyName(race, gender);
          const decomposed = decomposeNameFromPool(result.name, race, gender);
          
          expect(decomposed).not.toBeNull();
          expect(decomposed?.prefix).toBe(result.prefix);
          expect(decomposed?.suffix).toBe(result.suffix);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Generated name metadata should match input parameters
   * **Validates: Requirements 21.12**
   */
  it('generated name metadata should match input parameters', () => {
    fc.assert(
      fc.property(
        validRaceArb,
        validGenderArb,
        (race, gender) => {
          const result = generateFantasyName(race, gender);
          
          expect(result.race).toBe(race);
          expect(result.gender).toBe(gender);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: generateFantasyNames should return correct count
   * **Validates: Requirements 21.12**
   */
  it('generateFantasyNames should return requested count', () => {
    fc.assert(
      fc.property(
        validRaceArb,
        validGenderArb,
        fc.integer({ min: 1, max: 20 }),
        (race, gender, count) => {
          const results = generateFantasyNames({ race, gender, count });
          
          expect(results.length).toBe(count);
          
          // All names should be from the correct pool
          for (const result of results) {
            expect(result.race).toBe(race);
            expect(result.gender).toBe(gender);
            expect(isNameFromPool(result.name, race, gender)).toBe(true);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Tavern Name Generator - Property Tests', () => {
  /**
   * Property: Tavern names should follow «[Suffix] «Den/Det [adjektiv] [substantiv]»» pattern
   * **Validates: Requirements 21.9**
   */
  it('tavern name should contain components from pools', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const name = generateTavernName();
          const components = getTavernNameComponents();
          
          // Skal ha formen «Vertshuset «Den gylne draken»»
          expect(/^\S+ «(Den|Det) .+»$/.test(name)).toBe(true);
          
          // Should contain at least one adjective
          const hasAdjective = components.adjectives.some(adj => name.includes(adj));
          expect(hasAdjective).toBe(true);
          
          // Should contain at least one noun
          const hasNoun = components.nouns.some(noun => name.includes(noun));
          expect(hasNoun).toBe(true);
          
          // Should start with a suffix
          const hasSuffix = components.suffixes.some(suffix => name.startsWith(suffix));
          expect(hasSuffix).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Quest Hook Generator - Property Tests', () => {
  /**
   * Property: Quest hooks should contain components from all pools
   * **Validates: Requirements 21.10**
   */
  it('quest hook should contain components from pools', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const hook = generateQuestHook();
          const components = getQuestHookComponents();
          
          // Should start with a verb
          const startsWithVerb = components.verbs.some(verb => hook.startsWith(verb));
          expect(startsWithVerb).toBe(true);
          
          // Should contain an object
          const hasObject = components.objects.some(obj => hook.includes(obj));
          expect(hasObject).toBe(true);
          
          // Should contain a location
          const hasLocation = components.locations.some(loc => hook.includes(loc));
          expect(hasLocation).toBe(true);
          
          // Should end with a reward phrase
          const hasReward = components.rewards.some(reward => hook.endsWith(reward));
          expect(hasReward).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
