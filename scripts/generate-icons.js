/**
 * PWA Icon Generator Script
 * Generates all required icon sizes for PWA installation
 * 
 * Usage: node scripts/generate-icons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Icon sizes required for PWA
const ICON_SIZES = [
  16,    // favicon
  32,    // favicon
  48,    // Android
  72,    // Android
  96,    // Android
  128,   // Chrome Web Store
  144,   // Windows tiles
  152,   // iOS
  167,   // iPad Pro
  180,   // iOS
  192,   // Android
  256,   // Various
  384,   // Android
  512,   // Android splash
  1024,  // iOS App Store
];

// Shortcut icon sizes
const SHORTCUT_SIZES = [96, 192];

// Output directory
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'icons');

// SVG source
const SVG_SOURCE = path.join(OUTPUT_DIR, 'icon.svg');

// Create a modern, clean OmniTools icon SVG
const createIconSVG = (size) => {
  const padding = Math.round(size * 0.1);
  const innerSize = size - (padding * 2);
  const cornerRadius = Math.round(size * 0.21); // iOS style rounded corners
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1"/>
      <stop offset="100%" style="stop-color:#4f46e5"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f59e0b"/>
      <stop offset="100%" style="stop-color:#d97706"/>
    </linearGradient>
  </defs>
  <!-- Background with rounded corners -->
  <rect width="${size}" height="${size}" rx="${cornerRadius}" fill="url(#bg)"/>
  <!-- Calculator body -->
  <g transform="translate(${size * 0.265}, ${size * 0.1875})">
    <rect width="${size * 0.47}" height="${size * 0.625}" rx="${size * 0.047}" fill="#ffffff" opacity="0.95"/>
    <!-- Display screen -->
    <rect x="${size * 0.047}" y="${size * 0.047}" width="${size * 0.375}" height="${size * 0.14}" rx="${size * 0.023}" fill="#1e1b4b"/>
    <!-- Button grid - 3x3 -->
    ${generateButtons(size)}
  </g>
  <!-- "O" symbol for Omni -->
  <circle cx="${size * 0.742}" cy="${size * 0.258}" r="${size * 0.078}" fill="#ffffff"/>
  <circle cx="${size * 0.742}" cy="${size * 0.258}" r="${size * 0.039}" fill="#1e1b4b"/>
</svg>`;
};

// Generate button grid
const generateButtons = (size) => {
  const buttons = [];
  const startX = size * 0.078;
  const startY = size * 0.234;
  const spacing = size * 0.117;
  const radius = size * 0.039;
  
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cx = startX + (col * spacing);
      const cy = startY + (row * spacing);
      const isAccent = row === 2 && col === 2;
      const fill = isAccent ? 'url(#accent)' : '#6366f1';
      buttons.push(`<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${fill}"/>`);
    }
  }
  return buttons.join('\n    ');
};

// Create maskable icon (with safe zone padding)
const createMaskableIconSVG = (size) => {
  // Maskable icons need 10% safe zone on each side
  const safeZone = size * 0.1;
  const innerSize = size - (safeZone * 2);
  const scale = innerSize / size;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1"/>
      <stop offset="100%" style="stop-color:#4f46e5"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f59e0b"/>
      <stop offset="100%" style="stop-color:#d97706"/>
    </linearGradient>
  </defs>
  <!-- Full background for maskable -->
  <rect width="${size}" height="${size}" fill="url(#bg)"/>
  <!-- Centered content with safe zone -->
  <g transform="translate(${safeZone}, ${safeZone}) scale(${scale})">
    <!-- Calculator body -->
    <g transform="translate(${size * 0.265}, ${size * 0.1875})">
      <rect width="${size * 0.47}" height="${size * 0.625}" rx="${size * 0.047}" fill="#ffffff" opacity="0.95"/>
      <!-- Display screen -->
      <rect x="${size * 0.047}" y="${size * 0.047}" width="${size * 0.375}" height="${size * 0.14}" rx="${size * 0.023}" fill="#1e1b4b"/>
      <!-- Button grid -->
      ${generateButtons(size)}
    </g>
    <!-- "O" symbol -->
    <circle cx="${size * 0.742}" cy="${size * 0.258}" r="${size * 0.078}" fill="#ffffff"/>
    <circle cx="${size * 0.742}" cy="${size * 0.258}" r="${size * 0.039}" fill="#1e1b4b"/>
  </g>
</svg>`;
};

// Create shortcut icons
const createShortcutSVG = (type, size) => {
  const icons = {
    finance: {
      color: '#10b981',
      symbol: `<text x="${size/2}" y="${size * 0.65}" font-family="Arial, sans-serif" font-size="${size * 0.5}" font-weight="bold" fill="#ffffff" text-anchor="middle">$</text>`
    },
    health: {
      color: '#ef4444',
      symbol: `<path d="M${size/2} ${size * 0.25} L${size * 0.7} ${size * 0.45} L${size/2} ${size * 0.75} L${size * 0.3} ${size * 0.45} Z" fill="#ffffff"/>`
    },
    convert: {
      color: '#3b82f6',
      symbol: `<g fill="#ffffff">
        <path d="M${size * 0.25} ${size * 0.4} L${size * 0.45} ${size * 0.3} L${size * 0.45} ${size * 0.5} Z"/>
        <path d="M${size * 0.75} ${size * 0.6} L${size * 0.55} ${size * 0.5} L${size * 0.55} ${size * 0.7} Z"/>
        <rect x="${size * 0.35}" y="${size * 0.38}" width="${size * 0.3}" height="${size * 0.06}" rx="${size * 0.02}"/>
        <rect x="${size * 0.35}" y="${size * 0.56}" width="${size * 0.3}" height="${size * 0.06}" rx="${size * 0.02}"/>
      </g>`
    },
    coffee: {
      color: '#78350f',
      symbol: `<g fill="#ffffff">
        <path d="M${size * 0.25} ${size * 0.3} L${size * 0.65} ${size * 0.3} L${size * 0.6} ${size * 0.75} L${size * 0.3} ${size * 0.75} Z"/>
        <ellipse cx="${size * 0.45}" cy="${size * 0.3}" rx="${size * 0.2}" ry="${size * 0.06}"/>
        <path d="M${size * 0.65} ${size * 0.4} Q${size * 0.8} ${size * 0.45} ${size * 0.75} ${size * 0.55} Q${size * 0.7} ${size * 0.65} ${size * 0.6} ${size * 0.55}" fill="none" stroke="#ffffff" stroke-width="${size * 0.04}"/>
      </g>`
    }
  };
  
  const icon = icons[type] || icons.convert;
  const cornerRadius = Math.round(size * 0.21);
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${cornerRadius}" fill="${icon.color}"/>
  ${icon.symbol}
</svg>`;
};

async function generateIcons() {
  console.log('🎨 Generating PWA icons...\n');
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Generate main icons
  console.log('📱 Generating main app icons:');
  for (const size of ICON_SIZES) {
    const svgContent = createIconSVG(size);
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
    
    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(outputPath);
    
    console.log(`  ✓ icon-${size}x${size}.png`);
  }
  
  // Generate maskable icons
  console.log('\n🎭 Generating maskable icons:');
  for (const size of [192, 512]) {
    const svgContent = createMaskableIconSVG(size);
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}-maskable.png`);
    
    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(outputPath);
    
    console.log(`  ✓ icon-${size}x${size}-maskable.png`);
  }
  
  // Generate shortcut icons
  console.log('\n🔗 Generating shortcut icons:');
  const shortcuts = ['finance', 'health', 'convert', 'coffee'];
  for (const type of shortcuts) {
    for (const size of SHORTCUT_SIZES) {
      const svgContent = createShortcutSVG(type, size);
      const outputPath = path.join(OUTPUT_DIR, `shortcut-${type}.png`);
      
      if (size === 96) { // Only generate 96x96 for shortcuts
        await sharp(Buffer.from(svgContent))
          .resize(size, size)
          .png({ quality: 100, compressionLevel: 9 })
          .toFile(outputPath);
        
        console.log(`  ✓ shortcut-${type}.png`);
      }
    }
  }
  
  // Generate favicon.ico (multi-size)
  console.log('\n🌐 Generating favicon:');
  const favicon16 = createIconSVG(16);
  const favicon32 = createIconSVG(32);
  
  await sharp(Buffer.from(favicon32))
    .resize(32, 32)
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'favicon.png'));
  console.log('  ✓ favicon.png');
  
  // Generate apple-touch-icon
  console.log('\n🍎 Generating Apple touch icon:');
  const appleTouchIcon = createIconSVG(180);
  await sharp(Buffer.from(appleTouchIcon))
    .resize(180, 180)
    .png({ quality: 100 })
    .toFile(path.join(__dirname, '..', 'app', 'apple-touch-icon.png'));
  console.log('  ✓ apple-touch-icon.png (180x180)');
  
  // Update the main SVG
  console.log('\n📄 Updating main SVG:');
  const mainSvg = createIconSVG(512);
  fs.writeFileSync(SVG_SOURCE, mainSvg);
  console.log('  ✓ icon.svg');
  
  console.log('\n✅ All icons generated successfully!');
  console.log(`\n📁 Output directory: ${OUTPUT_DIR}`);
}

// Run the generator
generateIcons().catch(console.error);
