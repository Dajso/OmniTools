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
  'pusser stadig glass',
  'forteller den samme vitsen til alle',
  'har en tamrotte på skulderen',
  'snakker på rim når vedkommende er nervøs',
  'samler på uvanlige mynter',
  'ser alltid ut til å kjenne navnet ditt',
  'ler på upassende tidspunkt',
  'hvisker hemmeligheter til seg selv',
  'har et imponerende arr',
  'ser aldri folk i øynene',
  'nynner mens vedkommende jobber',
  'har en tykk utenlandsk aksent',
  'mangler flere tenner',
  'har på seg to ulike sko',
  'småspiser hele tiden',
];

const NPC_DESCRIPTIONS = {
  owner: [
    'En skarp forretningsperson med godt øye for fortjeneste',
    'En pensjonert eventyrer som har slått seg til ro',
    'En tidligere adelsmann som har falt på hardere tider',
    'En blid sjel som elsker å møte reisende',
    'En barsk veteran med historier å fortelle',
  ],
  bartender: [
    'Rask med glasset og raskere med råd',
    'Taus og oppmerksom, går ikke glipp av noe',
    'Vennlig og pratsom, kjenner alle',
    'Streng, men rettferdig, holder orden i baren',
    'Ung og ivrig etter å glede',
  ],
  barmaid: [
    'Effektiv og profesjonell',
    'Flørtende, men kvikk i tanken',
    'Stille og oppmerksom',
    'Blid og energisk',
    'Sliten, men snill',
  ],
  cook: [
    'En matkunstner med hemmelige oppskrifter',
    'Sur, men talentfull',
    'Eksperimenterer med uvanlige ingredienser',
    'Tradisjonell og pålitelig',
    'Tidligere skipskokk med eksotiske retter',
  ],
  bouncer: [
    'Digert og skremmende',
    'Overraskende mild helt til han eller hun provoseres',
    'Tidligere soldat med streng framtoning',
    'Rask og smidig til tross for størrelsen',
    'Dekket av tatoveringer og arr',
  ],
  patron: [
    'En mystisk fremmed i et mørkt hjørne',
    'En høylytt kjøpmann som feirer en avtale',
    'En sliten reisende som trenger hvile',
    'En fast gjest som sitter over drinken sin',
    'En gruppe vakter på fri',
  ],
  entertainer: [
    'En talentfull skald med sølvtunge',
    'En sjonglør og akrobat',
    'En forteller med eldgamle sagn',
    'En musiker med en gripende stemme',
    'En komiker med bitende vidd',
  ],
};

const ATMOSPHERES = [
  'Varm og innbydende, med knitrende peis',
  'Bråkete og høylytt, fylt av latter',
  'Stille og mystisk, med dempede samtaler',
  'Røykfylt og dunkel, med flakkende lys',
  'Rent og godt opplyst, overraskende hyggelig',
  'Trangt, men koselig, hvert bord fullt',
  'Romslig og luftig, med høyt under taket',
  'Rustikt og hjemmekoselig, som et bondekjøkken',
];

const SPECIAL_FEATURES = [
  'Et hemmelig rom bak peisen',
  'En kampgrop i kjelleren',
  'Et spøkelse som bor der og hjelper til med rengjøringen',
  'En magisk jukeboks som spiller ønsker',
  'En portal til et annet vertshus i en fjern by',
  'En samling eventyrertrofeer på veggene',
  'En ønskebrønn i gårdsplassen',
  'Et underjordisk varmt kildebad',
  'En takhage med sjeldne urter',
  'Et bibliotek med eldgamle bøker',
];

const RUMORS = [
  'Det sies at den gamle gruva er åpnet igjen, men ingen som går inn kommer ut.',
  'Baronens datter er forsvunnet igjen.',
  'Merkelige lys er sett i skogen om natta.',
  'En drage er sett flyvende over fjellene.',
  'Høstfesten nærmer seg, og det er premie for den beste paien.',
  'Banditter har angrepet karavaner på nordveien.',
  'Tempelet leter etter eventyrere som kan rydde katakombene.',
  'En kjøpmann betaler godt med gull for sjeldne urter.',
  'Smedlærlingen fant noe merkelig i elva.',
  'Det ulmer til krig i rikene i øst.',
  'En kjent skald kommer til byen neste uke.',
  'Ordføreren har oppført seg merkelig i det siste.',
  'Noen brøt seg inn i trollmannens tårn i natt.',
  'Fiskebåtene har fått merkelige skapninger i garnene.',
  'En ny kult har rekruttert i slummen.',
];

const FOOD_ITEMS: MenuItem[] = [
  { name: 'Brød og ost', description: 'Ferskt brød med lokal ost', price: 5, category: 'food' },
  { name: 'Kjøttpai', description: 'Mettende pai fylt med krydret kjøtt', price: 15, category: 'food' },
  { name: 'Stekt kylling', description: 'En halv kylling med grønnsaker', price: 25, category: 'food' },
  { name: 'Fiskegryte', description: 'Tykk gryte med ferskfanget fisk', price: 20, category: 'food' },
  { name: 'Grønnsakssuppe', description: 'Varm suppe med sesongens grønnsaker', price: 8, category: 'food' },
  { name: 'Villsvinstek', description: 'Langsomt stekt villsvin', price: 50, category: 'food' },
  { name: 'Gjeterpai', description: 'Lam og potet i form', price: 18, category: 'food' },
  { name: 'Osteanrettning', description: 'Utvalg av lokale oster', price: 12, category: 'food' },
];

const DRINK_ITEMS: MenuItem[] = [
  { name: 'Øl', description: 'Lokalbrygg, servert kaldt', price: 4, category: 'drink' },
  { name: 'Mjød', description: 'Søt honningvin', price: 8, category: 'drink' },
  { name: 'Vin', description: 'Rød eller hvit, du velger', price: 10, category: 'drink' },
  { name: 'Sider', description: 'Frisk eplesider', price: 5, category: 'drink' },
  { name: 'Dvergeporter', description: 'Sterk og mørk', price: 12, category: 'drink' },
  { name: 'Alvevin', description: 'Lett og duftende', price: 25, category: 'drink' },
  { name: 'Ildbrennevin', description: 'Svir på vei ned', price: 15, category: 'drink' },
  { name: 'Vann', description: 'Rent kildevann', price: 1, category: 'drink' },
];

const SPECIAL_ITEMS: MenuItem[] = [
  { name: 'Dragepepper-biff', description: 'Ekstremt sterkt, ikke for de svake', price: 75, category: 'special' },
  { name: 'Heimebrent', description: 'Ulovlig, men sterk', price: 20, category: 'special' },
  { name: 'Helbredende kraftsuppe', description: 'Gjenoppretter 1 HP', price: 50, category: 'special' },
  { name: 'Mysteriekjøtt', description: 'Ikke spør, bare spis', price: 3, category: 'special' },
  { name: 'Eventyrkake', description: 'Glitrer og smaker av drømmer', price: 30, category: 'special' },
];

// ============================================
// Helper Functions
// ============================================

function randomElement<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomElements<T>(array: readonly T[], count: number): T[] {
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
      'Et forfallent sted med klissete gulv og tvilsomme gjester.',
      'Mer en skur enn et vertshus, men drikken er billig.',
      'Et sted der du holder en hånd på pungen.',
    ],
    poor: [
      'Et enkelt vertshus som gjør jobben uten staffasje.',
      'Enkelt og brukbart, populært blant arbeidsfolk og reisende.',
      'Ikke noe fancy, men maten metter og sengene er tørre.',
    ],
    modest: [
      'Et skikkelig sted med god mat og vennlige ansatte.',
      'Et trivelig vertshus for kjøpmenn og håndverkere.',
      'Velholdt og gjestfritt, et godt sted å hvile.',
    ],
    comfortable: [
      'Et godt utstyrt vertshus med gode møbler og god service.',
      'Populært blant velstående kjøpmenn og lavadel.',
      'Rent, komfortabelt og kjent for et utmerket kjøkken.',
    ],
    wealthy: [
      'Et eksklusivt sted med fin innredning og oppmerksomme ansatte.',
      'Besøkt av adelsmenn og rike kjøpmenn.',
      'Luksuriøs overnatting og en imponerende vinkjeller.',
    ],
    aristocratic: [
      'Regionens fineste sted, verdig en konge.',
      'Utsøkt i hver detalj, med legendarisk mat.',
      'Et reisemål i seg selv, kjent over hele landet.',
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
 * console.log(tavern.name); // «Vertshuset «Den gylne draken»»
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
