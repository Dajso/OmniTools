/**
 * Quest Idea Generator
 * 
 * Generates random adventure hooks and quest ideas for tabletop RPGs.
 * 
 * @module lib/calculations/rpg/quest-generator
 * @see Requirements 21.10
 */

import { generateQuestHook } from './name-generator';

/**
 * Quest type categories
 */
export type QuestType = 
  | 'fetch' 
  | 'rescue' 
  | 'escort' 
  | 'eliminate' 
  | 'investigate' 
  | 'defend' 
  | 'explore' 
  | 'negotiate' 
  | 'heist' 
  | 'competition';

/**
 * Quest difficulty levels
 */
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'deadly';

/**
 * Quest giver types
 */
export type QuestGiverType = 
  | 'noble' 
  | 'merchant' 
  | 'priest' 
  | 'wizard' 
  | 'commoner' 
  | 'guard' 
  | 'mysterious-stranger' 
  | 'child';

/**
 * Quest giver
 */
export interface QuestGiver {
  type: QuestGiverType;
  name: string;
  motivation: string;
  description: string;
}

/**
 * Quest complication
 */
export interface QuestComplication {
  description: string;
  severity: 'minor' | 'major' | 'critical';
}

/**
 * Quest reward
 */
export interface QuestReward {
  gold: number;
  items?: string[];
  reputation?: string;
  other?: string;
}

/**
 * Complete quest
 */
export interface Quest {
  title: string;
  type: QuestType;
  difficulty: QuestDifficulty;
  hook: string;
  description: string;
  objective: string;
  questGiver: QuestGiver;
  location: string;
  complications: QuestComplication[];
  reward: QuestReward;
  timeLimit?: string;
  secretTwist?: string;
}

// ============================================
// Data Tables
// ============================================

const QUEST_TITLES = {
  fetch: [
    'The Lost Artifact',
    'Retrieve the Relic',
    'The Missing Heirloom',
    'Gather the Components',
    'The Stolen Goods',
  ],
  rescue: [
    'Save the Hostages',
    'The Kidnapped Noble',
    'Rescue Mission',
    'Free the Prisoners',
    'The Missing Child',
  ],
  escort: [
    'Safe Passage',
    'The Caravan Guard',
    'Protect the Witness',
    'The Diplomatic Mission',
    'Journey to Safety',
  ],
  eliminate: [
    'Hunt the Beast',
    'Clear the Infestation',
    'Bounty Hunter',
    'Slay the Monster',
    'End the Threat',
  ],
  investigate: [
    'The Mystery Deepens',
    'Uncover the Truth',
    'The Strange Occurrences',
    'Find the Culprit',
    'Solve the Puzzle',
  ],
  defend: [
    'Hold the Line',
    'Protect the Village',
    'The Siege',
    'Guard Duty',
    'Last Stand',
  ],
  explore: [
    'Into the Unknown',
    'Map the Territory',
    'The Lost Expedition',
    'Discover the Ruins',
    'Chart the Depths',
  ],
  negotiate: [
    'Broker Peace',
    'The Trade Agreement',
    'Diplomatic Crisis',
    'Settle the Dispute',
    'Alliance Building',
  ],
  heist: [
    'The Big Score',
    'Steal the Crown',
    'The Impossible Job',
    'Inside Job',
    'The Perfect Crime',
  ],
  competition: [
    'The Grand Tournament',
    'Prove Your Worth',
    'The Contest',
    'Race Against Time',
    'The Challenge',
  ],
};

const QUEST_OBJECTIVES = {
  fetch: [
    'Retrieve the ancient artifact from the dungeon',
    'Collect rare ingredients for a powerful potion',
    'Recover the stolen family heirloom',
    'Find and return the lost shipment',
    'Gather evidence of the conspiracy',
  ],
  rescue: [
    'Free the prisoners from the enemy stronghold',
    'Save the kidnapped noble before the ransom deadline',
    'Rescue survivors from the collapsed mine',
    'Extract the spy from enemy territory',
    'Find and return the missing children',
  ],
  escort: [
    'Safely guide the merchant caravan through dangerous territory',
    'Protect the diplomat during peace negotiations',
    'Escort the witness to the capital for testimony',
    'Guide refugees to the safe haven',
    'Accompany the scholar to the ancient ruins',
  ],
  eliminate: [
    'Hunt down the beast terrorizing the countryside',
    'Clear the goblin infestation from the mines',
    'Defeat the bandit leader and scatter their gang',
    'Slay the dragon threatening the kingdom',
    'Destroy the undead plaguing the cemetery',
  ],
  investigate: [
    'Discover who is behind the mysterious disappearances',
    'Uncover the source of the strange magical disturbances',
    'Find out why the crops are failing',
    'Investigate the haunted manor',
    'Determine the cause of the plague',
  ],
  defend: [
    'Hold the fortress against the approaching army',
    'Protect the village from the monster attack',
    'Guard the ritual until it is complete',
    'Defend the caravan from ambush',
    'Protect the sacred site from desecration',
  ],
  explore: [
    'Map the uncharted caverns beneath the mountain',
    'Explore the newly discovered island',
    'Investigate the ancient ruins in the jungle',
    'Chart the depths of the underwater temple',
    'Survey the abandoned dwarven city',
  ],
  negotiate: [
    'Broker a peace treaty between warring factions',
    'Negotiate a trade agreement with the neighboring kingdom',
    'Convince the dragon to leave peacefully',
    'Mediate the dispute between rival guilds',
    'Secure an alliance with the elven kingdom',
  ],
  heist: [
    'Steal the crown jewels from the royal vault',
    'Infiltrate the enemy fortress and steal their battle plans',
    'Rob the corrupt merchant of his ill-gotten gains',
    'Retrieve the artifact from the wizard\'s tower',
    'Break into the prison and free the wrongly accused',
  ],
  competition: [
    'Win the grand tournament to earn the king\'s favor',
    'Compete in the mage\'s trial to join the academy',
    'Race against rival adventurers to find the treasure',
    'Prove your worth in the arena',
    'Complete the guild\'s initiation challenge',
  ],
};

const LOCATIONS = [
  'the Darkwood Forest',
  'the Misty Mountains',
  'the Sunken Temple',
  'the Burning Desert',
  'the Frozen Wastes',
  'the Haunted Castle',
  'the Endless Caverns',
  'the Floating Islands',
  'the Shadow Realm',
  'the City of Thieves',
  'the Ancient Ruins',
  'the Dragon\'s Lair',
  'the Enchanted Grove',
  'the Wizard\'s Tower',
  'the Abandoned Mine',
  'the Border Fortress',
  'the Sunken Ship',
  'the Cursed Swamp',
  'the Crystal Caves',
  'the Volcanic Island',
];

const QUEST_GIVER_NAMES = {
  noble: ['Lord Aldric', 'Lady Elara', 'Baron Thorne', 'Duchess Mirabel', 'Count Varen'],
  merchant: ['Garrick the Trader', 'Mira Goldweaver', 'Tobias Coinsworth', 'Helena Silkhand', 'Doran Ironpurse'],
  priest: ['Father Marcus', 'Sister Celeste', 'High Priest Aldwin', 'Mother Superior Vera', 'Brother Finn'],
  wizard: ['Archmage Zephyr', 'Sage Moira', 'The Mysterious Malachar', 'Enchantress Lyra', 'Wizard Thornwood'],
  commoner: ['Old Tom', 'Farmer Giles', 'Widow Martha', 'Young Billy', 'Innkeeper Rosie'],
  guard: ['Captain Steele', 'Sergeant Ironside', 'Watch Commander Vex', 'Guard Lieutenant Mira', 'Constable Bram'],
  'mysterious-stranger': ['The Hooded Figure', 'A Cloaked Messenger', 'The Shadow', 'An Anonymous Note', 'The Masked One'],
  child: ['Little Timmy', 'Young Sara', 'The Orphan Boy', 'A Crying Girl', 'The Street Urchin'],
};

const QUEST_GIVER_MOTIVATIONS = {
  noble: ['to protect their family honor', 'to expand their influence', 'to fulfill a dying wish', 'to prove their worth', 'to right an old wrong'],
  merchant: ['to recover lost profits', 'to eliminate competition', 'to secure a trade route', 'to find new markets', 'to repay a debt'],
  priest: ['to serve their deity', 'to protect the innocent', 'to cleanse evil', 'to recover a holy relic', 'to fulfill a prophecy'],
  wizard: ['to acquire rare components', 'to test a theory', 'to recover lost knowledge', 'to prevent magical disaster', 'to complete their research'],
  commoner: ['to save their family', 'to protect their home', 'to find justice', 'to escape poverty', 'to honor a promise'],
  guard: ['to maintain order', 'to protect the city', 'to catch a criminal', 'to prevent war', 'to uphold the law'],
  'mysterious-stranger': ['for reasons unknown', 'to test the worthy', 'to set events in motion', 'to fulfill an ancient pact', 'to balance the scales'],
  child: ['to save a loved one', 'to find their parents', 'to protect their friends', 'to prove themselves', 'to right a wrong'],
};

const QUEST_GIVER_DESCRIPTIONS = {
  noble: ['A well-dressed aristocrat with an air of authority', 'A worried noble pacing nervously', 'A proud lord with a stern demeanor'],
  merchant: ['A shrewd businessperson with calculating eyes', 'A desperate trader wringing their hands', 'A wealthy merchant in fine clothes'],
  priest: ['A serene cleric in ceremonial robes', 'A worried priest clutching a holy symbol', 'A stern religious figure'],
  wizard: ['An eccentric mage surrounded by floating books', 'A mysterious spellcaster in flowing robes', 'An elderly sage with knowing eyes'],
  commoner: ['A simple farmer with calloused hands', 'A worried parent with tears in their eyes', 'A humble villager in worn clothes'],
  guard: ['A stern officer in polished armor', 'A weary soldier with battle scars', 'A determined lawkeeper'],
  'mysterious-stranger': ['A cloaked figure whose face is hidden', 'A shadowy presence that speaks in whispers', 'An enigmatic messenger'],
  child: ['A frightened child with wide eyes', 'A brave young one trying to be strong', 'A desperate youth seeking help'],
};

const COMPLICATIONS = [
  { description: 'A rival group is also after the objective', severity: 'major' as const },
  { description: 'The weather turns dangerous', severity: 'minor' as const },
  { description: 'A key ally betrays the party', severity: 'critical' as const },
  { description: 'The objective is not what it seems', severity: 'major' as const },
  { description: 'Local authorities become suspicious', severity: 'minor' as const },
  { description: 'The enemy has reinforcements', severity: 'major' as const },
  { description: 'A natural disaster strikes', severity: 'critical' as const },
  { description: 'The map/information was wrong', severity: 'minor' as const },
  { description: 'An innocent is caught in the crossfire', severity: 'major' as const },
  { description: 'The quest giver has hidden motives', severity: 'critical' as const },
  { description: 'Equipment is lost or damaged', severity: 'minor' as const },
  { description: 'A curse affects the party', severity: 'major' as const },
  { description: 'Time runs shorter than expected', severity: 'minor' as const },
  { description: 'The target has powerful protection', severity: 'major' as const },
  { description: 'A third party intervenes', severity: 'minor' as const },
];

const SECRET_TWISTS = [
  'The quest giver is actually the villain',
  'The objective is cursed',
  'The "enemy" is actually innocent',
  'There is no reward - it was a trap',
  'The real threat is something else entirely',
  'A party member has a secret connection to the quest',
  'The objective has already been destroyed',
  'Completing the quest will cause greater harm',
  'The quest is a test by a powerful entity',
  'The true objective is hidden within the false one',
];

const TIME_LIMITS = [
  'before the next full moon',
  'within three days',
  'before the festival begins',
  'by sunrise tomorrow',
  'before the enemy arrives',
  'within a fortnight',
  'before winter sets in',
  'by the end of the week',
];

const REWARD_ITEMS = [
  'a magical weapon',
  'a rare potion',
  'an enchanted ring',
  'a spellbook',
  'a map to greater treasure',
  'a favor from a powerful ally',
  'land and title',
  'a magical artifact',
  'rare crafting materials',
  'a trained mount',
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
 * Generate a quest giver
 * 
 * @param type - Type of quest giver (optional, random if not specified)
 * @returns Generated quest giver
 */
export function generateQuestGiver(type?: QuestGiverType): QuestGiver {
  const types: QuestGiverType[] = ['noble', 'merchant', 'priest', 'wizard', 'commoner', 'guard', 'mysterious-stranger', 'child'];
  const selectedType = type || randomElement(types);
  
  return {
    type: selectedType,
    name: randomElement(QUEST_GIVER_NAMES[selectedType]),
    motivation: randomElement(QUEST_GIVER_MOTIVATIONS[selectedType]),
    description: randomElement(QUEST_GIVER_DESCRIPTIONS[selectedType]),
  };
}

/**
 * Generate quest reward based on difficulty
 * 
 * @param difficulty - Quest difficulty
 * @returns Generated reward
 */
export function generateReward(difficulty: QuestDifficulty): QuestReward {
  const goldRanges: Record<QuestDifficulty, { min: number; max: number }> = {
    easy: { min: 50, max: 200 },
    medium: { min: 200, max: 500 },
    hard: { min: 500, max: 2000 },
    deadly: { min: 2000, max: 10000 },
  };
  
  const range = goldRanges[difficulty];
  const gold = randomInt(range.min, range.max);
  
  const reward: QuestReward = { gold };
  
  // Add items based on difficulty
  if (difficulty === 'hard' || difficulty === 'deadly') {
    reward.items = randomElements(REWARD_ITEMS, difficulty === 'deadly' ? 2 : 1);
  }
  
  // Maybe add reputation
  if (Math.random() < 0.5) {
    const reputations = [
      'increased standing with the local guild',
      'favor with the nobility',
      'recognition from the temple',
      'fame throughout the region',
      'a powerful ally',
    ];
    reward.reputation = randomElement(reputations);
  }
  
  return reward;
}

/**
 * Generate a complete quest
 * 
 * @param options - Generation options
 * @returns Complete quest with all details
 * 
 * @example
 * ```typescript
 * const quest = generateQuest({ type: 'rescue', difficulty: 'hard' });
 * ```
 */
export function generateQuest(options: {
  type?: QuestType;
  difficulty?: QuestDifficulty;
  questGiverType?: QuestGiverType;
} = {}): Quest {
  const types: QuestType[] = ['fetch', 'rescue', 'escort', 'eliminate', 'investigate', 'defend', 'explore', 'negotiate', 'heist', 'competition'];
  const difficulties: QuestDifficulty[] = ['easy', 'medium', 'hard', 'deadly'];
  
  const type = options.type || randomElement(types);
  const difficulty = options.difficulty || randomElement(difficulties);
  
  const title = randomElement(QUEST_TITLES[type]);
  const objective = randomElement(QUEST_OBJECTIVES[type]);
  const location = randomElement(LOCATIONS);
  const questGiver = generateQuestGiver(options.questGiverType);
  
  // Generate complications based on difficulty
  const complicationCount = difficulty === 'easy' ? 1 : difficulty === 'deadly' ? 3 : 2;
  const complications = randomElements(COMPLICATIONS, complicationCount);
  
  // Maybe add time limit
  const timeLimit = Math.random() < 0.4 ? randomElement(TIME_LIMITS) : undefined;
  
  // Maybe add secret twist
  const secretTwist = Math.random() < 0.3 ? randomElement(SECRET_TWISTS) : undefined;
  
  // Generate hook and description
  const hook = generateQuestHook();
  const description = `${questGiver.description}. They seek adventurers ${questGiver.motivation}. The task: ${objective.toLowerCase()} in ${location}.`;
  
  return {
    title,
    type,
    difficulty,
    hook,
    description,
    objective,
    questGiver,
    location,
    complications,
    reward: generateReward(difficulty),
    timeLimit,
    secretTwist,
  };
}

/**
 * Format quest for display
 * 
 * @param quest - Quest to format
 * @returns Formatted string
 */
export function formatQuest(quest: Quest): string {
  const lines: string[] = [
    `# ${quest.title}`,
    `*${quest.type.charAt(0).toUpperCase() + quest.type.slice(1)} Quest - ${quest.difficulty.charAt(0).toUpperCase() + quest.difficulty.slice(1)} Difficulty*`,
    '',
    `**Hook:** ${quest.hook}`,
    '',
    quest.description,
    '',
    `**Objective:** ${quest.objective}`,
    `**Location:** ${quest.location}`,
    '',
    '## Quest Giver',
    `**${quest.questGiver.name}** (${quest.questGiver.type})`,
    quest.questGiver.description,
    `*Motivation: ${quest.questGiver.motivation}*`,
    '',
    '## Complications',
  ];
  
  for (const comp of quest.complications) {
    lines.push(`- [${comp.severity}] ${comp.description}`);
  }
  
  lines.push('', '## Reward');
  lines.push(`- ${quest.reward.gold} gold pieces`);
  if (quest.reward.items) {
    for (const item of quest.reward.items) {
      lines.push(`- ${item}`);
    }
  }
  if (quest.reward.reputation) {
    lines.push(`- ${quest.reward.reputation}`);
  }
  
  if (quest.timeLimit) {
    lines.push('', `**Time Limit:** ${quest.timeLimit}`);
  }
  
  if (quest.secretTwist) {
    lines.push('', `**Secret Twist (GM Only):** ${quest.secretTwist}`);
  }
  
  return lines.join('\n');
}

/**
 * Generate multiple quest hooks quickly
 * 
 * @param count - Number of hooks to generate
 * @returns Array of quest hook strings
 */
export function generateQuestHooks(count: number): string[] {
  const hooks: string[] = [];
  for (let i = 0; i < count; i++) {
    hooks.push(generateQuestHook());
  }
  return hooks;
}

/**
 * Get quest data for validation
 */
export function getQuestData() {
  return {
    questTypes: Object.keys(QUEST_TITLES) as QuestType[],
    locations: LOCATIONS,
    complications: COMPLICATIONS,
    secretTwists: SECRET_TWISTS,
    timeLimits: TIME_LIMITS,
    rewardItems: REWARD_ITEMS,
  };
}
