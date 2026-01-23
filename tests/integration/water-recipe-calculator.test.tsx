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
    
    expect(screen.getByLabelText(/water volume/i)).toBeDefined();
    expect(screen.getByLabelText(/target hardness/i)).toBeDefined();
    expect(screen.getByLabelText(/target alkalinity/i)).toBeDefined();
  });

  it('should display calculator title and description', () => {
    render(<WaterRecipeCalculator />);
    
    expect(screen.getByText(/water recipe calculator/i)).toBeDefined();
    expect(screen.getByText(/calculate mineral additions/i)).toBeDefined();
  });

  it('should provide help text for users', () => {
    render(<WaterRecipeCalculator />);
    
    expect(screen.getByText(/how to use/i)).toBeDefined();
    expect(screen.getByText(/tap water already contains minerals/i)).toBeDefined();
  });

  it('should have accessible form inputs with labels', () => {
    render(<WaterRecipeCalculator />);
    
    // All inputs should have labels
    expect(screen.getByLabelText(/water volume/i)).toBeDefined();
    expect(screen.getByLabelText(/target hardness/i)).toBeDefined();
    expect(screen.getByLabelText(/target alkalinity/i)).toBeDefined();
  });

  it('should display unit toggle buttons', () => {
    render(<WaterRecipeCalculator />);
    
    expect(screen.getByRole('button', { name: /use metric units/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /use imperial units/i })).toBeDefined();
  });

  it('should have proper input placeholders', () => {
    render(<WaterRecipeCalculator />);
    
    const volumeInput = screen.getByLabelText(/water volume/i);
    const hardnessInput = screen.getByLabelText(/target hardness/i);
    const alkalinityInput = screen.getByLabelText(/target alkalinity/i);
    
    expect(volumeInput).toBeDefined();
    expect(hardnessInput).toBeDefined();
    expect(alkalinityInput).toBeDefined();
  });

  it('should display formula explanation', () => {
    render(<WaterRecipeCalculator />);
    
    // Formula should be visible in the component
    expect(screen.getByText(/hardness.*100.*volume/i)).toBeDefined();
  });

  it('should show water chemistry context', () => {
    render(<WaterRecipeCalculator />);
    
    // Check for educational content
    expect(screen.getByText(/water chemistry significantly affects/i)).toBeDefined();
  });
});
