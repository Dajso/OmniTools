/**
 * URL Encoder/Decoder
 * 
 * Encode and decode URL strings.
 * 
 * @module lib/calculations/productivity/url-encoder
 */

export interface URLEncoderInputs {
    text: string;
    mode: 'encode' | 'decode';
    encodeType: 'component' | 'full';
}

export interface URLEncoderResults {
    output: string;
    inputLength: number;
    outputLength: number;
}

/**
 * Encode URL
 */
export function encodeUrl(text: string, type: 'component' | 'full' = 'component'): string {
    if (!text) return '';

    if (type === 'component') {
        return encodeURIComponent(text);
    } else {
        return encodeURI(text);
    }
}

/**
 * Decode URL
 */
export function decodeUrl(text: string, type: 'component' | 'full' = 'component'): string {
    if (!text) return '';

    try {
        if (type === 'component') {
            return decodeURIComponent(text);
        } else {
            return decodeURI(text);
        }
    } catch {
        throw new Error('Invalid encoded URL string');
    }
}

/**
 * Convert URL
 */
export function convertUrl(inputs: URLEncoderInputs): URLEncoderResults {
    const { text, mode, encodeType } = inputs;

    if (!text.trim()) {
        return {
            output: '',
            inputLength: 0,
            outputLength: 0,
        };
    }

    const output = mode === 'encode'
        ? encodeUrl(text, encodeType)
        : decodeUrl(text, encodeType);

    return {
        output,
        inputLength: text.length,
        outputLength: output.length,
    };
}

/**
 * Common characters that get encoded
 */
export const ENCODING_REFERENCE = [
    { char: ' ', encoded: '%20', description: 'Space' },
    { char: '!', encoded: '%21', description: 'Exclamation' },
    { char: '#', encoded: '%23', description: 'Hash' },
    { char: '$', encoded: '%24', description: 'Dollar' },
    { char: '&', encoded: '%26', description: 'Ampersand' },
    { char: "'", encoded: '%27', description: 'Apostrophe' },
    { char: '(', encoded: '%28', description: 'Open paren' },
    { char: ')', encoded: '%29', description: 'Close paren' },
    { char: '+', encoded: '%2B', description: 'Plus' },
    { char: ',', encoded: '%2C', description: 'Comma' },
    { char: '/', encoded: '%2F', description: 'Slash' },
    { char: ':', encoded: '%3A', description: 'Colon' },
    { char: '=', encoded: '%3D', description: 'Equals' },
    { char: '?', encoded: '%3F', description: 'Question' },
    { char: '@', encoded: '%40', description: 'At sign' },
] as const;
