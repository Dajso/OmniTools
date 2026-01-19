# Design Document: Expanded Tools Categories

## Overview

This design document outlines the architecture and implementation approach for expanding the OmniTools website with 15 new tool categories comprising approximately 130+ new tools. The design follows the existing project patterns while introducing new component templates and libraries to support advanced features like PDF generation, charts, QR codes, and audio processing.

The expansion targets specific high-value user segments:
- Students (seasonal traffic spikes during finals/back-to-school)
- Digital nomads (high-value users with specific needs)
- Gamers (viral potential, easy sharing)
- Content creators (B2B value, recurring usage)
- Hobbyists (crafters, gardeners, musicians, RPG players)

## Architecture

### Directory Structure Extension

```
app/
├── calculators/
│   ├── academic/           # Category F: Student & Academic
│   ├── travel/             # Category G: Travel & Digital Nomad
│   ├── gaming/             # Category H: Gaming & E-Sports
│   ├── creator/            # Category I: Creator Economy
│   ├── fun/                # Category J: Fun & Psychology
│   ├── audio/              # Category K: Audio & Music
│   ├── rpg/                # Category L: Tabletop RPG
│   ├── crypto/             # Category N: Crypto & Web3
│   ├── photo/              # Category O: Photography & Video
│   ├── crafts/             # Category P: Knitting & Sewing
│   ├── garden/             # Category Q: Gardening
│   ├── electronics/        # Category R: Electronics
│   ├── betting/            # Category S: Sports Betting
│   ├── auto/               # Category T: Automotive
│   ├── stats/              # Category U: Statistics
│   ├── time/               # Category V: Time & Date
│   ├── physics/            # Category X: Physics
│   └── construction/       # Category Y: Construction Advanced
│
components/
├── calculators/
│   ├── academic/
│   ├── travel/
│   ├── gaming/
│   ├── creator/
│   ├── fun/
│   ├── audio/
│   ├── rpg/
│   ├── crypto/
│   ├── photo/
│   ├── crafts/
│   ├── garden/
│   ├── electronics/
│   ├── betting/
│   ├── auto/
│   ├── stats/
│   ├── time/
│   ├── physics/
│   └── construction/
│
lib/
├── calculations/
│   ├── academic/
│   ├── travel/
│   ├── gaming/
│   ├── creator/
│   ├── fun/
│   ├── audio/
│   ├── rpg/
│   ├── crypto/
│   ├── photo/
│   ├── crafts/
│   ├── garden/
│   ├── electronics/
│   ├── betting/
│   ├── auto/
│   ├── stats/
│   ├── time/
│   ├── physics/
│   └── construction/
```

### New Dependencies

```json
{
  "dependencies": {
    "jspdf": "^2.5.1",           // PDF generation (invoices, calendars)
    "recharts": "^2.12.0",        // Charts (biorhythm, statistics)
    "react-qr-code": "^2.0.12",   // QR code generation
    "date-fns": "^3.6.0",         // Date calculations
    "tone": "^14.7.77"            // Audio synthesis (metronome, tuner)
  }
}
```

## Components and Interfaces

### Base Template Components

#### 1. Calculator Template (Input-Compute-Output)

```typescript
// components/templates/calculator-template.tsx
interface CalculatorTemplateProps {
  title: string;
  description: string;
  inputs: InputConfig[];
  calculate: (values: Record<string, number | string>) => CalculationResult;
  formatResult: (result: CalculationResult) => ReactNode;
  formula?: string;
}

interface InputConfig {
  id: string;
  label: string;
  type: 'number' | 'select' | 'date' | 'text';
  options?: { value: string; label: string }[];
  defaultValue?: string | number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

interface CalculationResult {
  primary: { label: string; value: string | number; unit?: string };
  secondary?: { label: string; value: string | number; unit?: string }[];
  breakdown?: { label: string; value: string | number }[];
}
```

#### 2. Generator Template (Content Generation)

```typescript
// components/templates/generator-template.tsx
interface GeneratorTemplateProps {
  title: string;
  description: string;
  options: GeneratorOption[];
  generate: (config: GeneratorConfig) => GeneratedContent;
  renderContent: (content: GeneratedContent) => ReactNode;
  allowCopy?: boolean;
  allowExport?: 'pdf' | 'image' | 'text';
}

interface GeneratorOption {
  id: string;
  label: string;
  type: 'select' | 'number' | 'checkbox' | 'text';
  options?: { value: string; label: string }[];
}

interface GeneratedContent {
  text?: string;
  items?: string[];
  structured?: Record<string, unknown>;
}
```

#### 3. Timer Template (Countdown/Stopwatch)

```typescript
// components/templates/timer-template.tsx
interface TimerTemplateProps {
  title: string;
  description: string;
  mode: 'countdown' | 'stopwatch' | 'pomodoro';
  presets?: { label: string; duration: number }[];
  onComplete?: () => void;
  showProgress?: boolean;
  allowCustomDuration?: boolean;
}
```

#### 4. Interactive Template (Real-time Visual Feedback)

```typescript
// components/templates/interactive-template.tsx
interface InteractiveTemplateProps {
  title: string;
  description: string;
  renderInteractive: () => ReactNode;
  onInteraction: (event: InteractionEvent) => void;
  showResults?: boolean;
  results?: InteractionResult[];
}
```

#### 5. Lookup Template (Reference/Chart)

```typescript
// components/templates/lookup-template.tsx
interface LookupTemplateProps {
  title: string;
  description: string;
  data: LookupData[];
  searchable?: boolean;
  filterable?: boolean;
  columns: ColumnConfig[];
  renderVisual?: (selected: LookupData) => ReactNode;
}
```

### Category-Specific Components

#### Academic Tools (Category F)

```typescript
// lib/calculations/academic/gpa-calculator.ts
interface Course {
  name: string;
  credits: number;
  grade: string;
  isHonors?: boolean;
  isAP?: boolean;
}

interface GPAResult {
  unweightedGPA: number;
  weightedGPA: number;
  totalCredits: number;
  gradeDistribution: Record<string, number>;
}

function calculateGPA(courses: Course[]): GPAResult;

// lib/calculations/academic/final-grade-calculator.ts
interface FinalGradeInput {
  currentGrade: number;
  targetGrade: number;
  finalWeight: number;
}

function calculateRequiredFinalScore(input: FinalGradeInput): number;

// lib/calculations/academic/fraction-calculator.ts
interface Fraction {
  numerator: number;
  denominator: number;
}

function addFractions(a: Fraction, b: Fraction): Fraction;
function subtractFractions(a: Fraction, b: Fraction): Fraction;
function multiplyFractions(a: Fraction, b: Fraction): Fraction;
function divideFractions(a: Fraction, b: Fraction): Fraction;
function simplifyFraction(f: Fraction): Fraction;
function gcd(a: number, b: number): number;
```

#### Travel Tools (Category G)

```typescript
// lib/calculations/travel/schengen-calculator.ts
interface TravelPeriod {
  entryDate: Date;
  exitDate: Date;
}

interface SchengenResult {
  daysUsed: number;
  daysRemaining: number;
  mustExitBy: Date | null;
  isOverstay: boolean;
  timeline: { date: Date; daysInSchengen: number }[];
}

function calculateSchengenDays(
  travelHistory: TravelPeriod[],
  referenceDate: Date
): SchengenResult;

// Sliding window algorithm for 90/180 rule
function slidingWindowSchengen(
  entries: TravelPeriod[],
  checkDate: Date
): number;
```

#### Gaming Tools (Category H)

```typescript
// lib/calculations/gaming/sensitivity-converter.ts
interface GameSensitivity {
  game: string;
  sensitivity: number;
  dpi: number;
}

interface SensitivityConversion {
  targetGame: string;
  convertedSensitivity: number;
  cm360: number; // cm per 360 degree turn
}

const GAME_MULTIPLIERS: Record<string, number> = {
  'valorant': 0.07,
  'cs2': 0.022,
  'apex': 1.0,
  'overwatch2': 0.0066,
  'fortnite': 0.5555,
};

function convertSensitivity(
  source: GameSensitivity,
  targetGame: string
): SensitivityConversion;

function calculateEDPI(dpi: number, sensitivity: number): number;
```

#### Creator Tools (Category I)

```typescript
// lib/calculations/creator/invoice-generator.ts
interface InvoiceData {
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  from: BusinessInfo;
  to: BusinessInfo;
  items: InvoiceItem[];
  taxRate?: number;
  notes?: string;
}

interface BusinessInfo {
  name: string;
  address: string;
  email?: string;
  phone?: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

function generateInvoicePDF(data: InvoiceData): Promise<Blob>;

// lib/calculations/creator/youtube-calculator.ts
interface YouTubeEstimate {
  views: number;
  cpmLow: number;
  cpmHigh: number;
}

interface YouTubeEarnings {
  estimatedLow: number;
  estimatedHigh: number;
  estimatedAverage: number;
}

function estimateYouTubeEarnings(input: YouTubeEstimate): YouTubeEarnings;
```

#### Fun & Psychology Tools (Category J)

```typescript
// lib/calculations/fun/biorhythm-calculator.ts
interface BiorhythmResult {
  date: Date;
  physical: number;    // -100 to 100
  emotional: number;   // -100 to 100
  intellectual: number; // -100 to 100
}

const CYCLE_LENGTHS = {
  physical: 23,
  emotional: 28,
  intellectual: 33,
};

function calculateBiorhythm(birthDate: Date, targetDate: Date): BiorhythmResult;
function getBiorhythmChart(birthDate: Date, days: number): BiorhythmResult[];

// lib/calculations/fun/moon-phase-calculator.ts
interface MoonPhase {
  phase: 'new' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous' |
         'full' | 'waning-gibbous' | 'last-quarter' | 'waning-crescent';
  illumination: number; // 0-100
  age: number; // days since new moon
}

function getMoonPhase(date: Date): MoonPhase;
```

#### Audio Tools (Category K)

```typescript
// lib/calculations/audio/bpm-calculator.ts
interface BPMResult {
  bpm: number;
  msPerBeat: number;
  delayTimes: {
    quarter: number;
    eighth: number;
    sixteenth: number;
    dottedQuarter: number;
    dottedEighth: number;
    tripletQuarter: number;
    tripletEighth: number;
  };
}

function calculateBPMFromTaps(tapTimestamps: number[]): number;
function calculateDelayTimes(bpm: number): BPMResult['delayTimes'];

// lib/calculations/audio/note-frequency.ts
const NOTE_FREQUENCIES: Record<string, number> = {
  'C0': 16.35, 'C#0': 17.32, 'D0': 18.35, /* ... */
  'A4': 440.00, /* ... */
};

function noteToFrequency(note: string, octave: number): number;
function frequencyToNote(frequency: number): { note: string; octave: number; cents: number };
```

#### RPG Tools (Category L)

```typescript
// lib/calculations/rpg/dice-roller.ts
interface DiceRoll {
  dice: string; // e.g., "2d6+3"
  results: number[];
  modifier: number;
  total: number;
}

function rollDice(notation: string): DiceRoll;
function roll4d6DropLowest(): number[];

// lib/calculations/rpg/name-generator.ts
interface NameGeneratorConfig {
  race: 'elf' | 'dwarf' | 'human' | 'orc' | 'halfling' | 'dragonborn';
  gender?: 'male' | 'female' | 'neutral';
  count?: number;
}

// Pre-generated name pools stored in JSON
function generateFantasyName(config: NameGeneratorConfig): string;
function generateTavernName(): string;
function generateQuestHook(): string;
```

#### Crypto Tools (Category N)

```typescript
// lib/calculations/crypto/impermanent-loss.ts
interface ImpermanentLossInput {
  initialPriceRatio: number;
  currentPriceRatio: number;
}

interface ImpermanentLossResult {
  impermanentLoss: number; // percentage
  holdValue: number;
  lpValue: number;
}

function calculateImpermanentLoss(input: ImpermanentLossInput): ImpermanentLossResult;

// lib/calculations/crypto/ethereum-units.ts
const WEI_PER_GWEI = 1e9;
const WEI_PER_ETHER = 1e18;

function weiToGwei(wei: bigint): number;
function weiToEther(wei: bigint): number;
function etherToWei(ether: number): bigint;
function gweiToWei(gwei: number): bigint;
```

#### Photography Tools (Category O)

```typescript
// lib/calculations/photo/depth-of-field.ts
interface DoFInput {
  focalLength: number;    // mm
  aperture: number;       // f-number
  subjectDistance: number; // meters
  sensorSize: 'full-frame' | 'aps-c' | 'micro-four-thirds';
}

interface DoFResult {
  nearFocus: number;
  farFocus: number;
  totalDoF: number;
  hyperfocalDistance: number;
  circleOfConfusion: number;
}

function calculateDoF(input: DoFInput): DoFResult;

// lib/calculations/photo/timelapse-calculator.ts
interface TimelapseInput {
  eventDuration: number;  // seconds
  outputDuration: number; // seconds
  frameRate: number;      // fps
}

interface TimelapseResult {
  totalFrames: number;
  intervalSeconds: number;
  storageEstimate: number; // MB
}

function calculateTimelapse(input: TimelapseInput): TimelapseResult;
```

#### Electronics Tools (Category R)

```typescript
// lib/calculations/electronics/resistor-calculator.ts
interface ResistorBands {
  band1: string;
  band2: string;
  band3?: string; // multiplier for 4-band, third digit for 5-band
  multiplier: string;
  tolerance: string;
}

interface ResistorValue {
  resistance: number;
  tolerance: number;
  formatted: string; // e.g., "4.7kΩ ±5%"
}

const COLOR_VALUES: Record<string, number> = {
  black: 0, brown: 1, red: 2, orange: 3, yellow: 4,
  green: 5, blue: 6, violet: 7, gray: 8, white: 9,
};

function calculateResistorValue(bands: ResistorBands): ResistorValue;

// lib/calculations/electronics/ohms-law.ts
interface OhmsLawResult {
  voltage?: number;
  current?: number;
  resistance?: number;
  power?: number;
}

function calculateOhmsLaw(
  known: { voltage?: number; current?: number; resistance?: number }
): OhmsLawResult;
```

#### Statistics Tools (Category U)

```typescript
// lib/calculations/stats/statistics.ts
interface DescriptiveStats {
  mean: number;
  median: number;
  mode: number[];
  standardDeviation: number;
  variance: number;
  min: number;
  max: number;
  range: number;
  count: number;
}

function calculateDescriptiveStats(data: number[]): DescriptiveStats;

// lib/calculations/stats/sample-size.ts
interface SampleSizeInput {
  confidenceLevel: number; // 0.90, 0.95, 0.99
  marginOfError: number;   // percentage
  populationSize?: number;
  expectedProportion?: number;
}

function calculateSampleSize(input: SampleSizeInput): number;

// lib/calculations/stats/ab-test.ts
interface ABTestInput {
  controlVisitors: number;
  controlConversions: number;
  treatmentVisitors: number;
  treatmentConversions: number;
}

interface ABTestResult {
  controlRate: number;
  treatmentRate: number;
  relativeLift: number;
  pValue: number;
  isSignificant: boolean;
  confidenceLevel: number;
}

function calculateABTestSignificance(input: ABTestInput): ABTestResult;
```

## Data Models

### Tool Registry Extension

```typescript
// lib/constants/tool-registry.ts (additions)
export type ToolCategory = 
  | 'finance' | 'health' | 'home' | 'productivity'
  | 'academic' | 'travel' | 'gaming' | 'creator' | 'fun'
  | 'audio' | 'rpg' | 'crypto' | 'photo' | 'crafts'
  | 'garden' | 'electronics' | 'betting' | 'auto'
  | 'stats' | 'time' | 'physics' | 'construction';

export interface ToolDefinition {
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
  seasonal?: 'finals' | 'back-to-school' | 'tax-season' | 'holiday';
  requiresLibrary?: ('jspdf' | 'recharts' | 'react-qr-code' | 'tone')[];
  offlineCapable?: boolean;
}
```

### Fantasy Name Data Model

```typescript
// lib/data/fantasy-names.ts
interface NamePool {
  prefixes: string[];
  suffixes: string[];
  middleParts?: string[];
}

const FANTASY_NAMES: Record<string, Record<string, NamePool>> = {
  elf: {
    male: {
      prefixes: ['Ael', 'Ara', 'Cel', 'Eld', 'Fae', 'Gal', 'Ith', 'Leg', 'Mel', 'Nal'],
      suffixes: ['andil', 'aron', 'dor', 'ion', 'las', 'mir', 'orn', 'ril', 'thil', 'wen'],
    },
    female: {
      prefixes: ['Ara', 'Cel', 'Ela', 'Gal', 'Ith', 'Lir', 'Mel', 'Nar', 'Sil', 'Tar'],
      suffixes: ['ael', 'iel', 'wen', 'riel', 'thien', 'dis', 'ril', 'iel', 'wen', 'iel'],
    },
  },
  // ... more races
};
```

### Schengen Travel History Model

```typescript
// lib/data/travel-history.ts
interface TravelEntry {
  id: string;
  country: string;
  entryDate: string; // ISO date
  exitDate: string;  // ISO date
  purpose?: string;
}

interface SchengenCountry {
  code: string;
  name: string;
  isSchengen: boolean;
}

const SCHENGEN_COUNTRIES: SchengenCountry[] = [
  { code: 'AT', name: 'Austria', isSchengen: true },
  { code: 'BE', name: 'Belgium', isSchengen: true },
  // ... all 27 Schengen countries
];
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: GPA Calculation Correctness

*For any* set of courses with valid grades (A-F) and positive credit hours, the GPA calculator SHALL compute the weighted sum of grade points divided by total credits, producing a value between 0.0 and 4.0 (or 5.0 for weighted).

**Validates: Requirements 15.9**

```typescript
// Property: GPA = Σ(gradePoints × credits) / Σ(credits)
// For all valid course lists, 0 ≤ GPA ≤ 4.0 (unweighted) or 5.0 (weighted)
```

### Property 2: Final Grade Calculator Inverse

*For any* current grade (0-100), target grade (0-100), and final exam weight (0-1), if the required final score is achievable (0-100), then applying that score with the given weight SHALL produce exactly the target grade.

**Validates: Requirements 15.10**

```typescript
// Property: If required = (target - current*(1-weight)) / weight
// Then: current*(1-weight) + required*weight = target
```

### Property 3: Fraction Simplification Invariant

*For any* fraction operation result, the numerator and denominator SHALL be coprime (GCD = 1), and the denominator SHALL be positive.

**Validates: Requirements 15.11**

```typescript
// Property: For all simplified fractions f:
// gcd(f.numerator, f.denominator) === 1
// f.denominator > 0
```

### Property 4: Schengen 90/180 Sliding Window

*For any* travel history within the Schengen area, the calculator SHALL correctly count days present in any 180-day window, never exceeding 90 days without flagging an overstay.

**Validates: Requirements 16.10**

```typescript
// Property: For any date D, count days in Schengen during [D-179, D]
// If count > 90, isOverstay = true
// daysRemaining = max(0, 90 - count)
```

### Property 5: Unit Conversion Round-Trip

*For any* valid numeric value and unit pair (currency, Ethereum units, etc.), converting from unit A to unit B and back to unit A SHALL produce the original value within floating-point tolerance (0.0001%).

**Validates: Requirements 16.12, 22.12**

```typescript
// Property: For all values v and units A, B:
// |convertBack(convert(v, A, B), B, A) - v| < v * 0.000001
```

### Property 6: Mouse Sensitivity cm/360 Preservation

*For any* game sensitivity conversion, the cm/360 (centimeters per 360-degree turn) SHALL be preserved across all supported games within 0.1% tolerance.

**Validates: Requirements 17.11**

```typescript
// Property: cm360_source = cm360_target (within tolerance)
// cm360 = (2.54 * 360) / (dpi * sensitivity * gameMultiplier)
```

### Property 7: WiFi QR Code Format Compliance

*For any* SSID and password combination, the generated QR code content SHALL follow the standard WiFi configuration format: `WIFI:T:{type};S:{ssid};P:{password};;`

**Validates: Requirements 18.12**

```typescript
// Property: QR content matches regex:
// /^WIFI:T:(WPA|WEP|nopass);S:.+;P:.*;H:(true|false)?;;$/
```

### Property 8: Biorhythm Cycle Bounds

*For any* birth date and target date, all three biorhythm values (physical, emotional, intellectual) SHALL be within [-100, 100] and follow sine wave patterns with periods 23, 28, and 33 days respectively.

**Validates: Requirements 19.11**

```typescript
// Property: For all dates:
// -100 ≤ physical ≤ 100
// -100 ≤ emotional ≤ 100
// -100 ≤ intellectual ≤ 100
// value = 100 * sin(2π * daysSinceBirth / cyclePeriod)
```

### Property 9: BPM Delay Time Relationship

*For any* BPM value, the delay times SHALL satisfy: quarter_note_ms = 60000 / BPM, and all other note values SHALL be proportional (eighth = quarter/2, sixteenth = quarter/4, etc.).

**Validates: Requirements 20.11, 20.12**

```typescript
// Property: For all BPM > 0:
// quarter = 60000 / bpm
// eighth = quarter / 2
// sixteenth = quarter / 4
// dotted_quarter = quarter * 1.5
```

### Property 10: Dice Roll Sum Invariant

*For any* dice notation (e.g., "3d6+2"), the total SHALL equal the sum of individual die results plus the modifier, and each die result SHALL be within [1, die_faces].

**Validates: Requirements 21.11**

```typescript
// Property: For notation "NdX+M":
// total = sum(results) + modifier
// For each result r: 1 ≤ r ≤ X
// results.length === N
```

### Property 11: Fantasy Name Pool Membership

*For any* generated fantasy name for a given race, the name components SHALL be drawn from the corresponding race's name pool (prefixes and suffixes).

**Validates: Requirements 21.12**

```typescript
// Property: For generated name with race R:
// name starts with prefix from NAMES[R].prefixes
// name ends with suffix from NAMES[R].suffixes
```

### Property 12: Depth of Field Physics

*For any* valid camera parameters (focal length, aperture, distance), the near focus distance SHALL be less than subject distance, far focus SHALL be greater than subject distance, and hyperfocal distance SHALL be positive.

**Validates: Requirements 23.11**

```typescript
// Property: For all valid inputs:
// nearFocus < subjectDistance < farFocus
// hyperfocalDistance > 0
// totalDoF = farFocus - nearFocus
```

### Property 13: Timelapse Frame Calculation

*For any* event duration, output duration, and frame rate, the total frames SHALL equal output_duration × frame_rate, and the interval SHALL equal event_duration / total_frames.

**Validates: Requirements 23.12**

```typescript
// Property: For all valid inputs:
// totalFrames = outputDuration * frameRate
// interval = eventDuration / totalFrames
// outputDuration = totalFrames / frameRate
```

### Property 14: Circle Geometry (Skirt/Cylinder)

*For any* circumference value, the calculated radius SHALL satisfy: circumference = 2πr, and for cylinders, volume = πr²h.

**Validates: Requirements 24.11, 25.11**

```typescript
// Property: For circumference C:
// radius = C / (2 * Math.PI)
// For cylinder with radius r, height h:
// volume = Math.PI * r * r * h
```

### Property 15: Resistor Color Code Bijection

*For any* valid resistor color band combination, the calculated resistance SHALL be unique and reversible—given a resistance value, the color bands can be determined.

**Validates: Requirements 26.11**

```typescript
// Property: For 4-band resistor:
// resistance = (10*band1 + band2) * multiplier
// tolerance from tolerance band
// decode(encode(resistance)) === resistance
```

### Property 16: Ohm's Law Consistency

*For any* two known values among voltage (V), current (I), and resistance (R), the calculated third value SHALL satisfy V = I × R, and power SHALL satisfy P = V × I.

**Validates: Requirements 26.12**

```typescript
// Property: For all valid inputs:
// voltage = current * resistance
// power = voltage * current
// Given any two, the third is uniquely determined
```

### Property 17: Odds Conversion Round-Trip

*For any* odds value in American, Decimal, or Fractional format, converting through all three formats and back SHALL produce the original value within 0.01% tolerance.

**Validates: Requirements 27.9**

```typescript
// Property: For odds O in format F:
// toFormat(toFormat(toFormat(O, F, F2), F2, F3), F3, F) ≈ O
// American +150 ↔ Decimal 2.5 ↔ Fractional 3/2
```

### Property 18: Parlay Odds Multiplication

*For any* set of individual bet odds, the parlay odds SHALL equal the product of all individual decimal odds.

**Validates: Requirements 27.10**

```typescript
// Property: For bets with decimal odds [o1, o2, ..., on]:
// parlayOdds = o1 * o2 * ... * on
```

### Property 19: Tire Circumference Ratio

*For any* two tire sizes, the speedometer error percentage SHALL equal (new_circumference / old_circumference - 1) × 100.

**Validates: Requirements 28.9**

```typescript
// Property: For tire sizes T1, T2:
// circumference = π * (2*sectionWidth*aspectRatio/100 + rimDiameter*25.4)
// error = (circ2 / circ1 - 1) * 100
```

### Property 20: Business Days Exclusion

*For any* date range, the business days count SHALL exclude all Saturdays and Sundays, and optionally exclude specified holidays.

**Validates: Requirements 30.7**

```typescript
// Property: For date range [start, end]:
// businessDays = totalDays - weekends - holidays
// No Saturday or Sunday is counted
// All specified holidays are excluded
```

### Property 21: Projectile Motion Physics

*For any* initial velocity and launch angle, the calculated range, max height, and flight time SHALL satisfy standard kinematic equations.

**Validates: Requirements 31.8**

```typescript
// Property: For velocity v, angle θ, gravity g:
// range = v² * sin(2θ) / g
// maxHeight = v² * sin²(θ) / (2g)
// flightTime = 2 * v * sin(θ) / g
```

### Property 22: Baluster Spacing Code Compliance

*For any* calculated baluster spacing, the gap between balusters SHALL not exceed 4 inches (building code requirement).

**Validates: Requirements 32.7**

```typescript
// Property: For all calculated spacings:
// gap = (totalWidth - numBalusters * balusterWidth) / (numBalusters + 1)
// gap ≤ 4 inches
```

## Error Handling

### Input Validation

All calculators SHALL validate inputs before calculation:

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: { field: string; message: string }[];
}

function validateInput(input: unknown, schema: ZodSchema): ValidationResult;
```

### Error Categories

1. **Invalid Input**: Non-numeric values, out-of-range values
2. **Mathematical Errors**: Division by zero, negative square roots
3. **Domain Errors**: Invalid dates, impossible configurations
4. **Precision Errors**: Floating-point overflow/underflow

### Error Display

```typescript
// components/ui/error-display.tsx
interface ErrorDisplayProps {
  errors: ValidationError[];
  onDismiss?: () => void;
}
```

## Testing Strategy

### Dual Testing Approach

The testing strategy combines unit tests for specific examples and property-based tests for universal properties.

### Unit Tests

Unit tests focus on:
- Specific known examples (e.g., A4 = 440Hz)
- Edge cases (zero values, maximum values)
- Error conditions (invalid inputs)
- Integration points between components

### Property-Based Tests

Property-based tests use `fast-check` library to verify universal properties:

```typescript
// tests/property/academic-calculations.test.ts
import * as fc from 'fast-check';
import { calculateGPA, simplifyFraction } from '@/lib/calculations/academic';

describe('GPA Calculator Properties', () => {
  // Feature: expanded-tools-categories, Property 1: GPA Calculation Correctness
  // Validates: Requirements 15.9
  it('should produce GPA between 0 and 4 for valid courses', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            credits: fc.integer({ min: 1, max: 6 }),
            gradePoints: fc.double({ min: 0, max: 4, noNaN: true }),
          }),
          { minLength: 1, maxLength: 20 }
        ),
        (courses) => {
          const gpa = calculateGPA(courses);
          return gpa >= 0 && gpa <= 4;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Fraction Calculator Properties', () => {
  // Feature: expanded-tools-categories, Property 3: Fraction Simplification Invariant
  // Validates: Requirements 15.11
  it('should always produce coprime numerator and denominator', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -1000, max: 1000 }),
        fc.integer({ min: 1, max: 1000 }),
        (num, den) => {
          const simplified = simplifyFraction({ numerator: num, denominator: den });
          return gcd(Math.abs(simplified.numerator), simplified.denominator) === 1;
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Test Configuration

```typescript
// vitest.config.ts additions
export default defineConfig({
  test: {
    // Minimum 100 iterations for property tests
    testTimeout: 30000, // Allow time for 100+ iterations
  },
});
```

### Test File Organization

```
tests/
├── property/
│   ├── academic-calculations.test.ts
│   ├── travel-calculations.test.ts
│   ├── gaming-calculations.test.ts
│   ├── audio-calculations.test.ts
│   ├── rpg-generators.test.ts
│   ├── crypto-conversions.test.ts
│   ├── photo-calculations.test.ts
│   ├── electronics-calculations.test.ts
│   ├── betting-calculations.test.ts
│   ├── stats-calculations.test.ts
│   └── physics-calculations.test.ts
├── unit/
│   ├── academic/
│   ├── travel/
│   ├── gaming/
│   └── ...
```

### Property Test Tagging

Each property test MUST include a comment referencing the design property:

```typescript
// Feature: expanded-tools-categories, Property N: Property Title
// Validates: Requirements X.Y
```

