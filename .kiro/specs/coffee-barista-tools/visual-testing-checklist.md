# Visual Testing Checklist
## Coffee & Barista Tools - Cross-Browser Testing

This checklist is for manual visual testing of all 10 coffee calculators across different browsers and devices.

---

## Testing Instructions

### Desktop Testing
1. Open each calculator URL in the browser
2. Test at different window sizes: 1440px, 1024px, 768px
3. Verify all items in the checklist
4. Note any visual or functional issues

### Mobile Testing
1. Open each calculator on mobile device or use browser DevTools device emulation
2. Test at 375px width (iPhone SE) and 768px (iPad)
3. Test both portrait and landscape orientations
4. Verify touch interactions work correctly

---

## Calculator URLs

Base URL: `http://localhost:3000/calculators/coffee/`

1. `/extraction-yield-calculator`
2. `/brew-ratio-calculator`
3. `/iced-coffee-dilution-calculator`
4. `/espresso-dial-in-log`
5. `/water-recipe-calculator`
6. `/grind-size-converter`
7. `/caffeine-half-life-tracker`
8. `/pour-over-timer`
9. `/cost-per-cup-calculator`
10. `/french-press-timer`

---

## Visual Checklist (Per Calculator)

### Layout & Rendering
- [ ] Page loads without errors
- [ ] All text is readable (no overlapping, no cutoff)
- [ ] All inputs are visible and properly sized
- [ ] Buttons are properly styled and sized
- [ ] Results section displays correctly
- [ ] No horizontal scrolling on mobile
- [ ] Proper spacing between elements
- [ ] Icons display correctly (no broken images)
- [ ] Colors match design system (amber theme)

### Typography
- [ ] Headings are properly sized and weighted
- [ ] Body text is legible (minimum 16px on mobile)
- [ ] Labels are associated with inputs
- [ ] Error messages are readable
- [ ] Number formatting is correct (decimals, commas)

### Forms & Inputs
- [ ] All input fields are accessible
- [ ] Input labels are visible
- [ ] Placeholder text is visible (if used)
- [ ] Number inputs show correct keyboard on mobile
- [ ] Dropdowns/selects work correctly
- [ ] Radio buttons/checkboxes are properly styled
- [ ] Unit toggles work (metric/imperial)
- [ ] Input validation displays errors correctly

### Interactivity
- [ ] Buttons respond to clicks/taps
- [ ] Hover states work on desktop
- [ ] Active/pressed states work on mobile
- [ ] Form submission works
- [ ] Calculate button triggers calculation
- [ ] Reset button clears form
- [ ] Timer controls work (start/pause/reset)
- [ ] Add/remove items work (for log calculators)

### Results Display
- [ ] Results appear after calculation
- [ ] Numbers are formatted correctly
- [ ] Units are displayed correctly
- [ ] Assessments/recommendations are visible
- [ ] Charts/visualizations render (if applicable)
- [ ] Color coding is correct (green/yellow/red)
- [ ] Results are responsive to window size

### Accessibility
- [ ] Tab navigation works through all inputs
- [ ] Focus indicators are visible
- [ ] Enter key submits form
- [ ] Escape key closes modals (if applicable)
- [ ] Screen reader labels are present (check with DevTools)
- [ ] Color contrast is sufficient
- [ ] No keyboard traps

### Performance
- [ ] Page loads in < 3 seconds
- [ ] Calculations complete instantly (< 100ms)
- [ ] No lag when typing in inputs
- [ ] Smooth animations (if any)
- [ ] No console errors
- [ ] No console warnings (check DevTools)

### Responsive Design
- [ ] **1440px (Large Desktop)**: Full layout, all features visible
- [ ] **1024px (Desktop)**: Proper layout, no horizontal scroll
- [ ] **768px (Tablet)**: Stacked or adjusted layout
- [ ] **375px (Mobile)**: Single column, touch-friendly
- [ ] Orientation change works (mobile)

---

## Browser-Specific Testing

### Chrome (Desktop)
- [ ] All 10 calculators tested
- [ ] DevTools console shows no errors
- [ ] Performance tab shows good metrics
- [ ] Lighthouse score > 90

### Firefox (Desktop)
- [ ] All 10 calculators tested
- [ ] Number input spinners work
- [ ] Date/time inputs work
- [ ] No Firefox-specific CSS issues

### Safari (macOS)
- [ ] All 10 calculators tested
- [ ] Date/time inputs use native picker
- [ ] Flexbox/Grid layouts work
- [ ] No Safari-specific rendering issues

### Edge (Desktop)
- [ ] All 10 calculators tested
- [ ] Chromium-based features work
- [ ] No Edge-specific issues

### iOS Safari (Mobile)
- [ ] All 10 calculators tested
- [ ] Touch targets are 44x44px minimum
- [ ] Virtual keyboard doesn't cover inputs
- [ ] Zoom is disabled for inputs (if appropriate)
- [ ] Date/time inputs use iOS picker
- [ ] Audio notifications work (with permission)

### Chrome Mobile (Android/iOS)
- [ ] All 10 calculators tested
- [ ] Touch interactions work
- [ ] Scrolling is smooth
- [ ] No mobile-specific layout issues

---

## Calculator-Specific Tests

### 1. Extraction Yield Calculator
- [ ] TDS input accepts decimals
- [ ] Assessment changes based on yield (under/optimal/over)
- [ ] Unit conversion works (g/oz)
- [ ] Validation errors display for invalid inputs

### 2. Brew Ratio Calculator
- [ ] Ratio input accepts decimals
- [ ] Strength profile updates (strong/balanced/mild)
- [ ] Ratio display shows "1:X" format
- [ ] Unit conversion works

### 3. Iced Coffee Dilution Calculator
- [ ] Ice percentage slider works (if applicable)
- [ ] Warning appears when ice > 50%
- [ ] Brewing TDS calculation is accurate
- [ ] All three results display correctly

### 4. Espresso Dial-in Log
- [ ] Add shot button works
- [ ] Shot list displays correctly
- [ ] Delete shot button works
- [ ] Extraction ratio and flow rate calculate
- [ ] Recommendations display based on ratio
- [ ] Local storage persists shots (refresh page to test)

### 5. Water Recipe Calculator
- [ ] Mineral amounts calculate correctly
- [ ] SCA compliance indicators show
- [ ] Instructions display clearly
- [ ] Unit conversion works (L/gal)

### 6. Grind Size Converter
- [ ] Grinder dropdowns populate
- [ ] Conversion calculates correctly
- [ ] Grind description displays
- [ ] Confidence level shows
- [ ] Error displays for invalid grinders

### 7. Caffeine Half-Life Tracker
- [ ] Add intake button works
- [ ] Intake list displays
- [ ] Current caffeine level calculates
- [ ] Timeline visualization renders
- [ ] Sleep recommendation displays
- [ ] Local storage persists intakes
- [ ] Date/time input works on all browsers

### 8. Pour Over Timer
- [ ] Method selection works (4:6, custom)
- [ ] Timer starts/pauses/resets
- [ ] Pour stages display correctly
- [ ] Stage transitions work
- [ ] Audio notifications work (where supported)
- [ ] Timer doesn't drift over time

### 9. Cost Per Cup Calculator
- [ ] All cost calculations accurate
- [ ] Currency formatting correct
- [ ] Monthly/annual costs display
- [ ] Optional fields work (cups per day)

### 10. French Press Timer
- [ ] Timer starts/pauses/resets
- [ ] Bloom reminder at 30 seconds
- [ ] Stir reminder at halfway point
- [ ] Press reminder at completion
- [ ] Brew ratio calculates correctly
- [ ] Audio notifications work (where supported)

---

## Known Browser Differences (Expected)

### Safari
- Date/time inputs use native iOS/macOS picker (different styling)
- Audio notifications require user interaction first (iOS restriction)

### Firefox
- Number input spinners styled differently (browser default)
- Scrollbar styling may differ

### Mobile Browsers
- Virtual keyboard covers bottom of screen (expected, scrolling works)
- Audio notifications may require permission on first use
- Touch targets should be minimum 44x44px

---

## Issue Reporting Template

If you find an issue, document it using this template:

```
**Calculator**: [Name]
**Browser**: [Browser name and version]
**Device**: [Desktop/Mobile, OS]
**Issue**: [Description]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected**: [What should happen]
**Actual**: [What actually happens]
**Screenshot**: [If applicable]
**Severity**: [Critical/High/Medium/Low]
```

---

## Testing Sign-off

### Desktop Browsers
- [ ] Chrome - Tested by: __________ Date: __________
- [ ] Firefox - Tested by: __________ Date: __________
- [ ] Safari - Tested by: __________ Date: __________
- [ ] Edge - Tested by: __________ Date: __________

### Mobile Browsers
- [ ] iOS Safari - Tested by: __________ Date: __________
- [ ] Chrome Mobile - Tested by: __________ Date: __________

### Responsive Breakpoints
- [ ] 375px (Mobile) - Tested by: __________ Date: __________
- [ ] 768px (Tablet) - Tested by: __________ Date: __________
- [ ] 1024px (Desktop) - Tested by: __________ Date: __________
- [ ] 1440px (Large) - Tested by: __________ Date: __________

---

## Final Approval

**All calculators tested and approved for production**

- [ ] All visual tests passed
- [ ] All functional tests passed
- [ ] All accessibility tests passed
- [ ] All performance tests passed
- [ ] No critical or high-severity issues

**Approved by**: __________ **Date**: __________
