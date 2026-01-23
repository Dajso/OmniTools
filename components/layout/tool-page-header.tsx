'use client';

import { getToolIcon } from '@/lib/constants/tool-icons';
import { getToolById } from '@/lib/constants/tool-registry';
import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import { FavoriteButton } from '@/components/ui/favorite-button';

interface ToolPageHeaderProps {
  toolId: string;
  title: string;
  description: string;
  colorClass?: string;
  category?: string;
  showFavorite?: boolean;
}

// Category display names and paths
const categoryConfig: Record<string, { label: string; href: string }> = {
  // Calculators categories
  academic: { label: 'Academic', href: '/calculators/academic' },
  audio: { label: 'Audio', href: '/calculators/audio' },
  auto: { label: 'Auto', href: '/calculators/auto' },
  betting: { label: 'Betting', href: '/calculators/betting' },
  coffee: { label: 'Coffee & Barista', href: '/calculators/coffee' },
  construction: { label: 'Construction', href: '/calculators/construction' },
  crafts: { label: 'Crafts', href: '/calculators/crafts' },
  creator: { label: 'Creator', href: '/calculators/creator' },
  crypto: { label: 'Crypto', href: '/calculators/crypto' },
  electronics: { label: 'Electronics', href: '/calculators/electronics' },
  finance: { label: 'Finance', href: '/calculators/finance' },
  fun: { label: 'Fun', href: '/calculators/fun' },
  gaming: { label: 'Gaming', href: '/calculators/gaming' },
  garden: { label: 'Garden', href: '/calculators/garden' },
  health: { label: 'Health', href: '/calculators/health' },
  home: { label: 'Home', href: '/calculators/home' },
  photo: { label: 'Photo', href: '/calculators/photo' },
  photography: { label: 'Photography', href: '/calculators/photo' }, // alias for photo
  physics: { label: 'Physics', href: '/calculators/physics' },
  productivity: { label: 'Productivity', href: '/calculators/productivity' },
  rpg: { label: 'RPG', href: '/calculators/rpg' },
  stats: { label: 'Statistics', href: '/calculators/stats' },
  statistics: { label: 'Statistics', href: '/calculators/stats' }, // alias for stats
  time: { label: 'Time', href: '/calculators/time' },
  'time & date': { label: 'Time & Date', href: '/calculators/time' }, // alias for time
  travel: { label: 'Travel', href: '/calculators/travel' },
  // Other categories
  converter: { label: 'Converters', href: '/convert' },
};

/**
 * Shared header component for tool detail pages
 * Displays breadcrumb, tool icon, title, and description
 */
export function ToolPageHeader({
  toolId,
  title,
  description,
  colorClass = 'bg-primary/10 text-primary',
  category,
  showFavorite = true,
}: ToolPageHeaderProps) {
  const Icon = getToolIcon(toolId);
  const tool = getToolById(toolId);
  const categoryKey = category?.toLowerCase() || tool?.category || 'tool';
  const categoryInfo = categoryConfig[categoryKey];

  // Build breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [];
  if (categoryInfo) {
    breadcrumbItems.push({ label: categoryInfo.label, href: categoryInfo.href });
  }
  breadcrumbItems.push({ label: title });

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className={`p-3 rounded-xl ${colorClass}`}>
            <Icon className="h-8 w-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold flex-1">{title}</h1>
          {showFavorite && <FavoriteButton toolId={toolId} size="md" />}
        </div>
        <p className="text-muted-foreground">{description}</p>
      </header>
    </>
  );
}
