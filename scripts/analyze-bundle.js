#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * 
 * Analyzes the Next.js build output to identify large chunks
 * and potential optimization opportunities.
 * 
 * Usage: node scripts/analyze-bundle.js
 * 
 * @see Requirements 13.1, 13.5 - Performance optimization
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(process.cwd(), '.next');
const STATIC_DIR = path.join(BUILD_DIR, 'static', 'chunks');

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get all JS files in a directory recursively
 */
function getJsFiles(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      getJsFiles(fullPath, files);
    } else if (item.endsWith('.js')) {
      files.push({
        path: fullPath,
        name: item,
        size: stat.size,
      });
    }
  }
  
  return files;
}

/**
 * Analyze bundle and print report
 */
function analyzeBuild() {
  console.log('\n📦 Bundle Analysis Report\n');
  console.log('='.repeat(60));

  if (!fs.existsSync(BUILD_DIR)) {
    console.log('\n❌ No build found. Run "npm run build" first.\n');
    process.exit(1);
  }

  const files = getJsFiles(STATIC_DIR);
  
  if (files.length === 0) {
    console.log('\n⚠️  No JavaScript chunks found.\n');
    return;
  }

  // Sort by size (largest first)
  files.sort((a, b) => b.size - a.size);

  // Calculate totals
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const largeFiles = files.filter(f => f.size > 100 * 1024); // > 100KB

  console.log(`\n📊 Summary:`);
  console.log(`   Total chunks: ${files.length}`);
  console.log(`   Total size: ${formatBytes(totalSize)}`);
  console.log(`   Large chunks (>100KB): ${largeFiles.length}`);

  // Performance thresholds
  const WARN_THRESHOLD = 200 * 1024; // 200KB
  const ERROR_THRESHOLD = 500 * 1024; // 500KB

  console.log(`\n📁 Largest Chunks:\n`);
  
  const top10 = files.slice(0, 10);
  
  for (const file of top10) {
    let status = '✅';
    if (file.size > ERROR_THRESHOLD) {
      status = '❌';
    } else if (file.size > WARN_THRESHOLD) {
      status = '⚠️';
    }
    
    const relativePath = path.relative(BUILD_DIR, file.path);
    console.log(`   ${status} ${formatBytes(file.size).padStart(10)} - ${file.name}`);
  }

  // Recommendations
  console.log(`\n💡 Recommendations:\n`);
  
  if (largeFiles.length > 0) {
    console.log('   • Consider code splitting for large chunks');
    console.log('   • Use dynamic imports for below-the-fold content');
    console.log('   • Review dependencies for tree-shaking opportunities');
  } else {
    console.log('   • Bundle sizes look good! ✨');
  }

  // Check for common issues
  const vendorChunk = files.find(f => f.name.includes('vendor') || f.name.includes('framework'));
  if (vendorChunk && vendorChunk.size > 300 * 1024) {
    console.log('   • Vendor chunk is large - consider splitting dependencies');
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n');
}

// Run analysis
analyzeBuild();
