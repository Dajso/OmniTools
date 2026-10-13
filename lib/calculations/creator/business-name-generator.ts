/**
 * Firmanavn-generator
 * Lager forslag til firmanavn ved å kombinere norske ord
 */

export interface BusinessNameConfig {
  industry: BusinessIndustry;
  style: NameStyle;
  keywords?: string[];
  count?: number;
}

export type BusinessIndustry = 
  | 'tech'
  | 'food'
  | 'fashion'
  | 'health'
  | 'finance'
  | 'creative'
  | 'consulting'
  | 'retail'
  | 'education'
  | 'general';

export type NameStyle = 
  | 'modern'
  | 'classic'
  | 'playful'
  | 'professional'
  | 'abstract';

export interface GeneratedName {
  name: string;
  style: string;
  available?: boolean; // For future domain check integration
}

// Ordlister per bransje (norske ord, med noen internasjonale innslag)
const INDUSTRY_WORDS: Record<BusinessIndustry, { prefixes: string[]; suffixes: string[]; roots: string[] }> = {
  tech: {
    prefixes: ['Digi', 'Data', 'Smart', 'Sky', 'Piksel', 'Kode', 'Nett', 'Fjord', 'Nord', 'Neo'],
    suffixes: ['Lab', 'Tek', 'Systemer', 'Løsninger', 'Logikk', 'Byte', 'Hub', 'Verksted', 'Soft', 'Nett'],
    roots: ['Nova', 'Puls', 'Flyt', 'Lenke', 'Kjerne', 'Bølge', 'Rutenett', 'Stabel', 'Synk', 'Gnist'],
  },
  food: {
    prefixes: ['Frisk', 'Gylden', 'Søt', 'Gårds', 'By', 'Høst', 'Kjøkken', 'Lokal', 'Smak', 'Nordisk'],
    suffixes: ['Kjøkken', 'Bit', 'Bord', 'Fest', 'Spiskammer', 'Tallerken', 'Bolle', 'Kafé', 'Deli', 'Stue'],
    roots: ['Krydder', 'Urt', 'Korn', 'Bær', 'Blad', 'Rot', 'Blomst', 'Lund', 'Hage', 'Eng'],
  },
  fashion: {
    prefixes: ['Lux', 'Chic', 'By', 'Moderne', 'Klassisk', 'Fløyel', 'Silke', 'Gylden', 'Kongelig', 'Ren'],
    suffixes: ['Stil', 'Tøy', 'Tråd', 'Atelier', 'Mote', 'Butikk', 'Kolleksjon', 'Label', 'Hus', 'Design'],
    roots: ['Noir', 'Blanc', 'Asur', 'Glør', 'Jade', 'Perle', 'Rubin', 'Onyx', 'Elfenben', 'Korall'],
  },
  health: {
    prefixes: ['Vital', 'Ren', 'Livs', 'Helse', 'Naturlig', 'Zen', 'Balanse', 'Harmoni', 'Glød', 'Fri'],
    suffixes: ['Omsorg', 'Helse', 'Velvære', 'Liv', 'Med', 'Terapi', 'Klinikk', 'Senter', 'Pluss', 'Pro'],
    roots: ['Vita', 'Aura', 'Blomst', 'Vekst', 'Fornyelse', 'Ro', 'Pust', 'Nær', 'Styrke', 'Glede'],
  },
  finance: {
    prefixes: ['Kapital', 'Prima', 'Topp', 'Tind', 'Tillit', 'Trygg', 'Global', 'Først', 'Elite', 'Nord'],
    suffixes: ['Kapital', 'Finans', 'Formue', 'Rådgivning', 'Partnere', 'Gruppen', 'Invest', 'Ventures', 'Fond', 'Trygg'],
    roots: ['Tind', 'Horisont', 'Meridian', 'Zenit', 'Krone', 'Anker', 'Fjell', 'Fyr', 'Kompass', 'Bro'],
  },
  creative: {
    prefixes: ['Kreativ', 'Lys', 'Dristig', 'Livlig', 'Gnist', 'Drøm', 'Visjon', 'Fantasi', 'Under', 'Magi'],
    suffixes: ['Studio', 'Kreativ', 'Design', 'Media', 'Kunst', 'Verksted', 'Lab', 'Hus', 'Kollektiv', 'Byrå'],
    roots: ['Piksel', 'Lerret', 'Prisme', 'Palett', 'Mosaikk', 'Skisse', 'Håndverk', 'Muse', 'Blekk', 'Ramme'],
  },
  consulting: {
    prefixes: ['Strategisk', 'Global', 'Ekspert', 'Pro', 'Elite', 'Prima', 'Kjerne', 'Nøkkel', 'Ledende', 'Trygg'],
    suffixes: ['Rådgivning', 'Partnere', 'Løsninger', 'Gruppen', 'Assosierte', 'Strategi', 'Innsikt', 'Tjenester', 'Byrå', 'Konsulent'],
    roots: ['Bro', 'Sti', 'Veiviser', 'Kompass', 'Fyrtårn', 'Katalysator', 'Knutepunkt', 'Dreiepunkt', 'Spak', 'Akse'],
  },
  retail: {
    prefixes: ['Butikk', 'Torg', 'Handel', 'Kjøp', 'Tilbud', 'Verdi', 'Beste', 'Topp', 'Smart', 'Rask'],
    suffixes: ['Mart', 'Butikk', 'Handel', 'Torg', 'Lager', 'Outlet', 'Hub', 'Sone', 'Sted', 'Punkt'],
    roots: ['Kurv', 'Boks', 'Hylle', 'Gang', 'Disk', 'Stativ', 'Utstilling', 'Lager', 'Vare', 'Forsyning'],
  },
  education: {
    prefixes: ['Lær', 'Edu', 'Smart', 'Lys', 'Akademi', 'Kunnskap', 'Sinn', 'Hjerne', 'Ferdighet', 'Viten'],
    suffixes: ['Akademi', 'Læring', 'Utdanning', 'Skole', 'Institutt', 'Hub', 'Senter', 'Lab', 'Sti', 'Reise'],
    roots: ['Mentor', 'Veileder', 'Guide', 'Coach', 'Vis', 'Lærd', 'Geni', 'Talent', 'Mester', 'Ekspert'],
  },
  general: {
    prefixes: ['Alfa', 'Beta', 'Nova', 'Prima', 'Kjerne', 'Topp', 'Apex', 'Zen', 'Flux', 'Vibe'],
    suffixes: ['Co', 'Gruppen', 'Hub', 'Verksted', 'Lab', 'Pro', 'Pluss', 'En', 'X', 'Nord'],
    roots: ['Gnist', 'Puls', 'Bølge', 'Flyt', 'Lenke', 'Synk', 'Blanding', 'Smelt', 'Fusjon', 'Forene'],
  },
};

// Stilmønstre
const STYLE_PATTERNS: Record<NameStyle, (words: typeof INDUSTRY_WORDS.tech) => string[]> = {
  modern: (words) => [
    `${randomFrom(words.roots)}${randomFrom(words.suffixes)}`,
    `${randomFrom(words.prefixes)}${randomFrom(words.roots)}`,
    `${randomFrom(words.roots)}ly`,
    `${randomFrom(words.roots)}io`,
    `${randomFrom(words.roots)}ify`,
  ],
  classic: (words) => [
    `${randomFrom(words.prefixes)} ${randomFrom(words.suffixes)}`,
    `${randomFrom(words.prefixes)} & ${randomFrom(words.suffixes)}`,
    `${randomFrom(words.roots)} & Sønner`,
    `${randomFrom(words.roots)} ${randomFrom(words.suffixes)}`,
  ],
  playful: (words) => [
    `${randomFrom(words.roots)}bua`,
    `${randomFrom(words.prefixes)}ern ${randomFrom(words.roots)}`,
    `Lille ${randomFrom(words.roots)}`,
    `Glade ${randomFrom(words.roots)}`,
    `${randomFrom(words.roots)} & Co`,
  ],
  professional: (words) => [
    `${randomFrom(words.prefixes)} ${randomFrom(words.suffixes)} Gruppen`,
    `${randomFrom(words.roots)} ${randomFrom(words.suffixes)} Partnere`,
    `${randomFrom(words.prefixes)} ${randomFrom(words.roots)} AS`,
    `${randomFrom(words.roots)} ${randomFrom(words.suffixes)} AS`,
  ],
  abstract: (words) => [
    `${randomFrom(words.roots)}${randomFrom(['a', 'o', 'i', 'u'])}`,
    `${randomFrom(words.roots).slice(0, 3)}${randomFrom(words.roots).slice(-3)}`,
    `${randomFrom(words.prefixes).slice(0, 2)}${randomFrom(words.roots)}`,
    `${randomFrom(words.roots)}${randomFrom(['ex', 'ix', 'ax', 'ox'])}`,
  ],
};

/**
 * Get a random element from an array
 */
function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate business names based on configuration
 */
export function generateBusinessNames(config: BusinessNameConfig): GeneratedName[] {
  const { industry, style, keywords = [], count = 10 } = config;
  const words = INDUSTRY_WORDS[industry];
  const patterns = STYLE_PATTERNS[style];
  
  const names: GeneratedName[] = [];
  const usedNames = new Set<string>();

  // Add keyword-based names if keywords provided
  if (keywords.length > 0) {
    for (const keyword of keywords) {
      const keywordNames = generateKeywordNames(keyword, words, style);
      for (const name of keywordNames) {
        if (!usedNames.has(name.toLowerCase())) {
          names.push({ name, style: 'keyword-based' });
          usedNames.add(name.toLowerCase());
        }
      }
    }
  }

  // Generate pattern-based names
  let attempts = 0;
  while (names.length < count && attempts < count * 3) {
    const patternNames = patterns(words);
    const name = randomFrom(patternNames);
    
    if (!usedNames.has(name.toLowerCase())) {
      names.push({ name, style });
      usedNames.add(name.toLowerCase());
    }
    attempts++;
  }

  return names.slice(0, count);
}

/**
 * Generate names incorporating user keywords
 */
function generateKeywordNames(
  keyword: string,
  words: typeof INDUSTRY_WORDS.tech,
  style: NameStyle
): string[] {
  const capitalizedKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase();
  
  const patterns = [
    `${capitalizedKeyword} ${randomFrom(words.suffixes)}`,
    `${randomFrom(words.prefixes)} ${capitalizedKeyword}`,
    `${capitalizedKeyword}${randomFrom(words.suffixes)}`,
    `${capitalizedKeyword} & Co`,
    `${capitalizedKeyword} ${randomFrom(words.suffixes)} AS`,
  ];

  // Return 2-3 keyword-based names
  return patterns.slice(0, Math.floor(Math.random() * 2) + 2);
}

/**
 * Check if a name is available as a domain (placeholder for future API integration)
 */
export async function checkDomainAvailability(name: string): Promise<boolean> {
  // This would integrate with a domain availability API
  // For now, return a random result for demonstration
  return Math.random() > 0.5;
}

/**
 * Format name for domain suggestion
 */
export function formatForDomain(name: string): string {
  return name
    .toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 63); // Max domain length
}

/**
 * Get industry options for UI
 */
export const INDUSTRY_OPTIONS: { value: BusinessIndustry; label: string }[] = [
  { value: 'tech', label: 'Teknologi' },
  { value: 'food', label: 'Mat og restaurant' },
  { value: 'fashion', label: 'Mote og klær' },
  { value: 'health', label: 'Helse og velvære' },
  { value: 'finance', label: 'Finans og bank' },
  { value: 'creative', label: 'Kreativt og design' },
  { value: 'consulting', label: 'Rådgivning' },
  { value: 'retail', label: 'Butikk og netthandel' },
  { value: 'education', label: 'Utdanning' },
  { value: 'general', label: 'Generelt / annet' },
];

/**
 * Get style options for UI
 */
export const STYLE_OPTIONS: { value: NameStyle; label: string; description: string }[] = [
  { value: 'modern', label: 'Moderne', description: 'Rene, tidsriktige navn' },
  { value: 'classic', label: 'Klassisk', description: 'Tradisjonell og veletablert følelse' },
  { value: 'playful', label: 'Leken', description: 'Morsomme og tilgjengelige navn' },
  { value: 'professional', label: 'Profesjonell', description: 'Seriøst og tillitvekkende' },
  { value: 'abstract', label: 'Abstrakt', description: 'Unike, oppfunne ord' },
];
