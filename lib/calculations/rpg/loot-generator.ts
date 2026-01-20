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
  { name: 'Azurite', value: 10, tier: 'minor' },
  { name: 'Banded Agate', value: 10, tier: 'minor' },
  { name: 'Blue Quartz', value: 10, tier: 'minor' },
  { name: 'Eye Agate', value: 10, tier: 'minor' },
  { name: 'Hematite', value: 10, tier: 'minor' },
  { name: 'Lapis Lazuli', value: 10, tier: 'minor' },
  { name: 'Malachite', value: 10, tier: 'minor' },
  { name: 'Moss Agate', value: 10, tier: 'minor' },
  { name: 'Obsidian', value: 10, tier: 'minor' },
  { name: 'Rhodochrosite', value: 10, tier: 'minor' },
  { name: 'Tiger Eye', value: 10, tier: 'minor' },
  { name: 'Turquoise', value: 10, tier: 'minor' },
  { name: 'Bloodstone', value: 50, tier: 'minor' },
  { name: 'Carnelian', value: 50, tier: 'minor' },
  { name: 'Chalcedony', value: 50, tier: 'minor' },
  { name: 'Chrysoprase', value: 50, tier: 'minor' },
  { name: 'Citrine', value: 50, tier: 'minor' },
  { name: 'Jasper', value: 50, tier: 'minor' },
  { name: 'Moonstone', value: 50, tier: 'minor' },
  { name: 'Onyx', value: 50, tier: 'minor' },

  // Moderate gems (100-500 gp)
  { name: 'Amber', value: 100, tier: 'moderate' },
  { name: 'Amethyst', value: 100, tier: 'moderate' },
  { name: 'Chrysoberyl', value: 100, tier: 'moderate' },
  { name: 'Coral', value: 100, tier: 'moderate' },
  { name: 'Garnet', value: 100, tier: 'moderate' },
  { name: 'Jade', value: 100, tier: 'moderate' },
  { name: 'Jet', value: 100, tier: 'moderate' },
  { name: 'Pearl', value: 100, tier: 'moderate' },
  { name: 'Spinel', value: 100, tier: 'moderate' },
  { name: 'Tourmaline', value: 100, tier: 'moderate' },
  { name: 'Alexandrite', value: 500, tier: 'moderate' },
  { name: 'Aquamarine', value: 500, tier: 'moderate' },
  { name: 'Black Pearl', value: 500, tier: 'moderate' },
  { name: 'Blue Spinel', value: 500, tier: 'moderate' },
  { name: 'Peridot', value: 500, tier: 'moderate' },
  { name: 'Topaz', value: 500, tier: 'moderate' },

  // Major gems (1000-5000 gp)
  { name: 'Black Opal', value: 1000, tier: 'major' },
  { name: 'Blue Sapphire', value: 1000, tier: 'major' },
  { name: 'Emerald', value: 1000, tier: 'major' },
  { name: 'Fire Opal', value: 1000, tier: 'major' },
  { name: 'Opal', value: 1000, tier: 'major' },
  { name: 'Star Ruby', value: 1000, tier: 'major' },
  { name: 'Star Sapphire', value: 1000, tier: 'major' },
  { name: 'Yellow Sapphire', value: 1000, tier: 'major' },
  { name: 'Black Sapphire', value: 5000, tier: 'major' },
  { name: 'Diamond', value: 5000, tier: 'major' },
  { name: 'Jacinth', value: 5000, tier: 'major' },
  { name: 'Ruby', value: 5000, tier: 'major' },
];

/**
 * Art objects and values
 */
const ART_OBJECTS: { name: string; value: number; tier: TreasureTier }[] = [
  // Minor art (25-50 gp)
  { name: 'Silver ewer', value: 25, tier: 'minor' },
  { name: 'Carved bone statuette', value: 25, tier: 'minor' },
  { name: 'Small gold bracelet', value: 25, tier: 'minor' },
  { name: 'Cloth-of-gold vestments', value: 25, tier: 'minor' },
  { name: 'Black velvet mask with silver', value: 25, tier: 'minor' },
  { name: 'Copper chalice with silver filigree', value: 25, tier: 'minor' },
  { name: 'Pair of engraved bone dice', value: 25, tier: 'minor' },
  { name: 'Small mirror in painted frame', value: 25, tier: 'minor' },

  // Moderate art (250-750 gp)
  { name: 'Gold ring with bloodstones', value: 250, tier: 'moderate' },
  { name: 'Carved ivory statuette', value: 250, tier: 'moderate' },
  { name: 'Large gold bracelet', value: 250, tier: 'moderate' },
  { name: 'Silver necklace with gemstone', value: 250, tier: 'moderate' },
  { name: 'Bronze crown', value: 250, tier: 'moderate' },
  { name: 'Silk robe with gold embroidery', value: 250, tier: 'moderate' },
  { name: 'Large tapestry', value: 250, tier: 'moderate' },
  { name: 'Brass mug with jade inlay', value: 250, tier: 'moderate' },
  { name: 'Box of turquoise animal figurines', value: 250, tier: 'moderate' },
  { name: 'Gold bird cage with electrum filigree', value: 250, tier: 'moderate' },
  { name: 'Silver chalice with moonstones', value: 750, tier: 'moderate' },
  { name: 'Silver-plated steel longsword', value: 750, tier: 'moderate' },
  { name: 'Carved harp of exotic wood', value: 750, tier: 'moderate' },

  // Major art (2500-7500 gp)
  { name: 'Fine gold chain with fire opal', value: 2500, tier: 'major' },
  { name: 'Old masterpiece painting', value: 2500, tier: 'major' },
  { name: 'Embroidered silk and velvet mantle', value: 2500, tier: 'major' },
  { name: 'Platinum bracelet with sapphire', value: 2500, tier: 'major' },
  { name: 'Embroidered glove with jewel chips', value: 2500, tier: 'major' },
  { name: 'Jeweled anklet', value: 2500, tier: 'major' },
  { name: 'Gold music box', value: 2500, tier: 'major' },
  { name: 'Gold circlet with four aquamarines', value: 2500, tier: 'major' },
  { name: 'Eye patch with mock eye of sapphire', value: 2500, tier: 'major' },
  { name: 'Necklace of small pink pearls', value: 2500, tier: 'major' },
  { name: 'Gold crown with rubies', value: 7500, tier: 'major' },
  { name: 'Platinum ring with diamonds', value: 7500, tier: 'major' },
  { name: 'Obsidian statuette with gold fittings', value: 7500, tier: 'major' },
];

/**
 * Magic items by rarity
 */
const MAGIC_ITEMS: { name: string; rarity: ItemRarity; description: string }[] = [
  // Common
  { name: 'Potion of Healing', rarity: 'common', description: 'Restores 2d4+2 hit points' },
  { name: 'Spell Scroll (Cantrip)', rarity: 'common', description: 'Contains a cantrip spell' },
  { name: 'Potion of Climbing', rarity: 'common', description: 'Grants climbing speed for 1 hour' },
  { name: 'Candle of the Deep', rarity: 'common', description: 'Burns underwater' },
  { name: 'Cloak of Billowing', rarity: 'common', description: 'Billows dramatically on command' },
  { name: 'Clockwork Amulet', rarity: 'common', description: 'Take 10 on attack roll once per day' },
  { name: 'Dread Helm', rarity: 'common', description: 'Eyes glow red while worn' },
  { name: 'Ear Horn of Hearing', rarity: 'common', description: 'Advantage on hearing checks' },

  // Uncommon
  { name: 'Bag of Holding', rarity: 'uncommon', description: 'Holds up to 500 pounds' },
  { name: '+1 Weapon', rarity: 'uncommon', description: '+1 to attack and damage rolls' },
  { name: '+1 Armor', rarity: 'uncommon', description: '+1 to AC' },
  { name: 'Boots of Elvenkind', rarity: 'uncommon', description: 'Advantage on Stealth checks' },
  { name: 'Cloak of Elvenkind', rarity: 'uncommon', description: 'Advantage on Stealth checks' },
  { name: 'Goggles of Night', rarity: 'uncommon', description: 'Darkvision 60 feet' },
  { name: 'Immovable Rod', rarity: 'uncommon', description: 'Holds position in space' },
  { name: 'Ring of Jumping', rarity: 'uncommon', description: 'Cast Jump at will' },
  { name: 'Rope of Climbing', rarity: 'uncommon', description: 'Animates on command' },
  { name: 'Wand of Magic Detection', rarity: 'uncommon', description: 'Cast Detect Magic' },

  // Rare
  { name: '+2 Weapon', rarity: 'rare', description: '+2 to attack and damage rolls' },
  { name: '+2 Armor', rarity: 'rare', description: '+2 to AC' },
  { name: 'Cloak of Displacement', rarity: 'rare', description: 'Attackers have disadvantage' },
  { name: 'Flame Tongue', rarity: 'rare', description: 'Deals extra 2d6 fire damage' },
  { name: 'Ring of Protection', rarity: 'rare', description: '+1 to AC and saving throws' },
  { name: 'Ring of Spell Storing', rarity: 'rare', description: 'Stores up to 5 spell levels' },
  { name: 'Staff of Healing', rarity: 'rare', description: 'Cast healing spells' },
  { name: 'Wings of Flying', rarity: 'rare', description: 'Grants flying speed' },

  // Very Rare
  { name: '+3 Weapon', rarity: 'very-rare', description: '+3 to attack and damage rolls' },
  { name: '+3 Armor', rarity: 'very-rare', description: '+3 to AC' },
  { name: 'Cloak of Invisibility', rarity: 'very-rare', description: 'Become invisible' },
  { name: 'Dancing Sword', rarity: 'very-rare', description: 'Fights on its own' },
  { name: 'Rod of Absorption', rarity: 'very-rare', description: 'Absorbs spell energy' },
  { name: 'Staff of Fire', rarity: 'very-rare', description: 'Cast fire spells' },
  { name: 'Staff of Power', rarity: 'very-rare', description: 'Powerful spellcasting staff' },

  // Legendary
  { name: 'Holy Avenger', rarity: 'legendary', description: '+3 weapon, extra radiant damage' },
  { name: 'Ring of Three Wishes', rarity: 'legendary', description: 'Cast Wish three times' },
  { name: 'Staff of the Magi', rarity: 'legendary', description: 'Ultimate spellcasting staff' },
  { name: 'Vorpal Sword', rarity: 'legendary', description: 'Decapitates on natural 20' },
  { name: 'Luck Blade', rarity: 'legendary', description: '+1 to everything, wishes' },
  { name: 'Robe of the Archmagi', rarity: 'legendary', description: 'Ultimate wizard robe' },
];

/**
 * Mundane items for flavor
 */
const MUNDANE_ITEMS: string[] = [
  'Worn leather pouch',
  'Tattered map',
  'Rusty key',
  'Cracked mirror',
  'Faded letter',
  'Broken compass',
  'Empty vial',
  'Chipped dice',
  'Frayed rope',
  'Dented tankard',
  'Torn playing cards',
  'Bent lockpick',
  'Stained journal',
  'Crumbling scroll',
  'Tarnished locket',
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
    name: `${amount} gold pieces`,
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
