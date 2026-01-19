/**
 * Fantasy Name Data Pools
 * 
 * Pre-generated name components for various fantasy races.
 * Names are constructed by combining prefixes and suffixes.
 * 
 * @module lib/data/fantasy-names
 * @see Requirements 21.2, 21.12
 */

/**
 * Name pool structure for a specific race/gender combination
 */
export interface NamePool {
  prefixes: string[];
  suffixes: string[];
  middleParts?: string[];
}

/**
 * Supported fantasy races
 */
export const FANTASY_RACES = ['elf', 'dwarf', 'human', 'orc', 'halfling', 'dragonborn'] as const;
export type FantasyRace = typeof FANTASY_RACES[number];

/**
 * Supported genders for name generation
 */
export const GENDERS = ['male', 'female', 'neutral'] as const;
export type Gender = typeof GENDERS[number];

/**
 * Fantasy name pools organized by race and gender
 */
export const FANTASY_NAMES: Record<FantasyRace, Record<Gender, NamePool>> = {
  elf: {
    male: {
      prefixes: ['Ael', 'Ara', 'Cel', 'Eld', 'Fae', 'Gal', 'Ith', 'Leg', 'Mel', 'Nal', 'Orn', 'Pae', 'Quel', 'Ril', 'Sil', 'Thal', 'Uth', 'Val', 'Wil', 'Zan'],
      suffixes: ['andil', 'aron', 'dor', 'ion', 'las', 'mir', 'orn', 'ril', 'thil', 'wen', 'drim', 'fin', 'gorn', 'hil', 'ion', 'kar', 'lor', 'mar', 'nor', 'sar'],
    },
    female: {
      prefixes: ['Ara', 'Cel', 'Ela', 'Gal', 'Ith', 'Lir', 'Mel', 'Nar', 'Sil', 'Tar', 'Aer', 'Bri', 'Cyr', 'Dae', 'Eil', 'Fay', 'Gil', 'Hel', 'Iri', 'Jes'],
      suffixes: ['ael', 'iel', 'wen', 'riel', 'thien', 'dis', 'ril', 'ara', 'ena', 'ina', 'lia', 'mia', 'nia', 'ria', 'sia', 'tia', 'via', 'wia', 'yra', 'zara'],
    },
    neutral: {
      prefixes: ['Aer', 'Cael', 'Eil', 'Fael', 'Gael', 'Iel', 'Kael', 'Lael', 'Mael', 'Nael', 'Pael', 'Rael', 'Sael', 'Tael', 'Vael', 'Wael', 'Xael', 'Yael', 'Zael', 'Ael'],
      suffixes: ['yn', 'en', 'an', 'in', 'on', 'ar', 'er', 'ir', 'or', 'ur', 'ys', 'is', 'as', 'es', 'os', 'ax', 'ex', 'ix', 'ox', 'ux'],
    },
  },
  dwarf: {
    male: {
      prefixes: ['Bal', 'Bor', 'Dar', 'Dor', 'Dur', 'Gim', 'Glor', 'Grom', 'Kaz', 'Kil', 'Mor', 'Nor', 'Rag', 'Rok', 'Thor', 'Thur', 'Tor', 'Trag', 'Ulf', 'Var'],
      suffixes: ['in', 'im', 'ak', 'ek', 'ok', 'uk', 'ar', 'or', 'ur', 'an', 'en', 'on', 'un', 'gar', 'grim', 'din', 'dak', 'rik', 'rak', 'rok'],
    },
    female: {
      prefixes: ['Aud', 'Bel', 'Brun', 'Dag', 'Dis', 'Dura', 'Gerd', 'Hel', 'Hild', 'Kat', 'Kris', 'Myr', 'Nal', 'Rig', 'Sig', 'Thra', 'Tor', 'Ulf', 'Val', 'Vig'],
      suffixes: ['a', 'da', 'dis', 'dra', 'ga', 'gra', 'hild', 'ia', 'ina', 'ira', 'la', 'lin', 'na', 'ra', 'ria', 'sa', 'ta', 'tra', 'va', 'ya'],
    },
    neutral: {
      prefixes: ['Brak', 'Drak', 'Frak', 'Grak', 'Krak', 'Mrak', 'Prak', 'Srak', 'Trak', 'Vrak', 'Brum', 'Drum', 'Frum', 'Grum', 'Krum', 'Mrum', 'Prum', 'Srum', 'Trum', 'Vrum'],
      suffixes: ['ax', 'ex', 'ix', 'ox', 'ux', 'az', 'ez', 'iz', 'oz', 'uz', 'al', 'el', 'il', 'ol', 'ul', 'am', 'em', 'im', 'om', 'um'],
    },
  },
  human: {
    male: {
      prefixes: ['Ald', 'Bran', 'Cor', 'Dar', 'Ed', 'Gar', 'Hal', 'Jon', 'Kel', 'Lor', 'Mar', 'Ned', 'Orn', 'Per', 'Ral', 'Sar', 'Tor', 'Ulf', 'Val', 'Wil'],
      suffixes: ['an', 'en', 'in', 'on', 'ar', 'er', 'ir', 'or', 'ic', 'ric', 'win', 'mund', 'bert', 'fred', 'hard', 'ward', 'ald', 'olf', 'stan', 'ton'],
    },
    female: {
      prefixes: ['Al', 'Bel', 'Cel', 'Del', 'El', 'Fay', 'Gwen', 'Hel', 'Isa', 'Jen', 'Kat', 'Lil', 'Mar', 'Nel', 'Ol', 'Pris', 'Ros', 'Sar', 'Tess', 'Val'],
      suffixes: ['a', 'ana', 'ella', 'ina', 'isa', 'lyn', 'ra', 'ria', 'sa', 'ta', 'wen', 'ya', 'beth', 'dra', 'gail', 'hild', 'jane', 'lee', 'marie', 'rose'],
    },
    neutral: {
      prefixes: ['Ash', 'Bay', 'Cal', 'Dale', 'Elm', 'Fern', 'Glen', 'Heath', 'Ivy', 'Jay', 'Kai', 'Lake', 'Moss', 'North', 'Oak', 'Pine', 'Quinn', 'Reed', 'Sky', 'Vale'],
      suffixes: ['ley', 'ton', 'ford', 'brook', 'field', 'wood', 'dale', 'ridge', 'hill', 'vale', 'wyn', 'ren', 'lin', 'den', 'ston', 'well', 'worth', 'by', 'ham', 'wick'],
    },
  },
  orc: {
    male: {
      prefixes: ['Azog', 'Bol', 'Brug', 'Durg', 'Gash', 'Gorg', 'Grak', 'Grom', 'Gruk', 'Krag', 'Krug', 'Mog', 'Morg', 'Narg', 'Rag', 'Shag', 'Thok', 'Trag', 'Urg', 'Zog'],
      suffixes: ['ak', 'ash', 'ath', 'gash', 'gul', 'gur', 'kar', 'nak', 'og', 'ok', 'or', 'rak', 'rog', 'ruk', 'tar', 'thar', 'thok', 'uk', 'ur', 'zar'],
    },
    female: {
      prefixes: ['Bag', 'Bor', 'Dra', 'Gor', 'Gra', 'Gri', 'Kra', 'Mor', 'Nar', 'Org', 'Sha', 'Shar', 'Shur', 'Tha', 'Thra', 'Ura', 'Urg', 'Vor', 'Yag', 'Zag'],
      suffixes: ['a', 'ag', 'ak', 'ash', 'ga', 'gra', 'ka', 'la', 'na', 'ra', 'sha', 'ta', 'tha', 'tra', 'ug', 'ura', 'za', 'zag', 'zha', 'zra'],
    },
    neutral: {
      prefixes: ['Blag', 'Drog', 'Frog', 'Glog', 'Klog', 'Mlog', 'Plog', 'Slog', 'Trog', 'Vlog', 'Blug', 'Drug', 'Frug', 'Glug', 'Klug', 'Mlug', 'Plug', 'Slug', 'Trug', 'Vlug'],
      suffixes: ['ax', 'ex', 'ix', 'ox', 'ux', 'az', 'ez', 'iz', 'oz', 'uz', 'ag', 'eg', 'ig', 'og', 'ug', 'ar', 'er', 'ir', 'or', 'ur'],
    },
  },
  halfling: {
    male: {
      prefixes: ['Bil', 'Bun', 'Cor', 'Dro', 'Fal', 'Fro', 'Gar', 'Ham', 'Hob', 'Jas', 'Kel', 'Lob', 'Mer', 'Nob', 'Odo', 'Per', 'Pip', 'Sam', 'Tob', 'Wil'],
      suffixes: ['bo', 'co', 'do', 'go', 'lo', 'mo', 'no', 'po', 'ro', 'so', 'to', 'ric', 'rin', 'ron', 'rus', 'ry', 'son', 'ton', 'wick', 'wise'],
    },
    female: {
      prefixes: ['Bel', 'Cam', 'Cor', 'Daf', 'Ela', 'Fern', 'Gol', 'Hil', 'Ivy', 'Jas', 'Kel', 'Lav', 'Mag', 'Nel', 'Oli', 'Pan', 'Prim', 'Ros', 'Tan', 'Wil'],
      suffixes: ['a', 'da', 'ella', 'ia', 'ina', 'isa', 'la', 'ly', 'na', 'ra', 'ria', 'sa', 'sie', 'sy', 'ta', 'ty', 'va', 'vy', 'wen', 'ya'],
    },
    neutral: {
      prefixes: ['Ash', 'Bay', 'Bram', 'Clover', 'Dew', 'Fern', 'Glen', 'Hazel', 'Ivy', 'Juniper', 'Kale', 'Leaf', 'Moss', 'Nettle', 'Oak', 'Pebble', 'Quill', 'Reed', 'Sage', 'Thorn'],
      suffixes: ['foot', 'hand', 'heart', 'leaf', 'root', 'seed', 'stem', 'twig', 'vine', 'wood', 'brook', 'dale', 'field', 'hill', 'meadow', 'pond', 'spring', 'stream', 'vale', 'well'],
    },
  },
  dragonborn: {
    male: {
      prefixes: ['Arj', 'Bal', 'Bhar', 'Dorn', 'Ghe', 'Hes', 'Kri', 'Med', 'Nad', 'Pan', 'Pat', 'Rav', 'Sha', 'Shen', 'Tor', 'Vor', 'Wul', 'Xar', 'Yor', 'Zor'],
      suffixes: ['aan', 'ash', 'ax', 'dar', 'dak', 'gar', 'gax', 'inn', 'jhan', 'kan', 'lar', 'mar', 'nar', 'rash', 'rin', 'sar', 'thar', 'vax', 'zar', 'zin'],
    },
    female: {
      prefixes: ['Ak', 'Bir', 'Daar', 'Fae', 'Gur', 'Har', 'Jhe', 'Kal', 'Kor', 'Mir', 'Nal', 'Ori', 'Per', 'Rai', 'Sor', 'Sur', 'Tha', 'Ura', 'Vra', 'Zel'],
      suffixes: ['a', 'ann', 'ara', 'ava', 'ia', 'ira', 'ith', 'ora', 'ra', 'rinn', 'shann', 'thra', 'va', 'vra', 'wynn', 'xia', 'yra', 'zara', 'zira', 'zra'],
    },
    neutral: {
      prefixes: ['Arix', 'Brix', 'Crix', 'Drix', 'Erix', 'Frix', 'Grix', 'Hrix', 'Irix', 'Jrix', 'Krix', 'Lrix', 'Mrix', 'Nrix', 'Orix', 'Prix', 'Qrix', 'Rrix', 'Srix', 'Trix'],
      suffixes: ['ax', 'ex', 'ix', 'ox', 'ux', 'az', 'ez', 'iz', 'oz', 'uz', 'ar', 'er', 'ir', 'or', 'ur', 'an', 'en', 'in', 'on', 'un'],
    },
  },
};

/**
 * Get the name pool for a specific race and gender
 * 
 * @param race - Fantasy race
 * @param gender - Gender (defaults to 'neutral')
 * @returns Name pool with prefixes and suffixes
 */
export function getNamePool(race: FantasyRace, gender: Gender = 'neutral'): NamePool {
  const raceNames = FANTASY_NAMES[race];
  if (!raceNames) {
    throw new Error(`Unknown race: ${race}`);
  }
  
  const pool = raceNames[gender];
  if (!pool) {
    throw new Error(`Unknown gender: ${gender}`);
  }
  
  return pool;
}

/**
 * Check if a race is valid
 */
export function isValidRace(race: string): race is FantasyRace {
  return FANTASY_RACES.includes(race as FantasyRace);
}

/**
 * Check if a gender is valid
 */
export function isValidGender(gender: string): gender is Gender {
  return GENDERS.includes(gender as Gender);
}
