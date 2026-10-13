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
  1: 'Lederen – selvstendig, ambisiøs og nyskapende. Du er skapt til å lede og fornye.',
  2: 'Meklerne – diplomatisk, samarbeidsvillig og følsom. Du skaper harmoni og balanse.',
  3: 'Kommunikatoren – kreativ, uttrykksfull og sosial. Du inspirerer andre med ordene dine.',
  4: 'Byggeren – praktisk, arbeidsom og pålitelig. Du skaper varige fundamenter.',
  5: 'Frihetssøkeren – eventyrlysten, allsidig og dynamisk. Du omfavner forandring og variasjon.',
  6: 'Omsorgspersonen – ansvarsfull, omsorgsfull og hjemmekjær. Du støtter og beskytter andre.',
  7: 'Søkeren – analytisk, selvransakende og åndelig. Du søker dypere sannheter.',
  8: 'Prestasjonsmennesket – ambisiøs, autoritativ og vellykket. Du skaper overflod.',
  9: 'Humanisten – medfølende, raus og klok. Du tjener det felles beste.',
  11: 'Den intuitive – visjonær, inspirerende og opplyst. Du kanaliserer høyere visdom.',
  22: 'Mesterbyggeren – kraftfull, praktisk visjonær. Du gjør drømmer til virkelighet.',
  33: 'Mesterlæreren – uselvisk, omsorgsfull og åndelig moden. Du løfter menneskeheten.',
};

/**
 * Meanings for expression numbers
 */
const EXPRESSION_MEANINGS: Record<number, string> = {
  1: 'Naturlig leder med originale ideer og sterk viljestyrke.',
  2: 'Fredsmegler med gode diplomatiske og samarbeidsmessige evner.',
  3: 'Kreativ kommunikator med kunstneriske talenter og sosial sjarm.',
  4: 'Praktisk organisator med sterk arbeidsmoral og sans for detaljer.',
  5: 'Allsidig eventyrer som er tilpasningsdyktig og elsker frihet.',
  6: 'Ansvarsfull omsorgsperson med et harmonisk og omsorgsfullt vesen.',
  7: 'Dyp tenker med analytisk sinn og åndelig legning.',
  8: 'Ambisiøs prestasjonsmenneske med forretningssans og materiell suksess.',
  9: 'Medfølende humanist med vid horisont og visdom.',
  11: 'Inspirert visjonær med skjerpet intuisjon og åndelig innsikt.',
  22: 'Mesterarkitekt med evne til å virkeliggjøre store visjoner.',
  33: 'Mesterhelbreder med dyp evne til å løfte og lære opp andre.',
};

/**
 * Meanings for soul urge numbers
 */
const SOUL_URGE_MEANINGS: Record<number, string> = {
  1: 'Sterkt ønske om uavhengighet, lederskap og personlige prestasjoner.',
  2: 'Indre behov for partnerskap, harmoni og følelsesmessig tilknytning.',
  3: 'Sjelen higer etter kreativt uttrykk, glede og sosialt samvær.',
  4: 'Hjertet ønsker stabilitet, trygghet og håndfaste resultater.',
  5: 'Indre lengsel etter frihet, eventyr og nye opplevelser.',
  6: 'Dypt behov for å ta vare på, beskytte og skape harmoni for andre.',
  7: 'Sjelen søker kunnskap, ensomhet og åndelig forståelse.',
  8: 'Indre drivkraft mot suksess, anerkjennelse og materiell overflod.',
  9: 'Hjertet ønsker å tjene menneskeheten og gjøre en meningsfull forskjell.',
  11: 'Sjelen higer etter åndelig oppvåkning og å inspirere andre.',
  22: 'Indre behov for å bygge noe av varig betydning.',
  33: 'Dypt ønske om å hele, lære bort og løfte menneskers bevissthet.',
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
