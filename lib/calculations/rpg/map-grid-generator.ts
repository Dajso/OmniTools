/**
 * Map Grid Generator
 * 
 * Generates hex and square grids for tabletop RPG battle maps.
 * 
 * @module lib/calculations/rpg/map-grid-generator
 * @see Requirements 21.8
 */

/**
 * Grid type options
 */
export type GridType = 'square' | 'hex-flat' | 'hex-pointy';

/**
 * Grid cell
 */
export interface GridCell {
  id: string;
  row: number;
  col: number;
  x: number;
  y: number;
  points?: string; // SVG polygon points for hex grids
  terrain?: TerrainType;
}

/**
 * Terrain types for map cells
 */
export type TerrainType = 
  | 'empty'
  | 'grass'
  | 'water'
  | 'forest'
  | 'mountain'
  | 'road'
  | 'building'
  | 'wall'
  | 'door'
  | 'difficult';

/**
 * Terrain colors for rendering
 */
export const TERRAIN_COLORS: Record<TerrainType, string> = {
  empty: '#ffffff',
  grass: '#90EE90',
  water: '#87CEEB',
  forest: '#228B22',
  mountain: '#808080',
  road: '#D2B48C',
  building: '#8B4513',
  wall: '#2F4F4F',
  door: '#CD853F',
  difficult: '#FFE4B5',
};

/**
 * Terrain display names
 */
export const TERRAIN_NAMES: Record<TerrainType, string> = {
  empty: 'Tom',
  grass: 'Gress',
  water: 'Vann',
  forest: 'Skog',
  mountain: 'Fjell',
  road: 'Vei',
  building: 'Bygning',
  wall: 'Vegg',
  door: 'Dør',
  difficult: 'Vanskelig terreng',
};

/**
 * Grid configuration
 */
export interface GridConfig {
  type: GridType;
  rows: number;
  cols: number;
  cellSize: number;
  showCoordinates?: boolean;
  showGrid?: boolean;
}

/**
 * Generated grid
 */
export interface GeneratedGrid {
  config: GridConfig;
  cells: GridCell[];
  width: number;
  height: number;
  viewBox: string;
}

/**
 * Calculate hex points for flat-top hexagon
 * 
 * @param centerX - Center X coordinate
 * @param centerY - Center Y coordinate
 * @param size - Hex size (radius)
 * @returns SVG polygon points string
 */
export function getHexPointsFlat(centerX: number, centerY: number, size: number): string {
  const points: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const x = centerX + size * Math.cos(angle);
    const y = centerY + size * Math.sin(angle);
    points.push([x, y]);
  }
  return points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
}

/**
 * Calculate hex points for pointy-top hexagon
 * 
 * @param centerX - Center X coordinate
 * @param centerY - Center Y coordinate
 * @param size - Hex size (radius)
 * @returns SVG polygon points string
 */
export function getHexPointsPointy(centerX: number, centerY: number, size: number): string {
  const points: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = centerX + size * Math.cos(angle);
    const y = centerY + size * Math.sin(angle);
    points.push([x, y]);
  }
  return points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
}

/**
 * Generate a square grid
 * 
 * @param config - Grid configuration
 * @returns Generated grid with cells
 */
export function generateSquareGrid(config: GridConfig): GeneratedGrid {
  const { rows, cols, cellSize } = config;
  const cells: GridCell[] = [];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cells.push({
        id: `${row}-${col}`,
        row,
        col,
        x: col * cellSize,
        y: row * cellSize,
        terrain: 'empty',
      });
    }
  }
  
  const width = cols * cellSize;
  const height = rows * cellSize;
  
  return {
    config,
    cells,
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
  };
}

/**
 * Generate a flat-top hex grid
 * 
 * @param config - Grid configuration
 * @returns Generated grid with cells
 */
export function generateHexGridFlat(config: GridConfig): GeneratedGrid {
  const { rows, cols, cellSize } = config;
  const cells: GridCell[] = [];
  
  const hexWidth = cellSize * 2;
  const hexHeight = cellSize * Math.sqrt(3);
  const horizSpacing = hexWidth * 0.75;
  const vertSpacing = hexHeight;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * horizSpacing + cellSize;
      const y = row * vertSpacing + (col % 2 === 1 ? vertSpacing / 2 : 0) + cellSize;
      
      cells.push({
        id: `${row}-${col}`,
        row,
        col,
        x,
        y,
        points: getHexPointsFlat(x, y, cellSize),
        terrain: 'empty',
      });
    }
  }
  
  const width = cols * horizSpacing + cellSize * 0.5;
  const height = rows * vertSpacing + vertSpacing / 2 + cellSize;
  
  return {
    config,
    cells,
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
  };
}

/**
 * Generate a pointy-top hex grid
 * 
 * @param config - Grid configuration
 * @returns Generated grid with cells
 */
export function generateHexGridPointy(config: GridConfig): GeneratedGrid {
  const { rows, cols, cellSize } = config;
  const cells: GridCell[] = [];
  
  const hexWidth = cellSize * Math.sqrt(3);
  const hexHeight = cellSize * 2;
  const horizSpacing = hexWidth;
  const vertSpacing = hexHeight * 0.75;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * horizSpacing + (row % 2 === 1 ? horizSpacing / 2 : 0) + cellSize;
      const y = row * vertSpacing + cellSize;
      
      cells.push({
        id: `${row}-${col}`,
        row,
        col,
        x,
        y,
        points: getHexPointsPointy(x, y, cellSize),
        terrain: 'empty',
      });
    }
  }
  
  const width = cols * horizSpacing + horizSpacing / 2 + cellSize;
  const height = rows * vertSpacing + cellSize * 0.5;
  
  return {
    config,
    cells,
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
  };
}

/**
 * Generate a grid based on configuration
 * 
 * @param config - Grid configuration
 * @returns Generated grid
 */
export function generateGrid(config: GridConfig): GeneratedGrid {
  switch (config.type) {
    case 'hex-flat':
      return generateHexGridFlat(config);
    case 'hex-pointy':
      return generateHexGridPointy(config);
    default:
      return generateSquareGrid(config);
  }
}

/**
 * Convert column number to letter (A, B, C, ... Z, AA, AB, ...)
 * 
 * @param col - Column number (0-indexed)
 * @returns Column letter
 */
export function colToLetter(col: number): string {
  let result = '';
  let n = col;
  while (n >= 0) {
    result = String.fromCharCode((n % 26) + 65) + result;
    n = Math.floor(n / 26) - 1;
  }
  return result;
}

/**
 * Get cell coordinate label
 * 
 * @param row - Row number (0-indexed)
 * @param col - Column number (0-indexed)
 * @returns Coordinate label (e.g., "A1", "B2")
 */
export function getCellLabel(row: number, col: number): string {
  return `${colToLetter(col)}${row + 1}`;
}

/**
 * Calculate distance between two cells (in cells)
 * 
 * @param cell1 - First cell
 * @param cell2 - Second cell
 * @param gridType - Type of grid
 * @returns Distance in cells
 */
export function calculateCellDistance(
  cell1: { row: number; col: number },
  cell2: { row: number; col: number },
  gridType: GridType
): number {
  if (gridType === 'square') {
    // Chebyshev distance for square grids (diagonal movement)
    return Math.max(Math.abs(cell1.row - cell2.row), Math.abs(cell1.col - cell2.col));
  }
  
  // Hex distance using cube coordinates
  // Convert offset to cube coordinates
  const toCube = (row: number, col: number, isPointy: boolean) => {
    if (isPointy) {
      const x = col - (row - (row & 1)) / 2;
      const z = row;
      const y = -x - z;
      return { x, y, z };
    } else {
      const x = col;
      const z = row - (col - (col & 1)) / 2;
      const y = -x - z;
      return { x, y, z };
    }
  };
  
  const isPointy = gridType === 'hex-pointy';
  const cube1 = toCube(cell1.row, cell1.col, isPointy);
  const cube2 = toCube(cell2.row, cell2.col, isPointy);
  
  return Math.max(
    Math.abs(cube1.x - cube2.x),
    Math.abs(cube1.y - cube2.y),
    Math.abs(cube1.z - cube2.z)
  );
}

/**
 * Export grid as SVG string
 * 
 * @param grid - Generated grid
 * @param terrainMap - Map of cell IDs to terrain types
 * @returns SVG string
 */
export function exportGridAsSVG(
  grid: GeneratedGrid,
  terrainMap: Record<string, TerrainType> = {}
): string {
  const { config, cells, width, height } = grid;
  const { type, cellSize, showCoordinates } = config;
  
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`;
  svg += '<style>.cell { stroke: #333; stroke-width: 1; } .label { font-family: sans-serif; font-size: 10px; text-anchor: middle; dominant-baseline: middle; }</style>';
  
  for (const cell of cells) {
    const terrain = terrainMap[cell.id] || cell.terrain || 'empty';
    const fill = TERRAIN_COLORS[terrain];
    
    if (type === 'square') {
      svg += `<rect class="cell" x="${cell.x}" y="${cell.y}" width="${cellSize}" height="${cellSize}" fill="${fill}" />`;
      if (showCoordinates) {
        svg += `<text class="label" x="${cell.x + cellSize / 2}" y="${cell.y + cellSize / 2}">${getCellLabel(cell.row, cell.col)}</text>`;
      }
    } else {
      svg += `<polygon class="cell" points="${cell.points}" fill="${fill}" />`;
      if (showCoordinates) {
        svg += `<text class="label" x="${cell.x}" y="${cell.y}">${getCellLabel(cell.row, cell.col)}</text>`;
      }
    }
  }
  
  svg += '</svg>';
  return svg;
}

/**
 * Get all terrain types
 */
export function getAllTerrainTypes(): TerrainType[] {
  return Object.keys(TERRAIN_COLORS) as TerrainType[];
}
