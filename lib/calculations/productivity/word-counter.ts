/**
 * Word Counter with Character and Sentence Counts
 * 
 * @module lib/calculations/productivity/word-counter
 * @see Requirements 9.1
 */

export interface WordCountInputs {
  text: string;
}

export interface WordCountResults {
  wordCount: number;
  characterCount: number;
  characterCountNoSpaces: number;
  sentenceCount: number;
  paragraphCount: number;
  averageWordLength: number;
  readingTime: number; // in minutes
  speakingTime: number; // in minutes
}

/**
 * Counts words, characters, sentences, and paragraphs in text
 * 
 * @param inputs - The text to analyze
 * @returns Word count statistics
 */
export function countWords(inputs: WordCountInputs): WordCountResults {
  const { text } = inputs;
  
  // Handle empty text
  if (!text || text.trim().length === 0) {
    return {
      wordCount: 0,
      characterCount: 0,
      characterCountNoSpaces: 0,
      sentenceCount: 0,
      paragraphCount: 0,
      averageWordLength: 0,
      readingTime: 0,
      speakingTime: 0,
    };
  }

  // Character counts
  const characterCount = text.length;
  const characterCountNoSpaces = text.replace(/\s/g, '').length;

  // Word count - split by whitespace and filter empty strings
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  // Sentence count - count periods, exclamation marks, and question marks
  // Handle abbreviations and decimals by looking for sentence-ending punctuation followed by space or end
  const sentenceMatches = text.match(/[.!?]+(?:\s|$)/g);
  const sentenceCount = sentenceMatches ? sentenceMatches.length : (wordCount > 0 ? 1 : 0);

  // Paragraph count - split by double newlines or more
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const paragraphCount = paragraphs.length || (wordCount > 0 ? 1 : 0);

  // Average word length
  const totalWordLength = words.reduce((sum, word) => sum + word.replace(/[^a-zA-Z0-9]/g, '').length, 0);
  const averageWordLength = wordCount > 0 ? totalWordLength / wordCount : 0;

  // Reading time (average 200 words per minute)
  const readingTime = wordCount / 200;

  // Speaking time (average 150 words per minute)
  const speakingTime = wordCount / 150;

  return {
    wordCount,
    characterCount,
    characterCountNoSpaces,
    sentenceCount,
    paragraphCount,
    averageWordLength: Math.round(averageWordLength * 10) / 10,
    readingTime: Math.round(readingTime * 10) / 10,
    speakingTime: Math.round(speakingTime * 10) / 10,
  };
}
