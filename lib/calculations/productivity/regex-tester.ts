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
        return { isValid: false, error: 'Please enter a pattern' };
    }

    try {
        new RegExp(pattern, flags);
        return { isValid: true, error: null };
    } catch (e) {
        return {
            isValid: false,
            error: e instanceof Error ? e.message : 'Invalid regex pattern'
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
    { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', description: 'Matches email addresses' },
    { name: 'URL', pattern: 'https?://[\\w.-]+(?:\\.[\\w.-]+)+[\\w.,@?^=%&:/~+#-]*', description: 'Matches HTTP/HTTPS URLs' },
    { name: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}', description: 'Matches US phone numbers' },
    { name: 'IP Address (v4)', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', description: 'Matches IPv4 addresses' },
    { name: 'Hex Color', pattern: '#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})', description: 'Matches hex color codes' },
    { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}', description: 'Matches dates in ISO format' },
    { name: 'Date (MM/DD/YYYY)', pattern: '\\d{2}/\\d{2}/\\d{4}', description: 'Matches dates in US format' },
    { name: 'Time (HH:MM)', pattern: '([01]\\d|2[0-3]):[0-5]\\d', description: 'Matches 24-hour time' },
    { name: 'Words Only', pattern: '\\b[a-zA-Z]+\\b', description: 'Matches alphabetic words' },
    { name: 'Numbers Only', pattern: '\\d+', description: 'Matches one or more digits' },
    { name: 'Alphanumeric', pattern: '[a-zA-Z0-9]+', description: 'Matches letters and numbers' },
    { name: 'Whitespace', pattern: '\\s+', description: 'Matches whitespace characters' },
    { name: 'HTML Tags', pattern: '<[^>]+>', description: 'Matches HTML tags' },
    { name: 'Username', pattern: '^[a-zA-Z0-9_]{3,16}$', description: 'Matches typical usernames (3-16 chars)' },
    { name: 'Password (Strong)', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$', description: 'Matches strong passwords' },
] as const;

/**
 * Escape special regex characters in a string
 */
export function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
