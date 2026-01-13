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

const categories: NavCategory[] = [
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
];

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
          {categories.map((category) => (
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
                  className={`h-4 w-4 transition-transform ${
                    openDropdown === category.name ? 'rotate-180' : ''
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
            {categories.map((category) => (
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
