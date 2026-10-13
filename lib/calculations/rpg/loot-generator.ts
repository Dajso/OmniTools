/**
 * Loot Generator
 * 
 * Generates random treasure and loot for tabletop RPGs.
 * Based on D&D 5e treasure tables with customizable options.
 * 
 * @module lib/calculations/rpg/loot-generator
 * @see Requirements 21.6
 */

/**
 * Treasure tier levels
 */
export type TreasureTier = 'minor' | 'moderate' | 'major' | 'legendary';

/**
 * Item rarity levels
 */
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'very-rare' | 'legendary';

/**
 * Loot type categories
 */
export type LootType = 'coins' | 'gems' | 'art' | 'magic-item' | 'mundane';

/**
 * Generated loot item
 */
export interface LootItem {
  type: LootType;
  name: string;
  value?: number;
  rarity?: ItemRarity;
  description?: string;
}

/**
 * Complete loot result
 */
export interface LootResult {
  tier: TreasureTier;
  items: LootItem[];
  totalValue: number;
  summary: string;
}

// ============================================
// Loot Data Tables
// ============================================

/**
 * Coin amounts by tier (in gold pieces)
 */
const COIN_RANGES: Record<TreasureTier, { min: number; max: number }> = {
  minor: { min: 1, max: 50 },
  moderate: { min: 50, max: 500 },
  major: { min: 500, max: 5000 },
  legendary: { min: 5000, max: 50000 },
};

/**
 * Gem types and values
 */
const GEMS: { name: string; value: number; tier: TreasureTier }[] = [
  // Minor gems (10-50 gp)
  { name: 'Asuritt', value: 10, tier: 'minor' },
  { name: 'Båndet agat', value: 10, tier: 'minor' },
  { name: 'Blå kvarts', value: 10, tier: 'minor' },
  { name: 'Øyeagat', value: 10, tier: 'minor' },
  { name: 'Hematitt', value: 10, tier: 'minor' },
  { name: 'Lapis lazuli', value: 10, tier: 'minor' },
  { name: 'Malakitt', value: 10, tier: 'minor' },
  { name: 'Mosagat', value: 10, tier: 'minor' },
  { name: 'Obsidian', value: 10, tier: 'minor' },
  { name: 'Rodokrositt', value: 10, tier: 'minor' },
  { name: 'Tigerøye', value: 10, tier: 'minor' },
  { name: 'Turkis', value: 10, tier: 'minor' },
  { name: 'Blodstein', value: 50, tier: 'minor' },
  { name: 'Karneol', value: 50, tier: 'minor' },
  { name: 'Kalsedon', value: 50, tier: 'minor' },
  { name: 'Krysopras', value: 50, tier: 'minor' },
  { name: 'Citrin', value: 50, tier: 'minor' },
  { name: 'Jaspis', value: 50, tier: 'minor' },
  { name: 'Månestein', value: 50, tier: 'minor' },
  { name: 'Oniks', value: 50, tier: 'minor' },

  // Moderate gems (100-500 gp)
  { name: 'Rav', value: 100, tier: 'moderate' },
  { name: 'Ametyst', value: 100, tier: 'moderate' },
  { name: 'Krysoberyll', value: 100, tier: 'moderate' },
  { name: 'Korall', value: 100, tier: 'moderate' },
  { name: 'Granat', value: 100, tier: 'moderate' },
  { name: 'Jade', value: 100, tier: 'moderate' },
  { name: 'Gagat', value: 100, tier: 'moderate' },
  { name: 'Perle', value: 100, tier: 'moderate' },
  { name: 'Spinell', value: 100, tier: 'moderate' },
  { name: 'Turmalin', value: 100, tier: 'moderate' },
  { name: 'Aleksandritt', value: 500, tier: 'moderate' },
  { name: 'Akvamarin', value: 500, tier: 'moderate' },
  { name: 'Svart perle', value: 500, tier: 'moderate' },
  { name: 'Blå spinell', value: 500, tier: 'moderate' },
  { name: 'Peridot', value: 500, tier: 'moderate' },
  { name: 'Topas', value: 500, tier: 'moderate' },

  // Major gems (1000-5000 gp)
  { name: 'Svart opal', value: 1000, tier: 'major' },
  { name: 'Blå safir', value: 1000, tier: 'major' },
  { name: 'Smaragd', value: 1000, tier: 'major' },
  { name: 'Ildopal', value: 1000, tier: 'major' },
  { name: 'Opal', value: 1000, tier: 'major' },
  { name: 'Stjerne-rubin', value: 1000, tier: 'major' },
  { name: 'Stjernesafir', value: 1000, tier: 'major' },
  { name: 'Gul safir', value: 1000, tier: 'major' },
  { name: 'Svart safir', value: 5000, tier: 'major' },
  { name: 'Diamant', value: 5000, tier: 'major' },
  { name: 'Hyasint', value: 5000, tier: 'major' },
  { name: 'Rubin', value: 5000, tier: 'major' },
];

/**
 * Art objects and values
 */
const ART_OBJECTS: { name: string; value: number; tier: TreasureTier }[] = [
  // Minor art (25-50 gp)
  { name: 'Sølvmugge', value: 25, tier: 'minor' },
  { name: 'Utskåret beinstatuett', value: 25, tier: 'minor' },
  { name: 'Lite gullarmbånd', value: 25, tier: 'minor' },
  { name: 'Gullvevde kirkeklær', value: 25, tier: 'minor' },
  { name: 'Svart fløyelsmaske med sølv', value: 25, tier: 'minor' },
  { name: 'Kobberbeger med sølvfiligran', value: 25, tier: 'minor' },
  { name: 'Par graverte beinterninger', value: 25, tier: 'minor' },
  { name: 'Lite speil i malt ramme', value: 25, tier: 'minor' },

  // Moderate art (250-750 gp)
  { name: 'Gullring med blodsteiner', value: 250, tier: 'moderate' },
  { name: 'Utskåret elfenbensstatuett', value: 250, tier: 'moderate' },
  { name: 'Stort gullarmbånd', value: 250, tier: 'moderate' },
  { name: 'Sølvhalskjede med edelstein', value: 250, tier: 'moderate' },
  { name: 'Bronsekrone', value: 250, tier: 'moderate' },
  { name: 'Silkekåpe med gullbroderi', value: 250, tier: 'moderate' },
  { name: 'Stort billedteppe', value: 250, tier: 'moderate' },
  { name: 'Messingkrus med innlagt jade', value: 250, tier: 'moderate' },
  { name: 'Eske med dyrefigurer i turkis', value: 250, tier: 'moderate' },
  { name: 'Fuglebur av gull med elektrum-filigran', value: 250, tier: 'moderate' },
  { name: 'Sølvbeger med månesteiner', value: 750, tier: 'moderate' },
  { name: 'Sølvbelagt langsverd av stål', value: 750, tier: 'moderate' },
  { name: 'Utskåret harpe av eksotisk tre', value: 750, tier: 'moderate' },

  // Major art (2500-7500 gp)
  { name: 'Fin gullkjede med ildopal', value: 2500, tier: 'major' },
  { name: 'Gammelt mesterverk i maleri', value: 2500, tier: 'major' },
  { name: 'Brodert kappe av silke og fløyel', value: 2500, tier: 'major' },
  { name: 'Platinaarmbånd med safir', value: 2500, tier: 'major' },
  { name: 'Brodert hanske med smykkestein-flis', value: 2500, tier: 'major' },
  { name: 'Ankelkjede med smykkesteiner', value: 2500, tier: 'major' },
  { name: 'Musikkboks av gull', value: 2500, tier: 'major' },
  { name: 'Gullpannebånd med fire akvamariner', value: 2500, tier: 'major' },
  { name: 'Øyelapp med falskt safiröye', value: 2500, tier: 'major' },
  { name: 'Halskjede av små rosa perler', value: 2500, tier: 'major' },
  { name: 'Gullkrone med rubiner', value: 7500, tier: 'major' },
  { name: 'Platinaring med diamanter', value: 7500, tier: 'major' },
  { name: 'Obsidianstatuett med gullbeslag', value: 7500, tier: 'major' },
];

/**
 * Magic items by rarity
 */
const MAGIC_ITEMS: { name: string; rarity: ItemRarity; description: string }[] = [
  // Common
  { name: 'Helbredelsesdrikk', rarity: 'common', description: 'Gjenoppretter 2d4+2 treffpoeng' },
  { name: 'Trylleskriftrull (småtrylleformel)', rarity: 'common', description: 'Inneholder en småtrylleformel' },
  { name: 'Klatredrikk', rarity: 'common', description: 'Gir klatrefart i 1 time' },
  { name: 'Dypets lys', rarity: 'common', description: 'Brenner under vann' },
  { name: 'Flaksende kappe', rarity: 'common', description: 'Flakser dramatisk på kommando' },
  { name: 'Urverksamulett', rarity: 'common', description: 'Ta 10 på et angrepskast én gang om dagen' },
  { name: 'Skrekkhjelm', rarity: 'common', description: 'Øynene gløder røde når den bæres' },
  { name: 'Hørselshorn', rarity: 'common', description: 'Fordel på hørselsprøver' },

  // Uncommon
  { name: 'Evighetssekk', rarity: 'uncommon', description: 'Rommer opptil 500 pund (ca. 227 kg)' },
  { name: '+1-våpen', rarity: 'uncommon', description: '+1 på angreps- og skadekast' },
  { name: '+1-rustning', rarity: 'uncommon', description: '+1 på AC' },
  { name: 'Alvestøvler', rarity: 'uncommon', description: 'Fordel på snikeprøver' },
  { name: 'Alvekappe', rarity: 'uncommon', description: 'Fordel på snikeprøver' },
  { name: 'Nattbriller', rarity: 'uncommon', description: 'Mørkesyn 60 fot (ca. 18 m)' },
  { name: 'Urokkelig stav', rarity: 'uncommon', description: 'Blir hengende i luften' },
  { name: 'Hoppering', rarity: 'uncommon', description: 'Kast Hopp så ofte du vil' },
  { name: 'Klatretau', rarity: 'uncommon', description: 'Våkner til liv på kommando' },
  { name: 'Magidetektor-stav', rarity: 'uncommon', description: 'Kast Oppdag magi' },

  // Rare
  { name: '+2-våpen', rarity: 'rare', description: '+2 på angreps- og skadekast' },
  { name: '+2-rustning', rarity: 'rare', description: '+2 på AC' },
  { name: 'Forskyvningskappe', rarity: 'rare', description: 'Angripere har ulempe' },
  { name: 'Flammetunge', rarity: 'rare', description: 'Gir ekstra 2d6 ildskade' },
  { name: 'Beskyttelsesring', rarity: 'rare', description: '+1 på AC og redningskast' },
  { name: 'Trylleformel-lagringsring', rarity: 'rare', description: 'Lagrer opptil 5 formelnivåer' },
  { name: 'Helbredelsesstav', rarity: 'rare', description: 'Kast helbredende formler' },
  { name: 'Flyvinger', rarity: 'rare', description: 'Gir flyfart' },

  // Very Rare
  { name: '+3-våpen', rarity: 'very-rare', description: '+3 på angreps- og skadekast' },
  { name: '+3-rustning', rarity: 'very-rare', description: '+3 på AC' },
  { name: 'Usynlighetskappe', rarity: 'very-rare', description: 'Bli usynlig' },
  { name: 'Dansende sverd', rarity: 'very-rare', description: 'Kjemper på egen hånd' },
  { name: 'Absorpsjonsstav', rarity: 'very-rare', description: 'Absorberer formelenergi' },
  { name: 'Ildstav', rarity: 'very-rare', description: 'Kast ildformler' },
  { name: 'Maktens stav', rarity: 'very-rare', description: 'Kraftig trylleformelstav' },

  // Legendary
  { name: 'Hellig hevner', rarity: 'legendary', description: '+3-våpen med ekstra strålingsskade' },
  { name: 'Ring med tre ønsker', rarity: 'legendary', description: 'Kast Ønske tre ganger' },
  { name: 'Magikernes stav', rarity: 'legendary', description: 'Den ypperste trylleformelstaven' },
  { name: 'Vorpalsverd', rarity: 'legendary', description: 'Halshugger på naturlig 20' },
  { name: 'Lykkeblad', rarity: 'legendary', description: '+1 på alt, ønsker' },
  { name: 'Erkemagikerens kappe', rarity: 'legendary', description: 'Den ypperste trollmannskappen' },
];

/**
 * Mundane items for flavor
 */
const MUNDANE_ITEMS: string[] = [
  'Slitt skinnpung',
  'Fillete kart',
  'Rusten nøkkel',
  'Sprukket speil',
  'Falmet brev',
  'Ødelagt kompass',
  'Tom flaske',
  'Skadde terninger',
  'Frynset tau',
  'Bulkete krus',
  'Revne spillkort',
  'Bøyd dirk',
  'Flekket dagbok',
  'Smuldrende skriftrull',
  'Anløpen medaljong',
];

// ============================================
// Helper Functions
// ============================================

/**
 * Pick a random element from an array
 */
function randomElement<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate random integer in range (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get tier order for comparison
 */
function getTierOrder(tier: TreasureTier): number {
  const order: Record<TreasureTier, number> = {
    minor: 0,
    moderate: 1,
    major: 2,
    legendary: 3,
  };
  return order[tier];
}

/**
 * Get rarity order for comparison
 */
function getRarityOrder(rarity: ItemRarity): number {
  const order: Record<ItemRarity, number> = {
    common: 0,
    uncommon: 1,
    rare: 2,
    'very-rare': 3,
    legendary: 4,
  };
  return order[rarity];
}

// ============================================
// Main Functions
// ============================================

/**
 * Generate coin loot
 * 
 * @param tier - Treasure tier
 * @returns Coin loot item
 */
export function generateCoins(tier: TreasureTier): LootItem {
  const range = COIN_RANGES[tier];
  const amount = randomInt(range.min, range.max);

  return {
    type: 'coins',
    name: `${amount} gullstykker`,
    value: amount,
  };
}

/**
 * Generate gem loot
 * 
 * @param tier - Treasure tier
 * @returns Gem loot item
 */
export function generateGem(tier: TreasureTier): LootItem {
  const tierOrder = getTierOrder(tier);
  const eligibleGems = GEMS.filter(g => getTierOrder(g.tier) <= tierOrder);
  const gem = randomElement(eligibleGems);

  return {
    type: 'gems',
    name: gem.name,
    value: gem.value,
  };
}

/**
 * Generate art object loot
 * 
 * @param tier - Treasure tier
 * @returns Art object loot item
 */
export function generateArtObject(tier: TreasureTier): LootItem {
  const tierOrder = getTierOrder(tier);
  const eligibleArt = ART_OBJECTS.filter(a => getTierOrder(a.tier) <= tierOrder);
  const art = randomElement(eligibleArt);

  return {
    type: 'art',
    name: art.name,
    value: art.value,
  };
}

/**
 * Generate magic item loot
 * 
 * @param tier - Treasure tier
 * @returns Magic item loot item
 */
export function generateMagicItem(tier: TreasureTier): LootItem {
  // Map tier to max rarity
  const maxRarity: Record<TreasureTier, ItemRarity> = {
    minor: 'common',
    moderate: 'uncommon',
    major: 'rare',
    legendary: 'legendary',
  };

  const maxRarityOrder = getRarityOrder(maxRarity[tier]);
  const eligibleItems = MAGIC_ITEMS.filter(i => getRarityOrder(i.rarity) <= maxRarityOrder);
  const item = randomElement(eligibleItems);

  return {
    type: 'magic-item',
    name: item.name,
    rarity: item.rarity,
    description: item.description,
  };
}

/**
 * Generate mundane item
 * 
 * @returns Mundane loot item
 */
export function generateMundaneItem(): LootItem {
  return {
    type: 'mundane',
    name: randomElement(MUNDANE_ITEMS),
    value: randomInt(0, 5),
  };
}

/**
 * Generate complete loot based on tier
 * 
 * @param tier - Treasure tier
 * @param options - Generation options
 * @returns Complete loot result
 * 
 * @example
 * ```typescript
 * const loot = generateLoot('moderate', { includeMagicItem: true });
 * ```
 */
export function generateLoot(
  tier: TreasureTier,
  options: {
    includeMagicItem?: boolean;
    includeGems?: boolean;
    includeArt?: boolean;
    includeMundane?: boolean;
  } = {}
): LootResult {
  const {
    includeMagicItem = Math.random() < 0.3,
    includeGems = Math.random() < 0.5,
    includeArt = Math.random() < 0.4,
    includeMundane = Math.random() < 0.6,
  } = options;

  const items: LootItem[] = [];
  let totalValue = 0;

  // Always include coins
  const coins = generateCoins(tier);
  items.push(coins);
  totalValue += coins.value || 0;

  // Optionally include gems (1-3)
  if (includeGems) {
    const gemCount = randomInt(1, 3);
    for (let i = 0; i < gemCount; i++) {
      const gem = generateGem(tier);
      items.push(gem);
      totalValue += gem.value || 0;
    }
  }

  // Optionally include art (1-2)
  if (includeArt) {
    const artCount = randomInt(1, 2);
    for (let i = 0; i < artCount; i++) {
      const art = generateArtObject(tier);
      items.push(art);
      totalValue += art.value || 0;
    }
  }

  // Optionally include magic item
  if (includeMagicItem) {
    const magicItem = generateMagicItem(tier);
    items.push(magicItem);
  }

  // Optionally include mundane items (1-3)
  if (includeMundane) {
    const mundaneCount = randomInt(1, 3);
    for (let i = 0; i < mundaneCount; i++) {
      const mundane = generateMundaneItem();
      items.push(mundane);
      totalValue += mundane.value || 0;
    }
  }

  // Generate summary
  const summary = items.map(item => {
    if (item.value) {
      return `${item.name} (${item.value} gp)`;
    }
    if (item.rarity) {
      return `${item.name} [${item.rarity}]`;
    }
    return item.name;
  }).join(', ');

  return {
    tier,
    items,
    totalValue,
    summary,
  };
}

/**
 * Get loot data for validation/testing
 */
export function getLootData() {
  return {
    gems: GEMS,
    artObjects: ART_OBJECTS,
    magicItems: MAGIC_ITEMS,
    mundaneItems: MUNDANE_ITEMS,
    coinRanges: COIN_RANGES,
  };
}
