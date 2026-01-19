# Implementation Plan: Expanded Tools Categories

## Overview

This implementation plan covers the expansion of OmniTools with 15 new tool categories (~130 tools). The plan is organized by category, with each category containing setup, core tools, and testing tasks. Implementation follows the existing project patterns and introduces new component templates.

## Phase 1: Foundation & Templates

- [x] 1. Install new dependencies and create base templates
  - [x] 1.1 Install required npm packages (jspdf, recharts, react-qr-code, date-fns, tone)
    - Run `npm install jspdf recharts react-qr-code date-fns tone`
    - _Requirements: 33.1, 33.2, 33.3, 33.4_
  - [x] 1.2 Create Calculator Template component
    - Create `components/templates/calculator-template.tsx`
    - Implement InputConfig and CalculationResult interfaces
    - _Requirements: 34.1_
  - [x] 1.3 Create Generator Template component
    - Create `components/templates/generator-template.tsx`
    - Support copy and export functionality
    - _Requirements: 34.2_
  - [x] 1.4 Create Timer Template component
    - Create `components/templates/timer-template.tsx`
    - Support countdown, stopwatch, and pomodoro modes
    - _Requirements: 34.4_
  - [x] 1.5 Create Interactive Template component
    - Create `components/templates/interactive-template.tsx`
    - Support real-time visual feedback
    - _Requirements: 34.5_
  - [x] 1.6 Create Lookup Template component
    - Create `components/templates/lookup-template.tsx`
    - Support searchable and filterable data tables
    - _Requirements: 34.3_

- [x] 2. Extend tool registry with new categories
  - [x] 2.1 Add new category types to tool-registry.ts
    - Add: academic, travel, gaming, creator, fun, audio, rpg, crypto, photo, crafts, garden, electronics, betting, auto, stats, time, physics, construction
    - _Requirements: 15-32 (all categories)_

- [x] 3. Checkpoint - Verify foundation setup
  - Ensure all templates compile without errors
  - Ensure new dependencies are installed correctly

## Phase 2: Student & Academic Tools (Category F)

- [x] 4. Implement Academic calculation functions
  - [x] 4.1 Create GPA Calculator logic
    - Create `lib/calculations/academic/gpa-calculator.ts`
    - Implement weighted and unweighted GPA calculation
    - _Requirements: 15.1, 15.9_
  - [x] 4.2 Write property test for GPA calculation
    - **Property 1: GPA Calculation Correctness**
    - **Validates: Requirements 15.9**
  - [x] 4.3 Create Final Grade Calculator logic
    - Create `lib/calculations/academic/final-grade-calculator.ts`
    - Implement required score calculation formula
    - _Requirements: 15.2, 15.10_
  - [x] 4.4 Write property test for Final Grade calculation
    - **Property 2: Final Grade Calculator Inverse**
    - **Validates: Requirements 15.10**
  - [x] 4.5 Create Fraction Calculator logic
    - Create `lib/calculations/academic/fraction-calculator.ts`
    - Implement add, subtract, multiply, divide, simplify
    - _Requirements: 15.5, 15.11_
  - [x] 4.6 Write property test for Fraction simplification
    - **Property 3: Fraction Simplification Invariant**
    - **Validates: Requirements 15.11**

- [x] 5. Create Academic UI components
  - [x] 5.1 Create College GPA Calculator component and page
    - Create `components/calculators/academic/gpa-calculator.tsx`
    - Create `app/calculators/academic/gpa-calculator/page.tsx`
    - _Requirements: 15.1_
  - [x] 5.2 Create Final Grade Calculator component and page
    - _Requirements: 15.2_
  - [x] 5.3 Create Scientific Notation Converter component and page
    - _Requirements: 15.4_
  - [x] 5.4 Create Fraction Calculator component and page
    - _Requirements: 15.5_
  - [x] 5.5 Create Plagiarism Checker (Text Compare) component and page
    - _Requirements: 15.6_
  - [x] 5.6 Create Pomodoro Timer component and page
    - Use Timer Template
    - _Requirements: 15.7_
  - [x] 5.7 Create Class Schedule Maker component and page
    - Implement image/PDF export using jspdf
    - _Requirements: 15.8_
  - [x] 5.8 Create APA/MLA Citation Generator component and page
    - _Requirements: 15.3_

- [x] 6. Checkpoint - Academic tools complete
  - Ensure all academic tools render correctly
  - Run property tests for academic calculations


## Phase 3: Travel & Digital Nomad Tools (Category G)

- [x] 7. Implement Travel calculation functions
  - [x] 7.1 Create Schengen Visa Calculator logic
    - Create `lib/calculations/travel/schengen-calculator.ts`
    - Implement 90/180 sliding window algorithm
    - _Requirements: 16.1, 16.10_
  - [x] 7.2 Write property test for Schengen calculation
    - **Property 4: Schengen 90/180 Sliding Window**
    - **Validates: Requirements 16.10**
  - [x] 7.3 Create Currency Converter logic with offline support
    - Create `lib/calculations/travel/currency-converter.ts`
    - Implement Service Worker caching for exchange rates
    - _Requirements: 16.3, 16.12_
  - [x] 7.4 Write property test for Currency conversion round-trip
    - **Property 5: Unit Conversion Round-Trip**
    - **Validates: Requirements 16.12**
  - [x] 7.5 Create Time Zone Meeting Planner logic
    - Create `lib/calculations/travel/timezone-planner.ts`
    - _Requirements: 16.2, 16.11_
  - [x] 7.6 Create Flight Duration Calculator logic
    - _Requirements: 16.5_
  - [x] 7.7 Create Packing List Generator logic
    - _Requirements: 16.4_

- [x] 8. Create Travel UI components
  - [x] 8.1 Create Schengen Visa Calculator component and page
    - Include calendar input and visual timeline
    - _Requirements: 16.1_
  - [x] 8.2 Create Time Zone Meeting Planner component and page
    - Implement visual slider interface
    - _Requirements: 16.2_
  - [x] 8.3 Create Currency Converter component and page
    - _Requirements: 16.3_
  - [x] 8.4 Create Packing List Generator component and page
    - _Requirements: 16.4_
  - [x] 8.5 Create Flight Duration Calculator component and page
    - _Requirements: 16.5_
  - [x] 8.6 Create Travel Budget Splitter component and page
    - _Requirements: 16.6_
  - [x] 8.7 Create Sun Angle/Sunset Calculator component and page
    - _Requirements: 16.7_
  - [x] 8.8 Create Luggage Size Checker component and page
    - _Requirements: 16.9_

- [x] 9. Checkpoint - Travel tools complete
  - Ensure Schengen calculator handles edge cases correctly
  - Verify offline currency conversion works

## Phase 4: Gaming & E-Sports Tools (Category H)

- [x] 10. Implement Gaming calculation functions
  - [x] 10.1 Create Mouse Sensitivity Converter logic
    - Create `lib/calculations/gaming/sensitivity-converter.ts`
    - Include game multipliers for Valorant, CS2, Apex, etc.
    - _Requirements: 17.1, 17.11_
  - [x] 10.2 Write property test for Sensitivity conversion
    - **Property 6: Mouse Sensitivity cm/360 Preservation**
    - **Validates: Requirements 17.11**
  - [x] 10.3 Create eDPI Calculator logic
    - _Requirements: 17.2_
  - [x] 10.4 Create Reaction Time Test logic
    - _Requirements: 17.3, 17.12_
  - [x] 10.5 Create Pokemon Type Calculator data and logic
    - _Requirements: 17.5_
  - [x] 10.6 Create Minecraft Circle Generator logic
    - _Requirements: 17.6_

- [x] 11. Create Gaming UI components
  - [x] 11.1 Create Mouse Sensitivity Converter component and page
    - _Requirements: 17.1_
  - [x] 11.2 Create eDPI Calculator component and page
    - _Requirements: 17.2_
  - [x] 11.3 Create Reaction Time Test component and page
    - Implement visual stimulus and timing
    - _Requirements: 17.3_
  - [x] 11.4 Create Aim Trainer component and page
    - Implement click targets with scoring
    - _Requirements: 17.4_
  - [x] 11.5 Create Pokemon Type Calculator component and page
    - _Requirements: 17.5_
  - [x] 11.6 Create Minecraft Circle Generator component and page
    - Generate pixel grid visualization
    - _Requirements: 17.6_
  - [x] 11.7 Create KD Ratio Calculator component and page
    - _Requirements: 17.7_
  - [x] 11.8 Create Monitor Hz Tester component and page
    - _Requirements: 17.8_
  - [x] 11.9 Create Twitch Emote Resizer component and page
    - _Requirements: 17.10_

- [x] 12. Checkpoint - Gaming tools complete
  - Test sensitivity converter with known game values
  - Verify reaction time test accuracy

## Phase 5: Creator Economy Tools (Category I)

- [x] 13. Implement Creator calculation functions
  - [x] 13.1 Create Invoice Generator logic with PDF export
    - Create `lib/calculations/creator/invoice-generator.ts`
    - Use jspdf for PDF generation
    - _Requirements: 18.1, 18.11_
  - [x] 13.2 Create WiFi QR Code Generator logic
    - Create `lib/calculations/creator/wifi-qr-generator.ts`
    - _Requirements: 18.4, 18.12_
  - [x] 13.3 Write property test for WiFi QR format
    - **Property 7: WiFi QR Code Format Compliance**
    - **Validates: Requirements 18.12**
  - [x] 13.4 Create YouTube Money Calculator logic
    - _Requirements: 18.6_
  - [x] 13.5 Create Instagram Engagement Rate Calculator logic
    - _Requirements: 18.7_
  - [x] 13.6 Create CPM Calculator logic
    - _Requirements: 18.10_

- [x] 14. Create Creator UI components
  - [x] 14.1 Create Invoice Generator component and page
    - Include form for business info and line items
    - _Requirements: 18.1_
  - [x] 14.2 Create Privacy Policy Generator component and page
    - _Requirements: 18.2_
  - [x] 14.3 Create Terms & Conditions Generator component and page
    - _Requirements: 18.3_
  - [x] 14.4 Create WiFi QR Code Generator component and page
    - Use react-qr-code library
    - _Requirements: 18.4_
  - [x] 14.5 Create Paycheck Calculator component and page
    - _Requirements: 18.5_
  - [x] 14.6 Create YouTube Money Calculator component and page
    - _Requirements: 18.6_
  - [x] 14.7 Create Instagram Engagement Rate Calculator component and page
    - _Requirements: 18.7_
  - [x] 14.8 Create Signature Generator component and page
    - Generate SVG handwriting-style signatures
    - _Requirements: 18.8_
  - [x] 14.9 Create Business Name Generator component and page
    - _Requirements: 18.9_
  - [x] 14.10 Create CPM Calculator component and page
    - _Requirements: 18.10_

- [x] 15. Checkpoint - Creator tools complete
  - Test PDF invoice generation
  - Verify QR codes scan correctly


## Phase 6: Fun & Psychology Tools (Category J)

- [x] 16. Implement Fun calculation functions
  - [x] 16.1 Create Biorhythm Calculator logic
    - Create `lib/calculations/fun/biorhythm-calculator.ts`
    - Implement sine wave calculations for 23/28/33 day cycles
    - _Requirements: 19.4, 19.11_
  - [x] 16.2 Write property test for Biorhythm bounds
    - **Property 8: Biorhythm Cycle Bounds**
    - **Validates: Requirements 19.11**
  - [x] 16.3 Create Moon Phase Calculator logic
    - Create `lib/calculations/fun/moon-phase-calculator.ts`
    - _Requirements: 19.2_
  - [x] 16.4 Create Zodiac Sign Calculator logic
    - _Requirements: 19.3_
  - [x] 16.5 Create Numerology Calculator logic
    - _Requirements: 19.5_
  - [x] 16.6 Create Love Compatibility logic
    - _Requirements: 19.1_

- [x] 17. Create Fun UI components
  - [x] 17.1 Create Love Compatibility Test component and page
    - _Requirements: 19.1_
  - [x] 17.2 Create Moon Phase Calculator component and page
    - Include visual moon phase display
    - _Requirements: 19.2_
  - [x] 17.3 Create Zodiac Sign Calculator component and page
    - _Requirements: 19.3_
  - [x] 17.4 Create Biorhythm Calculator component and page
    - Use recharts for line chart visualization
    - _Requirements: 19.4_
  - [x] 17.5 Create Numerology Calculator component and page
    - _Requirements: 19.5_
  - [x] 17.6 Create Age in Days/Seconds Calculator component and page
    - _Requirements: 19.6_
  - [x] 17.7 Create Day of the Week Calculator component and page
    - _Requirements: 19.7_
  - [x] 17.8 Create Decision Maker Wheel component and page
    - Implement spin animation
    - _Requirements: 19.8_
  - [x] 17.9 Create Visual Breathing Bubble component and page
    - Implement calming animation
    - _Requirements: 19.9_
  - [x] 17.10 Create Soundboard component and page
    - Include meme sound effects
    - _Requirements: 19.10_

- [x] 18. Checkpoint - Fun tools complete
  - Verify biorhythm chart renders correctly
  - Test decision wheel animation

## Phase 7: Audio & Music Tools (Category K)

- [x] 19. Implement Audio calculation functions
  - [x] 19.1 Create BPM Tapper logic
    - Create `lib/calculations/audio/bpm-calculator.ts`
    - Calculate average from last 8 taps
    - _Requirements: 20.1, 20.11_
  - [x] 19.2 Create Delay Time Calculator logic
    - Calculate ms for 1/4, 1/8, 1/16 notes
    - _Requirements: 20.2, 20.12_
  - [x] 19.3 Write property test for BPM/Delay relationship
    - **Property 9: BPM Delay Time Relationship**
    - **Validates: Requirements 20.11, 20.12**
  - [x] 19.4 Create Note to Frequency Converter logic
    - Create `lib/calculations/audio/note-frequency.ts`
    - _Requirements: 20.3_
  - [x] 19.5 Create Key/Scale Finder logic
    - _Requirements: 20.4_
  - [x] 19.6 Create Sample Rate Calculator logic
    - _Requirements: 20.5_

- [x] 20. Create Audio UI components
  - [x] 20.1 Create BPM Tapper component and page
    - Implement spacebar tap detection
    - _Requirements: 20.1_
  - [x] 20.2 Create Delay & Reverb Time Calculator component and page
    - _Requirements: 20.2_
  - [x] 20.3 Create Note to Frequency Converter component and page
    - _Requirements: 20.3_
  - [x] 20.4 Create Key/Scale Finder component and page
    - _Requirements: 20.4_
  - [x] 20.5 Create Sample Rate Calculator component and page
    - _Requirements: 20.5_
  - [x] 20.6 Create Guitar Tuner component and page
    - Use Web Audio API for microphone input
    - _Requirements: 20.6_
  - [x] 20.7 Create Visual Metronome component and page
    - Implement BPM-synced flashing
    - _Requirements: 20.7_
  - [x] 20.8 Create Audio Panning Visualizer component and page
    - _Requirements: 20.8_
  - [x] 20.9 Create Song Structure Builder component and page
    - Implement drag-drop sections
    - _Requirements: 20.9_

- [x] 21. Checkpoint - Audio tools complete
  - Test BPM tapper accuracy
  - Verify guitar tuner with known frequencies

## Phase 8: Tabletop RPG Tools (Category L)

- [x] 22. Implement RPG functions and data
  - [x] 22.1 Create Dice Roller logic
    - Create `lib/calculations/rpg/dice-roller.ts`
    - Support notation like "2d6+3"
    - _Requirements: 21.1, 21.11_
  - [x] 22.2 Write property test for Dice roll sum
    - **Property 10: Dice Roll Sum Invariant**
    - **Validates: Requirements 21.11**
  - [x] 22.3 Create Fantasy Name Generator data and logic
    - Create `lib/data/fantasy-names.ts` with name pools
    - Create `lib/calculations/rpg/name-generator.ts`
    - _Requirements: 21.2, 21.12_
  - [x] 22.4 Write property test for Name pool membership
    - **Property 11: Fantasy Name Pool Membership**
    - **Validates: Requirements 21.12**
  - [x] 22.5 Create RPG Stat Roller logic (4d6 drop lowest)
    - _Requirements: 21.3_
  - [x] 22.6 Create Encounter Difficulty Calculator logic
    - _Requirements: 21.5_
  - [x] 22.7 Create Loot Generator data and logic
    - _Requirements: 21.6_
  - [x] 22.8 Create Tavern Generator data and logic
    - _Requirements: 21.9_
  - [x] 22.9 Create Quest Idea Generator data and logic
    - _Requirements: 21.10_

- [x] 23. Create RPG UI components
  - [x] 23.1 Create Dice Roller component and page
    - Include visual dice animation
    - _Requirements: 21.1_
  - [x] 23.2 Create Fantasy Name Generator component and page
    - Support multiple races and genders
    - _Requirements: 21.2_
  - [x] 23.3 Create RPG Stat Roller component and page
    - _Requirements: 21.3_
  - [x] 23.4 Create Initiative Tracker component and page
    - _Requirements: 21.4_
  - [x] 23.5 Create Encounter Difficulty Calculator component and page
    - _Requirements: 21.5_
  - [x] 23.6 Create Loot Generator component and page
    - _Requirements: 21.6_
  - [x] 23.7 Create Character Sheet Helper component and page
    - _Requirements: 21.7_
  - [x] 23.8 Create Map Grid Generator component and page
    - Support hex and square grids
    - _Requirements: 21.8_
  - [x] 23.9 Create Tavern Generator component and page
    - _Requirements: 21.9_
  - [x] 23.10 Create Quest Idea Generator component and page
    - _Requirements: 21.10_

- [x] 24. Checkpoint - RPG tools complete
  - Test dice roller with various notations
  - Verify name generator produces valid names


## Phase 9: Crypto & Web3 Tools (Category N)

- [x] 25. Implement Crypto calculation functions
  - [x] 25.1 Create Ethereum Unit Converter logic
    - Create `lib/calculations/crypto/ethereum-units.ts`
    - Handle 18 decimal precision
    - _Requirements: 22.10, 22.12_
  - [x] 25.2 Write property test for Ethereum unit round-trip
    - **Property 5: Unit Conversion Round-Trip** (shared)
    - **Validates: Requirements 22.12**
  - [x] 25.3 Create Impermanent Loss Calculator logic
    - Create `lib/calculations/crypto/impermanent-loss.ts`
    - _Requirements: 22.2_
  - [x] 25.4 Create Gas Fee Converter logic
    - _Requirements: 22.1_
  - [x] 25.5 Create Hash Generator logic (SHA-256, Keccak)
    - _Requirements: 22.5_
  - [x] 25.6 Create APY to APR Converter logic
    - _Requirements: 22.8_

- [x] 26. Create Crypto UI components
  - [x] 26.1 Create Gas Fee Converter component and page
    - _Requirements: 22.1_
  - [x] 26.2 Create Impermanent Loss Calculator component and page
    - _Requirements: 22.2_
  - [x] 26.3 Create Satoshi to USD Converter component and page
    - _Requirements: 22.3_
  - [x] 26.4 Create Address Shortener Display component and page
    - _Requirements: 22.4_
  - [x] 26.5 Create Hash Generator component and page
    - _Requirements: 22.5_
  - [x] 26.6 Create Seed Phrase Generator component and page
    - Include prominent security warnings
    - _Requirements: 22.6_
  - [x] 26.7 Create NFT Rarity Calculator component and page
    - _Requirements: 22.7_
  - [x] 26.8 Create APY to APR Converter component and page
    - _Requirements: 22.8_
  - [x] 26.9 Create Paper Wallet Generator component and page
    - Include security warnings
    - _Requirements: 22.9_
  - [x] 26.10 Create Ethereum Unit Converter component and page
    - _Requirements: 22.10_

- [x] 27. Checkpoint - Crypto tools complete
  - Test Ethereum unit conversions with large values
  - Verify impermanent loss calculation accuracy

## Phase 10: Photography & Video Tools (Category O)

- [x] 28. Implement Photography calculation functions
  - [x] 28.1 Create Depth of Field Calculator logic
    - Create `lib/calculations/photo/depth-of-field.ts`
    - _Requirements: 23.1, 23.11_
  - [x] 28.2 Write property test for DoF physics
    - **Property 12: Depth of Field Physics**
    - **Validates: Requirements 23.11**
  - [x] 28.3 Create Time Lapse Calculator logic
    - Create `lib/calculations/photo/timelapse-calculator.ts`
    - _Requirements: 23.2, 23.12_
  - [x] 28.4 Write property test for Timelapse frames
    - **Property 13: Timelapse Frame Calculation**
    - **Validates: Requirements 23.12**
  - [x] 28.5 Create Bitrate Calculator logic
    - _Requirements: 23.4_
  - [x] 28.6 Create Focal Length Calculator logic (crop factor)
    - _Requirements: 23.6_
  - [x] 28.7 Create ND Filter Calculator logic
    - _Requirements: 23.8_
  - [x] 28.8 Create Shutter Angle Converter logic
    - _Requirements: 23.9_

- [x] 29. Create Photography UI components
  - [x] 29.1 Create Depth of Field Calculator component and page
    - _Requirements: 23.1_
  - [x] 29.2 Create Time Lapse Calculator component and page
    - _Requirements: 23.2_
  - [x] 29.3 Create Aspect Ratio Calculator component and page
    - _Requirements: 23.3_
  - [x] 29.4 Create Bitrate Calculator component and page
    - _Requirements: 23.4_
  - [x] 29.5 Create Golden Ratio Overlay component and page
    - _Requirements: 23.5_
  - [x] 29.6 Create Focal Length Calculator component and page
    - _Requirements: 23.6_
  - [x] 29.7 Create Printing Size Calculator component and page
    - _Requirements: 23.7_
  - [x] 29.8 Create ND Filter Calculator component and page
    - _Requirements: 23.8_
  - [x] 29.9 Create Shutter Angle Converter component and page
    - _Requirements: 23.9_
  - [x] 29.10 Create Blue Hour/Golden Hour Calculator component and page
    - _Requirements: 23.10_

- [x] 30. Checkpoint - Photography tools complete
  - Test DoF calculator with known lens values
  - Verify timelapse calculations

## Phase 11: Crafts Tools (Category P)

- [x] 31. Implement Crafts calculation functions
  - [x] 31.1 Create Circle Skirt Calculator logic
    - Create `lib/calculations/crafts/circle-skirt-calculator.ts`
    - Use π formula for radius
    - _Requirements: 24.3, 24.11_
  - [x] 31.2 Write property test for Circle geometry
    - **Property 14: Circle Geometry (Skirt/Cylinder)**
    - **Validates: Requirements 24.11**
  - [x] 31.3 Create Knitting Stitch Converter logic
    - Create `lib/calculations/crafts/stitch-converter.ts`
    - _Requirements: 24.2, 24.12_
  - [x] 31.4 Create Fabric Yardage Calculator logic
    - _Requirements: 24.1_
  - [x] 31.5 Create Quilt Binding Calculator logic
    - _Requirements: 24.4_
  - [x] 31.6 Create Crochet Hat Size Calculator logic
    - _Requirements: 24.7_

- [x] 32. Create Crafts UI components
  - [x] 32.1 Create Fabric Yardage Calculator component and page
    - _Requirements: 24.1_
  - [x] 32.2 Create Knitting Stitch Converter component and page
    - _Requirements: 24.2_
  - [x] 32.3 Create Circle Skirt Calculator component and page
    - _Requirements: 24.3_
  - [x] 32.4 Create Quilt Binding Calculator component and page
    - _Requirements: 24.4_
  - [-] 32.5 Create Yarn Substitution Helper component and page
    - _Requirements: 24.5_
  - [x] 32.6 Create Embroidery Floss Calculator component and page
    - _Requirements: 24.6_
  - [x] 32.7 Create Crochet Hat Size Calculator component and page
    - _Requirements: 24.7_
  - [-] 32.8 Create Blanket Size Chart component and page
    - _Requirements: 24.8_
  - [x] 32.9 Create Quarter Inch Seam Tester component and page
    - Include printable guide
    - _Requirements: 24.9_
  - [x] 32.10 Create Socks Size Calculator component and page
    - _Requirements: 24.10_

- [x] 33. Checkpoint - Crafts tools complete
  - Test circle skirt calculator with known measurements
  - Verify stitch converter calculations


## Phase 12: Gardening Tools (Category Q)

- [x] 34. Implement Gardening calculation functions
  - [x] 34.1 Create Potting Soil Volume Calculator logic
    - Create `lib/calculations/garden/potting-soil-calculator.ts`
    - Use cylinder volume formula (πr²h)
    - _Requirements: 25.4, 25.11_
  - [x] 34.2 Create Plant Spacing Calculator logic
    - Create `lib/calculations/garden/plant-spacing-calculator.ts`
    - _Requirements: 25.2, 25.12_
  - [x] 34.3 Create Fertilizer N-P-K Calculator logic
    - _Requirements: 25.3_
  - [x] 34.4 Create Compost C:N Ratio Calculator logic
    - _Requirements: 25.10_
  - [x] 34.5 Create Vegetable Yield Calculator logic
    - _Requirements: 25.8_

- [x] 35. Create Gardening UI components
  - [x] 35.1 Create Mulch & Soil Calculator component and page
    - _Requirements: 25.1_
  - [x] 35.2 Create Plant Spacing Calculator component and page
    - _Requirements: 25.2_
  - [x] 35.3 Create Fertilizer N-P-K Calculator component and page
    - _Requirements: 25.3_
  - [x] 35.4 Create Potting Soil Volume Calculator component and page
    - _Requirements: 25.4_
  - [x] 35.5 Create Watering Schedule Generator component and page
    - _Requirements: 25.5_
  - [x] 35.6 Create Sun/Shade Mapper component and page
    - _Requirements: 25.6_
  - [x] 35.7 Create Seed Germination Tracker component and page
    - _Requirements: 25.7_
  - [x] 35.8 Create Vegetable Yield Calculator component and page
    - _Requirements: 25.8_
  - [x] 35.9 Create Hardiness Zone Finder component and page
    - _Requirements: 25.9_
  - [x] 35.10 Create Compost C:N Ratio Calculator component and page
    - _Requirements: 25.10_

- [x] 36. Checkpoint - Gardening tools complete
  - Test volume calculations
  - Verify plant spacing logic

## Phase 13: Electronics Tools (Category R)

- [x] 37. Implement Electronics calculation functions
  - [x] 37.1 Create Resistor Color Code Calculator logic
    - Create `lib/calculations/electronics/resistor-calculator.ts`
    - Support 4-band and 5-band resistors
    - _Requirements: 26.1, 26.11_
  - [x] 37.2 Write property test for Resistor color code
    - **Property 15: Resistor Color Code Bijection**
    - **Validates: Requirements 26.11**
  - [x] 37.3 Create Ohm's Law Calculator logic
    - Create `lib/calculations/electronics/ohms-law.ts`
    - _Requirements: 26.2, 26.12_
  - [x] 37.4 Write property test for Ohm's Law consistency
    - **Property 16: Ohm's Law Consistency**
    - **Validates: Requirements 26.12**
  - [x] 37.5 Create Voltage Divider Calculator logic
    - _Requirements: 26.3_
  - [x] 37.6 Create LED Resistor Calculator logic
    - _Requirements: 26.4_
  - [x] 37.7 Create Battery Life Calculator logic
    - _Requirements: 26.5_
  - [x] 37.8 Create 555 Timer Calculator logic
    - _Requirements: 26.8_
  - [x] 37.9 Create Capacitor Code Converter logic
    - _Requirements: 26.7_

- [x] 38. Create Electronics UI components
  - [x] 38.1 Create Resistor Color Code Calculator component and page
    - Include visual color band selector
    - _Requirements: 26.1_
  - [x] 38.2 Create Ohm's Law Calculator component and page
    - _Requirements: 26.2_
  - [x] 38.3 Create Voltage Divider Calculator component and page
    - _Requirements: 26.3_
  - [x] 38.4 Create LED Resistor Calculator component and page
    - _Requirements: 26.4_
  - [x] 38.5 Create Battery Life Calculator component and page
    - _Requirements: 26.5_
  - [x] 38.6 Create PCB Trace Width Calculator component and page
    - _Requirements: 26.6_
  - [x] 38.7 Create Capacitor Code Converter component and page
    - _Requirements: 26.7_
  - [x] 38.8 Create 555 Timer Calculator component and page
    - _Requirements: 26.8_
  - [x] 38.9 Create AWG to mm Converter component and page
    - _Requirements: 26.9_
  - [x] 38.10 Create Heat Sink Calculator component and page
    - _Requirements: 26.10_

- [x] 39. Checkpoint - Electronics tools complete
  - Test resistor calculator with known values
  - Verify Ohm's Law calculations

## Phase 14: Sports Betting Tools (Category S)

- [x] 40. Implement Betting calculation functions
  - [x] 40.1 Create Odds Converter logic
    - Create `lib/calculations/betting/odds-converter.ts`
    - Support American, Decimal, Fractional formats
    - _Requirements: 27.1, 27.9_
  - [x] 40.2 Write property test for Odds conversion round-trip
    - **Property 17: Odds Conversion Round-Trip**
    - **Validates: Requirements 27.9**
  - [x] 40.3 Create Parlay Calculator logic
    - Create `lib/calculations/betting/parlay-calculator.ts`
    - _Requirements: 27.5, 27.10_
  - [x] 40.4 Write property test for Parlay multiplication
    - **Property 18: Parlay Odds Multiplication**
    - **Validates: Requirements 27.10**
  - [x] 40.5 Create Arbitrage Calculator logic
    - _Requirements: 27.2_
  - [x] 40.6 Create Kelly Criterion Calculator logic
    - _Requirements: 27.4_
  - [x] 40.7 Create Implied Probability Calculator logic
    - _Requirements: 27.6_
  - [x] 40.8 Create Hold/Vig Calculator logic
    - _Requirements: 27.7_

- [x] 41. Create Betting UI components
  - [x] 41.1 Create Odds Converter component and page
    - _Requirements: 27.1_
  - [x] 41.2 Create Arbitrage Calculator component and page
    - _Requirements: 27.2_
  - [x] 41.3 Create Hedging Calculator component and page
    - _Requirements: 27.3_
  - [x] 41.4 Create Kelly Criterion Calculator component and page
    - _Requirements: 27.4_
  - [x] 41.5 Create Parlay Calculator component and page
    - _Requirements: 27.5_
  - [x] 41.6 Create Implied Probability Calculator component and page
    - _Requirements: 27.6_
  - [x] 41.7 Create Hold/Vig Calculator component and page
    - _Requirements: 27.7_
  - [x] 41.8 Create Betting ROI Calculator component and page
    - _Requirements: 27.8_

- [x] 42. Checkpoint - Betting tools complete
  - Test odds conversions with known values
  - Verify parlay calculations


## Phase 15: Automotive Tools (Category T)

- [x] 43. Implement Automotive calculation functions
  - [x] 43.1 Create Tire Size Calculator logic
    - Create `lib/calculations/auto/tire-calculator.ts`
    - Calculate circumference and speedometer error
    - _Requirements: 28.1, 28.9_
  - [x] 43.2 Write property test for Tire circumference ratio
    - **Property 19: Tire Circumference Ratio**
    - **Validates: Requirements 28.9**
  - [x] 43.3 Create EV Charging Time Calculator logic
    - Create `lib/calculations/auto/ev-charging-calculator.ts`
    - _Requirements: 28.8, 28.10_
  - [x] 43.4 Create Wheel Offset Calculator logic
    - _Requirements: 28.2_
  - [x] 43.5 Create Fuel Consumption Converter logic
    - _Requirements: 28.4_
  - [x] 43.6 Create 0-60 Time Estimator logic
    - _Requirements: 28.7_

- [x] 44. Create Automotive UI components
  - [x] 44.1 Create Tire Size Calculator component and page
    - Include visual comparison
    - _Requirements: 28.1_
  - [x] 44.2 Create Wheel Offset Calculator component and page
    - _Requirements: 28.2_
  - [x] 44.3 Create Horsepower to kW Converter component and page
    - _Requirements: 28.3_
  - [x] 44.4 Create Fuel Consumption Converter component and page
    - _Requirements: 28.4_
  - [x] 44.5 Create Car Loan Early Payoff Calculator component and page
    - _Requirements: 28.5_
  - [x] 44.6 Create Oil Change Tracker component and page
    - _Requirements: 28.6_
  - [x] 44.7 Create 0-60 Time Estimator component and page
    - _Requirements: 28.7_
  - [x] 44.8 Create EV Charging Time Calculator component and page
    - _Requirements: 28.8_

- [x] 45. Checkpoint - Automotive tools complete
  - Test tire calculator with known sizes
  - Verify EV charging calculations

## Phase 16: Statistics Tools (Category U)

- [x] 46. Implement Statistics calculation functions
  - [x] 46.1 Create Sample Size Calculator logic
    - Create `lib/calculations/stats/sample-size-calculator.ts`
    - _Requirements: 29.2, 29.9_
  - [x] 46.2 Create Standard Deviation Calculator logic
    - Create `lib/calculations/stats/statistics.ts`
    - _Requirements: 29.3_
  - [x] 46.3 Create A/B Test Significance Calculator logic
    - Create `lib/calculations/stats/ab-test-calculator.ts`
    - _Requirements: 29.8_
  - [x] 46.4 Create P-Value Calculator logic
    - _Requirements: 29.1_
  - [x] 46.5 Create Correlation Coefficient Calculator logic
    - _Requirements: 29.7_
  - [x] 46.6 Create Dice Probability Calculator logic
    - _Requirements: 29.5_

- [x] 47. Create Statistics UI components
  - [x] 47.1 Create P-Value Calculator component and page
    - _Requirements: 29.1_
  - [x] 47.2 Create Sample Size Calculator component and page
    - _Requirements: 29.2_
  - [x] 47.3 Create Standard Deviation Calculator component and page
    - _Requirements: 29.3_
  - [x] 47.4 Create Coin Flip Simulator component and page
    - Include distribution visualization using recharts
    - _Requirements: 29.4_
  - [x] 47.5 Create Dice Probability Calculator component and page
    - _Requirements: 29.5_
  - [x] 47.6 Create Random Number Generator (Distribution) component and page
    - _Requirements: 29.6_
  - [x] 47.7 Create Correlation Coefficient Calculator component and page
    - _Requirements: 29.7_
  - [x] 47.8 Create A/B Test Significance Calculator component and page
    - _Requirements: 29.8_

- [x] 48. Checkpoint - Statistics tools complete
  - Test sample size calculator with known parameters
  - Verify A/B test calculations

## Phase 17: Time & Date Tools (Category V)

- [x] 49. Implement Time calculation functions
  - [x] 49.1 Create Business Days Calculator logic
    - Create `lib/calculations/time/business-days-calculator.ts`
    - Exclude weekends and optionally US holidays
    - _Requirements: 30.1, 30.7_
  - [x] 49.2 Write property test for Business days exclusion
    - **Property 20: Business Days Exclusion**
    - **Validates: Requirements 30.7**
  - [x] 49.3 Create Precise Age Calculator logic
    - _Requirements: 30.3_
  - [x] 49.4 Create Week Number Calculator logic
    - _Requirements: 30.4_
  - [x] 49.5 Create Calendar Generator logic with PDF export
    - _Requirements: 30.5, 30.8_

- [x] 50. Create Time UI components
  - [x] 50.1 Create Business Days Calculator component and page
    - _Requirements: 30.1_
  - [x] 50.2 Create Time Duration Calculator component and page
    - _Requirements: 30.2_
  - [x] 50.3 Create Precise Age Calculator component and page
    - _Requirements: 30.3_
  - [x] 50.4 Create Week Number Calculator component and page
    - _Requirements: 30.4_
  - [x] 50.5 Create Printable Calendar Generator component and page
    - Use jspdf for PDF export
    - _Requirements: 30.5_
  - [x] 50.6 Create Time Zone Difference Map component and page
    - _Requirements: 30.6_

- [x] 51. Checkpoint - Time tools complete
  - Test business days calculator with known date ranges
  - Verify calendar PDF generation

## Phase 18: Physics Tools (Category X)

- [x] 52. Implement Physics calculation functions
  - [x] 52.1 Create Projectile Motion Calculator logic
    - Create `lib/calculations/physics/projectile-motion.ts`
    - _Requirements: 31.4, 31.8_
  - [x] 52.2 Write property test for Projectile motion physics
    - **Property 21: Projectile Motion Physics**
    - **Validates: Requirements 31.8**
  - [x] 52.3 Create Density Calculator logic
    - _Requirements: 31.1_
  - [x] 52.4 Create Kinetic Energy Calculator logic
    - _Requirements: 31.2_
  - [x] 52.5 Create Sound Speed Calculator logic
    - _Requirements: 31.4_
  - [x] 52.6 Create Pressure Converter logic
    - _Requirements: 31.5_

- [x] 53. Create Physics UI components
  - [x] 53.1 Create Density Calculator component and page
    - _Requirements: 31.1_
  - [x] 53.2 Create Kinetic Energy Calculator component and page
    - _Requirements: 31.2_
  - [x] 53.3 Create Projectile Motion Calculator component and page
    - Display trajectory visualization
    - _Requirements: 31.3_
  - [x] 53.4 Create Sound Speed Calculator component and page
    - _Requirements: 31.4_
  - [x] 53.5 Create Pressure Converter component and page
    - _Requirements: 31.5_
  - [x] 53.6 Create Torque Converter component and page
    - _Requirements: 31.6_

- [x] 54. Checkpoint - Physics tools complete
  - Test projectile motion with known values
  - Verify physics formulas

## Phase 19: Construction Advanced Tools (Category Y)

- [x] 55. Implement Construction calculation functions
  - [x] 55.1 Create Crown Molding Angle Calculator logic
    - Create `lib/calculations/construction/crown-molding-calculator.ts`
    - _Requirements: 32.2, 32.6_
  - [x] 55.2 Create Baluster Spacing Calculator logic
    - Create `lib/calculations/construction/baluster-calculator.ts`
    - Ensure 4-inch sphere rule compliance
    - _Requirements: 32.3, 32.7_
  - [x] 55.3 Write property test for Baluster spacing compliance
    - **Property 22: Baluster Spacing Code Compliance**
    - **Validates: Requirements 32.7**
  - [x] 55.4 Create Board Foot Calculator logic
    - _Requirements: 32.1_
  - [x] 55.5 Create Concrete Slab Calculator logic
    - _Requirements: 32.4_
  - [x] 55.6 Create Roof Framing Calculator logic
    - _Requirements: 32.5_

- [x] 56. Create Construction UI components
  - [x] 56.1 Create Board Foot Calculator component and page
    - _Requirements: 32.1_
  - [x] 56.2 Create Crown Molding Angle Calculator component and page
    - _Requirements: 32.2_
  - [x] 56.3 Create Baluster Spacing Calculator component and page
    - _Requirements: 32.3_
  - [x] 56.4 Create Concrete Slab Calculator component and page
    - Include rebar estimation
    - _Requirements: 32.4_
  - [x] 56.5 Create Roof Framing Calculator component and page
    - _Requirements: 32.5_

- [x] 57. Checkpoint - Construction tools complete
  - Test crown molding angles
  - Verify baluster spacing compliance

## Phase 20: Final Integration & Testing

- [x] 58. Update tool registry with all new tools
  - [x] 58.1 Add all academic tools to registry
  - [x] 58.2 Add all travel tools to registry
  - [x] 58.3 Add all gaming tools to registry
  - [x] 58.4 Add all creator tools to registry
  - [x] 58.5 Add all fun tools to registry
  - [x] 58.6 Add all audio tools to registry
  - [x] 58.7 Add all RPG tools to registry
  - [x] 58.8 Add all crypto tools to registry
  - [x] 58.9 Add all photo tools to registry
  - [x] 58.10 Add all crafts tools to registry
  - [x] 58.11 Add all garden tools to registry
  - [x] 58.12 Add all electronics tools to registry
  - [x] 58.13 Add all betting tools to registry
  - [x] 58.14 Add all auto tools to registry
  - [x] 58.15 Add all stats tools to registry
  - [x] 58.16 Add all time tools to registry
  - [x] 58.17 Add all physics tools to registry
  - [x] 58.18 Add all construction tools to registry

- [x] 59. Create category index pages
  - [x] 59.1 Create academic category index page
  - [x] 59.2 Create travel category index page
  - [x] 59.3 Create gaming category index page
  - [x] 59.4 Create creator category index page
  - [x] 59.5 Create fun category index page
  - [x] 59.6 Create audio category index page
  - [x] 59.7 Create rpg category index page
  - [x] 59.8 Create crypto category index page
  - [x] 59.9 Create photo category index page
  - [x] 59.10 Create crafts category index page
  - [x] 59.11 Create garden category index page
  - [x] 59.12 Create electronics category index page
  - [x] 59.13 Create betting category index page
  - [x] 59.14 Create auto category index page
  - [x] 59.15 Create stats category index page
  - [x] 59.16 Create time category index page
  - [x] 59.17 Create physics category index page
  - [x] 59.18 Create construction category index page

- [x] 60. Update sitemap and navigation
  - [x] 60.1 Update sitemap.ts with all new tool pages
  - [x] 60.2 Update main navigation with new categories

- [x] 61. Final checkpoint - All tools complete
  - Run all property tests
  - Run all unit tests
  - Verify all pages render correctly
  - Check accessibility compliance

## Notes

- Each phase includes a checkpoint to verify progress
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- All tools follow existing project patterns and templates
- All property-based tests are required for comprehensive coverage

