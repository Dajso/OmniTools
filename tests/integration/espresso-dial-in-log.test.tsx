/**
 * Integration tests for Espresso Dial-in Log component
 * 
 * Tests component rendering, user interactions, shot logging, and accessibility
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
    expect(screen.getByText(/Espresso: innstillingslogg/i)).toBeDefined();
    
    // Check for input fields
    expect(screen.getByLabelText(/Kaffemengde/i)).toBeDefined();
    expect(screen.getByLabelText(/Utbytte/i)).toBeDefined();
    expect(screen.getByLabelText(/^Tid/i)).toBeDefined();
    expect(screen.getByLabelText(/Kvernstilling/i)).toBeDefined();
    expect(screen.getByLabelText(/Smaksnotater/i)).toBeDefined();
  });

  it('should display current metrics preview with default values', () => {
    render(<EspressoDialInLog />);
    
    // The preview only renders once the form is valid, which requires a grind setting
    // (the schema demands a non-empty Kvernstilling; default is empty).
    expect(screen.queryByText('Vurdering')).toBeNull();
    fireEvent.change(screen.getByLabelText(/Kvernstilling/i), { target: { value: '8,5' } });

    // With default values (18g dose, 36g yield, 28s time), should show metrics
    // Use getAllByText since "Ekstraksjonsforhold" appears in multiple places
    expect(screen.getByText('Vurdering')).toBeDefined();
    expect(screen.getByText('2,00')).toBeDefined();
    expect(screen.getByText('1,29')).toBeDefined();
    const extractionRatioElements = screen.getAllByText(/Ekstraksjonsforhold/i);
    expect(extractionRatioElements.length).toBeGreaterThan(0);
    
    const flowRateElements = screen.getAllByText(/Gjennomstrømning/i);
    expect(flowRateElements.length).toBeGreaterThan(0);
  });

  it('should be metric-only with gram and second units (no unit toggle)', () => {
    render(<EspressoDialInLog />);
    
    // The metric/imperial toggle was removed; the UI is metric only
    expect(screen.queryByText(/imperial/i)).toBeNull();
    expect(screen.getAllByText('g').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('s')).toBeDefined();
  });

  it('should display empty shot history initially', () => {
    render(<EspressoDialInLog />);
    
    // Check for empty state message
    expect(screen.getByText(/Ingen espressoer er logget ennå/i)).toBeDefined();
    
    // Check for shot history heading with count
    const historyHeading = screen.getByText((content, element) => {
      return element?.tagName === 'H3' && content.includes('Logg (0)');
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
    expect(screen.getByText(/Kverning: 8\.5/i)).toBeDefined();
  });

  it('should have accessible ARIA labels', () => {
    render(<EspressoDialInLog />);
    
    // Check that inputs have proper labels
    const doseInput = screen.getByLabelText(/Kaffemengde/i);
    const yieldInput = screen.getByLabelText(/Utbytte/i);
    const timeInput = screen.getByLabelText(/^Tid/i);
    const grindSettingInput = screen.getByLabelText(/Kvernstilling/i);
    const tasteNotesInput = screen.getByLabelText(/Smaksnotater/i);
    
    expect(doseInput).toBeDefined();
    expect(yieldInput).toBeDefined();
    expect(timeInput).toBeDefined();
    expect(grindSettingInput).toBeDefined();
    expect(tasteNotesInput).toBeDefined();
  });

  it('should display help text', () => {
    render(<EspressoDialInLog />);
    
    // The old "How to use" block was replaced by a formula section with explanation
    expect(screen.getByText('Formel')).toBeDefined();
    expect(screen.getByText(/God espresso ligger vanligvis mellom 1,5 og 2,5/i)).toBeDefined();
  });

  it('should have add shot button', () => {
    render(<EspressoDialInLog />);
    
    // Check that add button exists
    const addButton = screen.getByRole('button', { name: /Legg espressoen til i loggen/i });
    expect(addButton).toBeDefined();
  });

  it('should display recommendation badge in metrics preview', () => {
    render(<EspressoDialInLog />);
    
    // Default values (18g/36g/28s) should produce "Optimal" vurdering once a grind setting is entered
    fireEvent.change(screen.getByLabelText(/Kvernstilling/i), { target: { value: '8,5' } });
    const optimalBadges = screen.getAllByText(/Optimal/i);
    expect(optimalBadges.length).toBeGreaterThan(0);
  });

  it('should display formula explanation', () => {
    render(<EspressoDialInLog />);
    
    // Check for formula
    expect(screen.getByText(/Ekstraksjonsforhold = utbytte \/ mengde/i)).toBeDefined();
  });
});
