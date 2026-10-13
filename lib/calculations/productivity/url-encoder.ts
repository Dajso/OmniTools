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
        throw new Error('Ugyldig kodet URL');
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
    { char: ' ', encoded: '%20', description: 'Mellomrom' },
    { char: '!', encoded: '%21', description: 'Utropstegn' },
    { char: '#', encoded: '%23', description: 'Hash (firkant)' },
    { char: '$', encoded: '%24', description: 'Dollartegn' },
    { char: '&', encoded: '%26', description: 'Og-tegn' },
    { char: "'", encoded: '%27', description: 'Apostrof' },
    { char: '(', encoded: '%28', description: 'Venstreparentes' },
    { char: ')', encoded: '%29', description: 'Høyreparentes' },
    { char: '+', encoded: '%2B', description: 'Pluss' },
    { char: ',', encoded: '%2C', description: 'Komma' },
    { char: '/', encoded: '%2F', description: 'Skråstrek' },
    { char: ':', encoded: '%3A', description: 'Kolon' },
    { char: '=', encoded: '%3D', description: 'Er lik' },
    { char: '?', encoded: '%3F', description: 'Spørsmålstegn' },
    { char: '@', encoded: '%40', description: 'Alfakrøll' },
] as const;
