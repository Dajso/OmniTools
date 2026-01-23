# Cross-Browser Testing Guide
## Quick Reference for Developers

This guide provides quick instructions for testing the coffee calculators across different browsers.

---

## Quick Start

### 1. Run Development Server
```bash
npm run dev
```

### 2. Open in Browser
Navigate to: `http://localhost:3000/calculators/coffee/`

### 3. Run Automated Tests
```bash
npm test tests/cross-browser/coffee-calculators.test.ts
```

---

## Testing Checklist (Quick)

For each calculator, verify:
- [ ] Page loads without errors
- [ ] Form inputs work
- [ ] Calculations are accurate
- [ ] Results display correctly
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] Keyboard navigation works
- [ ] No console errors

---

## Browser Testing Tools

### Chrome DevTools
```
F12 or Ctrl+Shift+I (Windows/Linux)
Cmd+Option+I (macOS)
```

**Device Emulation**: Click device icon or Ctrl+Shift+M

**Useful Panels**:
- **Console**: Check for errors
- **Network**: Check load times
- **Performance**: Check rendering performance
- **Lighthouse**: Run audits

### Firefox Developer Tools
```
F12 or Ctrl+Shift+I (Windows/Linux)
Cmd+Option+I (macOS)
```

**Responsive Design Mode**: Ctrl+Shift+M

### Safari Web Inspector
```
Cmd+Option+I (macOS)
```

**Enable**: Safari > Preferences > Advanced > Show Develop menu

**Responsive Design Mode**: Cmd+Option+R

---

## Testing Each Browser

### Chrome
```bash
# Open in Chrome
start chrome http://localhost:3000/calculators/coffee/
```

**Test**:
1. Open DevTools (F12)
2. Check Console for errors
3. Test responsive design (Ctrl+Shift+M)
4. Run Lighthouse audit

### Firefox
```bash
# Open in Firefox
start firefox http://localhost:3000/calculators/coffee/
```

**Test**:
1. Open Developer Tools (F12)
2. Check Console for errors
3. Test responsive design (Ctrl+Shift+M)
4. Verify number input spinners

### Safari (macOS)
```bash
# Open in Safari
open -a Safari http://localhost:3000/calculators/coffee/
```

**Test**:
1. Open Web Inspector (Cmd+Option+I)
2. Check Console for errors
3. Test responsive design (Cmd+Option+R)
4. Verify date/time pickers

### Edge
```bash
# Open in Edge
start msedge http://localhost:3000/calculators/coffee/
```

**Test**:
1. Open DevTools (F12)
2. Check Console for errors
3. Test responsive design (Ctrl+Shift+M)
4. Verify Chromium compatibility

---

## Mobile Testing

### iOS Safari (Real Device)
1. Connect iPhone to Mac
2. Enable Web Inspector on iPhone: Settings > Safari > Advanced > Web Inspector
3. Open Safari on Mac > Develop > [Your iPhone] > [Page]
4. Test touch interactions

### iOS Safari (Simulator)
```bash
# Open iOS Simulator (macOS with Xcode)
open -a Simulator
```

1. Open Safari in simulator
2. Navigate to `http://localhost:3000/calculators/coffee/`
3. Test touch interactions

### Chrome Mobile (Real Device)
1. Enable USB debugging on Android device
2. Connect device to computer
3. Open Chrome DevTools > More tools > Remote devices
4. Inspect device

### Chrome Mobile (Emulation)
1. Open Chrome DevTools (F12)
2. Click device icon (Ctrl+Shift+M)
3. Select device (iPhone SE, Pixel 5, etc.)
4. Test touch interactions

---

## Responsive Breakpoints

Test at these widths:

### Mobile (375px)
```
iPhone SE, iPhone 12 Mini
```
- Single column layout
- Touch-friendly buttons (44x44px minimum)
- No horizontal scroll

### Tablet (768px)
```
iPad, iPad Mini
```
- Two-column layout (where appropriate)
- Larger touch targets
- Optimized for portrait and landscape

### Desktop (1024px)
```
Small laptops, iPad Pro landscape
```
- Multi-column layout
- Hover states
- Keyboard navigation

### Large Desktop (1440px)
```
Standard desktop monitors
```
- Full layout
- Maximum content width
- Optimal spacing

---

## Common Issues and Fixes

### Issue: Console Errors
**Check**: Open DevTools Console (F12)
**Fix**: Review error messages and fix code

### Issue: Layout Broken on Mobile
**Check**: DevTools responsive mode (Ctrl+Shift+M)
**Fix**: Verify CSS media queries and Tailwind classes

### Issue: Calculations Incorrect
**Check**: Run unit tests
```bash
npm test tests/unit/coffee-*.test.ts
```
**Fix**: Review calculation logic in `lib/calculations/coffee/`

### Issue: Form Validation Not Working
**Check**: Browser console for Zod errors
**Fix**: Review schema in calculation modules

### Issue: Timer Not Working
**Check**: Browser console for JavaScript errors
**Fix**: Review timer logic and state management

### Issue: Audio Notifications Not Playing
**Check**: Browser console for audio errors
**Fix**: Ensure user interaction before playing audio (iOS requirement)

---

## Automated Testing

### Run All Tests
```bash
npm test
```

### Run Cross-Browser Tests Only
```bash
npm test tests/cross-browser/
```

### Run Specific Calculator Tests
```bash
npm test tests/unit/coffee-extraction-yield.test.ts
```

### Run Property-Based Tests
```bash
npm test tests/property/
```

### Watch Mode (for development)
```bash
npm test -- --watch
```

---

## Performance Testing

### Lighthouse Audit (Chrome)
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select categories: Performance, Accessibility, Best Practices, SEO
4. Click "Generate report"
5. Target scores: All > 90

### Performance Profiling
1. Open DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Interact with calculator
5. Stop recording
6. Analyze timeline

### Network Analysis
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Check:
   - Total load time < 3s
   - Number of requests < 50
   - Total size < 500KB

---

## Accessibility Testing

### Keyboard Navigation
1. Tab through all inputs
2. Verify focus indicators visible
3. Enter key submits form
4. Escape key closes modals

### Screen Reader Testing

**Windows (NVDA)**:
```bash
# Download NVDA from nvaccess.org
# Start NVDA
# Navigate with Tab and Arrow keys
```

**macOS (VoiceOver)**:
```bash
# Enable: System Preferences > Accessibility > VoiceOver
# Start: Cmd+F5
# Navigate with VO+Arrow keys
```

### Color Contrast
1. Open DevTools (F12)
2. Inspect element
3. Check contrast ratio in Styles panel
4. Target: 4.5:1 minimum for text

---

## Debugging Tips

### Console Logging
```javascript
console.log('Debug:', value);
console.error('Error:', error);
console.table(data); // For arrays/objects
```

### React DevTools
```bash
# Install React DevTools extension
# Open DevTools > React tab
# Inspect component props and state
```

### Network Debugging
```bash
# Open DevTools > Network tab
# Filter by type: JS, CSS, XHR
# Check response times and status codes
```

### Performance Debugging
```bash
# Open DevTools > Performance tab
# Record interaction
# Look for long tasks (> 50ms)
# Optimize as needed
```

---

## CI/CD Integration

### GitHub Actions (Example)
```yaml
name: Cross-Browser Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
```

---

## Reporting Issues

### Issue Template
```markdown
**Calculator**: [Name]
**Browser**: [Browser + Version]
**OS**: [Operating System]
**Issue**: [Brief description]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected**: [What should happen]
**Actual**: [What actually happens]

**Console Errors**: [Copy/paste any errors]
**Screenshot**: [If applicable]
```

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MDN Web Docs](https://developer.mozilla.org)

### Testing Tools
- [Vitest](https://vitest.dev)
- [fast-check](https://fast-check.dev)
- [Playwright](https://playwright.dev) (for E2E)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Browser Support
- [Can I Use](https://caniuse.com)
- [MDN Browser Compatibility](https://developer.mozilla.org/en-US/docs/Web/API)

---

## Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Testing
npm test                 # Run all tests
npm test -- --watch      # Watch mode
npm test -- --coverage   # Coverage report

# Linting
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues

# Type Checking
npm run type-check       # Run TypeScript compiler
```

---

**Last Updated**: 2024
**Maintained by**: Development Team
