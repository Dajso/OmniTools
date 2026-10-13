/**
 * Case Converter (upper, lower, title, sentence)
 * 
 * @module lib/calculations/productivity/case-converter
 * @see Requirements 9.7
 */

export type CaseType = 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'pascal' | 'snake' | 'kebab';

export interface CaseConvertInputs {
  text: string;
  targetCase: CaseType;
}

export interface CaseConvertResults {
  converted: string;
  originalCase: string;
}

function toTitleCase(text: string): string {
  return text.toLowerCase().replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
}

function toSentenceCase(text: string): string {
  return text.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s*\p{L})/gu, (char) => char.toUpperCase());
}

function toCamelCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+(.)/gu, (_, char) => char.toUpperCase())
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
}

function toPascalCase(text: string): string {
  const camel = toCamelCase(text);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function toSnakeCase(text: string): string {
  return text
    .replace(/(\p{Ll})(\p{Lu})/gu, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

function toKebabCase(text: string): string {
  return text
    .replace(/(\p{Ll})(\p{Lu})/gu, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function detectCase(text: string): string {
  if (text === text.toUpperCase()) return 'UPPERCASE';
  if (text === text.toLowerCase()) return 'lowercase';
  if (/^[a-z]+([A-Z][a-z]*)*$/.test(text)) return 'camelCase';
  if (/^[A-Z][a-z]*([A-Z][a-z]*)*$/.test(text)) return 'PascalCase';
  if (/^[a-z]+(_[a-z]+)*$/.test(text)) return 'snake_case';
  if (/^[a-z]+(-[a-z]+)*$/.test(text)) return 'kebab-case';
  return 'Mixed';
}

export function convertCase(inputs: CaseConvertInputs): CaseConvertResults {
  const { text, targetCase } = inputs;
  
  if (!text) {
    return { converted: '', originalCase: 'Empty' };
  }

  const originalCase = detectCase(text);
  let converted: string;

  switch (targetCase) {
    case 'upper':
      converted = text.toUpperCase();
      break;
    case 'lower':
      converted = text.toLowerCase();
      break;
    case 'title':
      converted = toTitleCase(text);
      break;
    case 'sentence':
      converted = toSentenceCase(text);
      break;
    case 'camel':
      converted = toCamelCase(text);
      break;
    case 'pascal':
      converted = toPascalCase(text);
      break;
    case 'snake':
      converted = toSnakeCase(text);
      break;
    case 'kebab':
      converted = toKebabCase(text);
      break;
    default:
      converted = text;
  }

  return { converted, originalCase };
}
