'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Select } from './select';
import { Label } from './label';

export interface SelectInputProps {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  error?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  (
    {
      id,
      label,
      value,
      onChange,
      options,
      error,
      required = false,
      placeholder,
      className,
      disabled = false,
    },
    ref
  ) => {
    const errorId = error ? `${id}-error` : undefined;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value);
    };

    // Add placeholder option if provided
    const selectOptions = placeholder
      ? [{ value: '', label: placeholder }, ...options]
      : options;

    return (
      <div className={cn('space-y-2', className)}>
        {label && (
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
        )}
        <Select
          ref={ref}
          id={id}
          value={value}
          onChange={handleChange}
          options={selectOptions}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId}
          aria-required={required}
          className={cn(
            error && 'border-destructive focus-visible:ring-destructive'
          )}
        />
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
SelectInput.displayName = 'SelectInput';

export { SelectInput };
