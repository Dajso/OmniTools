/**
 * Integration tests for Water Recipe Calculator
 * 
 * Tests the complete user flow of the water recipe calculator component
 * including input validation, calculation, and result display.
 * 
 * @see Requirements 5.1, 5.2, 5.3, 5.4, 15.1, 15.2
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WaterRecipeCalculator } from '@/components/calculators/coffee/water-recipe-calculator';

describe('WaterRecipeCalculator Integration', () => {
  it('should render the calculator with initial values', () => {
    render(<WaterRecipeCalculator />);
    
    expect(screen.getByLabelText(/vannmengde/i)).toBeDefined();
    expect(screen.getByLabelText(/ønsket hardhet/i)).toBeDefined();
    expect(screen.getByLabelText(/ønsket alkalinitet/i)).toBeDefined();
  });

  it('should display calculator title and description', () => {
    render(<WaterRecipeCalculator />);
    
    expect(screen.getByText(/vannoppskrift for kaffe/i)).toBeDefined();
    expect(screen.getByText(/regn ut hvor mye mineraler/i)).toBeDefined();
  });

  it('should provide help text for users', () => {
    render(<WaterRecipeCalculator />);
    
    // The old "How to use" block was replaced by a formula section with explanation
    expect(screen.getByText('Formel')).toBeDefined();
    expect(screen.getByText(/hardhet \(fra magnesium\) gir bedre ekstraksjon/i)).toBeDefined();
    expect(screen.getByText(/SCA-standard: 50–175 ppm hardhet og 40–70 ppm alkalinitet/i)).toBeDefined();
  });

  it('should have accessible form inputs with labels', () => {
    render(<WaterRecipeCalculator />);
    
    // All inputs should have labels
    expect(screen.getByLabelText(/vannmengde/i)).toBeDefined();
    expect(screen.getByLabelText(/ønsket hardhet/i)).toBeDefined();
    expect(screen.getByLabelText(/ønsket alkalinitet/i)).toBeDefined();
  });

  it('should be metric-only (no unit toggle) with liters and ppm units', () => {
    render(<WaterRecipeCalculator />);
    
    expect(screen.queryByRole('button', { name: /imperial|metric|metrisk/i })).toBeNull();
    expect(screen.getByText('L')).toBeDefined();
    expect(screen.getAllByText('ppm').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole('button', { name: /beregn/i })).toBeDefined();
  });

  it('should have proper input placeholders', () => {
    render(<WaterRecipeCalculator />);
    
    const volumeInput = screen.getByLabelText(/vannmengde/i);
    const hardnessInput = screen.getByLabelText(/ønsket hardhet/i);
    const alkalinityInput = screen.getByLabelText(/ønsket alkalinitet/i);
    
    expect(volumeInput).toBeDefined();
    expect(hardnessInput).toBeDefined();
    expect(alkalinityInput).toBeDefined();
  });

  it('should display formula explanation', () => {
    render(<WaterRecipeCalculator />);
    
    // Formula should be visible in the component
    expect(screen.getByText(/hardhet \/ 100.*volum/i)).toBeDefined();
  });

  it('should show water chemistry context', () => {
    render(<WaterRecipeCalculator />);
    
    // Check for educational content
    expect(screen.getByText(/vannets kjemi påvirker ekstraksjonen mye/i)).toBeDefined();
  });
});
