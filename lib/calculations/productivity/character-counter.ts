/**
 * Character Counter with Spaces Toggle
 * 
 * @module lib/calculations/productivity/character-counter
 * @see Requirements 9.2
 */

export interface CharacterCountInputs {
  text: string;
  includeSpaces: boolean;
}

export interface CharacterCountResults {
  totalCharacters: number;
  charactersNoSpaces: number;
  letters: number;
  digits: number;
  specialCharacters: number;
  spaces: number;
  lines: number;
}

export function countCharacters(inputs: CharacterCountInputs): CharacterCountResults {
  const { text, includeSpaces } = inputs;
  
  if (!text) {
    return {
      totalCharacters: 0,
      charactersNoSpaces: 0,
      letters: 0,
      digits: 0,
      specialCharacters: 0,
      spaces: 0,
      lines: 0,
    };
  }

  const totalCharacters = text.length;
  const spaces = (text.match(/\s/g) || []).length;
  const charactersNoSpaces = totalCharacters - spaces;
  const letters = (text.match(/\p{L}/gu) || []).length;
  const digits = (text.match(/[0-9]/g) || []).length;
  const specialCharacters = (text.match(/[^\p{L}\p{N}\s]/gu) || []).length;
  const lines = text.split('\n').length;

  return {
    totalCharacters: includeSpaces ? totalCharacters : charactersNoSpaces,
    charactersNoSpaces,
    letters,
    digits,
    specialCharacters,
    spaces,
    lines,
  };
}
