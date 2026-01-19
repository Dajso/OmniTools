'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * Configuration for a single input field
 */
export interface InputConfig {
  id: string;
  label: string;
  type: 'number' | 'select' | 'date' | 'text';
  options?: { value: string; label: string }[];
  defaultValue?: string | number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
  required?: boolean;
}

/**
 * Result of a calculation
 */
export interface CalculationResult {
  primary: { label: string; value: string | number; unit?: string };
  secondary?: { label: string; value: string | number; unit?: string }[];
  breakdown?: { label: string; value: string | number }[];
}

/**
 * Props for the CalculatorTemplate component
 */
export interface CalculatorTemplateProps {
  /** Calculator title */
  title: string;
  /** Calculator description */
  description: string;
  /** Input field configurations */
  inputs: InputConfig[];
  /** Calculation function */
  calculate: (values: Record<string, number | string>) => CalculationResult;
  /** Optional formula display */
  formula?: string;
  /** Optional formula explanation */
  formulaExplanation?: string;
  /** Additional CSS classes */
  className?: string;
}


/**
 * Renders a single input field based on its configuration
 */
function InputField({
  config,
  value,
  onChange,
}: {
  config: InputConfig;
  value: string | number;
  onChange: (value: string | number) => void;
}) {
  const inputId = `input-${config.id}`;

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>
        {config.label}
        {config.unit && <span className="text-muted-foreground ml-1">({config.unit})</span>}
      </Label>
      
      {config.type === 'select' && config.options ? (
        <Select
          id={inputId}
          options={config.options}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : config.type === 'number' ? (
        <Input
          id={inputId}
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.valueAsNumber || 0)}
          min={config.min}
          max={config.max}
          step={config.step}
          placeholder={config.placeholder}
          required={config.required}
        />
      ) : config.type === 'date' ? (
        <Input
          id={inputId}
          type="date"
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          required={config.required}
        />
      ) : (
        <Input
          id={inputId}
          type="text"
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={config.placeholder}
          required={config.required}
        />
      )}
    </div>
  );
}

/**
 * Displays the calculation result
 */
function ResultDisplay({ result }: { result: CalculationResult }) {
  return (
    <div className="space-y-4">
      {/* Primary result */}
      <div className="bg-primary/10 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">{result.primary.label}</p>
        <p className="text-2xl font-bold">
          {result.primary.value}
          {result.primary.unit && (
            <span className="text-lg font-normal text-muted-foreground ml-1">
              {result.primary.unit}
            </span>
          )}
        </p>
      </div>

      {/* Secondary results */}
      {result.secondary && result.secondary.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {result.secondary.map((item, index) => (
            <div key={index} className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-lg font-semibold">
                {item.value}
                {item.unit && (
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    {item.unit}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Breakdown */}
      {result.breakdown && result.breakdown.length > 0 && (
        <div className="border-t pt-3">
          <p className="text-sm font-medium text-muted-foreground mb-2">Breakdown</p>
          <div className="space-y-1">
            {result.breakdown.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
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
    <div className="bg-muted/50 rounded-lg p-4">
      <p className="text-sm font-medium text-muted-foreground mb-2">Formula</p>
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
 * Calculator Template - A reusable template for input-compute-output calculators
 * 
 * Features:
 * - Dynamic input field generation based on configuration
 * - Automatic state management for inputs
 * - Consistent result display with primary, secondary, and breakdown sections
 * - Formula display support
 * - Calculate and reset functionality
 * 
 * @example
 * ```tsx
 * <CalculatorTemplate
 *   title="Simple Interest Calculator"
 *   description="Calculate simple interest on your investment"
 *   inputs={[
 *     { id: 'principal', label: 'Principal', type: 'number', defaultValue: 1000 },
 *     { id: 'rate', label: 'Interest Rate', type: 'number', unit: '%', step: 0.1 },
 *     { id: 'time', label: 'Time', type: 'number', unit: 'years' },
 *   ]}
 *   calculate={(values) => ({
 *     primary: { label: 'Interest', value: values.principal * values.rate * values.time / 100, unit: '$' }
 *   })}
 *   formula="I = P × R × T"
 * />
 * ```
 */
export function CalculatorTemplate({
  title,
  description,
  inputs,
  calculate,
  formula,
  formulaExplanation,
  className,
}: CalculatorTemplateProps) {
  // Initialize state with default values from input configs
  const getInitialValues = React.useCallback(() => {
    const initial: Record<string, string | number> = {};
    inputs.forEach((input) => {
      initial[input.id] = input.defaultValue ?? (input.type === 'number' ? 0 : '');
    });
    return initial;
  }, [inputs]);

  const [values, setValues] = React.useState<Record<string, string | number>>(getInitialValues);
  const [result, setResult] = React.useState<CalculationResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isCalculating, setIsCalculating] = React.useState(false);

  const handleValueChange = (id: string, value: string | number) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    // Clear result when inputs change
    setResult(null);
    setError(null);
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setError(null);
    
    try {
      const calculationResult = calculate(values);
      setResult(calculationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
      setResult(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setValues(getInitialValues());
    setResult(null);
    setError(null);
  };

  return (
    <Card className={cn('w-full max-w-2xl', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Input fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          {inputs.map((input) => (
            <InputField
              key={input.id}
              config={input}
              value={values[input.id]}
              onChange={(value) => handleValueChange(input.id, value)}
            />
          ))}
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
          <FormulaDisplay formula={formula} explanation={formulaExplanation} />
        )}

        {/* Results section */}
        {result && (
          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">Results</p>
            <ResultDisplay result={result} />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button onClick={handleCalculate} loading={isCalculating}>
          Calculate
        </Button>
        <Button variant="outline" onClick={handleReset} disabled={isCalculating}>
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CalculatorTemplate;
