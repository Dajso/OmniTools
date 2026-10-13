/**
 * Lorem Ipsum Generator
 * 
 * @module lib/calculations/productivity/lorem-ipsum-generator
 * @see Requirements 9.6
 */

export interface LoremIpsumInputs {
  type: 'paragraphs' | 'sentences' | 'words';
  count: number;
  startWithLorem: boolean;
}

export interface LoremIpsumResults {
  text: string;
  wordCount: number;
  characterCount: number;
}

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
  'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
  'explicabo', 'nemo', 'ipsam', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit',
  'fugit', 'consequuntur', 'magni', 'dolores', 'eos', 'ratione', 'sequi',
  'nesciunt', 'neque', 'porro', 'quisquam', 'nihil', 'impedit', 'quo', 'minus',
];

function getRandomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateSentence(wordCount: number = 0): string {
  const count = wordCount || Math.floor(Math.random() * 10) + 5;
  const words: string[] = [];
  
  for (let i = 0; i < count; i++) {
    words.push(getRandomWord());
  }
  
  return capitalize(words.join(' ')) + '.';
}

function generateParagraph(): string {
  const sentenceCount = Math.floor(Math.random() * 4) + 3;
  const sentences: string[] = [];
  
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence());
  }
  
  return sentences.join(' ');
}

export function generateLoremIpsum(inputs: LoremIpsumInputs): LoremIpsumResults {
  const { type, count, startWithLorem } = inputs;
  
  if (count < 1 || count > 100) {
    throw new Error('Antallet må være mellom 1 og 100');
  }

  let text = '';
  
  switch (type) {
    case 'words': {
      const words: string[] = [];
      for (let i = 0; i < count; i++) {
        words.push(getRandomWord());
      }
      text = words.join(' ');
      break;
    }
    case 'sentences': {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence());
      }
      text = sentences.join(' ');
      break;
    }
    case 'paragraphs': {
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        paragraphs.push(generateParagraph());
      }
      text = paragraphs.join('\n\n');
      break;
    }
  }

  if (startWithLorem && text.length > 0) {
    text = 'Lorem ipsum dolor sit amet, ' + text.slice(text.indexOf(' ') + 1);
  }

  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  const characterCount = text.length;

  return { text, wordCount, characterCount };
}
