/**
 * WiFi QR Code Generator
 * 
 * Generates QR code content for WiFi network credentials
 * following the standard WiFi configuration format.
 * 
 * @module lib/calculations/creator/wifi-qr-generator
 * @see Requirements 18.4, 18.12
 */

/**
 * WiFi security types
 */
export type WifiSecurityType = 'WPA' | 'WEP' | 'nopass';

/**
 * WiFi network configuration
 */
export interface WifiConfig {
  ssid: string;
  password: string;
  securityType: WifiSecurityType;
  hidden?: boolean;
}

/**
 * WiFi QR code generation result
 */
export interface WifiQRResult {
  qrContent: string;
  ssid: string;
  securityType: WifiSecurityType;
  isHidden: boolean;
}

/**
 * Escape special characters in WiFi QR code strings
 * 
 * Special characters that need escaping: \ ; , " :
 * 
 * @param str - String to escape
 * @returns Escaped string
 */
export function escapeWifiString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/"/g, '\\"')
    .replace(/:/g, '\\:');
}

/**
 * Generate WiFi QR code content string
 * 
 * Follows the standard WiFi configuration format:
 * WIFI:T:{type};S:{ssid};P:{password};H:{hidden};;
 * 
 * @param config - WiFi network configuration
 * @returns QR code content string
 */
export function generateWifiQRContent(config: WifiConfig): string {
  if (!config.ssid || config.ssid.trim() === '') {
    throw new Error('SSID is required');
  }

  if (config.securityType !== 'nopass' && (!config.password || config.password === '')) {
    throw new Error('Password is required for secured networks');
  }

  const escapedSSID = escapeWifiString(config.ssid);
  const escapedPassword = config.securityType === 'nopass' 
    ? '' 
    : escapeWifiString(config.password);
  const hidden = config.hidden ? 'true' : 'false';

  return `WIFI:T:${config.securityType};S:${escapedSSID};P:${escapedPassword};H:${hidden};;`;
}

/**
 * Generate WiFi QR code data
 * 
 * @param config - WiFi network configuration
 * @returns WiFi QR result with content and metadata
 */
export function generateWifiQR(config: WifiConfig): WifiQRResult {
  const qrContent = generateWifiQRContent(config);

  return {
    qrContent,
    ssid: config.ssid,
    securityType: config.securityType,
    isHidden: config.hidden || false,
  };
}

/**
 * Validate WiFi configuration
 * 
 * @param config - WiFi configuration to validate
 * @returns Validation result with errors if any
 */
export function validateWifiConfig(config: WifiConfig): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!config.ssid || config.ssid.trim() === '') {
    errors.push('Network name (SSID) is required');
  } else if (config.ssid.length > 32) {
    errors.push('Network name (SSID) cannot exceed 32 characters');
  }

  if (config.securityType !== 'nopass') {
    if (!config.password || config.password === '') {
      errors.push('Password is required for secured networks');
    } else if (config.securityType === 'WPA' && config.password.length < 8) {
      errors.push('WPA password must be at least 8 characters');
    } else if (config.securityType === 'WPA' && config.password.length > 63) {
      errors.push('WPA password cannot exceed 63 characters');
    } else if (config.securityType === 'WEP') {
      const validWepLengths = [5, 10, 13, 26];
      if (!validWepLengths.includes(config.password.length)) {
        errors.push('WEP key must be 5, 10, 13, or 26 characters');
      }
    }
  }

  const validSecurityTypes: WifiSecurityType[] = ['WPA', 'WEP', 'nopass'];
  if (!validSecurityTypes.includes(config.securityType)) {
    errors.push('Invalid security type');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Parse WiFi QR code content back to configuration
 * 
 * @param qrContent - QR code content string
 * @returns Parsed WiFi configuration or null if invalid
 */
export function parseWifiQRContent(qrContent: string): WifiConfig | null {
  // Regex to match WiFi QR format
  const wifiRegex = /^WIFI:T:(WPA|WEP|nopass);S:(.+?);P:(.*?);(?:H:(true|false)?)?;;$/;
  const match = qrContent.match(wifiRegex);

  if (!match) {
    return null;
  }

  const [, securityType, ssid, password, hidden] = match;

  // Unescape special characters
  const unescapeWifiString = (str: string): string => {
    return str
      .replace(/\\:/g, ':')
      .replace(/\\"/g, '"')
      .replace(/\\,/g, ',')
      .replace(/\\;/g, ';')
      .replace(/\\\\/g, '\\');
  };

  return {
    ssid: unescapeWifiString(ssid),
    password: unescapeWifiString(password),
    securityType: securityType as WifiSecurityType,
    hidden: hidden === 'true',
  };
}

/**
 * Security type display names
 */
export const SECURITY_TYPE_LABELS: Record<WifiSecurityType, string> = {
  'WPA': 'WPA/WPA2/WPA3',
  'WEP': 'WEP (Legacy)',
  'nopass': 'Open (No Password)',
};

/**
 * Get security type options for UI
 */
export function getSecurityTypeOptions(): { value: WifiSecurityType; label: string }[] {
  return [
    { value: 'WPA', label: SECURITY_TYPE_LABELS['WPA'] },
    { value: 'WEP', label: SECURITY_TYPE_LABELS['WEP'] },
    { value: 'nopass', label: SECURITY_TYPE_LABELS['nopass'] },
  ];
}
