# Manual Performance Testing Guide

## Coffee & Barista Tools - Task 13.4

This guide provides step-by-step instructions for manually testing calculator performance once the build issue is resolved.

## Prerequisites

1. Fix the build error: `grinder-database.ts` module resolution issue
2. Successfully build the project: `npm run build`
3. Start the production server: `npm start`
4. Open Chrome DevTools (F12)

## Test 1: Bundle Size Analysis

### Steps:
1. Run build with analysis:
   ```bash
   npm run build
   npm run analyze
   ```

2. Review the output for:
   - Total bundle size
   - Individual calculator chunk sizes
   - Shared dependency sizes

### Success Criteria:
- ✅ Total coffee calculators < 500 KB
- ✅ Individual calculator pages < 150 KB
- ✅ Calculation modules < 20 KB each
- ✅ No duplicate dependencies

### Expected Results:
```
Coffee Calculator Chunks:
- extraction-yield: ~10 KB
- brew-ratio: ~8 KB
- iced-coffee-dilution: ~12 KB
- espresso-dial-in: ~15 KB
- water-recipe: ~10 KB
- grind-size-converter: ~60 KB (includes grinder database)
- caffeine-half-life: ~12 KB
- pour-over-timer: ~15 KB
- cost-per-cup: ~8 KB
- french-press-timer: ~10 KB
```

## Test 2: Input Responsiveness

### For Each Calculator:

1. Open calculator page
2. Open Chrome DevTools > Performance tab
3. Start recording
4. Type rapidly in input fields
5. Stop recording after 5 seconds
6. Analyze the flame graph

### Metrics to Check:
- **Input Lag**: Time from keystroke to screen update
  - Target: < 16ms (60 FPS)
  - Acceptable: < 50ms
  - Poor: > 100ms

- **Frame Rate**: Should maintain 60 FPS during typing
  - Check for dropped frames
  - Look for long tasks (> 50ms)

### Test Cases:

#### Extraction Yield Calculator
1. Type "1.35" in TDS field
2. Type "18" in Coffee Dose field
3. Type "250" in Beverage Weight field
4. Toggle units back and forth
5. Verify instant calculation updates

#### Brew Ratio Calculator
1. Drag ratio slider rapidly
2. Type in coffee dose field
3. Toggle units
4. Verify smooth slider movement

#### Iced Coffee Dilution Calculator
1. Drag ice percentage slider
2. Type in target volume
3. Watch for warning message at 50%
4. Verify instant updates

#### Espresso Dial-in Log
1. Add 10 shot entries rapidly
2. Scroll through the list
3. Delete entries
4. Verify smooth scrolling

#### Water Recipe Calculator
1. Drag hardness slider
2. Drag alkalinity slider
3. Type in water volume
4. Verify SCA compliance indicators update instantly

#### Grind Size Converter
1. Change source grinder dropdown
2. Adjust source setting slider
3. Change target grinder dropdown
4. Verify conversion happens instantly

#### Caffeine Half-Life Tracker
1. Add 10 caffeine intakes
2. Watch timeline update
3. Scroll through intake list
4. Verify smooth animations

#### Pour Over Timer
1. Change method dropdown
2. Adjust water amount
3. Start timer
4. Verify 60 FPS timer updates
5. Check stage transitions

#### Cost Per Cup Calculator
1. Type in bag price
2. Adjust dose per cup
3. Change cups per day
4. Verify all derived values update instantly

#### French Press Timer
1. Adjust steep time
2. Start timer
3. Verify 60 FPS updates
4. Check reminder notifications

## Test 3: Calculation Performance

### Using Chrome DevTools Console:

1. Open any calculator page
2. Open Console tab
3. Run performance tests:

```javascript
// Test calculation speed
console.time('calculation');
// Trigger calculation by changing input
console.timeEnd('calculation');

// Test multiple calculations
const times = [];
for (let i = 0; i < 100; i++) {
  const start = performance.now();
  // Trigger calculation
  const end = performance.now();
  times.push(end - start);
}
const avg = times.reduce((a, b) => a + b) / times.length;
console.log(`Average: ${avg.toFixed(3)}ms`);
```

### Success Criteria:
- ✅ Average calculation time < 10ms
- ✅ No calculations > 50ms
- ✅ Consistent performance across 100 iterations

## Test 4: Memory Leaks

### Timer Components (Pour Over, French Press):

1. Open timer calculator
2. Open Chrome DevTools > Memory tab
3. Take heap snapshot
4. Start timer
5. Let it run for 1 minute
6. Stop timer
7. Take another heap snapshot
8. Compare snapshots

### Success Criteria:
- ✅ No significant memory growth
- ✅ Timers properly cleaned up
- ✅ No detached DOM nodes

### Local Storage Components (Espresso Log, Caffeine Tracker):

1. Add 50 entries
2. Take heap snapshot
3. Delete all entries
4. Take another heap snapshot
5. Compare snapshots

### Success Criteria:
- ✅ Memory released after deletion
- ✅ No memory leaks in localStorage operations

## Test 5: Lighthouse Audit

### Steps:

1. Open calculator page in Chrome
2. Open DevTools > Lighthouse tab
3. Select:
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
4. Click "Analyze page load"
5. Review results

### Success Criteria:

| Metric | Target | Acceptable |
|--------|--------|------------|
| Performance | > 90 | > 80 |
| Accessibility | > 95 | > 90 |
| Best Practices | > 90 | > 85 |
| SEO | > 95 | > 90 |

### Core Web Vitals:

| Metric | Target | Acceptable |
|--------|--------|------------|
| LCP | < 2.5s | < 4.0s |
| FID | < 100ms | < 300ms |
| CLS | < 0.1 | < 0.25 |

## Test 6: Mobile Performance

### Devices to Test:
- iPhone (iOS Safari)
- Android (Chrome Mobile)
- Tablet (iPad)

### Steps:

1. Open calculator on mobile device
2. Test touch responsiveness
3. Test scrolling performance
4. Test input field interactions
5. Test timer animations

### Success Criteria:
- ✅ Smooth 60 FPS scrolling
- ✅ No input lag
- ✅ Proper touch target sizes
- ✅ Responsive layout

## Test 7: Network Performance

### Steps:

1. Open DevTools > Network tab
2. Throttle to "Fast 3G"
3. Reload calculator page
4. Measure load time

### Success Criteria:
- ✅ First Contentful Paint < 3s on 3G
- ✅ Time to Interactive < 5s on 3G
- ✅ Total page size < 200 KB

## Test 8: Stress Testing

### Large Dataset Tests:

#### Espresso Dial-in Log:
1. Add 100 shot entries
2. Scroll through list
3. Search/filter entries
4. Verify smooth performance

#### Caffeine Half-Life Tracker:
1. Add 50 caffeine intakes
2. Calculate current level
3. Render timeline
4. Verify < 100ms calculation time

### Success Criteria:
- ✅ Maintains 60 FPS with large datasets
- ✅ No UI freezing
- ✅ Calculations complete < 100ms

## Test Results Template

```markdown
## Performance Test Results

**Date:** YYYY-MM-DD
**Tester:** [Name]
**Environment:** [Browser/Device]

### Bundle Size
- Total: XXX KB
- Status: ✅ Pass / ❌ Fail
- Notes: [Any observations]

### Input Responsiveness
- Average Input Lag: XX ms
- Frame Rate: XX FPS
- Status: ✅ Pass / ❌ Fail
- Notes: [Any observations]

### Calculation Performance
- Average Time: XX ms
- Slowest Calculator: [Name] (XX ms)
- Status: ✅ Pass / ❌ Fail
- Notes: [Any observations]

### Lighthouse Scores
- Performance: XX
- Accessibility: XX
- Best Practices: XX
- SEO: XX
- Status: ✅ Pass / ❌ Fail

### Core Web Vitals
- LCP: X.Xs
- FID: XXms
- CLS: X.XX
- Status: ✅ Pass / ❌ Fail

### Mobile Performance
- Device: [Name]
- Responsiveness: ✅ Pass / ❌ Fail
- Notes: [Any observations]

### Issues Found
1. [Issue description]
2. [Issue description]

### Recommendations
1. [Recommendation]
2. [Recommendation]
```

## Automated Testing Script

Once build is fixed, run:

```bash
# Performance tests
node scripts/test-calculator-performance.js

# Bundle analysis
npm run build:analyze

# Lighthouse CI (if configured)
npm run lighthouse
```

## Troubleshooting

### Build Fails
- Clear `.next` directory
- Delete `node_modules` and reinstall
- Check TypeScript configuration
- Verify all imports are correct

### Slow Performance
- Check for unnecessary re-renders
- Verify memoization is working
- Look for expensive calculations in render
- Check for memory leaks

### High Bundle Size
- Analyze with webpack-bundle-analyzer
- Look for duplicate dependencies
- Verify tree-shaking is working
- Check for large data files

## Next Steps

1. ✅ Fix build error
2. ⏳ Run all manual tests
3. ⏳ Document results
4. ⏳ Implement optimizations if needed
5. ⏳ Re-test after optimizations
6. ✅ Mark task 13.4 as complete
