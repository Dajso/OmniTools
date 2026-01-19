/**
 * Property Tests: Creator Economy Calculations
 * Feature: expanded-tools-categories
 * 
 * Tests for WiFi QR Code Generator and related creator tools
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  generateWifiQRContent,
  generateWifiQR,
  parseWifiQRContent,
  escapeWifiString,
  validateWifiConfig,
  type WifiConfig,
  type WifiSecurityType,
} from '@/lib/calculations/creator/wifi-qr-generator';

/**
 * Arbitrary for generating valid SSID strings (1-32 characters, no special chars for simplicity)
 */
const validSSIDArb = fc.string({ minLength: 1, maxLength: 32 })
  .filter(s => s.trim().length > 0);

/**
 * Arbitrary for generating valid WPA passwords (8-63 characters)
 */
const validWPAPasswordArb = fc.string({ minLength: 8, maxLength: 63 });

/**
 * Arbitrary for generating valid security types
 */
const validSecurityTypeArb = fc.constantFrom<WifiSecurityType>('WPA', 'WEP', 'nopass');

/**
 * Arbitrary for generating valid WEP passwords (5, 10, 13, or 26 characters)
 */
const validWEPPasswordArb = fc.oneof(
  fc.string({ minLength: 5, maxLength: 5 }),
  fc.string({ minLength: 10, maxLength: 10 }),
  fc.string({ minLength: 13, maxLength: 13 }),
  fc.string({ minLength: 26, maxLength: 26 })
);

/**
 * Arbitrary for generating valid WiFi configs
 */
const validWifiConfigArb = fc.record({
  ssid: validSSIDArb,
  password: validWPAPasswordArb,
  securityType: fc.constant<WifiSecurityType>('WPA'),
  hidden: fc.boolean(),
});

describe('WiFi QR Code Generator - Property 7: WiFi QR Code Format Compliance', () => {
  /**
   * Property 7: WiFi QR Code Format Compliance
   * Feature: expanded-tools-categories, Property 7: WiFi QR Code Format Compliance
   * 
   * *For any* SSID and password combination, the generated QR code content
   * SHALL follow the standard WiFi configuration format:
   * WIFI:T:{type};S:{ssid};P:{password};H:{hidden};;
   * 
   * **Validates: Requirements 18.12**
   */
  it('should generate QR content matching WiFi format specification', () => {
    fc.assert(
      fc.property(
        validWifiConfigArb,
        (config) => {
          const result = generateWifiQRContent(config);
          
          // Verify format matches: WIFI:T:{type};S:{ssid};P:{password};H:{hidden};;
          const formatRegex = /^WIFI:T:(WPA|WEP|nopass);S:.+;P:.*;H:(true|false);;$/;
          expect(result).toMatch(formatRegex);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: QR content should start with WIFI: prefix
   * **Validates: Requirements 18.12**
   */
  it('should always start with WIFI: prefix', () => {
    fc.assert(
      fc.property(
        validWifiConfigArb,
        (config) => {
          const result = generateWifiQRContent(config);
          expect(result.startsWith('WIFI:')).toBe(true);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: QR content should end with double semicolon
   * **Validates: Requirements 18.12**
   */
  it('should always end with double semicolon', () => {
    fc.assert(
      fc.property(
        validWifiConfigArb,
        (config) => {
          const result = generateWifiQRContent(config);
          expect(result.endsWith(';;')).toBe(true);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Security type should be correctly encoded
   * **Validates: Requirements 18.12**
   */
  it('should correctly encode security type', () => {
    fc.assert(
      fc.property(
        validWifiConfigArb,
        (config) => {
          const result = generateWifiQRContent(config);
          expect(result).toContain(`T:${config.securityType};`);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Hidden flag should be correctly encoded
   * **Validates: Requirements 18.12**
   */
  it('should correctly encode hidden flag', () => {
    fc.assert(
      fc.property(
        validWifiConfigArb,
        (config) => {
          const result = generateWifiQRContent(config);
          const expectedHidden = config.hidden ? 'true' : 'false';
          expect(result).toContain(`H:${expectedHidden};;`);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Round-trip parsing should preserve configuration
   * **Validates: Requirements 18.12**
   */
  it('should preserve configuration through round-trip parsing', () => {
    // Use simpler SSID/password without special characters for round-trip test
    const simpleSSIDArb = fc.stringMatching(/^[a-zA-Z0-9 ]{1,32}$/)
      .filter(s => s.trim().length > 0);
    const simplePasswordArb = fc.stringMatching(/^[a-zA-Z0-9]{8,63}$/);
    
    const simpleConfigArb = fc.record({
      ssid: simpleSSIDArb,
      password: simplePasswordArb,
      securityType: fc.constant<WifiSecurityType>('WPA'),
      hidden: fc.boolean(),
    });

    fc.assert(
      fc.property(
        simpleConfigArb,
        (config) => {
          const qrContent = generateWifiQRContent(config);
          const parsed = parseWifiQRContent(qrContent);
          
          expect(parsed).not.toBeNull();
          if (parsed) {
            expect(parsed.ssid).toBe(config.ssid);
            expect(parsed.password).toBe(config.password);
            expect(parsed.securityType).toBe(config.securityType);
            expect(parsed.hidden).toBe(config.hidden);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Open networks should have empty password field
   * **Validates: Requirements 18.12**
   */
  it('should have empty password for open networks', () => {
    const openNetworkArb = fc.record({
      ssid: validSSIDArb,
      password: fc.constant(''),
      securityType: fc.constant<WifiSecurityType>('nopass'),
      hidden: fc.boolean(),
    });

    fc.assert(
      fc.property(
        openNetworkArb,
        (config) => {
          const result = generateWifiQRContent(config);
          expect(result).toContain('T:nopass;');
          expect(result).toContain('P:;');
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('WiFi QR Code Generator - Escape Function Properties', () => {
  /**
   * Property: Escaping should be idempotent for already escaped strings
   * (Note: This tests that special chars are properly escaped)
   */
  it('should properly escape special characters', () => {
    const specialChars = ['\\', ';', ',', '"', ':'];
    
    specialChars.forEach(char => {
      const escaped = escapeWifiString(char);
      expect(escaped).toBe(`\\${char}`);
    });
  });

  /**
   * Property: Non-special characters should remain unchanged
   */
  it('should not modify non-special characters', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z0-9 ]+$/),
        (str) => {
          const escaped = escapeWifiString(str);
          expect(escaped).toBe(str);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('WiFi QR Code Generator - Validation Properties', () => {
  /**
   * Property: Valid configs should pass validation
   */
  it('should validate correct WPA configurations', () => {
    fc.assert(
      fc.property(
        validWifiConfigArb,
        (config) => {
          const result = validateWifiConfig(config);
          expect(result.isValid).toBe(true);
          expect(result.errors).toHaveLength(0);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Empty SSID should fail validation
   */
  it('should reject empty SSID', () => {
    fc.assert(
      fc.property(
        validWPAPasswordArb,
        fc.boolean(),
        (password, hidden) => {
          const config: WifiConfig = {
            ssid: '',
            password,
            securityType: 'WPA',
            hidden,
          };
          const result = validateWifiConfig(config);
          expect(result.isValid).toBe(false);
          expect(result.errors.some(e => e.includes('SSID'))).toBe(true);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: WPA with short password should fail validation
   */
  it('should reject WPA passwords shorter than 8 characters', () => {
    fc.assert(
      fc.property(
        validSSIDArb,
        fc.string({ minLength: 1, maxLength: 7 }),
        fc.boolean(),
        (ssid, password, hidden) => {
          const config: WifiConfig = {
            ssid,
            password,
            securityType: 'WPA',
            hidden,
          };
          const result = validateWifiConfig(config);
          expect(result.isValid).toBe(false);
          expect(result.errors.some(e => e.includes('8 characters'))).toBe(true);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
