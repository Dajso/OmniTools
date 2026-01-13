/**
 * Image Resolution Calculator (DPI/PPI)
 * 
 * @module lib/calculations/productivity/image-resolution-calculator
 * @see Requirements 9.18
 */

export interface ImageResolutionInputs {
  mode: 'calculate-dpi' | 'calculate-print-size' | 'calculate-pixels';
  widthPixels?: number;
  heightPixels?: number;
  widthInches?: number;
  heightInches?: number;
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
  if (dpi >= 300) return 'Excellent (Professional Print)';
  if (dpi >= 200) return 'Good (Standard Print)';
  if (dpi >= 150) return 'Fair (Draft Print)';
  if (dpi >= 72) return 'Screen Only';
  return 'Low Quality';
}

export function calculateImageResolution(inputs: ImageResolutionInputs): ImageResolutionResults {
  const { mode, widthPixels, heightPixels, widthInches, heightInches, dpi } = inputs;
  
  let finalWidthPixels: number;
  let finalHeightPixels: number;
  let finalWidthInches: number;
  let finalHeightInches: number;
  let finalDpi: number;
  
  switch (mode) {
    case 'calculate-dpi':
      if (!widthPixels || !heightPixels || !widthInches || !heightInches) {
        throw new Error('Pixels and inches are required to calculate DPI');
      }
      finalWidthPixels = widthPixels;
      finalHeightPixels = heightPixels;
      finalWidthInches = widthInches;
      finalHeightInches = heightInches;
      finalDpi = Math.round((widthPixels / widthInches + heightPixels / heightInches) / 2);
      break;
      
    case 'calculate-print-size':
      if (!widthPixels || !heightPixels || !dpi) {
        throw new Error('Pixels and DPI are required to calculate print size');
      }
      finalWidthPixels = widthPixels;
      finalHeightPixels = heightPixels;
      finalDpi = dpi;
      finalWidthInches = widthPixels / dpi;
      finalHeightInches = heightPixels / dpi;
      break;
      
    case 'calculate-pixels':
      if (!widthInches || !heightInches || !dpi) {
        throw new Error('Inches and DPI are required to calculate pixels');
      }
      finalWidthInches = widthInches;
      finalHeightInches = heightInches;
      finalDpi = dpi;
      finalWidthPixels = Math.round(widthInches * dpi);
      finalHeightPixels = Math.round(heightInches * dpi);
      break;
      
    default:
      throw new Error('Invalid calculation mode');
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
    widthCm: Math.round(finalWidthInches * INCHES_TO_CM * 100) / 100,
    heightCm: Math.round(finalHeightInches * INCHES_TO_CM * 100) / 100,
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

export const COMMON_PRINT_SIZES = [
  { name: '4x6"', width: 4, height: 6 },
  { name: '5x7"', width: 5, height: 7 },
  { name: '8x10"', width: 8, height: 10 },
  { name: '11x14"', width: 11, height: 14 },
  { name: '16x20"', width: 16, height: 20 },
  { name: 'A4', width: 8.27, height: 11.69 },
  { name: 'A3', width: 11.69, height: 16.54 },
  { name: 'Letter', width: 8.5, height: 11 },
];
