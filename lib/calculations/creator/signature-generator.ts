/**
 * Signature Generator
 * Generates SVG handwriting-style signatures from text input
 */

export interface SignatureConfig {
  name: string;
  style: SignatureStyle;
  color: string;
  strokeWidth: number;
  fontSize: number;
}

export type SignatureStyle = 'cursive' | 'elegant' | 'bold' | 'casual' | 'artistic';

export interface SignatureResult {
  svg: string;
  dataUrl: string;
  width: number;
  height: number;
}

// Font families for different signature styles
export const SIGNATURE_FONTS: Record<SignatureStyle, { fontFamily: string; letterSpacing: string; slant: number }> = {
  cursive: { fontFamily: "'Dancing Script', cursive", letterSpacing: '0.05em', slant: -5 },
  elegant: { fontFamily: "'Great Vibes', cursive", letterSpacing: '0.02em', slant: -8 },
  bold: { fontFamily: "'Permanent Marker', cursive", letterSpacing: '0.03em', slant: 0 },
  casual: { fontFamily: "'Caveat', cursive", letterSpacing: '0.04em', slant: -3 },
  artistic: { fontFamily: "'Pacifico', cursive", letterSpacing: '0.01em', slant: -6 },
};

export const SIGNATURE_COLORS = [
  { value: '#000000', label: 'Svart' },
  { value: '#1a365d', label: 'Marineblå' },
  { value: '#2d3748', label: 'Mørkegrå' },
  { value: '#744210', label: 'Brun' },
  { value: '#1e40af', label: 'Kongeblå' },
  { value: '#7c3aed', label: 'Lilla' },
  { value: '#dc2626', label: 'Rød' },
  { value: '#059669', label: 'Grønn' },
];

/**
 * Generate an SVG signature from the given configuration
 */
export function generateSignatureSVG(config: SignatureConfig): SignatureResult {
  const { name, style, color, strokeWidth, fontSize } = config;
  const fontConfig = SIGNATURE_FONTS[style];
  
  // Calculate dimensions based on text length and font size
  const estimatedWidth = Math.max(300, name.length * fontSize * 0.6);
  const height = fontSize * 2;
  const padding = 20;
  const width = estimatedWidth + padding * 2;

  // Create SVG with handwriting effect
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&amp;family=Great+Vibes&amp;family=Permanent+Marker&amp;family=Caveat:wght@400;700&amp;family=Pacifico&amp;display=swap');
    </style>
    <filter id="handwritten" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
  <text 
    x="${padding}" 
    y="${height * 0.65}" 
    font-family="${fontConfig.fontFamily}" 
    font-size="${fontSize}px" 
    fill="${color}"
    stroke="${color}"
    stroke-width="${strokeWidth * 0.1}"
    letter-spacing="${fontConfig.letterSpacing}"
    transform="rotate(${fontConfig.slant}, ${width / 2}, ${height / 2})"
    filter="url(#handwritten)"
  >${escapeXml(name)}</text>
</svg>`;

  // Create data URL for download/preview
  const dataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;

  return {
    svg,
    dataUrl,
    width,
    height,
  };
}

/**
 * Generate a signature with an underline flourish
 */
export function generateSignatureWithUnderline(config: SignatureConfig): SignatureResult {
  const { name, style, color, strokeWidth, fontSize } = config;
  const fontConfig = SIGNATURE_FONTS[style];
  
  const estimatedWidth = Math.max(300, name.length * fontSize * 0.6);
  const height = fontSize * 2.5;
  const padding = 20;
  const width = estimatedWidth + padding * 2;
  const textY = height * 0.55;
  const underlineY = textY + fontSize * 0.3;

  // Create a wavy underline path
  const underlinePath = generateUnderlinePath(padding, underlineY, width - padding * 2, strokeWidth);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&amp;family=Great+Vibes&amp;family=Permanent+Marker&amp;family=Caveat:wght@400;700&amp;family=Pacifico&amp;display=swap');
    </style>
    <filter id="handwritten" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
  <text 
    x="${padding}" 
    y="${textY}" 
    font-family="${fontConfig.fontFamily}" 
    font-size="${fontSize}px" 
    fill="${color}"
    stroke="${color}"
    stroke-width="${strokeWidth * 0.1}"
    letter-spacing="${fontConfig.letterSpacing}"
    transform="rotate(${fontConfig.slant}, ${width / 2}, ${height / 2})"
    filter="url(#handwritten)"
  >${escapeXml(name)}</text>
  <path 
    d="${underlinePath}" 
    fill="none" 
    stroke="${color}" 
    stroke-width="${strokeWidth}"
    stroke-linecap="round"
    filter="url(#handwritten)"
  />
</svg>`;

  const dataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;

  return {
    svg,
    dataUrl,
    width,
    height,
  };
}

/**
 * Generate a wavy underline path
 */
function generateUnderlinePath(startX: number, y: number, width: number, strokeWidth: number): string {
  const endX = startX + width;
  const waveHeight = strokeWidth * 2;
  const segments = 4;
  const segmentWidth = width / segments;
  
  let path = `M ${startX} ${y}`;
  
  for (let i = 0; i < segments; i++) {
    const x1 = startX + segmentWidth * i + segmentWidth * 0.5;
    const y1 = y + (i % 2 === 0 ? -waveHeight : waveHeight);
    const x2 = startX + segmentWidth * (i + 1);
    const y2 = y;
    path += ` Q ${x1} ${y1}, ${x2} ${y2}`;
  }
  
  // Add a flourish at the end
  path += ` Q ${endX + 10} ${y - waveHeight * 2}, ${endX + 20} ${y - waveHeight * 3}`;
  
  return path;
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Download signature as PNG
 */
export async function downloadSignatureAsPNG(
  svgDataUrl: string,
  filename: string,
  width: number,
  height: number,
  scale: number = 2
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Kunne ikke hente tegneflaten'));
        return;
      }
      
      // Fill with white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the signature
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      
      // Download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${filename}.png`;
          a.click();
          URL.revokeObjectURL(url);
          resolve();
        } else {
          reject(new Error('Kunne ikke lage filen'));
        }
      }, 'image/png');
    };
    img.onerror = () => reject(new Error('Kunne ikke laste inn bildet'));
    img.src = svgDataUrl;
  });
}

/**
 * Download signature as SVG
 */
export function downloadSignatureAsSVG(svg: string, filename: string): void {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}
