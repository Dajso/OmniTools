/**
 * DC Power Calculator (Amps ↔ Watts)
 * P = V × I, conversions between power/current/voltage.
 * @module lib/calculations/solar/dc-power
 */

export type SolveFor = 'watts' | 'amps' | 'volts';

export interface DCPowerInput {
    solveFor: SolveFor;
    watts?: number;
    amps?: number;
    volts?: number;
}

export interface DCPowerResult {
    watts: number;
    amps: number;
    volts: number;
}

export function calculateDCPower(input: DCPowerInput): DCPowerResult {
    const { solveFor, watts, amps, volts } = input;

    switch (solveFor) {
        case 'watts':
            if (!amps || !volts) throw new Error('Provide amps and volts');
            if (amps <= 0 || volts <= 0) throw new Error('Values must be positive');
            return { watts: Math.round(amps * volts * 1000) / 1000, amps, volts };

        case 'amps':
            if (!watts || !volts) throw new Error('Provide watts and volts');
            if (watts <= 0 || volts <= 0) throw new Error('Values must be positive');
            return { watts, amps: Math.round((watts / volts) * 1000) / 1000, volts };

        case 'volts':
            if (!watts || !amps) throw new Error('Provide watts and amps');
            if (watts <= 0 || amps <= 0) throw new Error('Values must be positive');
            return { watts, amps, volts: Math.round((watts / amps) * 1000) / 1000 };

        default:
            throw new Error('Invalid solve target');
    }
}
