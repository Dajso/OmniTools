'use client';

import { useState, useCallback, useEffect } from 'react';
import { z, ZodSchema, ZodError } from 'zod';

/**
 * Validation result type for calculator inputs
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

/**
 * Options for the useCalculator hook
 */
export interface UseCalculatorOptions<TInputs extends Record<string, unknown>, TResults> {
  /** Initial input values */
  initialInputs: TInputs;
  /** Zod schema for input validation */
  schema: ZodSchema<TInputs>;
  /** Calculation function that takes validated inputs and returns results */
  calculate: (inputs: TInputs) => TResults;
  /** Optional storage key for session persistence */
  storageKey?: string;
}

/**
 * Return type for the useCalculator hook
 */
export interface UseCalculatorReturn<TInputs extends Record<string, unknown>, TResults> {
  /** Current input values */
  inputs: TInputs;
  /** Set a single input value */
  setInput: <K extends keyof TInputs>(key: K, value: TInputs[K]) => void;
  /** Set multiple input values at once */
  setInputs: (updates: Partial<TInputs>) => void;
  /** Calculation results (null if not calculated yet) */
  results: TResults | null;
  /** Validation errors by field */
  errors: Partial<Record<keyof TInputs, string>>;
  /** Whether all inputs are valid */
  isValid: boolean;
  /** Trigger calculation */
  calculate: () => void;
  /** Reset all inputs and results */
  reset: () => void;
  /** Whether calculation is in progress */
  isCalculating: boolean;
}

/**
 * Validates inputs against a Zod schema
 */
function validateInputs<T>(
  inputs: unknown,
  schema: ZodSchema<T>
): ValidationResult<T> {
  try {
    const data = schema.parse(inputs);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string> = {};
      for (const issue of error.issues) {
        const path = issue.path.join('.');
        if (path && !errors[path]) {
          errors[path] = issue.message;
        }
      }
      return { success: false, errors };
    }
    return { success: false, errors: { _form: 'Validation failed' } };
  }
}

/**
 * Custom hook for managing calculator state with validation
 * 
 * Features:
 * - State management for inputs, results, and errors
 * - Zod schema validation integration
 * - Session storage persistence (optional)
 * - Calculate and reset functions
 * 
 * @example
 * ```tsx
 * const schema = z.object({
 *   principal: z.number().min(0),
 *   rate: z.number().min(0).max(100),
 * });
 * 
 * const { inputs, setInput, results, errors, calculate, reset } = useCalculator({
 *   initialInputs: { principal: 0, rate: 0 },
 *   schema,
 *   calculate: (inputs) => ({ interest: inputs.principal * inputs.rate / 100 }),
 *   storageKey: 'interest-calculator',
 * });
 * ```
 */
export function useCalculator<
  TInputs extends Record<string, unknown>,
  TResults
>(
  options: UseCalculatorOptions<TInputs, TResults>
): UseCalculatorReturn<TInputs, TResults> {
  const { initialInputs, schema, calculate: calculateFn, storageKey } = options;

  // Initialize inputs from session storage or defaults
  const [inputs, setInputsState] = useState<TInputs>(() => {
    if (typeof window !== 'undefined' && storageKey) {
      try {
        const stored = sessionStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Validate stored data matches schema structure
          const validation = validateInputs(parsed, schema);
          if (validation.success && validation.data) {
            return validation.data;
          }
        }
      } catch {
        // Ignore storage errors, use defaults
      }
    }
    return initialInputs;
  });

  const [results, setResults] = useState<TResults | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof TInputs, string>>>({});
  const [isCalculating, setIsCalculating] = useState(false);

  // Persist inputs to session storage
  useEffect(() => {
    if (typeof window !== 'undefined' && storageKey) {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(inputs));
      } catch {
        // Ignore storage errors
      }
    }
  }, [inputs, storageKey]);

  // Validate inputs and update errors
  const validate = useCallback((): ValidationResult<TInputs> => {
    const result = validateInputs(inputs, schema);
    if (!result.success && result.errors) {
      setErrors(result.errors as Partial<Record<keyof TInputs, string>>);
    } else {
      setErrors({});
    }
    return result;
  }, [inputs, schema]);

  // Check if inputs are valid
  const isValid = Object.keys(errors).length === 0 && 
    validateInputs(inputs, schema).success;

  // Set a single input value
  const setInput = useCallback(<K extends keyof TInputs>(
    key: K,
    value: TInputs[K]
  ) => {
    setInputsState(prev => ({ ...prev, [key]: value }));
    // Clear error for this field when user updates it
    setErrors(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  // Set multiple input values
  const setInputs = useCallback((updates: Partial<TInputs>) => {
    setInputsState(prev => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    setErrors(prev => {
      const next = { ...prev };
      for (const key of Object.keys(updates)) {
        delete next[key as keyof TInputs];
      }
      return next;
    });
  }, []);

  // Perform calculation
  const calculate = useCallback(() => {
    const validation = validate();
    
    if (!validation.success || !validation.data) {
      setResults(null);
      return;
    }

    setIsCalculating(true);
    
    try {
      const result = calculateFn(validation.data);
      setResults(result);
    } catch (error) {
      // Handle calculation errors
      const message = error instanceof Error ? error.message : 'Calculation failed';
      setErrors(prev => ({ ...prev, _calculation: message }));
      setResults(null);
    } finally {
      setIsCalculating(false);
    }
  }, [validate, calculateFn]);

  // Reset to initial state
  const reset = useCallback(() => {
    setInputsState(initialInputs);
    setResults(null);
    setErrors({});
    
    // Clear session storage
    if (typeof window !== 'undefined' && storageKey) {
      try {
        sessionStorage.removeItem(storageKey);
      } catch {
        // Ignore storage errors
      }
    }
  }, [initialInputs, storageKey]);

  return {
    inputs,
    setInput,
    setInputs,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  };
}
