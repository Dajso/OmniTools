'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResultDisplay } from '@/components/ui/result-display';
import { formatFixed } from '@/lib/utils/formatting';

type TestState = 'idle' | 'running' | 'complete';

interface TestResult {
  measuredFps: number;
  estimatedHz: number;
  frameCount: number;
  duration: number;
  consistency: number;
}

export function MonitorHzTester() {
  const [testState, setTestState] = React.useState<TestState>('idle');
  const [result, setResult] = React.useState<TestResult | null>(null);
  const [currentFps, setCurrentFps] = React.useState(0);
  const [boxPosition, setBoxPosition] = React.useState(0);
  
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animationRef = React.useRef<number>(0);
  const frameTimesRef = React.useRef<number[]>([]);
  const startTimeRef = React.useRef<number>(0);
  const frameCountRef = React.useRef<number>(0);

  const startTest = () => {
    setTestState('running');
    setResult(null);
    frameTimesRef.current = [];
    frameCountRef.current = 0;
    startTimeRef.current = performance.now();

    const animate = (timestamp: number) => {
      frameCountRef.current++;
      frameTimesRef.current.push(timestamp);

      // Update box position for visual feedback
      const elapsed = timestamp - startTimeRef.current;
      const position = (elapsed / 10) % 100;
      setBoxPosition(position);

      // Calculate current FPS every 500ms
      if (frameTimesRef.current.length > 30) {
        const recentFrames = frameTimesRef.current.slice(-30);
        const timeDiff = recentFrames[recentFrames.length - 1] - recentFrames[0];
        const fps = (recentFrames.length - 1) / (timeDiff / 1000);
        setCurrentFps(Math.round(fps));
      }

      // Run test for 5 seconds
      if (elapsed < 5000) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        finishTest();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const finishTest = () => {
    const frameTimes = frameTimesRef.current;
    const duration = frameTimes[frameTimes.length - 1] - frameTimes[0];
    const frameCount = frameTimes.length - 1;
    const measuredFps = frameCount / (duration / 1000);

    // Calculate frame time consistency
    const frameDeltas: number[] = [];
    for (let i = 1; i < frameTimes.length; i++) {
      frameDeltas.push(frameTimes[i] - frameTimes[i - 1]);
    }
    const avgDelta = frameDeltas.reduce((a, b) => a + b, 0) / frameDeltas.length;
    const variance = frameDeltas.reduce((sum, delta) => sum + Math.pow(delta - avgDelta, 2), 0) / frameDeltas.length;
    const stdDev = Math.sqrt(variance);
    const consistency = Math.max(0, 100 - (stdDev / avgDelta) * 100);

    // Estimate monitor Hz based on measured FPS
    const commonRefreshRates = [60, 75, 90, 100, 120, 144, 165, 180, 200, 240, 280, 300, 360];
    let estimatedHz = commonRefreshRates.reduce((prev, curr) => 
      Math.abs(curr - measuredFps) < Math.abs(prev - measuredFps) ? curr : prev
    );

    setResult({
      measuredFps: Math.round(measuredFps * 10) / 10,
      estimatedHz,
      frameCount,
      duration: Math.round(duration),
      consistency: Math.round(consistency),
    });
    setTestState('complete');
  };

  const stopTest = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setTestState('idle');
    setBoxPosition(0);
    setCurrentFps(0);
  };

  React.useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const getHzColor = (hz: number) => {
    if (hz >= 240) return 'text-purple-600';
    if (hz >= 144) return 'text-green-600';
    if (hz >= 120) return 'text-blue-600';
    if (hz >= 75) return 'text-cyan-600';
    return 'text-yellow-600';
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Monitor Refresh Rate Tester</CardTitle>
        <CardDescription>
          Test your monitor&apos;s actual refresh rate using requestAnimationFrame
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Area */}
        <div className="relative h-32 bg-slate-900 rounded-lg overflow-hidden">
          {/* Moving box for visual feedback */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-green-500 rounded"
            style={{
              left: `${boxPosition}%`,
              transition: testState === 'running' ? 'none' : 'left 0.3s',
            }}
          />
          
          {/* FPS Counter */}
          {testState === 'running' && (
            <div className="absolute top-2 right-2 text-white text-sm font-mono">
              {currentFps} FPS
            </div>
          )}

          {/* Status Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            {testState === 'idle' && (
              <span className="text-white/50">Click Start to begin test</span>
            )}
            {testState === 'running' && (
              <span className="text-white/50">Testing... Watch the moving box</span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {testState === 'idle' && (
            <Button onClick={startTest} className="flex-1">
              Start Test
            </Button>
          )}
          {testState === 'running' && (
            <Button onClick={stopTest} variant="destructive" className="flex-1">
              Stop Test
            </Button>
          )}
          {testState === 'complete' && (
            <>
              <Button onClick={startTest} className="flex-1">
                Test Again
              </Button>
              <Button onClick={() => setTestState('idle')} variant="outline">
                Reset
              </Button>
            </>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4 border-t pt-4">
            <div className="text-center">
              <p className={`text-4xl font-bold ${getHzColor(result.estimatedHz)}`}>
                {result.estimatedHz} Hz
              </p>
              <p className="text-muted-foreground">Estimated Refresh Rate</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ResultDisplay
                label="Measured FPS"
                value={result.measuredFps.toString()}
              />
              <ResultDisplay
                label="Frame Consistency"
                value={`${result.consistency}`}
                unit="%"
              />
              <ResultDisplay
                label="Frames Rendered"
                value={result.frameCount.toString()}
              />
              <ResultDisplay
                label="Test Duration"
                value={`${formatFixed((result.duration / 1000), 1)}`}
                unit="s"
              />
            </div>

            {/* Interpretation */}
            <div className="bg-muted/50 p-3 rounded-md text-sm">
              {result.consistency >= 90 ? (
                <p className="text-green-600">
                  ✓ Excellent frame consistency! Your display is running smoothly.
                </p>
              ) : result.consistency >= 70 ? (
                <p className="text-yellow-600">
                  ⚠ Good frame consistency. Some minor frame time variations detected.
                </p>
              ) : (
                <p className="text-red-600">
                  ✗ Frame consistency is low. This could indicate V-Sync issues, background processes, or browser limitations.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Common Refresh Rates Reference */}
        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-2">Common Refresh Rates</p>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="text-center p-2 bg-muted rounded">
              <p className="font-bold">60 Hz</p>
              <p className="text-muted-foreground">Standard</p>
            </div>
            <div className="text-center p-2 bg-muted rounded">
              <p className="font-bold text-cyan-600">120 Hz</p>
              <p className="text-muted-foreground">Gaming</p>
            </div>
            <div className="text-center p-2 bg-muted rounded">
              <p className="font-bold text-green-600">144 Hz</p>
              <p className="text-muted-foreground">Popular</p>
            </div>
            <div className="text-center p-2 bg-muted rounded">
              <p className="font-bold text-purple-600">240 Hz</p>
              <p className="text-muted-foreground">Pro</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">Notes:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Close other browser tabs for more accurate results</li>
            <li>Browser FPS is capped by your monitor&apos;s refresh rate</li>
            <li>Results may vary based on browser and system load</li>
            <li>For best accuracy, run the test multiple times</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default MonitorHzTester;
