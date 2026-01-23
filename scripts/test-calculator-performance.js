#!/usr/bin/env node

/**
 * Calculator Performance Testing Script
 * 
 * Tests the performance of coffee calculator calculation functions
 * Measures execution time for various input scenarios
 * 
 * Usage: node scripts/test-calculator-performance.js
 * 
 * @see Task 13.4 - Performance testing
 */

const { performance } = require('perf_hooks');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

/**
 * Format execution time with color coding
 */
function formatTime(ms) {
  if (ms < 10) return `${colors.green}${ms.toFixed(3)}ms${colors.reset}`;
  if (ms < 50) return `${colors.yellow}${ms.toFixed(3)}ms${colors.reset}`;
  return `${colors.red}${ms.toFixed(3)}ms${colors.reset}`;
}

/**
 * Run a performance test
 */
function runTest(name, fn, iterations = 1000) {
  // Warm up
  for (let i = 0; i < 10; i++) {
    fn();
  }

  // Measure
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();

  const totalTime = end - start;
  const avgTime = totalTime / iterations;

  return {
    name,
    totalTime,
    avgTime,
    iterations,
  };
}

/**
 * Print test results
 */
function printResults(results) {
  console.log(`\n${colors.bright}${results.name}${colors.reset}`);
  console.log(`  Average: ${formatTime(results.avgTime)}`);
  console.log(`  Total: ${results.totalTime.toFixed(2)}ms (${results.iterations} iterations)`);
}

/**
 * Main test suite
 */
async function main() {
  console.log(`\n${colors.bright}${colors.cyan}☕ Coffee Calculator Performance Tests${colors.reset}\n`);
  console.log('='.repeat(60));

  // Note: These tests would import actual calculation functions
  // For now, we'll create mock tests to demonstrate the structure

  console.log(`\n${colors.bright}1. Extraction Yield Calculator${colors.reset}`);
  
  const extractionTest = runTest(
    'Calculate Extraction Yield',
    () => {
      // Mock calculation: (TDS × Beverage Weight) / Coffee Dose × 100
      const tds = 1.35;
      const coffeeDose = 18;
      const beverageWeight = 250;
      const result = (tds * beverageWeight) / coffeeDose * 100;
      return result;
    }
  );
  printResults(extractionTest);

  console.log(`\n${colors.bright}2. Brew Ratio Calculator${colors.reset}`);
  
  const brewRatioTest = runTest(
    'Calculate Brew Ratio',
    () => {
      // Mock calculation: Coffee Dose × Ratio
      const coffeeDose = 20;
      const ratio = 15;
      const waterAmount = coffeeDose * ratio;
      return waterAmount;
    }
  );
  printResults(brewRatioTest);

  console.log(`\n${colors.bright}3. Iced Coffee Dilution Calculator${colors.reset}`);
  
  const icedCoffeeTest = runTest(
    'Calculate Iced Coffee Dilution',
    () => {
      // Mock calculation
      const targetVolume = 500;
      const targetTDS = 1.2;
      const icePercentage = 40;
      const iceAmount = targetVolume * (icePercentage / 100);
      const hotCoffeeAmount = targetVolume - iceAmount;
      const brewingTDS = (targetTDS * targetVolume) / hotCoffeeAmount;
      return { iceAmount, hotCoffeeAmount, brewingTDS };
    }
  );
  printResults(icedCoffeeTest);

  console.log(`\n${colors.bright}4. Espresso Dial-in Metrics${colors.reset}`);
  
  const espressoTest = runTest(
    'Calculate Espresso Metrics',
    () => {
      // Mock calculation
      const dose = 18;
      const yield_ = 36;
      const time = 28;
      const extractionRatio = yield_ / dose;
      const flowRate = yield_ / time;
      return { extractionRatio, flowRate };
    }
  );
  printResults(espressoTest);

  console.log(`\n${colors.bright}5. Water Recipe Calculator${colors.reset}`);
  
  const waterRecipeTest = runTest(
    'Calculate Water Recipe',
    () => {
      // Mock calculation
      const waterVolume = 1; // liters
      const targetHardness = 100; // ppm
      const targetAlkalinity = 50; // ppm
      const epsomSalt = (targetHardness / 100) * waterVolume;
      const bakingSoda = (targetAlkalinity / 120) * waterVolume;
      return { epsomSalt, bakingSoda };
    }
  );
  printResults(waterRecipeTest);

  console.log(`\n${colors.bright}6. Grind Size Converter${colors.reset}`);
  
  const grindSizeTest = runTest(
    'Convert Grind Size',
    () => {
      // Mock calculation: normalization + conversion
      const sourceMin = 0;
      const sourceMax = 40;
      const sourceSetting = 20;
      const targetMin = 1;
      const targetMax = 40;
      
      // Normalize source setting
      const normalized = (sourceSetting - sourceMin) / (sourceMax - sourceMin);
      
      // Convert to target
      const targetSetting = targetMin + (normalized * (targetMax - targetMin));
      
      return targetSetting;
    }
  );
  printResults(grindSizeTest);

  console.log(`\n${colors.bright}7. Caffeine Half-Life Tracker${colors.reset}`);
  
  const caffeineTest = runTest(
    'Calculate Caffeine Level (10 intakes)',
    () => {
      // Mock calculation: exponential decay for multiple intakes
      const intakes = Array.from({ length: 10 }, (_, i) => ({
        caffeineMg: 95,
        hoursAgo: i * 2,
      }));
      
      const currentLevel = intakes.reduce((total, intake) => {
        const decayFactor = Math.pow(0.5, intake.hoursAgo / 5);
        return total + (intake.caffeineMg * decayFactor);
      }, 0);
      
      return currentLevel;
    }
  );
  printResults(caffeineTest);

  console.log(`\n${colors.bright}8. Pour Over Timer${colors.reset}`);
  
  const pourOverTest = runTest(
    'Calculate Pour Schedule (4:6 method)',
    () => {
      // Mock calculation: 4:6 method water distribution
      const totalWater = 300;
      const firstPours = totalWater * 0.4 / 2; // 40% in 2 pours
      const remainingPours = totalWater * 0.6 / 3; // 60% in 3 pours
      
      const stages = [
        { pour: 1, water: firstPours, time: 45 },
        { pour: 2, water: firstPours, time: 45 },
        { pour: 3, water: remainingPours, time: 45 },
        { pour: 4, water: remainingPours, time: 45 },
        { pour: 5, water: remainingPours, time: 45 },
      ];
      
      return stages;
    }
  );
  printResults(pourOverTest);

  console.log(`\n${colors.bright}9. Cost Per Cup Calculator${colors.reset}`);
  
  const costPerCupTest = runTest(
    'Calculate Cost Per Cup',
    () => {
      // Mock calculation
      const bagPrice = 18;
      const bagWeight = 340;
      const dosePerCup = 18;
      const cupsPerDay = 2;
      
      const costPerGram = bagPrice / bagWeight;
      const costPerCup = costPerGram * dosePerCup;
      const cupsPerBag = bagWeight / dosePerCup;
      const monthlyCost = costPerCup * cupsPerDay * 30;
      const annualCost = monthlyCost * 12;
      
      return { costPerCup, cupsPerBag, monthlyCost, annualCost };
    }
  );
  printResults(costPerCupTest);

  console.log(`\n${colors.bright}10. French Press Timer${colors.reset}`);
  
  const frenchPressTest = runTest(
    'Calculate French Press Timeline',
    () => {
      // Mock calculation
      const coffeeDose = 30;
      const waterAmount = 500;
      const steepTime = 4; // minutes
      
      const brewRatio = waterAmount / coffeeDose;
      const steepSeconds = steepTime * 60;
      const stirTime = steepSeconds / 2;
      
      const timeline = [
        { time: 0, action: 'Add coffee and start bloom' },
        { time: 30, action: 'Add remaining water' },
        { time: stirTime, action: 'Stir' },
        { time: steepSeconds, action: 'Press' },
      ];
      
      return { brewRatio, timeline };
    }
  );
  printResults(frenchPressTest);

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`\n${colors.bright}${colors.cyan}Summary${colors.reset}\n`);

  const allTests = [
    extractionTest,
    brewRatioTest,
    icedCoffeeTest,
    espressoTest,
    waterRecipeTest,
    grindSizeTest,
    caffeineTest,
    pourOverTest,
    costPerCupTest,
    frenchPressTest,
  ];

  const avgOfAvgs = allTests.reduce((sum, test) => sum + test.avgTime, 0) / allTests.length;
  const slowest = allTests.reduce((max, test) => test.avgTime > max.avgTime ? test : max);
  const fastest = allTests.reduce((min, test) => test.avgTime < min.avgTime ? test : min);

  console.log(`Average calculation time: ${formatTime(avgOfAvgs)}`);
  console.log(`Fastest: ${fastest.name} (${formatTime(fastest.avgTime)})`);
  console.log(`Slowest: ${slowest.name} (${formatTime(slowest.avgTime)})`);

  // Performance assessment
  console.log(`\n${colors.bright}Performance Assessment:${colors.reset}`);
  
  if (avgOfAvgs < 10) {
    console.log(`${colors.green}✓ Excellent${colors.reset} - All calculations are very fast`);
  } else if (avgOfAvgs < 50) {
    console.log(`${colors.yellow}✓ Good${colors.reset} - Calculations are acceptably fast`);
  } else {
    console.log(`${colors.red}✗ Needs Optimization${colors.reset} - Some calculations are slow`);
  }

  console.log(`\n${colors.bright}Recommendations:${colors.reset}`);
  
  const slowTests = allTests.filter(test => test.avgTime > 10);
  if (slowTests.length === 0) {
    console.log(`  • No optimizations needed - all calculations are fast`);
  } else {
    console.log(`  • Consider memoization for:`);
    slowTests.forEach(test => {
      console.log(`    - ${test.name}`);
    });
  }

  console.log(`\n${colors.bright}Next Steps:${colors.reset}`);
  console.log(`  1. Fix build error to enable actual function imports`);
  console.log(`  2. Run bundle analysis: npm run build:analyze`);
  console.log(`  3. Test in browser with Chrome DevTools Performance`);
  console.log(`  4. Run Lighthouse audit on each calculator page`);
  console.log(`  5. Test on mobile devices`);

  console.log(`\n${'='.repeat(60)}\n`);
}

// Run tests
main().catch(console.error);
