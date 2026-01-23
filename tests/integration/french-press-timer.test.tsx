import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FrenchPressTimer } from '@/components/calculators/coffee/french-press-timer';

describe('FrenchPressTimer Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the calculator with default values', () => {
    render(<FrenchPressTimer />);

    expect(screen.getByText('French Press Timer')).toBeInTheDocument();
    expect(screen.getByLabelText('Coffee Dose')).toBeInTheDocument();
    expect(screen.getByLabelText('Water Amount')).toBeInTheDocument();
    expect(screen.getByLabelText('Steep Time')).toBeInTheDocument();
  });

  it('should display brew ratio with default values', () => {
    render(<FrenchPressTimer />);

    // Default: 30g coffee, 500g water = 1:16.7 ratio
    expect(screen.getByText('1:16.7')).toBeInTheDocument();
  });

  it('should display strength estimate', () => {
    render(<FrenchPressTimer />);

    // 1:16.7 ratio should be "Balanced"
    expect(screen.getByText(/Balanced/)).toBeInTheDocument();
  });

  it('should display timeline events', () => {
    render(<FrenchPressTimer />);

    // Should show bloom, stir, and press events
    expect(screen.getByText(/Bloom & Stir/)).toBeInTheDocument();
    expect(screen.getByText(/Stir Again/)).toBeInTheDocument();
    expect(screen.getByText(/Press & Serve/)).toBeInTheDocument();
  });

  it('should display correct event times', () => {
    render(<FrenchPressTimer />);

    // Bloom at 0:30, Stir at 2:00 (halfway of 4 min), Press at 4:00
    expect(screen.getByText('0:30')).toBeInTheDocument();
    expect(screen.getByText('2:00')).toBeInTheDocument();
    expect(screen.getByText('4:00')).toBeInTheDocument();
  });

  it('should display total time', () => {
    render(<FrenchPressTimer />);

    // Default 4 minutes
    expect(screen.getByText('4:00')).toBeInTheDocument();
  });

  it('should show start button initially', () => {
    render(<FrenchPressTimer />);

    const startButton = screen.getByRole('button', { name: /start timer/i });
    expect(startButton).toBeInTheDocument();
  });

  it('should start timer when start button is clicked', async () => {
    render(<FrenchPressTimer />);

    const startButton = screen.getByRole('button', { name: /start timer/i });
    fireEvent.click(startButton);

    // Should show pause button
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    });
  });

  it('should update timer display when running', async () => {
    render(<FrenchPressTimer />);

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

  it('should show next event when timer is running', async () => {
    render(<FrenchPressTimer />);

    const startButton = screen.getByRole('button', { name: /start timer/i });
    fireEvent.click(startButton);

    // Should show next event (Bloom & Stir at 0:30)
    await waitFor(() => {
      expect(screen.getByText(/Next: Bloom & Stir/)).toBeInTheDocument();
    });
  });

  it('should pause timer when pause button is clicked', async () => {
    render(<FrenchPressTimer />);

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
    render(<FrenchPressTimer />);

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

  it('should update brew ratio when coffee dose changes', async () => {
    render(<FrenchPressTimer />);

    const coffeeInput = screen.getByLabelText('Coffee Dose');
    fireEvent.change(coffeeInput, { target: { value: '40' } });

    await waitFor(() => {
      // 40g coffee, 500g water = 1:12.5 ratio
      expect(screen.getByText('1:12.5')).toBeInTheDocument();
    });
  });

  it('should update strength estimate when ratio changes', async () => {
    render(<FrenchPressTimer />);

    const coffeeInput = screen.getByLabelText('Coffee Dose');
    fireEvent.change(coffeeInput, { target: { value: '40' } });

    await waitFor(() => {
      // 1:12.5 ratio should be "Strong"
      expect(screen.getByText(/Strong/)).toBeInTheDocument();
    });
  });

  it('should update stir time when steep time changes', async () => {
    render(<FrenchPressTimer />);

    const steepTimeInput = screen.getByLabelText('Steep Time');
    fireEvent.change(steepTimeInput, { target: { value: '6' } });

    await waitFor(() => {
      // Stir at halfway point of 6 minutes = 3:00
      expect(screen.getByText('3:00')).toBeInTheDocument();
    });
  });

  it('should show brewing instructions', () => {
    render(<FrenchPressTimer />);

    expect(screen.getByText(/Preheat French press/)).toBeInTheDocument();
    expect(screen.getByText(/Press plunger slowly/)).toBeInTheDocument();
  });

  it('should show progress bar', () => {
    render(<FrenchPressTimer />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });

  it('should update progress bar as timer runs', async () => {
    render(<FrenchPressTimer />);

    const startButton = screen.getByRole('button', { name: /start timer/i });
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

    const startButton = screen.getByRole('button', { name: /start timer/i });
    fireEvent.click(startButton);

    // Advance timer to completion (240 seconds)
    vi.advanceTimersByTime(240000);

    await waitFor(() => {
      expect(screen.getByText(/Brewing Complete/)).toBeInTheDocument();
    });
  });

  it('should show French press tips', () => {
    render(<FrenchPressTimer />);

    expect(screen.getByText(/French Press Tips/)).toBeInTheDocument();
    expect(screen.getByText(/Use coarse grind/)).toBeInTheDocument();
    expect(screen.getByText(/Water temperature: 195-205°F/)).toBeInTheDocument();
  });

  it('should handle validation errors for coffee dose', async () => {
    render(<FrenchPressTimer />);

    const coffeeInput = screen.getByLabelText('Coffee Dose');
    fireEvent.change(coffeeInput, { target: { value: '5' } });

    await waitFor(() => {
      // Should show error or not display results
      expect(screen.queryByText('1:16.7')).not.toBeInTheDocument();
    });
  });

  it('should handle validation errors for water amount', async () => {
    render(<FrenchPressTimer />);

    const waterInput = screen.getByLabelText('Water Amount');
    fireEvent.change(waterInput, { target: { value: '50' } });

    await waitFor(() => {
      // Should show error or not display results
      expect(screen.queryByText('1:16.7')).not.toBeInTheDocument();
    });
  });

  it('should handle validation errors for steep time', async () => {
    render(<FrenchPressTimer />);

    const steepTimeInput = screen.getByLabelText('Steep Time');
    fireEvent.change(steepTimeInput, { target: { value: '1' } });

    await waitFor(() => {
      // Should show error or not display results
      expect(screen.queryByText('1:16.7')).not.toBeInTheDocument();
    });
  });

  it('should show active event indicator when event time is reached', async () => {
    render(<FrenchPressTimer />);

    const startButton = screen.getByRole('button', { name: /start timer/i });
    fireEvent.click(startButton);

    // Advance timer to bloom time (30 seconds)
    vi.advanceTimersByTime(30000);

    await waitFor(() => {
      // Should show "Now: Bloom & Stir"
      expect(screen.getByText(/Now: Bloom & Stir/)).toBeInTheDocument();
    });
  });

  it('should advance to next event after current event completes', async () => {
    render(<FrenchPressTimer />);

    const startButton = screen.getByRole('button', { name: /start timer/i });
    fireEvent.click(startButton);

    // Advance timer past bloom (35 seconds)
    vi.advanceTimersByTime(35000);

    await waitFor(() => {
      // Should show next event (Stir Again)
      expect(screen.getByText(/Next: Stir Again/)).toBeInTheDocument();
    });
  });

  it('should show time remaining until next event', async () => {
    render(<FrenchPressTimer />);

    const startButton = screen.getByRole('button', { name: /start timer/i });
    fireEvent.click(startButton);

    // Should show time remaining until bloom (30 seconds)
    await waitFor(() => {
      expect(screen.getByText(/0:30 remaining/)).toBeInTheDocument();
    });
  });

  it('should handle minimum valid inputs', async () => {
    render(<FrenchPressTimer />);

    const coffeeInput = screen.getByLabelText('Coffee Dose');
    const waterInput = screen.getByLabelText('Water Amount');
    const steepTimeInput = screen.getByLabelText('Steep Time');

    fireEvent.change(coffeeInput, { target: { value: '10' } });
    fireEvent.change(waterInput, { target: { value: '100' } });
    fireEvent.change(steepTimeInput, { target: { value: '2' } });

    await waitFor(() => {
      // Should calculate and display results
      expect(screen.getByText('1:10.0')).toBeInTheDocument();
      expect(screen.getByText('2:00')).toBeInTheDocument();
    });
  });

  it('should handle maximum valid inputs', async () => {
    render(<FrenchPressTimer />);

    const coffeeInput = screen.getByLabelText('Coffee Dose');
    const waterInput = screen.getByLabelText('Water Amount');
    const steepTimeInput = screen.getByLabelText('Steep Time');

    fireEvent.change(coffeeInput, { target: { value: '100' } });
    fireEvent.change(waterInput, { target: { value: '2000' } });
    fireEvent.change(steepTimeInput, { target: { value: '10' } });

    await waitFor(() => {
      // Should calculate and display results
      expect(screen.getByText('1:20.0')).toBeInTheDocument();
      expect(screen.getByText('10:00')).toBeInTheDocument();
    });
  });
});
