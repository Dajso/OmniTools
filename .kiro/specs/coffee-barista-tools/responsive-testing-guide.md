# Responsive Design Testing Guide
## Coffee & Barista Tools Calculators

This guide provides step-by-step instructions for manually testing the responsive design of all coffee calculators.

---

## Quick Start

### Using Browser DevTools

1. **Open Chrome DevTools**: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
2. **Toggle Device Toolbar**: Press `Ctrl+Shift+M` (Windows) / `Cmd+Shift+M` (Mac)
3. **Select Responsive Mode**: Choose "Responsive" from the device dropdown
4. **Set Width**: Enter the desired width (375, 768, 1024, or 1440)

---

## Test Checklist

### For Each Calculator

Use this checklist when testing each calculator:

- [ ] No horizontal scroll at any breakpoint
- [ ] All content visible and readable
- [ ] Touch targets appropriately sized (mobile)
- [ ] Inputs and buttons accessible
- [ ] Text doesn't overflow containers
- [ ] Images/icons scale properly
- [ ] Spacing looks comfortable
- [ ] Layout doesn't break or overlap

---

## Breakpoint Testing

### 📱 Mobile (375px) - iPhone SE

**Test Width**: 375px  
**Requirement**: 15.4

#### What to Check:
1. **Layout**
   - ✅ All inputs stack vertically (single column)
   - ✅ Full-width form elements
   - ✅ No horizontal scroll
   - ✅ Content fits within viewport

2. **Touch Targets**
   - ✅ Buttons are at least 44x44px
   - ✅ Adequate spacing between interactive elements
   - ✅ Easy to tap without mis-taps

3. **Typography**
   - ✅ Text is readable without zooming
   - ✅ No text overflow or truncation
   - ✅ Line heights comfortable for reading

4. **Spacing**
   - ✅ Adequate padding around content
   - ✅ Comfortable spacing between sections
   - ✅ Not cramped or cluttered

#### Test Each Calculator:

**1. Extraction Yield Calculator**
```
URL: /calculators/coffee/extraction-yield-calculator
- [ ] TDS input full width
- [ ] Coffee dose input full width
- [ ] Beverage weight input full width
- [ ] Unit toggle buttons accessible
- [ ] Results display properly
- [ ] Assessment badge visible
```

**2. Brew Ratio Calculator**
```
URL: /calculators/coffee/brew-ratio-calculator
- [ ] Coffee dose input full width
- [ ] Ratio input full width
- [ ] Unit toggle accessible
- [ ] Strength badge visible
- [ ] Results display properly
```

**3. Iced Coffee Dilution Calculator**
```
URL: /calculators/coffee/iced-coffee-dilution-calculator
- [ ] All inputs full width
- [ ] Warning messages visible
- [ ] Results display properly
```

**4. Espresso Dial-in Log**
```
URL: /calculators/coffee/espresso-dial-in-log
- [ ] Dose/yield/time inputs stack vertically
- [ ] Grind setting input full width
- [ ] Taste notes textarea full width
- [ ] Shot history cards stack
- [ ] Delete buttons accessible
- [ ] Metrics display in 2 columns
```

**5. Water Recipe Calculator**
```
URL: /calculators/coffee/water-recipe-calculator
- [ ] All inputs full width
- [ ] SCA indicators visible
- [ ] Instructions readable
- [ ] Results display properly
```

**6. Grind Size Converter**
```
URL: /calculators/coffee/grind-size-converter
- [ ] Grinder selects full width
- [ ] Setting input full width
- [ ] Conversion results visible
- [ ] Grind description readable
```

**7. Caffeine Half-Life Tracker**
```
URL: /calculators/coffee/caffeine-half-life-tracker
- [ ] Intake form full width
- [ ] Timeline visible
- [ ] History cards stack
- [ ] Delete buttons accessible
```

**8. Pour Over Timer**
```
URL: /calculators/coffee/pour-over-timer
- [ ] Method selector full width
- [ ] Water input full width
- [ ] Timer display visible
- [ ] Pour stages stack
- [ ] Control buttons accessible
```

**9. Cost Per Cup Calculator**
```
URL: /calculators/coffee/cost-per-cup-calculator
- [ ] All inputs full width
- [ ] Cost breakdown visible
- [ ] Results display properly
```

**10. French Press Timer**
```
URL: /calculators/coffee/french-press-timer
- [ ] All inputs full width
- [ ] Timer display visible
- [ ] Timeline events stack
- [ ] Control buttons accessible
```

---

### 📱 Tablet (768px) - iPad

**Test Width**: 768px  
**Requirement**: 15.5

#### What to Check:
1. **Layout**
   - ✅ Multi-column grids expand (where applicable)
   - ✅ Better horizontal space utilization
   - ✅ Content still constrained to optimal width
   - ✅ No wasted space

2. **Grid Layouts**
   - ✅ Espresso dial-in: 3 columns for inputs
   - ✅ Espresso dial-in: 5 columns for metrics
   - ✅ Other calculators maintain single column (optimal)

3. **Spacing**
   - ✅ More breathing room than mobile
   - ✅ Comfortable padding
   - ✅ Not too spread out

#### Quick Test:
1. Set viewport to 768px
2. Visit each calculator
3. Verify grid layouts expand where appropriate
4. Check spacing is comfortable
5. Ensure no layout breaks

---

### 💻 Desktop Small (1024px)

**Test Width**: 1024px  
**Requirement**: 15.6

#### What to Check:
1. **Layout**
   - ✅ Content centered with max-width
   - ✅ Optimal reading width maintained (672px)
   - ✅ Proper whitespace on sides
   - ✅ No over-stretching

2. **Centering**
   - ✅ Calculator card centered in viewport
   - ✅ Equal margins on left and right
   - ✅ Content doesn't touch edges

3. **Consistency**
   - ✅ All calculators use same max-width
   - ✅ Consistent layout across all pages

#### Quick Test:
1. Set viewport to 1024px
2. Visit each calculator
3. Verify content is centered
4. Check max-width constraint
5. Ensure consistent layout

---

### 💻 Desktop Large (1440px)

**Test Width**: 1440px  
**Requirement**: 15.6

#### What to Check:
1. **Layout**
   - ✅ Same as 1024px (content centered)
   - ✅ More whitespace on sides
   - ✅ Content doesn't over-stretch
   - ✅ Optimal reading width maintained

2. **Whitespace**
   - ✅ Generous margins
   - ✅ Content remains readable
   - ✅ Not too much empty space

#### Quick Test:
1. Set viewport to 1440px
2. Visit each calculator
3. Verify content is centered
4. Check whitespace is appropriate
5. Ensure no over-stretching

---

## Common Issues to Watch For

### ❌ Layout Issues
- Horizontal scroll appearing
- Content overflowing containers
- Overlapping elements
- Broken grid layouts

### ❌ Typography Issues
- Text too small to read
- Text overflowing containers
- Line heights too tight
- Font sizes not scaling

### ❌ Spacing Issues
- Cramped layouts on mobile
- Too much whitespace on desktop
- Inconsistent padding
- Elements too close together

### ❌ Interaction Issues
- Touch targets too small
- Buttons hard to tap
- Inputs difficult to focus
- Controls not accessible

---

## Testing Tools

### Browser DevTools
- **Chrome**: Best for responsive testing
- **Firefox**: Good for accessibility testing
- **Safari**: Test on actual iOS devices

### Responsive Design Mode
```
Chrome DevTools → Toggle Device Toolbar (Ctrl+Shift+M)
- Select "Responsive"
- Enter custom width
- Test at each breakpoint
```

### Device Emulation
```
Chrome DevTools → Device Toolbar
- iPhone SE (375px)
- iPad (768px)
- Laptop (1024px)
- Desktop (1440px)
```

### Zoom Testing
```
Test at different zoom levels:
- 100% (default)
- 150% (common)
- 200% (accessibility)
```

---

## Automated Testing

### Run Responsive Tests
```bash
npm test -- tests/responsive/coffee-calculators-responsive.test.ts
```

This runs 30 automated tests covering:
- Breakpoint definitions
- Responsive patterns
- Layout consistency
- Component-specific behavior
- Accessibility considerations

### Expected Output
```
✓ Coffee Calculators - Responsive Design (30)
  ✓ Breakpoint Requirements (2)
  ✓ Responsive Pattern Validation (3)
  ✓ Calculator Component Patterns (3)
  ✓ Mobile Breakpoint (375px) - Requirement 15.4 (3)
  ✓ Tablet Breakpoint (768px) - Requirement 15.5 (3)
  ✓ Desktop Breakpoint (1024px+) - Requirement 15.6 (4)
  ✓ Responsive Accessibility (3)
  ✓ Layout Consistency (3)
  ✓ Component-Specific Responsive Behavior (4)
  ✓ Performance Considerations (2)

Test Files  1 passed (1)
Tests  30 passed (30)
```

---

## Visual Regression Testing (Optional)

For comprehensive visual testing, consider using:

### Playwright Visual Comparison
```typescript
import { test, expect } from '@playwright/test';

test('brew ratio calculator responsive', async ({ page }) => {
  // Mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/calculators/coffee/brew-ratio-calculator');
  await expect(page).toHaveScreenshot('brew-ratio-mobile.png');
  
  // Tablet
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page).toHaveScreenshot('brew-ratio-tablet.png');
  
  // Desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page).toHaveScreenshot('brew-ratio-desktop.png');
});
```

---

## Accessibility Testing

### Keyboard Navigation
1. Tab through all interactive elements
2. Verify focus indicators visible
3. Check tab order is logical
4. Test at all breakpoints

### Screen Reader Testing
1. Use NVDA (Windows) or VoiceOver (Mac)
2. Verify ARIA labels announced
3. Check error messages announced
4. Test at all breakpoints

### Color Contrast
1. Use Chrome DevTools Lighthouse
2. Verify WCAG AA compliance (4.5:1)
3. Check in both light and dark mode
4. Test at all breakpoints

---

## Sign-off Checklist

Before marking task complete:

- [ ] All 10 calculators tested at 375px
- [ ] All 10 calculators tested at 768px
- [ ] All 10 calculators tested at 1024px
- [ ] All 10 calculators tested at 1440px
- [ ] No horizontal scroll at any breakpoint
- [ ] All touch targets appropriately sized
- [ ] Typography readable at all sizes
- [ ] Spacing comfortable at all sizes
- [ ] Automated tests passing (30/30)
- [ ] Documentation complete
- [ ] Requirements 15.4, 15.5, 15.6 validated

---

## Results Documentation

Test results documented in:
- `responsive-design-test-results.md` - Detailed test results
- `tests/responsive/coffee-calculators-responsive.test.ts` - Automated tests

**Status**: ✅ PASSED  
**Date**: 2024  
**Requirements**: 15.4, 15.5, 15.6  
**Tested By**: AI Agent (Kiro)
