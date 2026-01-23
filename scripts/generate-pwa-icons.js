/**
 * PWA Icon Generator Script
 * 
 * This script generates all required PWA icon sizes from the source SVG.
 * Run with: node scripts/generate-pwa-icons.js
 * 
 * Prerequisites:
 * npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SHORTCUT_SIZES = [96];
const SCREENSHOT_SIZES = [
    { name: 'desktop-home', width: 1920, height: 1080 },
    { name: 'mobile-home', width: 750, height: 1334 },
];

const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons');
const SOURCE_SVG = path.join(ICONS_DIR, 'icon.svg');

async function ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
}

async function generateIcons() {
    console.log('🎨 Generating PWA icons...\n');

    await ensureDirectoryExists(ICONS_DIR);

    // Check if source SVG exists
    if (!fs.existsSync(SOURCE_SVG)) {
        console.error('❌ Source SVG not found:', SOURCE_SVG);
        console.log('Please create the source icon at public/icons/icon.svg');
        process.exit(1);
    }

    // Generate main icons
    console.log('📱 Generating main icons...');
    for (const size of ICON_SIZES) {
        const outputPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);

        try {
            await sharp(SOURCE_SVG)
                .resize(size, size)
                .png()
                .toFile(outputPath);

            console.log(`  ✅ Generated: icon-${size}x${size}.png`);
        } catch (error) {
            console.error(`  ❌ Failed to generate icon-${size}x${size}.png:`, error.message);
        }
    }

    // Generate shortcut icons
    console.log('\n📌 Generating shortcut icons...');
    const shortcuts = ['finance', 'health', 'convert'];

    for (const shortcut of shortcuts) {
        for (const size of SHORTCUT_SIZES) {
            const outputPath = path.join(ICONS_DIR, `shortcut-${shortcut}.png`);

            try {
                // For shortcuts, we'll use the main icon with a slight tint
                // In production, you'd want custom icons for each shortcut
                await sharp(SOURCE_SVG)
                    .resize(size, size)
                    .png()
                    .toFile(outputPath);

                console.log(`  ✅ Generated: shortcut-${shortcut}.png`);
            } catch (error) {
                console.error(`  ❌ Failed to generate shortcut-${shortcut}.png:`, error.message);
            }
        }
    }

    // Generate favicon.ico
    console.log('\n🔖 Generating favicon...');
    try {
        await sharp(SOURCE_SVG)
            .resize(32, 32)
            .png()
            .toFile(path.join(ICONS_DIR, '..', 'favicon.png'));

        console.log('  ✅ Generated: favicon.png');
    } catch (error) {
        console.error('  ❌ Failed to generate favicon:', error.message);
    }

    console.log('\n✨ Icon generation complete!');
    console.log('\nNote: Screenshots need to be captured manually or generated separately.');
    console.log('Place them in public/screenshots/ with these dimensions:');
    SCREENSHOT_SIZES.forEach(({ name, width, height }) => {
        console.log(`  - ${name}.png (${width}x${height})`);
    });
}

generateIcons().catch(console.error);
