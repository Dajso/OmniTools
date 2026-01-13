/**
 * Square Footage Calculator
 * 
 * Calculates area for various shapes.
 * 
 * @module lib/calculations/home/square-footage-calculator
 * @see Requirements 7.15
 */

export type ShapeType = 'rectangle' | 'triangle' | 'circle' | 'trapezoid';

export interface SquareFootageInputs {
  /** Shape type */
  shape: ShapeType;
  /** Length/base in feet (for rectangle, triangle, trapezoid) */
  length?: number;
  /** Width in feet (for rectangle) */
  width?: number;
  /** Height in feet (for triangle, trapezoid) */
  height?: number;
  /** Radius in feet (for circle) */
  radius?: number;
  /** Top width in feet (for trapezoid) */
  topWidth?: number;
  /** Bottom width in feet (for trapezoid) */
  bottomWidth?: number;
}

export interface SquareFootageResults {
  /** Area in square feet */
  areaSqFt: number;
  /** Area in square yards */
  areaSqYd: number;
  /** Area in square meters */
  areaSqM: number;
  /** Area in acres */
  areaAcres: number;
  /** Perimeter in feet (if applicable) */
  perimeterFt: number;
}

/**
 * Calculates square footage for various shapes
 */
export function calculateSquareFootage(inputs: SquareFootageInputs): SquareFootageResults {
  const { shape } = inputs;
  let areaSqFt = 0;
  let perimeterFt = 0;

  switch (shape) {
    case 'rectangle': {
      const { length = 0, width = 0 } = inputs;
      if (length <= 0 || width <= 0) throw new Error('Length and width must be positive');
      areaSqFt = length * width;
      perimeterFt = 2 * (length + width);
      break;
    }
    case 'triangle': {
      const { length = 0, height = 0 } = inputs;
      if (length <= 0 || height <= 0) throw new Error('Base and height must be positive');
      areaSqFt = (length * height) / 2;
      // Approximate perimeter for right triangle
      const hypotenuse = Math.sqrt(length * length + height * height);
      perimeterFt = length + height + hypotenuse;
      break;
    }
    case 'circle': {
      const { radius = 0 } = inputs;
      if (radius <= 0) throw new Error('Radius must be positive');
      areaSqFt = Math.PI * radius * radius;
      perimeterFt = 2 * Math.PI * radius;
      break;
    }
    case 'trapezoid': {
      const { topWidth = 0, bottomWidth = 0, height = 0 } = inputs;
      if (topWidth <= 0 || bottomWidth <= 0 || height <= 0) {
        throw new Error('All dimensions must be positive');
      }
      areaSqFt = ((topWidth + bottomWidth) / 2) * height;
      // Approximate perimeter
      const side = Math.sqrt(height * height + Math.pow((bottomWidth - topWidth) / 2, 2));
      perimeterFt = topWidth + bottomWidth + 2 * side;
      break;
    }
    default:
      throw new Error('Invalid shape type');
  }

  return {
    areaSqFt,
    areaSqYd: areaSqFt / 9,
    areaSqM: areaSqFt * 0.092903,
    areaAcres: areaSqFt / 43560,
    perimeterFt,
  };
}
