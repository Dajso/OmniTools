/**
 * Packing List Generator
 * Generates customized packing lists based on destination, weather, and trip duration
 * 
 * Features:
 * - Generate packing lists based on trip type
 * - Adjust for weather conditions
 * - Scale quantities based on trip duration
 * - Support for different activities
 * 
 * @module lib/calculations/travel/packing-list-generator
 * @see Requirements 16.4
 */

export type TripType = 'business' | 'leisure' | 'adventure' | 'beach' | 'city' | 'winter';
export type Weather = 'hot' | 'warm' | 'mild' | 'cold' | 'rainy' | 'mixed';
export type Activity = 'hiking' | 'swimming' | 'skiing' | 'formal-events' | 'sightseeing' | 'photography';

export interface TripDetails {
  duration: number; // days
  tripType: TripType;
  weather: Weather;
  activities: Activity[];
  includeToiletries: boolean;
  includeElectronics: boolean;
  includeMedical: boolean;
}

export interface PackingItem {
  name: string;
  quantity: number;
  category: PackingCategory;
  essential: boolean;
  notes?: string;
}

export type PackingCategory = 
  | 'clothing'
  | 'footwear'
  | 'toiletries'
  | 'electronics'
  | 'documents'
  | 'medical'
  | 'accessories'
  | 'activity-specific';

export interface PackingList {
  items: PackingItem[];
  tripDetails: TripDetails;
  totalItems: number;
  categories: PackingCategory[];
}

/**
 * Base clothing items for any trip
 */
const BASE_CLOTHING: PackingItem[] = [
  { name: 'Undertøy', quantity: 1, category: 'clothing', essential: true },
  { name: 'Sokker', quantity: 1, category: 'clothing', essential: true },
  { name: 'T-skjorter/overdeler', quantity: 1, category: 'clothing', essential: true },
  { name: 'Bukser/shorts', quantity: 1, category: 'clothing', essential: true },
  { name: 'Nattøy', quantity: 1, category: 'clothing', essential: false },
];

/**
 * Weather-specific clothing
 */
const WEATHER_CLOTHING: Record<Weather, PackingItem[]> = {
  hot: [
    { name: 'Shorts', quantity: 2, category: 'clothing', essential: true },
    { name: 'Tynne T-skjorter', quantity: 3, category: 'clothing', essential: true },
    { name: 'Solhatt', quantity: 1, category: 'accessories', essential: true },
    { name: 'Solbriller', quantity: 1, category: 'accessories', essential: true },
  ],
  warm: [
    { name: 'Tynne lag (lette plagg)', quantity: 2, category: 'clothing', essential: true },
    { name: 'Lett jakke', quantity: 1, category: 'clothing', essential: false },
    { name: 'Solbriller', quantity: 1, category: 'accessories', essential: true },
  ],
  mild: [
    { name: 'Langermede skjorter', quantity: 2, category: 'clothing', essential: true },
    { name: 'Tynn genser', quantity: 1, category: 'clothing', essential: true },
    { name: 'Lett jakke', quantity: 1, category: 'clothing', essential: true },
  ],
  cold: [
    { name: 'Varme gensere', quantity: 2, category: 'clothing', essential: true },
    { name: 'Vinterjakke', quantity: 1, category: 'clothing', essential: true },
    { name: 'Ullundertøy', quantity: 2, category: 'clothing', essential: true },
    { name: 'Lue', quantity: 1, category: 'accessories', essential: true },
    { name: 'Votter/hansker', quantity: 1, category: 'accessories', essential: true },
    { name: 'Skjerf', quantity: 1, category: 'accessories', essential: false },
  ],
  rainy: [
    { name: 'Regnjakke', quantity: 1, category: 'clothing', essential: true },
    { name: 'Paraply', quantity: 1, category: 'accessories', essential: true },
    { name: 'Vanntett pose', quantity: 1, category: 'accessories', essential: false },
  ],
  mixed: [
    { name: 'Klær til lagdeling', quantity: 3, category: 'clothing', essential: true },
    { name: 'Lett jakke', quantity: 1, category: 'clothing', essential: true },
    { name: 'Regnjakke', quantity: 1, category: 'clothing', essential: true },
    { name: 'Paraply', quantity: 1, category: 'accessories', essential: false },
  ],
};

/**
 * Trip type specific items
 */
const TRIP_TYPE_ITEMS: Record<TripType, PackingItem[]> = {
  business: [
    { name: 'Dress/forretningsantrekk', quantity: 2, category: 'clothing', essential: true },
    { name: 'Pene skjorter', quantity: 3, category: 'clothing', essential: true },
    { name: 'Pene sko', quantity: 1, category: 'footwear', essential: true },
    { name: 'Slips/tilbehør', quantity: 2, category: 'accessories', essential: false },
    { name: 'Visittkort', quantity: 1, category: 'documents', essential: false },
    { name: 'Datavesker', quantity: 1, category: 'accessories', essential: true },
  ],
  leisure: [
    { name: 'Hverdagsantrekk', quantity: 3, category: 'clothing', essential: true },
    { name: 'Gode gåsko', quantity: 1, category: 'footwear', essential: true },
    { name: 'Sandaler/badesandaler', quantity: 1, category: 'footwear', essential: false },
    { name: 'Dagstur-sekk', quantity: 1, category: 'accessories', essential: true },
  ],
  adventure: [
    { name: 'Hurtigtørkende klær', quantity: 3, category: 'clothing', essential: true },
    { name: 'Tursko', quantity: 1, category: 'footwear', essential: true },
    { name: 'Tursekk', quantity: 1, category: 'accessories', essential: true },
    { name: 'Drikkeflaske', quantity: 1, category: 'accessories', essential: true },
    { name: 'Førstehjelpsutstyr', quantity: 1, category: 'medical', essential: true },
    { name: 'Hodelykt/lommelykt', quantity: 1, category: 'accessories', essential: true },
  ],
  beach: [
    { name: 'Badetøy', quantity: 2, category: 'clothing', essential: true },
    { name: 'Strandkjole/overtrekk', quantity: 1, category: 'clothing', essential: false },
    { name: 'Badesandaler', quantity: 1, category: 'footwear', essential: true },
    { name: 'Badehåndkle', quantity: 1, category: 'accessories', essential: true },
    { name: 'Solkrem', quantity: 1, category: 'toiletries', essential: true },
    { name: 'Strandbag', quantity: 1, category: 'accessories', essential: false },
  ],
  city: [
    { name: 'Pene hverdagsantrekk', quantity: 3, category: 'clothing', essential: true },
    { name: 'Gode gåsko', quantity: 1, category: 'footwear', essential: true },
    { name: 'Antrekk til kvelden', quantity: 1, category: 'clothing', essential: false },
    { name: 'Bykart/reiseguide', quantity: 1, category: 'documents', essential: false },
    { name: 'Dagssekk', quantity: 1, category: 'accessories', essential: true },
  ],
  winter: [
    { name: 'Skijakke', quantity: 1, category: 'clothing', essential: true },
    { name: 'Skibukse', quantity: 1, category: 'clothing', essential: true },
    { name: 'Ullundertøy (innerste lag)', quantity: 3, category: 'clothing', essential: true },
    { name: 'Vinterstøvler', quantity: 1, category: 'footwear', essential: true },
    { name: 'Skibriller', quantity: 1, category: 'accessories', essential: true },
    { name: 'Varmeputer til hender/tær', quantity: 4, category: 'accessories', essential: false },
  ],
};

/**
 * Activity-specific items
 */
const ACTIVITY_ITEMS: Record<Activity, PackingItem[]> = {
  hiking: [
    { name: 'Tursko', quantity: 1, category: 'footwear', essential: true },
    { name: 'Tursokker', quantity: 3, category: 'clothing', essential: true },
    { name: 'Turstaver', quantity: 1, category: 'activity-specific', essential: false },
    { name: 'Niste', quantity: 1, category: 'activity-specific', essential: true },
    { name: 'Gnagsårplaster', quantity: 1, category: 'medical', essential: true },
  ],
  swimming: [
    { name: 'Badetøy', quantity: 2, category: 'clothing', essential: true },
    { name: 'Svømmebriller', quantity: 1, category: 'activity-specific', essential: false },
    { name: 'Badehette', quantity: 1, category: 'activity-specific', essential: false },
    { name: 'Hurtigtørkende håndkle', quantity: 1, category: 'accessories', essential: true },
  ],
  skiing: [
    { name: 'Skiutstyr (lei eller ta med)', quantity: 1, category: 'activity-specific', essential: true, notes: 'Vurder å leie på reisemålet' },
    { name: 'Skisokker', quantity: 3, category: 'clothing', essential: true },
    { name: 'Buff/halsvarmer', quantity: 1, category: 'accessories', essential: true },
    { name: 'Leppepomade med solfaktor', quantity: 1, category: 'toiletries', essential: true },
  ],
  'formal-events': [
    { name: 'Festantrekk', quantity: 1, category: 'clothing', essential: true },
    { name: 'Pene sko', quantity: 1, category: 'footwear', essential: true },
    { name: 'Smykker/tilbehør', quantity: 1, category: 'accessories', essential: false },
    { name: 'Draktpose', quantity: 1, category: 'accessories', essential: true },
  ],
  sightseeing: [
    { name: 'Gode gåsko', quantity: 1, category: 'footwear', essential: true },
    { name: 'Dagssekk', quantity: 1, category: 'accessories', essential: true },
    { name: 'Powerbank', quantity: 1, category: 'electronics', essential: true },
    { name: 'Reiseguide/kart', quantity: 1, category: 'documents', essential: false },
  ],
  photography: [
    { name: 'Kamera', quantity: 1, category: 'electronics', essential: true },
    { name: 'Ekstra batterier', quantity: 2, category: 'electronics', essential: true },
    { name: 'Minnekort', quantity: 2, category: 'electronics', essential: true },
    { name: 'Kamerabag', quantity: 1, category: 'accessories', essential: true },
    { name: 'Stativ', quantity: 1, category: 'activity-specific', essential: false },
    { name: 'Rengjøring til objektiv', quantity: 1, category: 'activity-specific', essential: false },
  ],
};

/**
 * Standard toiletries
 */
const TOILETRIES: PackingItem[] = [
  { name: 'Tannbørste', quantity: 1, category: 'toiletries', essential: true },
  { name: 'Tannkrem', quantity: 1, category: 'toiletries', essential: true },
  { name: 'Deodorant', quantity: 1, category: 'toiletries', essential: true },
  { name: 'Sjampo (reisestørrelse)', quantity: 1, category: 'toiletries', essential: true },
  { name: 'Balsam (reisestørrelse)', quantity: 1, category: 'toiletries', essential: false },
  { name: 'Dusjsåpe/såpe', quantity: 1, category: 'toiletries', essential: true },
  { name: 'Barberhøvel', quantity: 1, category: 'toiletries', essential: false },
  { name: 'Hudpleie', quantity: 1, category: 'toiletries', essential: false },
  { name: 'Solkrem', quantity: 1, category: 'toiletries', essential: true },
  { name: 'Leppepomade', quantity: 1, category: 'toiletries', essential: false },
];

/**
 * Standard electronics
 */
const ELECTRONICS: PackingItem[] = [
  { name: 'Mobil', quantity: 1, category: 'electronics', essential: true },
  { name: 'Mobillader', quantity: 1, category: 'electronics', essential: true },
  { name: 'Strømadapter', quantity: 1, category: 'electronics', essential: true, notes: 'Sjekk hvilken stikkontakt som brukes på reisemålet' },
  { name: 'Powerbank', quantity: 1, category: 'electronics', essential: true },
  { name: 'Hodetelefoner', quantity: 1, category: 'electronics', essential: false },
  { name: 'Lesebrett/nettbrett', quantity: 1, category: 'electronics', essential: false },
  { name: 'Bærbar PC', quantity: 1, category: 'electronics', essential: false },
  { name: 'Lader til PC', quantity: 1, category: 'electronics', essential: false },
];

/**
 * Medical/Helseting
 */
const MEDICAL: PackingItem[] = [
  { name: 'Faste medisiner', quantity: 1, category: 'medical', essential: true, notes: 'Ta med litt ekstra' },
  { name: 'Smertestillende', quantity: 1, category: 'medical', essential: true },
  { name: 'Allergitabletter', quantity: 1, category: 'medical', essential: false },
  { name: 'Reisesyketabletter', quantity: 1, category: 'medical', essential: false },
  { name: 'Plaster', quantity: 1, category: 'medical', essential: true },
  { name: 'Antibac/håndsprit', quantity: 1, category: 'medical', essential: true },
  { name: 'Myggmiddel', quantity: 1, category: 'medical', essential: false },
];

/**
 * Essential documents
 */
const DOCUMENTS: PackingItem[] = [
  { name: 'Pass', quantity: 1, category: 'documents', essential: true },
  { name: 'Legitimasjon/førerkort', quantity: 1, category: 'documents', essential: true },
  { name: 'Reiseforsikring (bevis)', quantity: 1, category: 'documents', essential: true },
  { name: 'Bekreftelser på fly og hotell', quantity: 1, category: 'documents', essential: true },
  { name: 'Bankkort/kredittkort', quantity: 1, category: 'documents', essential: true },
  { name: 'Kontanter (lokal valuta)', quantity: 1, category: 'documents', essential: true },
  { name: 'Liste over nødkontakter', quantity: 1, category: 'documents', essential: false },
  { name: 'Kopi av viktige dokumenter', quantity: 1, category: 'documents', essential: true },
];

/**
 * Scales quantity based on trip duration
 */
function scaleQuantity(baseQuantity: number, duration: number, itemName: string): number {
  // Items that don't scale with duration
  const noScaleItems = [
    'pass', 'legitimasjon', 'førerkort', 'forsikring', 'bekreftelser', 'kort', 'kontanter',
    'kontakter', 'kopi', 'mobil', 'lader', 'adapter', 'pc', 'kamera',
    'stativ', 'bag', 'veske', 'sekk', 'paraply', 'jakke', 'støvler', 'sko',
    'hatt', 'lue', 'solbriller', 'briller', 'staver', 'utstyr', 'plaster', 'kit', 'førstehjelp'
  ];

  const lowerName = itemName.toLowerCase();
  if (noScaleItems.some(item => lowerName.includes(item))) {
    return baseQuantity;
  }

  // Ting som skaleres med antall dager
  if (lowerName.includes('undertøy') || lowerName.includes('sokker')) {
    return Math.min(duration, 7); // maks en ukes forbruk
  }

  if (lowerName.includes('skjorte') || lowerName.includes('overdel')) {
    return Math.min(Math.ceil(duration * 0.7), 7);
  }

  if (lowerName.includes('bukser') || lowerName.includes('shorts')) {
    return Math.min(Math.ceil(duration * 0.4), 4);
  }

  return baseQuantity;
}

/**
 * Generates a customized packing list based on trip details
 * 
 * @param details - Trip details including duration, type, weather, and activities
 * @returns PackingList with all recommended items
 */
export function generatePackingList(details: TripDetails): PackingList {
  const items: PackingItem[] = [];
  const addedItems = new Set<string>();

  // Helper to add items without duplicates
  const addItems = (newItems: PackingItem[]) => {
    for (const item of newItems) {
      if (!addedItems.has(item.name.toLowerCase())) {
        addedItems.add(item.name.toLowerCase());
        items.push({
          ...item,
          quantity: scaleQuantity(item.quantity, details.duration, item.name),
        });
      }
    }
  };

  // Add base clothing
  addItems(BASE_CLOTHING);

  // Add weather-specific items
  addItems(WEATHER_CLOTHING[details.weather]);

  // Add trip type specific items
  addItems(TRIP_TYPE_ITEMS[details.tripType]);

  // Add activity-specific items
  for (const activity of details.activities) {
    addItems(ACTIVITY_ITEMS[activity]);
  }

  // Add optional categories
  if (details.includeToiletries) {
    addItems(TOILETRIES);
  }

  if (details.includeElectronics) {
    addItems(ELECTRONICS);
  }

  if (details.includeMedical) {
    addItems(MEDICAL);
  }

  // Always add essential documents
  addItems(DOCUMENTS);

  // Get unique categories
  const categories = [...new Set(items.map(item => item.category))];

  return {
    items,
    tripDetails: details,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    categories,
  };
}

/**
 * Filters packing list by category
 */
export function filterByCategory(list: PackingList, category: PackingCategory): PackingItem[] {
  return list.items.filter(item => item.category === category);
}

/**
 * Gets only essential items from a packing list
 */
export function getEssentialItems(list: PackingList): PackingItem[] {
  return list.items.filter(item => item.essential);
}

/**
 * Calculates estimated bag weight (rough estimate)
 * 
 * @param list - The packing list
 * @returns Estimated weight in kg
 */
export function estimateBagWeight(list: PackingList): number {
  // Rough weight estimates per category (kg per item)
  const categoryWeights: Record<PackingCategory, number> = {
    clothing: 0.3,
    footwear: 0.8,
    toiletries: 0.1,
    electronics: 0.5,
    documents: 0.05,
    medical: 0.1,
    accessories: 0.2,
    'activity-specific': 0.5,
  };

  let totalWeight = 0;
  for (const item of list.items) {
    totalWeight += categoryWeights[item.category] * item.quantity;
  }

  // Add bag weight (approximately 2-3 kg for a suitcase)
  totalWeight += 2.5;

  return Math.round(totalWeight * 10) / 10;
}

/**
 * Gets available trip types
 */
export function getTripTypes(): TripType[] {
  return ['business', 'leisure', 'adventure', 'beach', 'city', 'winter'];
}

/**
 * Gets available weather options
 */
export function getWeatherOptions(): Weather[] {
  return ['hot', 'warm', 'mild', 'cold', 'rainy', 'mixed'];
}

/**
 * Gets available activities
 */
export function getActivities(): Activity[] {
  return ['hiking', 'swimming', 'skiing', 'formal-events', 'sightseeing', 'photography'];
}
