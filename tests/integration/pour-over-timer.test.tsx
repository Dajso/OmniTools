import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PourOverTimer } from '@/components/calculators/coffee/pour-over-timer';

describe('PourOverTimer Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the calculator with default values', () => {
    render(<PourOverTimer />);

    expect(screen.getByText('Pour Over Timer')).toBeInTheDocument();
    expect(screen.getByLabelText('Brewing Method')).toBeInTheDocument();
    expect(screen.getByLabelText('Total Water')).toBeInTheDocument();
  });

  it('should display pour schedule for 4:6 method', () => {
    render(<PourOverTimer />);

    // Should show 5 pours for 4:6 method
    expect(screen.getByText('Pour 1')).toBeInTheDocument();
    expect(screen.getByText('Pour 2')).toBeInTheDocument();
    expect(screen.getByText('Pour 3')).toBeInTheDocument();
    expect(screen.getByText('Pour 4')).toBeInTheDocument();
    expect(screen.getByText('Pour 5')).toBeInTheDocument();
  });

  it('should calculate correct water amounts for 4:6 method', () => {
    render(<PourOverTimer />);

    // With 300g total water:
    // First 2 pours: 40% = 120g (60g each)
    // Last 3 pours: 60% = 180g (60g each)
    const pourAmounts = screen.getAllByText(/60g/);
    expect(pourAmounts).toHaveLength(5);
  });

  it('should display method name', () => {
    render(<PourOverTimer />);

    expect(screen.getByText('4:6 Method (Tetsu Kasuya)')).toBeInTheDocument();
  });

  it('should display total time', () => {
    render(<PourOverTimer />);

    // 5 pours × 45 seconds = 225 seconds = 3:45
    expect(screen.getByText('3:45')).toBeInTheDocument();
  });

  it('should show start button initially', () => {
    render(<PourOverTimer />);

    const startButton = screen.getByRole('button', { name: /start timer/i });
    expect(startButton).toBeInTheDocument();
  });

  it('should start timer when start button is clicked', async () => {
    render(<PourOverTimer />);

    const startButton = screen.getByRole('button', { name: /start timer/i });
    fireEvent.click(startButton);

    // Should show pause button
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    });
  });

  it('should update timer display when running', async () => {
    render(<PourOverTimer />);

    const startButton = screen.getByRole('button', { name: /start timer/i });
    fireEvent.click(startButton);

    // Advance timer by 10 seconds
    vi.advanceTimersByTime(10000);

    await waitFor(() => {
      // Timer should show 0:10
      const timerDisplay = screen.getByText(/0:10/);
      expect(timerDisplay).toBeInTheDocument();
    });
  });

  it('should show current stage when timer is running', async () => {
    render(<PourOverTimer />);

    const startButton = screen.getByRole('button', { name: /start timer/i });
    fireEvent.click(startButton);

    // Should show "Current: Pour 1"
    await waitFor(() => {
      expect(screen.getByText(/Current: Pour 1/)).toBeInTheDocument();
    });
  });

  it('should pause timer when pause button is clicked', async () => {
    render(<PourOverTimer />);

    const startButton = screen.getByRole('button', { name: /start timer/i });
    fireEvent.click(startButton);

    await waitFor(() => {
      const pauseButton = screen.getByRole('button', { name: /pause/i });
      fireEvent.click(pauseButton);
    });

    // Should show resume button
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument();
    });
  });

  it('should reset timer when reset button is clicked', async () => {
    render(<PourOverTimer />);

    const startButton = screen.getByRole('button', { name: /start timer/i });
    fireEvent.click(startButton);

    // Advance timer
    vi.advanceTimersByTime(10000);

    await waitFor(() => {
      const resetButton = screen.getByRole('button', { name: /reset timer/i });
      fireEvent.click(resetButton);
    });

    // Timer should be back to 0:00
    await waitFor(() => {
      expect(screen.getByText('0:00')).toBeInTheDocument();
    });
  });

  it('should switch to custom method', async () => {
    render(<PourOverTimer />);

    const methodSelect = screen.getByLabelText('Brewing Method');
    fireEvent.change(methodSelect, { target: { value: 'custom' } });

    // Should show number of pours input
    await waitFor(() => {
      expect(screen.getByLabelText('Number of Pours')).toBeInTheDocument();
    });
  });

  it('should calculate custom pour schedule', async () => {
    render(<PourOverTimer />);

    // Switch to custom method
    const methodSelect = screen.getByLabelText('Brewing Method');
    fireEvent.change(methodSelect, { target: { value: 'custom' } });

    await waitFor(() => {
      const numberOfPoursInput = screen.getByLabelText('Number of Pours');
      fireEvent.change(numberOfPoursInput, { target: { value: '3' } });
    });

    // Should show 3 pours
    await waitFor(() => {
      expect(screen.getByText('Pour 1')).toBeInTheDocument();
      expect(screen.getByText('Pour 2')).toBeInTheDocument();
      expect(screen.getByText('Pour 3')).toBeInTheDocument();
      expect(screen.queryByText('Pour 4')).not.toBeInTheDocument();
    });
  });

  it('should update water amounts when total water changes', async () => {
    render(<PourOverTimer />);

    const waterInput = screen.getByLabelText('Total Water');
    fireEvent.change(waterInput, { target: { value: '400' } });

    await waitFor(() => {
      // With 400g total water:
      // First 2 pours: 40% = 160g (80g each)
      // Last 3 pours: 60% = 240g (80g each)
      const pourAmounts = screen.getAllByText(/80g/);
      expect(pourAmounts).toHaveLength(5);
    });
  });

  it('should show brewing instructions', () => {
    render(<PourOverTimer />);

    expect(screen.getByText(/Rinse filter with hot water/)).toBeInTheDocument();
    expect(screen.getByText(/Add coffee grounds/)).toBeInTheDocument();
  });

  it('should show progress bar', () => {
    render(<PourOverTimer />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });

  it('should update progress bar as timer runs', async () => {
    render(<PourOverTimer />);

    const startButton = screen.getByRole('button', { name: /start timer/i });
    fireEvent.click(startButton);

    // Advance timer to halfway (112.5 seconds)
    vi.advanceTimersByTime(112500);

    await waitFor(() => {
      const progressBar = screen.getByRole('progressbar');
      const progress = parseFloat(progressBar.getAttribute('aria-valuenow') || '0');
      expect(progress).toBeGreaterThan(40);
      expect(progress).toBeLessThan(60);
    });
  });

  it('should show completion message when timer finishes', async () => {
    render(<PourOverTimer />);

    const startButton = screen.getByRole('button', { name: /start timer/i });
    fireEvent.click(startButton);

    // Advance timer to completion (225 seconds)
    vi.advanceTimersByTime(225000);

    await waitFor(() => {
      expect(screen.getByText(/Brewing Complete/)).toBeInTheDocument();
    });
  });

  it('should show method description for 4:6 method', () => {
    render(<PourOverTimer />);

    expect(screen.getByText(/About the 4:6 Method/)).toBeInTheDocument();
    expect(screen.getByText(/Developed by Tetsu Kasuya/)).toBeInTheDocument();
  });

  it('should handle validation errors', async () => {
    render(<PourOverTimer />);

    const waterInput = screen.getByLabelText('Total Water');
    fireEvent.change(waterInput, { target: { value: '50' } });

    await waitFor(() => {
      // Should show error or not display schedule
      expect(screen.queryByText('Pour 1')).not.toBeInTheDocument();
    });
  });
});
