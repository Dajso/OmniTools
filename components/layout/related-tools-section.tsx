'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export interface RelatedTool {
  href: string;
  title: string;
  description: string;
}

interface RelatedToolsSectionProps {
  tools: RelatedTool[];
  title?: string;
}

/**
 * Delt seksjon for relaterte verktøy på verktøysidene
 */
export function RelatedToolsSection({ tools, title = 'Relaterte verktøy' }: RelatedToolsSectionProps) {
  if (tools.length === 0) return null;

  return (
    <section className="mt-10" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tools.map((tool, index) => (
          <Link key={index} href={tool.href}>
            <Card className="h-full hover:bg-muted/50 hover:border-primary/50 transition-colors group">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
