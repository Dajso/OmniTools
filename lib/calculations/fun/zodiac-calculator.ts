/**
 * Zodiac Sign Calculator
 * 
 * Calculates the zodiac sign based on birth date and provides
 * basic horoscope information.
 * 
 * Requirements: 19.3
 */

/**
 * Zodiac sign names
 */
export type ZodiacSign =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

/**
 * Element types
 */
export type Element = 'fire' | 'earth' | 'air' | 'water';

/**
 * Modality types
 */
export type Modality = 'cardinal' | 'fixed' | 'mutable';

/**
 * Complete zodiac sign information
 */
export interface ZodiacInfo {
  sign: ZodiacSign;
  name: string;
  symbol: string;
  emoji: string;
  element: Element;
  modality: Modality;
  rulingPlanet: string;
  dateRange: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  compatibility: ZodiacSign[];
}

/**
 * Date range for each zodiac sign (month, day)
 */
interface DateRange {
  start: { month: number; day: number };
  end: { month: number; day: number };
}

/**
 * Zodiac sign date ranges
 */
const ZODIAC_DATES: Record<ZodiacSign, DateRange> = {
  aries: { start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
  taurus: { start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
  gemini: { start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
  cancer: { start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
  leo: { start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
  virgo: { start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
  libra: { start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
  scorpio: { start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
  sagittarius: { start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },
  capricorn: { start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
  aquarius: { start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
  pisces: { start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
};


/**
 * Complete zodiac sign data
 */
const ZODIAC_DATA: Record<ZodiacSign, Omit<ZodiacInfo, 'sign'>> = {
  aries: {
    name: 'Aries',
    symbol: '♈',
    emoji: '🐏',
    element: 'fire',
    modality: 'cardinal',
    rulingPlanet: 'Mars',
    dateRange: 'March 21 - April 19',
    traits: ['Courageous', 'Determined', 'Confident', 'Enthusiastic', 'Optimistic'],
    strengths: ['Leadership', 'Initiative', 'Passion'],
    weaknesses: ['Impatience', 'Impulsiveness', 'Short temper'],
    compatibility: ['leo', 'sagittarius', 'gemini', 'aquarius'],
  },
  taurus: {
    name: 'Taurus',
    symbol: '♉',
    emoji: '🐂',
    element: 'earth',
    modality: 'fixed',
    rulingPlanet: 'Venus',
    dateRange: 'April 20 - May 20',
    traits: ['Reliable', 'Patient', 'Practical', 'Devoted', 'Responsible'],
    strengths: ['Dependability', 'Persistence', 'Loyalty'],
    weaknesses: ['Stubbornness', 'Possessiveness', 'Uncompromising'],
    compatibility: ['virgo', 'capricorn', 'cancer', 'pisces'],
  },
  gemini: {
    name: 'Gemini',
    symbol: '♊',
    emoji: '👯',
    element: 'air',
    modality: 'mutable',
    rulingPlanet: 'Mercury',
    dateRange: 'May 21 - June 20',
    traits: ['Gentle', 'Affectionate', 'Curious', 'Adaptable', 'Quick learner'],
    strengths: ['Communication', 'Versatility', 'Wit'],
    weaknesses: ['Nervousness', 'Inconsistency', 'Indecisiveness'],
    compatibility: ['libra', 'aquarius', 'aries', 'leo'],
  },
  cancer: {
    name: 'Cancer',
    symbol: '♋',
    emoji: '🦀',
    element: 'water',
    modality: 'cardinal',
    rulingPlanet: 'Moon',
    dateRange: 'June 21 - July 22',
    traits: ['Tenacious', 'Highly imaginative', 'Loyal', 'Emotional', 'Sympathetic'],
    strengths: ['Nurturing', 'Intuition', 'Protectiveness'],
    weaknesses: ['Moodiness', 'Pessimism', 'Suspiciousness'],
    compatibility: ['scorpio', 'pisces', 'taurus', 'virgo'],
  },
  leo: {
    name: 'Leo',
    symbol: '♌',
    emoji: '🦁',
    element: 'fire',
    modality: 'fixed',
    rulingPlanet: 'Sun',
    dateRange: 'July 23 - August 22',
    traits: ['Creative', 'Passionate', 'Generous', 'Warm-hearted', 'Cheerful'],
    strengths: ['Leadership', 'Creativity', 'Generosity'],
    weaknesses: ['Arrogance', 'Stubbornness', 'Self-centeredness'],
    compatibility: ['aries', 'sagittarius', 'gemini', 'libra'],
  },
  virgo: {
    name: 'Virgo',
    symbol: '♍',
    emoji: '👧',
    element: 'earth',
    modality: 'mutable',
    rulingPlanet: 'Mercury',
    dateRange: 'August 23 - September 22',
    traits: ['Loyal', 'Analytical', 'Kind', 'Hardworking', 'Practical'],
    strengths: ['Attention to detail', 'Organization', 'Reliability'],
    weaknesses: ['Shyness', 'Worry', 'Overcritical'],
    compatibility: ['taurus', 'capricorn', 'cancer', 'scorpio'],
  },
  libra: {
    name: 'Libra',
    symbol: '♎',
    emoji: '⚖️',
    element: 'air',
    modality: 'cardinal',
    rulingPlanet: 'Venus',
    dateRange: 'September 23 - October 22',
    traits: ['Cooperative', 'Diplomatic', 'Gracious', 'Fair-minded', 'Social'],
    strengths: ['Diplomacy', 'Balance', 'Charm'],
    weaknesses: ['Indecisiveness', 'Avoidance of confrontation', 'Self-pity'],
    compatibility: ['gemini', 'aquarius', 'leo', 'sagittarius'],
  },
  scorpio: {
    name: 'Scorpio',
    symbol: '♏',
    emoji: '🦂',
    element: 'water',
    modality: 'fixed',
    rulingPlanet: 'Pluto',
    dateRange: 'October 23 - November 21',
    traits: ['Resourceful', 'Brave', 'Passionate', 'Stubborn', 'True friend'],
    strengths: ['Determination', 'Loyalty', 'Resourcefulness'],
    weaknesses: ['Jealousy', 'Secretiveness', 'Resentfulness'],
    compatibility: ['cancer', 'pisces', 'virgo', 'capricorn'],
  },
  sagittarius: {
    name: 'Sagittarius',
    symbol: '♐',
    emoji: '🏹',
    element: 'fire',
    modality: 'mutable',
    rulingPlanet: 'Jupiter',
    dateRange: 'November 22 - December 21',
    traits: ['Generous', 'Idealistic', 'Great sense of humor', 'Adventurous'],
    strengths: ['Optimism', 'Freedom-loving', 'Honesty'],
    weaknesses: ['Impatience', 'Tactlessness', 'Overconfidence'],
    compatibility: ['aries', 'leo', 'libra', 'aquarius'],
  },
  capricorn: {
    name: 'Capricorn',
    symbol: '♑',
    emoji: '🐐',
    element: 'earth',
    modality: 'cardinal',
    rulingPlanet: 'Saturn',
    dateRange: 'December 22 - January 19',
    traits: ['Responsible', 'Disciplined', 'Self-control', 'Good managers'],
    strengths: ['Ambition', 'Persistence', 'Practicality'],
    weaknesses: ['Know-it-all', 'Unforgiving', 'Condescending'],
    compatibility: ['taurus', 'virgo', 'scorpio', 'pisces'],
  },
  aquarius: {
    name: 'Aquarius',
    symbol: '♒',
    emoji: '🏺',
    element: 'air',
    modality: 'fixed',
    rulingPlanet: 'Uranus',
    dateRange: 'January 20 - February 18',
    traits: ['Progressive', 'Original', 'Independent', 'Humanitarian'],
    strengths: ['Innovation', 'Humanitarianism', 'Independence'],
    weaknesses: ['Emotional detachment', 'Temperamental', 'Uncompromising'],
    compatibility: ['gemini', 'libra', 'aries', 'sagittarius'],
  },
  pisces: {
    name: 'Pisces',
    symbol: '♓',
    emoji: '🐟',
    element: 'water',
    modality: 'mutable',
    rulingPlanet: 'Neptune',
    dateRange: 'February 19 - March 20',
    traits: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle', 'Wise'],
    strengths: ['Empathy', 'Creativity', 'Intuition'],
    weaknesses: ['Fearfulness', 'Overly trusting', 'Escapism'],
    compatibility: ['cancer', 'scorpio', 'taurus', 'capricorn'],
  },
};


/**
 * Determines the zodiac sign for a given birth date
 * 
 * @param birthDate - The birth date
 * @returns The zodiac sign
 */
export function getZodiacSign(birthDate: Date): ZodiacSign {
  const month = birthDate.getMonth() + 1; // JavaScript months are 0-indexed
  const day = birthDate.getDate();
  
  // Check each sign's date range
  for (const [sign, range] of Object.entries(ZODIAC_DATES) as [ZodiacSign, DateRange][]) {
    const { start, end } = range;
    
    // Handle Capricorn which spans year boundary
    if (sign === 'capricorn') {
      if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
        return sign;
      }
      continue;
    }
    
    // Check if date falls within the range
    if (month === start.month && day >= start.day) {
      return sign;
    }
    if (month === end.month && day <= end.day) {
      return sign;
    }
  }
  
  // Default fallback (should never reach here with valid dates)
  return 'capricorn';
}

/**
 * Gets complete zodiac information for a birth date
 * 
 * @param birthDate - The birth date
 * @returns Complete zodiac sign information
 */
export function getZodiacInfo(birthDate: Date): ZodiacInfo {
  const sign = getZodiacSign(birthDate);
  return {
    sign,
    ...ZODIAC_DATA[sign],
  };
}

/**
 * Gets zodiac information by sign name
 * 
 * @param sign - The zodiac sign
 * @returns Complete zodiac sign information
 */
export function getZodiacInfoBySign(sign: ZodiacSign): ZodiacInfo {
  return {
    sign,
    ...ZODIAC_DATA[sign],
  };
}

/**
 * Checks compatibility between two zodiac signs
 * 
 * @param sign1 - First zodiac sign
 * @param sign2 - Second zodiac sign
 * @returns Compatibility score (0-100) and description
 */
export function checkCompatibility(
  sign1: ZodiacSign,
  sign2: ZodiacSign
): { score: number; description: string } {
  const info1 = ZODIAC_DATA[sign1];
  const info2 = ZODIAC_DATA[sign2];
  
  // Check if they're in each other's compatibility list
  const sign1Compatible = info1.compatibility.includes(sign2);
  const sign2Compatible = info2.compatibility.includes(sign1);
  
  // Same sign
  if (sign1 === sign2) {
    return {
      score: 75,
      description: 'Same sign - you understand each other well but may clash on similar traits.',
    };
  }
  
  // Both compatible with each other
  if (sign1Compatible && sign2Compatible) {
    return {
      score: 95,
      description: 'Excellent match! You complement each other beautifully.',
    };
  }
  
  // One-way compatibility
  if (sign1Compatible || sign2Compatible) {
    return {
      score: 70,
      description: 'Good potential! With effort, this can be a rewarding relationship.',
    };
  }
  
  // Same element
  if (info1.element === info2.element) {
    return {
      score: 80,
      description: 'Same element - natural understanding and shared values.',
    };
  }
  
  // Compatible elements (Fire-Air, Earth-Water)
  const compatibleElements: Record<Element, Element> = {
    fire: 'air',
    air: 'fire',
    earth: 'water',
    water: 'earth',
  };
  
  if (compatibleElements[info1.element] === info2.element) {
    return {
      score: 65,
      description: 'Complementary elements - you can balance each other well.',
    };
  }
  
  // Default - challenging but possible
  return {
    score: 45,
    description: 'Challenging match - requires understanding and compromise.',
  };
}

/**
 * Gets all zodiac signs
 * 
 * @returns Array of all zodiac signs with their info
 */
export function getAllZodiacSigns(): ZodiacInfo[] {
  const signs: ZodiacSign[] = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
  ];
  
  return signs.map((sign) => getZodiacInfoBySign(sign));
}
