/**
 * Stjernetegn-kalkulator
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
    name: 'Væren',
    symbol: '♈',
    emoji: '🐏',
    element: 'fire',
    modality: 'cardinal',
    rulingPlanet: 'Mars',
    dateRange: '21. mars – 19. april',
    traits: ['Modig', 'Bestemt', 'Selvsikker', 'Entusiastisk', 'Optimistisk'],
    strengths: ['Lederskap', 'Initiativ', 'Lidenskap'],
    weaknesses: ['Utålmodighet', 'Impulsivitet', 'Kort lunte'],
    compatibility: ['leo', 'sagittarius', 'gemini', 'aquarius'],
  },
  taurus: {
    name: 'Tyren',
    symbol: '♉',
    emoji: '🐂',
    element: 'earth',
    modality: 'fixed',
    rulingPlanet: 'Venus',
    dateRange: '20. april – 20. mai',
    traits: ['Pålitelig', 'Tålmodig', 'Praktisk', 'Hengiven', 'Ansvarsfull'],
    strengths: ['Pålitelighet', 'Utholdenhet', 'Lojalitet'],
    weaknesses: ['Sta', 'Eiesyke', 'Lite kompromissvillig'],
    compatibility: ['virgo', 'capricorn', 'cancer', 'pisces'],
  },
  gemini: {
    name: 'Tvillingene',
    symbol: '♊',
    emoji: '👯',
    element: 'air',
    modality: 'mutable',
    rulingPlanet: 'Merkur',
    dateRange: '21. mai – 20. juni',
    traits: ['Mild', 'Kjærlig', 'Nysgjerrig', 'Tilpasningsdyktig', 'Rask til å lære'],
    strengths: ['Kommunikasjon', 'Allsidighet', 'Vidd'],
    weaknesses: ['Nervøsitet', 'Ustadighet', 'Ubesluttsomhet'],
    compatibility: ['libra', 'aquarius', 'aries', 'leo'],
  },
  cancer: {
    name: 'Krepsen',
    symbol: '♋',
    emoji: '🦀',
    element: 'water',
    modality: 'cardinal',
    rulingPlanet: 'Månen',
    dateRange: '21. juni – 22. juli',
    traits: ['Seig', 'Svært fantasifull', 'Lojal', 'Følsom', 'Medfølende'],
    strengths: ['Omsorgsfull', 'Intuisjon', 'Beskyttende'],
    weaknesses: ['Humørsvingninger', 'Pessimisme', 'Mistenksomhet'],
    compatibility: ['scorpio', 'pisces', 'taurus', 'virgo'],
  },
  leo: {
    name: 'Løven',
    symbol: '♌',
    emoji: '🦁',
    element: 'fire',
    modality: 'fixed',
    rulingPlanet: 'Solen',
    dateRange: '23. juli – 22. august',
    traits: ['Kreativ', 'Lidenskapelig', 'Raus', 'Varmhjertet', 'Munter'],
    strengths: ['Lederskap', 'Kreativitet', 'Raushet'],
    weaknesses: ['Arroganse', 'Sta', 'Selvsentrert'],
    compatibility: ['aries', 'sagittarius', 'gemini', 'libra'],
  },
  virgo: {
    name: 'Jomfruen',
    symbol: '♍',
    emoji: '👧',
    element: 'earth',
    modality: 'mutable',
    rulingPlanet: 'Merkur',
    dateRange: '23. august – 22. september',
    traits: ['Lojal', 'Analytisk', 'Snill', 'Arbeidsom', 'Praktisk'],
    strengths: ['Sans for detaljer', 'Organisering', 'Pålitelighet'],
    weaknesses: ['Sjenanse', 'Bekymring', 'Overkritisk'],
    compatibility: ['taurus', 'capricorn', 'cancer', 'scorpio'],
  },
  libra: {
    name: 'Vekten',
    symbol: '♎',
    emoji: '⚖️',
    element: 'air',
    modality: 'cardinal',
    rulingPlanet: 'Venus',
    dateRange: '23. september – 22. oktober',
    traits: ['Samarbeidsvillig', 'Diplomatisk', 'Elskverdig', 'Rettferdig', 'Sosial'],
    strengths: ['Diplomati', 'Balanse', 'Sjarm'],
    weaknesses: ['Ubesluttsomhet', 'Unngår konfrontasjoner', 'Selvmedlidenhet'],
    compatibility: ['gemini', 'aquarius', 'leo', 'sagittarius'],
  },
  scorpio: {
    name: 'Skorpionen',
    symbol: '♏',
    emoji: '🦂',
    element: 'water',
    modality: 'fixed',
    rulingPlanet: 'Pluto',
    dateRange: '23. oktober – 21. november',
    traits: ['Ressurssterk', 'Tapper', 'Lidenskapelig', 'Sta', 'Ekte venn'],
    strengths: ['Besluttsomhet', 'Lojalitet', 'Oppfinnsomhet'],
    weaknesses: ['Sjalusi', 'Hemmelighetsfull', 'Nag'],
    compatibility: ['cancer', 'pisces', 'virgo', 'capricorn'],
  },
  sagittarius: {
    name: 'Skytten',
    symbol: '♐',
    emoji: '🏹',
    element: 'fire',
    modality: 'mutable',
    rulingPlanet: 'Jupiter',
    dateRange: '22. november – 21. desember',
    traits: ['Raus', 'Idealistisk', 'Stor humoristisk sans', 'Eventyrlysten'],
    strengths: ['Optimisme', 'Frihetselskende', 'Ærlighet'],
    weaknesses: ['Utålmodighet', 'Mangler takt', 'Overmodig'],
    compatibility: ['aries', 'leo', 'libra', 'aquarius'],
  },
  capricorn: {
    name: 'Steinbukken',
    symbol: '♑',
    emoji: '🐐',
    element: 'earth',
    modality: 'cardinal',
    rulingPlanet: 'Saturn',
    dateRange: '22. desember – 19. januar',
    traits: ['Ansvarsfull', 'Disiplinert', 'Selvkontroll', 'Gode ledere'],
    strengths: ['Ambisjoner', 'Utholdenhet', 'Praktisk sans'],
    weaknesses: ['Vet best selv', 'Ettertraktende', 'Nedlatende'],
    compatibility: ['taurus', 'virgo', 'scorpio', 'pisces'],
  },
  aquarius: {
    name: 'Vannmannen',
    symbol: '♒',
    emoji: '🏺',
    element: 'air',
    modality: 'fixed',
    rulingPlanet: 'Uranus',
    dateRange: '20. januar – 18. februar',
    traits: ['Fremtidsrettet', 'Original', 'Selvstendig', 'Humanitær'],
    strengths: ['Innovasjon', 'Humanisme', 'Uavhengighet'],
    weaknesses: ['Følelsesmessig avstand', 'Temperamentsfull', 'Lite kompromissvillig'],
    compatibility: ['gemini', 'libra', 'aries', 'sagittarius'],
  },
  pisces: {
    name: 'Fiskene',
    symbol: '♓',
    emoji: '🐟',
    element: 'water',
    modality: 'mutable',
    rulingPlanet: 'Neptun',
    dateRange: '19. februar – 20. mars',
    traits: ['Medfølende', 'Kunstnerisk', 'Intuitiv', 'Mild', 'Klok'],
    strengths: ['Empati', 'Kreativitet', 'Intuisjon'],
    weaknesses: ['Frykt', 'For godtroende', 'Virkelighetsflukt'],
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
      description: 'Samme tegn – dere forstår hverandre godt, men kan kollidere på lignende trekk.',
    };
  }
  
  // Both compatible with each other
  if (sign1Compatible && sign2Compatible) {
    return {
      score: 95,
      description: 'Utmerket match! Dere utfyller hverandre godt.',
    };
  }
  
  // One-way compatibility
  if (sign1Compatible || sign2Compatible) {
    return {
      score: 70,
      description: 'Godt potensial! Med innsats kan dette bli et givende forhold.',
    };
  }
  
  // Same element
  if (info1.element === info2.element) {
    return {
      score: 80,
      description: 'Samme element – naturlig forståelse og felles verdier.',
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
      description: 'Utfyllende elementer – dere kan balansere hverandre godt.',
    };
  }
  
  // Default - challenging but possible
  return {
    score: 45,
    description: 'Utfordrende match – krever forståelse og kompromisser.',
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
