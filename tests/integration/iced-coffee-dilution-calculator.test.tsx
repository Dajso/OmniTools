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
    expect(screen.getByText(/Iced Coffee Dilution Calculator/i)).toBeDefined();
    
    // Check for input fields by ID
    expect(screen.getByLabelText(/Target Final Volume/i)).toBeDefined();
    expect(screen.getByLabelText(/Target TDS \(Desired Strength\)/i)).toBeDefined();
    expect(screen.getByLabelText(/Ice Percentage/i)).toBeDefined();
  });

  it('should display results with default values', () => {
    render(<IcedCoffeeDilutionCalculator />);
    
    // With default values (400ml, 1.2% TDS, 40% ice), should show results
    // Hot coffee: 240ml, Ice: 160g, Brewing TDS: 2.0%
    const results = screen.getAllByText(/Hot Coffee to Brew/i);
    expect(results.length).toBeGreaterThan(0);
    
    expect(screen.getByText(/Ice Needed/i)).toBeDefined();
  });

  it('should have unit toggle buttons', () => {
    render(<IcedCoffeeDilutionCalculator />);
    
    // Check for unit toggle buttons
    const metricButtons = screen.getAllByText('Metric');
    const imperialButtons = screen.getAllByText('Imperial');
    
    expect(metricButtons.length).toBeGreaterThan(0);
    expect(imperialButtons.length).toBeGreaterThan(0);
  });

  it('should have accessible ARIA labels', () => {
    render(<IcedCoffeeDilutionCalculator />);
    
    // Check that inputs have proper labels (via for/id relationship)
    const targetVolumeInput = screen.getByLabelText(/Target Final Volume/i);
    const targetTDSInput = screen.getByLabelText(/Target TDS \(Desired Strength\)/i);
    const icePercentageInput = screen.getByLabelText(/Ice Percentage/i);
    
    expect(targetVolumeInput).toBeDefined();
    expect(targetTDSInput).toBeDefined();
    expect(icePercentageInput).toBeDefined();
  });

  it('should display help text', () => {
    render(<IcedCoffeeDilutionCalculator />);
    
    // Check for help text
    expect(screen.getByText(/How to use:/i)).toBeDefined();
  });
});
