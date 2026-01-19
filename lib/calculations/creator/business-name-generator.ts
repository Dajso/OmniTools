/**
 * Business Name Generator
 * Generates creative business name suggestions using word combinations
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

// Word pools for different industries
const INDUSTRY_WORDS: Record<BusinessIndustry, { prefixes: string[]; suffixes: string[]; roots: string[] }> = {
  tech: {
    prefixes: ['Cyber', 'Tech', 'Digital', 'Cloud', 'Data', 'Smart', 'Quantum', 'Neo', 'Pixel', 'Code'],
    suffixes: ['Labs', 'Tech', 'Systems', 'Solutions', 'Logic', 'Byte', 'Hub', 'Works', 'Soft', 'Net'],
    roots: ['Nova', 'Apex', 'Sync', 'Flow', 'Link', 'Core', 'Pulse', 'Wave', 'Grid', 'Stack'],
  },
  food: {
    prefixes: ['Fresh', 'Golden', 'Sweet', 'Savory', 'Urban', 'Farm', 'Harvest', 'Artisan', 'Gourmet', 'Local'],
    suffixes: ['Kitchen', 'Bites', 'Eats', 'Table', 'Feast', 'Pantry', 'Plate', 'Bowl', 'Cafe', 'Deli'],
    roots: ['Spice', 'Herb', 'Grain', 'Berry', 'Leaf', 'Root', 'Bloom', 'Grove', 'Garden', 'Meadow'],
  },
  fashion: {
    prefixes: ['Luxe', 'Chic', 'Urban', 'Modern', 'Classic', 'Velvet', 'Silk', 'Golden', 'Royal', 'Pure'],
    suffixes: ['Style', 'Wear', 'Threads', 'Couture', 'Attire', 'Fashion', 'Boutique', 'Collection', 'Label', 'House'],
    roots: ['Noir', 'Blanc', 'Azure', 'Ember', 'Jade', 'Pearl', 'Ruby', 'Onyx', 'Ivory', 'Coral'],
  },
  health: {
    prefixes: ['Vital', 'Pure', 'Wellness', 'Life', 'Health', 'Natural', 'Zen', 'Balance', 'Harmony', 'Glow'],
    suffixes: ['Care', 'Health', 'Wellness', 'Life', 'Med', 'Therapy', 'Clinic', 'Center', 'Plus', 'Pro'],
    roots: ['Vita', 'Aura', 'Bloom', 'Thrive', 'Renew', 'Restore', 'Revive', 'Nurture', 'Heal', 'Grow'],
  },
  finance: {
    prefixes: ['Capital', 'Prime', 'Summit', 'Peak', 'Trust', 'Secure', 'Global', 'First', 'Elite', 'Premier'],
    suffixes: ['Capital', 'Finance', 'Wealth', 'Advisors', 'Partners', 'Group', 'Holdings', 'Ventures', 'Fund', 'Trust'],
    roots: ['Apex', 'Pinnacle', 'Horizon', 'Meridian', 'Zenith', 'Vertex', 'Crest', 'Summit', 'Crown', 'Anchor'],
  },
  creative: {
    prefixes: ['Creative', 'Bright', 'Bold', 'Vivid', 'Spark', 'Dream', 'Vision', 'Imagine', 'Wonder', 'Magic'],
    suffixes: ['Studio', 'Creative', 'Design', 'Media', 'Arts', 'Works', 'Lab', 'House', 'Co', 'Collective'],
    roots: ['Pixel', 'Canvas', 'Prism', 'Palette', 'Mosaic', 'Sketch', 'Craft', 'Muse', 'Ink', 'Frame'],
  },
  consulting: {
    prefixes: ['Strategic', 'Global', 'Premier', 'Expert', 'Pro', 'Elite', 'Prime', 'Core', 'Key', 'Lead'],
    suffixes: ['Consulting', 'Advisors', 'Partners', 'Solutions', 'Group', 'Associates', 'Strategies', 'Insights', 'Services', 'Agency'],
    roots: ['Bridge', 'Path', 'Guide', 'Compass', 'Beacon', 'Catalyst', 'Nexus', 'Pivot', 'Lever', 'Axis'],
  },
  retail: {
    prefixes: ['Shop', 'Market', 'Store', 'Buy', 'Deal', 'Value', 'Best', 'Top', 'Smart', 'Quick'],
    suffixes: ['Mart', 'Shop', 'Store', 'Market', 'Depot', 'Outlet', 'Hub', 'Zone', 'Place', 'Spot'],
    roots: ['Cart', 'Basket', 'Box', 'Shelf', 'Aisle', 'Counter', 'Rack', 'Display', 'Stock', 'Supply'],
  },
  education: {
    prefixes: ['Learn', 'Edu', 'Smart', 'Bright', 'Academy', 'Scholar', 'Mind', 'Brain', 'Skill', 'Know'],
    suffixes: ['Academy', 'Learning', 'Education', 'School', 'Institute', 'Hub', 'Center', 'Lab', 'Path', 'Quest'],
    roots: ['Mentor', 'Tutor', 'Guide', 'Coach', 'Sage', 'Scholar', 'Genius', 'Prodigy', 'Maven', 'Expert'],
  },
  general: {
    prefixes: ['Alpha', 'Beta', 'Nova', 'Prime', 'Core', 'Peak', 'Apex', 'Zen', 'Flux', 'Vibe'],
    suffixes: ['Co', 'Inc', 'Group', 'Hub', 'Works', 'Labs', 'Pro', 'Plus', 'One', 'X'],
    roots: ['Spark', 'Pulse', 'Wave', 'Flow', 'Link', 'Sync', 'Blend', 'Fuse', 'Merge', 'Unite'],
  },
};

// Style modifiers
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
    `The ${randomFrom(words.prefixes)} ${randomFrom(words.suffixes)}`,
    `${randomFrom(words.roots)} ${randomFrom(words.suffixes)}`,
  ],
  playful: (words) => [
    `${randomFrom(words.roots)}ster`,
    `${randomFrom(words.prefixes)}y ${randomFrom(words.roots)}`,
    `Little ${randomFrom(words.roots)}`,
    `Happy ${randomFrom(words.roots)}`,
    `${randomFrom(words.roots)} & Co`,
  ],
  professional: (words) => [
    `${randomFrom(words.prefixes)} ${randomFrom(words.suffixes)} Group`,
    `${randomFrom(words.roots)} ${randomFrom(words.suffixes)} Partners`,
    `${randomFrom(words.prefixes)} ${randomFrom(words.roots)} Associates`,
    `${randomFrom(words.roots)} Professional ${randomFrom(words.suffixes)}`,
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
    `The ${capitalizedKeyword} ${randomFrom(words.suffixes)}`,
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
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 63); // Max domain length
}

/**
 * Get industry options for UI
 */
export const INDUSTRY_OPTIONS: { value: BusinessIndustry; label: string }[] = [
  { value: 'tech', label: 'Technology' },
  { value: 'food', label: 'Food & Restaurant' },
  { value: 'fashion', label: 'Fashion & Apparel' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'creative', label: 'Creative & Design' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'education', label: 'Education' },
  { value: 'general', label: 'General / Other' },
];

/**
 * Get style options for UI
 */
export const STYLE_OPTIONS: { value: NameStyle; label: string; description: string }[] = [
  { value: 'modern', label: 'Modern', description: 'Clean, tech-forward names' },
  { value: 'classic', label: 'Classic', description: 'Traditional, established feel' },
  { value: 'playful', label: 'Playful', description: 'Fun, approachable names' },
  { value: 'professional', label: 'Professional', description: 'Corporate, trustworthy' },
  { value: 'abstract', label: 'Abstract', description: 'Unique, invented words' },
];
