'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Skip Link Component
 * Provides keyboard users a way to skip navigation and jump directly to main content.
 * Visible only when focused via keyboard navigation.
 * 
 * **Validates: Requirements 11.3, 11.5**
 */
const SkipLink = React.forwardRef<HTMLAnchorElement, SkipLinkProps>(
  ({ href = '#main-content', children = 'Skip to main content', className }, ref) => {
    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          // Visually hidden by default
          'sr-only',
          // Visible when focused
          'focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4',
          // Styling when visible
          'focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'focus:shadow-lg',
          className
        )}
      >
        {children}
      </a>
    );
  }
);
SkipLink.displayName = 'SkipLink';

export { SkipLink };
