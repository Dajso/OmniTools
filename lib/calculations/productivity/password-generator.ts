/**
 * Password Generator with Strength Indicator
 * 
 * @module lib/calculations/productivity/password-generator
 * @see Requirements 9.3
 */

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean; // Exclude similar characters like 0, O, l, 1
}

export interface PasswordResult {
  password: string;
  strength: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
  strengthScore: number; // 0-100
  entropy: number; // bits of entropy
  crackTime: string; // Human-readable crack time estimate
}

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS = '0O1lI';

/**
 * Generates a random password based on options
 */
export function generatePassword(options: PasswordOptions): PasswordResult {
  const { 
    length, 
    includeUppercase, 
    includeLowercase, 
    includeNumbers, 
    includeSymbols,
    excludeAmbiguous 
  } = options;

  // Build character set
  let charset = '';
  
  if (includeLowercase) {
    charset += excludeAmbiguous ? LOWERCASE.replace(/[l]/g, '') : LOWERCASE;
  }
  if (includeUppercase) {
    charset += excludeAmbiguous ? UPPERCASE.replace(/[OI]/g, '') : UPPERCASE;
  }
  if (includeNumbers) {
    charset += excludeAmbiguous ? NUMBERS.replace(/[01]/g, '') : NUMBERS;
  }
  if (includeSymbols) {
    charset += SYMBOLS;
  }

  // Default to lowercase if nothing selected
  if (charset.length === 0) {
    charset = LOWERCASE;
  }

  // Generate password
  let password = '';
  const charsetLength = charset.length;
  
  // Use crypto.getRandomValues for secure random generation
  const randomValues = new Uint32Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues);
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < length; i++) {
      randomValues[i] = Math.floor(Math.random() * charsetLength);
    }
  }

  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charsetLength];
  }

  // Calculate strength
  const { strength, strengthScore, entropy, crackTime } = calculateStrength(password, charset.length);

  return {
    password,
    strength,
    strengthScore,
    entropy,
    crackTime,
  };
}

/**
 * Calculates password strength based on entropy
 */
function calculateStrength(password: string, charsetSize: number): {
  strength: PasswordResult['strength'];
  strengthScore: number;
  entropy: number;
  crackTime: string;
} {
  // Calculate entropy: log2(charsetSize^length) = length * log2(charsetSize)
  const entropy = password.length * Math.log2(charsetSize);
  
  // Calculate crack time (assuming 10 billion guesses per second)
  const guessesPerSecond = 10_000_000_000;
  const possibleCombinations = Math.pow(charsetSize, password.length);
  const secondsToCrack = possibleCombinations / guessesPerSecond / 2; // Average case
  
  const crackTime = formatCrackTime(secondsToCrack);

  // Determine strength based on entropy
  let strength: PasswordResult['strength'];
  let strengthScore: number;

  if (entropy < 28) {
    strength = 'weak';
    strengthScore = Math.min(20, Math.round(entropy / 28 * 20));
  } else if (entropy < 36) {
    strength = 'fair';
    strengthScore = 20 + Math.round((entropy - 28) / 8 * 20);
  } else if (entropy < 60) {
    strength = 'good';
    strengthScore = 40 + Math.round((entropy - 36) / 24 * 20);
  } else if (entropy < 128) {
    strength = 'strong';
    strengthScore = 60 + Math.round((entropy - 60) / 68 * 20);
  } else {
    strength = 'very-strong';
    strengthScore = 80 + Math.min(20, Math.round((entropy - 128) / 50 * 20));
  }

  return { strength, strengthScore: Math.min(100, strengthScore), entropy: Math.round(entropy), crackTime };
}

/**
 * Formats crack time into human-readable string
 */
function formatCrackTime(seconds: number): string {
  if (seconds < 1) return 'Instantly';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000 * 100) return `${Math.round(seconds / 31536000)} years`;
  if (seconds < 31536000 * 1000000) return `${Math.round(seconds / 31536000 / 1000)} thousand years`;
  if (seconds < 31536000 * 1000000000) return `${Math.round(seconds / 31536000 / 1000000)} million years`;
  return 'Billions of years';
}

/**
 * Analyzes an existing password's strength
 */
export function analyzePassword(password: string): PasswordResult {
  // Determine charset size based on characters used
  let charsetSize = 0;
  
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;

  if (charsetSize === 0) charsetSize = 26; // Default

  const { strength, strengthScore, entropy, crackTime } = calculateStrength(password, charsetSize);

  return {
    password,
    strength,
    strengthScore,
    entropy,
    crackTime,
  };
}
