'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResultDisplay } from '@/components/ui/result-display';
import {
  generateRandomDelay,
  calculateReactionTime,
  calculateReactionTimeStats,
  classifyReactionTime,
  getClassificationDescription,
  getPercentileRank,
  type ReactionTimeResult,
  type ReactionTimeStats,
} from '@/lib/calculations/gaming/reaction-time';

type TestState = 'idle' | 'waiting' | 'ready' | 'clicked' | 'too-early';

export function ReactionTimeTest() {
  const [state, setState] = React.useState<TestState>('idle');
  const [results, setResults] = React.useState<ReactionTimeResult[]>([]);
  const [currentResult, setCurrentResult] = React.useState<ReactionTimeResult | null>(null);
  const [stats, setStats] = React.useState<ReactionTimeStats | null>(null);
  const [stimulusTime, setStimulusTime] = React.useState<number>(0);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const startTest = () => {
    setState('waiting');
    setCurrentResult(null);
    
    const delay = generateRandomDelay();
    timeoutRef.current = setTimeout(() => {
      setStimulusTime(performance.now());
      setState('ready');
    }, delay);
  };

  const handleClick = () => {
    if (state === 'idle') {
      startTest();
      return;
    }

    if (state === 'waiting') {
      // Clicked too early
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setState('too-early');
      const result: ReactionTimeResult = {
        reactionTime: 0,
        startTime: 0,
        endTime: 0,
        isValid: false,
      };
      setCurrentResult(result);
      setResults(prev => [...prev, result]);
      return;
    }

    if (state === 'ready') {
      const endTime = performance.now();
      const result = calculateReactionTime(stimulusTime, endTime);
      setCurrentResult(result);
      setResults(prev => {
        const newResults = [...prev, result];
        setStats(calculateReactionTimeStats(newResults));
        return newResults;
      });
      setState('clicked');
    }
  };

  const resetTest = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setState('idle');
    setCurrentResult(null);
  };

  const resetAll = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setState('idle');
    setResults([]);
    setCurrentResult(null);
    setStats(null);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getBackgroundColor = () => {
    switch (state) {
      case 'waiting': return 'bg-red-500';
      case 'ready': return 'bg-green-500';
      case 'too-early': return 'bg-yellow-500';
      case 'clicked': return 'bg-blue-500';
      default: return 'bg-muted';
    }
  };

  const getMessage = () => {
    switch (state) {
      case 'idle': return 'Click to Start';
      case 'waiting': return 'Wait for green...';
      case 'ready': return 'Click NOW!';
      case 'too-early': return 'Too early! Click to try again';
      case 'clicked': return currentResult ? `${currentResult.reactionTime.toFixed(0)} ms` : '';
      default: return '';
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'exceptional': return 'text-purple-600';
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'average': return 'text-yellow-600';
      case 'below-average': return 'text-orange-600';
      case 'slow': return 'text-red-600';
      default: return '';
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Reaction Time Test</CardTitle>
        <CardDescription>
          Test your reaction speed. Click when the screen turns green.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Area */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              handleClick();
            }
          }}
          className={`
            ${getBackgroundColor()}
            h-64 rounded-lg flex items-center justify-center cursor-pointer
            transition-colors duration-100 select-none
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
          `}
          aria-label={getMessage()}
        >
          <span className={`text-2xl font-bold ${state === 'waiting' || state === 'ready' ? 'text-white' : ''}`}>
            {getMessage()}
          </span>
        </div>

        {/* Current Result */}
        {currentResult && currentResult.isValid && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <ResultDisplay
                label="Reaction Time"
                value={`${currentResult.reactionTime.toFixed(0)}`}
                unit="ms"
                highlight
              />
              <ResultDisplay
                label="Percentile"
                value={`${getPercentileRank(currentResult.reactionTime).toFixed(0)}`}
                unit="%"
              />
            </div>
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm">
                <span className={`font-medium ${getClassificationColor(classifyReactionTime(currentResult.reactionTime))}`}>
                  {classifyReactionTime(currentResult.reactionTime).replace('-', ' ').toUpperCase()}
                </span>
                {' - '}
                {getClassificationDescription(classifyReactionTime(currentResult.reactionTime))}
              </p>
            </div>
          </div>
        )}

        {/* Statistics */}
        {stats && stats.validAttempts > 0 && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Statistics ({stats.validAttempts} attempts)</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ResultDisplay
                label="Average"
                value={`${stats.average.toFixed(0)}`}
                unit="ms"
              />
              <ResultDisplay
                label="Best"
                value={`${stats.best.toFixed(0)}`}
                unit="ms"
              />
              <ResultDisplay
                label="Worst"
                value={`${stats.worst.toFixed(0)}`}
                unit="ms"
              />
              <ResultDisplay
                label="Std Dev"
                value={`${stats.standardDeviation.toFixed(0)}`}
                unit="ms"
              />
            </div>
            {stats.invalidAttempts > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                {stats.invalidAttempts} early click{stats.invalidAttempts > 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        {/* Recent Results */}
        {results.length > 0 && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Recent Results</p>
            <div className="flex flex-wrap gap-2">
              {results.slice(-10).map((result, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 text-xs rounded ${
                    result.isValid
                      ? 'bg-muted'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {result.isValid ? `${result.reactionTime.toFixed(0)} ms` : 'Early'}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {(state === 'clicked' || state === 'too-early') && (
            <Button onClick={startTest}>
              Try Again
            </Button>
          )}
          {results.length > 0 && (
            <Button variant="outline" onClick={resetAll}>
              Reset All
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">How to play:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click the box or press Space/Enter to start</li>
            <li>Wait for the box to turn green</li>
            <li>Click as fast as you can when it turns green</li>
            <li>Don&apos;t click too early or it won&apos;t count!</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}

export default ReactionTimeTest;
