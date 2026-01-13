export type ToolCategory = 
  | 'finance' 
  | 'health' 
  | 'home' 
  | 'converter' 
  | 'productivity';

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
