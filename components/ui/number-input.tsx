'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';
import { Label } from './label';

export interface NumberInputProps {
  id: string;
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      id,
      label,
      value,
      onChange,
      min,
      max,
      step = 1,
      unit,
      error,
      required = false,
      placeholder,
      className,
      disabled = false,
    },
    ref
  ) => {
    const errorId = error ? `${id}-error` : undefined;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (newValue === '' || newValue === '-') {
        onChange(0);
        return;
      }
      const parsed = parseFloat(newValue);
      if (!isNaN(parsed)) {
        onChange(parsed);
      }
    };

    return (
      <div className={cn('space-y-2', className)}>
        <Label
          htmlFor={id}
          className={cn(
            'block text-sm font-medium',
            error && 'text-destructive'
          )}
        >
          {label}
          {required && (
            <span className="text-destructive ml-1" aria-hidden="true">
              *
            </span>
          )}
        </Label>
        <div className="relative">
          <Input
            ref={ref}
            id={id}
            type="number"
            value={value}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={errorId}
            aria-required={required}
            className={cn(
              unit && 'pr-12',
              error && 'border-destructive focus-visible:ring-destructive'
            )}
          />
          {unit && (
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none"
              aria-hidden="true"
            >
              {unit}
            </span>
          )}
        </div>
        {error && (
          <p
            id={errorId}
            className="text-sm text-destructive"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
NumberInput.displayName = 'NumberInput';

export { NumberInput };
