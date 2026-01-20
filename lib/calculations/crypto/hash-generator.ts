/**
 * Hash Generator
 * 
 * Generates cryptographic hashes using SHA-256 and Keccak-256 algorithms.
 * Uses the Web Crypto API for SHA-256 and a pure JavaScript implementation
 * for Keccak-256 (used in Ethereum).
 * 
 * @module lib/calculations/crypto/hash-generator
 * @see Requirements 22.5
 */

/**
 * Error class for hash generation errors
 */
export class HashGeneratorError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'unsupported_algorithm' | 'encoding_error',
    public field?: string
  ) {
    super(message);
    this.name = 'HashGeneratorError';
  }
}

/**
 * Supported hash algorithms
 */
export type HashAlgorithm = 'sha256' | 'keccak256' | 'sha1' | 'sha384' | 'sha512';

/**
 * Input encoding types
 */
export type InputEncoding = 'utf8' | 'hex';

/**
 * Output encoding types
 */
export type OutputEncoding = 'hex' | 'base64';

/**
 * Hash generation input
 */
export interface HashInput {
  /** The data to hash */
  data: string;
  /** The hash algorithm to use */
  algorithm: HashAlgorithm;
  /** Input encoding (default: utf8) */
  inputEncoding?: InputEncoding;
  /** Output encoding (default: hex) */
  outputEncoding?: OutputEncoding;
}

/**
 * Hash generation result
 */
export interface HashResult {
  /** The generated hash */
  hash: string;
  /** The algorithm used */
  algorithm: HashAlgorithm;
  /** The input data */
  input: string;
  /** Hash length in bits */
  bitLength: number;
  /** Hash with 0x prefix (for Ethereum compatibility) */
  hashWithPrefix: string;
}


/**
 * Convert a hex string to Uint8Array
 */
function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  if (cleanHex.length % 2 !== 0) {
    throw new HashGeneratorError(
      'Invalid hex string length',
      'encoding_error',
      'data'
    );
  }
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
  }
  return bytes;
}

/**
 * Convert Uint8Array to hex string
 */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert Uint8Array to base64 string
 */
function bytesToBase64(bytes: Uint8Array): string {
  // Use btoa for browser compatibility
  const binary = String.fromCharCode(...bytes);
  return btoa(binary);
}

/**
 * Convert string to Uint8Array based on encoding
 */
function stringToBytes(str: string, encoding: InputEncoding): Uint8Array {
  if (encoding === 'hex') {
    return hexToBytes(str);
  }
  // UTF-8 encoding
  return new TextEncoder().encode(str);
}

/**
 * Keccak-256 implementation (used in Ethereum)
 * This is a simplified implementation for client-side use
 */
const KECCAK_ROUNDS = 24;
const KECCAK_RC = [
  0x0000000000000001n, 0x0000000000008082n, 0x800000000000808an,
  0x8000000080008000n, 0x000000000000808bn, 0x0000000080000001n,
  0x8000000080008081n, 0x8000000000008009n, 0x000000000000008an,
  0x0000000000000088n, 0x0000000080008009n, 0x000000008000000an,
  0x000000008000808bn, 0x800000000000008bn, 0x8000000000008089n,
  0x8000000000008003n, 0x8000000000008002n, 0x8000000000000080n,
  0x000000000000800an, 0x800000008000000an, 0x8000000080008081n,
  0x8000000000008080n, 0x0000000080000001n, 0x8000000080008008n,
];

const KECCAK_ROTC = [
  1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 2, 14,
  27, 41, 56, 8, 25, 43, 62, 18, 39, 61, 20, 44,
];

const KECCAK_PILN = [
  10, 7, 11, 17, 18, 3, 5, 16, 8, 21, 24, 4,
  15, 23, 19, 13, 12, 2, 20, 14, 22, 9, 6, 1,
];

function rotl64(x: bigint, n: number): bigint {
  const mask = 0xffffffffffffffffn;
  return ((x << BigInt(n)) | (x >> BigInt(64 - n))) & mask;
}

function keccakF(state: bigint[]): void {
  const mask = 0xffffffffffffffffn;

  for (let round = 0; round < KECCAK_ROUNDS; round++) {
    // Theta
    const c: bigint[] = [];
    for (let x = 0; x < 5; x++) {
      c[x] = state[x] ^ state[x + 5] ^ state[x + 10] ^ state[x + 15] ^ state[x + 20];
    }

    const d: bigint[] = [];
    for (let x = 0; x < 5; x++) {
      d[x] = c[(x + 4) % 5] ^ rotl64(c[(x + 1) % 5], 1);
    }

    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        state[x + y * 5] ^= d[x];
      }
    }

    // Rho and Pi
    let t = state[1];
    for (let i = 0; i < 24; i++) {
      const j = KECCAK_PILN[i];
      const temp = state[j];
      state[j] = rotl64(t, KECCAK_ROTC[i]);
      t = temp;
    }

    // Chi
    for (let y = 0; y < 5; y++) {
      const row: bigint[] = [];
      for (let x = 0; x < 5; x++) {
        row[x] = state[x + y * 5];
      }
      for (let x = 0; x < 5; x++) {
        state[x + y * 5] = row[x] ^ ((~row[(x + 1) % 5] & mask) & row[(x + 2) % 5]);
      }
    }

    // Iota
    state[0] ^= KECCAK_RC[round];
  }
}


function keccak256(data: Uint8Array): Uint8Array {
  const rate = 136; // (1600 - 256 * 2) / 8
  const capacity = 64; // 256 * 2 / 8

  // Pad the message
  const padLen = rate - (data.length % rate);
  const padded = new Uint8Array(data.length + padLen);
  padded.set(data);
  padded[data.length] = 0x01;
  padded[padded.length - 1] |= 0x80;

  // Initialize state
  const state: bigint[] = new Array(25).fill(0n);

  // Absorb
  for (let i = 0; i < padded.length; i += rate) {
    for (let j = 0; j < rate / 8; j++) {
      const offset = i + j * 8;
      let lane = 0n;
      for (let k = 0; k < 8; k++) {
        lane |= BigInt(padded[offset + k]) << BigInt(k * 8);
      }
      state[j] ^= lane;
    }
    keccakF(state);
  }

  // Squeeze (only need 32 bytes for keccak256)
  const output = new Uint8Array(32);
  for (let i = 0; i < 4; i++) {
    const lane = state[i];
    for (let j = 0; j < 8; j++) {
      output[i * 8 + j] = Number((lane >> BigInt(j * 8)) & 0xffn);
    }
  }

  return output;
}

/**
 * Generate a hash using the specified algorithm
 * 
 * @param input - Hash generation input
 * @returns Hash result
 */
export async function generateHash(input: HashInput): Promise<HashResult> {
  const {
    data,
    algorithm,
    inputEncoding = 'utf8',
    outputEncoding = 'hex',
  } = input;

  // Validate input
  if (!data && data !== '') {
    throw new HashGeneratorError(
      'Data is required',
      'invalid_input',
      'data'
    );
  }

  // Convert input to bytes
  const bytes = stringToBytes(data, inputEncoding);

  let hashBytes: Uint8Array;
  let bitLength: number;

  if (algorithm === 'keccak256') {
    // Use our Keccak-256 implementation
    hashBytes = keccak256(bytes);
    bitLength = 256;
  } else {
    // Use Web Crypto API for SHA algorithms
    const webCryptoAlgorithm = {
      sha256: 'SHA-256',
      sha1: 'SHA-1',
      sha384: 'SHA-384',
      sha512: 'SHA-512',
    }[algorithm];

    if (!webCryptoAlgorithm) {
      throw new HashGeneratorError(
        `Unsupported algorithm: ${algorithm}`,
        'unsupported_algorithm',
        'algorithm'
      );
    }

    // Create a new Uint8Array with ArrayBuffer to satisfy TypeScript 5.7+ type requirements
    const buffer = new ArrayBuffer(bytes.length);
    const view = new Uint8Array(buffer);
    view.set(bytes);

    const hashBuffer = await crypto.subtle.digest(webCryptoAlgorithm, view as any as BufferSource);
    hashBytes = new Uint8Array(hashBuffer);
    bitLength = hashBytes.length * 8;
  }

  // Convert to output encoding
  const hash = outputEncoding === 'hex'
    ? bytesToHex(hashBytes)
    : bytesToBase64(hashBytes);

  return {
    hash,
    algorithm,
    input: data,
    bitLength,
    hashWithPrefix: `0x${outputEncoding === 'hex' ? hash : bytesToHex(hashBytes)}`,
  };
}

/**
 * Generate SHA-256 hash (convenience function)
 * 
 * @param data - Data to hash
 * @returns SHA-256 hash as hex string
 */
export async function sha256(data: string): Promise<string> {
  const result = await generateHash({ data, algorithm: 'sha256' });
  return result.hash;
}

/**
 * Generate Keccak-256 hash (convenience function)
 * Used in Ethereum for address generation and signatures
 * 
 * @param data - Data to hash
 * @returns Keccak-256 hash as hex string
 */
export async function keccak256Hash(data: string): Promise<string> {
  const result = await generateHash({ data, algorithm: 'keccak256' });
  return result.hash;
}

/**
 * Generate Keccak-256 hash from hex input (for Ethereum compatibility)
 * 
 * @param hexData - Hex-encoded data to hash
 * @returns Keccak-256 hash as hex string with 0x prefix
 */
export async function keccak256Hex(hexData: string): Promise<string> {
  const result = await generateHash({
    data: hexData,
    algorithm: 'keccak256',
    inputEncoding: 'hex',
  });
  return result.hashWithPrefix;
}

/**
 * Hash algorithm information
 */
export const HASH_ALGORITHMS: Record<HashAlgorithm, {
  name: string;
  bitLength: number;
  description: string;
  useCase: string;
}> = {
  sha256: {
    name: 'SHA-256',
    bitLength: 256,
    description: 'Secure Hash Algorithm 2 (256-bit)',
    useCase: 'Bitcoin, general cryptography',
  },
  keccak256: {
    name: 'Keccak-256',
    bitLength: 256,
    description: 'Keccak (SHA-3 candidate) 256-bit',
    useCase: 'Ethereum addresses, signatures',
  },
  sha1: {
    name: 'SHA-1',
    bitLength: 160,
    description: 'Secure Hash Algorithm 1 (deprecated)',
    useCase: 'Legacy systems (not recommended)',
  },
  sha384: {
    name: 'SHA-384',
    bitLength: 384,
    description: 'Secure Hash Algorithm 2 (384-bit)',
    useCase: 'High-security applications',
  },
  sha512: {
    name: 'SHA-512',
    bitLength: 512,
    description: 'Secure Hash Algorithm 2 (512-bit)',
    useCase: 'High-security applications',
  },
};
