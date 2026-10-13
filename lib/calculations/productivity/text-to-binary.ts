/**
 * Text to Binary Converter
 * 
 * @module lib/calculations/productivity/text-to-binary
 * @see Requirements 9.8
 */

export interface TextBinaryInputs {
  text: string;
  mode: 'encode' | 'decode';
  separator: string;
}

export interface TextBinaryResults {
  output: string;
  byteCount: number;
}

export function convertTextBinary(inputs: TextBinaryInputs): TextBinaryResults {
  const { text, mode, separator } = inputs;
  
  if (!text) {
    return { output: '', byteCount: 0 };
  }

  if (mode === 'encode') {
    // Text to Binary
    const binary = text
      .split('')
      .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(separator);
    
    return { output: binary, byteCount: text.length };
  } else {
    // Binary to Text
    const cleanBinary = text.replace(/[^01]/g, '');
    
    if (cleanBinary.length % 8 !== 0) {
      throw new Error('Ugyldig binær streng: lengden må være et multiplum av 8');
    }
    
    const bytes = cleanBinary.match(/.{8}/g) || [];
    const decoded = bytes
      .map(byte => String.fromCharCode(parseInt(byte, 2)))
      .join('');
    
    return { output: decoded, byteCount: bytes.length };
  }
}
