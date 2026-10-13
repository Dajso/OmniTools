'use client';

import * as React from 'react';
import { TimerTemplate, type PomodoroConfig } from '@/components/templates/timer-template';
import { Card, CardContent } from '@/components/ui/card';
import { NumberInput } from '@/components/ui/number-input';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

const DEFAULT_CONFIG: PomodoroConfig = {
  workDuration: 25 * 60,    // 25 minutes
  shortBreak: 5 * 60,       // 5 minutes
  longBreak: 15 * 60,       // 15 minutes
  sessionsBeforeLongBreak: 4,
};

const PRESET_CONFIGS = [
  { label: 'Klassisk (25/5)', work: 25, short: 5, long: 15 },
  { label: 'Kort (15/3)', work: 15, short: 3, long: 10 },
  { label: 'Lang (50/10)', work: 50, short: 10, long: 30 },
  { label: 'Ekstra lang (90/20)', work: 90, short: 20, long: 45 },
];

export function PomodoroTimer() {
  const [showSettings, setShowSettings] = React.useState(false);
  const [config, setConfig] = React.useState<PomodoroConfig>(DEFAULT_CONFIG);
  const [workMinutes, setWorkMinutes] = React.useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = React.useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = React.useState(15);
  const [sessions, setSessions] = React.useState(4);
  const [key, setKey] = React.useState(0); // Force re-render of timer

  const applySettings = () => {
    setConfig({
      workDuration: workMinutes * 60,
      shortBreak: shortBreakMinutes * 60,
      longBreak: longBreakMinutes * 60,
      sessionsBeforeLongBreak: sessions,
    });
    setKey(prev => prev + 1); // Force timer to reset with new config
    setShowSettings(false);
  };

  const applyPreset = (preset: typeof PRESET_CONFIGS[0]) => {
    setWorkMinutes(preset.work);
    setShortBreakMinutes(preset.short);
    setLongBreakMinutes(preset.long);
    setConfig({
      workDuration: preset.work * 60,
      shortBreak: preset.short * 60,
      longBreak: preset.long * 60,
      sessionsBeforeLongBreak: sessions,
    });
    setKey(prev => prev + 1);
    setShowSettings(false);
  };

  const handleComplete = () => {
    // Play notification sound if available
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Pomodoro-timer', {
          body: 'Tid for pause, eller for å komme i gang igjen!',
          icon: '/favicon.ico',
        });
      }
    }
    
    // Try to play a sound
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQAA');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch {
      // Ignore audio errors
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="gap-2"
        >
          <Settings className="h-4 w-4" />
          Innstillinger
        </Button>
      </div>

      {showSettings && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {PRESET_CONFIGS.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <NumberInput
                id="workMinutes"
                label="Arbeidsøkt"
                value={workMinutes}
                onChange={setWorkMinutes}
                min={1}
                max={120}
                step={1}
                unit="min"
              />
              <NumberInput
                id="shortBreak"
                label="Kort pause"
                value={shortBreakMinutes}
                onChange={setShortBreakMinutes}
                min={1}
                max={30}
                step={1}
                unit="min"
              />
              <NumberInput
                id="longBreak"
                label="Lang pause"
                value={longBreakMinutes}
                onChange={setLongBreakMinutes}
                min={1}
                max={60}
                step={1}
                unit="min"
              />
              <NumberInput
                id="sessions"
                label="Økter før lang pause"
                value={sessions}
                onChange={setSessions}
                min={1}
                max={10}
                step={1}
              />
            </div>

            <Button onClick={applySettings} className="w-full">
              Bruk innstillinger
            </Button>
          </CardContent>
        </Card>
      )}

      <TimerTemplate
        key={key}
        title="Pomodoro-timer"
        description="Hold fokus med pomodoro-teknikken – arbeid konsentrert i økter med faste pauser"
        mode="pomodoro"
        pomodoroConfig={config}
        showProgress
        onComplete={handleComplete}
      />

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-2">Gjeldende innstillinger</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div>Arbeid: {config.workDuration / 60} min</div>
            <div>Kort pause: {config.shortBreak / 60} min</div>
            <div>Lang pause: {config.longBreak / 60} min</div>
            <div>Økter: {config.sessionsBeforeLongBreak}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PomodoroTimer;
