# Design Document: English Tools Website

## Overview

This document outlines the technical architecture and design for a comprehensive online tools website targeting English-speaking users. The website will host 100 high-value calculators and converters across five categories, optimized for SEO, accessibility, and monetization.

The architecture follows a modular, component-based approach using Next.js 14+ App Router, enabling server-side rendering for SEO while maintaining client-side interactivity for calculations. The design prioritizes code reusability, performance, and maintainability.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js App Router                        │
├─────────────────────────────────────────────────────────────────┤
│  /app                                                            │
│  ├── (marketing)          # Landing pages, about, contact        │
│  ├── calculators/         # Calculator tool pages                │
│  │   ├── finance/         # Financial calculators                │
│  │   ├── health/          # Health & fitness calculators         │
│  │   ├── home/            # Home & DIY calculators               │
│  │   └── productivity/    # Productivity tools                   │
│  ├── convert/             # Unit converters                      │
│  │   └── [from]-to-[to]/  # Dynamic conversion pages             │
│  └── api/                 # API routes (if needed)               │
├─────────────────────────────────────────────────────────────────┤
│  /components                                                     │
│  ├── ui/                  # Base UI components (shadcn/ui)       │
│  ├── calculators/         # Calculator-specific components       │
│  ├── converters/          # Converter-specific components        │
│  ├── layout/              # Header, Footer, Navigation           │
│  └── seo/                 # SEO components (FAQ, HowTo, Schema)  │
├─────────────────────────────────────────────────────────────────┤
│  /lib                                                            │
│  ├── calculations/        # Pure calculation functions           │
│  ├── conversions/         # Unit conversion logic                │
│  ├── constants/           # Tool definitions, unit data          │
│  └── utils/               # Formatting, validation helpers       │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 14+ (App Router) | SSR, routing, SEO |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS | Utility-first CSS |
| UI Components | shadcn/ui | Accessible base components |
| Icons | Lucide React | Consistent iconography |
| State | React useState/useReducer | Local component state |
| Validation | Zod | Input validation schemas |
| SEO | next-seo | Meta tags, structured data |

## Components and Interfaces

### Core UI Components

```typescript
// components/ui/tool-card.tsx
interface ToolCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

// components/ui/number-input.tsx
interface NumberInputProps {
  id: string;
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

// components/ui/unit-toggle.tsx
interface UnitToggleProps {
  value: 'imperial' | 'metric';
  onChange: (value: 'imperial' | 'metric') => void;
  labels?: { imperial: string; metric: string };
}

// components/ui/result-display.tsx
interface ResultDisplayProps {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
  copyable?: boolean;
}

// components/ui/select-input.tsx
interface SelectInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  error?: string;
  required?: boolean;
}

// components/ui/button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

// Design Decision: Loading state shows a spinner icon and disables the button
// to prevent double-submissions while maintaining accessibility focus
```

### Calculator Base Component

```typescript
// components/calculators/calculator-base.tsx
interface CalculatorBaseProps<TInputs, TResults> {
  title: string;
  description: string;
  inputs: TInputs;
  onInputChange: (key: keyof TInputs, value: any) => void;
  results: TResults | null;
  onCalculate: () => void;
  onReset: () => void;
  isValid: boolean;
  errors: Partial<Record<keyof TInputs, string>>;
  children: React.ReactNode;
}

// Hook for calculator state management
interface UseCalculatorOptions<TInputs, TResults> {
  initialInputs: TInputs;
  validate: (inputs: TInputs) => ValidationResult<TInputs>;
  calculate: (inputs: TInputs) => TResults;
}

interface UseCalculatorReturn<TInputs, TResults> {
  inputs: TInputs;
  setInput: (key: keyof TInputs, value: any) => void;
  results: TResults | null;
  errors: Partial<Record<keyof TInputs, string>>;
  isValid: boolean;
  calculate: () => void;
  reset: () => void;
}
```

### Converter Base Component

```typescript
// components/converters/converter-base.tsx
interface ConverterBaseProps {
  fromUnit: UnitDefinition;
  toUnit: UnitDefinition;
  fromValue: number;
  toValue: number;
  onFromValueChange: (value: number) => void;
  onToValueChange: (value: number) => void;
  onSwapUnits: () => void;
  formula: string;
  relatedConversions: ConversionLink[];
}

interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  category: UnitCategory;
}

interface ConversionLink {
  from: string;
  to: string;
  href: string;
}

type UnitCategory = 
  | 'length' 
  | 'weight' 
  | 'temperature' 
  | 'volume' 
  | 'area' 
  | 'speed' 
  | 'time' 
  | 'data' 
  | 'pressure' 
  | 'energy';
```

### SEO Components

```typescript
// components/seo/tool-seo.tsx
interface ToolSEOProps {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  structuredData: ToolStructuredData;
}

interface ToolStructuredData {
  "@type": "WebApplication" | "SoftwareApplication";
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    "@type": "Offer";
    price: "0";
    priceCurrency: "USD";
  };
}

// components/seo/faq-section.tsx
interface FAQSectionProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

// components/seo/how-to-section.tsx
interface HowToSectionProps {
  title: string;
  steps: Array<{
    name: string;
    text: string;
  }>;
}
```

### Accessibility Components

```typescript
// components/ui/focus-trap.tsx
interface FocusTrapProps {
  children: React.ReactNode;
  active: boolean;
}

// components/ui/visually-hidden.tsx
// For screen reader only content
interface VisuallyHiddenProps {
  children: React.ReactNode;
}

// components/ui/skip-link.tsx
// Skip to main content link for keyboard users
interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

// lib/hooks/use-announce.ts
// Hook for announcing dynamic content to screen readers
interface UseAnnounceReturn {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
}

// Design Decision: Use aria-live regions for error announcements
// with 'assertive' priority for validation errors and 'polite' for status updates
```

### Tool Registry

```typescript
// lib/constants/tool-registry.ts
interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  keywords: string[];
  path: string;
  icon: string;
  featured?: boolean;
  relatedTools?: string[];
}

type ToolCategory = 
  | 'finance' 
  | 'health' 
  | 'home' 
  | 'converter' 
  | 'productivity';

const toolRegistry: Record<string, ToolDefinition> = {
  'mortgage-calculator': {
    id: 'mortgage-calculator',
    slug: 'mortgage-calculator',
    name: 'Mortgage Calculator with PMI',
    description: 'Calculate your monthly mortgage payment including PMI, taxes, and insurance',
    category: 'finance',
    keywords: ['mortgage calculator', 'home loan calculator', 'PMI calculator'],
    path: '/calculators/finance/mortgage-calculator',
    icon: 'Home',
    featured: true,
    relatedTools: ['refinance-calculator', 'compound-interest-calculator']
  },
  // ... 99 more tools
};
```

## Data Models

### Calculator Input/Output Models

```typescript
// lib/types/calculators/mortgage.ts
interface MortgageInputs {
  homePrice: number;
  downPayment: number;
  downPaymentPercent: number;
  loanTerm: number; // years
  interestRate: number; // annual percentage
  propertyTax: number; // annual
  homeInsurance: number; // annual
  pmi: number; // monthly
  hoaFees: number; // monthly
}

interface MortgageResults {
  monthlyPayment: number;
  principalAndInterest: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyPMI: number;
  monthlyHOA: number;
  totalPayment: number;
  totalInterest: number;
  payoffDate: Date;
  amortizationSchedule: AmortizationEntry[];
}

interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

// lib/types/calculators/bmi.ts
interface BMIInputs {
  weight: number;
  height: number;
  unit: 'imperial' | 'metric';
  // Imperial: weight in lbs, height in inches
  // Metric: weight in kg, height in cm
}

interface BMIResults {
  bmi: number;
  category: 'underweight' | 'normal' | 'overweight' | 'obese';
  healthyWeightRange: { min: number; max: number };
  recommendation: string;
}
```

### Unit Conversion Models

```typescript
// lib/types/conversions.ts
interface ConversionUnit {
  id: string;
  name: string;
  symbol: string;
  category: UnitCategory;
  toBase: (value: number) => number; // Convert to base unit
  fromBase: (value: number) => number; // Convert from base unit
}

// Example: Length units (base unit: meters)
const lengthUnits: Record<string, ConversionUnit> = {
  meter: {
    id: 'meter',
    name: 'Meter',
    symbol: 'm',
    category: 'length',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  foot: {
    id: 'foot',
    name: 'Foot',
    symbol: 'ft',
    category: 'length',
    toBase: (v) => v * 0.3048,
    fromBase: (v) => v / 0.3048,
  },
  inch: {
    id: 'inch',
    name: 'Inch',
    symbol: 'in',
    category: 'length',
    toBase: (v) => v * 0.0254,
    fromBase: (v) => v / 0.0254,
  },
  // ... more units
};
```

### Page Data Models

```typescript
// lib/types/page.ts
interface ToolPageData {
  tool: ToolDefinition;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl: string;
  };
  content: {
    howTo: HowToStep[];
    faqs: FAQ[];
    relatedTools: ToolDefinition[];
  };
}

interface HowToStep {
  name: string;
  text: string;
}

interface FAQ {
  question: string;
  answer: string;
}
```

### Internationalization Models

```typescript
// lib/types/i18n.ts
type Locale = 'en-US' | 'en-GB' | 'en-AU';
type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY';
type CurrencyCode = 'USD' | 'GBP' | 'AUD' | 'EUR';

interface LocaleSettings {
  locale: Locale;
  dateFormat: DateFormat;
  currency: CurrencyCode;
  unitSystem: 'imperial' | 'metric';
}

// lib/constants/regions.ts
interface USState {
  code: string; // e.g., 'CA'
  name: string; // e.g., 'California'
  salesTaxRate?: number;
}

interface Region {
  code: string;
  name: string;
  country: 'US' | 'UK' | 'AU';
}

// Design Decision: Store locale preferences in localStorage with 
// US defaults (imperial units, MM/DD/YYYY, USD) per Requirement 14.1, 14.4
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Unit Conversion Round-Trip

*For any* valid unit conversion pair and any numeric value within the valid range, converting from unit A to unit B and then back from unit B to unit A SHALL produce a value equal to the original (within floating-point precision tolerance of 0.0001).

**Validates: Requirements 4.5**

### Property 2: Calculator Computation Correctness

*For any* calculator and any set of valid inputs, the calculator SHALL produce a numeric result that matches the expected output computed by the documented formula. *For any* set of invalid inputs, the calculator SHALL return an error object with a non-empty message.

**Validates: Requirements 3.1, 3.2, 3.6**

### Property 3: Input Accessibility Association

*For any* rendered input element in the application, there SHALL exist an associated label element with a matching `for` attribute or the input SHALL be wrapped by a label element.

**Validates: Requirements 2.7, 11.1**

### Property 4: Dynamic Route Generation

*For any* valid conversion pair (from-unit, to-unit) in the supported unit categories, the application SHALL generate a valid route at `/convert/[from]-to-[to]` that returns a 200 status code and renders the converter component.

**Validates: Requirements 1.5, 8.1-8.10**

### Property 5: Tool Registry Completeness

*For any* tool defined in the requirements (all 100 tools), the tool registry SHALL contain an entry with valid id, slug, name, description, category, keywords array, and path.

**Validates: Requirements 1.6**

### Property 6: SEO Content Completeness

*For any* tool page, the rendered HTML SHALL contain: (1) exactly one h1 element, (2) a meta description tag, (3) a canonical URL link, (4) structured data in JSON-LD format, (5) a "How to Use" section, and (6) an FAQ section with at least 3 questions.

**Validates: Requirements 10.1-10.9, 8.11, 8.12**

### Property 7: Number Formatting Consistency

*For any* numeric result displayed in the application, the number SHALL be formatted with appropriate thousand separators (commas for US locale) and decimal places (maximum 2 for currency, appropriate precision for calculations).

**Validates: Requirements 3.6, 14.1-14.5**

### Property 8: Responsive Layout Integrity

*For any* viewport width between 320px and 1920px, all tool components SHALL render without horizontal overflow and all interactive elements SHALL remain accessible and clickable.

**Validates: Requirements 13.2**

### Property 9: Keyboard Navigation Completeness

*For any* interactive element (buttons, inputs, links, toggles) in the application, the element SHALL be reachable via Tab key navigation and SHALL have a visible focus indicator when focused.

**Validates: Requirements 11.3, 11.5**

### Property 10: Color Contrast Compliance

*For any* text element displayed in the application, the color contrast ratio between the text color and its background SHALL be at least 4.5:1 for normal text and 3:1 for large text (18px+ or 14px+ bold).

**Validates: Requirements 11.2, 11.7**

### Property 11: Error Announcement Accessibility

*For any* validation error displayed in the application, the error message SHALL be associated with its input via aria-describedby AND the error region SHALL have aria-live="polite" or aria-live="assertive" for screen reader announcement.

**Validates: Requirements 11.6**



## Error Handling

### Input Validation Errors

```typescript
// lib/utils/validation.ts
interface ValidationError {
  field: string;
  message: string;
  code: 'required' | 'invalid_type' | 'out_of_range' | 'invalid_format';
}

interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

// Example validation for mortgage calculator
const mortgageSchema = z.object({
  homePrice: z.number().min(1000).max(100000000),
  downPayment: z.number().min(0),
  loanTerm: z.number().refine(v => [10, 15, 20, 25, 30].includes(v)),
  interestRate: z.number().min(0).max(30),
});
```

### Calculation Errors

```typescript
// lib/utils/errors.ts
class CalculationError extends Error {
  constructor(
    message: string,
    public code: 'division_by_zero' | 'overflow' | 'invalid_input',
    public field?: string
  ) {
    super(message);
    this.name = 'CalculationError';
  }
}

// Safe calculation wrapper
function safeCalculate<T>(
  fn: () => T,
  fallback: T
): { result: T; error?: CalculationError } {
  try {
    return { result: fn() };
  } catch (e) {
    if (e instanceof CalculationError) {
      return { result: fallback, error: e };
    }
    throw e;
  }
}
```

### Error Display Strategy

1. **Inline Errors**: Display validation errors directly below the relevant input field
2. **Toast Notifications**: Use for transient errors (e.g., copy to clipboard failed)
3. **Error Boundaries**: Wrap calculator components to catch rendering errors
4. **Graceful Degradation**: Show fallback UI if JavaScript fails to load
5. **Screen Reader Announcements**: Use aria-live regions to announce errors to assistive technology

```typescript
// components/ui/error-message.tsx
interface ErrorMessageProps {
  message: string;
  id: string; // For aria-describedby
  announce?: boolean; // Whether to announce to screen readers
}

// components/error-boundary.tsx
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

// components/ui/live-region.tsx
// Invisible region for screen reader announcements
interface LiveRegionProps {
  message: string;
  priority: 'polite' | 'assertive';
}
```

## Testing Strategy

### Dual Testing Approach

This project uses both unit tests and property-based tests for comprehensive coverage:

- **Unit Tests**: Verify specific examples, edge cases, and error conditions
- **Property-Based Tests**: Verify universal properties across randomly generated inputs

### Testing Framework

- **Test Runner**: Vitest
- **Property-Based Testing**: fast-check
- **Component Testing**: React Testing Library
- **E2E Testing**: Playwright (for critical user flows)

### Property-Based Test Configuration

Each property test will:
- Run minimum 100 iterations
- Use appropriate generators for the domain
- Reference the design document property being tested

```typescript
// Example: Unit Conversion Round-Trip Property Test
// Feature: english-tools-website, Property 1: Unit Conversion Round-Trip
import { fc } from 'fast-check';
import { convert, getUnitPairs } from '@/lib/conversions';

describe('Unit Conversion Properties', () => {
  const unitPairs = getUnitPairs('length');
  
  it.each(unitPairs)(
    'round-trip conversion %s <-> %s preserves value',
    (fromUnit, toUnit) => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.001, max: 1000000, noNaN: true }),
          (value) => {
            const converted = convert(value, fromUnit, toUnit);
            const roundTrip = convert(converted, toUnit, fromUnit);
            return Math.abs(roundTrip - value) < 0.0001;
          }
        ),
        { numRuns: 100 }
      );
    }
  );
});
```

### Unit Test Examples

```typescript
// Example: Mortgage Calculator Unit Tests
describe('Mortgage Calculator', () => {
  it('calculates correct monthly payment for standard loan', () => {
    const result = calculateMortgage({
      homePrice: 300000,
      downPayment: 60000,
      loanTerm: 30,
      interestRate: 6.5,
    });
    expect(result.monthlyPayment).toBeCloseTo(1516.26, 2);
  });

  it('handles zero interest rate', () => {
    const result = calculateMortgage({
      homePrice: 240000,
      downPayment: 0,
      loanTerm: 30,
      interestRate: 0,
    });
    expect(result.monthlyPayment).toBeCloseTo(666.67, 2);
  });

  it('returns error for negative home price', () => {
    expect(() => calculateMortgage({
      homePrice: -100000,
      downPayment: 0,
      loanTerm: 30,
      interestRate: 6.5,
    })).toThrow(CalculationError);
  });
});
```

### Test File Organization

```
/tests
├── unit/
│   ├── calculations/
│   │   ├── mortgage.test.ts
│   │   ├── bmi.test.ts
│   │   └── ...
│   ├── conversions/
│   │   ├── length.test.ts
│   │   ├── weight.test.ts
│   │   └── ...
│   └── utils/
│       ├── formatting.test.ts
│       └── validation.test.ts
├── property/
│   ├── conversion-roundtrip.test.ts
│   ├── calculator-correctness.test.ts
│   └── accessibility.test.ts
├── integration/
│   ├── tool-pages.test.ts
│   └── seo.test.ts
└── e2e/
    ├── calculator-flow.spec.ts
    └── converter-flow.spec.ts
```

## Implementation Notes

### Calculation Functions (Pure Functions)

All calculation logic should be implemented as pure functions in `/lib/calculations/`:

```typescript
// lib/calculations/finance/mortgage.ts
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  if (principal <= 0) throw new CalculationError('Principal must be positive', 'invalid_input', 'principal');
  if (annualRate < 0) throw new CalculationError('Rate cannot be negative', 'invalid_input', 'rate');
  
  if (annualRate === 0) {
    return principal / (termYears * 12);
  }
  
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  
  return principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
    (Math.pow(1 + monthlyRate, numPayments) - 1);
}
```

### SEO Page Generation

Each tool page should include:

```typescript
// app/calculators/finance/mortgage-calculator/page.tsx
import { Metadata } from 'next';
import { MortgageCalculator } from '@/components/calculators/finance/mortgage';
import { HowToSection } from '@/components/seo/how-to-section';
import { FAQSection } from '@/components/seo/faq-section';
import { toolRegistry } from '@/lib/constants/tool-registry';

const tool = toolRegistry['mortgage-calculator'];

export const metadata: Metadata = {
  title: `${tool.name} - Free Online Calculator`,
  description: tool.description,
  keywords: tool.keywords,
  alternates: {
    canonical: `https://example.com${tool.path}`,
  },
};

export default function MortgageCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": tool.name,
            "description": tool.description,
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
      <main>
        <h1>{tool.name}</h1>
        <MortgageCalculator />
        <HowToSection steps={mortgageHowToSteps} />
        <FAQSection faqs={mortgageFAQs} />
      </main>
    </>
  );
}
```

### Cookie Consent Implementation

```typescript
// components/layout/cookie-consent.tsx
'use client';

import { useState, useEffect } from 'react';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setShowBanner(true);
  }, []);
  
  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
    // Initialize analytics
  };
  
  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShowBanner(false);
    // Disable non-essential cookies
  };
  
  if (!showBanner) return null;
  
  return (
    <div role="dialog" aria-label="Cookie consent">
      {/* Banner UI */}
    </div>
  );
}
```

### Data Deletion Request Implementation

```typescript
// app/(marketing)/privacy/data-request/page.tsx
// Design Decision: Implement a simple form for data deletion requests
// Since the app uses localStorage only (no server-side user data),
// provide a "Clear My Data" button that clears all localStorage

interface DataRequestFormProps {
  onClearData: () => void;
}

// lib/utils/data-management.ts
export function clearAllUserData(): void {
  // Clear all localStorage items related to user preferences
  const keysToRemove = [
    'cookie-consent',
    'locale-settings',
    'calculator-history',
    'unit-preferences',
  ];
  keysToRemove.forEach(key => localStorage.removeItem(key));
}

// Design Decision: Since no personal data is collected server-side,
// data deletion is handled entirely client-side via localStorage clearing.
// This satisfies GDPR/CCPA requirements for this type of application.
```

### Performance Optimization Strategy

```typescript
// Design Decision: Use Next.js dynamic imports for code splitting
// Each calculator category is loaded as a separate chunk

// app/calculators/finance/mortgage-calculator/page.tsx
import dynamic from 'next/dynamic';

// Lazy load calculator component - only loads when page is visited
const MortgageCalculator = dynamic(
  () => import('@/components/calculators/finance/mortgage'),
  { 
    loading: () => <CalculatorSkeleton />,
    ssr: true // Enable SSR for SEO
  }
);

// components/ui/calculator-skeleton.tsx
// Skeleton loader shown while calculator chunk loads
interface CalculatorSkeletonProps {
  inputCount?: number;
}

// lib/utils/lazy-components.ts
// Utility for consistent lazy loading patterns
export function lazyCalculator<T>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>
) {
  return dynamic(importFn, {
    loading: () => <CalculatorSkeleton />,
    ssr: true,
  });
}
```

### Lazy Loading for Below-the-Fold Content

```typescript
// components/seo/lazy-faq-section.tsx
'use client';

import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';

const FAQSection = dynamic(() => import('./faq-section'));

export function LazyFAQSection({ faqs }: FAQSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px', // Load 200px before entering viewport
  });

  return (
    <div ref={ref}>
      {inView ? <FAQSection faqs={faqs} /> : <FAQSkeleton />}
    </div>
  );
}

// Design Decision: FAQ and How-To sections are below the fold on most tools
// Lazy loading these reduces initial bundle size and improves LCP
```

### Internationalization Utilities

```typescript
// lib/utils/formatting.ts
import { LocaleSettings } from '@/lib/types/i18n';

// Number formatting with locale support
export function formatNumber(
  value: number,
  locale: LocaleSettings['locale'] = 'en-US',
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

// Currency formatting with symbol support
export function formatCurrency(
  value: number,
  currency: CurrencyCode = 'USD',
  locale: LocaleSettings['locale'] = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

// Date formatting with regional support
export function formatDate(
  date: Date,
  format: DateFormat = 'MM/DD/YYYY',
  locale: LocaleSettings['locale'] = 'en-US'
): string {
  const options: Intl.DateTimeFormatOptions = 
    format === 'DD/MM/YYYY' 
      ? { day: '2-digit', month: '2-digit', year: 'numeric' }
      : { month: '2-digit', day: '2-digit', year: 'numeric' };
  return new Intl.DateTimeFormat(locale, options).format(date);
}

// lib/hooks/use-locale-settings.ts
// Hook for managing user locale preferences
export function useLocaleSettings(): {
  settings: LocaleSettings;
  updateSettings: (updates: Partial<LocaleSettings>) => void;
} {
  // Reads from localStorage, defaults to US settings
  // Persists changes to localStorage
}

// components/ui/region-selector.tsx
// Dropdown for selecting US state or region
interface RegionSelectorProps {
  value: string;
  onChange: (regionCode: string) => void;
  country?: 'US' | 'UK' | 'AU';
}

// Design Decision: Default to US conventions (imperial, MM/DD/YYYY, USD)
// per requirements, with easy toggle to metric and regional date formats
```

### Programmatic SEO for Converters

```typescript
// app/convert/[conversion]/page.tsx
import { notFound } from 'next/navigation';
import { getConversionPair, getAllConversionPairs } from '@/lib/conversions';

interface Props {
  params: { conversion: string }; // e.g., "kg-to-lbs"
}

export async function generateStaticParams() {
  const pairs = getAllConversionPairs();
  return pairs.map(({ from, to }) => ({
    conversion: `${from}-to-${to}`,
  }));
}

export async function generateMetadata({ params }: Props) {
  const pair = getConversionPair(params.conversion);
  if (!pair) return {};
  
  return {
    title: `${pair.from.name} to ${pair.to.name} Converter - Free Online Tool`,
    description: `Convert ${pair.from.name} (${pair.from.symbol}) to ${pair.to.name} (${pair.to.symbol}) instantly. Free online ${pair.category} converter.`,
  };
}

export default function ConversionPage({ params }: Props) {
  const pair = getConversionPair(params.conversion);
  if (!pair) notFound();
  
  return (
    // Converter component
  );
}
```
