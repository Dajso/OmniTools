/**
 * Regex Tester
 * 
 * Test regular expressions with live matching and group extraction.
 * 
 * @module lib/calculations/productivity/regex-tester
 */

export interface RegexInputs {
    pattern: string;
    testString: string;
    flags: {
        global: boolean;
        caseInsensitive: boolean;
        multiline: boolean;
        dotAll: boolean;
        unicode: boolean;
    };
}

export interface RegexMatch {
    match: string;
    index: number;
    groups: Record<string, string> | null;
    captureGroups: string[];
}

export interface RegexResults {
    isValid: boolean;
    error: string | null;
    matches: RegexMatch[];
    matchCount: number;
    flags: string;
    highlightedText: { text: string; isMatch: boolean }[];
}

/**
 * Build flags string from flags object
 */
function buildFlagsString(flags: RegexInputs['flags']): string {
    let result = '';
    if (flags.global) result += 'g';
    if (flags.caseInsensitive) result += 'i';
    if (flags.multiline) result += 'm';
    if (flags.dotAll) result += 's';
    if (flags.unicode) result += 'u';
    return result;
}

/**
 * Validate regex pattern
 */
export function validatePattern(pattern: string, flags: string): { isValid: boolean; error: string | null } {
    if (!pattern) {
        return { isValid: false, error: 'Skriv inn et mønster' };
    }

    try {
        new RegExp(pattern, flags);
        return { isValid: true, error: null };
    } catch (e) {
        return {
            isValid: false,
            error: e instanceof Error ? e.message : 'Ugyldig regex-mønster'
        };
    }
}

/**
 * Test regex pattern against a string
 */
export function testRegex(inputs: RegexInputs): RegexResults {
    const { pattern, testString, flags } = inputs;

    const flagsString = buildFlagsString(flags);

    // Validate pattern first
    const validation = validatePattern(pattern, flagsString);
    if (!validation.isValid) {
        return {
            isValid: false,
            error: validation.error,
            matches: [],
            matchCount: 0,
            flags: flagsString,
            highlightedText: [{ text: testString, isMatch: false }],
        };
    }

    if (!testString) {
        return {
            isValid: true,
            error: null,
            matches: [],
            matchCount: 0,
            flags: flagsString,
            highlightedText: [],
        };
    }

    const regex = new RegExp(pattern, flagsString);
    const matches: RegexMatch[] = [];

    // Use matchAll for global flag, or exec once for non-global
    if (flags.global) {
        for (const match of testString.matchAll(regex)) {
            matches.push({
                match: match[0],
                index: match.index || 0,
                groups: match.groups || null,
                captureGroups: match.slice(1),
            });
        }
    } else {
        const match = regex.exec(testString);
        if (match) {
            matches.push({
                match: match[0],
                index: match.index || 0,
                groups: match.groups || null,
                captureGroups: match.slice(1),
            });
        }
    }

    // Build highlighted text segments
    const highlightedText: { text: string; isMatch: boolean }[] = [];
    let lastIndex = 0;

    for (const m of matches) {
        // Add non-matching text before this match
        if (m.index > lastIndex) {
            highlightedText.push({
                text: testString.slice(lastIndex, m.index),
                isMatch: false,
            });
        }
        // Add the match
        highlightedText.push({
            text: m.match,
            isMatch: true,
        });
        lastIndex = m.index + m.match.length;
    }

    // Add remaining text after last match
    if (lastIndex < testString.length) {
        highlightedText.push({
            text: testString.slice(lastIndex),
            isMatch: false,
        });
    }

    return {
        isValid: true,
        error: null,
        matches,
        matchCount: matches.length,
        flags: flagsString,
        highlightedText,
    };
}

/**
 * Common regex patterns for quick reference
 */
export const COMMON_PATTERNS = [
    { name: 'E-post', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', description: 'Finner e-postadresser' },
    { name: 'URL', pattern: 'https?://[\\w.-]+(?:\\.[\\w.-]+)+[\\w.,@?^=%&:/~+#-]*', description: 'Finner HTTP/HTTPS-adresser' },
    { name: 'Telefon (Norge)', pattern: '(?:\\+47|0047)?\\s?\\d{2}\\s?\\d{2}\\s?\\d{2}\\s?\\d{2}', description: 'Finner norske telefonnumre (8 siffer, evt. med +47)' },
    { name: 'IP-adresse (v4)', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', description: 'Finner IPv4-adresser' },
    { name: 'HEX-farge', pattern: '#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})', description: 'Finner HEX-fargekoder' },
    { name: 'Dato (ÅÅÅÅ-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}', description: 'Finner datoer i ISO-format' },
    { name: 'Dato (DD.MM.ÅÅÅÅ)', pattern: '\\d{2}\\.\\d{2}\\.\\d{4}', description: 'Finner datoer i norsk format' },
    { name: 'Postnummer', pattern: '\\b\\d{4}\\b', description: 'Finner norske postnumre (4 siffer)' },
    { name: 'Organisasjonsnummer', pattern: '\\b\\d{3}\\s?\\d{3}\\s?\\d{3}\\b', description: 'Finner organisasjonsnumre (9 siffer)' },
    { name: 'Klokkeslett (TT:MM)', pattern: '([01]\\d|2[0-3]):[0-5]\\d', description: 'Finner klokkeslett i 24-timersformat' },
    { name: 'Kun ord', pattern: '\\b[a-zA-ZæøåÆØÅ]+\\b', description: 'Finner ord med bokstaver' },
    { name: 'Kun tall', pattern: '\\d+', description: 'Finner ett eller flere sifre' },
    { name: 'Bokstaver og tall', pattern: '[a-zA-Z0-9æøåÆØÅ]+', description: 'Finner bokstaver og tall' },
    { name: 'Mellomrom', pattern: '\\s+', description: 'Finner mellomromstegn' },
    { name: 'HTML-tagger', pattern: '<[^>]+>', description: 'Finner HTML-tagger' },
    { name: 'Brukernavn', pattern: '^[a-zA-Z0-9_]{3,16}$', description: 'Finner vanlige brukernavn (3–16 tegn)' },
    { name: 'Passord (sterkt)', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$', description: 'Finner sterke passord' },
] as const;

/**
 * Escape special regex characters in a string
 */
export function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
