# Requirements Document

## Introduction

This specification extends the existing OmniTools website with 15 new high-value tool categories targeting specific user segments with high engagement potential. The expansion includes Student & Academic tools (seasonal traffic spikes), Travel & Digital Nomad utilities (high-value users), Gaming & E-Sports calculators (viral potential), Creator Economy tools (B2B value), Fun & Psychology tests (high engagement), Audio & Music Production utilities, Tabletop RPG generators, Crypto & Web3 tools, Photography & Video calculators, Knitting & Sewing calculators, Gardening tools, Electronics engineering utilities, Sports Betting math tools, Automotive calculators, and Statistics tools.

## Glossary

- **Tool_Website**: The main Next.js application hosting all calculator and converter tools
- **Calculator_Component**: A reusable React component that performs calculations based on user inputs
- **Generator_Component**: A reusable React component that generates content (names, lists, codes)
- **Timer_Component**: A reusable React component with countdown/stopwatch functionality
- **Interactive_Component**: A reusable React component with real-time visual feedback
- **PDF_Generator**: Client-side PDF generation using jspdf library
- **Chart_Component**: Data visualization using recharts library
- **QR_Generator**: QR code generation using react-qr-code library
- **Schengen_Rule**: 90/180 day rule for Schengen visa (max 90 days in any 180-day period)
- **PBT**: Property-Based Testing for validating universal properties
- **PWA**: Progressive Web App for offline capability

## Requirements

### Requirement 15: Student & Academic Tools (Category F - 8 Tools)

**User Story:** As a student, I want academic calculators that help me track grades and prepare for exams, so that I can manage my academic performance effectively.

#### Acceptance Criteria

1. THE Tool_Website SHALL include a College GPA Calculator supporting 4.0 scale with weighted and unweighted options
2. THE Tool_Website SHALL include a Final Grade Calculator that computes required exam score to achieve target grade
3. THE Tool_Website SHALL include an APA/MLA Citation Generator for books and web pages
4. THE Tool_Website SHALL include a Scientific Notation Converter for number format conversion
5. THE Tool_Website SHALL include a Fraction Calculator supporting add, subtract, multiply, divide operations
6. THE Tool_Website SHALL include a Plagiarism Checker performing local text comparison between two inputs
7. THE Tool_Website SHALL include a Pomodoro Timer with customizable work/break intervals
8. THE Tool_Website SHALL include a Class Schedule Maker with image/PDF export functionality
9. WHEN a user enters course grades, THE GPA_Calculator SHALL compute both weighted and unweighted GPA values
10. WHEN a user enters current grade and target grade, THE Final_Grade_Calculator SHALL compute the minimum exam score required
11. FOR ALL fraction operations, THE Fraction_Calculator SHALL display results in simplified form

### Requirement 16: Travel & Digital Nomad Tools (Category G - 10 Tools)

**User Story:** As a digital nomad or frequent traveler, I want travel planning tools that help me manage visas, time zones, and budgets, so that I can work and travel efficiently.

#### Acceptance Criteria

1. THE Tool_Website SHALL include a Schengen Visa Calculator implementing the 90/180 day sliding window rule
2. THE Tool_Website SHALL include a Time Zone Meeting Planner with visual slider interface
3. THE Tool_Website SHALL include a Currency Converter with offline capability using Service Worker cached rates
4. THE Tool_Website SHALL include a Packing List Generator based on destination, weather, and trip duration
5. THE Tool_Website SHALL include a Flight Duration Calculator between city pairs
6. THE Tool_Website SHALL include a Travel Budget Splitter for group expense tracking
7. THE Tool_Website SHALL include a Sun Angle/Sunset Calculator for photography planning
8. THE Tool_Website SHALL include a Weather Comparison Tool for two cities
9. THE Tool_Website SHALL include a Luggage Size Checker with airline-specific limits
10. WHEN a user enters travel dates, THE Schengen_Calculator SHALL display remaining days and mandatory exit date
11. WHEN calculating meeting times, THE Timezone_Planner SHALL highlight overlapping business hours across zones
12. FOR ALL currency conversions, THE Currency_Converter SHALL function offline using cached exchange rates

### Requirement 17: Gaming & E-Sports Tools (Category H - 10 Tools)

**User Story:** As a gamer, I want gaming utilities that help me optimize settings and track performance, so that I can improve my gameplay.

#### Acceptance Criteria

1. THE Tool_Website SHALL include a Mouse Sensitivity Converter between games (Valorant, CS2, Apex, etc.)
2. THE Tool_Website SHALL include an eDPI Calculator (DPI × in-game sensitivity)
3. THE Tool_Website SHALL include a Reaction Time Test with visual stimulus
4. THE Tool_Website SHALL include a browser-based Aim Trainer with click targets
5. THE Tool_Website SHALL include a Pokemon Type Calculator for type effectiveness
6. THE Tool_Website SHALL include a Minecraft Circle Generator for pixel art planning
7. THE Tool_Website SHALL include a KD Ratio Calculator
8. THE Tool_Website SHALL include a Monitor Hz Tester for refresh rate verification
9. THE Tool_Website SHALL include a Steam ID Finder for hex ID conversion
10. THE Tool_Website SHALL include a Twitch Emote Resizer for standard emote dimensions
11. WHEN converting sensitivity, THE Mouse_Sensitivity_Converter SHALL account for game-specific multipliers
12. WHEN testing reaction time, THE Reaction_Test SHALL record and display average over multiple attempts

### Requirement 18: Creator Economy & Small Business Tools (Category I - 10 Tools)

**User Story:** As a content creator or small business owner, I want business utilities that help me manage invoices and calculate earnings, so that I can run my business efficiently.

#### Acceptance Criteria

1. THE Tool_Website SHALL include an Invoice Generator with PDF export using jspdf
2. THE Tool_Website SHALL include a Privacy Policy Generator for websites and apps
3. THE Tool_Website SHALL include a Terms & Conditions Generator
4. THE Tool_Website SHALL include a QR Code Generator for WiFi credentials
5. THE Tool_Website SHALL include a Paycheck Calculator (hourly to weekly/monthly)
6. THE Tool_Website SHALL include a YouTube Money Calculator based on view counts
7. THE Tool_Website SHALL include an Instagram Engagement Rate Calculator
8. THE Tool_Website SHALL include a Signature Generator creating SVG handwriting-style signatures
9. THE Tool_Website SHALL include a Business Name Generator with random word combinations
10. THE Tool_Website SHALL include a CPM Calculator for advertising costs
11. WHEN generating an invoice, THE Invoice_Generator SHALL produce a downloadable PDF with all entered details
12. WHEN generating a WiFi QR code, THE QR_Generator SHALL encode SSID and password in standard WiFi format

### Requirement 19: Fun, Psychology & Mysticism Tools (Category J - 10 Tools)

**User Story:** As a user seeking entertainment, I want fun personality and compatibility tools, so that I can enjoy engaging content and share results with friends.

#### Acceptance Criteria

1. THE Tool_Website SHALL include a Love Compatibility Test based on name inputs
2. THE Tool_Website SHALL include a Moon Phase Calculator showing phase for any date
3. THE Tool_Website SHALL include a Zodiac Sign Calculator with basic horoscope info
4. THE Tool_Website SHALL include a Biorhythm Calculator with visual chart using recharts
5. THE Tool_Website SHALL include a Numerology Calculator for name-based life path numbers
6. THE Tool_Website SHALL include an Age in Days/Seconds Calculator
7. THE Tool_Website SHALL include a Day of the Week Calculator for birth dates
8. THE Tool_Website SHALL include a Decision Maker Wheel with spin animation
9. THE Tool_Website SHALL include a Visual Breathing Bubble for anxiety relief
10. THE Tool_Website SHALL include a Soundboard with meme sound effects
11. WHEN displaying biorhythm, THE Biorhythm_Calculator SHALL render Physical, Emotional, and Intellectual cycles on a line chart
12. WHEN spinning the decision wheel, THE Decision_Wheel SHALL animate smoothly and land on a random option

### Requirement 20: Audio & Music Production Tools (Category K - 10 Tools)

**User Story:** As a music producer or musician, I want audio calculation tools, so that I can optimize my mixing and production workflow.

#### Acceptance Criteria

1. THE Tool_Website SHALL include a BPM Tapper that calculates tempo from spacebar taps
2. THE Tool_Website SHALL include a Delay & Reverb Time Calculator based on BPM
3. THE Tool_Website SHALL include a Note to Frequency Converter (e.g., A4 = 440Hz)
4. THE Tool_Website SHALL include a Key/Scale Finder from selected notes
5. THE Tool_Website SHALL include a Sample Rate Calculator for audio file sizes
6. THE Tool_Website SHALL include a Guitar Tuner using Web Audio API microphone input
7. THE Tool_Website SHALL include a Visual Metronome with BPM-synced flashing
8. THE Tool_Website SHALL include an Audio Panning Visualizer
9. THE Tool_Website SHALL include a Song Structure Builder with drag-drop sections
10. THE Tool_Website SHALL include a Loudness Range Calculator
11. WHEN tapping BPM, THE BPM_Tapper SHALL calculate average tempo from the last 8 taps
12. WHEN calculating delay time, THE Delay_Calculator SHALL display ms values for 1/4, 1/8, 1/16 notes

### Requirement 21: Tabletop RPG & D&D Tools (Category L - 10 Tools)

**User Story:** As a tabletop RPG player or game master, I want D&D utilities that help me run games, so that I can create engaging gaming sessions.

#### Acceptance Criteria

1. THE Tool_Website SHALL include a Dice Roller supporting D4, D6, D8, D10, D12, D20 with visual animation
2. THE Tool_Website SHALL include a Fantasy Name Generator for multiple races (Elf, Dwarf, Orc, Human)
3. THE Tool_Website SHALL include an RPG Stat Roller using 4d6-drop-lowest method
4. THE Tool_Website SHALL include an Initiative Tracker for combat order management
5. THE Tool_Website SHALL include an Encounter Difficulty Calculator based on party level
6. THE Tool_Website SHALL include a Loot Generator for random treasure tables
7. THE Tool_Website SHALL include a Character Sheet Helper for modifier calculations
8. THE Tool_Website SHALL include a Map Grid Generator for hex and square grids
9. THE Tool_Website SHALL include a Tavern Generator with random names, menus, and NPCs
10. THE Tool_Website SHALL include a Quest Idea Generator for random adventure hooks
11. WHEN rolling dice, THE Dice_Roller SHALL display individual die results and total sum
12. WHEN generating names, THE Fantasy_Name_Generator SHALL provide culturally appropriate names for selected race

### Requirement 22: Crypto & Web3 Tools (Category N - 10 Tools)

**User Story:** As a cryptocurrency user, I want crypto calculation tools, so that I can manage my digital assets effectively.

#### Acceptance Criteria

1. THE Tool_Website SHALL include a Gas Fee Converter (Gwei to USD equivalent)
2. THE Tool_Website SHALL include an Impermanent Loss Calculator for DeFi liquidity pools
3. THE Tool_Website SHALL include a Satoshi to USD Converter
4. THE Tool_Website SHALL include an Address Shortener Display (0x123...abc format)
5. THE Tool_Website SHALL include a Hash Generator for SHA-256 and Keccak-256
6. THE Tool_Website SHALL include a Seed Phrase Generator (offline use only, with security warnings)
7. THE Tool_Website SHALL include an NFT Rarity Calculator for percentage-based rarity
8. THE Tool_Website SHALL include a Crypto APY to APR Converter
9. THE Tool_Website SHALL include a Paper Wallet Generator with QR codes (offline, with security warnings)
10. THE Tool_Website SHALL include an Ethereum Unit Converter (Wei, Gwei, Ether)
11. WHEN generating seed phrases, THE Seed_Generator SHALL display prominent security warnings about offline use
12. FOR ALL unit conversions, THE Ethereum_Converter SHALL handle 18 decimal precision correctly

### Requirement 23: Photography & Video Tools (Category O - 10 Tools)

**User Story:** As a photographer or videographer, I want technical calculation tools, so that I can plan and execute shoots effectively.

#### Acceptance Criteria

1. THE Tool_Website SHALL include a Depth of Field Calculator based on focal length, aperture, and distance
2. THE Tool_Website SHALL include a Time Lapse Calculator for interval and duration planning
3. THE Tool_Website SHALL include an Aspect Ratio Calculator for video dimensions
4. THE Tool_Website SHALL include a Bitrate Calculator for video file size estimation
5. THE Tool_Website SHALL include a Golden Ratio Overlay generator for composition
6. THE Tool_Website SHALL include a Focal Length Calculator with crop factor support
7. THE Tool_Website SHALL include a Printing Size Calculator based on resolution and DPI
8. THE Tool_Website SHALL include an ND Filter Exposure Calculator
9. THE Tool_Website SHALL include a Shutter Angle to Shutter Speed Converter
10. THE Tool_Website SHALL include a Blue Hour/Golden Hour Calculator (requires location)
11. WHEN calculating DoF, THE DoF_Calculator SHALL display near focus, far focus, and hyperfocal distance
12. WHEN calculating time lapse, THE TimeLapse_Calculator SHALL show total frames and final video duration

### Requirement 24: Knitting, Sewing & Fiber Arts Tools (Category P - 10 Tools)

**User Story:** As a crafter or seamstress, I want fabric and yarn calculation tools, so that I can plan my projects accurately.

#### Acceptance Criteria

1. THE Tool_Website SHALL include a Fabric Yardage Calculator based on garment type and size
2. THE Tool_Website SHALL include a Knitting Stitch Converter for gauge adjustments
3. THE Tool_Website SHALL include a Circle Skirt Calculator computing inner radius from waist measurement
4. THE Tool_Website SHALL include a Quilt Binding Calculator for binding strip length
5. THE Tool_Website SHALL include a Yarn Substitution Helper based on yarn weight
6. THE Tool_Website SHALL include an Embroidery Floss Calculator for thread estimation
7. THE Tool_Website SHALL include a Crochet Hat Size Calculator from head circumference
8. THE Tool_Website SHALL include a Blanket Size Chart reference tool
9. THE Tool_Website SHALL include a Quarter Inch Seam Tester with printable guide
10. THE Tool_Website SHALL include a Socks Size Calculator from foot length
11. WHEN calculating circle skirt, THE CircleSkirt_Calculator SHALL compute radius using π formula
12. WHEN adjusting gauge, THE Stitch_Converter SHALL recalculate cast-on stitches for target width

### Requirement 25: Gardening & Botany Tools (Category Q - 10 Tools)

**User Story:** As a gardener, I want landscaping calculation tools, so that I can plan my garden projects accurately.

#### Acceptance Criteria

1. THE Tool_Website SHALL include a Mulch & Soil Calculator for volume estimation
2. THE Tool_Website SHALL include a Plant Spacing Calculator for garden layout
3. THE Tool_Website SHALL include a Fertilizer N-P-K Ratio Calculator
4. THE Tool_Website SHALL include a Potting Soil Volume Calculator for cylindrical containers
5. THE Tool_Website SHALL include a Watering Schedule Generator based on plant type
6. THE Tool_Website SHALL include a Sun/Shade Mapper for shadow estimation
7. THE Tool_Website SHALL include a Seed Germination Tracker log tool
8. THE Tool_Website SHALL include a Vegetable Yield Calculator
9. THE Tool_Website SHALL include a Hardiness Zone Finder by zip code
10. THE Tool_Website SHALL include a Compost C:N Ratio Calculator
11. WHEN calculating potting soil, THE Volume_Calculator SHALL use cylinder volume formula (πr²h)
12. WHEN calculating plant spacing, THE Spacing_Calculator SHALL display total plants fitting in area

### Requirement 26: Electronics Engineering Tools (Category R - 10 Tools)

**User Story:** As an electronics hobbyist or engineer, I want circuit calculation tools, so that I can design and build projects accurately.

#### Acceptance Criteria

1. THE Tool_Website SHALL include a Resistor Color Code Calculator with visual color band selector
2. THE Tool_Website SHALL include an Ohm's Law Calculator (V = IR)
3. THE Tool_Website SHALL include a Voltage Divider Calculator
4. THE Tool_Website SHALL include an LED Series Resistor Calculator
5. THE Tool_Website SHALL include a Battery Life Calculator (capacity ÷ current)
6. THE Tool_Website SHALL include a PCB Trace Width Calculator
7. THE Tool_Website SHALL include a Capacitor Code Converter (104 → 100nF)
8. THE Tool_Website SHALL include a 555 Timer Calculator for frequency/duty cycle
9. THE Tool_Website SHALL include an AWG to mm Converter for wire gauge
10. THE Tool_Website SHALL include a Heat Sink Calculator for thermal resistance
11. WHEN selecting resistor colors, THE Resistor_Calculator SHALL display resistance value with tolerance
12. FOR ALL Ohm's Law calculations, solving for any variable SHALL produce correct results given two inputs

### Requirement 27: Sports Betting Math Tools (Category S - 8 Tools)

**User Story:** As a sports bettor, I want odds calculation tools, so that I can make informed betting decisions.

#### Acceptance Criteria

1. THE Tool_Website SHALL include an Odds Converter (American, Decimal, Fractional)
2. THE Tool_Website SHALL include an Arbitrage Calculator for surebet detection
3. THE Tool_Website SHALL include a Hedging Calculator for risk management
4. THE Tool_Website SHALL include a Kelly Criterion Calculator for optimal bet sizing
5. THE Tool_Website SHALL include a Parlay Calculator for multi-bet odds
6. THE Tool_Website SHALL include an Implied Probability Calculator from odds
7. THE Tool_Website SHALL include a Hold/Vig Calculator for bookmaker margin
8. THE Tool_Website SHALL include a Betting ROI Calculator for long-term tracking
9. WHEN converting odds, THE Odds_Converter SHALL accurately convert between all three formats
10. FOR ALL parlay calculations, THE Parlay_Calculator SHALL compute combined odds correctly

### Requirement 28: Automotive Tools (Category T - 8 Tools)

**User Story:** As a car enthusiast, I want automotive calculation tools, so that I can plan modifications and maintenance.

#### Acceptance Criteria

1. THE Tool_Website SHALL include a Tire Size Calculator with visual comparison
2. THE Tool_Website SHALL include a Wheel Offset (ET) Calculator
3. THE Tool_Website SHALL include a Horsepower to kW Converter
4. THE Tool_Website SHALL include a Fuel Consumption Converter (MPG to L/100km)
5. THE Tool_Website SHALL include a Car Loan Early Payoff Calculator
6. THE Tool_Website SHALL include an Oil Change Tracker log tool
7. THE Tool_Website SHALL include a 0-60 Time Estimator based on power-to-weight
8. THE Tool_Website SHALL include an EV Charging Time Calculator
9. WHEN comparing tire sizes, THE Tire_Calculator SHALL display speedometer error percentage
10. WHEN calculating EV charging, THE Charging_Calculator SHALL estimate time based on charger power and battery capacity

### Requirement 29: Probability & Statistics Tools (Category U - 8 Tools)

**User Story:** As a student or data analyst, I want statistics calculation tools, so that I can perform statistical analysis efficiently.

#### Acceptance Criteria

1. THE Tool_Website SHALL include a P-Value Calculator for hypothesis testing
2. THE Tool_Website SHALL include a Sample Size Calculator for survey planning
3. THE Tool_Website SHALL include a Standard Deviation Calculator
4. THE Tool_Website SHALL include a Coin Flip Simulator with distribution visualization
5. THE Tool_Website SHALL include a Dice Probability Calculator
6. THE Tool_Website SHALL include a Random Number Generator with distribution options
7. THE Tool_Website SHALL include a Correlation Coefficient Calculator
8. THE Tool_Website SHALL include an A/B Test Significance Calculator
9. WHEN calculating sample size, THE Sample_Calculator SHALL use standard statistical formulas
10. WHEN simulating coin flips, THE Simulator SHALL display frequency distribution chart

### Requirement 30: Time & Date Tools (Category V - 6 Tools)

**User Story:** As a professional, I want time calculation tools, so that I can manage schedules and deadlines effectively.

#### Acceptance Criteria

1. THE Tool_Website SHALL include a Business Days Calculator excluding weekends and holidays
2. THE Tool_Website SHALL include a Time Duration Calculator for adding/subtracting time
3. THE Tool_Website SHALL include a Precise Age Calculator (years, months, days, hours, seconds)
4. THE Tool_Website SHALL include a Week Number Calculator
5. THE Tool_Website SHALL include a Printable Calendar Generator with PDF export
6. THE Tool_Website SHALL include a Time Zone Difference Map with visual display
7. WHEN calculating business days, THE Business_Days_Calculator SHALL exclude weekends and optionally US holidays
8. WHEN generating calendars, THE Calendar_Generator SHALL produce printable PDF output

### Requirement 31: Physics & Science Tools (Category X - 6 Tools)

**User Story:** As a student or engineer, I want physics calculation tools, so that I can solve scientific problems efficiently.

#### Acceptance Criteria

1. THE Tool_Website SHALL include a Density Calculator (ρ = m/V)
2. THE Tool_Website SHALL include a Kinetic Energy Calculator (KE = ½mv²)
3. THE Tool_Website SHALL include a Projectile Motion Calculator
4. THE Tool_Website SHALL include a Sound Speed Calculator based on temperature
5. THE Tool_Website SHALL include a Pressure Converter (Bar, PSI, Pascal)
6. THE Tool_Website SHALL include a Torque Converter
7. FOR ALL physics calculations, THE Calculator SHALL display the formula used
8. WHEN calculating projectile motion, THE Calculator SHALL display trajectory, max height, and range

### Requirement 32: Construction & Carpentry Advanced Tools (Category Y - 5 Tools)

**User Story:** As a carpenter or contractor, I want advanced construction calculators, so that I can plan complex projects accurately.

#### Acceptance Criteria

1. THE Tool_Website SHALL include a Board Foot Calculator for lumber pricing
2. THE Tool_Website SHALL include a Crown Molding Angle Calculator
3. THE Tool_Website SHALL include a Baluster Spacing Calculator for code compliance
4. THE Tool_Website SHALL include a Concrete Slab Calculator with rebar estimation
5. THE Tool_Website SHALL include a Roof Framing Calculator
6. WHEN calculating crown molding, THE Calculator SHALL provide miter and bevel angles
7. WHEN calculating baluster spacing, THE Calculator SHALL ensure compliance with 4-inch sphere rule

### Requirement 33: Technical Implementation Standards

**User Story:** As a developer, I want consistent implementation patterns, so that I can build tools efficiently and maintain code quality.

#### Acceptance Criteria

1. THE Tool_Website SHALL use jspdf library for all PDF generation features
2. THE Tool_Website SHALL use recharts library for all chart visualizations
3. THE Tool_Website SHALL use react-qr-code library for QR code generation
4. THE Tool_Website SHALL use date-fns library for all date calculations
5. THE Tool_Website SHALL implement PWA capabilities for offline-capable tools
6. THE Tool_Website SHALL use Web Audio API for audio-related tools
7. WHEN generating PDFs, THE Tool_Website SHALL perform all generation client-side without server requests
8. WHEN displaying charts, THE Tool_Website SHALL use responsive chart components

### Requirement 34: Tool Template Patterns

**User Story:** As a developer, I want reusable tool templates, so that I can rapidly develop new tools with consistent UX.

#### Acceptance Criteria

1. THE Tool_Website SHALL provide a Calculator Template for input-compute-output tools
2. THE Tool_Website SHALL provide a Generator Template for content generation tools
3. THE Tool_Website SHALL provide a Lookup Template for reference/chart tools
4. THE Tool_Website SHALL provide a Timer Template for countdown/stopwatch tools
5. THE Tool_Website SHALL provide an Interactive Template for real-time visual feedback tools
6. WHEN creating a new calculator tool, THE Developer SHALL extend the Calculator Template
7. WHEN creating a new generator tool, THE Developer SHALL extend the Generator Template

