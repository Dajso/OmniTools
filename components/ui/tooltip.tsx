'use client';

import * as React from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Simple Tooltip Component
 * 
 * Displays explanatory text on hover/focus for technical terms.
 * Uses native HTML title attribute for accessibility and simplicity.
 * 
 * Features:
 * - Hover and focus support
 * - Keyboard accessible
 * - Screen reader compatible
 * - No external dependencies
 * 
 * @param content - The tooltip text to display
 * @param children - Optional custom trigger element (defaults to Info icon)
 * @param className - Optional CSS classes for the trigger element
 */
export function Tooltip({ content, children, className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        className={`inline-flex items-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded ${className}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        aria-label={content}
        title={content}
      >
        {children || <Info className="h-4 w-4" aria-hidden="true" />}
      </button>
      
      {isVisible && (
        <span
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded-md shadow-lg whitespace-nowrap pointer-events-none"
        >
          {content}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
        </span>
      )}
    </span>
  );
}

/**
 * Inline Tooltip Component
 * 
 * Wraps text with a dotted underline and shows tooltip on hover.
 * Useful for inline technical term explanations.
 * 
 * @param term - The term to display with underline
 * @param explanation - The tooltip explanation text
 */
export function InlineTooltip({ term, explanation }: { term: string; explanation: string }) {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <span className="relative inline-flex items-baseline">
      <span
        className="border-b border-dotted border-muted-foreground cursor-help"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        tabIndex={0}
        role="button"
        aria-label={`${term}: ${explanation}`}
        title={explanation}
      >
        {term}
      </span>
      
      {isVisible && (
        <span
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded-md shadow-lg max-w-xs pointer-events-none"
        >
          {explanation}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
        </span>
      )}
    </span>
  );
}
