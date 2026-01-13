/**
 * Tile Calculator
 * 
 * Calculates the number of tiles needed for flooring or walls.
 * 
 * @module lib/calculations/home/tile-calculator
 * @see Requirements 7.4
 */

export interface TileInputs {
  /** Room length in feet */
  roomLength: number;
  /** Room width in feet */
  roomWidth: number;
  /** Tile length in inches */
  tileLength: number;
  /** Tile width in inches */
  tileWidth: number;
  /** Waste percentage (0-30) */
  wastePercent: number;
}

export interface TileResults {
  /** Room area in square feet */
  roomAreaSqFt: number;
  /** Single tile area in square feet */
  tileAreaSqFt: number;
  /** Tiles needed without waste */
  tilesNeeded: number;
  /** Extra tiles for waste */
  wasteTiles: number;
  /** Total tiles to purchase */
  totalTiles: number;
  /** Number of boxes (assuming 10 tiles per box) */
  boxes: number;
}

/**
 * Calculates tile requirements for flooring
 */
export function calculateTiles(inputs: TileInputs): TileResults {
  const { roomLength, roomWidth, tileLength, tileWidth, wastePercent } = inputs;

  if (roomLength <= 0 || roomWidth <= 0) {
    throw new Error('Room dimensions must be positive');
  }
  if (tileLength <= 0 || tileWidth <= 0) {
    throw new Error('Tile dimensions must be positive');
  }

  const roomAreaSqFt = roomLength * roomWidth;
  const tileAreaSqFt = (tileLength * tileWidth) / 144; // Convert sq inches to sq feet
  const tilesNeeded = Math.ceil(roomAreaSqFt / tileAreaSqFt);
  const wasteTiles = Math.ceil(tilesNeeded * (wastePercent / 100));
  const totalTiles = tilesNeeded + wasteTiles;
  const boxes = Math.ceil(totalTiles / 10);

  return {
    roomAreaSqFt,
    tileAreaSqFt,
    tilesNeeded,
    wasteTiles,
    totalTiles,
    boxes,
  };
}
