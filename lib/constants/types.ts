export type ToolCategory = 
  | 'finance' 
  | 'health' 
  | 'home' 
  | 'converter' 
  | 'productivity'
  // New expanded categories (Requirements 15-32)
  | 'academic'      // Category F: Student & Academic Tools
  | 'travel'        // Category G: Travel & Digital Nomad Tools
  | 'gaming'        // Category H: Gaming & E-Sports Tools
  | 'creator'       // Category I: Creator Economy Tools
  | 'fun'           // Category J: Fun & Psychology Tools
  | 'audio'         // Category K: Audio & Music Tools
  | 'rpg'           // Category L: Tabletop RPG Tools
  | 'crypto'        // Category N: Crypto & Web3 Tools
  | 'photo'         // Category O: Photography & Video Tools
  | 'crafts'        // Category P: Knitting & Sewing Tools
  | 'garden'        // Category Q: Gardening Tools
  | 'electronics'   // Category R: Electronics Tools
  | 'betting'       // Category S: Sports Betting Tools
  | 'auto'          // Category T: Automotive Tools
  | 'stats'         // Category U: Statistics Tools
  | 'time'          // Category V: Time & Date Tools
  | 'physics'       // Category X: Physics Tools
  | 'construction'  // Category Y: Construction Tools
  | 'coffee';       // Coffee & Barista Tools

export type UnitCategory = 
  | 'length' 
  | 'weight' 
  | 'temperature' 
  | 'volume' 
  | 'area' 
  | 'speed' 
  | 'time' 
  | 'data' 
  | 'pressure' 
  | 'energy';

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  keywords: string[];
  path: string;
  icon: string;
  featured?: boolean;
  relatedTools?: string[];
  // New optional fields for expanded categories
  seasonal?: 'finals' | 'back-to-school' | 'tax-season' | 'holiday';
  requiresLibrary?: ('jspdf' | 'recharts' | 'react-qr-code' | 'tone')[];
  offlineCapable?: boolean;
}

export interface ConversionUnit {
  id: string;
  name: string;
  symbol: string;
  category: UnitCategory;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

/**
 * Serializable version of ConversionUnit for passing to client components
 * Does not include functions which cannot be serialized
 */
export interface SerializableUnit {
  id: string;
  name: string;
  symbol: string;
  category: UnitCategory;
}
