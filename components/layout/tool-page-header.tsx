'use client';

import { getToolIcon } from '@/lib/constants/tool-icons';
import { getToolById } from '@/lib/constants/tool-registry';
import { getCategoryConfig } from '@/lib/constants/category-config';
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

/**
 * Felles topptekst for verktøysidene
 * Viser brødsmulesti, ikon, tittel og beskrivelse
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
  // Kategorien hentes fra registeret, slik at navn og lenke alltid er norske og riktige
  const categoryInfo = tool ? getCategoryConfig(tool.category) : undefined;

  // Build breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [];
  if (categoryInfo) {
    breadcrumbItems.push({ label: categoryInfo.name, href: categoryInfo.href });
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
