'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Menu, X, Search, ChevronDown, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { SearchDialog } from './search-dialog';
import { FavoritesDialog } from './favorites-dialog';
import { useFavorites } from '@/lib/hooks/use-favorites';
import { categoryConfig } from '@/lib/constants/category-config';
import { getToolsByCategory, ToolDefinition } from '@/lib/constants/tool-registry';

interface NavCategory {
  name: string;
  href: string;
  items: { name: string; href: string }[];
}

// Kategorier som vises direkte i menylinjen (resten ligger under «Flere verktøy»)
const PRIMARY_CATEGORY_IDS: ToolDefinition['category'][] = [
  'finance',
  'home',
  'health',
  'auto',
  'solar',
  'converter',
];

/**
 * Menyen bygges fra verktøyregisteret og kategorikonfigurasjonen, slik at
 * den alltid stemmer med hvilke verktøy som faktisk finnes.
 * Utvalgte (featured) verktøy vises først i hver kategori.
 */
function buildNavCategory(id: ToolDefinition['category'], maxItems: number): NavCategory | null {
  const config = categoryConfig[id];
  if (!config) return null;
  const tools = [...getToolsByCategory(id)].sort(
    (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
  );
  return {
    name: config.name,
    href: config.href,
    items: tools.slice(0, maxItems).map((tool) => ({ name: tool.name, href: tool.path })),
  };
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { favorites, isLoaded } = useFavorites();

  const { primaryCategories, moreCategories } = useMemo(() => {
    const primary = PRIMARY_CATEGORY_IDS.map((id) => buildNavCategory(id, 4)).filter(
      (c): c is NavCategory => c !== null
    );
    const more = (Object.keys(categoryConfig) as ToolDefinition['category'][])
      .filter((id) => !PRIMARY_CATEGORY_IDS.includes(id))
      .map((id) => buildNavCategory(id, 3))
      .filter((c): c is NavCategory => c !== null);
    return { primaryCategories: primary, moreCategories: more };
  }, []);

  const allCategories = useMemo(
    () => [...primaryCategories, ...moreCategories],
    [primaryCategories, moreCategories]
  );

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
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Hovedmeny">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2 font-display text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors">
            <Logo className="h-8 w-8" />
            <span>Kalkulator</span>
          </Link>
        </div>

        {/* Mobilmeny-knapp */}
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Lukk meny' : 'Åpne meny'}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </Button>
        </div>

        {/* Navigasjon på stor skjerm */}
        <div className="hidden lg:flex lg:gap-x-1">
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
                  className={`h-4 w-4 transition-transform ${openDropdown === category.name ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </Link>

              {/* Nedtrekksmeny */}
              {openDropdown === category.name && (
                <div
                  className="absolute left-0 top-full z-10 w-64 rounded-lg bg-white py-2 shadow-lg ring-1 ring-gray-900/5"
                  onMouseEnter={() => handleMouseEnter(category.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  {category.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link
                    href={category.href}
                    className="mt-1 block border-t border-gray-100 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-100"
                  >
                    Se alle i {category.name.toLowerCase()}
                  </Link>
                </div>
              )}
            </div>
          ))}

          {/* «Flere verktøy» */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('more')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              Flere verktøy
              <ChevronDown
                className={`h-4 w-4 transition-transform ${openDropdown === 'more' ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            {openDropdown === 'more' && (
              <div
                className="absolute right-0 top-full z-10 max-h-[75vh] w-[800px] overflow-y-auto rounded-lg bg-white p-4 shadow-lg ring-1 ring-gray-900/5"
                onMouseEnter={() => handleMouseEnter('more')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="grid grid-cols-4 gap-4">
                  {moreCategories.map((category) => (
                    <div key={category.name}>
                      <Link
                        href={category.href}
                        className="font-medium text-gray-900 hover:text-blue-600 text-sm"
                      >
                        {category.name}
                      </Link>
                      <ul className="mt-1 space-y-1">
                        {category.items.map((item) => (
                          <li key={item.href}>
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

        {/* Søk og favoritter */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="relative text-gray-500 hover:text-blue-600"
            aria-label="Vis favoritter"
            onClick={() => setFavoritesOpen(true)}
          >
            <Heart className={`h-5 w-5 ${favorites.length > 0 ? 'fill-blue-600 text-blue-600' : ''}`} aria-hidden="true" />
            {isLoaded && favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-medium text-white">
                {favorites.length > 9 ? '9+' : favorites.length}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-gray-500 hover:text-gray-700"
            aria-label="Søk i verktøy"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" aria-hidden="true" />
            <span className="hidden xl:inline">Søk</span>
            <kbd className="hidden xl:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">Ctrl+</span>K
            </kbd>
          </Button>
        </div>
      </nav>

      {/* Søkedialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Favorittdialog */}
      <FavoritesDialog open={favoritesOpen} onOpenChange={setFavoritesOpen} />

      {/* Mobilmeny */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto" id="mobile-menu">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {/* Søk på mobil */}
            <div className="mb-4 flex gap-2">
              <Button
                variant="outline"
                className="flex-1 justify-start gap-2 text-gray-500"
                aria-label="Søk i verktøy"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
              >
                <Search className="h-5 w-5" aria-hidden="true" />
                <span>Søk i verktøy …</span>
              </Button>
              <Button
                variant="outline"
                className="relative text-gray-500"
                aria-label="Vis favoritter"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setFavoritesOpen(true);
                }}
              >
                <Heart className={`h-5 w-5 ${favorites.length > 0 ? 'fill-blue-600 text-blue-600' : ''}`} aria-hidden="true" />
                {isLoaded && favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-medium text-white">
                    {favorites.length > 9 ? '9+' : favorites.length}
                  </span>
                )}
              </Button>
            </div>

            {/* Kategorier */}
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
                      key={item.href}
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
