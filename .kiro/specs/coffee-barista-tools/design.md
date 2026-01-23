# Design Document: Coffee & Barista Tools

## Overview

This design document specifies the implementation of a comprehensive Coffee & Barista Science category featuring 10 specialized calculators for third-wave coffee enthusiasts. The system will integrate seamlessly with the existing Next.js calculator website, following established patterns for component structure, validation, and user experience.

The calculators provide precision tools for coffee extraction analysis, brewing parameter optimization, and data-driven coffee preparation. Each calculator follows the existing architecture pattern: route page (page.tsx) → calculator component → calculation logic module.

## Architecture

### Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Validation**: Zod schemas
- **State Management**: Custom `useCalculator` hook
- **Testing**: Vitest for unit tests, fast-check for property-based tests

### Component Hierarchy

```
app/calculators/coffee/
├── page.tsx (Category landing page)
├── extraction-yield-calculator/
│   └── page.tsx (Route + metadata)
├── brew-ratio-calculator/
│   └── page.tsx
├── iced-coffee-dilution-calculator/
│   └── page.tsx
├── espresso-dial-in-log/
│   └── page.tsx
├── water-recipe-calculator/
│   └── page.tsx
├── grind-size-converter/
│   └── page.tsx
├── caffeine-half-life-tracker/
│   └── page.tsx
├── pour-over-timer/
│   └── page.tsx
├── cost-per-cup-calculator/
│   └── page.tsx
└── french-press-timer/
    └── page.tsx

components/calculators/coffee/
├── extraction-yield-calculator.tsx
├── brew-ratio-calculator.tsx
├── iced-coffee-dilution-calculator.tsx
├── espresso-dial-in-log.tsx
├── water-recipe-calculator.tsx
├── grind-size-converter.tsx
├── caffeine-half-life-tracker.tsx
├── pour-over-timer.tsx
├── cost-per-cup-calculator.tsx
└── french-press-timer.tsx

lib/calculations/coffee/
├── extraction-yield.ts
├── brew-ratio.ts
├── iced-coffee-dilution.ts
├── espresso-dial-in.ts
├── water-recipe.ts
├── grind-size-converter.ts
├── caffeine-half-life.ts
├── pour-over-timer.ts
├── cost-per-cup.ts
└── french-press-timer.ts
```

### Design Patterns

1. **Calculator Base Pattern**: All calculators use the `CalculatorBase` wrapper component for consistent UI
2. **Separation of Concerns**: 
   - Route pages handle metadata and SEO
   - Calculator components handle UI and user interaction
   - Calculation modules contain pure business logic
3. **Validation-First**: Zod schemas validate all inputs before calculations
4. **Error Handling**: Custom error classes for domain-specific errors
5. **Accessibility**: ARIA labels, keyboard navigation, focus management

## Components and Interfaces

### 1. Coffee Extraction Yield Calculator

**Purpose**: Calculate extraction yield percentage from TDS measurements.

**Component Interface**:
```typescript
interface ExtractionYieldInputs {
  tds: number;           // Total Dissolved Solids (%)
  coffeeDose: number;    // Coffee dose (g)
  beverageWeight: number; // Beverage weight (g)
}

interface ExtractionYieldResults {
  extractionYield: number;     // Extraction percentage
  assessment: 'under-extracted' | 'optimal' | 'over-extracted';
  recommendation: string;
}
```

**Calculation Formula**:
```
Extraction % = (TDS × Beverage Weight) / Coffee Dose × 100
```

**Validation Rules**:
- TDS: 0.01% - 5% (typical range)
- Coffee Dose: 1g - 100g
- Beverage Weight: 10g - 1000g

**Assessment Thresholds**:
- Under-extracted: < 18%
- Optimal: 18% - 22%
- Over-extracted: > 22%

---

### 2. Brew Ratio Calculator

**Purpose**: Calculate water amount needed for desired brew ratio.

**Component Interface**:
```typescript
interface BrewRatioInputs {
  coffeeDose: number;    // Coffee dose (g)
  ratio: number;         // Ratio multiplier (e.g., 15 for 1:15)
}

interface BrewRatioResults {
  waterAmount: number;   // Water amount (g/ml)
  strengthProfile: 'strong' | 'balanced' | 'mild';
  ratioDisplay: string;  // e.g., "1:15"
}
```

**Calculation Formula**:
```
Water Amount = Coffee Dose × Ratio
```

**Validation Rules**:
- Coffee Dose: 1g - 100g
- Ratio: 10 - 25 (typical range 1:10 to 1:25)

**Strength Profiles**:
- Strong: ≤ 1:15
- Balanced: 1:15 - 1:17
- Mild: > 1:17

---

### 3. Iced Coffee Dilution Calculator

**Purpose**: Calculate ice and hot coffee amounts for target concentration.

**Component Interface**:
```typescript
interface IcedCoffeeDilutionInputs {
  targetVolume: number;      // Target final volume (ml)
  targetTDS: number;         // Target TDS (%)
  icePercentage: number;     // Ice as % of final volume
}

interface IcedCoffeeDilutionResults {
  hotCoffeeAmount: number;   // Hot coffee to brew (ml)
  iceAmount: number;         // Ice needed (g)
  brewingTDS: number;        // TDS to brew hot coffee at (%)
  warning?: string;          // Warning for excessive dilution
}
```

**Calculation Formulas**:
```
Ice Amount = Target Volume × (Ice Percentage / 100)
Hot Coffee Amount = Target Volume - Ice Amount
Brewing TDS = (Target TDS × Target Volume) / Hot Coffee Amount
```

**Validation Rules**:
- Target Volume: 100ml - 2000ml
- Target TDS: 0.5% - 3%
- Ice Percentage: 10% - 70%

**Warning Threshold**: Ice > 50% triggers dilution warning

---

### 4. Espresso Dial-in Log

**Purpose**: Track espresso shots with extraction metrics.

**Component Interface**:
```typescript
interface EspressoShot {
  id: string;
  timestamp: Date;
  dose: number;          // Coffee dose (g)
  yield: number;         // Beverage yield (g)
  time: number;          // Extraction time (s)
  grindSetting: string;  // Grinder setting
  tasteNotes: string;    // Tasting notes
}

interface EspressoMetrics {
  extractionRatio: number;  // Yield / Dose
  flowRate: number;         // Yield / Time (g/s)
  recommendation: string;
}
```

**Calculation Formulas**:
```
Extraction Ratio = Yield / Dose
Flow Rate = Yield / Time
```

**Validation Rules**:
- Dose: 5g - 30g
- Yield: 10g - 100g
- Time: 10s - 60s

**Extraction Ratio Assessment**:
- Too low (< 1.5): Increase yield or decrease dose
- Optimal (1.5 - 2.5): Good extraction
- Too high (> 2.5): Decrease yield or increase dose

---

### 5. Water Recipe for Coffee

**Purpose**: Calculate mineral additions for SCA-standard brewing water.

**Component Interface**:
```typescript
interface WaterRecipeInputs {
  waterVolume: number;      // Water volume (L)
  targetHardness: number;   // Target hardness (ppm)
  targetAlkalinity: number; // Target alkalinity (ppm)
}

interface WaterRecipeResults {
  epsomSalt: number;        // Epsom salt (MgSO4) amount (g)
  bakingSoda: number;       // Baking soda (NaHCO3) amount (g)
  scaCompliant: boolean;    // Within SCA standards
  instructions: string[];
}
```

**Calculation Formulas**:
```
// Epsom Salt (MgSO4·7H2O) provides hardness
// 1g MgSO4·7H2O per liter = ~100 ppm hardness
Epsom Salt (g) = (Target Hardness / 100) × Water Volume

// Baking Soda (NaHCO3) provides alkalinity
// 1g NaHCO3 per liter = ~120 ppm alkalinity
Baking Soda (g) = (Target Alkalinity / 120) × Water Volume
```

**Validation Rules**:
- Water Volume: 0.5L - 20L
- Target Hardness: 0 - 300 ppm
- Target Alkalinity: 0 - 150 ppm

**SCA Standards**:
- Hardness: 50 - 175 ppm
- Alkalinity: 40 - 70 ppm

---

### 6. Grind Size Converter

**Purpose**: Convert grind settings between popular grinder models.

**Component Interface**:
```typescript
interface GrindSizeInputs {
  sourceGrinder: string;    // Source grinder model
  sourceSetting: number;    // Source setting
  targetGrinder: string;    // Target grinder model
}

interface GrindSizeResults {
  targetSetting: number;    // Converted setting
  grindDescription: string; // e.g., "Medium-fine"
  confidence: 'high' | 'medium' | 'low';
}

type GrindSize = 'extra-fine' | 'fine' | 'medium-fine' | 'medium' | 'medium-coarse' | 'coarse' | 'extra-coarse';
```

**Grinder Database**:
```typescript
const GRINDER_CONVERSION_TABLE = {
  'comandante': {
    range: [0, 40],
    espresso: [8, 12],
    pourOver: [18, 24],
    frenchPress: [28, 35],
  },
  'timemore-c2': {
    range: [0, 36],
    espresso: [6, 10],
    pourOver: [14, 20],
    frenchPress: [24, 30],
  },
  'baratza-encore': {
    range: [1, 40],
    espresso: [5, 10],
    pourOver: [15, 20],
    frenchPress: [28, 35],
  },
  // Additional grinders...
};
```

**Conversion Algorithm**:
1. Normalize source setting to 0-1 scale within grinder's range
2. Map to grind size category
3. Convert to target grinder's equivalent setting

**Validation Rules**:
- Source/Target grinder must exist in database
- Setting must be within grinder's valid range

---

### 7. Caffeine Half-Life Tracker

**Purpose**: Track caffeine intake and calculate current blood levels.

**Component Interface**:
```typescript
interface CaffeineIntake {
  id: string;
  time: Date;
  caffeineMg: number;
  source: string;  // e.g., "Espresso", "Pour Over"
}

interface CaffeineTrackerInputs {
  intakes: CaffeineIntake[];
  currentTime: Date;
}

interface CaffeineTrackerResults {
  currentLevel: number;      // Current caffeine (mg)
  halfLifeRemaining: number; // Time to 50% reduction (hours)
  sleepRecommendation: string;
  timeline: Array<{ time: Date; level: number }>;
}
```

**Calculation Formula**:
```
// Caffeine half-life: 5 hours
// Exponential decay: C(t) = C₀ × (1/2)^(t/t½)

Current Level = Σ (Intake × (0.5)^((Current Time - Intake Time) / 5 hours))
```

**Validation Rules**:
- Caffeine amount: 1mg - 500mg per intake
- Intake time cannot be in the future

**Sleep Recommendations**:
- < 50mg: Safe for sleep
- 50-100mg: May affect sleep quality
- > 100mg: Avoid caffeine, wait for metabolism

---

### 8. Pour Over Timer

**Purpose**: Multi-stage pour timer with method presets.

**Component Interface**:
```typescript
interface PourOverInputs {
  totalWater: number;       // Total water (g)
  method: '4:6' | 'tetsu-kasuya' | 'custom';
  numberOfPours: number;    // For custom method
}

interface PourStage {
  stageNumber: number;
  waterAmount: number;      // Water for this pour (g)
  startTime: number;        // Start time (seconds)
  endTime: number;          // End time (seconds)
}

interface PourOverResults {
  stages: PourStage[];
  totalTime: number;
  instructions: string[];
}
```

**4:6 Method Algorithm**:
```
Total Water = W
First 40% (2 pours): W × 0.4 / 2 = W × 0.2 each
Remaining 60% (3 pours): W × 0.6 / 3 = W × 0.2 each

Timing:
Pour 1: 0:00 - 0:45 (bloom)
Pour 2: 0:45 - 1:30
Pour 3: 1:30 - 2:15
Pour 4: 2:15 - 3:00
Pour 5: 3:00 - 3:45
```

**Validation Rules**:
- Total Water: 100g - 1000g
- Number of Pours: 1 - 10 (custom method)

---

### 9. Cost Per Cup Calculator

**Purpose**: Calculate actual cost per cup from bag price.

**Component Interface**:
```typescript
interface CostPerCupInputs {
  bagPrice: number;         // Bag price ($)
  bagWeight: number;        // Bag weight (g)
  dosePerCup: number;       // Dose per cup (g)
  cupsPerDay?: number;      // Optional for monthly/annual calc
}

interface CostPerCupResults {
  costPerCup: number;       // Cost per cup ($)
  costPerGram: number;      // Cost per gram ($)
  cupsPerBag: number;       // Cups from one bag
  monthlyCost?: number;     // Monthly cost ($)
  annualCost?: number;      // Annual cost ($)
}
```

**Calculation Formulas**:
```
Cost Per Gram = Bag Price / Bag Weight
Cost Per Cup = Cost Per Gram × Dose Per Cup
Cups Per Bag = Bag Weight / Dose Per Cup
Monthly Cost = Cost Per Cup × Cups Per Day × 30
Annual Cost = Monthly Cost × 12
```

**Validation Rules**:
- Bag Price: $1 - $500
- Bag Weight: 100g - 5000g
- Dose Per Cup: 5g - 50g
- Cups Per Day: 0 - 20

---

### 10. French Press Timer

**Purpose**: Timer with bloom and stir reminders.

**Component Interface**:
```typescript
interface FrenchPressInputs {
  coffeeDose: number;       // Coffee dose (g)
  waterAmount: number;      // Water amount (g)
  steepTime: number;        // Steep time (minutes)
}

interface FrenchPressResults {
  brewRatio: number;        // Water / Coffee ratio
  strengthEstimate: string; // Strength description
  timeline: Array<{
    time: number;           // Time in seconds
    action: string;         // Action description
    type: 'bloom' | 'stir' | 'press';
  }>;
}
```

**Timeline Algorithm**:
```
0:00 - Add coffee and start bloom
0:30 - Bloom complete, add remaining water
Halfway point - Stir reminder
Steep Time complete - Press reminder
```

**Validation Rules**:
- Coffee Dose: 10g - 100g
- Water Amount: 100g - 2000g
- Steep Time: 2 - 10 minutes

**Brew Ratio Calculation**:
```
Brew Ratio = Water Amount / Coffee Dose
```

## Data Models

### Zod Validation Schemas

All calculators use Zod schemas for input validation. Example pattern:

```typescript
import { z } from 'zod';

export const extractionYieldSchema = z.object({
  tds: z.number()
    .min(0.01, 'TDS must be at least 0.01%')
    .max(5, 'TDS cannot exceed 5%'),
  coffeeDose: z.number()
    .min(1, 'Coffee dose must be at least 1g')
    .max(100, 'Coffee dose cannot exceed 100g'),
  beverageWeight: z.number()
    .min(10, 'Beverage weight must be at least 10g')
    .max(1000, 'Beverage weight cannot exceed 1000g'),
});

export type ExtractionYieldInputs = z.infer<typeof extractionYieldSchema>;
```

### Error Handling

Custom error classes for domain-specific errors:

```typescript
export class CoffeeCalculationError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'out_of_range' | 'conversion_failed',
    public field?: string
  ) {
    super(message);
    this.name = 'CoffeeCalculationError';
  }
}
```

### Tool Registry Entries

Each calculator must be registered in `lib/constants/tool-registry.ts`:

```typescript
'extraction-yield-calculator': {
  id: 'extraction-yield-calculator',
  slug: 'extraction-yield-calculator',
  name: 'Coffee Extraction Yield Calculator',
  description: 'Calculate extraction yield from TDS measurements',
  category: 'coffee',
  keywords: ['extraction yield', 'TDS', 'coffee extraction', 'brew strength'],
  path: '/calculators/coffee/extraction-yield-calculator',
  icon: 'Coffee',
  relatedTools: ['brew-ratio-calculator', 'iced-coffee-dilution-calculator'],
},
// ... additional entries
```

### Category Configuration

Add coffee category to category registry:

```typescript
export const categories = {
  // ... existing categories
  coffee: {
    id: 'coffee',
    name: 'Coffee & Barista',
    description: 'Extraction, ratios, timers & brew science',
    icon: 'Coffee',
    color: 'amber',
    path: '/calculators/coffee',
  },
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Extraction Yield Calculator Properties

**Property 1: Extraction Yield Formula Correctness**
*For any* valid TDS percentage, coffee dose, and beverage weight, the calculated extraction yield should equal (TDS × Beverage Weight) / Coffee Dose × 100
**Validates: Requirements 1.1**

**Property 2: Extraction Assessment Classification**
*For any* calculated extraction yield, the assessment should be "under-extracted" when yield < 18%, "optimal" when 18% ≤ yield ≤ 22%, and "over-extracted" when yield > 22%
**Validates: Requirements 1.2, 1.3, 1.4**

**Property 3: Extraction Yield Input Validation**
*For any* input where TDS ≤ 0, coffee dose ≤ 0, or beverage weight ≤ 0, the calculator should reject the input and display a validation error
**Validates: Requirements 1.5, 1.6, 1.7**

### Brew Ratio Calculator Properties

**Property 4: Brew Ratio Water Calculation**
*For any* valid coffee dose and ratio multiplier, the calculated water amount should equal coffee dose × ratio multiplier
**Validates: Requirements 2.1**

**Property 5: Strength Profile Classification**
*For any* brew ratio, the strength profile should be "strong" when ratio ≤ 15, "balanced" when 15 < ratio ≤ 17, and "mild" when ratio > 17
**Validates: Requirements 2.2, 2.3, 2.4**

**Property 6: Brew Ratio Input Validation**
*For any* input where coffee dose ≤ 0 or ratio < 1, the calculator should reject the input and display a validation error
**Validates: Requirements 2.5, 2.6**

### Iced Coffee Dilution Calculator Properties

**Property 7: Hot Coffee Amount Calculation**
*For any* valid target volume, target TDS, and ice percentage, the hot coffee amount should account for dilution such that (hot coffee TDS × hot coffee amount) / target volume = target TDS
**Validates: Requirements 3.1**

**Property 8: Ice Amount Calculation**
*For any* valid target volume and ice percentage, the ice amount should equal target volume × (ice percentage / 100)
**Validates: Requirements 3.2**

**Property 9: Excessive Dilution Warning**
*For any* ice percentage > 50%, the calculator should display a warning about excessive dilution
**Validates: Requirements 3.3**

**Property 10: Iced Coffee Input Validation**
*For any* input where target volume ≤ 0, ice percentage < 0, ice percentage > 100, or target TDS ≤ 0, the calculator should reject the input and display a validation error
**Validates: Requirements 3.4, 3.5, 3.6**

### Espresso Dial-in Log Properties

**Property 11: Extraction Ratio Calculation**
*For any* valid dose and yield, the extraction ratio should equal yield / dose
**Validates: Requirements 4.1**

**Property 12: Flow Rate Calculation**
*For any* valid yield and time, the flow rate should equal yield / time
**Validates: Requirements 4.2**

**Property 13: Espresso Recommendation Classification**
*For any* extraction ratio, the recommendation should suggest increasing yield or decreasing dose when ratio < 1.5, indicate optimal when 1.5 ≤ ratio ≤ 2.5, and suggest decreasing yield or increasing dose when ratio > 2.5
**Validates: Requirements 4.3, 4.4, 4.5**

**Property 14: Espresso Input Validation**
*For any* input where dose ≤ 0, yield ≤ 0, or time ≤ 0, the calculator should reject the input and display a validation error
**Validates: Requirements 4.6, 4.7, 4.8**

### Water Recipe Calculator Properties

**Property 15: Epsom Salt Calculation**
*For any* valid water volume and target hardness, the Epsom salt amount should equal (target hardness / 100) × water volume
**Validates: Requirements 5.1**

**Property 16: Baking Soda Calculation**
*For any* valid water volume and target alkalinity, the baking soda amount should equal (target alkalinity / 120) × water volume
**Validates: Requirements 5.2**

**Property 17: SCA Compliance Indicators**
*For any* target hardness and alkalinity, the calculator should indicate SCA-compliant when 50 ≤ hardness ≤ 175 ppm AND 40 ≤ alkalinity ≤ 70 ppm
**Validates: Requirements 5.3, 5.4**

**Property 18: Water Recipe Input Validation**
*For any* input where water volume ≤ 0, target hardness < 0, or target alkalinity < 0, the calculator should reject the input and display a validation error
**Validates: Requirements 5.5, 5.6, 5.7**

### Grind Size Converter Properties

**Property 19: Grind Conversion Consistency**
*For any* valid source grinder, source setting, and target grinder in the database, converting from source to target and back to source should produce a setting within ±1 click of the original
**Validates: Requirements 6.1**

**Property 20: Grind Description Presence**
*For any* valid grind setting, the calculator should provide a grind size description (extra fine, fine, medium-fine, medium, medium-coarse, coarse, or extra coarse)
**Validates: Requirements 6.2**

**Property 21: Grind Converter Error Handling**
*For any* grinder not in the conversion database or setting outside the valid range, the calculator should display an error message
**Validates: Requirements 6.3, 6.4, 6.5**

### Caffeine Half-Life Tracker Properties

**Property 22: Caffeine Intake Persistence**
*For any* caffeine intake added to the tracker, retrieving the intake list should include the added intake with identical time and caffeine amount
**Validates: Requirements 7.1**

**Property 23: Caffeine Decay Calculation**
*For any* set of caffeine intakes and current time, the current caffeine level should equal the sum of (intake amount × 0.5^((current time - intake time) / 5 hours)) for all intakes
**Validates: Requirements 7.2**

**Property 24: Sleep Recommendation Classification**
*For any* current caffeine level, the recommendation should indicate safe for sleep when level < 50mg and recommend avoiding caffeine when level > 100mg
**Validates: Requirements 7.3, 7.4**

**Property 25: Caffeine Tracker Input Validation**
*For any* input where caffeine amount ≤ 0 or intake time is in the future, the calculator should reject the input and display a validation error
**Validates: Requirements 7.5, 7.6**

### Pour Over Timer Properties

**Property 26: 4:6 Method Water Distribution**
*For any* total water amount using the 4:6 method, the first two pours should total 40% of water and the remaining three pours should total 60% of water
**Validates: Requirements 8.1**

**Property 27: Custom Pour Distribution**
*For any* total water amount and number of pours, each pour should receive total water / number of pours (within rounding tolerance)
**Validates: Requirements 8.2**

**Property 28: Pour Over Input Validation**
*For any* input where total water ≤ 0 or number of pours < 1, the calculator should reject the input and display a validation error
**Validates: Requirements 8.5, 8.6**

### Cost Per Cup Calculator Properties

**Property 29: Cost Per Cup Calculation**
*For any* valid bag price, bag weight, and dose per cup, the cost per cup should equal (bag price / bag weight) × dose per cup
**Validates: Requirements 9.1**

**Property 30: Monthly Cost Calculation**
*For any* valid cost per cup and cups per day, the monthly cost should equal cost per cup × cups per day × 30
**Validates: Requirements 9.2**

**Property 31: Annual Cost Calculation**
*For any* valid monthly cost, the annual cost should equal monthly cost × 12
**Validates: Requirements 9.3**

**Property 32: Cost Calculator Input Validation**
*For any* input where bag price ≤ 0, bag weight ≤ 0, or dose per cup ≤ 0, the calculator should reject the input and display a validation error
**Validates: Requirements 9.4, 9.5, 9.6**

### French Press Timer Properties

**Property 33: French Press Brew Ratio Calculation**
*For any* valid coffee dose and water amount, the brew ratio should equal water amount / coffee dose
**Validates: Requirements 10.1**

**Property 34: French Press Input Validation**
*For any* input where coffee dose ≤ 0, water amount ≤ 0, or steep time ≤ 0, the calculator should reject the input and display a validation error
**Validates: Requirements 10.5, 10.6, 10.7**

### Category and Navigation Properties

**Property 35: Calculator Card Completeness**
*For any* calculator displayed on the category page, the card should include name, description, and icon
**Validates: Requirements 11.2**

**Property 36: Related Tools Presence**
*For any* calculator page, the related tools section should contain at least one valid tool ID from the coffee category
**Validates: Requirements 11.5**

### Validation and Error Handling Properties

**Property 37: Field-Specific Error Messages**
*For any* form submission with invalid inputs, each invalid field should display a field-specific error message
**Validates: Requirements 12.1**

**Property 38: Range Error Messages**
*For any* input value outside the acceptable range, the error message should include the acceptable range
**Validates: Requirements 12.3**

**Property 39: Calculation Prevention with Errors**
*For any* form with validation errors, the calculator should not perform calculations or display results
**Validates: Requirements 12.5**

### Unit Conversion Properties

**Property 40: Unit Conversion Round Trip**
*For any* calculator supporting unit conversion, converting from metric to imperial and back to metric should preserve the original value (within rounding tolerance of 0.1%)
**Validates: Requirements 13.2**

**Property 41: Unit Conversion Invariance**
*For any* calculation result, switching units should not change the underlying calculation values, only the display units
**Validates: Requirements 13.3**

### SEO and Metadata Properties

**Property 42: Metadata Completeness**
*For any* calculator page, the metadata should include title, description, keywords, structured data with @type "WebApplication", FAQ structured data with at least 3 questions, Open Graph metadata, and canonical URL
**Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5**

### Accessibility Properties

**Property 43: ARIA Label Presence**
*For any* form input or interactive element, an ARIA label should be present
**Validates: Requirements 15.1**

### Tool Registry Properties

**Property 44: Registry Entry Completeness**
*For any* calculator in the coffee category, the tool registry entry should include unique ID, name, description, category, keywords array (non-empty), related tools array, path, and icon
**Validates: Requirements 16.1, 16.2, 16.3, 16.4, 16.5**

## Error Handling

### Error Types

1. **Validation Errors**: Input values outside acceptable ranges
2. **Calculation Errors**: Mathematical errors (division by zero, etc.)
3. **Conversion Errors**: Grinder not found in database
4. **Data Errors**: Missing or corrupted data

### Error Display Strategy

- **Field-level errors**: Display below the input field with red text
- **Form-level errors**: Display at the top of the form in an alert box
- **Calculation errors**: Display in place of results with explanation
- **Toast notifications**: For non-blocking errors (e.g., data save failures)

### Error Recovery

- Preserve user input when errors occur
- Provide clear guidance on how to fix errors
- Suggest valid ranges for out-of-range inputs
- Allow partial form completion (save progress)

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

**Unit Tests**: Verify specific examples, edge cases, and error conditions
- Specific TDS/dose/weight combinations for extraction yield
- Boundary values for classification thresholds
- Error handling for invalid inputs
- UI component rendering
- Integration between components

**Property-Based Tests**: Verify universal properties across all inputs
- Mathematical formula correctness across random inputs
- Classification consistency across ranges
- Input validation for all invalid input types
- Round-trip properties for conversions
- Invariant properties for unit conversions

### Property-Based Testing Configuration

**Library**: fast-check (JavaScript/TypeScript property-based testing library)

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Tag format: `Feature: coffee-barista-tools, Property {number}: {property_text}`

**Example Property Test**:
```typescript
import fc from 'fast-check';
import { describe, it } from 'vitest';
import { calculateExtractionYield } from '@/lib/calculations/coffee/extraction-yield';

describe('Coffee Extraction Yield Calculator', () => {
  it('Feature: coffee-barista-tools, Property 1: Extraction yield formula correctness', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0.01, max: 5 }),      // TDS
        fc.float({ min: 1, max: 100 }),       // Coffee dose
        fc.float({ min: 10, max: 1000 }),     // Beverage weight
        (tds, coffeeDose, beverageWeight) => {
          const result = calculateExtractionYield({ tds, coffeeDose, beverageWeight });
          const expected = (tds * beverageWeight) / coffeeDose * 100;
          
          // Allow small floating-point tolerance
          expect(Math.abs(result.extractionYield - expected)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Test Coverage Goals

- **Unit Test Coverage**: 80% minimum for calculation modules
- **Property Test Coverage**: All mathematical formulas and classifications
- **Integration Test Coverage**: Key user flows (calculate → view results → reset)
- **Accessibility Testing**: Automated tests with axe-core

### Testing Priorities

1. **High Priority**: Mathematical calculations, input validation, error handling
2. **Medium Priority**: UI component rendering, state management, navigation
3. **Low Priority**: Visual styling, animations, non-critical features

## Implementation Notes

### Performance Considerations

- **Debounce input changes**: Prevent excessive recalculations during typing
- **Memoize expensive calculations**: Cache results for identical inputs
- **Lazy load calculator components**: Only load when navigating to calculator page
- **Optimize bundle size**: Tree-shake unused dependencies

### Accessibility Requirements

- All form inputs must have associated labels
- Error messages must be announced to screen readers
- Keyboard navigation must work for all interactive elements
- Focus management for modal dialogs and timers
- Color contrast ratios must meet WCAG AA standards (4.5:1 for text)

### Browser Compatibility

- Support modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for older browsers
- Progressive enhancement for advanced features
- Test on mobile browsers (iOS Safari, Chrome Mobile)

### Internationalization Considerations

- Use decimal separators appropriate for locale
- Support both metric and imperial units
- Date/time formatting based on locale
- Consider future translation support (use i18n-ready strings)

## Design Decisions and Rationales

### Why TypeScript?

TypeScript provides type safety for complex calculation logic, reducing runtime errors and improving developer experience. The existing codebase uses TypeScript, ensuring consistency.

### Why Zod for Validation?

Zod provides runtime type validation with excellent TypeScript integration. It allows defining schemas once and using them for both validation and type inference, reducing code duplication.

### Why fast-check for Property-Based Testing?

fast-check is the most mature property-based testing library for JavaScript/TypeScript. It integrates well with Vitest and provides excellent shrinking capabilities for finding minimal failing cases.

### Why Separate Calculation Modules?

Separating calculation logic from UI components enables:
- Pure function testing without UI dependencies
- Reusability across different UI contexts
- Easier maintenance and debugging
- Better code organization

### Why Custom useCalculator Hook?

The custom hook provides:
- Consistent state management across all calculators
- Built-in validation and error handling
- Local storage persistence
- Reduced boilerplate in calculator components

### Color Scheme Choice

Amber/brown tones were chosen for the coffee category because:
- They evoke coffee and warmth
- They provide good contrast with the existing color palette
- They are distinct from other category colors
- They work well in both light and dark modes

## Future Enhancements

### Phase 2 Features (Not in Current Scope)

1. **Brew Recipe Library**: Save and share brew recipes
2. **Grinder Database Expansion**: Add more grinder models
3. **Advanced Water Chemistry**: pH calculations, buffer capacity
4. **Espresso Pressure Profiling**: Pressure curve visualization
5. **Coffee Bean Database**: Origin, roast level, flavor notes
6. **Brew History Tracking**: Long-term tracking and analytics
7. **Mobile App**: Native iOS/Android apps
8. **Social Features**: Share recipes, follow other brewers
9. **Equipment Recommendations**: Based on brewing preferences
10. **Video Tutorials**: Embedded brewing technique videos

### Technical Debt Considerations

- Consider migrating to a state management library if complexity grows
- Evaluate performance optimizations for timer components
- Consider server-side rendering for improved SEO
- Evaluate accessibility testing automation
- Consider adding E2E tests with Playwright

## Appendix

### References

- [Specialty Coffee Association Standards](https://sca.coffee/research/protocols-best-practices)
- [Coffee Extraction Theory](https://www.baristahustle.com/blog/the-coffee-compass/)
- [Water Chemistry for Coffee](https://www.baristahustle.com/blog/water-chemistry-for-coffee/)
- [Grind Size Guide](https://www.baristahustle.com/blog/grind-size-matters/)
- [Caffeine Pharmacokinetics](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5445139/)

### Glossary

- **TDS**: Total Dissolved Solids, measured as a percentage
- **Extraction Yield**: Percentage of coffee grounds dissolved into the beverage
- **Brew Ratio**: Ratio of coffee dose to water amount (e.g., 1:15)
- **SCA**: Specialty Coffee Association
- **Dial In**: Process of adjusting espresso parameters for optimal extraction
- **Pour Over**: Manual brewing method with staged water pours
- **4:6 Method**: Pour over technique with 40% water in first 2 pours, 60% in remaining 3
- **Half-Life**: Time for caffeine concentration to reduce by 50%
- **Epsom Salt**: Magnesium sulfate (MgSO4), provides water hardness
- **Baking Soda**: Sodium bicarbonate (NaHCO3), provides water alkalinity
