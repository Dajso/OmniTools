/**
 * Tavern Generator
 * 
 * Generates random taverns with names, menus, and NPCs for tabletop RPGs.
 * 
 * @module lib/calculations/rpg/tavern-generator
 * @see Requirements 21.9
 */

import { generateTavernName } from './name-generator';

/**
 * Tavern quality levels
 */
export type TavernQuality = 'squalid' | 'poor' | 'modest' | 'comfortable' | 'wealthy' | 'aristocratic';

/**
 * NPC role in the tavern
 */
export type NPCRole = 'owner' | 'bartender' | 'barmaid' | 'cook' | 'bouncer' | 'patron' | 'entertainer';

/**
 * Generated NPC
 */
export interface TavernNPC {
  name: string;
  role: NPCRole;
  race: string;
  description: string;
  quirk?: string;
}

/**
 * Menu item
 */
export interface MenuItem {
  name: string;
  description: string;
  price: number; // in copper pieces
  category: 'food' | 'drink' | 'special';
}

/**
 * Complete tavern
 */
export interface Tavern {
  name: string;
  quality: TavernQuality;
  description: string;
  atmosphere: string;
  npcs: TavernNPC[];
  menu: MenuItem[];
  rumors: string[];
  specialFeature?: string;
}

// ============================================
// Data Tables
// ============================================

const NPC_FIRST_NAMES = {
  human: {
    male: ['Aldric', 'Bram', 'Cedric', 'Doran', 'Edmund', 'Finn', 'Gareth', 'Hugo', 'Ivan', 'Jasper'],
    female: ['Alara', 'Brynn', 'Clara', 'Delia', 'Elena', 'Fiona', 'Greta', 'Helena', 'Iris', 'Julia'],
  },
  dwarf: {
    male: ['Balin', 'Dain', 'Farin', 'Gimli', 'Kili', 'Nori', 'Oin', 'Thorin', 'Bombur', 'Gloin'],
    female: ['Dis', 'Hilda', 'Kira', 'Mira', 'Nala', 'Rika', 'Sigrid', 'Thora', 'Ulla', 'Vera'],
  },
  elf: {
    male: ['Aelindor', 'Caelum', 'Elrond', 'Faelar', 'Galion', 'Ithildir', 'Legolas', 'Maelon', 'Naeris', 'Thranduil'],
    female: ['Arwen', 'Celebrian', 'Elanor', 'Galadriel', 'Idril', 'Luthien', 'Miriel', 'Nimrodel', 'Silwen', 'Tauriel'],
  },
  halfling: {
    male: ['Bilbo', 'Drogo', 'Frodo', 'Hamfast', 'Lotho', 'Merry', 'Pippin', 'Samwise', 'Tolman', 'Wilcome'],
    female: ['Belladonna', 'Daisy', 'Eglantine', 'Lily', 'Marigold', 'Pearl', 'Primula', 'Rose', 'Tansy', 'Violet'],
  },
};

const NPC_RACES = ['human', 'dwarf', 'elf', 'halfling'] as const;

const NPC_QUIRKS = [
  'constantly polishes glasses',
  'tells the same joke to everyone',
  'has a pet rat on their shoulder',
  'speaks in rhymes when nervous',
  'collects unusual coins',
  'always seems to know your name',
  'laughs at inappropriate times',
  'whispers secrets to themselves',
  'has an impressive scar',
  'never makes eye contact',
  'hums while working',
  'has a thick foreign accent',
  'is missing several teeth',
  'wears mismatched shoes',
  'constantly snacking',
];

const NPC_DESCRIPTIONS = {
  owner: [
    'A shrewd businessperson with a keen eye for profit',
    'A retired adventurer who settled down',
    'A former noble who fell on hard times',
    'A cheerful soul who loves meeting travelers',
    'A gruff veteran with stories to tell',
  ],
  bartender: [
    'Quick with a drink and quicker with advice',
    'Silent and observant, missing nothing',
    'Friendly and chatty, knows everyone',
    'Stern but fair, keeps order at the bar',
    'Young and eager to please',
  ],
  barmaid: [
    'Efficient and professional',
    'Flirtatious but sharp-witted',
    'Quiet and observant',
    'Cheerful and energetic',
    'Tired but kind',
  ],
  cook: [
    'A culinary artist with secret recipes',
    'Grumpy but talented',
    'Experimental with unusual ingredients',
    'Traditional and reliable',
    'Former ship\'s cook with exotic dishes',
  ],
  bouncer: [
    'Massive and intimidating',
    'Surprisingly gentle until provoked',
    'Former soldier with a stern demeanor',
    'Quick and agile despite their size',
    'Covered in tattoos and scars',
  ],
  patron: [
    'A mysterious stranger in a dark corner',
    'A loud merchant celebrating a deal',
    'A weary traveler seeking rest',
    'A local regular nursing their drink',
    'A group of off-duty guards',
  ],
  entertainer: [
    'A talented bard with a silver tongue',
    'A juggler and acrobat',
    'A storyteller with ancient tales',
    'A musician with a haunting voice',
    'A comedian with biting wit',
  ],
};

const ATMOSPHERES = [
  'Warm and inviting, with a crackling fireplace',
  'Rowdy and loud, filled with laughter',
  'Quiet and mysterious, with hushed conversations',
  'Smoky and dim, with flickering candles',
  'Clean and well-lit, surprisingly pleasant',
  'Cramped but cozy, every table full',
  'Spacious and airy, with high ceilings',
  'Rustic and homey, like a country kitchen',
];

const SPECIAL_FEATURES = [
  'A secret room behind the fireplace',
  'A fighting pit in the basement',
  'A resident ghost who helps clean',
  'A magical jukebox that plays requests',
  'A portal to another tavern in a distant city',
  'A collection of adventurer trophies on the walls',
  'A wishing well in the courtyard',
  'An underground hot spring bath',
  'A rooftop garden with rare herbs',
  'A library of ancient tomes',
];

const RUMORS = [
  'They say the old mine has reopened, but no one who enters returns.',
  'The baron\'s daughter has gone missing again.',
  'Strange lights have been seen in the forest at night.',
  'A dragon was spotted flying over the mountains.',
  'The harvest festival is coming, and there\'s a prize for the best pie.',
  'Bandits have been attacking caravans on the north road.',
  'The temple is looking for adventurers to clear out their catacombs.',
  'A merchant is paying good gold for rare herbs.',
  'The blacksmith\'s apprentice found something strange in the river.',
  'War is brewing in the eastern kingdoms.',
  'A famous bard is coming to town next week.',
  'The mayor has been acting strangely lately.',
  'Someone broke into the wizard\'s tower last night.',
  'The fishing boats have been catching strange creatures.',
  'A new cult has been recruiting in the slums.',
];

const FOOD_ITEMS: MenuItem[] = [
  { name: 'Bread and Cheese', description: 'Fresh bread with local cheese', price: 5, category: 'food' },
  { name: 'Meat Pie', description: 'Hearty pie filled with seasoned meat', price: 15, category: 'food' },
  { name: 'Roast Chicken', description: 'Half a chicken with vegetables', price: 25, category: 'food' },
  { name: 'Fish Stew', description: 'Thick stew with fresh catch', price: 20, category: 'food' },
  { name: 'Vegetable Soup', description: 'Warm soup with seasonal vegetables', price: 8, category: 'food' },
  { name: 'Roast Boar', description: 'Slow-roasted wild boar', price: 50, category: 'food' },
  { name: 'Shepherd\'s Pie', description: 'Lamb and potato casserole', price: 18, category: 'food' },
  { name: 'Cheese Platter', description: 'Selection of local cheeses', price: 12, category: 'food' },
];

const DRINK_ITEMS: MenuItem[] = [
  { name: 'Ale', description: 'Local brew, served cold', price: 4, category: 'drink' },
  { name: 'Mead', description: 'Sweet honey wine', price: 8, category: 'drink' },
  { name: 'Wine', description: 'Red or white, your choice', price: 10, category: 'drink' },
  { name: 'Cider', description: 'Crisp apple cider', price: 5, category: 'drink' },
  { name: 'Dwarven Stout', description: 'Strong and dark', price: 12, category: 'drink' },
  { name: 'Elven Wine', description: 'Light and fragrant', price: 25, category: 'drink' },
  { name: 'Firewhiskey', description: 'Burns going down', price: 15, category: 'drink' },
  { name: 'Water', description: 'Clean spring water', price: 1, category: 'drink' },
];

const SPECIAL_ITEMS: MenuItem[] = [
  { name: 'Dragon Pepper Steak', description: 'Extremely spicy, not for the faint', price: 75, category: 'special' },
  { name: 'Moonshine', description: 'Illegal but potent', price: 20, category: 'special' },
  { name: 'Healing Broth', description: 'Restores 1 HP', price: 50, category: 'special' },
  { name: 'Mystery Meat', description: 'Don\'t ask, just eat', price: 3, category: 'special' },
  { name: 'Fairy Cake', description: 'Sparkles and tastes like dreams', price: 30, category: 'special' },
];

// ============================================
// Helper Functions
// ============================================

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============================================
// Main Functions
// ============================================

/**
 * Generate a random NPC
 * 
 * @param role - NPC's role in the tavern
 * @returns Generated NPC
 */
export function generateNPC(role: NPCRole): TavernNPC {
  const race = randomElement(NPC_RACES);
  const gender = Math.random() < 0.5 ? 'male' : 'female';
  const names = NPC_FIRST_NAMES[race][gender];
  const name = randomElement(names);
  const description = randomElement(NPC_DESCRIPTIONS[role]);
  const quirk = Math.random() < 0.5 ? randomElement(NPC_QUIRKS) : undefined;
  
  return {
    name,
    role,
    race,
    description,
    quirk,
  };
}

/**
 * Generate a tavern menu
 * 
 * @param quality - Tavern quality level
 * @returns Array of menu items
 */
export function generateMenu(quality: TavernQuality): MenuItem[] {
  const menu: MenuItem[] = [];
  
  // Number of items based on quality
  const foodCount = quality === 'squalid' ? 2 : quality === 'aristocratic' ? 6 : 4;
  const drinkCount = quality === 'squalid' ? 2 : quality === 'aristocratic' ? 6 : 4;
  const specialCount = quality === 'wealthy' || quality === 'aristocratic' ? 2 : 1;
  
  menu.push(...randomElements(FOOD_ITEMS, foodCount));
  menu.push(...randomElements(DRINK_ITEMS, drinkCount));
  
  if (quality !== 'squalid' && quality !== 'poor') {
    menu.push(...randomElements(SPECIAL_ITEMS, specialCount));
  }
  
  // Adjust prices based on quality
  const priceMultiplier: Record<TavernQuality, number> = {
    squalid: 0.5,
    poor: 0.75,
    modest: 1,
    comfortable: 1.25,
    wealthy: 1.5,
    aristocratic: 2,
  };
  
  return menu.map(item => ({
    ...item,
    price: Math.round(item.price * priceMultiplier[quality]),
  }));
}

/**
 * Generate tavern description based on quality
 * 
 * @param quality - Tavern quality level
 * @returns Description string
 */
export function generateDescription(quality: TavernQuality): string {
  const descriptions: Record<TavernQuality, string[]> = {
    squalid: [
      'A run-down establishment with sticky floors and questionable clientele.',
      'More of a shack than a tavern, but the drinks are cheap.',
      'The kind of place where you keep one hand on your purse.',
    ],
    poor: [
      'A simple tavern that serves its purpose without frills.',
      'Basic but functional, popular with laborers and travelers.',
      'Nothing fancy, but the food is filling and the beds are dry.',
    ],
    modest: [
      'A respectable establishment with decent food and friendly staff.',
      'A comfortable tavern that caters to merchants and craftsmen.',
      'Well-maintained and welcoming, a good place to rest.',
    ],
    comfortable: [
      'A well-appointed tavern with quality furnishings and good service.',
      'Popular with successful merchants and minor nobility.',
      'Clean, comfortable, and known for its excellent kitchen.',
    ],
    wealthy: [
      'An upscale establishment with fine decor and attentive staff.',
      'Frequented by nobles and wealthy merchants.',
      'Luxurious accommodations and an impressive wine cellar.',
    ],
    aristocratic: [
      'The finest establishment in the region, fit for royalty.',
      'Exquisite in every detail, with legendary cuisine.',
      'A destination in itself, known throughout the land.',
    ],
  };
  
  return randomElement(descriptions[quality]);
}

/**
 * Generate a complete tavern
 * 
 * @param quality - Tavern quality level (optional, random if not specified)
 * @returns Complete tavern with all details
 * 
 * @example
 * ```typescript
 * const tavern = generateTavern('comfortable');
 * console.log(tavern.name); // "The Golden Dragon Inn"
 * ```
 */
export function generateTavern(quality?: TavernQuality): Tavern {
  const qualities: TavernQuality[] = ['squalid', 'poor', 'modest', 'comfortable', 'wealthy', 'aristocratic'];
  const selectedQuality = quality || randomElement(qualities);
  
  // Generate NPCs based on quality
  const npcCount = selectedQuality === 'squalid' ? 2 : selectedQuality === 'aristocratic' ? 6 : 4;
  const npcs: TavernNPC[] = [
    generateNPC('owner'),
    generateNPC('bartender'),
  ];
  
  if (npcCount > 2) {
    npcs.push(generateNPC(Math.random() < 0.5 ? 'barmaid' : 'cook'));
  }
  if (npcCount > 3) {
    npcs.push(generateNPC('patron'));
  }
  if (npcCount > 4) {
    npcs.push(generateNPC(Math.random() < 0.5 ? 'bouncer' : 'entertainer'));
  }
  if (npcCount > 5) {
    npcs.push(generateNPC('patron'));
  }
  
  // Generate rumors (2-4)
  const rumorCount = randomInt(2, 4);
  const rumors = randomElements(RUMORS, rumorCount);
  
  // Maybe add a special feature
  const specialFeature = Math.random() < 0.3 ? randomElement(SPECIAL_FEATURES) : undefined;
  
  return {
    name: generateTavernName(),
    quality: selectedQuality,
    description: generateDescription(selectedQuality),
    atmosphere: randomElement(ATMOSPHERES),
    npcs,
    menu: generateMenu(selectedQuality),
    rumors,
    specialFeature,
  };
}

/**
 * Format tavern for display
 * 
 * @param tavern - Tavern to format
 * @returns Formatted string
 */
export function formatTavern(tavern: Tavern): string {
  const lines: string[] = [
    `# ${tavern.name}`,
    `*${tavern.quality.charAt(0).toUpperCase() + tavern.quality.slice(1)} Quality*`,
    '',
    tavern.description,
    '',
    `**Atmosphere:** ${tavern.atmosphere}`,
    '',
    '## Staff & Patrons',
  ];
  
  for (const npc of tavern.npcs) {
    const quirkStr = npc.quirk ? ` (${npc.quirk})` : '';
    lines.push(`- **${npc.name}** (${npc.race} ${npc.role}): ${npc.description}${quirkStr}`);
  }
  
  lines.push('', '## Menu');
  for (const item of tavern.menu) {
    lines.push(`- ${item.name} (${item.price} cp): ${item.description}`);
  }
  
  lines.push('', '## Rumors');
  for (const rumor of tavern.rumors) {
    lines.push(`- "${rumor}"`);
  }
  
  if (tavern.specialFeature) {
    lines.push('', `**Special Feature:** ${tavern.specialFeature}`);
  }
  
  return lines.join('\n');
}

/**
 * Get tavern data for validation
 */
export function getTavernData() {
  return {
    npcRaces: NPC_RACES,
    npcQuirks: NPC_QUIRKS,
    atmospheres: ATMOSPHERES,
    specialFeatures: SPECIAL_FEATURES,
    rumors: RUMORS,
    foodItems: FOOD_ITEMS,
    drinkItems: DRINK_ITEMS,
    specialItems: SPECIAL_ITEMS,
  };
}
