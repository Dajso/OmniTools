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
  { name: 'Underwear', quantity: 1, category: 'clothing', essential: true },
  { name: 'Socks', quantity: 1, category: 'clothing', essential: true },
  { name: 'T-shirts/Tops', quantity: 1, category: 'clothing', essential: true },
  { name: 'Pants/Shorts', quantity: 1, category: 'clothing', essential: true },
  { name: 'Sleepwear', quantity: 1, category: 'clothing', essential: false },
];

/**
 * Weather-specific clothing
 */
const WEATHER_CLOTHING: Record<Weather, PackingItem[]> = {
  hot: [
    { name: 'Shorts', quantity: 2, category: 'clothing', essential: true },
    { name: 'Light T-shirts', quantity: 3, category: 'clothing', essential: true },
    { name: 'Sunhat', quantity: 1, category: 'accessories', essential: true },
    { name: 'Sunglasses', quantity: 1, category: 'accessories', essential: true },
  ],
  warm: [
    { name: 'Light layers', quantity: 2, category: 'clothing', essential: true },
    { name: 'Light jacket', quantity: 1, category: 'clothing', essential: false },
    { name: 'Sunglasses', quantity: 1, category: 'accessories', essential: true },
  ],
  mild: [
    { name: 'Long-sleeve shirts', quantity: 2, category: 'clothing', essential: true },
    { name: 'Light sweater', quantity: 1, category: 'clothing', essential: true },
    { name: 'Light jacket', quantity: 1, category: 'clothing', essential: true },
  ],
  cold: [
    { name: 'Warm sweaters', quantity: 2, category: 'clothing', essential: true },
    { name: 'Winter coat', quantity: 1, category: 'clothing', essential: true },
    { name: 'Thermal underwear', quantity: 2, category: 'clothing', essential: true },
    { name: 'Warm hat', quantity: 1, category: 'accessories', essential: true },
    { name: 'Gloves', quantity: 1, category: 'accessories', essential: true },
    { name: 'Scarf', quantity: 1, category: 'accessories', essential: false },
  ],
  rainy: [
    { name: 'Rain jacket', quantity: 1, category: 'clothing', essential: true },
    { name: 'Umbrella', quantity: 1, category: 'accessories', essential: true },
    { name: 'Waterproof bag', quantity: 1, category: 'accessories', essential: false },
  ],
  mixed: [
    { name: 'Layerable clothing', quantity: 3, category: 'clothing', essential: true },
    { name: 'Light jacket', quantity: 1, category: 'clothing', essential: true },
    { name: 'Rain jacket', quantity: 1, category: 'clothing', essential: true },
    { name: 'Umbrella', quantity: 1, category: 'accessories', essential: false },
  ],
};

/**
 * Trip type specific items
 */
const TRIP_TYPE_ITEMS: Record<TripType, PackingItem[]> = {
  business: [
    { name: 'Business suits/Formal wear', quantity: 2, category: 'clothing', essential: true },
    { name: 'Dress shirts', quantity: 3, category: 'clothing', essential: true },
    { name: 'Dress shoes', quantity: 1, category: 'footwear', essential: true },
    { name: 'Tie/Accessories', quantity: 2, category: 'accessories', essential: false },
    { name: 'Business cards', quantity: 1, category: 'documents', essential: false },
    { name: 'Laptop bag', quantity: 1, category: 'accessories', essential: true },
  ],
  leisure: [
    { name: 'Casual outfits', quantity: 3, category: 'clothing', essential: true },
    { name: 'Comfortable walking shoes', quantity: 1, category: 'footwear', essential: true },
    { name: 'Sandals/Flip-flops', quantity: 1, category: 'footwear', essential: false },
    { name: 'Day bag/Backpack', quantity: 1, category: 'accessories', essential: true },
  ],
  adventure: [
    { name: 'Quick-dry clothing', quantity: 3, category: 'clothing', essential: true },
    { name: 'Hiking boots', quantity: 1, category: 'footwear', essential: true },
    { name: 'Hiking backpack', quantity: 1, category: 'accessories', essential: true },
    { name: 'Water bottle', quantity: 1, category: 'accessories', essential: true },
    { name: 'First aid kit', quantity: 1, category: 'medical', essential: true },
    { name: 'Headlamp/Flashlight', quantity: 1, category: 'accessories', essential: true },
  ],
  beach: [
    { name: 'Swimsuits', quantity: 2, category: 'clothing', essential: true },
    { name: 'Beach cover-up', quantity: 1, category: 'clothing', essential: false },
    { name: 'Flip-flops', quantity: 1, category: 'footwear', essential: true },
    { name: 'Beach towel', quantity: 1, category: 'accessories', essential: true },
    { name: 'Sunscreen', quantity: 1, category: 'toiletries', essential: true },
    { name: 'Beach bag', quantity: 1, category: 'accessories', essential: false },
  ],
  city: [
    { name: 'Smart casual outfits', quantity: 3, category: 'clothing', essential: true },
    { name: 'Comfortable walking shoes', quantity: 1, category: 'footwear', essential: true },
    { name: 'Evening outfit', quantity: 1, category: 'clothing', essential: false },
    { name: 'City map/Guidebook', quantity: 1, category: 'documents', essential: false },
    { name: 'Day bag', quantity: 1, category: 'accessories', essential: true },
  ],
  winter: [
    { name: 'Ski jacket', quantity: 1, category: 'clothing', essential: true },
    { name: 'Ski pants', quantity: 1, category: 'clothing', essential: true },
    { name: 'Base layers', quantity: 3, category: 'clothing', essential: true },
    { name: 'Snow boots', quantity: 1, category: 'footwear', essential: true },
    { name: 'Ski goggles', quantity: 1, category: 'accessories', essential: true },
    { name: 'Hand/Toe warmers', quantity: 4, category: 'accessories', essential: false },
  ],
};

/**
 * Activity-specific items
 */
const ACTIVITY_ITEMS: Record<Activity, PackingItem[]> = {
  hiking: [
    { name: 'Hiking boots', quantity: 1, category: 'footwear', essential: true },
    { name: 'Hiking socks', quantity: 3, category: 'clothing', essential: true },
    { name: 'Trekking poles', quantity: 1, category: 'activity-specific', essential: false },
    { name: 'Trail snacks', quantity: 1, category: 'activity-specific', essential: true },
    { name: 'Blister kit', quantity: 1, category: 'medical', essential: true },
  ],
  swimming: [
    { name: 'Swimsuit', quantity: 2, category: 'clothing', essential: true },
    { name: 'Goggles', quantity: 1, category: 'activity-specific', essential: false },
    { name: 'Swim cap', quantity: 1, category: 'activity-specific', essential: false },
    { name: 'Quick-dry towel', quantity: 1, category: 'accessories', essential: true },
  ],
  skiing: [
    { name: 'Ski gear (rent or bring)', quantity: 1, category: 'activity-specific', essential: true, notes: 'Consider renting at destination' },
    { name: 'Ski socks', quantity: 3, category: 'clothing', essential: true },
    { name: 'Neck gaiter', quantity: 1, category: 'accessories', essential: true },
    { name: 'Lip balm with SPF', quantity: 1, category: 'toiletries', essential: true },
  ],
  'formal-events': [
    { name: 'Formal attire', quantity: 1, category: 'clothing', essential: true },
    { name: 'Dress shoes', quantity: 1, category: 'footwear', essential: true },
    { name: 'Jewelry/Accessories', quantity: 1, category: 'accessories', essential: false },
    { name: 'Garment bag', quantity: 1, category: 'accessories', essential: true },
  ],
  sightseeing: [
    { name: 'Comfortable walking shoes', quantity: 1, category: 'footwear', essential: true },
    { name: 'Day backpack', quantity: 1, category: 'accessories', essential: true },
    { name: 'Portable charger', quantity: 1, category: 'electronics', essential: true },
    { name: 'Guidebook/Maps', quantity: 1, category: 'documents', essential: false },
  ],
  photography: [
    { name: 'Camera', quantity: 1, category: 'electronics', essential: true },
    { name: 'Extra batteries', quantity: 2, category: 'electronics', essential: true },
    { name: 'Memory cards', quantity: 2, category: 'electronics', essential: true },
    { name: 'Camera bag', quantity: 1, category: 'accessories', essential: true },
    { name: 'Tripod', quantity: 1, category: 'activity-specific', essential: false },
    { name: 'Lens cleaning kit', quantity: 1, category: 'activity-specific', essential: false },
  ],
};

/**
 * Standard toiletries
 */
const TOILETRIES: PackingItem[] = [
  { name: 'Toothbrush', quantity: 1, category: 'toiletries', essential: true },
  { name: 'Toothpaste', quantity: 1, category: 'toiletries', essential: true },
  { name: 'Deodorant', quantity: 1, category: 'toiletries', essential: true },
  { name: 'Shampoo (travel size)', quantity: 1, category: 'toiletries', essential: true },
  { name: 'Conditioner (travel size)', quantity: 1, category: 'toiletries', essential: false },
  { name: 'Body wash/Soap', quantity: 1, category: 'toiletries', essential: true },
  { name: 'Razor', quantity: 1, category: 'toiletries', essential: false },
  { name: 'Skincare products', quantity: 1, category: 'toiletries', essential: false },
  { name: 'Sunscreen', quantity: 1, category: 'toiletries', essential: true },
  { name: 'Lip balm', quantity: 1, category: 'toiletries', essential: false },
];

/**
 * Standard electronics
 */
const ELECTRONICS: PackingItem[] = [
  { name: 'Phone', quantity: 1, category: 'electronics', essential: true },
  { name: 'Phone charger', quantity: 1, category: 'electronics', essential: true },
  { name: 'Power adapter', quantity: 1, category: 'electronics', essential: true, notes: 'Check destination plug type' },
  { name: 'Portable charger', quantity: 1, category: 'electronics', essential: true },
  { name: 'Headphones', quantity: 1, category: 'electronics', essential: false },
  { name: 'E-reader/Tablet', quantity: 1, category: 'electronics', essential: false },
  { name: 'Laptop', quantity: 1, category: 'electronics', essential: false },
  { name: 'Laptop charger', quantity: 1, category: 'electronics', essential: false },
];

/**
 * Medical/Health items
 */
const MEDICAL: PackingItem[] = [
  { name: 'Prescription medications', quantity: 1, category: 'medical', essential: true, notes: 'Bring extra supply' },
  { name: 'Pain relievers', quantity: 1, category: 'medical', essential: true },
  { name: 'Antihistamines', quantity: 1, category: 'medical', essential: false },
  { name: 'Motion sickness medication', quantity: 1, category: 'medical', essential: false },
  { name: 'Band-aids', quantity: 1, category: 'medical', essential: true },
  { name: 'Hand sanitizer', quantity: 1, category: 'medical', essential: true },
  { name: 'Insect repellent', quantity: 1, category: 'medical', essential: false },
];

/**
 * Essential documents
 */
const DOCUMENTS: PackingItem[] = [
  { name: 'Passport', quantity: 1, category: 'documents', essential: true },
  { name: 'ID/Driver\'s license', quantity: 1, category: 'documents', essential: true },
  { name: 'Travel insurance documents', quantity: 1, category: 'documents', essential: true },
  { name: 'Flight/Hotel confirmations', quantity: 1, category: 'documents', essential: true },
  { name: 'Credit/Debit cards', quantity: 1, category: 'documents', essential: true },
  { name: 'Cash (local currency)', quantity: 1, category: 'documents', essential: true },
  { name: 'Emergency contacts list', quantity: 1, category: 'documents', essential: false },
  { name: 'Copies of important documents', quantity: 1, category: 'documents', essential: true },
];

/**
 * Scales quantity based on trip duration
 */
function scaleQuantity(baseQuantity: number, duration: number, itemName: string): number {
  // Items that don't scale with duration
  const noScaleItems = [
    'passport', 'id', 'license', 'insurance', 'confirmations', 'cards', 'cash',
    'contacts', 'copies', 'phone', 'charger', 'adapter', 'laptop', 'camera',
    'tripod', 'bag', 'backpack', 'umbrella', 'coat', 'jacket', 'boots', 'shoes',
    'hat', 'sunglasses', 'goggles', 'poles', 'gear', 'kit'
  ];

  const lowerName = itemName.toLowerCase();
  if (noScaleItems.some(item => lowerName.includes(item))) {
    return baseQuantity;
  }

  // Items that scale with duration
  if (lowerName.includes('underwear') || lowerName.includes('socks')) {
    return Math.min(duration, 7); // Max 7 days worth
  }

  if (lowerName.includes('shirt') || lowerName.includes('top') || lowerName.includes('t-shirt')) {
    return Math.min(Math.ceil(duration * 0.7), 7);
  }

  if (lowerName.includes('pants') || lowerName.includes('shorts')) {
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
