/**
 * Integration tests for Iced Coffee Dilution Calculator component
 * 
 * Tests component rendering, user interactions, and accessibility
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IcedCoffeeDilutionCalculator } from '@/components/calculators/coffee/iced-coffee-dilution-calculator';

describe('IcedCoffeeDilutionCalculator Component', () => {
  it('should render the calculator with all inputs', () => {
    render(<IcedCoffeeDilutionCalculator />);
    
    // Check for title
    expect(screen.getByText(/Iskaffe og fortynning/i)).toBeDefined();
    
    // Check for input fields by ID
    expect(screen.getByLabelText(/Ønsket sluttvolum/i)).toBeDefined();
    expect(screen.getByLabelText(/Ønsket TDS \(styrke\)/i)).toBeDefined();
    expect(screen.getByLabelText(/Andel is/i)).toBeDefined();
  });

  it('should display results with default values', () => {
    render(<IcedCoffeeDilutionCalculator />);
    
    // With default values (400ml, 1.2% TDS, 40% ice), should show results
    // Hot coffee: 240ml, Ice: 160g, Brewing TDS: 2.0%
    const results = screen.getAllByText(/Varm kaffe å brygge/i);
    expect(results.length).toBeGreaterThan(0);
    
    expect(screen.getByText(/Is som trengs/i)).toBeDefined();
  });

  it('should be metric only (no imperial toggle)', () => {
    render(<IcedCoffeeDilutionCalculator />);

    expect(screen.queryByText('Imperial')).toBeNull();
    expect(screen.queryByText('Metric')).toBeNull();
  });

  it('should have accessible ARIA labels', () => {
    render(<IcedCoffeeDilutionCalculator />);
    
    // Check that inputs have proper labels (via for/id relationship)
    const targetVolumeInput = screen.getByLabelText(/Ønsket sluttvolum/i);
    const targetTDSInput = screen.getByLabelText(/Ønsket TDS \(styrke\)/i);
    const icePercentageInput = screen.getByLabelText(/Andel is/i);
    
    expect(targetVolumeInput).toBeDefined();
    expect(targetTDSInput).toBeDefined();
    expect(icePercentageInput).toBeDefined();
  });

  it('should display help text', () => {
    render(<IcedCoffeeDilutionCalculator />);
    
    // Check for help text
    expect(screen.getByText(/Anbefalt andel is/i)).toBeDefined();
  });
});
