/**
 * Unit Toggle Component
 * 
 * Reusable toggle button for switching between metric and imperial units
 * 
 * @module components/ui/unit-toggle
 */

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { UnitSystem } from '@/lib/conversions/coffee-units';

export interface UnitToggleProps {
  /**
   * Current unit system
   */
  value: UnitSystem;
  
  /**
   * Callback when unit system changes
   */
  onChange: (system: UnitSystem) => void;
  
  /**
   * Optional className for styling
   */
  className?: string;
}

/**
 * Unit toggle component for switching between metric and imperial units
 */
export function UnitToggle({ value, onChange, className }: UnitToggleProps) {
  return (
    <div className={`flex items-center justify-end gap-2 ${className || ''}`}>
      <span className="text-sm text-muted-foreground">Units:</span>
      <Button
        type="button"
        variant={value === 'metric' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('metric')}
        aria-pressed={value === 'metric'}
        aria-label="Use metric units"
      >
        Metric
      </Button>
      <Button
        type="button"
        variant={value === 'imperial' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('imperial')}
        aria-pressed={value === 'imperial'}
        aria-label="Use imperial units"
      >
        Imperial
      </Button>
    </div>
  );
}
