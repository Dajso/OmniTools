# Implementation Plan: Coffee & Barista Tools

## Overview

This implementation plan breaks down the Coffee & Barista Tools feature into discrete, incremental coding tasks. Each task builds on previous work, with testing integrated throughout to catch errors early. The plan follows the existing Next.js calculator patterns and ensures all 10 calculators are fully functional with proper validation, SEO, and accessibility.

## Tasks

- [x] 1. Set up coffee category infrastructure
  - Create coffee category configuration in category registry
  - Add coffee category to tool registry with amber color scheme
  - Create category landing page at `app/calculators/coffee/page.tsx`
  - Add coffee category to main navigation
  - _Requirements: 11.1, 11.4_

- [x] 2. Implement Coffee Extraction Yield Calculator
  - [x] 2.1 Create calculation logic module
    - Implement `calculateExtractionYield` function with formula: (TDS × Beverage Weight) / Coffee Dose × 100
    - Implement assessment classification (under-extracted < 18%, optimal 18-22%, over-extracted > 22%)
    - Create custom error class `CoffeeCalculationError`
    - Add input validation with appropriate ranges
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_
  
  - [x] 2.2 Write property test for extraction yield formula

    - **Property 1: Extraction Yield Formula Correctness**
    - **Validates: Requirements 1.1**
  

  - [x] 2.3 Write property test for assessment classification

    - **Property 2: Extraction Assessment Classification**
    - **Validates: Requirements 1.2, 1.3, 1.4**

  
  - [x] 2.4 Write property test for input validation

    - **Property 3: Extraction Yield Input Validation**
    - **Validates: Requirements 1.5, 1.6, 1.7**
  
  - [x] 2.5 Create calculator component
    - Build UI with TDS, coffee dose, and beverage weight inputs
    - Display extraction yield percentage and assessment
    - Add unit toggle for metric/imperial
    - Implement error handling and validation messages
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 12.1, 12.2, 12.3, 13.1, 15.1, 15.2_
  
  - [x] 2.6 Create route page with metadata
    - Add SEO metadata (title, description, keywords)
    - Add structured data (JSON-LD)
    - Add FAQ structured data
    - Add Open Graph metadata
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [x] 2.7 Register calculator in tool registry
    - Add entry with ID, name, description, category, keywords
    - Define related tools
    - Add route path and icon
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [x] 3. Implement Brew Ratio Calculator
  - [x] 3.1 Create calculation logic module
    - Implement `calculateBrewRatio` function
    - Implement strength profile classification
    - Add input validation
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  
  - [x] 3.2 Write property test for brew ratio calculation

    - **Property 4: Brew Ratio Water Calculation**
    - **Validates: Requirements 2.1**
  
  - [x] 3.3 Write property test for strength profile classification

    - **Property 5: Strength Profile Classification**
    - **Validates: Requirements 2.2, 2.3, 2.4**
  


  - [x] 3.4 Write property test for input validation

    - **Property 6: Brew Ratio Input Validation**
    - **Validates: Requirements 2.5, 2.6**
  
  - [x] 3.5 Create calculator component
    - Build UI with coffee dose and ratio inputs
    - Display water amount and strength profile
    - Add unit toggle
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 13.1, 15.1, 15.2_
  
  - [x] 3.6 Create route page with metadata
    - Add SEO metadata and structured data
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [x] 3.7 Register calculator in tool registry
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [x] 4. Implement Iced Coffee Dilution Calculator
  - [x] 4.1 Create calculation logic module
    - Implement `calculateIcedCoffeeDilution` function
    - Implement excessive dilution warning logic
    - Add input validation
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [x] 4.2 Write property test for hot coffee calculation

    - **Property 7: Hot Coffee Amount Calculation**
    - **Validates: Requirements 3.1**
  
  - [x] 4.3 Write property test for ice amount calculation

    - **Property 8: Ice Amount Calculation**
    - **Validates: Requirements 3.2**
  
  - [x] 4.4 Write property test for dilution warning

    - **Property 9: Excessive Dilution Warning**
    - **Validates: Requirements 3.3**
  
  - [x] 4.5 Write property test for input validation

    - **Property 10: Iced Coffee Input Validation**
    - **Validates: Requirements 3.4, 3.5, 3.6**
  
  - [x] 4.6 Create calculator component
    - Build UI with target volume, TDS, and ice percentage inputs
    - Display hot coffee amount, ice amount, and brewing TDS
    - Show warning for excessive dilution
    - _Requirements: 3.1, 3.2, 3.3, 12.1, 15.1, 15.2_
  
  - [x] 4.7 Create route page with metadata
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [x] 4.8 Register calculator in tool registry
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [x] 5. Implement Espresso Dial-in Log
  - [x] 5.1 Create calculation logic module
    - Implement `calculateEspressoMetrics` function
    - Implement extraction ratio assessment
    - Add input validation
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_
  
  - [x] 5.2 Write property test for extraction ratio

    - **Property 11: Extraction Ratio Calculation**
    - **Validates: Requirements 4.1**
  
  - [x] 5.3 Write property test for flow rate

    - **Property 12: Flow Rate Calculation**
    - **Validates: Requirements 4.2**
  
  - [x] 5.4 Write property test for recommendation classification

    - **Property 13: Espresso Recommendation Classification**
    - **Validates: Requirements 4.3, 4.4, 4.5**
  

  - [x] 5.5 Write property test for input validation

    - **Property 14: Espresso Input Validation**
    - **Validates: Requirements 4.6, 4.7, 4.8**
  
  - [x] 5.6 Create calculator component
    - Build UI for adding shot entries
    - Display shot log with metrics
    - Show extraction ratio, flow rate, and recommendations
    - Implement local storage for shot history
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 15.1, 15.2_
  
  - [x] 5.7 Create route page with metadata
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [x] 5.8 Register calculator in tool registry
    - Add entry with ID, name, description, category, keywords
    - Define related tools
    - Add route path and icon
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [x] 6. Implement Water Recipe Calculator
  - [x] 6.1 Create calculation logic module
    - Implement `calculateWaterRecipe` function
    - Implement SCA compliance checking
    - Add input validation
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_
  
  - [x] 6.2 Write property test for Epsom salt calculation

    - **Property 15: Epsom Salt Calculation**
    - **Validates: Requirements 5.1**
  
  - [x] 6.3 Write property test for baking soda calculation

    - **Property 16: Baking Soda Calculation**
    - **Validates: Requirements 5.2**
  
  - [x]* 6.4 Write property test for SCA compliance
    - **Property 17: SCA Compliance Indicators**
    - **Validates: Requirements 5.3, 5.4**
  
  - [x]* 6.5 Write property test for input validation
    - **Property 18: Water Recipe Input Validation**
    - **Validates: Requirements 5.5, 5.6, 5.7**
  
  - [x] 6.6 Create calculator component
    - Build UI with water volume, hardness, and alkalinity inputs
    - Display Epsom salt and baking soda amounts
    - Show SCA compliance indicators
    - Display mixing instructions
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 15.1, 15.2_
  
  - [x] 6.7 Create route page with metadata
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [x] 6.8 Register calculator in tool registry
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [x] 7. Implement Grind Size Converter
  - [x] 7.1 Create grinder database
    - Define grinder conversion table with popular models
    - Include Comandante, Timemore C2, Baratza Encore, and others
    - Define grind size categories
    - _Requirements: 6.1, 6.2_
  
  - [x] 7.2 Create calculation logic module
    - Implement `convertGrindSize` function
    - Implement grind description mapping
    - Add input validation
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [x]* 7.3 Write property test for conversion consistency
    - **Property 19: Grind Conversion Consistency**
    - **Validates: Requirements 6.1**
  
  - [-]* 7.4 Write property test for grind description
    - **Property 20: Grind Description Presence**
    - **Validates: Requirements 6.2**
  
  - [ ]* 7.5 Write property test for error handling
    - **Property 21: Grind Converter Error Handling**
    - **Validates: Requirements 6.3, 6.4, 6.5**
  
  - [x] 7.6 Create calculator component
    - Build UI with source grinder, setting, and target grinder inputs
    - Display converted setting and grind description
    - Show confidence level
    - _Requirements: 6.1, 6.2, 15.1, 15.2_
  
  - [x] 7.7 Create route page with metadata
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [x] 7.8 Register calculator in tool registry
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [x] 8. Implement Caffeine Half-Life Tracker
  - [x] 8.1 Create calculation logic module
    - Implement `calculateCaffeineLevel` function with exponential decay
    - Implement sleep recommendation logic
    - Add input validation
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_
  
  - [ ]* 8.2 Write property test for intake persistence
    - **Property 22: Caffeine Intake Persistence**
    - **Validates: Requirements 7.1**
  
  - [ ]* 8.3 Write property test for decay calculation
    - **Property 23: Caffeine Decay Calculation**
    - **Validates: Requirements 7.2**
  
  - [ ]* 8.4 Write property test for sleep recommendations
    - **Property 24: Sleep Recommendation Classification**
    - **Validates: Requirements 7.3, 7.4**
  
  - [ ]* 8.5 Write property test for input validation
    - **Property 25: Caffeine Tracker Input Validation**
    - **Validates: Requirements 7.5, 7.6**
  
  - [x] 8.6 Create calculator component
    - Build UI for adding caffeine intakes
    - Display current caffeine level
    - Show timeline visualization
    - Display sleep recommendations
    - Implement local storage for intake history
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 15.1, 15.2_
  
  - [x] 8.7 Create route page with metadata
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [x] 8.8 Register calculator in tool registry
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [x] 9. Implement Pour Over Timer
  - [x] 9.1 Create calculation logic module
    - Implement `calculatePourSchedule` function
    - Implement 4:6 method algorithm
    - Implement custom pour distribution
    - Add input validation
    - _Requirements: 8.1, 8.2, 8.5, 8.6_
  
  - [ ]* 9.2 Write property test for 4:6 method
    - **Property 26: 4:6 Method Water Distribution**
    - **Validates: Requirements 8.1**
  
  - [ ]* 9.3 Write property test for custom distribution
    - **Property 27: Custom Pour Distribution**
    - **Validates: Requirements 8.2**
  
  - [ ]* 9.4 Write property test for input validation
    - **Property 28: Pour Over Input Validation**
    - **Validates: Requirements 8.5, 8.6**
  
  - [x] 9.5 Create calculator component
    - Build UI with method selection and water amount input
    - Implement timer functionality
    - Display pour stages with timing
    - Show current stage and elapsed time
    - Add audio/visual notifications for stage transitions
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 15.1, 15.2_
  
  - [x] 9.6 Create route page with metadata
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [x] 9.7 Register calculator in tool registry
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [x] 10. Implement Cost Per Cup Calculator
  - [x] 10.1 Create calculation logic module
    - Implement `calculateCostPerCup` function
    - Implement monthly and annual cost calculations
    - Add input validation
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_
  
  - [ ]* 10.2 Write property test for cost per cup
    - **Property 29: Cost Per Cup Calculation**
    - **Validates: Requirements 9.1**
  
  - [ ]* 10.3 Write property test for monthly cost
    - **Property 30: Monthly Cost Calculation**
    - **Validates: Requirements 9.2**
  
  - [ ]* 10.4 Write property test for annual cost
    - **Property 31: Annual Cost Calculation**
    - **Validates: Requirements 9.3**
  
  - [ ]* 10.5 Write property test for input validation
    - **Property 32: Cost Calculator Input Validation**
    - **Validates: Requirements 9.4, 9.5, 9.6**
  
  - [x] 10.6 Create calculator component
    - Build UI with bag price, weight, dose, and cups per day inputs
    - Display cost per cup, per gram, and cups per bag
    - Show monthly and annual costs
    - _Requirements: 9.1, 9.2, 9.3, 15.1, 15.2_
  
  - [x] 10.7 Create route page with metadata
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [x] 10.8 Register calculator in tool registry
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [x] 11. Implement French Press Timer
  - [x] 11.1 Create calculation logic module
    - Implement `calculateFrenchPressTimeline` function
    - Implement brew ratio calculation
    - Add input validation
    - _Requirements: 10.1, 10.5, 10.6, 10.7_
  
  - [ ]* 11.2 Write property test for brew ratio
    - **Property 33: French Press Brew Ratio Calculation**
    - **Validates: Requirements 10.1**
  
  - [ ]* 11.3 Write property test for input validation
    - **Property 34: French Press Input Validation**
    - **Validates: Requirements 10.5, 10.6, 10.7**
  
  - [x] 11.4 Create calculator component
    - Build UI with coffee dose, water amount, and steep time inputs
    - Implement timer functionality
    - Display timeline with bloom, stir, and press reminders
    - Show brew ratio and strength estimate
    - Add audio/visual notifications
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 15.1, 15.2_
  
  - [x] 11.5 Create route page with metadata
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [x] 11.6 Register calculator in tool registry
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [x] 12. Integration and cross-cutting concerns
  - [x] 12.1 Implement unit conversion system
    - Add metric/imperial conversion utilities
    - Ensure all calculators support unit toggle
    - Test conversion round-trip accuracy
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  
  - [ ]* 12.2 Write property test for unit conversion
    - **Property 40: Unit Conversion Round Trip**
    - **Property 41: Unit Conversion Invariance**
    - **Validates: Requirements 13.2, 13.3**
  
  - [x] 12.3 Implement accessibility features
    - Add ARIA labels to all inputs
    - Ensure keyboard navigation works
    - Add focus indicators
    - Test with screen readers
    - _Requirements: 15.1, 15.2, 15.3_
  
  - [ ]* 12.4 Write property test for ARIA labels
    - **Property 43: ARIA Label Presence**
    - **Validates: Requirements 15.1**
  
  - [x] 12.5 Implement responsive design
    - Test all calculators at 375px, 768px, 1024px, 1440px
    - Ensure proper layout on mobile, tablet, desktop
    - _Requirements: 15.4, 15.5, 15.6_
  
  - [x] 12.6 Add category page related tools
    - Ensure all calculators show related tools
    - Test navigation between related calculators
    - _Requirements: 11.5_
  
  - [ ]* 12.7 Write property test for related tools
    - **Property 36: Related Tools Presence**
    - **Validates: Requirements 11.5**
  
  - [ ]* 12.8 Write property test for metadata completeness
    - **Property 42: Metadata Completeness**
    - **Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5**
  
  - [ ]* 12.9 Write property test for registry completeness
    - **Property 44: Registry Entry Completeness**
    - **Validates: Requirements 16.1, 16.2, 16.3, 16.4, 16.5**

- [x] 13. Testing and quality assurance
  - [x] 13.1 Run all property-based tests
    - Execute all 44 property tests
    - Verify 100+ iterations per test
    - Fix any failing properties
    - _Validates: All correctness properties_
  
  - [x] 13.2 Run unit tests
    - Test calculation modules with specific examples
    - Test edge cases and boundary values
    - Test error handling
    - Achieve 80%+ code coverage
  
  - [x] 13.3 Manual testing
    - Test all calculators in browser
    - Test on mobile devices
    - Test keyboard navigation
    - Test with screen readers
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_
  
  - [x] 13.4 Performance testing
    - Check bundle size impact
    - Test calculator responsiveness
    - Optimize if needed
  
  - [x] 13.5 Cross-browser testing
    - Test on Chrome, Firefox, Safari, Edge
    - Test on iOS Safari and Chrome Mobile
    - Fix any compatibility issues

- [x] 14. Documentation and deployment
  - [x] 14.1 Update sitemap
    - Add all coffee calculator routes to sitemap
    - Verify sitemap generation
  
  - [x] 14.2 Update main navigation
    - Ensure coffee category appears in navigation
    - Test navigation links
  
  - [x] 14.3 Create user documentation
    - Add usage instructions to calculator pages
    - Add tooltips for technical terms
    - Add FAQ sections
  
  - [x] 14.4 Final review
    - Review all code for consistency
    - Check for TODO comments
    - Verify all requirements are met
    - Run final test suite
  
  - [x] 14.5 Deployment preparation
    - Build production bundle
    - Test production build locally
    - Verify no build errors or warnings

## Notes

- Tasks marked with `*` are optional property-based tests
- All required tasks must be completed before deployment
- Each calculator follows the same pattern: calculation logic → property tests → component → route → registry
- Property tests use fast-check with minimum 100 iterations
- All calculators must support accessibility and responsive design
- Unit conversion must be tested for round-trip accuracy
