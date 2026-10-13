/**
 * Ampere og watt (DC): P = U × I.
 * Regner ut effekt, strøm eller spenning når de to andre er kjent.
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

const round3 = (v: number) => Math.round(v * 1000) / 1000;

export function calculateDCPower(input: DCPowerInput): DCPowerResult {
    const { solveFor, watts, amps, volts } = input;

    switch (solveFor) {
        case 'watts':
            if (!amps || !volts) throw new Error('Fyll inn ampere og volt');
            if (amps <= 0 || volts <= 0) throw new Error('Verdiene må være større enn 0');
            return { watts: round3(amps * volts), amps, volts };

        case 'amps':
            if (!watts || !volts) throw new Error('Fyll inn watt og volt');
            if (watts <= 0 || volts <= 0) throw new Error('Verdiene må være større enn 0');
            return { watts, amps: round3(watts / volts), volts };

        case 'volts':
            if (!watts || !amps) throw new Error('Fyll inn watt og ampere');
            if (watts <= 0 || amps <= 0) throw new Error('Verdiene må være større enn 0');
            return { watts, amps, volts: round3(watts / amps) };

        default:
            throw new Error('Ugyldig valg');
    }
}
