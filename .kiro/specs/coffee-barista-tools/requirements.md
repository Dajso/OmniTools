# Requirements Document

## Introduction

This document specifies the requirements for a comprehensive Coffee & Barista Science category featuring 10 specialized calculators designed for third-wave coffee enthusiasts. The system will provide precision tools for coffee extraction analysis, brewing parameter optimization, and data-driven coffee preparation.

## Glossary

- **System**: The Coffee & Barista Tools calculator suite
- **Calculator**: An individual tool within the suite that performs specific coffee-related calculations
- **User**: A third-wave coffee enthusiast using the calculators
- **TDS**: Total Dissolved Solids, measured as a percentage of dissolved coffee solids in brewed coffee
- **Extraction_Yield**: The percentage of coffee grounds that dissolved into the beverage
- **Brew_Ratio**: The ratio of coffee dose to water amount (e.g., 1:15 means 1g coffee to 15g water)
- **SCA**: Specialty Coffee Association, the industry standards body
- **Dial_In**: The process of adjusting espresso parameters to achieve optimal extraction
- **Pour_Over**: A manual brewing method where water is poured over coffee grounds in stages
- **Category_Page**: The landing page displaying all calculators in the coffee category

## Requirements

### Requirement 1: Coffee Extraction Yield Calculator

**User Story:** As a coffee enthusiast, I want to calculate extraction yield from TDS measurements, so that I can determine if my coffee is properly extracted.

#### Acceptance Criteria

1. WHEN a user provides TDS percentage, coffee dose, and beverage weight, THE Calculator SHALL compute extraction yield percentage using the formula: (TDS × Beverage Weight) / Coffee Dose × 100
2. WHEN extraction yield is below 18%, THE Calculator SHALL display "under-extracted" assessment
3. WHEN extraction yield is between 18% and 22%, THE Calculator SHALL display "optimal extraction" assessment
4. WHEN extraction yield is above 22%, THE Calculator SHALL display "over-extracted" assessment
5. WHEN TDS is zero or negative, THE Calculator SHALL reject the input and display a validation error
6. WHEN coffee dose is zero or negative, THE Calculator SHALL reject the input and display a validation error
7. WHEN beverage weight is zero or negative, THE Calculator SHALL reject the input and display a validation error

### Requirement 2: Brew Ratio Calculator

**User Story:** As a coffee brewer, I want to calculate the water amount needed for my desired brew ratio, so that I can maintain consistent strength across brews.

#### Acceptance Criteria

1. WHEN a user provides coffee dose and desired ratio, THE Calculator SHALL compute water amount by multiplying coffee dose by the ratio multiplier
2. WHEN brew ratio is 1:15 or lower, THE Calculator SHALL display "strong" strength profile
3. WHEN brew ratio is between 1:15 and 1:17, THE Calculator SHALL display "balanced" strength profile
4. WHEN brew ratio is above 1:17, THE Calculator SHALL display "mild" strength profile
5. WHEN coffee dose is zero or negative, THE Calculator SHALL reject the input and display a validation error
6. WHEN ratio multiplier is less than 1, THE Calculator SHALL reject the input and display a validation error

### Requirement 3: Iced Coffee Dilution Calculator

**User Story:** As an iced coffee lover, I want to calculate the correct amounts of hot coffee and ice, so that my iced coffee maintains the target strength after dilution.

#### Acceptance Criteria

1. WHEN a user provides target volume, target TDS, and ice percentage, THE Calculator SHALL compute hot coffee amount accounting for ice dilution
2. WHEN a user provides target volume and ice percentage, THE Calculator SHALL compute ice amount as target volume multiplied by ice percentage
3. WHEN ice percentage is above 50%, THE Calculator SHALL display a warning about excessive dilution
4. WHEN target volume is zero or negative, THE Calculator SHALL reject the input and display a validation error
5. WHEN ice percentage is negative or above 100%, THE Calculator SHALL reject the input and display a validation error
6. WHEN target TDS is zero or negative, THE Calculator SHALL reject the input and display a validation error

### Requirement 4: Espresso Dial-in Log

**User Story:** As an espresso enthusiast, I want to track my espresso shots with dose, yield, time, and taste notes, so that I can systematically dial in my espresso recipe.

#### Acceptance Criteria

1. WHEN a user adds a shot entry with dose, yield, and time, THE Calculator SHALL compute extraction ratio as yield divided by dose
2. WHEN a user adds a shot entry with yield and time, THE Calculator SHALL compute flow rate as yield divided by time
3. WHEN extraction ratio is below 1.5, THE Calculator SHALL recommend increasing yield or decreasing dose
4. WHEN extraction ratio is between 1.5 and 2.5, THE Calculator SHALL indicate optimal extraction ratio
5. WHEN extraction ratio is above 2.5, THE Calculator SHALL recommend decreasing yield or increasing dose
6. WHEN dose is zero or negative, THE Calculator SHALL reject the input and display a validation error
7. WHEN yield is zero or negative, THE Calculator SHALL reject the input and display a validation error
8. WHEN time is zero or negative, THE Calculator SHALL reject the input and display a validation error

### Requirement 5: Water Recipe for Coffee

**User Story:** As a water chemistry enthusiast, I want to calculate mineral additions to create SCA-standard brewing water, so that I can optimize water chemistry for coffee extraction.

#### Acceptance Criteria

1. WHEN a user provides water volume, target hardness, and target alkalinity, THE Calculator SHALL compute Epsom salt amount to achieve target hardness
2. WHEN a user provides water volume, target hardness, and target alkalinity, THE Calculator SHALL compute baking soda amount to achieve target alkalinity
3. WHEN target hardness is between 50 and 175 ppm, THE Calculator SHALL indicate SCA-compliant hardness
4. WHEN target alkalinity is between 40 and 70 ppm, THE Calculator SHALL indicate SCA-compliant alkalinity
5. WHEN water volume is zero or negative, THE Calculator SHALL reject the input and display a validation error
6. WHEN target hardness is negative, THE Calculator SHALL reject the input and display a validation error
7. WHEN target alkalinity is negative, THE Calculator SHALL reject the input and display a validation error

### Requirement 6: Grind Size Converter

**User Story:** As a coffee grinder owner, I want to convert grind settings between different grinder models, so that I can replicate recipes from other grinders.

#### Acceptance Criteria

1. WHEN a user provides source grinder, source setting, and target grinder, THE Calculator SHALL compute equivalent target setting using conversion tables
2. WHEN a grind setting is provided, THE Calculator SHALL display grind size description (extra fine, fine, medium, coarse, extra coarse)
3. WHEN source grinder is not in the conversion database, THE Calculator SHALL display an error message
4. WHEN target grinder is not in the conversion database, THE Calculator SHALL display an error message
5. WHEN source setting is outside the valid range for the source grinder, THE Calculator SHALL reject the input and display a validation error

### Requirement 7: Caffeine Half-Life Tracker

**User Story:** As a caffeine-conscious coffee drinker, I want to track my caffeine intake and see current blood levels, so that I can manage my caffeine consumption for better sleep.

#### Acceptance Criteria

1. WHEN a user adds a coffee drink with time and caffeine amount, THE Calculator SHALL store the intake record
2. WHEN current time is provided, THE Calculator SHALL compute current caffeine level using 5-hour half-life decay for each intake
3. WHEN current caffeine level exceeds 100mg, THE Calculator SHALL recommend avoiding caffeine for optimal sleep
4. WHEN current caffeine level is below 50mg, THE Calculator SHALL indicate safe levels for sleep
5. WHEN caffeine amount is zero or negative, THE Calculator SHALL reject the input and display a validation error
6. WHEN intake time is in the future, THE Calculator SHALL reject the input and display a validation error

### Requirement 8: Pour Over Timer

**User Story:** As a pour over coffee brewer, I want a multi-stage timer with pour schedules, so that I can execute consistent pour over techniques.

#### Acceptance Criteria

1. WHEN a user selects 4:6 method with total water amount, THE Calculator SHALL divide water into 5 pours with 40% in first two pours and 60% in remaining three pours
2. WHEN a user provides total water and number of pours, THE Calculator SHALL compute water amount per pour by dividing total water by number of pours
3. WHEN a user starts the timer, THE System SHALL display elapsed time and current pour stage
4. WHEN each pour stage completes, THE System SHALL advance to the next pour stage automatically
5. WHEN total water is zero or negative, THE Calculator SHALL reject the input and display a validation error
6. WHEN number of pours is less than 1, THE Calculator SHALL reject the input and display a validation error

### Requirement 9: Cost Per Cup Calculator

**User Story:** As a budget-conscious coffee drinker, I want to calculate the actual cost per cup from my coffee bag price, so that I can understand my coffee expenses.

#### Acceptance Criteria

1. WHEN a user provides bag price, bag weight, and dose per cup, THE Calculator SHALL compute cost per cup as (bag price / bag weight) × dose per cup
2. WHEN a user provides cost per cup and cups per day, THE Calculator SHALL compute monthly cost as cost per cup × cups per day × 30
3. WHEN a user provides monthly cost, THE Calculator SHALL compute annual cost as monthly cost × 12
4. WHEN bag price is zero or negative, THE Calculator SHALL reject the input and display a validation error
5. WHEN bag weight is zero or negative, THE Calculator SHALL reject the input and display a validation error
6. WHEN dose per cup is zero or negative, THE Calculator SHALL reject the input and display a validation error

### Requirement 10: French Press Timer

**User Story:** As a French press user, I want a timer with bloom and stir reminders, so that I can execute the French press method consistently.

#### Acceptance Criteria

1. WHEN a user provides coffee dose and water amount, THE Calculator SHALL compute brew ratio as water amount divided by coffee dose
2. WHEN a user starts the timer, THE System SHALL display a bloom reminder at 30 seconds
3. WHEN a user starts the timer, THE System SHALL display a stir reminder at the halfway point of steep time
4. WHEN steep time completes, THE System SHALL display a press reminder
5. WHEN coffee dose is zero or negative, THE Calculator SHALL reject the input and display a validation error
6. WHEN water amount is zero or negative, THE Calculator SHALL reject the input and display a validation error
7. WHEN steep time is zero or negative, THE Calculator SHALL reject the input and display a validation error

### Requirement 11: Category Page and Navigation

**User Story:** As a user, I want to browse all coffee calculators from a category page, so that I can discover and access the tools I need.

#### Acceptance Criteria

1. THE System SHALL display a category page at /calculators/coffee with all 10 calculators
2. WHEN a user visits the category page, THE System SHALL display calculator cards with name, description, and icon
3. WHEN a user clicks a calculator card, THE System SHALL navigate to the calculator's dedicated page
4. THE System SHALL display the coffee category in the main navigation with a coffee icon
5. WHEN a calculator page is displayed, THE System SHALL show related calculators from the coffee category

### Requirement 12: Input Validation and Error Handling

**User Story:** As a user, I want clear error messages when I enter invalid data, so that I can correct my inputs and get accurate results.

#### Acceptance Criteria

1. WHEN a user submits a form with invalid inputs, THE System SHALL display field-specific error messages
2. WHEN a user enters non-numeric values in numeric fields, THE System SHALL reject the input and display a validation error
3. WHEN a user enters values outside acceptable ranges, THE System SHALL display the acceptable range in the error message
4. THE System SHALL validate all inputs using Zod schemas before performing calculations
5. THE System SHALL prevent form submission when validation errors exist

### Requirement 13: Unit Support and Conversion

**User Story:** As an international user, I want to use both metric and imperial units, so that I can work with familiar measurements.

#### Acceptance Criteria

1. WHERE unit conversion is applicable, THE System SHALL provide a toggle between metric and imperial units
2. WHEN a user switches units, THE System SHALL convert all displayed values to the selected unit system
3. WHEN a user switches units, THE System SHALL preserve the underlying calculation values
4. THE System SHALL display weight in grams (metric) or ounces (imperial)
5. THE System SHALL display volume in milliliters (metric) or fluid ounces (imperial)

### Requirement 14: SEO and Metadata

**User Story:** As a content creator, I want proper SEO metadata for each calculator, so that users can discover the tools through search engines.

#### Acceptance Criteria

1. THE System SHALL include page title, description, and keywords metadata for each calculator page
2. THE System SHALL include structured data (JSON-LD) for each calculator with @type "WebApplication"
3. THE System SHALL include FAQ structured data for each calculator with at least 3 questions
4. THE System SHALL generate Open Graph metadata for social media sharing
5. THE System SHALL include canonical URLs for each calculator page

### Requirement 15: Accessibility and Responsive Design

**User Story:** As a user with accessibility needs, I want keyboard navigation and screen reader support, so that I can use the calculators effectively.

#### Acceptance Criteria

1. THE System SHALL provide ARIA labels for all form inputs and interactive elements
2. THE System SHALL support full keyboard navigation for all calculators
3. THE System SHALL display focus indicators on all interactive elements
4. THE System SHALL render correctly on mobile devices (375px width minimum)
5. THE System SHALL render correctly on tablet devices (768px width)
6. THE System SHALL render correctly on desktop devices (1024px width and above)

### Requirement 16: Tool Registry Integration

**User Story:** As a system administrator, I want all calculators registered in the tool registry, so that they appear in search results and related tools.

#### Acceptance Criteria

1. THE System SHALL register each calculator in the tool registry with unique ID, name, description, and category
2. THE System SHALL include relevant keywords for each calculator to enable search functionality
3. THE System SHALL define related tools for each calculator to enable cross-linking
4. THE System SHALL include the calculator route in the registry for navigation
5. THE System SHALL include the calculator icon in the registry for visual identification
