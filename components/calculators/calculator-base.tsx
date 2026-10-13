'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Props for the CalculatorBase component
 */
export interface CalculatorBaseProps {
  /** Calculator title */
  title: string;
  /** Calculator description */
  description?: string;
  /** Formula display (e.g., "P × (r(1+r)^n) / ((1+r)^n - 1)") */
  formula?: string;
  /** Formula explanation text */
  formulaExplanation?: string;
  /** Whether the calculate button should be disabled */
  isCalculateDisabled?: boolean;
  /** Whether calculation is in progress */
  isCalculating?: boolean;
  /** Callback when calculate button is clicked */
  onCalculate?: () => void;
  /** Callback when reset button is clicked */
  onReset?: () => void;
  /** Input fields section */
  children: React.ReactNode;
  /** Results section (rendered after inputs) */
  results?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Error message to display */
  error?: string;
}

/**
 * Error boundary for calculator components
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class CalculatorErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Card className="border-destructive">
          <CardContent className="p-6">
            <div className="text-destructive" role="alert">
              <p className="font-semibold">Noe gikk galt</p>
              <p className="text-sm text-muted-foreground mt-1">
                {this.state.error?.message || 'Det oppstod en uventet feil'}
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

/**
 * Formula display component
 */
function FormulaDisplay({ 
  formula, 
  explanation 
}: { 
  formula: string; 
  explanation?: string;
}) {
  return (
    <div className="bg-muted/50 rounded-lg p-4 mt-4">
      <p className="text-sm font-medium text-muted-foreground mb-2">Formel</p>
      <code className="text-sm font-mono bg-background px-2 py-1 rounded">
        {formula}
      </code>
      {explanation && (
        <p className="text-xs text-muted-foreground mt-2">{explanation}</p>
      )}
    </div>
  );
}

/**
 * Live region for announcing errors to screen readers
 */
function LiveRegion({ message }: { message?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

/**
 * Base component for all calculators providing consistent layout and behavior
 * 
 * Features:
 * - Consistent card-based layout
 * - Formula display section
 * - Error boundary wrapper
 * - Calculate and reset buttons
 * - Accessible error announcements
 * 
 * @example
 * ```tsx
 * <CalculatorBase
 *   title="Mortgage Calculator"
 *   description="Calculate your monthly mortgage payment"
 *   formula="M = P × (r(1+r)^n) / ((1+r)^n - 1)"
 *   onCalculate={handleCalculate}
 *   onReset={handleReset}
 *   results={<ResultDisplay label="Monthly Payment" value={result} />}
 * >
 *   <NumberInput label="Principal" value={principal} onChange={setPrincipal} />
 *   <NumberInput label="Interest Rate" value={rate} onChange={setRate} />
 * </CalculatorBase>
 * ```
 */
export function CalculatorBase({
  title,
  description,
  formula,
  formulaExplanation,
  isCalculateDisabled = false,
  isCalculating = false,
  onCalculate,
  onReset,
  children,
  results,
  className,
  error,
}: CalculatorBaseProps) {
  return (
    <CalculatorErrorBoundary>
      <Card className={cn('w-full max-w-2xl', className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Input fields */}
          <div className="space-y-4">
            {children}
          </div>

          {/* Error display */}
          {error && (
            <div 
              className="text-sm text-destructive bg-destructive/10 p-3 rounded-md"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}

          {/* Formula display */}
          {formula && (
            <FormulaDisplay 
              formula={formula} 
              explanation={formulaExplanation} 
            />
          )}

          {/* Results section */}
          {results && (
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Resultater</p>
              {results}
            </div>
          )}
        </CardContent>

        {/* Action buttons */}
        {(onCalculate || onReset) && (
          <CardFooter className="flex gap-2">
            {onCalculate && (
              <Button
                onClick={onCalculate}
                disabled={isCalculateDisabled}
                loading={isCalculating}
              >
                Beregn
              </Button>
            )}
            {onReset && (
              <Button
                variant="outline"
                onClick={onReset}
                disabled={isCalculating}
              >
                Nullstill
              </Button>
            )}
          </CardFooter>
        )}

        {/* Screen reader announcements */}
        <LiveRegion message={error} />
      </Card>
    </CalculatorErrorBoundary>
  );
}

export { CalculatorErrorBoundary };
