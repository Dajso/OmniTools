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
    throw new Error('SSID må fylles ut');
  }

  if (config.securityType !== 'nopass' && (!config.password || config.password === '')) {
    throw new Error('Passord må fylles ut for sikrede nettverk');
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
    errors.push('Nettverksnavn (SSID) må fylles ut');
  } else if (config.ssid.length > 32) {
    errors.push('Nettverksnavnet (SSID) kan ikke ha mer enn 32 tegn');
  }

  if (config.securityType !== 'nopass') {
    if (!config.password || config.password === '') {
      errors.push('Passord må fylles ut for sikrede nettverk');
    } else if (config.securityType === 'WPA' && config.password.length < 8) {
      errors.push('WPA-passordet må ha minst 8 tegn');
    } else if (config.securityType === 'WPA' && config.password.length > 63) {
      errors.push('WPA-passordet kan ikke ha mer enn 63 tegn');
    } else if (config.securityType === 'WEP') {
      const validWepLengths = [5, 10, 13, 26];
      if (!validWepLengths.includes(config.password.length)) {
        errors.push('WEP-nøkkelen må ha 5, 10, 13 eller 26 tegn');
      }
    }
  }

  const validSecurityTypes: WifiSecurityType[] = ['WPA', 'WEP', 'nopass'];
  if (!validSecurityTypes.includes(config.securityType)) {
    errors.push('Ugyldig sikkerhetstype');
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
  'nopass': 'Åpent (uten passord)',
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
