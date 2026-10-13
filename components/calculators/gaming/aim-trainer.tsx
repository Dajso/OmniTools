'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResultDisplay } from '@/components/ui/result-display';
import { SelectInput } from '@/components/ui/select-input';
import { formatFixed } from '@/lib/utils/formatting';

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  spawnTime: number;
}

interface GameStats {
  hits: number;
  misses: number;
  totalTargets: number;
  reactionTimes: number[];
  accuracy: number;
  averageReactionTime: number;
  score: number;
}

type GameState = 'idle' | 'playing' | 'finished';
type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme';

const DIFFICULTY_SETTINGS: Record<Difficulty, { targetSize: number; spawnInterval: number; duration: number }> = {
  easy: { targetSize: 60, spawnInterval: 1500, duration: 30 },
  medium: { targetSize: 45, spawnInterval: 1000, duration: 30 },
  hard: { targetSize: 30, spawnInterval: 750, duration: 30 },
  extreme: { targetSize: 20, spawnInterval: 500, duration: 30 },
};

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy (Large targets, slow)' },
  { value: 'medium', label: 'Medium (Normal targets)' },
  { value: 'hard', label: 'Hard (Small targets, fast)' },
  { value: 'extreme', label: 'Extreme (Tiny targets, very fast)' },
];

export function AimTrainer() {
  const [gameState, setGameState] = React.useState<GameState>('idle');
  const [difficulty, setDifficulty] = React.useState<Difficulty>('medium');
  const [targets, setTargets] = React.useState<Target[]>([]);
  const [stats, setStats] = React.useState<GameStats>({
    hits: 0,
    misses: 0,
    totalTargets: 0,
    reactionTimes: [],
    accuracy: 0,
    averageReactionTime: 0,
    score: 0,
  });
  const [timeLeft, setTimeLeft] = React.useState(30);
  
  const gameAreaRef = React.useRef<HTMLDivElement>(null);
  const targetIdRef = React.useRef(0);
  const spawnIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const gameTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const settings = DIFFICULTY_SETTINGS[difficulty];

  const spawnTarget = React.useCallback(() => {
    if (!gameAreaRef.current) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const padding = settings.targetSize;
    
    const x = Math.random() * (rect.width - padding * 2) + padding;
    const y = Math.random() * (rect.height - padding * 2) + padding;
    
    const newTarget: Target = {
      id: targetIdRef.current++,
      x,
      y,
      size: settings.targetSize,
      spawnTime: performance.now(),
    };
    
    setTargets(prev => [...prev, newTarget]);
    setStats(prev => ({ ...prev, totalTargets: prev.totalTargets + 1 }));
  }, [settings.targetSize]);

  const startGame = () => {
    setGameState('playing');
    setTargets([]);
    setStats({
      hits: 0,
      misses: 0,
      totalTargets: 0,
      reactionTimes: [],
      accuracy: 0,
      averageReactionTime: 0,
      score: 0,
    });
    setTimeLeft(settings.duration);
    targetIdRef.current = 0;

    // Spawn first target immediately
    setTimeout(spawnTarget, 100);

    // Set up spawn interval
    spawnIntervalRef.current = setInterval(spawnTarget, settings.spawnInterval);

    // Set up game timer
    gameTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = React.useCallback(() => {
    setGameState('finished');
    
    if (spawnIntervalRef.current) {
      clearInterval(spawnIntervalRef.current);
    }
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
    
    setTargets([]);
    
    setStats(prev => {
      const accuracy = prev.totalTargets > 0 
        ? (prev.hits / prev.totalTargets) * 100 
        : 0;
      const avgReaction = prev.reactionTimes.length > 0
        ? prev.reactionTimes.reduce((a, b) => a + b, 0) / prev.reactionTimes.length
        : 0;
      const score = Math.round(prev.hits * 100 * (accuracy / 100) * (1000 / Math.max(avgReaction, 100)));
      
      return {
        ...prev,
        accuracy,
        averageReactionTime: avgReaction,
        score,
      };
    });
  }, []);

  const handleTargetClick = (target: Target, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const reactionTime = performance.now() - target.spawnTime;
    
    setTargets(prev => prev.filter(t => t.id !== target.id));
    setStats(prev => ({
      ...prev,
      hits: prev.hits + 1,
      reactionTimes: [...prev.reactionTimes, reactionTime],
    }));
  };

  const handleMiss = () => {
    if (gameState === 'playing') {
      setStats(prev => ({ ...prev, misses: prev.misses + 1 }));
    }
  };

  React.useEffect(() => {
    return () => {
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, []);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Aim Trainer</CardTitle>
        <CardDescription>
          Click the targets as fast as you can to improve your aim
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {gameState === 'idle' && (
          <div className="space-y-4">
            <SelectInput
              id="difficulty"
              label="Difficulty"
              value={difficulty}
              onChange={(v) => setDifficulty(v as Difficulty)}
              options={DIFFICULTY_OPTIONS}
            />
            <Button onClick={startGame} className="w-full">
              Start Game
            </Button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Time: {timeLeft}s</span>
              <span>Hits: {stats.hits}</span>
              <span>Misses: {stats.misses}</span>
            </div>
          </div>
        )}

        {/* Game Area */}
        {(gameState === 'playing' || gameState === 'idle') && (
          <div
            ref={gameAreaRef}
            onClick={handleMiss}
            className={`
              relative h-96 rounded-lg border-2 border-dashed
              ${gameState === 'playing' ? 'bg-slate-900 cursor-crosshair' : 'bg-muted'}
            `}
            style={{ touchAction: 'none' }}
          >
            {gameState === 'idle' && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                Click Start Game to begin
              </div>
            )}
            
            {targets.map(target => (
              <button
                key={target.id}
                onClick={(e) => handleTargetClick(target, e)}
                className="absolute rounded-full bg-red-500 hover:bg-red-400 transition-colors"
                style={{
                  width: target.size,
                  height: target.size,
                  left: target.x - target.size / 2,
                  top: target.y - target.size / 2,
                  boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
                }}
                aria-label="Target"
              />
            ))}
          </div>
        )}

        {/* Results */}
        {gameState === 'finished' && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="text-3xl font-bold">{stats.score}</p>
              <p className="text-muted-foreground">Final Score</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <ResultDisplay
                label="Accuracy"
                value={`${formatFixed(stats.accuracy, 1)}`}
                unit="%"
                highlight
              />
              <ResultDisplay
                label="Avg Reaction"
                value={`${formatFixed(stats.averageReactionTime, 0)}`}
                unit="ms"
              />
              <ResultDisplay
                label="Hits"
                value={stats.hits.toString()}
              />
              <ResultDisplay
                label="Misses"
                value={stats.misses.toString()}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={startGame} className="flex-1">
                Play Again
              </Button>
              <Button variant="outline" onClick={() => setGameState('idle')}>
                Change Difficulty
              </Button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">How to play:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Click on the red targets as fast as you can</li>
            <li>Missing a target or clicking empty space counts as a miss</li>
            <li>Your score is based on accuracy and reaction time</li>
            <li>Higher difficulty = smaller targets and faster spawns</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default AimTrainer;
