import * as React from 'react';
import { cn } from '@/lib/utils';

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

/**
 * Visually Hidden Component
 * Hides content visually while keeping it accessible to screen readers.
 * Use for providing additional context to assistive technology users.
 * 
 * **Validates: Requirements 11.4**
 */
const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('sr-only', className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);
VisuallyHidden.displayName = 'VisuallyHidden';

export { VisuallyHidden };
