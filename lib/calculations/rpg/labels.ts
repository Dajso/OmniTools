/**
 * Norske visningsnavn for rollespillverktøyene.
 * De interne nøklene (engelske) er uendret; bare det som vises er norsk.
 */

export const ABILITY_NAMES_NO: Record<string, string> = {
  Strength: 'Styrke',
  Dexterity: 'Smidighet',
  Constitution: 'Utholdenhet',
  Intelligence: 'Intelligens',
  Wisdom: 'Visdom',
  Charisma: 'Sjarme',
  strength: 'Styrke',
  dexterity: 'Smidighet',
  constitution: 'Utholdenhet',
  intelligence: 'Intelligens',
  wisdom: 'Visdom',
  charisma: 'Sjarme',
};

export const SKILL_NAMES_NO: Record<string, string> = {
  athletics: 'Atletikk',
  acrobatics: 'Akrobatikk',
  'sleight-of-hand': 'Fingerferdighet',
  stealth: 'Snik',
  arcana: 'Arkana',
  history: 'Historie',
  investigation: 'Undersøkelse',
  nature: 'Natur',
  religion: 'Religion',
  'animal-handling': 'Dyrehåndtering',
  insight: 'Innsikt',
  medicine: 'Medisin',
  perception: 'Oppmerksomhet',
  survival: 'Overlevelse',
  deception: 'Bedrag',
  intimidation: 'Skremsel',
  performance: 'Fremføring',
  persuasion: 'Overtalelse',
};

export const CLASS_NAMES_NO: Record<string, string> = {
  barbarian: 'Barbar',
  fighter: 'Kriger',
  paladin: 'Paladin',
  ranger: 'Jeger',
  bard: 'Skald',
  cleric: 'Prest',
  druid: 'Druide',
  monk: 'Munk',
  rogue: 'Tyv',
  warlock: 'Trollmann (pakt)',
  sorcerer: 'Trollkar',
  wizard: 'Magiker',
};

export const RACE_NAMES_NO: Record<string, string> = {
  elf: 'Alv',
  dwarf: 'Dverg',
  human: 'Menneske',
  orc: 'Ork',
  halfling: 'Halvling',
  dragonborn: 'Drakeætling',
};

export const GENDER_NAMES_NO: Record<string, string> = {
  male: 'Mann',
  female: 'Kvinne',
  neutral: 'Nøytral',
};

export const QUEST_TYPE_NAMES_NO: Record<string, string> = {
  fetch: 'Hent',
  rescue: 'Redning',
  escort: 'Eskorte',
  eliminate: 'Utrydd',
  investigate: 'Etterforsk',
  defend: 'Forsvar',
  explore: 'Utforsk',
  negotiate: 'Forhandle',
  heist: 'Kupp',
  competition: 'Konkurranse',
};

export const DIFFICULTY_NAMES_NO: Record<string, string> = {
  easy: 'Lett',
  medium: 'Middels',
  hard: 'Vanskelig',
  deadly: 'Dødelig',
};

export const QUEST_GIVER_NAMES_NO: Record<string, string> = {
  noble: 'adelsmann',
  merchant: 'kjøpmann',
  priest: 'prest',
  wizard: 'magiker',
  commoner: 'almue',
  guard: 'vakt',
  'mysterious-stranger': 'mystisk fremmed',
  child: 'barn',
};

export const SEVERITY_NAMES_NO: Record<string, string> = {
  minor: 'mindre',
  major: 'alvorlig',
  critical: 'kritisk',
};

export const RARITY_NAMES_NO: Record<string, string> = {
  common: 'vanlig',
  uncommon: 'uvanlig',
  rare: 'sjelden',
  'very-rare': 'svært sjelden',
  legendary: 'legendarisk',
};

export const MENU_CATEGORY_NAMES_NO: Record<string, string> = {
  food: 'mat',
  drink: 'drikke',
  special: 'spesial',
};

export const NPC_ROLE_NAMES_NO: Record<string, string> = {
  owner: 'vert',
  bartender: 'bartender',
  barmaid: 'servitør',
  cook: 'kokk',
  bouncer: 'dørvakt',
  patron: 'gjest',
  entertainer: 'underholder',
};

export const QUALITY_NAMES_NO: Record<string, string> = {
  squalid: 'elendig',
  poor: 'fattig',
  modest: 'beskjeden',
  comfortable: 'komfortabel',
  wealthy: 'velstående',
  aristocratic: 'aristokratisk',
};

/** Slår opp norsk navn, med nøkkelen som reserve. */
export function labelNo(map: Record<string, string>, key: string): string {
  return map[key] ?? key;
}
