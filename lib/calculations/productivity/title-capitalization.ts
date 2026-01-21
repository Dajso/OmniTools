/**
 * Title Capitalization Tool
 * 
 * Convert text to various title case formats.
 * 
 * @module lib/calculations/productivity/title-capitalization
 */

export type CapitalizationStyle =
    | 'title-case'      // AP/Chicago style title case
    | 'sentence-case'   // First word capitalized
    | 'uppercase'       // ALL CAPS
    | 'lowercase'       // all lowercase
    | 'capitalize'      // All Words Capitalized
    | 'toggle';         // tOGGLE cASE

export interface TitleCapInputs {
    text: string;
    style: CapitalizationStyle;
}

export interface TitleCapResults {
    output: string;
    wordCount: number;
    charCount: number;
}

// Words that should not be capitalized in title case (unless first/last)
const LOWERCASE_WORDS = new Set([
    'a', 'an', 'the',
    'and', 'but', 'or', 'nor', 'for', 'yet', 'so',
    'at', 'by', 'in', 'of', 'on', 'to', 'up', 'as',
    'is', 'it', 'if',
    'vs', 'vs.',
]);

/**
 * Convert to AP/Chicago style title case
 */
function toTitleCase(text: string): string {
    const words = text.split(/\s+/);

    return words.map((word, index) => {
        const lowerWord = word.toLowerCase();
        const isFirst = index === 0;
        const isLast = index === words.length - 1;

        // Always capitalize first and last word
        if (isFirst || isLast) {
            return capitalizeWord(word);
        }

        // Keep lowercase if it's a minor word
        if (LOWERCASE_WORDS.has(lowerWord)) {
            return lowerWord;
        }

        return capitalizeWord(word);
    }).join(' ');
}

/**
 * Capitalize first letter of a word
 */
function capitalizeWord(word: string): string {
    if (!word) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Convert to sentence case
 */
function toSentenceCase(text: string): string {
    const sentences = text.split(/([.!?]+\s*)/);

    return sentences.map((sentence, index) => {
        if (index % 2 === 1) return sentence; // This is punctuation + whitespace
        if (!sentence) return sentence;

        return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
    }).join('');
}

/**
 * Capitalize all words
 */
function capitalizeAll(text: string): string {
    return text.split(/\s+/).map(capitalizeWord).join(' ');
}

/**
 * Toggle case
 */
function toggleCase(text: string): string {
    return text.split('').map(char => {
        if (char === char.toUpperCase()) {
            return char.toLowerCase();
        }
        return char.toUpperCase();
    }).join('');
}

/**
 * Convert text based on style
 */
export function convertTitle(inputs: TitleCapInputs): TitleCapResults {
    const { text, style } = inputs;

    if (!text.trim()) {
        return {
            output: '',
            wordCount: 0,
            charCount: 0,
        };
    }

    let output: string;

    switch (style) {
        case 'title-case':
            output = toTitleCase(text);
            break;
        case 'sentence-case':
            output = toSentenceCase(text);
            break;
        case 'uppercase':
            output = text.toUpperCase();
            break;
        case 'lowercase':
            output = text.toLowerCase();
            break;
        case 'capitalize':
            output = capitalizeAll(text);
            break;
        case 'toggle':
            output = toggleCase(text);
            break;
        default:
            output = text;
    }

    const words = text.trim().split(/\s+/).filter(w => w.length > 0);

    return {
        output,
        wordCount: words.length,
        charCount: text.length,
    };
}

/**
 * Style options with descriptions
 */
export const CAPITALIZATION_STYLES: { style: CapitalizationStyle; name: string; description: string; example: string }[] = [
    { style: 'title-case', name: 'Title Case', description: 'AP/Chicago style capitalization', example: 'The Quick Brown Fox' },
    { style: 'sentence-case', name: 'Sentence case', description: 'Only first word capitalized', example: 'The quick brown fox' },
    { style: 'uppercase', name: 'UPPERCASE', description: 'All letters uppercase', example: 'THE QUICK BROWN FOX' },
    { style: 'lowercase', name: 'lowercase', description: 'All letters lowercase', example: 'the quick brown fox' },
    { style: 'capitalize', name: 'Capitalize Words', description: 'Every word capitalized', example: 'The Quick Brown Fox' },
    { style: 'toggle', name: 'tOGGLE cASE', description: 'Invert case of each letter', example: 'tHE qUICK bROWN fOX' },
];
