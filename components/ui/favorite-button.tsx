'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/lib/hooks/use-favorites';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  toolId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FavoriteButton({ toolId, className, size = 'md' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites();
  const favorited = isFavorite(toolId);

  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-10 w-10',
  };

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  if (!isLoaded) {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-full border border-gray-200 bg-white transition-all',
          sizeClasses[size],
          className
        )}
        disabled
      >
        <Heart className={cn(iconSizes[size], 'text-gray-300')} />
      </button>
    );
  }

  return (
    <button
      onClick={() => toggleFavorite(toolId)}
      className={cn(
        'inline-flex items-center justify-center rounded-full border transition-all',
        favorited
          ? 'border-red-200 bg-red-50 hover:bg-red-100'
          : 'border-gray-200 bg-white hover:border-red-200 hover:bg-red-50',
        sizeClasses[size],
        className
      )}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={cn(
          iconSizes[size],
          'transition-colors',
          favorited ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'
        )}
      />
    </button>
  );
}
