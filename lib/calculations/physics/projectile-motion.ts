/**
 * Projectile Motion Calculator
 * 
 * Calculates trajectory, range, maximum height, and flight time for
 * projectile motion using standard kinematic equations.
 * 
 * Key equations:
 * - Range: R = v₀² × sin(2θ) / g
 * - Max Height: H = v₀² × sin²(θ) / (2g)
 * - Flight Time: T = 2 × v₀ × sin(θ) / g
 * - Position: x(t) = v₀ × cos(θ) × t
 *             y(t) = v₀ × sin(θ) × t - ½ × g × t²
 * 
 * @module lib/calculations/physics/projectile-motion
 * @see Requirements 31.3, 31.4, 31.8
 */

import { formatFixed } from '@/lib/utils/formatting';

/** Standard gravitational acceleration on Earth (m/s²) */
export const GRAVITY_EARTH = 9.80665;

/** Gravitational acceleration on Moon (m/s²) */
export const GRAVITY_MOON = 1.62;

/** Gravitational acceleration on Mars (m/s²) */
export const GRAVITY_MARS = 3.71;

/**
 * Error class for projectile motion calculation errors
 */
export class ProjectileMotionError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'out_of_range',
    public field?: string
  ) {
    super(message);
    this.name = 'ProjectileMotionError';
  }
}

/**
 * Input parameters for projectile motion calculation
 */
export interface ProjectileMotionInput {
  /** Initial velocity in m/s */
  initialVelocity: number;
  /** Launch angle in degrees (0-90) */
  launchAngle: number;
  /** Initial height in meters (default: 0) */
  initialHeight?: number;
  /** Gravitational acceleration in m/s² (default: 9.80665) */
  gravity?: number;
}

/**
 * A point on the projectile trajectory
 */
export interface TrajectoryPoint {
  /** Time in seconds */
  time: number;
  /** Horizontal position in meters */
  x: number;
  /** Vertical position in meters */
  y: number;
  /** Velocity magnitude at this point in m/s */
  velocity: number;
  /** Velocity angle at this point in degrees */
  velocityAngle: number;
}

/**
 * Result of projectile motion calculation
 */
export interface ProjectileMotionResult {
  /** Horizontal range in meters */
  range: number;
  /** Maximum height reached in meters */
  maxHeight: number;
  /** Total flight time in seconds */
  flightTime: number;
  /** Time to reach maximum height in seconds */
  timeToMaxHeight: number;
  /** Initial horizontal velocity component in m/s */
  initialVelocityX: number;
  /** Initial vertical velocity component in m/s */
  initialVelocityY: number;
  /** Impact velocity in m/s */
  impactVelocity: number;
  /** Impact angle in degrees (below horizontal) */
  impactAngle: number;
  /** Trajectory points for visualization */
  trajectory: TrajectoryPoint[];
  /** Formatted range string */
  formattedRange: string;
  /** Formatted max height string */
  formattedMaxHeight: string;
  /** Formatted flight time string */
  formattedFlightTime: string;
}


/**
 * Convert degrees to radians
 * 
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 * 
 * @param radians - Angle in radians
 * @returns Angle in degrees
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Format a distance value with appropriate unit
 * 
 * @param meters - Distance in meters
 * @returns Formatted string
 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${formatFixed(meters / 1000, 2)} km`;
  }
  if (meters >= 1) {
    return `${formatFixed(meters, 2)} m`;
  }
  return `${formatFixed(meters * 100, 2)} cm`;
}

/**
 * Format a time value with appropriate unit
 * 
 * @param seconds - Time in seconds
 * @returns Formatted string
 */
export function formatTime(seconds: number): string {
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${formatFixed(secs, 2)}s`;
  }
  return `${formatFixed(seconds, 3)} s`;
}

/**
 * Validate projectile motion input parameters
 * 
 * @param input - Input parameters to validate
 * @throws ProjectileMotionError if validation fails
 */
function validateInput(input: ProjectileMotionInput): void {
  if (input.initialVelocity < 0) {
    throw new ProjectileMotionError(
      'Starthastigheten kan ikke være negativ',
      'invalid_input',
      'initialVelocity'
    );
  }
  
  if (input.launchAngle < 0 || input.launchAngle > 90) {
    throw new ProjectileMotionError(
      'Utkastvinkelen må være mellom 0 og 90 grader',
      'out_of_range',
      'launchAngle'
    );
  }
  
  if (input.initialHeight !== undefined && input.initialHeight < 0) {
    throw new ProjectileMotionError(
      'Starthøyden kan ikke være negativ',
      'invalid_input',
      'initialHeight'
    );
  }
  
  if (input.gravity !== undefined && input.gravity <= 0) {
    throw new ProjectileMotionError(
      'Tyngdeakselerasjonen må være positiv',
      'invalid_input',
      'gravity'
    );
  }
}

/**
 * Calculate projectile motion parameters
 * 
 * Given initial velocity and launch angle, calculates range, max height,
 * flight time, and generates trajectory points.
 * 
 * @param input - Projectile motion input parameters
 * @returns Complete projectile motion results
 * 
 * @example
 * ```typescript
 * const result = calculateProjectileMotion({
 *   initialVelocity: 20,
 *   launchAngle: 45,
 * });
 * console.log(result.range); // ~40.77 m
 * console.log(result.maxHeight); // ~10.19 m
 * ```
 */
export function calculateProjectileMotion(
  input: ProjectileMotionInput
): ProjectileMotionResult {
  validateInput(input);
  
  const {
    initialVelocity: v0,
    launchAngle,
    initialHeight: h0 = 0,
    gravity: g = GRAVITY_EARTH,
  } = input;
  
  const angleRad = degreesToRadians(launchAngle);
  const sinAngle = Math.sin(angleRad);
  const cosAngle = Math.cos(angleRad);
  const sin2Angle = Math.sin(2 * angleRad);
  
  // Initial velocity components
  const v0x = v0 * cosAngle;
  const v0y = v0 * sinAngle;
  
  // Time to reach maximum height: t_max = v0y / g
  const timeToMaxHeight = v0y / g;
  
  // Maximum height: H = h0 + v0y² / (2g)
  const maxHeight = h0 + (v0y * v0y) / (2 * g);
  
  // Flight time calculation
  // For h0 = 0: T = 2 × v0 × sin(θ) / g
  // For h0 > 0: solve y(t) = 0 using quadratic formula
  let flightTime: number;
  
  if (h0 === 0) {
    flightTime = (2 * v0 * sinAngle) / g;
  } else {
    // y(t) = h0 + v0y*t - 0.5*g*t² = 0
    // -0.5*g*t² + v0y*t + h0 = 0
    // Using quadratic formula: t = (-v0y ± sqrt(v0y² + 2*g*h0)) / (-g)
    // We want the positive root
    const discriminant = v0y * v0y + 2 * g * h0;
    flightTime = (v0y + Math.sqrt(discriminant)) / g;
  }
  
  // Range: R = v0x × T
  const range = v0x * flightTime;
  
  // Impact velocity and angle
  const impactVy = v0y - g * flightTime;
  const impactVelocity = Math.sqrt(v0x * v0x + impactVy * impactVy);
  const impactAngle = Math.abs(radiansToDegrees(Math.atan2(impactVy, v0x)));
  
  // Generate trajectory points
  const trajectory = generateTrajectory(v0x, v0y, h0, g, flightTime);
  
  return {
    range,
    maxHeight,
    flightTime,
    timeToMaxHeight,
    initialVelocityX: v0x,
    initialVelocityY: v0y,
    impactVelocity,
    impactAngle,
    trajectory,
    formattedRange: formatDistance(range),
    formattedMaxHeight: formatDistance(maxHeight),
    formattedFlightTime: formatTime(flightTime),
  };
}


/**
 * Generate trajectory points for visualization
 * 
 * @param v0x - Initial horizontal velocity
 * @param v0y - Initial vertical velocity
 * @param h0 - Initial height
 * @param g - Gravitational acceleration
 * @param flightTime - Total flight time
 * @param numPoints - Number of points to generate (default: 50)
 * @returns Array of trajectory points
 */
function generateTrajectory(
  v0x: number,
  v0y: number,
  h0: number,
  g: number,
  flightTime: number,
  numPoints: number = 50
): TrajectoryPoint[] {
  const points: TrajectoryPoint[] = [];
  const dt = flightTime / (numPoints - 1);
  
  for (let i = 0; i < numPoints; i++) {
    const t = i * dt;
    const x = v0x * t;
    const y = h0 + v0y * t - 0.5 * g * t * t;
    
    // Current velocity components
    const vx = v0x;
    const vy = v0y - g * t;
    const velocity = Math.sqrt(vx * vx + vy * vy);
    const velocityAngle = radiansToDegrees(Math.atan2(vy, vx));
    
    points.push({
      time: t,
      x,
      y: Math.max(0, y), // Clamp to ground level
      velocity,
      velocityAngle,
    });
  }
  
  return points;
}

/**
 * Calculate the position at a specific time
 * 
 * @param input - Projectile motion input parameters
 * @param time - Time in seconds
 * @returns Position and velocity at the given time
 */
export function getPositionAtTime(
  input: ProjectileMotionInput,
  time: number
): TrajectoryPoint {
  validateInput(input);
  
  const {
    initialVelocity: v0,
    launchAngle,
    initialHeight: h0 = 0,
    gravity: g = GRAVITY_EARTH,
  } = input;
  
  const angleRad = degreesToRadians(launchAngle);
  const v0x = v0 * Math.cos(angleRad);
  const v0y = v0 * Math.sin(angleRad);
  
  const x = v0x * time;
  const y = h0 + v0y * time - 0.5 * g * time * time;
  
  const vx = v0x;
  const vy = v0y - g * time;
  const velocity = Math.sqrt(vx * vx + vy * vy);
  const velocityAngle = radiansToDegrees(Math.atan2(vy, vx));
  
  return {
    time,
    x,
    y,
    velocity,
    velocityAngle,
  };
}

/**
 * Calculate the optimal launch angle for maximum range
 * 
 * For flat ground (h0 = 0), the optimal angle is 45°.
 * For elevated launch (h0 > 0), the optimal angle is less than 45°.
 * 
 * @param initialHeight - Initial height in meters (default: 0)
 * @param initialVelocity - Initial velocity in m/s
 * @param gravity - Gravitational acceleration (default: Earth gravity)
 * @returns Optimal launch angle in degrees
 */
export function calculateOptimalAngle(
  initialHeight: number = 0,
  initialVelocity: number = 10,
  gravity: number = GRAVITY_EARTH
): number {
  if (initialHeight === 0) {
    return 45;
  }
  
  // For h0 > 0, optimal angle is: θ = arctan(v0 / sqrt(v0² + 2*g*h0))
  // This is an approximation; exact solution requires numerical methods
  const v0Squared = initialVelocity * initialVelocity;
  const discriminant = v0Squared + 2 * gravity * initialHeight;
  
  if (discriminant <= 0) {
    return 45;
  }
  
  const optimalAngleRad = Math.atan(initialVelocity / Math.sqrt(discriminant));
  return radiansToDegrees(optimalAngleRad);
}

/**
 * Calculate range for a given angle (simplified formula for h0 = 0)
 * 
 * R = v₀² × sin(2θ) / g
 * 
 * @param initialVelocity - Initial velocity in m/s
 * @param launchAngle - Launch angle in degrees
 * @param gravity - Gravitational acceleration (default: Earth gravity)
 * @returns Range in meters
 */
export function calculateRange(
  initialVelocity: number,
  launchAngle: number,
  gravity: number = GRAVITY_EARTH
): number {
  const angleRad = degreesToRadians(launchAngle);
  return (initialVelocity * initialVelocity * Math.sin(2 * angleRad)) / gravity;
}

/**
 * Calculate maximum height for a given angle (simplified formula for h0 = 0)
 * 
 * H = v₀² × sin²(θ) / (2g)
 * 
 * @param initialVelocity - Initial velocity in m/s
 * @param launchAngle - Launch angle in degrees
 * @param gravity - Gravitational acceleration (default: Earth gravity)
 * @returns Maximum height in meters
 */
export function calculateMaxHeight(
  initialVelocity: number,
  launchAngle: number,
  gravity: number = GRAVITY_EARTH
): number {
  const angleRad = degreesToRadians(launchAngle);
  const sinAngle = Math.sin(angleRad);
  return (initialVelocity * initialVelocity * sinAngle * sinAngle) / (2 * gravity);
}

/**
 * Calculate flight time for a given angle (simplified formula for h0 = 0)
 * 
 * T = 2 × v₀ × sin(θ) / g
 * 
 * @param initialVelocity - Initial velocity in m/s
 * @param launchAngle - Launch angle in degrees
 * @param gravity - Gravitational acceleration (default: Earth gravity)
 * @returns Flight time in seconds
 */
export function calculateFlightTime(
  initialVelocity: number,
  launchAngle: number,
  gravity: number = GRAVITY_EARTH
): number {
  const angleRad = degreesToRadians(launchAngle);
  return (2 * initialVelocity * Math.sin(angleRad)) / gravity;
}
