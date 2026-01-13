'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface UnitToggleProps {
  value: 'imperial' | 'metric';
  onChange: (value: 'imperial' | 'metric') => void;
  labels?: { imperial: string; metric: string };
  className?: string;
  disabled?: boolean;
  id?: string;
}

const UnitToggle = React.forwardRef<HTMLDivElement, UnitToggleProps>(
  (
    {
      value,
      onChange,
      labels = { imperial: 'Imperial', metric: 'Metric' },
      className,
      disabled = false,
      id,
    },
    ref
  ) => {
    const toggleId = id || 'unit-toggle';

    const handleToggle = () => {
      if (disabled) return;
      onChange(value === 'imperial' ? 'metric' : 'imperial');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      }
    };

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center gap-2', className)}
      >
        <span
          className={cn(
            'text-sm font-medium transition-colors',
            value === 'imperial' ? 'text-foreground' : 'text-muted-foreground'
          )}
          id={`${toggleId}-imperial-label`}
        >
          {labels.imperial}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={value === 'metric'}
          aria-labelledby={`${toggleId}-imperial-label ${toggleId}-metric-label`}
          disabled={disabled}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className={cn(
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:cursor-not-allowed disabled:opacity-50',
            value === 'metric' ? 'bg-primary' : 'bg-input'
          )}
        >
          <span
            className={cn(
              'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
              value === 'metric' ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>
        <span
          className={cn(
            'text-sm font-medium transition-colors',
            value === 'metric' ? 'text-foreground' : 'text-muted-foreground'
          )}
          id={`${toggleId}-metric-label`}
        >
          {labels.metric}
        </span>
      </div>
    );
  }
);
UnitToggle.displayName = 'UnitToggle';

export { UnitToggle };
