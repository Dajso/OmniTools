'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  generateGrid,
  getCellLabel,
  exportGridAsSVG,
  getAllTerrainTypes,
  TERRAIN_COLORS,
  TERRAIN_NAMES,
  type GridType,
  type TerrainType,
  type GeneratedGrid,
} from '@/lib/calculations/rpg/map-grid-generator';

const GRID_TYPES: { value: GridType; label: string }[] = [
  { value: 'square', label: 'Kvadratrutenett' },
  { value: 'hex-flat', label: 'Heks (flat topp)' },
  { value: 'hex-pointy', label: 'Heks (spiss topp)' },
];

export function MapGridGenerator() {
  const [gridType, setGridType] = React.useState<GridType>('square');
  const [rows, setRows] = React.useState(10);
  const [cols, setCols] = React.useState(10);
  const [cellSize, setCellSize] = React.useState(40);
  const [showCoordinates, setShowCoordinates] = React.useState(true);
  const [selectedTerrain, setSelectedTerrain] = React.useState<TerrainType>('empty');
  const [terrainMap, setTerrainMap] = React.useState<Record<string, TerrainType>>({});
  const [isDrawing, setIsDrawing] = React.useState(false);

  const grid = React.useMemo(() => {
    return generateGrid({
      type: gridType,
      rows,
      cols,
      cellSize,
      showCoordinates,
    });
  }, [gridType, rows, cols, cellSize, showCoordinates]);

  const handleCellClick = (cellId: string) => {
    setTerrainMap(prev => ({
      ...prev,
      [cellId]: selectedTerrain,
    }));
  };

  const handleCellMouseDown = (cellId: string) => {
    setIsDrawing(true);
    handleCellClick(cellId);
  };

  const handleCellMouseEnter = (cellId: string) => {
    if (isDrawing) {
      handleCellClick(cellId);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  React.useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const clearGrid = () => {
    setTerrainMap({});
  };

  const downloadSVG = () => {
    const svgContent = exportGridAsSVG(grid, terrainMap);
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `map-grid-${gridType}-${rows}x${cols}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderCell = (cell: typeof grid.cells[0]) => {
    const terrain = terrainMap[cell.id] || 'empty';
    const fill = TERRAIN_COLORS[terrain];
    const label = showCoordinates ? getCellLabel(cell.row, cell.col) : '';

    if (gridType === 'square') {
      return (
        <g key={cell.id}>
          <rect
            x={cell.x}
            y={cell.y}
            width={cellSize}
            height={cellSize}
            fill={fill}
            stroke="#333"
            strokeWidth={1}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onMouseDown={() => handleCellMouseDown(cell.id)}
            onMouseEnter={() => handleCellMouseEnter(cell.id)}
          />
          {showCoordinates && cellSize >= 30 && (
            <text
              x={cell.x + cellSize / 2}
              y={cell.y + cellSize / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={Math.min(10, cellSize / 4)}
              fill="#666"
              pointerEvents="none"
            >
              {label}
            </text>
          )}
        </g>
      );
    }

    return (
      <g key={cell.id}>
        <polygon
          points={cell.points}
          fill={fill}
          stroke="#333"
          strokeWidth={1}
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onMouseDown={() => handleCellMouseDown(cell.id)}
          onMouseEnter={() => handleCellMouseEnter(cell.id)}
        />
        {showCoordinates && cellSize >= 25 && (
          <text
            x={cell.x}
            y={cell.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={Math.min(10, cellSize / 4)}
            fill="#666"
            pointerEvents="none"
          >
            {label}
          </text>
        )}
      </g>
    );
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle>Rutenett til kart</CardTitle>
        <CardDescription>
          Lag heks- eller kvadratrutenett til kampkart for bordrollespill
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Grid Settings */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gridType">Rutenetttype</Label>
            <select
              id="gridType"
              value={gridType}
              onChange={(e) => setGridType(e.target.value as GridType)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              {GRID_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rows">Rader</Label>
            <Input
              id="rows"
              type="number"
              min={1}
              max={30}
              value={rows}
              onChange={(e) => setRows(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cols">Kolonner</Label>
            <Input
              id="cols"
              type="number"
              min={1}
              max={30}
              value={cols}
              onChange={(e) => setCols(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cellSize">Rutestørrelse</Label>
            <Input
              id="cellSize"
              type="number"
              min={20}
              max={80}
              value={cellSize}
              onChange={(e) => setCellSize(Math.max(20, Math.min(80, parseInt(e.target.value) || 40)))}
            />
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showCoordinates}
              onChange={(e) => setShowCoordinates(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Vis koordinater</span>
          </label>
          <Button variant="outline" size="sm" onClick={clearGrid}>
            Tøm rutenettet
          </Button>
          <Button variant="outline" size="sm" onClick={downloadSVG}>
            Last ned SVG
          </Button>
        </div>

        {/* Terrain Palette */}
        <div className="space-y-2">
          <Label>Terreng (klikk for å velge, og mal så på rutenettet)</Label>
          <div className="flex flex-wrap gap-2">
            {getAllTerrainTypes().map(terrain => (
              <button
                key={terrain}
                onClick={() => setSelectedTerrain(terrain)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm
                  transition-all
                  ${selectedTerrain === terrain 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-border hover:border-primary/50'}
                `}
              >
                <span
                  className="w-4 h-4 rounded border border-gray-400"
                  style={{ backgroundColor: TERRAIN_COLORS[terrain] }}
                />
                {TERRAIN_NAMES[terrain]}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Display */}
        <div className="border rounded-lg p-4 bg-white overflow-auto">
          <svg
            viewBox={grid.viewBox}
            width={Math.min(grid.width, 800)}
            height={Math.min(grid.height, 600)}
            className="mx-auto select-none"
            style={{ maxWidth: '100%', height: 'auto' }}
          >
            {grid.cells.map(renderCell)}
          </svg>
        </div>

        {/* Grid Info */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Klikk og dra for å male terreng på flere ruter</li>
            <li>Velg «Tom» for å viske ut</li>
            <li>Last ned som SVG for bruk i virtuelle bord eller til utskrift</li>
            <li>Vanlig D&D-rutenett: 1 rute = 5 fot (ca. 1,5 meter)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default MapGridGenerator;
