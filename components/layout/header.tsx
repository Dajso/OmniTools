'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Menu, X, Search, ChevronDown, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { SearchDialog } from './search-dialog';
import { FavoritesDialog } from './favorites-dialog';
import { useFavorites } from '@/lib/hooks/use-favorites';

interface NavCategory {
  name: string;
  href: string;
  items: { name: string; href: string }[];
}

// Primary categories shown directly in the navbar
const primaryCategories: NavCategory[] = [
  {
    name: 'Finance',
    href: '/calculators/finance',
    items: [
      { name: 'Mortgage Calculator', href: '/calculators/finance/mortgage-calculator' },
      { name: 'Compound Interest', href: '/calculators/finance/compound-interest-calculator' },
      { name: 'Tip Calculator', href: '/calculators/finance/tip-calculator' },
      { name: '401(k) Calculator', href: '/calculators/finance/401k-calculator' },
      { name: 'View All Finance Tools', href: '/calculators/finance' },
    ],
  },
  {
    name: 'Health',
    href: '/calculators/health',
    items: [
      { name: 'BMI Calculator', href: '/calculators/health/bmi-calculator' },
      { name: 'TDEE Calculator', href: '/calculators/health/tdee-calculator' },
      { name: 'Macro Calculator', href: '/calculators/health/macro-calculator' },
      { name: 'Sleep Cycle Calculator', href: '/calculators/health/sleep-cycle-calculator' },
      { name: 'View All Health Tools', href: '/calculators/health' },
    ],
  },
  {
    name: 'Home & DIY',
    href: '/calculators/home',
    items: [
      { name: 'Paint Calculator', href: '/calculators/home/paint-calculator' },
      { name: 'Concrete Calculator', href: '/calculators/home/concrete-calculator' },
      { name: 'Square Footage', href: '/calculators/home/square-footage-calculator' },
      { name: 'Tile Calculator', href: '/calculators/home/tile-calculator' },
      { name: 'View All Home Tools', href: '/calculators/home' },
    ],
  },
  {
    name: 'Productivity',
    href: '/calculators/productivity',
    items: [
      { name: 'Word Counter', href: '/calculators/productivity/word-counter' },
      { name: 'Password Generator', href: '/calculators/productivity/password-generator' },
      { name: 'UUID Generator', href: '/calculators/productivity/uuid-generator' },
      { name: 'JSON Formatter', href: '/calculators/productivity/json-formatter' },
      { name: 'View All Productivity Tools', href: '/calculators/productivity' },
    ],
  },
  {
    name: 'Converters',
    href: '/convert',
    items: [
      { name: 'Length Converter', href: '/convert/meter-to-foot' },
      { name: 'Weight Converter', href: '/convert/kilogram-to-pound' },
      { name: 'Temperature Converter', href: '/convert/celsius-to-fahrenheit' },
      { name: 'Volume Converter', href: '/convert/liter-to-gallon' },
      { name: 'View All Converters', href: '/convert' },
    ],
  },
];

// Secondary categories shown in "More Tools" dropdown
const moreCategories: NavCategory[] = [
  {
    name: 'Academic',
    href: '/calculators/academic',
    items: [
      { name: 'GPA Calculator', href: '/calculators/academic/gpa-calculator' },
      { name: 'Final Grade Calculator', href: '/calculators/academic/final-grade-calculator' },
      { name: 'Fraction Calculator', href: '/calculators/academic/fraction-calculator' },
      { name: 'View All Academic Tools', href: '/calculators/academic' },
    ],
  },
  {
    name: 'Travel',
    href: '/calculators/travel',
    items: [
      { name: 'Schengen Visa Calculator', href: '/calculators/travel/schengen-calculator' },
      { name: 'Time Zone Meeting Planner', href: '/calculators/travel/timezone-planner' },
      { name: 'Currency Converter', href: '/calculators/travel/currency-converter' },
      { name: 'View All Travel Tools', href: '/calculators/travel' },
    ],
  },
  {
    name: 'Gaming',
    href: '/calculators/gaming',
    items: [
      { name: 'Mouse Sensitivity Converter', href: '/calculators/gaming/mouse-sensitivity-converter' },
      { name: 'Reaction Time Test', href: '/calculators/gaming/reaction-time-test' },
      { name: 'Pokemon Type Calculator', href: '/calculators/gaming/pokemon-type-calculator' },
      { name: 'View All Gaming Tools', href: '/calculators/gaming' },
    ],
  },
  {
    name: 'Audio & Music',
    href: '/calculators/audio',
    items: [
      { name: 'BPM Tapper', href: '/calculators/audio/bpm-tapper' },
      { name: 'Guitar Tuner', href: '/calculators/audio/guitar-tuner' },
      { name: 'Note to Frequency Converter', href: '/calculators/audio/note-frequency' },
      { name: 'View All Audio Tools', href: '/calculators/audio' },
    ],
  },
  {
    name: 'Photo & Video',
    href: '/calculators/photo',
    items: [
      { name: 'Depth of Field Calculator', href: '/calculators/photo/depth-of-field-calculator' },
      { name: 'Golden Hour Calculator', href: '/calculators/photo/golden-hour-calculator' },
      { name: 'Aspect Ratio Calculator', href: '/calculators/photo/aspect-ratio-calculator' },
      { name: 'View All Photo Tools', href: '/calculators/photo' },
    ],
  },
  {
    name: 'Electronics',
    href: '/calculators/electronics',
    items: [
      { name: 'Resistor Color Code Calculator', href: '/calculators/electronics/resistor-calculator' },
      { name: "Ohm's Law Calculator", href: '/calculators/electronics/ohms-law-calculator' },
      { name: 'LED Resistor Calculator', href: '/calculators/electronics/led-resistor' },
      { name: 'View All Electronics Tools', href: '/calculators/electronics' },
    ],
  },
  {
    name: 'Stats',
    href: '/calculators/stats',
    items: [
      { name: 'Standard Deviation Calculator', href: '/calculators/stats/standard-deviation-calculator' },
      { name: 'A/B Test Significance Calculator', href: '/calculators/stats/ab-test-calculator' },
      { name: 'Sample Size Calculator', href: '/calculators/stats/sample-size-calculator' },
      { name: 'View All Stats Tools', href: '/calculators/stats' },
    ],
  },
  {
    name: 'Time & Date',
    href: '/calculators/time',
    items: [
      { name: 'Business Days Calculator', href: '/calculators/time/business-days-calculator' },
      { name: 'Precise Age Calculator', href: '/calculators/time/precise-age-calculator' },
      { name: 'Week Number Calculator', href: '/calculators/time/week-number-calculator' },
      { name: 'View All Time Tools', href: '/calculators/time' },
    ],
  },
  {
    name: 'Physics',
    href: '/calculators/physics',
    items: [
      { name: 'Projectile Motion Calculator', href: '/calculators/physics/projectile-motion-calculator' },
      { name: 'Kinetic Energy Calculator', href: '/calculators/physics/kinetic-energy-calculator' },
      { name: 'Density Calculator', href: '/calculators/physics/density-calculator' },
      { name: 'View All Physics Tools', href: '/calculators/physics' },
    ],
  },
  {
    name: 'Construction',
    href: '/calculators/construction',
    items: [
      { name: 'Board Foot Calculator', href: '/calculators/construction/board-foot-calculator' },
      { name: 'Crown Molding Angle Calculator', href: '/calculators/construction/crown-molding-calculator' },
      { name: 'Concrete Slab Calculator', href: '/calculators/construction/concrete-slab-calculator' },
      { name: 'View All Construction Tools', href: '/calculators/construction' },
    ],
  },
  {
    name: 'Auto',
    href: '/calculators/auto',
    items: [
      { name: 'Tire Size Calculator', href: '/calculators/auto/tire-size-calculator' },
      { name: 'EV Charging Time Calculator', href: '/calculators/auto/ev-charging-calculator' },
      { name: 'Fuel Consumption Converter', href: '/calculators/auto/fuel-consumption-converter' },
      { name: 'View All Auto Tools', href: '/calculators/auto' },
    ],
  },
  {
    name: 'Crypto',
    href: '/calculators/crypto',
    items: [
      { name: 'Gas Fee Converter', href: '/calculators/crypto/gas-fee-converter' },
      { name: 'Ethereum Unit Converter', href: '/calculators/crypto/ethereum-unit-converter' },
      { name: 'Hash Generator', href: '/calculators/crypto/hash-generator' },
      { name: 'View All Crypto Tools', href: '/calculators/crypto' },
    ],
  },
  {
    name: 'Fun & Lifestyle',
    href: '/calculators/fun',
    items: [
      { name: 'Love Compatibility Test', href: '/calculators/fun/love-compatibility' },
      { name: 'Moon Phase Calculator', href: '/calculators/fun/moon-phase-calculator' },
      { name: 'Biorhythm Calculator', href: '/calculators/fun/biorhythm' },
      { name: 'View All Fun Tools', href: '/calculators/fun' },
    ],
  },
  {
    name: 'Crafts & Sewing',
    href: '/calculators/crafts',
    items: [
      { name: 'Circle Skirt Calculator', href: '/calculators/crafts/circle-skirt-calculator' },
      { name: 'Knitting Stitch Converter', href: '/calculators/crafts/knitting-stitch-converter' },
      { name: 'Fabric Yardage Calculator', href: '/calculators/crafts/fabric-yardage-calculator' },
      { name: 'View All Crafts Tools', href: '/calculators/crafts' },
    ],
  },
  {
    name: 'Garden',
    href: '/calculators/garden',
    items: [
      { name: 'Mulch & Soil Calculator', href: '/calculators/garden/mulch-soil-calculator' },
      { name: 'Plant Spacing Calculator', href: '/calculators/garden/plant-spacing-calculator' },
      { name: 'Hardiness Zone Finder', href: '/calculators/garden/hardiness-zone-finder' },
      { name: 'View All Garden Tools', href: '/calculators/garden' },
    ],
  },
  {
    name: 'RPG & Tabletop',
    href: '/calculators/rpg',
    items: [
      { name: 'Dice Roller', href: '/calculators/rpg/dice-roller' },
      { name: 'Fantasy Name Generator', href: '/calculators/rpg/fantasy-name-generator' },
      { name: 'Character Sheet Helper', href: '/calculators/rpg/character-sheet-helper' },
      { name: 'View All RPG Tools', href: '/calculators/rpg' },
    ],
  },
  {
    name: 'Betting',
    href: '/calculators/betting',
    items: [
      { name: 'Odds Converter', href: '/calculators/betting/odds-converter' },
      { name: 'Parlay Calculator', href: '/calculators/betting/parlay-calculator' },
      { name: 'Arbitrage Calculator', href: '/calculators/betting/arbitrage-calculator' },
      { name: 'View All Betting Tools', href: '/calculators/betting' },
    ],
  },
  {
    name: 'Creator',
    href: '/calculators/creator',
    items: [
      { name: 'Signature Generator', href: '/calculators/creator/signature-generator' },
      { name: 'WiFi QR Code Generator', href: '/calculators/creator/wifi-qr-generator' },
      { name: 'YouTube Money Calculator', href: '/calculators/creator/youtube-money-calculator' },
      { name: 'View All Creator Tools', href: '/calculators/creator' },
    ],
  },
  {
    name: 'Coffee & Barista',
    href: '/calculators/coffee',
    items: [
      { name: 'Extraction Yield Calculator', href: '/calculators/coffee/extraction-yield-calculator' },
      { name: 'Brew Ratio Calculator', href: '/calculators/coffee/brew-ratio-calculator' },
      { name: 'Espresso Dial-in Log', href: '/calculators/coffee/espresso-dial-in-log' },
      { name: 'View All Coffee Tools', href: '/calculators/coffee' },
    ],
  },
];

// All categories combined for mobile menu
const allCategories = [...primaryCategories, ...moreCategories];


export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { favorites, isLoaded } = useFavorites();

  const handleMouseEnter = useCallback((categoryName: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(categoryName);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            <Logo className="h-8 w-8" />
            <span>OmniTools</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </Button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-1">
          {/* Primary categories */}
          {primaryCategories.map((category) => (
            <div
              key={category.name}
              className="relative"
              onMouseEnter={() => handleMouseEnter(category.name)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={category.href}
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                {category.name}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${openDropdown === category.name ? 'rotate-180' : ''
                    }`}
                  aria-hidden="true"
                />
              </Link>

              {/* Dropdown menu */}
              {openDropdown === category.name && (
                <div
                  className="absolute left-0 top-full z-10 w-56 rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5"
                  onMouseEnter={() => handleMouseEnter(category.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  {category.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* More Tools dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('more')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              More Tools
              <ChevronDown
                className={`h-4 w-4 transition-transform ${openDropdown === 'more' ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            {/* Mega dropdown menu */}
            {openDropdown === 'more' && (
              <div
                className="absolute right-0 top-full z-10 w-[600px] rounded-md bg-white p-4 shadow-lg ring-1 ring-gray-900/5"
                onMouseEnter={() => handleMouseEnter('more')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="grid grid-cols-3 gap-4">
                  {moreCategories.map((category) => (
                    <div key={category.name}>
                      <Link
                        href={category.href}
                        className="font-medium text-gray-900 hover:text-blue-600 text-sm"
                      >
                        {category.name}
                      </Link>
                      <ul className="mt-1 space-y-1">
                        {category.items.slice(0, 3).map((item) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className="block text-xs text-gray-500 hover:text-gray-900"
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search and Favorites buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="relative text-gray-500 hover:text-red-500"
            aria-label="View favorites"
            onClick={() => setFavoritesOpen(true)}
          >
            <Heart className={`h-5 w-5 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : ''}`} aria-hidden="true" />
            {isLoaded && favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                {favorites.length > 9 ? '9+' : favorites.length}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-gray-500 hover:text-gray-700"
            aria-label="Search tools"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" aria-hidden="true" />
            <span className="hidden xl:inline">Search</span>
            <kbd className="hidden xl:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">Ctrl+</span>K
            </kbd>
          </Button>
        </div>
      </nav>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Favorites Dialog */}
      <FavoritesDialog open={favoritesOpen} onOpenChange={setFavoritesOpen} />

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden" id="mobile-menu">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {/* Mobile search */}
            <div className="mb-4 flex gap-2">
              <Button
                variant="outline"
                className="flex-1 justify-start gap-2 text-gray-500"
                aria-label="Search tools"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
              >
                <Search className="h-5 w-5" aria-hidden="true" />
                <span>Search tools...</span>
              </Button>
              <Button
                variant="outline"
                className="relative text-gray-500"
                aria-label="View favorites"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setFavoritesOpen(true);
                }}
              >
                <Heart className={`h-5 w-5 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : ''}`} aria-hidden="true" />
                {isLoaded && favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                    {favorites.length > 9 ? '9+' : favorites.length}
                  </span>
                )}
              </Button>
            </div>

            {/* Mobile category links */}
            {allCategories.map((category) => (
              <div key={category.name} className="border-b border-gray-100 pb-2">
                <Link
                  href={category.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
                <div className="ml-4 space-y-1">
                  {category.items.slice(0, 4).map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
