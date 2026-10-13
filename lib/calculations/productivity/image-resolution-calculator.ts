/**
 * Bildeoppløsning (DPI/PPI). Trykkstørrelse oppgis i cm; tommer regnes internt og vises som tilleggsinfo.
 * 
 * @module lib/calculations/productivity/image-resolution-calculator
 * @see Requirements 9.18
 */

export interface ImageResolutionInputs {
  mode: 'calculate-dpi' | 'calculate-print-size' | 'calculate-pixels';
  widthPixels?: number;
  heightPixels?: number;
  /** Trykkstørrelse i centimeter */
  widthCm?: number;
  heightCm?: number;
  dpi?: number;
}

export interface ImageResolutionResults {
  widthPixels: number;
  heightPixels: number;
  widthInches: number;
  heightInches: number;
  widthCm: number;
  heightCm: number;
  dpi: number;
  ppi: number;
  megapixels: number;
  fileSize: {
    raw: string;
    jpeg: string;
    png: string;
  };
  printQuality: string;
}

const INCHES_TO_CM = 2.54;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function getPrintQuality(dpi: number): string {
  if (dpi >= 300) return 'Utmerket (profesjonelt trykk)';
  if (dpi >= 200) return 'God (vanlig trykk)';
  if (dpi >= 150) return 'Brukbar (utkast)';
  if (dpi >= 72) return 'Kun skjerm';
  return 'Lav kvalitet';
}

export function calculateImageResolution(inputs: ImageResolutionInputs): ImageResolutionResults {
  const { mode, widthPixels, heightPixels, widthCm, heightCm, dpi } = inputs;
  const widthInches = widthCm ? widthCm / INCHES_TO_CM : undefined;
  const heightInches = heightCm ? heightCm / INCHES_TO_CM : undefined;
  
  let finalWidthPixels: number;
  let finalHeightPixels: number;
  let finalWidthInches: number;
  let finalHeightInches: number;
  let finalDpi: number;
  
  switch (mode) {
    case 'calculate-dpi':
      if (!widthPixels || !heightPixels || !widthInches || !heightInches) {
        throw new Error('Piksler og cm trengs for å regne ut DPI');
      }
      finalWidthPixels = widthPixels;
      finalHeightPixels = heightPixels;
      finalWidthInches = widthInches;
      finalHeightInches = heightInches;
      finalDpi = Math.round((widthPixels / widthInches + heightPixels / heightInches) / 2);
      break;
      
    case 'calculate-print-size':
      if (!widthPixels || !heightPixels || !dpi) {
        throw new Error('Piksler og DPI trengs for å regne ut trykkstørrelse');
      }
      finalWidthPixels = widthPixels;
      finalHeightPixels = heightPixels;
      finalDpi = dpi;
      finalWidthInches = widthPixels / dpi;
      finalHeightInches = heightPixels / dpi;
      break;
      
    case 'calculate-pixels':
      if (!widthInches || !heightInches || !dpi) {
        throw new Error('Størrelse (cm) og DPI trengs for å regne ut piksler');
      }
      finalWidthInches = widthInches;
      finalHeightInches = heightInches;
      finalDpi = dpi;
      finalWidthPixels = Math.round(widthInches * dpi);
      finalHeightPixels = Math.round(heightInches * dpi);
      break;
      
    default:
      throw new Error('Ugyldig beregningsmodus');
  }
  
  const megapixels = (finalWidthPixels * finalHeightPixels) / 1000000;
  
  // Estimate file sizes (24-bit color = 3 bytes per pixel)
  const rawBytes = finalWidthPixels * finalHeightPixels * 3;
  const jpegBytes = rawBytes * 0.1; // ~10% of raw (typical JPEG compression)
  const pngBytes = rawBytes * 0.5; // ~50% of raw (typical PNG compression)

  return {
    widthPixels: finalWidthPixels,
    heightPixels: finalHeightPixels,
    widthInches: Math.round(finalWidthInches * 100) / 100,
    heightInches: Math.round(finalHeightInches * 100) / 100,
    widthCm: Math.round(finalWidthInches * INCHES_TO_CM * 10) / 10,
    heightCm: Math.round(finalHeightInches * INCHES_TO_CM * 10) / 10,
    dpi: finalDpi,
    ppi: finalDpi, // PPI and DPI are often used interchangeably
    megapixels: Math.round(megapixels * 100) / 100,
    fileSize: {
      raw: formatFileSize(rawBytes),
      jpeg: formatFileSize(jpegBytes),
      png: formatFileSize(pngBytes),
    },
    printQuality: getPrintQuality(finalDpi),
  };
}

/** Vanlige trykkformater i centimeter */
export const COMMON_PRINT_SIZES = [
  { name: '10 × 15 cm', widthCm: 10, heightCm: 15 },
  { name: '13 × 18 cm', widthCm: 13, heightCm: 18 },
  { name: '15 × 21 cm', widthCm: 15, heightCm: 21 },
  { name: '20 × 30 cm', widthCm: 20, heightCm: 30 },
  { name: '30 × 40 cm', widthCm: 30, heightCm: 40 },
  { name: '50 × 70 cm', widthCm: 50, heightCm: 70 },
  { name: 'A5', widthCm: 14.8, heightCm: 21 },
  { name: 'A4', widthCm: 21, heightCm: 29.7 },
  { name: 'A3', widthCm: 29.7, heightCm: 42 },
  { name: 'A2', widthCm: 42, heightCm: 59.4 },
];
