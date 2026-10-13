import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { FrenchPressTimer } from '@/components/calculators/coffee/french-press-timer';

/** Value shown in the ResultDisplay card with the given label (e.g. "Bryggeforhold", "Total tid") */
const resultValue = (label: string) => screen.getByText(label).nextElementSibling?.textContent;

/** Text of the timeline row with the given event name (e.g. "Rør igjen") */
const timelineRowText = (name: string) => screen.getByText(name).parentElement?.parentElement?.textContent ?? '';

describe('FrenchPressTimer Integration', () => {
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
    render(<FrenchPressTimer />);

    expect(screen.getByText('Presskanne-timer')).toBeInTheDocument();
    expect(screen.getByLabelText(/^Kaffemengde/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Vannmengde/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Trekketid/)).toBeInTheDocument();
  });

  it('should display brew ratio with default values', () => {
    render(<FrenchPressTimer />);

    // Default: 30g coffee, 500g water = 1:16.7 ratio
    expect(resultValue('Bryggeforhold')).toBe('1:16,7');
  });

  it('should display strength estimate', () => {
    render(<FrenchPressTimer />);

    // 1:16.7 ratio should be "Balansert"
    expect(screen.getByText(/Balansert/)).toBeInTheDocument();
  });

  it('should display timeline events', () => {
    render(<FrenchPressTimer />);

    // Should show bloom, stir, and press events
    // (exact names: the "Neste:" panel also mentions the upcoming event)
    expect(screen.getByText('Forbløting og røring')).toBeInTheDocument();
    expect(screen.getByText('Rør igjen')).toBeInTheDocument();
    expect(screen.getByText('Press og server')).toBeInTheDocument();
  });

  it('should display correct event times', () => {
    render(<FrenchPressTimer />);

    // Bloom at 0:30, Stir at 2:00 (halfway of 4 min), Press at 4:00
    // (scoped per timeline row, since 4:00 is also shown as total time)
    expect(timelineRowText('Forbløting og røring')).toContain('0:30');
    expect(timelineRowText('Rør igjen')).toContain('2:00');
    expect(timelineRowText('Press og server')).toContain('4:00');
  });

  it('should display total time', () => {
    render(<FrenchPressTimer />);

    // Default 4 minutes
    expect(resultValue('Total tid')).toBe('4:00');
  });

  it('should show start button initially', () => {
    render(<FrenchPressTimer />);

    const startButton = screen.getByRole('button', { name: /start timeren/i });
    expect(startButton).toBeInTheDocument();
  });

  it('should start timer when start button is clicked', async () => {
    render(<FrenchPressTimer />);

    const startButton = screen.getByRole('button', { name: /start timeren/i });
    fireEvent.click(startButton);

    // Should show pause button
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    });
  });

  it('should update timer display when running', async () => {
    render(<FrenchPressTimer />);

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

  it('should show next event when timer is running', async () => {
    render(<FrenchPressTimer />);

    const startButton = screen.getByRole('button', { name: /start timeren/i });
    fireEvent.click(startButton);

    // Should show next event (Forbløting og røring at 0:30)
    await waitFor(() => {
      expect(screen.getByText(/Neste: Forbløting og røring/)).toBeInTheDocument();
    });
  });

  it('should pause timer when pause button is clicked', async () => {
    render(<FrenchPressTimer />);

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
    render(<FrenchPressTimer />);

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

  it('should update brew ratio when coffee dose changes', async () => {
    render(<FrenchPressTimer />);

    const coffeeInput = screen.getByLabelText(/^Kaffemengde/);
    fireEvent.change(coffeeInput, { target: { value: '40' } });

    await waitFor(() => {
      // 40g coffee, 500g water = 1:12.5 ratio
      expect(resultValue('Bryggeforhold')).toBe('1:12,5');
    });
  });

  it('should update strength estimate when ratio changes', async () => {
    render(<FrenchPressTimer />);

    const coffeeInput = screen.getByLabelText(/^Kaffemengde/);
    fireEvent.change(coffeeInput, { target: { value: '40' } });

    await waitFor(() => {
      // 1:12.5 ratio should be "Sterk"
      expect(screen.getByText(/Sterk –/)).toBeInTheDocument();
    });
  });

  it('should update stir time when steep time changes', async () => {
    render(<FrenchPressTimer />);

    const steepTimeInput = screen.getByLabelText(/^Trekketid/);
    fireEvent.change(steepTimeInput, { target: { value: '6' } });

    await waitFor(() => {
      // Stir at halfway point of 6 minutes = 3:00
      expect(timelineRowText('Rør igjen')).toContain('3:00');
    });
  });

  it('should show brewing instructions', () => {
    render(<FrenchPressTimer />);

    expect(screen.getByText(/Forvarm presskannen/)).toBeInTheDocument();
    expect(screen.getByText(/press stempelet sakte og jevnt ned/)).toBeInTheDocument();
  });

  it('should show progress bar', () => {
    render(<FrenchPressTimer />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });

  it('should update progress bar as timer runs', async () => {
    render(<FrenchPressTimer />);

    const startButton = screen.getByRole('button', { name: /start timeren/i });
    fireEvent.click(startButton);

    // Advance timer to halfway (120 seconds)
    vi.advanceTimersByTime(120000);

    await waitFor(() => {
      const progressBar = screen.getByRole('progressbar');
      const progress = parseFloat(progressBar.getAttribute('aria-valuenow') || '0');
      expect(progress).toBeGreaterThan(40);
      expect(progress).toBeLessThan(60);
    });
  });

  it('should show completion message when timer finishes', async () => {
    render(<FrenchPressTimer />);

    const startButton = screen.getByRole('button', { name: /start timeren/i });
    fireEvent.click(startButton);

    // Advance timer to completion (240 seconds)
    vi.advanceTimersByTime(240000);

    await waitFor(() => {
      expect(screen.getByText(/Ferdig traktet/)).toBeInTheDocument();
    });
  });

  it('should show French press tips', () => {
    render(<FrenchPressTimer />);

    expect(screen.getByText(/Tips for presskanne/)).toBeInTheDocument();
    expect(screen.getByText(/Bruk grov kverning/)).toBeInTheDocument();
    expect(screen.getByText(/Vanntemperatur: 90–96\s?°C/)).toBeInTheDocument();
  });

  it('should handle validation errors for coffee dose', async () => {
    render(<FrenchPressTimer />);

    const coffeeInput = screen.getByLabelText(/^Kaffemengde/);
    fireEvent.change(coffeeInput, { target: { value: '5' } });

    await waitFor(() => {
      // Should show error or not display results
      expect(screen.queryByText('1:16,7')).not.toBeInTheDocument();
    });
  });

  it('should handle validation errors for water amount', async () => {
    render(<FrenchPressTimer />);

    const waterInput = screen.getByLabelText(/^Vannmengde/);
    fireEvent.change(waterInput, { target: { value: '50' } });

    await waitFor(() => {
      // Should show error or not display results
      expect(screen.queryByText('1:16,7')).not.toBeInTheDocument();
    });
  });

  it('should handle validation errors for steep time', async () => {
    render(<FrenchPressTimer />);

    const steepTimeInput = screen.getByLabelText(/^Trekketid/);
    fireEvent.change(steepTimeInput, { target: { value: '1' } });

    await waitFor(() => {
      // Should show error or not display results
      expect(screen.queryByText('1:16,7')).not.toBeInTheDocument();
    });
  });

  it('should show active event indicator when event time is reached', async () => {
    render(<FrenchPressTimer />);

    const startButton = screen.getByRole('button', { name: /start timeren/i });
    fireEvent.click(startButton);

    // Advance timer to bloom time (30 seconds)
    vi.advanceTimersByTime(30000);

    await waitFor(() => {
      // Should show "Nå: Forbløting og røring"
      expect(screen.getByText(/Nå: Forbløting og røring/)).toBeInTheDocument();
    });
  });

  it('should advance to next event after current event completes', async () => {
    render(<FrenchPressTimer />);

    const startButton = screen.getByRole('button', { name: /start timeren/i });
    fireEvent.click(startButton);

    // Advance timer past bloom (35 seconds)
    vi.advanceTimersByTime(35000);

    await waitFor(() => {
      // Should show next event (Rør igjen)
      expect(screen.getByText(/Neste: Rør igjen/)).toBeInTheDocument();
    });
  });

  it('should show time remaining until next event', async () => {
    render(<FrenchPressTimer />);

    const startButton = screen.getByRole('button', { name: /start timeren/i });
    fireEvent.click(startButton);

    // Should show time remaining until bloom (30 seconds)
    await waitFor(() => {
      expect(screen.getByText(/0:30 igjen/)).toBeInTheDocument();
    });
  });

  it('should handle minimum valid inputs', async () => {
    render(<FrenchPressTimer />);

    const coffeeInput = screen.getByLabelText(/^Kaffemengde/);
    const waterInput = screen.getByLabelText(/^Vannmengde/);
    const steepTimeInput = screen.getByLabelText(/^Trekketid/);

    fireEvent.change(coffeeInput, { target: { value: '10' } });
    fireEvent.change(waterInput, { target: { value: '100' } });
    fireEvent.change(steepTimeInput, { target: { value: '2' } });

    await waitFor(() => {
      // Should calculate and display results
      expect(resultValue('Bryggeforhold')).toBe('1:10,0');
      expect(resultValue('Total tid')).toBe('2:00');
    });
  });

  it('should handle maximum valid inputs', async () => {
    render(<FrenchPressTimer />);

    const coffeeInput = screen.getByLabelText(/^Kaffemengde/);
    const waterInput = screen.getByLabelText(/^Vannmengde/);
    const steepTimeInput = screen.getByLabelText(/^Trekketid/);

    fireEvent.change(coffeeInput, { target: { value: '100' } });
    fireEvent.change(waterInput, { target: { value: '2000' } });
    fireEvent.change(steepTimeInput, { target: { value: '10' } });

    await waitFor(() => {
      // Should calculate and display results
      expect(resultValue('Bryggeforhold')).toBe('1:20,0');
      expect(resultValue('Total tid')).toBe('10:00');
    });
  });
});
