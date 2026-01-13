'use client';

import { Heart, X, ChevronRight, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useFavorites } from '@/lib/hooks/use-favorites';
import { toolRegistry } from '@/lib/constants/tool-registry';
import { getToolIcon } from '@/lib/constants/tool-icons';

interface FavoritesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FavoritesDialog({ open, onOpenChange }: FavoritesDialogProps) {
  const { favorites, isLoaded, removeFavorite } = useFavorites();

  if (!open) return null;

  // 获取收藏的工具详情
  const favoriteTools = favorites
    .map((id) => toolRegistry[id])
    .filter(Boolean);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog */}
      <div className="fixed right-4 top-16 w-full max-w-sm z-50">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              <span className="font-medium text-gray-900">My Favorites</span>
              <span className="text-xs text-gray-500">({favoriteTools.length})</span>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto">
            {!isLoaded ? (
              <div className="py-8 text-center text-sm text-gray-500">
                Loading...
              </div>
            ) : favoriteTools.length === 0 ? (
              <div className="py-8 text-center">
                <Heart className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No favorites yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Click the heart icon on any tool to save it here
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {favoriteTools.map((tool) => {
                  const Icon = getToolIcon(tool.id);
                  return (
                    <div
                      key={tool.id}
                      className="group flex items-center gap-2 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <Link
                        href={tool.path}
                        onClick={() => onOpenChange(false)}
                        className="flex items-center gap-2.5 flex-1 p-2 min-w-0"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 flex-shrink-0">
                          <Icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {tool.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {tool.category}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 flex-shrink-0" />
                      </Link>
                      <button
                        onClick={() => removeFavorite(tool.id)}
                        className="p-2 rounded-md hover:bg-red-50 transition-colors flex-shrink-0"
                        title="Remove from favorites"
                      >
                        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {favoriteTools.length > 0 && (
            <div className="border-t px-4 py-2 text-center">
              <Link
                href="/#favorites"
                onClick={() => onOpenChange(false)}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                View on homepage
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
