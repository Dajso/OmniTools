import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { PourOverTimer } from '@/components/calculators/coffee/pour-over-timer';

describe('PourOverTimer Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Testing Library only advances fake timers inside waitFor() when it detects a global
    // `jest`; expose a minimal shim so waitFor() does not hang under vitest fake timers.
    vi.stubGlobal('jest', { advanceTimersByTime: (ms: number) => vi.advanceTimersByTime(ms) });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should render the calculator with default values', () => {
    render(<PourOverTimer />);

    expect(screen.getByText('Pour over-timer')).toBeInTheDocument();
    expect(screen.getByLabelText(/^Bryggemetode/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Total vannmengde/)).toBeInTheDocument();
  });

  it('should display pour schedule for 4:6 method', () => {
    render(<PourOverTimer />);

    // Should show 5 pours for 4:6 method
    expect(screen.getByText('Hell 1')).toBeInTheDocument();
    expect(screen.getByText('Hell 2')).toBeInTheDocument();
    expect(screen.getByText('Hell 3')).toBeInTheDocument();
    expect(screen.getByText('Hell 4')).toBeInTheDocument();
    expect(screen.getByText('Hell 5')).toBeInTheDocument();
  });

  it('should calculate correct water amounts for 4:6 method', () => {
    render(<PourOverTimer />);

    // With 300g total water:
    // First 2 pours: 40% = 120g (60g each)
    // Last 3 pours: 60% = 180g (60g each)
    // (the stage rows are scoped by their "Hell N" label, since the "Nå"/"Neste" panels also show amounts)
    for (let i = 1; i <= 5; i++) {
      const row = screen.getByText(`Hell ${i}`).parentElement as HTMLElement;
      expect(row.textContent).toContain('60g');
    }
  });

  it('should display method name', () => {
    render(<PourOverTimer />);

    // The name appears both as a select option and in the "Metode" result; check the result one
    const matches = screen.getAllByText('4:6-metoden (Tetsu Kasuya)');
    expect(matches.some((el) => el.tagName !== 'OPTION')).toBe(true);
  });

  it('should display total time', () => {
    render(<PourOverTimer />);

    // 5 pours × 45 seconds = 225 seconds = 3:45
    expect(screen.getByText('3:45')).toBeInTheDocument();
  });

  it('should show start button initially', () => {
    render(<PourOverTimer />);

    const startButton = screen.getByRole('button', { name: /start timeren/i });
    expect(startButton).toBeInTheDocument();
  });

  it('should start timer when start button is clicked', async () => {
    render(<PourOverTimer />);

    const startButton = screen.getByRole('button', { name: /start timeren/i });
    fireEvent.click(startButton);

    // Should show pause button
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    });
  });

  it('should update timer display when running', async () => {
    render(<PourOverTimer />);

    const startButton = screen.getByRole('button', { name: /start timeren/i });
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

    const startButton = screen.getByRole('button', { name: /start timeren/i });
    fireEvent.click(startButton);

    // Should show "Nå: omgang 1"
    await waitFor(() => {
      expect(screen.getByText(/Nå: omgang 1/)).toBeInTheDocument();
    });
  });

  it('should pause timer when pause button is clicked', async () => {
    render(<PourOverTimer />);

    const startButton = screen.getByRole('button', { name: /start timeren/i });
    fireEvent.click(startButton);

    // Let some time elapse; with 0 seconds elapsed the UI shows "Start timer" again instead of "Fortsett"
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      const pauseButton = screen.getByRole('button', { name: /pause/i });
      fireEvent.click(pauseButton);
    });

    // Should show resume button
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /fortsett timeren/i })).toBeInTheDocument();
    });
  });

  it('should reset timer when reset button is clicked', async () => {
    render(<PourOverTimer />);

    const startButton = screen.getByRole('button', { name: /start timeren/i });
    fireEvent.click(startButton);

    // Advance timer
    vi.advanceTimersByTime(10000);

    await waitFor(() => {
      const resetButton = screen.getByRole('button', { name: /nullstill timeren/i });
      fireEvent.click(resetButton);
    });

    // Timer should be back to 0:00
    await waitFor(() => {
      expect(screen.getByText('0:00')).toBeInTheDocument();
    });
  });

  it('should switch to custom method', async () => {
    render(<PourOverTimer />);

    const methodSelect = screen.getByLabelText(/^Bryggemetode/);
    fireEvent.change(methodSelect, { target: { value: 'custom' } });

    // Should show number of pours input
    await waitFor(() => {
      expect(screen.getByLabelText(/^Antall helleomganger/)).toBeInTheDocument();
    });
  });

  it('should calculate custom pour schedule', async () => {
    render(<PourOverTimer />);

    // Switch to custom method
    const methodSelect = screen.getByLabelText(/^Bryggemetode/);
    fireEvent.change(methodSelect, { target: { value: 'custom' } });

    await waitFor(() => {
      const numberOfPoursInput = screen.getByLabelText(/^Antall helleomganger/);
      fireEvent.change(numberOfPoursInput, { target: { value: '3' } });
    });

    // Should show 3 pours
    await waitFor(() => {
      expect(screen.getByText('Hell 1')).toBeInTheDocument();
      expect(screen.getByText('Hell 2')).toBeInTheDocument();
      expect(screen.getByText('Hell 3')).toBeInTheDocument();
      expect(screen.queryByText('Hell 4')).not.toBeInTheDocument();
    });
  });

  it('should update water amounts when total water changes', async () => {
    render(<PourOverTimer />);

    const waterInput = screen.getByLabelText(/^Total vannmengde/);
    fireEvent.change(waterInput, { target: { value: '400' } });

    await waitFor(() => {
      // With 400g total water:
      // First 2 pours: 40% = 160g (80g each)
      // Last 3 pours: 60% = 240g (80g each)
      for (let i = 1; i <= 5; i++) {
        const row = screen.getByText(`Hell ${i}`).parentElement as HTMLElement;
        expect(row.textContent).toContain('80g');
      }
    });
  });

  it('should show brewing instructions', () => {
    render(<PourOverTimer />);

    expect(screen.getByText(/Skyll filteret med varmt vann/)).toBeInTheDocument();
    expect(screen.getByText(/Ha i kaffen og jevn den ut/)).toBeInTheDocument();
  });

  it('should show progress bar', () => {
    render(<PourOverTimer />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });

  it('should update progress bar as timer runs', async () => {
    render(<PourOverTimer />);

    const startButton = screen.getByRole('button', { name: /start timeren/i });
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

    const startButton = screen.getByRole('button', { name: /start timeren/i });
    fireEvent.click(startButton);

    // Advance timer to completion (225 seconds)
    vi.advanceTimersByTime(225000);

    await waitFor(() => {
      expect(screen.getByText(/Ferdig traktet/)).toBeInTheDocument();
    });
  });

  it('should show method description for 4:6 method', () => {
    render(<PourOverTimer />);

    expect(screen.getByText(/Om 4:6-metoden/)).toBeInTheDocument();
    expect(screen.getByText(/utviklet av Tetsu Kasuya/)).toBeInTheDocument();
  });

  it('should handle validation errors', async () => {
    render(<PourOverTimer />);

    const waterInput = screen.getByLabelText(/^Total vannmengde/);
    fireEvent.change(waterInput, { target: { value: '50' } });

    await waitFor(() => {
      // Should show error or not display schedule
      expect(screen.queryByText('Hell 1')).not.toBeInTheDocument();
    });
  });
});
