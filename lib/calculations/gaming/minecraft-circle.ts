/**
 * Minecraft Circle Generator
 * 
 * Generates pixel-perfect circles for Minecraft building.
 * Uses the midpoint circle algorithm to create block-based circles.
 * 
 * @module lib/calculations/gaming/minecraft-circle
 * @see Requirements 17.6
 */

export interface CirclePoint {
  x: number;
  y: number;
}

export interface CircleGrid {
  /** Width of the grid */
  width: number;
  /** Height of the grid */
  height: number;
  /** 2D array where true = block, false = empty */
  grid: boolean[][];
  /** Array of points that make up the circle outline */
  outlinePoints: CirclePoint[];
  /** Array of points that fill the circle (if filled) */
  fillPoints: CirclePoint[];
  /** Diameter of the circle */
  diameter: number;
  /** Whether the circle is filled */
  filled: boolean;
  /** Total blocks needed for outline */
  outlineBlockCount: number;
  /** Total blocks needed for fill (including outline) */
  totalBlockCount: number;
}

export interface OvalGrid extends CircleGrid {
  /** Width diameter */
  widthDiameter: number;
  /** Height diameter */
  heightDiameter: number;
}

/**
 * Generate a pixel-perfect circle using the midpoint circle algorithm
 * 
 * @param diameter - Diameter of the circle in blocks
 * @param filled - Whether to fill the circle
 * @returns Circle grid with block positions
 */
export function generateCircle(diameter: number, filled: boolean = false): CircleGrid {
  if (diameter < 1) {
    throw new Error('Diameter must be at least 1');
  }
  if (diameter > 256) {
    throw new Error('Diameter cannot exceed 256 blocks');
  }

  const radius = diameter / 2;
  const size = diameter;
  const center = (diameter - 1) / 2;

  // Initialize grid
  const grid: boolean[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(false));

  const outlinePoints: CirclePoint[] = [];
  const fillPoints: CirclePoint[] = [];

  // Use midpoint circle algorithm for outline
  const outlineSet = new Set<string>();
  
  // For even diameters, we need to handle the center differently
  const isEven = diameter % 2 === 0;
  
  if (isEven) {
    // For even diameters, use a slightly different approach
    generateEvenCircle(diameter, grid, outlineSet, outlinePoints);
  } else {
    // For odd diameters, use standard midpoint algorithm
    generateOddCircle(diameter, grid, outlineSet, outlinePoints);
  }

  // Fill the circle if requested
  if (filled) {
    fillCircle(grid, fillPoints, outlineSet);
  }

  const outlineBlockCount = outlinePoints.length;
  const totalBlockCount = filled 
    ? outlinePoints.length + fillPoints.length 
    : outlinePoints.length;

  return {
    width: size,
    height: size,
    grid,
    outlinePoints,
    fillPoints,
    diameter,
    filled,
    outlineBlockCount,
    totalBlockCount,
  };
}

/**
 * Generate circle for odd diameters using midpoint algorithm
 */
function generateOddCircle(
  diameter: number,
  grid: boolean[][],
  outlineSet: Set<string>,
  outlinePoints: CirclePoint[]
): void {
  const radius = Math.floor(diameter / 2);
  const center = radius;

  let x = radius;
  let y = 0;
  let radiusError = 1 - x;

  while (x >= y) {
    // Plot all 8 octants
    plotCirclePoints(center, center, x, y, grid, outlineSet, outlinePoints);

    y++;
    if (radiusError < 0) {
      radiusError += 2 * y + 1;
    } else {
      x--;
      radiusError += 2 * (y - x + 1);
    }
  }
}

/**
 * Generate circle for even diameters
 */
function generateEvenCircle(
  diameter: number,
  grid: boolean[][],
  outlineSet: Set<string>,
  outlinePoints: CirclePoint[]
): void {
  const radius = diameter / 2;
  const centerOffset = 0.5; // Offset for even diameters

  for (let y = 0; y < diameter; y++) {
    for (let x = 0; x < diameter; x++) {
      // Calculate distance from center
      const dx = x - (radius - centerOffset);
      const dy = y - (radius - centerOffset);
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Check if this block is on the circle outline
      // A block is on the outline if the circle passes through it
      const innerRadius = radius - 1;
      const outerRadius = radius;

      if (distance >= innerRadius && distance < outerRadius) {
        const key = `${x},${y}`;
        if (!outlineSet.has(key)) {
          outlineSet.add(key);
          grid[y][x] = true;
          outlinePoints.push({ x, y });
        }
      }
    }
  }
}

/**
 * Plot circle points in all 8 octants
 */
function plotCirclePoints(
  cx: number,
  cy: number,
  x: number,
  y: number,
  grid: boolean[][],
  outlineSet: Set<string>,
  outlinePoints: CirclePoint[]
): void {
  const points = [
    { x: cx + x, y: cy + y },
    { x: cx - x, y: cy + y },
    { x: cx + x, y: cy - y },
    { x: cx - x, y: cy - y },
    { x: cx + y, y: cy + x },
    { x: cx - y, y: cy + x },
    { x: cx + y, y: cy - x },
    { x: cx - y, y: cy - x },
  ];

  for (const point of points) {
    const key = `${point.x},${point.y}`;
    if (!outlineSet.has(key) && isValidPoint(point, grid.length)) {
      outlineSet.add(key);
      grid[point.y][point.x] = true;
      outlinePoints.push(point);
    }
  }
}

/**
 * Check if a point is within grid bounds
 */
function isValidPoint(point: CirclePoint, size: number): boolean {
  return point.x >= 0 && point.x < size && point.y >= 0 && point.y < size;
}

/**
 * Fill the inside of the circle using scanline fill
 */
function fillCircle(
  grid: boolean[][],
  fillPoints: CirclePoint[],
  outlineSet: Set<string>
): void {
  const size = grid.length;

  for (let y = 0; y < size; y++) {
    let inside = false;
    let lastWasOutline = false;

    for (let x = 0; x < size; x++) {
      const isOutline = outlineSet.has(`${x},${y}`);

      if (isOutline) {
        if (!lastWasOutline) {
          inside = !inside;
        }
        lastWasOutline = true;
      } else {
        if (lastWasOutline) {
          // Check if we're exiting the circle
          const nextOutline = findNextOutline(x, y, size, outlineSet);
          if (nextOutline === -1) {
            inside = false;
          }
        }
        lastWasOutline = false;

        if (inside) {
          grid[y][x] = true;
          fillPoints.push({ x, y });
        }
      }
    }
  }
}

/**
 * Find the next outline point in the current row
 */
function findNextOutline(
  startX: number,
  y: number,
  size: number,
  outlineSet: Set<string>
): number {
  for (let x = startX; x < size; x++) {
    if (outlineSet.has(`${x},${y}`)) {
      return x;
    }
  }
  return -1;
}

/**
 * Generate an oval (ellipse) for Minecraft building
 * 
 * @param widthDiameter - Width of the oval in blocks
 * @param heightDiameter - Height of the oval in blocks
 * @param filled - Whether to fill the oval
 * @returns Oval grid with block positions
 */
export function generateOval(
  widthDiameter: number,
  heightDiameter: number,
  filled: boolean = false
): OvalGrid {
  if (widthDiameter < 1 || heightDiameter < 1) {
    throw new Error('Diameters must be at least 1');
  }
  if (widthDiameter > 256 || heightDiameter > 256) {
    throw new Error('Diameters cannot exceed 256 blocks');
  }

  const grid: boolean[][] = Array(heightDiameter)
    .fill(null)
    .map(() => Array(widthDiameter).fill(false));

  const outlinePoints: CirclePoint[] = [];
  const fillPoints: CirclePoint[] = [];
  const outlineSet = new Set<string>();

  const a = widthDiameter / 2;
  const b = heightDiameter / 2;
  const centerX = (widthDiameter - 1) / 2;
  const centerY = (heightDiameter - 1) / 2;

  // Generate ellipse using parametric approach
  for (let y = 0; y < heightDiameter; y++) {
    for (let x = 0; x < widthDiameter; x++) {
      const dx = (x - centerX) / a;
      const dy = (y - centerY) / b;
      const distance = dx * dx + dy * dy;

      // Check if on outline (between inner and outer boundary)
      const innerBound = 0.7; // Adjust for pixel-perfect look
      const outerBound = 1.3;

      if (distance >= innerBound && distance <= outerBound) {
        // More precise check for outline
        const isOnOutline = isEllipseOutline(x, y, centerX, centerY, a, b);
        if (isOnOutline) {
          const key = `${x},${y}`;
          if (!outlineSet.has(key)) {
            outlineSet.add(key);
            grid[y][x] = true;
            outlinePoints.push({ x, y });
          }
        }
      }
    }
  }

  // Fill if requested
  if (filled) {
    for (let y = 0; y < heightDiameter; y++) {
      for (let x = 0; x < widthDiameter; x++) {
        const key = `${x},${y}`;
        if (!outlineSet.has(key)) {
          const dx = (x - centerX) / a;
          const dy = (y - centerY) / b;
          const distance = dx * dx + dy * dy;

          if (distance < 1) {
            grid[y][x] = true;
            fillPoints.push({ x, y });
          }
        }
      }
    }
  }

  return {
    width: widthDiameter,
    height: heightDiameter,
    grid,
    outlinePoints,
    fillPoints,
    diameter: Math.max(widthDiameter, heightDiameter),
    widthDiameter,
    heightDiameter,
    filled,
    outlineBlockCount: outlinePoints.length,
    totalBlockCount: outlinePoints.length + fillPoints.length,
  };
}

/**
 * Check if a point is on the ellipse outline
 */
function isEllipseOutline(
  x: number,
  y: number,
  cx: number,
  cy: number,
  a: number,
  b: number
): boolean {
  // Check if any corner of the block crosses the ellipse boundary
  const corners = [
    { x: x - 0.5, y: y - 0.5 },
    { x: x + 0.5, y: y - 0.5 },
    { x: x - 0.5, y: y + 0.5 },
    { x: x + 0.5, y: y + 0.5 },
  ];

  let inside = 0;
  let outside = 0;

  for (const corner of corners) {
    const dx = (corner.x - cx) / a;
    const dy = (corner.y - cy) / b;
    const distance = dx * dx + dy * dy;

    if (distance <= 1) {
      inside++;
    } else {
      outside++;
    }
  }

  // Block is on outline if some corners are inside and some outside
  return inside > 0 && outside > 0;
}

/**
 * Convert grid to ASCII art for display
 * 
 * @param grid - Circle or oval grid
 * @param blockChar - Character to use for blocks
 * @param emptyChar - Character to use for empty spaces
 * @returns ASCII art string
 */
export function gridToAscii(
  grid: boolean[][],
  blockChar: string = '█',
  emptyChar: string = '·'
): string {
  return grid
    .map(row => row.map(cell => (cell ? blockChar : emptyChar)).join(''))
    .join('\n');
}

/**
 * Get block counts by layer (for 3D sphere building)
 * 
 * @param diameter - Diameter of the sphere
 * @returns Array of circle diameters for each layer
 */
export function getSphereLayerDiameters(diameter: number): number[] {
  if (diameter < 1) {
    throw new Error('Diameter must be at least 1');
  }

  const radius = diameter / 2;
  const layers: number[] = [];

  for (let y = 0; y < diameter; y++) {
    // Calculate the radius at this height
    const dy = y - (radius - 0.5);
    const layerRadius = Math.sqrt(Math.max(0, radius * radius - dy * dy));
    const layerDiameter = Math.round(layerRadius * 2);
    layers.push(layerDiameter);
  }

  return layers;
}
