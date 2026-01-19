'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { NumberInput } from '@/components/ui/number-input';
import { Button } from '@/components/ui/button';
import { ResultDisplay } from '@/components/ui/result-display';
import {
  generateCircle,
  generateOval,
  getSphereLayerDiameters,
  type CircleGrid,
  type OvalGrid,
} from '@/lib/calculations/gaming/minecraft-circle';

type Shape = 'circle' | 'oval' | 'sphere';

export function MinecraftCircleGenerator() {
  const [shape, setShape] = React.useState<Shape>('circle');
  const [diameter, setDiameter] = React.useState(15);
  const [widthDiameter, setWidthDiameter] = React.useState(15);
  const [heightDiameter, setHeightDiameter] = React.useState(10);
  const [filled, setFilled] = React.useState(false);
  const [grid, setGrid] = React.useState<CircleGrid | OvalGrid | null>(null);
  const [sphereLayers, setSphereLayers] = React.useState<number[] | null>(null);
  const [currentLayer, setCurrentLayer] = React.useState(0);
  const [error, setError] = React.useState<string | undefined>();

  const generate = React.useCallback(() => {
    try {
      setError(undefined);
      
      if (shape === 'circle') {
        if (diameter < 1 || diameter > 128) {
          setError('Diameter must be between 1 and 128');
          return;
        }
        const result = generateCircle(diameter, filled);
        setGrid(result);
        setSphereLayers(null);
      } else if (shape === 'oval') {
        if (widthDiameter < 1 || widthDiameter > 128 || heightDiameter < 1 || heightDiameter > 128) {
          setError('Diameters must be between 1 and 128');
          return;
        }
        const result = generateOval(widthDiameter, heightDiameter, filled);
        setGrid(result);
        setSphereLayers(null);
      } else if (shape === 'sphere') {
        if (diameter < 1 || diameter > 64) {
          setError('Sphere diameter must be between 1 and 64');
          return;
        }
        const layers = getSphereLayerDiameters(diameter);
        setSphereLayers(layers);
        setCurrentLayer(Math.floor(layers.length / 2));
        // Generate the middle layer
        const middleLayerDiameter = layers[Math.floor(layers.length / 2)];
        if (middleLayerDiameter > 0) {
          const result = generateCircle(middleLayerDiameter, filled);
          setGrid(result);
        } else {
          setGrid(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation error');
      setGrid(null);
    }
  }, [shape, diameter, widthDiameter, heightDiameter, filled]);

  React.useEffect(() => {
    generate();
  }, [generate]);

  React.useEffect(() => {
    if (sphereLayers && sphereLayers[currentLayer] > 0) {
      const result = generateCircle(sphereLayers[currentLayer], filled);
      setGrid(result);
    } else if (sphereLayers) {
      setGrid(null);
    }
  }, [currentLayer, sphereLayers, filled]);

  const cellSize = grid ? Math.min(400 / Math.max(grid.width, grid.height), 20) : 20;

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Minecraft Circle Generator</CardTitle>
        <CardDescription>
          Generate pixel-perfect circles, ovals, and spheres for Minecraft building
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Shape Selection */}
        <div className="flex gap-2">
          <Button
            variant={shape === 'circle' ? 'default' : 'outline'}
            onClick={() => setShape('circle')}
            className="flex-1"
          >
            Circle
          </Button>
          <Button
            variant={shape === 'oval' ? 'default' : 'outline'}
            onClick={() => setShape('oval')}
            className="flex-1"
          >
            Oval
          </Button>
          <Button
            variant={shape === 'sphere' ? 'default' : 'outline'}
            onClick={() => setShape('sphere')}
            className="flex-1"
          >
            Sphere
          </Button>
        </div>

        {/* Size Inputs */}
        <div className="space-y-4">
          {shape === 'circle' && (
            <NumberInput
              id="diameter"
              label="Diameter (blocks)"
              value={diameter}
              onChange={setDiameter}
              min={1}
              max={128}
              step={1}
            />
          )}
          
          {shape === 'oval' && (
            <div className="grid grid-cols-2 gap-4">
              <NumberInput
                id="width-diameter"
                label="Width (blocks)"
                value={widthDiameter}
                onChange={setWidthDiameter}
                min={1}
                max={128}
                step={1}
              />
              <NumberInput
                id="height-diameter"
                label="Height (blocks)"
                value={heightDiameter}
                onChange={setHeightDiameter}
                min={1}
                max={128}
                step={1}
              />
            </div>
          )}
          
          {shape === 'sphere' && (
            <NumberInput
              id="sphere-diameter"
              label="Sphere Diameter (blocks)"
              value={diameter}
              onChange={setDiameter}
              min={1}
              max={64}
              step={1}
            />
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filled}
              onChange={(e) => setFilled(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Fill shape</span>
          </label>
        </div>

        {/* Sphere Layer Navigation */}
        {shape === 'sphere' && sphereLayers && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Layer {currentLayer + 1} of {sphereLayers.length}
              </span>
              <span className="text-sm text-muted-foreground">
                Diameter: {sphereLayers[currentLayer]} blocks
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={sphereLayers.length - 1}
              value={currentLayer}
              onChange={(e) => setCurrentLayer(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Bottom</span>
              <span>Top</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Grid Display */}
        {grid && (
          <div className="space-y-4">
            <div className="overflow-auto">
              <div
                className="inline-grid gap-px bg-muted p-2 rounded-lg"
                style={{
                  gridTemplateColumns: `repeat(${grid.width}, ${cellSize}px)`,
                }}
              >
                {grid.grid.map((row, y) =>
                  row.map((cell, x) => (
                    <div
                      key={`${x}-${y}`}
                      className={`
                        ${cell ? 'bg-emerald-500' : 'bg-slate-800'}
                        transition-colors
                      `}
                      style={{
                        width: cellSize,
                        height: cellSize,
                      }}
                      title={cell ? `Block at (${x}, ${y})` : `Empty at (${x}, ${y})`}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <ResultDisplay
                label="Outline Blocks"
                value={grid.outlineBlockCount.toString()}
              />
              {filled && (
                <ResultDisplay
                  label="Total Blocks"
                  value={grid.totalBlockCount.toString()}
                />
              )}
              <ResultDisplay
                label="Size"
                value={`${grid.width} × ${grid.height}`}
              />
            </div>
          </div>
        )}

        {/* Sphere Layer Summary */}
        {shape === 'sphere' && sphereLayers && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">All Sphere Layers</p>
            <div className="flex flex-wrap gap-1">
              {sphereLayers.map((layerDiam, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentLayer(index)}
                  className={`
                    px-2 py-1 text-xs rounded
                    ${currentLayer === index 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                    }
                  `}
                >
                  {layerDiam}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Click a number to view that layer. Numbers show the diameter of each layer.
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">How to use:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Green blocks show where to place blocks in Minecraft</li>
            <li>Each cell represents one block</li>
            <li>For spheres, use the slider to see each layer from bottom to top</li>
            <li>Build each layer at the corresponding Y-level</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default MinecraftCircleGenerator;
