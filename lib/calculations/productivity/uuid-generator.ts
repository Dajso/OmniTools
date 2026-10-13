/**
 * UUID Generator
 * 
 * @module lib/calculations/productivity/uuid-generator
 * @see Requirements 9.5
 */

export interface UUIDInputs {
  count: number;
  version: 'v4' | 'v1-like';
  uppercase: boolean;
  hyphens: boolean;
}

export interface UUIDResults {
  uuids: string[];
}

/**
 * Generates a UUID v4 (random)
 */
function generateUUIDv4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Generates a UUID v1-like (time-based, not RFC compliant)
 */
function generateUUIDv1Like(): string {
  const now = Date.now();
  const timeHex = now.toString(16).padStart(12, '0');
  const random = Math.random().toString(16).substring(2, 14);
  
  return `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-1${random.slice(0, 3)}-${random.slice(3, 7)}-${random.slice(7, 13)}${Math.random().toString(16).substring(2, 8)}`.slice(0, 36);
}

export function generateUUIDs(inputs: UUIDInputs): UUIDResults {
  const { count, version, uppercase, hyphens } = inputs;
  
  if (count < 1 || count > 100) {
    throw new Error('Antallet må være mellom 1 og 100');
  }

  const uuids: string[] = [];
  
  for (let i = 0; i < count; i++) {
    let uuid = version === 'v4' ? generateUUIDv4() : generateUUIDv1Like();
    
    if (!hyphens) {
      uuid = uuid.replace(/-/g, '');
    }
    
    if (uppercase) {
      uuid = uuid.toUpperCase();
    }
    
    uuids.push(uuid);
  }

  return { uuids };
}
