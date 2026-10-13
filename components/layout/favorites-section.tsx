'use client';

import Link from 'next/link';
import { Heart, ChevronRight, X } from 'lucide-react';
import { useFavorites } from '@/lib/hooks/use-favorites';
import { toolRegistry } from '@/lib/constants/tool-registry';
import { getToolIcon } from '@/lib/constants/tool-icons';

export function FavoritesSection() {
  const { favorites, isLoaded, removeFavorite } = useFavorites();

  // Vis ingenting mens favorittene lastes eller hvis det ikke finnes noen
  if (!isLoaded || favorites.length === 0) {
    return null;
  }

  // Hent verktøyene som er lagret som favoritter
  const favoriteTools = favorites
    .map((id) => toolRegistry[id])
    .filter(Boolean)
    .slice(0, 6);

  if (favoriteTools.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-12 sm:py-16 border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200 mb-3">
            <Heart className="h-3 w-3 fill-blue-600 text-blue-600" />
            Mine favoritter
          </div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dine favorittverktøy</h2>
          <p className="mt-2 text-gray-600 text-sm">Rask tilgang til verktøyene du har lagret</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteTools.map((tool) => {
            const Icon = getToolIcon(tool.id);
            return (
              <div
                key={tool.id}
                className="group relative flex items-center gap-3 rounded-lg bg-gray-50/80 p-3.5 ring-1 ring-gray-100 hover:ring-blue-200 transition-all"
              >
                <Link
                  href={tool.path}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-gray-100 group-hover:ring-blue-200 transition-all">
                    <Icon className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">{tool.description}</p>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFavorite(tool.id);
                  }}
                  className="flex-shrink-0 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  title="Fjern fra favoritter"
                  aria-label="Fjern fra favoritter"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-blue-600" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
