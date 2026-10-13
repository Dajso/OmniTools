'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Copy, Check } from 'lucide-react';

export interface ResultDisplayProps {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
  copyable?: boolean;
  className?: string;
}

const ResultDisplay = React.forwardRef<HTMLDivElement, ResultDisplayProps>(
  (
    {
      label,
      value,
      unit,
      highlight = false,
      copyable = false,
      className,
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false);

    const displayValue = typeof value === 'number' 
      ? value.toLocaleString('en-US', { maximumFractionDigits: 2 })
      : value;

    const copyValue = unit ? `${displayValue} ${unit}` : displayValue;

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(String(copyValue));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border p-4 transition-colors',
          highlight
            ? 'border-primary bg-primary/5'
            : 'border-border bg-muted/50',
          className
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p
              className={cn(
                'font-semibold truncate',
                highlight ? 'text-2xl text-primary' : 'text-xl text-foreground'
              )}
            >
              {displayValue}
              {unit && (
                <span className="ml-1 text-base font-normal text-muted-foreground">
                  {unit}
                </span>
              )}
            </p>
          </div>
          {copyable && (
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                'shrink-0 p-2 rounded-md transition-colors',
                'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                copied && 'text-green-600'
              )}
              aria-label={copied ? 'Kopiert!' : `Kopier ${label}`}
            >
              {copied ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }
);
ResultDisplay.displayName = 'ResultDisplay';

export { ResultDisplay };
