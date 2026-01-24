# Coffee & Barista Science Tools - Requirements

## Overview
Create a comprehensive suite of 10 coffee and barista science calculators targeting "third wave coffee" enthusiasts who are data-obsessed about their brewing process. These tools will help users optimize extraction, maintain consistency, and understand the science behind great coffee.

## Target Audience
- Third wave coffee enthusiasts
- Home baristas
- Coffee shop professionals
- Specialty coffee hobbyists
- Data-driven coffee lovers

## Tools to Implement

### 1. Coffee Extraction Yield Calculator
**Purpose**: Calculate extraction yield percentage using TDS (Total Dissolved Solids), coffee dose, and beverage weight.

**Inputs**:
- TDS (Total Dissolved Solids) in % (0.5 - 3.0%)
- Coffee dose in grams (5 - 100g)
- Beverage weight in grams (50 - 1000g)

**Outputs**:
- Extraction yield percentage
- Strength assessment (weak, balanced, strong)
- SCA Golden Cup standard compliance (18-22% extraction, 1.15-1.35% TDS)

**Formula**: 
```
Extraction % = (TDS% × Beverage Weight) / Coffee Dose × 100
```

### 2. Brew Ratio Calculator
**Purpose**: Calculate water amount needed for a given coffee dose and desired brew ratio.

**Inputs**:
- Coffee dose in grams (5 - 100g)
- Brew ratio (1:10 to 1:20, common: 1:15, 1:16, 1:17)

**Outputs**:
- Water amount needed in grams/ml
- Total beverage weight
- Ratio recommendations for different brew methods

**Common Ratios**:
- Espresso: 1:2 to 1:3
- Pour Over: 1:15 to 1:17
- French Press: 1:12 to 1:15
- Cold Brew: 1:5 to 1:8

### 3. Iced Coffee Dilution Calculator
**Purpose**: Calculate ice and concentrate ratios for iced pour-over to maintain target strength after dilution.

**Inputs**:
- Target final volume (ml)
- Target TDS (%)
- Brew TDS (%)
- Ice temperature (optional, affects dilution rate)

**Outputs**:
- Coffee dose needed
- Hot water amount
- Ice amount
- Final TDS after dilution

### 4. Espresso Dial-in Log
**Purpose**: Generate a structured log/table for tracking espresso shots during dial-in process.

**Inputs**:
- Shot number
- Grind setting
- Dose (g)
- Yield (g)
- Time (seconds)
- Taste notes
- Adjustments needed

**Outputs**:
- Formatted table (copyable/downloadable)
- Brew ratio calculation
- Flow rate (g/s)
- Recommendations based on time/ratio

### 5. Water Recipe for Coffee
**Purpose**: Calculate mineral additions to create SCA-standard brewing water.

**Inputs**:
- Starting water volume (liters)
- Target water profile (SCA Standard, Light Roast, Dark Roast, Custom)
- Current water hardness (optional)

**Outputs**:
- Epsom salt (MgSO4) amount in grams
- Baking soda (NaHCO3) amount in grams
- Total hardness (ppm)
- Alkalinity (ppm)
- pH estimate

**Standard Profiles**:
- SCA Standard: 150ppm hardness, 40ppm alkalinity
- Light Roast: 100ppm hardness, 30ppm alkalinity
- Dark Roast: 200ppm hardness, 50ppm alkalinity

### 6. Grind Size Converter
**Purpose**: Convert grind settings between different grinder models.

**Supported Grinders**:
- Comandante C40 (clicks: 0-40)
- Timemore C2/C3 (clicks: 0-36)
- 1Zpresso JX-Pro (numbers: 0-90)
- Baratza Encore (settings: 1-40)
- Baratza Virtuoso+ (settings: 1-40)
- Wilfa Uniform (settings: 1-5)

**Inputs**:
- Source grinder and setting
- Target grinder
- Brew method (for recommendations)

**Outputs**:
- Converted setting for target grinder
- Recommended range for brew method
- Particle size estimate (microns)

### 7. Caffeine Half-Life Tracker
**Purpose**: Track caffeine intake and calculate current blood caffeine concentration based on half-life.

**Inputs**:
- Caffeine intake events (time, amount in mg)
- Body weight (optional, for personalization)
- Caffeine sensitivity (normal, sensitive, tolerant)

**Outputs**:
- Current caffeine level in bloodstream (mg)
- Time until 50% clearance
- Time until 90% clearance
- Sleep impact warning
- Visualization of caffeine curve over 24 hours

**Constants**:
- Caffeine half-life: 5 hours (average)
- Espresso: 63mg per shot
- Drip coffee: 95mg per 8oz
- Cold brew: 200mg per 16oz

### 8. Pour Over Timer
**Purpose**: Guided timer for pour-over brewing with multiple techniques.

**Techniques**:
- 4:6 Method (Tetsu Kasuya)
- V60 Standard (Hario)
- Rao Spin
- Hoffman Method
- Custom

**Inputs**:
- Coffee dose (g)
- Brew ratio
- Technique selection

**Outputs**:
- Step-by-step pour instructions
- Timer with audio/visual cues
- Pour amounts for each phase
- Total brew time target

**4:6 Method Example**:
- 40% of water in first 2 pours (controls sweetness/acidity)
- 60% of water in remaining pours (controls strength)
- 45-second intervals between pours

### 9. Cost Per Cup Calculator
**Purpose**: Calculate the actual cost of each cup of coffee.

**Inputs**:
- Bag price ($)
- Bag weight (g)
- Dose per cup (g)
- Cups per day
- Additional costs (filters, water, electricity)

**Outputs**:
- Cost per cup
- Cost per month
- Cost per year
- Comparison with café prices
- Break-even analysis for equipment

### 10. French Press Timer
**Purpose**: Timer with reminders for French press brewing steps.

**Inputs**:
- Coffee dose (g)
- Brew ratio
- Steep time (default: 4 minutes)

**Outputs**:
- Step-by-step instructions
- Timer with notifications:
  - Start: Add coffee and water
  - 0:30 - Stir/break crust
  - 3:30 - Prepare to plunge (30s warning)
  - 4:00 - Plunge and serve
- Water temperature reminder (200°F / 93°C)

## Technical Requirements

### Performance
- All calculations must complete in < 100ms
- Timers must be accurate to ±100ms
- Support offline functionality (PWA)

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation for all timers
- Screen reader support for all calculations
- High contrast mode support

### Data Persistence
- Save user preferences (default ratios, grinder settings)
- Store espresso dial-in logs locally
- Export logs as CSV/JSON

### Mobile Optimization
- Touch-friendly timer controls
- Responsive layouts for all screen sizes
- Haptic feedback for timer alerts (where supported)

## Success Criteria
- All 10 tools implemented and functional
- Comprehensive test coverage (unit + integration)
- SEO-optimized pages for each tool
- Positive user feedback from coffee community
- Tools featured on coffee forums/subreddits

## Related Tools
- Existing: Timer tools, unit converters, percentage calculators
- New category: Coffee & Barista Science

## References
- SCA (Specialty Coffee Association) standards
- Coffee brewing control chart
- Grinder manufacturer specifications
- Coffee chemistry research papers
