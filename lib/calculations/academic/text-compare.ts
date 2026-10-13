/**
 * Text Compare / Plagiarism Checker
 * Compares two texts to find similarities and differences
 * 
 * @module lib/calculations/academic/text-compare
 * @see Requirements 15.6
 */

export interface TextCompareResult {
  similarityPercentage: number;
  matchingWords: number;
  totalWords1: number;
  totalWords2: number;
  matchingPhrases: string[];
  uniqueToText1: string[];
  uniqueToText2: string[];
}

/**
 * Normalizes text for comparison
 * - Converts to lowercase
 * - Removes punctuation
 * - Normalizes whitespace
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts words from text
 */
function getWords(text: string): string[] {
  const normalized = normalizeText(text);
  return normalized.split(' ').filter(word => word.length > 0);
}

/**
 * Extracts n-grams (phrases of n words) from text
 */
function getNGrams(words: string[], n: number): Set<string> {
  const ngrams = new Set<string>();
  for (let i = 0; i <= words.length - n; i++) {
    ngrams.add(words.slice(i, i + n).join(' '));
  }
  return ngrams;
}

/**
 * Calculates Jaccard similarity between two sets
 */
function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

/**
 * Compares two texts and returns similarity metrics
 * 
 * @param text1 - First text to compare
 * @param text2 - Second text to compare
 * @param phraseLength - Length of phrases to check for matches (default: 3)
 * @returns TextCompareResult with similarity metrics
 */
export function compareTexts(
  text1: string,
  text2: string,
  phraseLength: number = 3
): TextCompareResult {
  const words1 = getWords(text1);
  const words2 = getWords(text2);

  const wordSet1 = new Set(words1);
  const wordSet2 = new Set(words2);

  // Find matching words
  const matchingWordSet = new Set([...wordSet1].filter(x => wordSet2.has(x)));

  // Find unique words
  const uniqueToText1 = [...wordSet1].filter(x => !wordSet2.has(x));
  const uniqueToText2 = [...wordSet2].filter(x => !wordSet1.has(x));

  // Find matching phrases (n-grams)
  const phrases1 = getNGrams(words1, phraseLength);
  const phrases2 = getNGrams(words2, phraseLength);
  const matchingPhrases = [...phrases1].filter(x => phrases2.has(x));

  // Calculate similarity using multiple metrics
  const wordSimilarity = jaccardSimilarity(wordSet1, wordSet2);
  const phraseSimilarity = jaccardSimilarity(phrases1, phrases2);

  // Weighted average (phrases are more indicative of copying)
  const similarityPercentage = Math.round(
    (wordSimilarity * 0.4 + phraseSimilarity * 0.6) * 100
  );

  return {
    similarityPercentage,
    matchingWords: matchingWordSet.size,
    totalWords1: words1.length,
    totalWords2: words2.length,
    matchingPhrases: matchingPhrases.slice(0, 20), // Limit to top 20
    uniqueToText1: uniqueToText1.slice(0, 50),
    uniqueToText2: uniqueToText2.slice(0, 50),
  };
}

/**
 * Gets a similarity rating based on percentage
 */
export function getSimilarityRating(percentage: number): {
  rating: 'low' | 'moderate' | 'high' | 'very-high';
  label: string;
  color: string;
} {
  if (percentage < 20) {
    return { rating: 'low', label: 'Lav likhet', color: 'text-green-600' };
  }
  if (percentage < 40) {
    return { rating: 'moderate', label: 'Moderat likhet', color: 'text-yellow-600' };
  }
  if (percentage < 60) {
    return { rating: 'high', label: 'Høy likhet', color: 'text-orange-600' };
  }
  return { rating: 'very-high', label: 'Svært høy likhet', color: 'text-red-600' };
}

/**
 * Highlights matching phrases in text
 */
export function highlightMatches(text: string, matchingPhrases: string[]): string {
  let result = text;

  for (const phrase of matchingPhrases) {
    const regex = new RegExp(`(?<![\\p{L}\\p{N}])${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}])`, 'giu');
    result = result.replace(regex, `**$&**`);
  }

  return result;
}
