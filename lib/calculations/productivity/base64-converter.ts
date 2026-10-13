/**
 * Base64 Encoder/Decoder
 * 
 * @module lib/calculations/productivity/base64-converter
 * @see Requirements 9.20
 */

export interface Base64Inputs {
  text: string;
  mode: 'encode' | 'decode';
  urlSafe: boolean;
}

export interface Base64Results {
  output: string;
  inputLength: number;
  outputLength: number;
  isValid: boolean;
  error: string | null;
}

function toUrlSafe(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromUrlSafe(urlSafe: string): string {
  let base64 = urlSafe.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding if needed
  while (base64.length % 4) {
    base64 += '=';
  }
  return base64;
}

export function convertBase64(inputs: Base64Inputs): Base64Results {
  const { text, mode, urlSafe } = inputs;
  
  if (!text) {
    return {
      output: '',
      inputLength: 0,
      outputLength: 0,
      isValid: true,
      error: null,
    };
  }

  try {
    let output: string;
    
    if (mode === 'encode') {
      // Encode text to Base64
      if (typeof btoa !== 'undefined') {
        // Browser environment
        output = btoa(unescape(encodeURIComponent(text)));
      } else {
        // Node.js environment
        output = Buffer.from(text, 'utf-8').toString('base64');
      }
      
      if (urlSafe) {
        output = toUrlSafe(output);
      }
    } else {
      // Decode Base64 to text
      let base64 = text;
      
      if (urlSafe) {
        base64 = fromUrlSafe(text);
      }
      
      if (typeof atob !== 'undefined') {
        // Browser environment
        output = decodeURIComponent(escape(atob(base64)));
      } else {
        // Node.js environment
        output = Buffer.from(base64, 'base64').toString('utf-8');
      }
    }
    
    return {
      output,
      inputLength: text.length,
      outputLength: output.length,
      isValid: true,
      error: null,
    };
  } catch (e) {
    return {
      output: '',
      inputLength: text.length,
      outputLength: 0,
      isValid: false,
      error: e instanceof Error ? e.message : 'Omregningen mislyktes',
    };
  }
}

export function isValidBase64(text: string, urlSafe: boolean = false): boolean {
  if (!text) return true;
  
  try {
    let base64 = text;
    if (urlSafe) {
      base64 = fromUrlSafe(text);
    }
    
    if (typeof atob !== 'undefined') {
      atob(base64);
    } else {
      Buffer.from(base64, 'base64');
    }
    return true;
  } catch {
    return false;
  }
}
