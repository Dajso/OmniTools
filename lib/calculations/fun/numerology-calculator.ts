/**
 * Numerology Calculator
 * 
 * Calculates numerology numbers including Life Path Number,
 * Expression Number, and Soul Urge Number based on name and birth date.
 * 
 * Requirements: 19.5
 */

/**
 * Letter to number mapping (Pythagorean system)
 */
const LETTER_VALUES: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

/**
 * Vowels for Soul Urge calculation
 */
const VOWELS = ['a', 'e', 'i', 'o', 'u'];

/**
 * Master numbers that should not be reduced
 */
const MASTER_NUMBERS = [11, 22, 33];

/**
 * Numerology result containing all calculated numbers
 */
export interface NumerologyResult {
  lifePathNumber: number;
  expressionNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  birthdayNumber: number;
  lifePathMeaning: string;
  expressionMeaning: string;
  soulUrgeMeaning: string;
}

/**
 * Meanings for each life path number
 */
const LIFE_PATH_MEANINGS: Record<number, string> = {
  1: 'The Leader - Independent, ambitious, and pioneering. You are meant to lead and innovate.',
  2: 'The Mediator - Diplomatic, cooperative, and sensitive. You bring harmony and balance.',
  3: 'The Communicator - Creative, expressive, and social. You inspire others through your words.',
  4: 'The Builder - Practical, hardworking, and reliable. You create lasting foundations.',
  5: 'The Freedom Seeker - Adventurous, versatile, and dynamic. You embrace change and variety.',
  6: 'The Nurturer - Responsible, caring, and domestic. You support and protect others.',
  7: 'The Seeker - Analytical, introspective, and spiritual. You seek deeper truths.',
  8: 'The Achiever - Ambitious, authoritative, and successful. You manifest abundance.',
  9: 'The Humanitarian - Compassionate, generous, and wise. You serve the greater good.',
  11: 'The Intuitive - Visionary, inspirational, and enlightened. You channel higher wisdom.',
  22: 'The Master Builder - Powerful, practical visionary. You turn dreams into reality.',
  33: 'The Master Teacher - Selfless, nurturing, and spiritually evolved. You uplift humanity.',
};

/**
 * Meanings for expression numbers
 */
const EXPRESSION_MEANINGS: Record<number, string> = {
  1: 'Natural leader with original ideas and strong willpower.',
  2: 'Peacemaker with excellent diplomatic and cooperative abilities.',
  3: 'Creative communicator with artistic talents and social charm.',
  4: 'Practical organizer with strong work ethic and attention to detail.',
  5: 'Versatile adventurer with adaptability and love of freedom.',
  6: 'Responsible caretaker with nurturing and harmonious nature.',
  7: 'Deep thinker with analytical mind and spiritual inclinations.',
  8: 'Ambitious achiever with business acumen and material success.',
  9: 'Compassionate humanitarian with broad perspective and wisdom.',
  11: 'Inspired visionary with heightened intuition and spiritual insight.',
  22: 'Master architect with ability to manifest grand visions.',
  33: 'Master healer with profound ability to uplift and teach others.',
};

/**
 * Meanings for soul urge numbers
 */
const SOUL_URGE_MEANINGS: Record<number, string> = {
  1: 'Deep desire for independence, leadership, and personal achievement.',
  2: 'Inner need for partnership, harmony, and emotional connection.',
  3: 'Soul craves creative expression, joy, and social interaction.',
  4: 'Heart desires stability, security, and tangible accomplishments.',
  5: 'Inner yearning for freedom, adventure, and new experiences.',
  6: 'Deep need to nurture, protect, and create harmony for others.',
  7: 'Soul seeks knowledge, solitude, and spiritual understanding.',
  8: 'Inner drive for success, recognition, and material abundance.',
  9: 'Heart desires to serve humanity and make a meaningful difference.',
  11: 'Soul craves spiritual enlightenment and inspiring others.',
  22: 'Inner need to build something of lasting significance.',
  33: 'Deep desire to heal, teach, and elevate human consciousness.',
};


/**
 * Reduces a number to a single digit (or master number)
 * 
 * @param num - The number to reduce
 * @param preserveMasterNumbers - Whether to preserve master numbers (11, 22, 33)
 * @returns The reduced number
 */
export function reduceToSingleDigit(num: number, preserveMasterNumbers: boolean = true): number {
  // Handle negative numbers
  num = Math.abs(num);
  
  while (num > 9) {
    // Check for master numbers before reducing
    if (preserveMasterNumbers && MASTER_NUMBERS.includes(num)) {
      return num;
    }
    
    // Sum the digits
    let sum = 0;
    while (num > 0) {
      sum += num % 10;
      num = Math.floor(num / 10);
    }
    num = sum;
  }
  
  return num;
}

/**
 * Calculates the Life Path Number from a birth date
 * 
 * @param birthDate - The birth date
 * @returns The Life Path Number
 */
export function calculateLifePathNumber(birthDate: Date): number {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  
  // Reduce each component separately first
  const reducedYear = reduceToSingleDigit(year);
  const reducedMonth = reduceToSingleDigit(month);
  const reducedDay = reduceToSingleDigit(day);
  
  // Sum and reduce the final result
  const sum = reducedYear + reducedMonth + reducedDay;
  return reduceToSingleDigit(sum);
}

/**
 * Calculates the Expression Number (Destiny Number) from a full name
 * Uses all letters in the name
 * 
 * @param fullName - The full name
 * @returns The Expression Number
 */
export function calculateExpressionNumber(fullName: string): number {
  const cleanName = fullName.toLowerCase().replace(/[^a-z]/g, '');
  
  let sum = 0;
  for (const letter of cleanName) {
    sum += LETTER_VALUES[letter] || 0;
  }
  
  return reduceToSingleDigit(sum);
}

/**
 * Calculates the Soul Urge Number (Heart's Desire) from a full name
 * Uses only vowels in the name
 * 
 * @param fullName - The full name
 * @returns The Soul Urge Number
 */
export function calculateSoulUrgeNumber(fullName: string): number {
  const cleanName = fullName.toLowerCase().replace(/[^a-z]/g, '');
  
  let sum = 0;
  for (const letter of cleanName) {
    if (VOWELS.includes(letter)) {
      sum += LETTER_VALUES[letter] || 0;
    }
  }
  
  return reduceToSingleDigit(sum);
}

/**
 * Calculates the Personality Number from a full name
 * Uses only consonants in the name
 * 
 * @param fullName - The full name
 * @returns The Personality Number
 */
export function calculatePersonalityNumber(fullName: string): number {
  const cleanName = fullName.toLowerCase().replace(/[^a-z]/g, '');
  
  let sum = 0;
  for (const letter of cleanName) {
    if (!VOWELS.includes(letter)) {
      sum += LETTER_VALUES[letter] || 0;
    }
  }
  
  return reduceToSingleDigit(sum);
}

/**
 * Calculates the Birthday Number from a birth date
 * Simply the day of birth reduced to a single digit
 * 
 * @param birthDate - The birth date
 * @returns The Birthday Number
 */
export function calculateBirthdayNumber(birthDate: Date): number {
  const day = birthDate.getDate();
  return reduceToSingleDigit(day, false); // Birthday number doesn't preserve master numbers
}

/**
 * Gets the meaning for a life path number
 * 
 * @param number - The life path number
 * @returns The meaning
 */
export function getLifePathMeaning(number: number): string {
  return LIFE_PATH_MEANINGS[number] || LIFE_PATH_MEANINGS[reduceToSingleDigit(number, false)];
}

/**
 * Gets the meaning for an expression number
 * 
 * @param number - The expression number
 * @returns The meaning
 */
export function getExpressionMeaning(number: number): string {
  return EXPRESSION_MEANINGS[number] || EXPRESSION_MEANINGS[reduceToSingleDigit(number, false)];
}

/**
 * Gets the meaning for a soul urge number
 * 
 * @param number - The soul urge number
 * @returns The meaning
 */
export function getSoulUrgeMeaning(number: number): string {
  return SOUL_URGE_MEANINGS[number] || SOUL_URGE_MEANINGS[reduceToSingleDigit(number, false)];
}

/**
 * Calculates complete numerology reading
 * 
 * @param fullName - The full name
 * @param birthDate - The birth date
 * @returns Complete numerology result
 */
export function calculateNumerology(fullName: string, birthDate: Date): NumerologyResult {
  const lifePathNumber = calculateLifePathNumber(birthDate);
  const expressionNumber = calculateExpressionNumber(fullName);
  const soulUrgeNumber = calculateSoulUrgeNumber(fullName);
  const personalityNumber = calculatePersonalityNumber(fullName);
  const birthdayNumber = calculateBirthdayNumber(birthDate);
  
  return {
    lifePathNumber,
    expressionNumber,
    soulUrgeNumber,
    personalityNumber,
    birthdayNumber,
    lifePathMeaning: getLifePathMeaning(lifePathNumber),
    expressionMeaning: getExpressionMeaning(expressionNumber),
    soulUrgeMeaning: getSoulUrgeMeaning(soulUrgeNumber),
  };
}
