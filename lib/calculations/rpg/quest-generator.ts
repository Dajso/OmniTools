/**
 * Quest Idea Generator
 * 
 * Generates random adventure hooks and quest ideas for tabletop RPGs.
 * 
 * @module lib/calculations/rpg/quest-generator
 * @see Requirements 21.10
 */

import { generateQuestHook } from './name-generator';
import { QUEST_TYPE_NAMES_NO, DIFFICULTY_NAMES_NO, QUEST_GIVER_NAMES_NO, SEVERITY_NAMES_NO } from './labels';

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
    'Det tapte artefaktet',
    'Skaff relikvien',
    'Slektskatten som forsvant',
    'Samle ingrediensene',
    'Tyvegodset',
  ],
  rescue: [
    'Red gislene',
    'Den bortførte adelsmannen',
    'Redningsoppdrag',
    'Frigjør fangene',
    'Det savnede barnet',
  ],
  escort: [
    'Trygg ferd',
    'Karavanevakten',
    'Beskytt vitnet',
    'Det diplomatiske oppdraget',
    'Reisen mot trygghet',
  ],
  eliminate: [
    'Jakt på udyret',
    'Rydd plagen',
    'Dusørjeger',
    'Drep monsteret',
    'Stans trusselen',
  ],
  investigate: [
    'Mysteriet tykner',
    'Avdekk sannheten',
    'De merkelige hendelsene',
    'Finn gjerningspersonen',
    'Løs gåten',
  ],
  defend: [
    'Hold stillingen',
    'Beskytt landsbyen',
    'Beleiringen',
    'Vaktoppdrag',
    'Siste forsvar',
  ],
  explore: [
    'Inn i det ukjente',
    'Kartlegg området',
    'Den forsvunne ekspedisjonen',
    'Oppdag ruinene',
    'Kartlegg dypet',
  ],
  negotiate: [
    'Mekle fred',
    'Handelsavtalen',
    'Diplomatisk krise',
    'Avgjør striden',
    'Bygg en allianse',
  ],
  heist: [
    'Det store kuppet',
    'Stjel kronen',
    'Den umulige jobben',
    'Innsidejobb',
    'Den perfekte forbrytelsen',
  ],
  competition: [
    'Den store turneringen',
    'Bevis hva du er verdt',
    'Konkurransen',
    'Kamp mot klokka',
    'Utfordringen',
  ],
};

const QUEST_OBJECTIVES = {
  fetch: [
    'Hent det eldgamle artefaktet fra fangehullet',
    'Samle sjeldne ingredienser til en mektig trylledrikk',
    'Skaff tilbake den stjålne slektskatten',
    'Finn og lever tilbake den forsvunne leveransen',
    'Samle bevis for sammensvergelsen',
  ],
  rescue: [
    'Frigjør fangene fra fiendens festning',
    'Red den bortførte adelsmannen før løsepengefristen går ut',
    'Red overlevende fra den sammenrast gruva',
    'Hent spionen ut av fiendeland',
    'Finn og bring tilbake de savnede barna',
  ],
  escort: [
    'Led handelskaravanen trygt gjennom farlig land',
    'Beskytt diplomaten under fredsforhandlingene',
    'Eskorter vitnet til hovedstaden for å vitne',
    'Led flyktningene til tilfluktsstedet',
    'Følg læremesteren til de eldgamle ruinene',
  ],
  eliminate: [
    'Jakt på udyret som skremmer bygda',
    'Rens gruvene for goblinplagen',
    'Beseir røverhøvdingen og spre banden',
    'Drep dragen som truer riket',
    'Ødelegg de udøde som herjer kirkegården',
  ],
  investigate: [
    'Finn ut hvem som står bak de mystiske forsvinningene',
    'Avdekk kilden til de merkelige magiske forstyrrelsene',
    'Finn ut hvorfor avlingene svikter',
    'Undersøk herskapsgården som spøker',
    'Finn årsaken til pesten',
  ],
  defend: [
    'Hold festningen mot hæren som nærmer seg',
    'Beskytt landsbyen mot monsterangrepet',
    'Vokt ritualet til det er fullført',
    'Forsvar karavanen mot bakhold',
    'Beskytt det hellige stedet mot vanhelligelse',
  ],
  explore: [
    'Kartlegg de ukjente hulene under fjellet',
    'Utforsk den nyoppdagede øya',
    'Undersøk de eldgamle ruinene i jungelen',
    'Kartlegg dypet i undervannstempelet',
    'Utforsk den forlatte dvergebyen',
  ],
  negotiate: [
    'Mekle en fredsavtale mellom stridende grupper',
    'Forhandle frem en handelsavtale med naboriket',
    'Overbevis dragen om å dra i fred',
    'Mekle i striden mellom rivaliserende laug',
    'Sikre en allianse med alverriket',
  ],
  heist: [
    'Stjel kronjuvelene fra kongens hvelv',
    'Snik deg inn i fiendens festning og stjel krigsplanene',
    'Frarøv den korrupte kjøpmannen hans urettmessige vinning',
    'Hent artefaktet fra trollmannens tårn',
    'Bryt deg inn i fengselet og frigjør de uskyldig dømte',
  ],
  competition: [
    'Vinn den store turneringen for å få kongens gunst',
    'Delta i magikerprøven for å komme inn på akademiet',
    'Kappløp mot rivaliserende eventyrere for å finne skatten',
    'Bevis hva du duger til i arenaen',
    'Fullfør lagets opptaksprøve',
  ],
};

const LOCATIONS = [
  'Mørkeskogen',
  'Tåkefjellene',
  'det sunkne tempelet',
  'den brennende ørkenen',
  'de frosne ødemarkene',
  'det hjemsøkte slottet',
  'de endeløse hulene',
  'de flytende øyene',
  'skyggeriket',
  'tyvenes by',
  'de eldgamle ruinene',
  'dragens hule',
  'den fortryllede lunden',
  'trollmannens tårn',
  'den forlatte gruva',
  'grensefestningen',
  'det sunkne skipet',
  'den forbannede myra',
  'krystallhulene',
  'vulkanøya',
];

const QUEST_GIVER_NAMES = {
  noble: ['Herr Aldric', 'Frue Elara', 'Baron Thorne', 'Hertuginne Mirabel', 'Greve Varen'],
  merchant: ['Garrick kjøpmannen', 'Mira Gullvever', 'Tobias Myntverd', 'Helena Silkehånd', 'Doran Jernpung'],
  priest: ['Pater Marcus', 'Søster Celeste', 'Yppersteprest Aldwin', 'Abbedisse Vera', 'Bror Finn'],
  wizard: ['Erkemagiker Zephyr', 'Vismann Moira', 'Den mystiske Malachar', 'Trollkvinne Lyra', 'Trollmann Tornskog'],
  commoner: ['Gamle Tom', 'Bonde Gunnar', 'Enke Marta', 'Unge Bjørn', 'Vertinne Rosa'],
  guard: ['Kaptein Stål', 'Sersjant Jernside', 'Vaktsjef Vex', 'Vaktløytnant Mira', 'Konstabel Bram'],
  'mysterious-stranger': ['Den hettekledde skikkelsen', 'Et kappekledd bud', 'Skyggen', 'En anonym lapp', 'Den maskerte'],
  child: ['Lille Tim', 'Unge Sara', 'Foreldreløse gutten', 'En gråtende jente', 'Gatebarnet'],
};

const QUEST_GIVER_MOTIVATIONS = {
  noble: ['for å verne familiens ære', 'for å utvide innflytelsen sin', 'for å oppfylle et dødsønske', 'for å bevise hva de duger til', 'for å rette opp en gammel urett'],
  merchant: ['for å vinne tilbake tapt fortjeneste', 'for å fjerne konkurrenter', 'for å sikre en handelsrute', 'for å finne nye markeder', 'for å betale tilbake gjeld'],
  priest: ['for å tjene guden sin', 'for å beskytte de uskyldige', 'for å rense bort ondskap', 'for å skaffe tilbake en hellig relikvie', 'for å oppfylle en profeti'],
  wizard: ['for å skaffe sjeldne ingredienser', 'for å teste en teori', 'for å gjenvinne tapt kunnskap', 'for å hindre en magisk katastrofe', 'for å fullføre forskningen sin'],
  commoner: ['for å redde familien sin', 'for å verne hjemmet sitt', 'for å få rettferdighet', 'for å slippe unna fattigdom', 'for å holde et løfte'],
  guard: ['for å opprettholde orden', 'for å beskytte byen', 'for å fange en forbryter', 'for å hindre krig', 'for å håndheve loven'],
  'mysterious-stranger': ['av ukjente grunner', 'for å prøve de verdige', 'for å sette hendelser i gang', 'for å innfri en eldgammel pakt', 'for å bringe balanse'],
  child: ['for å redde en kjær', 'for å finne foreldrene sine', 'for å beskytte vennene sine', 'for å bevise seg selv', 'for å rette opp en urett'],
};

const QUEST_GIVER_DESCRIPTIONS = {
  noble: ['En velkledd aristokrat med myndig framtoning', 'En bekymret adelsmann som går nervøst fram og tilbake', 'En stolt herre med streng framtoning'],
  merchant: ['En skarp forretningsperson med regnende blikk', 'En desperat handelsmann som vrir hendene', 'En rik kjøpmann i fine klær'],
  priest: ['En rolig prest i seremonikåpe', 'En bekymret prest som griper et hellig symbol', 'En streng religiøs skikkelse'],
  wizard: ['En eksentrisk magiker omgitt av svevende bøker', 'En mystisk trollmann i flagrende kapper', 'En gammel vismann med vitende øyne'],
  commoner: ['En enkel bonde med harde never', 'En bekymret forelder med tårer i øynene', 'En ydmyk landsbyboer i slitte klær'],
  guard: ['En streng offiser i blank rustning', 'En sliten soldat med krigsarr', 'En fast lovhåndhever'],
  'mysterious-stranger': ['En kappekledd skikkelse med skjult ansikt', 'En skyggeaktig skikkelse som snakker i hviskende toner', 'Et gåtefullt bud'],
  child: ['Et redd barn med store øyne', 'En modig ung som prøver å være sterk', 'En desperat ungdom som søker hjelp'],
};

const COMPLICATIONS = [
  { description: 'En rivaliserende gruppe er også ute etter målet', severity: 'major' as const },
  { description: 'Været blir farlig', severity: 'minor' as const },
  { description: 'En viktig alliert forråder gruppen', severity: 'critical' as const },
  { description: 'Målet er ikke det det ser ut til å være', severity: 'major' as const },
  { description: 'Myndighetene blir mistenksomme', severity: 'minor' as const },
  { description: 'Fienden har forsterkninger', severity: 'major' as const },
  { description: 'En naturkatastrofe rammer', severity: 'critical' as const },
  { description: 'Kartet eller opplysningene var feil', severity: 'minor' as const },
  { description: 'En uskyldig havner midt i striden', severity: 'major' as const },
  { description: 'Oppdragsgiveren har skjulte motiver', severity: 'critical' as const },
  { description: 'Utstyr går tapt eller blir ødelagt', severity: 'minor' as const },
  { description: 'En forbannelse rammer gruppen', severity: 'major' as const },
  { description: 'Tiden går fortere enn ventet', severity: 'minor' as const },
  { description: 'Målet har kraftig beskyttelse', severity: 'major' as const },
  { description: 'En tredjepart griper inn', severity: 'minor' as const },
];

const SECRET_TWISTS = [
  'Oppdragsgiveren er egentlig skurken',
  'Målet er forbannet',
  '«Fienden» er egentlig uskyldig',
  'Det er ingen belønning – det var en felle',
  'Den virkelige trusselen er noe helt annet',
  'Et gruppemedlem har en hemmelig forbindelse til oppdraget',
  'Målet er allerede ødelagt',
  'Å fullføre oppdraget vil gjøre større skade',
  'Oppdraget er en prøve fra en mektig makt',
  'Det egentlige målet er skjult bak det falske',
];

const TIME_LIMITS = [
  'før neste fullmåne',
  'innen tre dager',
  'før festen begynner',
  'innen soloppgang i morgen',
  'før fienden kommer',
  'innen fjorten dager',
  'før vinteren setter inn',
  'innen uka er omme',
];

const REWARD_ITEMS = [
  'et magisk våpen',
  'en sjelden trylledrikk',
  'en fortryllet ring',
  'en trylleformelbok',
  'et kart til en enda større skatt',
  'en tjeneste fra en mektig alliert',
  'land og tittel',
  'et magisk artefakt',
  'sjeldne håndverksmaterialer',
  'en dressert ridehest',
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
      'bedre standing hos det lokale lauget',
      'gunst hos adelen',
      'anerkjennelse fra tempelet',
      'berømmelse i hele regionen',
      'en mektig alliert',
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
  const description = `${questGiver.description}. Vedkommende søker eventyrere ${questGiver.motivation}. Oppdraget: ${objective.charAt(0).toLowerCase() + objective.slice(1)} (sted: ${location}).`;

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
  const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
  const lines: string[] = [
    `# ${quest.title}`,
    `*${cap(QUEST_TYPE_NAMES_NO[quest.type] ?? quest.type)}-oppdrag – ${(DIFFICULTY_NAMES_NO[quest.difficulty] ?? quest.difficulty).toLowerCase()} vanskelighetsgrad*`,
    '',
    `**Krok:** ${quest.hook}`,
    '',
    quest.description,
    '',
    `**Mål:** ${quest.objective}`,
    `**Sted:** ${quest.location}`,
    '',
    '## Oppdragsgiver',
    `**${quest.questGiver.name}** (${QUEST_GIVER_NAMES_NO[quest.questGiver.type] ?? quest.questGiver.type})`,
    quest.questGiver.description,
    `*Motivasjon: ${quest.questGiver.motivation}*`,
    '',
    '## Komplikasjoner',
  ];

  for (const comp of quest.complications) {
    lines.push(`- [${SEVERITY_NAMES_NO[comp.severity] ?? comp.severity}] ${comp.description}`);
  }

  lines.push('', '## Belønning');
  lines.push(`- ${quest.reward.gold} gullstykker`);
  if (quest.reward.items) {
    for (const item of quest.reward.items) {
      lines.push(`- ${item}`);
    }
  }
  if (quest.reward.reputation) {
    lines.push(`- ${quest.reward.reputation}`);
  }

  if (quest.timeLimit) {
    lines.push('', `**Tidsfrist:** ${quest.timeLimit}`);
  }

  if (quest.secretTwist) {
    lines.push('', `**Hemmelig vri (kun for spilleder):** ${quest.secretTwist}`);
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
