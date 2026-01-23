/**
 * Integration tests for Espresso Dial-in Log component
 * 
 * Tests component rendering, user interactions, shot logging, and accessibility
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EspressoDialInLog } from '@/components/calculators/coffee/espresso-dial-in-log';

describe('EspressoDialInLog Component', () => {
  // Clear localStorage before and after each test
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should render the calculator with all inputs', () => {
    render(<EspressoDialInLog />);
    
    // Check for title
    expect(screen.getByText(/Espresso Dial-in Log/i)).toBeDefined();
    
    // Check for input fields
    expect(screen.getByLabelText(/Dose/i)).toBeDefined();
    expect(screen.getByLabelText(/Yield/i)).toBeDefined();
    expect(screen.getByLabelText(/Time/i)).toBeDefined();
    expect(screen.getByLabelText(/Grind Setting/i)).toBeDefined();
    expect(screen.getByLabelText(/Taste Notes/i)).toBeDefined();
  });

  it('should display current metrics preview with default values', () => {
    render(<EspressoDialInLog />);
    
    // With default values (18g dose, 36g yield, 28s time), should show metrics
    // Use getAllByText since "Extraction Ratio" appears in multiple places
    const extractionRatioElements = screen.getAllByText(/Extraction Ratio/i);
    expect(extractionRatioElements.length).toBeGreaterThan(0);
    
    const flowRateElements = screen.getAllByText(/Flow Rate/i);
    expect(flowRateElements.length).toBeGreaterThan(0);
  });

  it('should have unit toggle buttons', () => {
    render(<EspressoDialInLog />);
    
    // Check for unit toggle buttons
    const metricButtons = screen.getAllByText('Metric');
    const imperialButtons = screen.getAllByText('Imperial');
    
    expect(metricButtons.length).toBeGreaterThan(0);
    expect(imperialButtons.length).toBeGreaterThan(0);
  });

  it('should display empty shot history initially', () => {
    render(<EspressoDialInLog />);
    
    // Check for empty state message
    expect(screen.getByText(/No shots logged yet/i)).toBeDefined();
    
    // Check for shot history heading with count
    const historyHeading = screen.getByText((content, element) => {
      return element?.tagName === 'H3' && content.includes('Shot History');
    });
    expect(historyHeading).toBeDefined();
  });

  it('should load shots from localStorage on mount', () => {
    // Pre-populate localStorage
    const mockShot = {
      id: 'shot-123',
      timestamp: new Date().toISOString(),
      dose: 18,
      yield: 36,
      time: 28,
      grindSetting: '8.5',
      tasteNotes: 'Test notes',
      metrics: {
        extractionRatio: 2.0,
        flowRate: 1.29,
        recommendation: 'optimal',
        recommendationText: 'Test recommendation',
      },
    };
    
    localStorage.setItem('espresso-dial-in-log', JSON.stringify([mockShot]));
    
    // Render component
    render(<EspressoDialInLog />);
    
    // Check that shot is displayed
    expect(screen.getByText(/Grind: 8\.5/i)).toBeDefined();
  });

  it('should have accessible ARIA labels', () => {
    render(<EspressoDialInLog />);
    
    // Check that inputs have proper labels
    const doseInput = screen.getByLabelText(/Dose/i);
    const yieldInput = screen.getByLabelText(/Yield/i);
    const timeInput = screen.getByLabelText(/Time/i);
    const grindSettingInput = screen.getByLabelText(/Grind Setting/i);
    const tasteNotesInput = screen.getByLabelText(/Taste Notes/i);
    
    expect(doseInput).toBeDefined();
    expect(yieldInput).toBeDefined();
    expect(timeInput).toBeDefined();
    expect(grindSettingInput).toBeDefined();
    expect(tasteNotesInput).toBeDefined();
  });

  it('should display help text', () => {
    render(<EspressoDialInLog />);
    
    // Check for help text
    expect(screen.getByText(/How to use:/i)).toBeDefined();
  });

  it('should have add shot button', () => {
    render(<EspressoDialInLog />);
    
    // Check that add button exists
    const addButton = screen.getByRole('button', { name: /Add shot to log/i });
    expect(addButton).toBeDefined();
  });

  it('should display recommendation badge in metrics preview', () => {
    render(<EspressoDialInLog />);
    
    // Default values should produce "Optimal" recommendation
    const optimalBadges = screen.getAllByText(/Optimal/i);
    expect(optimalBadges.length).toBeGreaterThan(0);
  });

  it('should display formula explanation', () => {
    render(<EspressoDialInLog />);
    
    // Check for formula
    expect(screen.getByText(/Extraction Ratio = Yield \/ Dose/i)).toBeDefined();
  });
});
