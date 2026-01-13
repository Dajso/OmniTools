import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card';

export interface ToolCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

const ToolCard = React.forwardRef<HTMLDivElement, ToolCardProps>(
  ({ title, description, children, className }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          'w-full max-w-2xl mx-auto shadow-md hover:shadow-lg transition-shadow',
          className
        )}
      >
        <CardHeader className="pb-4">
          <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
          <CardDescription className="text-sm md:text-base">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">{children}</CardContent>
      </Card>
    );
  }
);
ToolCard.displayName = 'ToolCard';

export { ToolCard };
