'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResultDisplay } from '@/components/ui/result-display';
import {
  rollDice,
  formatRollResult,
  getMinRoll,
  getMaxRoll,
  getAverageRoll,
  STANDARD_DICE,
  type DiceRoll,
} from '@/lib/calculations/rpg/dice-roller';
import { formatFixed } from '@/lib/utils/formatting';

interface RollHistory {
  id: number;
  roll: DiceRoll;
  timestamp: Date;
}

export function DiceRoller() {
  const [notation, setNotation] = React.useState('1d20');
  const [currentRoll, setCurrentRoll] = React.useState<DiceRoll | null>(null);
  const [history, setHistory] = React.useState<RollHistory[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isRolling, setIsRolling] = React.useState(false);
  const rollIdRef = React.useRef(0);

  const handleRoll = async () => {
    setError(null);
    setIsRolling(true);

    // Animate dice rolling
    const animationDuration = 500;
    const animationSteps = 10;
    const stepDuration = animationDuration / animationSteps;

    for (let i = 0; i < animationSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      try {
        const tempRoll = rollDice(notation);
        setCurrentRoll(tempRoll);
      } catch {
        // Ignore errors during animation
      }
    }

    try {
      const result = rollDice(notation);
      setCurrentRoll(result);
      rollIdRef.current += 1;
      setHistory(prev => [
        { id: rollIdRef.current, roll: result, timestamp: new Date() },
        ...prev.slice(0, 19), // Keep last 20 rolls
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ugyldig terningnotasjon');
      setCurrentRoll(null);
    } finally {
      setIsRolling(false);
    }
  };

  const handleQuickRoll = (dice: number) => {
    setNotation(`1d${dice}`);
    setError(null);
    setIsRolling(true);

    setTimeout(() => {
      try {
        const result = rollDice(`1d${dice}`);
        setCurrentRoll(result);
        rollIdRef.current += 1;
        setHistory(prev => [
          { id: rollIdRef.current, roll: result, timestamp: new Date() },
          ...prev.slice(0, 19),
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Kastet mislyktes');
      } finally {
        setIsRolling(false);
      }
    }, 300);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const getDiceEmoji = (faces: number): string => {
    const emojis: Record<number, string> = {
      4: '🔺',
      6: '🎲',
      8: '💎',
      10: '🔟',
      12: '⬡',
      20: '🎯',
      100: '💯',
    };
    return emojis[faces] || '🎲';
  };

  let stats = null;
  try {
    stats = {
      min: getMinRoll(notation),
      max: getMaxRoll(notation),
      avg: getAverageRoll(notation),
    };
  } catch {
    // Invalid notation, no stats
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Terningkast</CardTitle>
        <CardDescription>
          Kast terninger med vanlig notasjon (for eksempel 2d6+3, 1d20, 4d6-2)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Roll Buttons */}
        <div>
          <Label className="text-sm text-muted-foreground mb-2 block">Hurtigkast</Label>
          <div className="flex flex-wrap gap-2">
            {STANDARD_DICE.map(dice => (
              <Button
                key={dice}
                variant="outline"
                size="sm"
                onClick={() => handleQuickRoll(dice)}
                disabled={isRolling}
                className="min-w-[60px]"
              >
                {getDiceEmoji(dice)} d{dice}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Notation Input */}
        <div className="space-y-2">
          <Label htmlFor="notation">Egen terningnotasjon</Label>
          <div className="flex gap-2">
            <Input
              id="notation"
              value={notation}
              onChange={(e) => setNotation(e.target.value)}
              placeholder="e.g., 2d6+3"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRoll();
              }}
            />
            <Button onClick={handleRoll} disabled={isRolling}>
              {isRolling ? 'Kaster …' : 'Kast'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Format: [antall]d[sider][+/-modifikator] (for eksempel 2d6+3, d20, 4d6-2)
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md" role="alert">
            {error}
          </div>
        )}

        {/* Current Roll Result */}
        {currentRoll && (
          <div className="space-y-4">
            {/* Animated Dice Display */}
            <div className={`
              bg-gradient-to-br from-primary/10 to-primary/5 
              rounded-xl p-6 text-center
              ${isRolling ? 'animate-pulse' : ''}
            `}>
              <div className="text-6xl font-bold text-primary mb-2">
                {currentRoll.total}
              </div>
              <div className="text-lg text-muted-foreground">
                {formatRollResult(currentRoll)}
              </div>
            </div>

            {/* Individual Dice Results */}
            <div className="flex flex-wrap justify-center gap-2">
              {currentRoll.results.map((result, index) => (
                <div
                  key={index}
                  className={`
                    w-12 h-12 rounded-lg flex items-center justify-center
                    text-lg font-bold border-2
                    ${result === currentRoll.faces ? 'bg-green-100 border-green-500 text-green-700' : ''}
                    ${result === 1 ? 'bg-red-100 border-red-500 text-red-700' : ''}
                    ${result !== currentRoll.faces && result !== 1 ? 'bg-muted border-border' : ''}
                    ${isRolling ? 'animate-bounce' : ''}
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {result}
                </div>
              ))}
              {currentRoll.modifier !== 0 && (
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold bg-blue-100 border-2 border-blue-500 text-blue-700">
                  {currentRoll.modifier > 0 ? '+' : ''}{currentRoll.modifier}
                </div>
              )}
            </div>

            {/* Roll Statistics */}
            {stats && (
              <div className="grid grid-cols-3 gap-3">
                <ResultDisplay label="Minimum" value={stats.min} />
                <ResultDisplay label="Gjennomsnitt" value={formatFixed(stats.avg, 1)} />
                <ResultDisplay label="Maksimum" value={stats.max} />
              </div>
            )}
          </div>
        )}

        {/* Roll History */}
        {history.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-medium">Kasthistorikk</p>
              <Button variant="ghost" size="sm" onClick={clearHistory}>
                Tøm
              </Button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-sm bg-muted/50 rounded px-3 py-2"
                >
                  <span className="font-mono">{item.roll.dice}</span>
                  <span className="text-muted-foreground">
                    [{item.roll.results.join(', ')}]
                    {item.roll.modifier !== 0 && (
                      <span className="text-blue-600">
                        {item.roll.modifier > 0 ? ' + ' : ' - '}
                        {Math.abs(item.roll.modifier)}
                      </span>
                    )}
                  </span>
                  <span className="font-bold text-primary">= {item.roll.total}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">Guide til terningnotasjon:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><code className="bg-muted px-1 rounded">d20</code> – kast én tjuesidet terning</li>
            <li><code className="bg-muted px-1 rounded">2d6</code> – kast to sekssidede terninger</li>
            <li><code className="bg-muted px-1 rounded">2d6+3</code> – kast 2d6 og legg til 3</li>
            <li><code className="bg-muted px-1 rounded">4d6-2</code> – kast 4d6 og trekk fra 2</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default DiceRoller;
