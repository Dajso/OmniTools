'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import {
  calculateProjectileMotion,
  GRAVITY_EARTH,
  GRAVITY_MOON,
  GRAVITY_MARS,
  type ProjectileMotionResult,
} from '@/lib/calculations/physics/projectile-motion';
import { formatFixed } from '@/lib/utils/formatting';

const gravityOptions = [
  { value: GRAVITY_EARTH.toString(), label: `Earth (${GRAVITY_EARTH} m/s²)` },
  { value: GRAVITY_MOON.toString(), label: `Moon (${GRAVITY_MOON} m/s²)` },
  { value: GRAVITY_MARS.toString(), label: `Mars (${GRAVITY_MARS} m/s²)` },
  { value: 'custom', label: 'Custom' },
];

function TrajectoryVisualization({ result }: { result: ProjectileMotionResult }) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 400, height: 250 });

  React.useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setDimensions({ width, height: Math.min(250, width * 0.6) });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { width, height } = dimensions;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const maxX = result.range * 1.1;
  const maxY = result.maxHeight * 1.3;

  const scaleX = (x: number) => padding.left + (x / maxX) * plotWidth;
  const scaleY = (y: number) => height - padding.bottom - (y / maxY) * plotHeight;

  const pathData = result.trajectory
    .map((point, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(point.x)} ${scaleY(point.y)}`)
    .join(' ');

  return (
    <div ref={containerRef} className="w-full">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="bg-muted/30 rounded-md"
        role="img"
        aria-label="Projectile trajectory visualization"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
          <React.Fragment key={fraction}>
            <line
              x1={padding.left}
              y1={scaleY(maxY * fraction)}
              x2={width - padding.right}
              y2={scaleY(maxY * fraction)}
              stroke="currentColor"
              strokeOpacity={0.1}
            />
            <line
              x1={scaleX(maxX * fraction)}
              y1={padding.top}
              x2={scaleX(maxX * fraction)}
              y2={height - padding.bottom}
              stroke="currentColor"
              strokeOpacity={0.1}
            />
          </React.Fragment>
        ))}

        {/* Axes */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="currentColor"
          strokeWidth={1}
        />
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="currentColor"
          strokeWidth={1}
        />

        {/* Axis labels */}
        <text
          x={width / 2}
          y={height - 5}
          textAnchor="middle"
          className="text-xs fill-muted-foreground"
        >
          Distance (m)
        </text>
        <text
          x={15}
          y={height / 2}
          textAnchor="middle"
          transform={`rotate(-90, 15, ${height / 2})`}
          className="text-xs fill-muted-foreground"
        >
          Height (m)
        </text>

        {/* Trajectory path */}
        <path
          d={pathData}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
        />

        {/* Max height marker */}
        <circle
          cx={scaleX(result.range / 2)}
          cy={scaleY(result.maxHeight)}
          r={4}
          fill="hsl(var(--primary))"
        />
        <text
          x={scaleX(result.range / 2) + 8}
          y={scaleY(result.maxHeight) - 8}
          className="text-xs fill-foreground"
        >
          Max: {formatFixed(result.maxHeight, 1)}m
        </text>

        {/* Range marker */}
        <circle
          cx={scaleX(result.range)}
          cy={scaleY(0)}
          r={4}
          fill="hsl(var(--destructive))"
        />
        <text
          x={scaleX(result.range) - 8}
          y={scaleY(0) - 8}
          textAnchor="end"
          className="text-xs fill-foreground"
        >
          {formatFixed(result.range, 1)}m
        </text>

        {/* Start point */}
        <circle
          cx={scaleX(0)}
          cy={scaleY(result.trajectory[0]?.y || 0)}
          r={4}
          fill="hsl(var(--primary))"
        />
      </svg>
    </div>
  );
}

export function ProjectileMotionCalculator() {
  const [initialVelocity, setInitialVelocity] = React.useState<string>('20');
  const [launchAngle, setLaunchAngle] = React.useState<string>('45');
  const [initialHeight, setInitialHeight] = React.useState<string>('0');
  const [gravityPreset, setGravityPreset] = React.useState<string>(GRAVITY_EARTH.toString());
  const [customGravity, setCustomGravity] = React.useState<string>('');
  const [result, setResult] = React.useState<ProjectileMotionResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const v0 = parseFloat(initialVelocity);
      const angle = parseFloat(launchAngle);
      const h0 = parseFloat(initialHeight) || 0;
      const g = gravityPreset === 'custom' 
        ? parseFloat(customGravity) 
        : parseFloat(gravityPreset);

      if (isNaN(v0) || isNaN(angle)) {
        setResult(null);
        return;
      }

      const res = calculateProjectileMotion({
        initialVelocity: v0,
        launchAngle: angle,
        initialHeight: h0,
        gravity: g,
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [initialVelocity, launchAngle, initialHeight, gravityPreset, customGravity]);

  const reset = () => {
    setInitialVelocity('20');
    setLaunchAngle('45');
    setInitialHeight('0');
    setGravityPreset(GRAVITY_EARTH.toString());
    setCustomGravity('');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Projectile Motion Calculator"
      description="Calculate trajectory, range, max height, and flight time"
      formula="R = v₀²sin(2θ)/g, H = v₀²sin²(θ)/(2g)"
      formulaExplanation="Calculate projectile motion parameters using standard kinematic equations"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <TrajectoryVisualization result={result} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ResultDisplay
              label="Range"
              value={result.formattedRange}
              copyable
            />
            <ResultDisplay
              label="Max Height"
              value={result.formattedMaxHeight}
              copyable
            />
            <ResultDisplay
              label="Flight Time"
              value={result.formattedFlightTime}
              copyable
            />
            <ResultDisplay
              label="Time to Max Height"
              value={`${formatFixed(result.timeToMaxHeight, 3)} s`}
              copyable
            />
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Velocity Components</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">v₀ₓ: </span>
                {formatFixed(result.initialVelocityX, 2)} m/s
              </div>
              <div>
                <span className="text-muted-foreground">v₀ᵧ: </span>
                {formatFixed(result.initialVelocityY, 2)} m/s
              </div>
              <div>
                <span className="text-muted-foreground">Impact v: </span>
                {formatFixed(result.impactVelocity, 2)} m/s
              </div>
              <div>
                <span className="text-muted-foreground">Impact angle: </span>
                {formatFixed(result.impactAngle, 1)}°
              </div>
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            id="initialVelocity"
            label="Initial Velocity"
            value={initialVelocity}
            onChange={setInitialVelocity}
            placeholder="m/s"
            min={0}
            step={1}
          />
          <NumberInput
            id="launchAngle"
            label="Launch Angle"
            value={launchAngle}
            onChange={setLaunchAngle}
            placeholder="degrees (0-90)"
            min={0}
            max={90}
            step={1}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            id="initialHeight"
            label="Initial Height (optional)"
            value={initialHeight}
            onChange={setInitialHeight}
            placeholder="meters"
            min={0}
            step={0.1}
          />
          <SelectInput
            id="gravity"
            label="Gravity"
            value={gravityPreset}
            onChange={setGravityPreset}
            options={gravityOptions}
          />
        </div>

        {gravityPreset === 'custom' && (
          <NumberInput
            id="customGravity"
            label="Custom Gravity"
            value={customGravity}
            onChange={setCustomGravity}
            placeholder="m/s²"
            min={0.1}
            step={0.1}
          />
        )}

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Projectile Motion Formulas</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <div>Range: R = v₀²sin(2θ)/g</div>
            <div>Max Height: H = v₀²sin²(θ)/(2g)</div>
            <div>Flight Time: T = 2v₀sin(θ)/g</div>
            <div>x(t) = v₀cos(θ)t</div>
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default ProjectileMotionCalculator;
