'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { Card } from '@/components/ui/card';
import { formatFixed } from '@/lib/utils/formatting';

const PHI = 1.618033988749895;

type OverlayType = 'spiral' | 'grid' | 'triangles' | 'diagonal';

const OVERLAY_OPTIONS = [
  { value: 'spiral', label: 'Golden Spiral' },
  { value: 'grid', label: 'Phi Grid' },
  { value: 'triangles', label: 'Golden Triangles' },
  { value: 'diagonal', label: 'Diagonal Method' },
];

const ASPECT_PRESETS = [
  { name: '3:2', width: 3, height: 2 },
  { name: '4:3', width: 4, height: 3 },
  { name: '16:9', width: 16, height: 9 },
  { name: '1:1', width: 1, height: 1 },
];

interface GoldenRatioOverlayProps {
  width: number;
  height: number;
  type: OverlayType;
  flip: boolean;
  rotate: number;
}

function GoldenSpiralSVG({ width, height, flip, rotate }: Omit<GoldenRatioOverlayProps, 'type'>) {
  const transform = `${flip ? 'scale(-1, 1)' : ''} rotate(${rotate} ${width/2} ${height/2})`;
  
  // Generate golden spiral arcs
  const generateSpiral = () => {
    const paths: string[] = [];
    let x = 0, y = 0;
    let w = width, h = height;
    
    for (let i = 0; i < 8; i++) {
      const size = i % 2 === 0 ? w / PHI : h / PHI;
      const startAngle = (i * 90) % 360;
      
      // Simplified spiral representation using quarter circles
      if (i % 4 === 0) {
        paths.push(`M ${x + w} ${y} A ${w} ${h} 0 0 1 ${x} ${y + h}`);
      }
      
      // Update dimensions for next iteration
      if (i % 2 === 0) {
        w = w / PHI;
      } else {
        h = h / PHI;
      }
    }
    
    return paths;
  };

  return (
    <g transform={transform} style={{ transformOrigin: 'center' }}>
      {/* Golden rectangles */}
      <rect x={0} y={0} width={width / PHI} height={height} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <rect x={width / PHI} y={0} width={width - width / PHI} height={height / PHI} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      
      {/* Spiral approximation */}
      <path
        d={`M ${width} 0 
            Q ${width} ${height * 0.6}, ${width * 0.6} ${height}
            Q ${width * 0.2} ${height}, 0 ${height * 0.6}
            Q 0 ${height * 0.3}, ${width * 0.25} ${height * 0.15}
            Q ${width * 0.4} 0, ${width * 0.5} ${height * 0.2}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </g>
  );
}

function PhiGridSVG({ width, height }: { width: number; height: number }) {
  const v1 = width / PHI;
  const v2 = width - v1;
  const h1 = height / PHI;
  const h2 = height - h1;

  return (
    <g>
      {/* Vertical lines */}
      <line x1={v2} y1={0} x2={v2} y2={height} stroke="currentColor" strokeWidth="1" />
      <line x1={v1} y1={0} x2={v1} y2={height} stroke="currentColor" strokeWidth="1" />
      {/* Horizontal lines */}
      <line x1={0} y1={h2} x2={width} y2={h2} stroke="currentColor" strokeWidth="1" />
      <line x1={0} y1={h1} x2={width} y2={h1} stroke="currentColor" strokeWidth="1" />
      {/* Power points */}
      <circle cx={v2} cy={h2} r="4" fill="currentColor" opacity="0.7" />
      <circle cx={v2} cy={h1} r="4" fill="currentColor" opacity="0.7" />
      <circle cx={v1} cy={h2} r="4" fill="currentColor" opacity="0.7" />
      <circle cx={v1} cy={h1} r="4" fill="currentColor" opacity="0.7" />
    </g>
  );
}

function GoldenTrianglesSVG({ width, height, flip }: { width: number; height: number; flip: boolean }) {
  const transform = flip ? `scale(-1, 1) translate(-${width}, 0)` : '';
  
  return (
    <g transform={transform}>
      {/* Main diagonal */}
      <line x1={0} y1={height} x2={width} y2={0} stroke="currentColor" strokeWidth="2" />
      {/* Perpendicular from top-left */}
      <line x1={0} y1={0} x2={width * 0.618} y2={height * 0.382} stroke="currentColor" strokeWidth="1" />
      {/* Perpendicular from bottom-right */}
      <line x1={width} y1={height} x2={width * 0.382} y2={height * 0.618} stroke="currentColor" strokeWidth="1" />
    </g>
  );
}

function DiagonalMethodSVG({ width, height }: { width: number; height: number }) {
  return (
    <g>
      {/* Main diagonals */}
      <line x1={0} y1={0} x2={width} y2={height} stroke="currentColor" strokeWidth="1" />
      <line x1={width} y1={0} x2={0} y2={height} stroke="currentColor" strokeWidth="1" />
      {/* Corner to opposite edge midpoint */}
      <line x1={0} y1={0} x2={width} y2={height/2} stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1={0} y1={0} x2={width/2} y2={height} stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1={width} y1={0} x2={0} y2={height/2} stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1={width} y1={0} x2={width/2} y2={height} stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </g>
  );
}

export function GoldenRatioOverlay() {
  const [width, setWidth] = React.useState(600);
  const [height, setHeight] = React.useState(400);
  const [overlayType, setOverlayType] = React.useState<OverlayType>('spiral');
  const [flip, setFlip] = React.useState(false);
  const [rotate, setRotate] = React.useState(0);

  const reset = () => {
    setWidth(600);
    setHeight(400);
    setOverlayType('spiral');
    setFlip(false);
    setRotate(0);
  };

  const applyAspect = (aspectWidth: number, aspectHeight: number) => {
    const newHeight = Math.round((width * aspectHeight) / aspectWidth);
    setHeight(newHeight);
  };

  // Calculate display dimensions to fit in container
  const maxDisplayWidth = 400;
  const maxDisplayHeight = 300;
  const scale = Math.min(maxDisplayWidth / width, maxDisplayHeight / height);
  const displayWidth = width * scale;
  const displayHeight = height * scale;

  return (
    <CalculatorBase
      title="Golden Ratio Overlay Generator"
      description="Generate composition overlays based on the golden ratio (φ = 1.618)"
      formula="φ = (1 + √5) / 2 ≈ 1.618"
      formulaExplanation="The golden ratio creates naturally pleasing compositions in photography and art"
      onReset={reset}
      results={
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-md flex justify-center">
            <svg
              width={displayWidth}
              height={displayHeight}
              viewBox={`0 0 ${width} ${height}`}
              className="border border-border bg-background text-primary"
            >
              {/* Background */}
              <rect x={0} y={0} width={width} height={height} fill="none" stroke="currentColor" strokeWidth="2" />
              
              {/* Overlay based on type */}
              {overlayType === 'spiral' && (
                <GoldenSpiralSVG width={width} height={height} flip={flip} rotate={rotate} />
              )}
              {overlayType === 'grid' && (
                <PhiGridSVG width={width} height={height} />
              )}
              {overlayType === 'triangles' && (
                <GoldenTrianglesSVG width={width} height={height} flip={flip} />
              )}
              {overlayType === 'diagonal' && (
                <DiagonalMethodSVG width={width} height={height} />
              )}
            </svg>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Dimensions: </span>
              <span className="font-medium">{width} × {height} px</span>
            </div>
            <div>
              <span className="text-muted-foreground">Aspect Ratio: </span>
              <span className="font-medium">{formatFixed((width / height), 3)}:1</span>
            </div>
          </div>

          <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
            <p className="font-medium mb-1">Composition Tip</p>
            <p>Place key subjects at the intersection points (power points) for naturally balanced compositions.</p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="width"
            label="Width (pixels)"
            value={width}
            onChange={setWidth}
            min={100}
            max={10000}
            step={10}
          />
          <NumberInput
            id="height"
            label="Height (pixels)"
            value={height}
            onChange={setHeight}
            min={100}
            max={10000}
            step={10}
          />
        </div>

        <SelectInput
          id="overlay-type"
          label="Overlay Type"
          value={overlayType}
          onChange={(v) => setOverlayType(v as OverlayType)}
          options={OVERLAY_OPTIONS}
        />

        {(overlayType === 'spiral' || overlayType === 'triangles') && (
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={flip}
                onChange={(e) => setFlip(e.target.checked)}
                className="rounded border-input"
              />
              Flip Horizontal
            </label>
          </div>
        )}

        {overlayType === 'spiral' && (
          <div>
            <label className="text-sm font-medium mb-2 block">Rotation</label>
            <div className="flex gap-2">
              {[0, 90, 180, 270].map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => setRotate(deg)}
                  className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                    rotate === deg
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-muted border-input'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Aspect Ratio Presets</p>
          <div className="flex gap-2 flex-wrap">
            {ASPECT_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyAspect(preset.width, preset.height)}
                className="px-3 py-1 text-xs rounded-md border bg-background hover:bg-muted border-input transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Overlay Types</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Golden Spiral:</strong> Fibonacci spiral for leading lines</p>
            <p><strong>Phi Grid:</strong> Rule of thirds based on φ ratio</p>
            <p><strong>Golden Triangles:</strong> Diagonal composition guide</p>
            <p><strong>Diagonal Method:</strong> Dynamic symmetry lines</p>
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default GoldenRatioOverlay;
