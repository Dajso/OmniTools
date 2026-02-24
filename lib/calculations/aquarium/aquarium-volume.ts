/**
 * Aquarium Volume Calculator
 * Supports rectangular, cylindrical, and bow-front tanks.
 * @module lib/calculations/aquarium/aquarium-volume
 */

export type TankShape = 'rectangular' | 'cylindrical' | 'bowfront';

export interface AquariumVolumeInput {
    shape: TankShape;
    /** Length in cm */
    length: number;
    /** Width in cm */
    width: number;
    /** Height in cm */
    height: number;
    /** Diameter in cm (for cylindrical) */
    diameter?: number;
    /** Bow depth in cm (for bow-front, extra depth at center) */
    bowDepth?: number;
}

export interface AquariumVolumeResult {
    liters: number;
    usGallons: number;
    ukGallons: number;
    cubicInches: number;
    cubicCm: number;
}

export function calculateAquariumVolume(input: AquariumVolumeInput): AquariumVolumeResult {
    let cubicCm: number;

    switch (input.shape) {
        case 'rectangular':
            if (input.length <= 0 || input.width <= 0 || input.height <= 0) {
                throw new Error('All dimensions must be positive');
            }
            cubicCm = input.length * input.width * input.height;
            break;

        case 'cylindrical': {
            const d = input.diameter ?? input.length;
            if (d <= 0 || input.height <= 0) {
                throw new Error('Diameter and height must be positive');
            }
            const radius = d / 2;
            cubicCm = Math.PI * radius * radius * input.height;
            break;
        }

        case 'bowfront': {
            if (input.length <= 0 || input.width <= 0 || input.height <= 0) {
                throw new Error('All dimensions must be positive');
            }
            const bowD = input.bowDepth ?? (input.width * 0.25);
            // Rectangular part + half-ellipse bow
            const rectVolume = input.length * input.width * input.height;
            const bowVolume = (Math.PI / 4) * input.length * bowD * input.height;
            cubicCm = rectVolume + bowVolume;
            break;
        }

        default:
            throw new Error('Unknown tank shape');
    }

    return {
        cubicCm,
        liters: cubicCm / 1000,
        usGallons: cubicCm / 3785.41,
        ukGallons: cubicCm / 4546.09,
        cubicInches: cubicCm / 16.387,
    };
}
