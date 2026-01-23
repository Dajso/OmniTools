'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getToolById } from '@/lib/constants/tool-registry';
import { getToolIcon } from '@/lib/constants/tool-icons';
import { getCategoryConfig } from '@/lib/constants/category-config';

interface RelatedToolsProps {
  /** Array of related tool IDs */
  toolIds: string[];
  /** Optional title for the section */
  title?: string;
}

/**
 * Related Tools Component
 * 
 * Displays a list of related calculators with links to navigate between them.
 * Used on calculator pages to help users discover related tools.
 * 
 * Features:
 * - Displays related tools with icons and descriptions
 * - Links to related calculator pages
 * - Responsive grid layout
 * - Accessible navigation
 * 
 * @example
 * ```tsx
 * <RelatedTools 
 *   toolIds={['brew-ratio-calculator', 'iced-coffee-dilution-calculator']}
 *   title="Related Coffee Tools"
 * />
 * ```
 * 
 * @see Requirements 11.5
 */
export function RelatedTools({ toolIds, title = 'Related Tools' }: RelatedToolsProps) {
  // Filter out invalid tool IDs and get tool definitions
  const relatedTools = toolIds
    .map(id => getToolById(id))
    .filter((tool): tool is NonNullable<typeof tool> => tool !== undefined);

  if (relatedTools.length === 0) {
    return null;
  }

  // Get category config for styling (use first tool's category)
  const firstTool = relatedTools[0];
  const category = getCategoryConfig(firstTool.category);

  if (!category) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatedTools.map((tool) => {
          const ToolIcon = getToolIcon(tool.id);
          
          return (
            <Link
              key={tool.id}
              href={tool.path}
              className={`group flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 hover:shadow-md hover:ring-2 transition-all ${category.hoverColor}`}
              aria-label={`Navigate to ${tool.name}`}
            >
              <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${category.color}`}>
                <ToolIcon className={`h-6 w-6 ${category.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{tool.description}</p>
                <div className={`mt-2 inline-flex items-center text-sm ${category.iconColor}`}>
                  View Tool <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default RelatedTools;
