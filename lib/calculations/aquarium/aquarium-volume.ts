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
    /** Netto vannvolum (ca. 90 % av brutto, etter substrat og dekor) */
    netLiters: number;
    /** Vekt av vannet i kg (ca. 1 kg per liter) */
    waterWeightKg: number;
    cubicCm: number;
}

export function calculateAquariumVolume(input: AquariumVolumeInput): AquariumVolumeResult {
    let cubicCm: number;

    switch (input.shape) {
        case 'rectangular':
            if (input.length <= 0 || input.width <= 0 || input.height <= 0) {
                throw new Error('Alle målene må være positive');
            }
            cubicCm = input.length * input.width * input.height;
            break;

        case 'cylindrical': {
            const d = input.diameter ?? input.length;
            if (d <= 0 || input.height <= 0) {
                throw new Error('Diameter og høyde må være positive');
            }
            const radius = d / 2;
            cubicCm = Math.PI * radius * radius * input.height;
            break;
        }

        case 'bowfront': {
            if (input.length <= 0 || input.width <= 0 || input.height <= 0) {
                throw new Error('Alle målene må være positive');
            }
            const bowD = input.bowDepth ?? (input.width * 0.25);
            // Rectangular part + half-ellipse bow
            const rectVolume = input.length * input.width * input.height;
            const bowVolume = (Math.PI / 4) * input.length * bowD * input.height;
            cubicCm = rectVolume + bowVolume;
            break;
        }

        default:
            throw new Error('Ukjent akvarieform');
    }

    return {
        cubicCm,
        liters: cubicCm / 1000,
        netLiters: (cubicCm / 1000) * 0.9,
        waterWeightKg: cubicCm / 1000,
    };
}
