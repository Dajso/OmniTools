/**
 * DC Wire Gauge Calculator
 * Calculate recommended AWG based on current, length, and acceptable voltage drop.
 * @module lib/calculations/solar/dc-wire-gauge
 */

/** Copper resistivity in ohm·circular mil/ft at 20°C */
const COPPER_RESISTIVITY = 10.37;

/** AWG to circular mil area lookup */
const AWG_TABLE: Array<{ awg: string; cmil: number; maxAmps: number }> = [
    { awg: '0000 (4/0)', cmil: 211600, maxAmps: 230 },
    { awg: '000 (3/0)', cmil: 167800, maxAmps: 200 },
    { awg: '00 (2/0)', cmil: 133100, maxAmps: 175 },
    { awg: '0 (1/0)', cmil: 105500, maxAmps: 150 },
    { awg: '1', cmil: 83690, maxAmps: 130 },
    { awg: '2', cmil: 66370, maxAmps: 115 },
    { awg: '3', cmil: 52630, maxAmps: 100 },
    { awg: '4', cmil: 41740, maxAmps: 85 },
    { awg: '6', cmil: 26250, maxAmps: 65 },
    { awg: '8', cmil: 16510, maxAmps: 50 },
    { awg: '10', cmil: 10380, maxAmps: 35 },
    { awg: '12', cmil: 6530, maxAmps: 25 },
    { awg: '14', cmil: 4107, maxAmps: 20 },
    { awg: '16', cmil: 2583, maxAmps: 13 },
];

export interface DCWireGaugeInput {
    /** Current in Amps */
    amps: number;
    /** One-way wire length in feet */
    lengthFeet: number;
    /** System voltage */
    voltage: number;
    /** Maximum acceptable voltage drop (%) */
    maxDropPercent: number;
}

export interface DCWireGaugeResult {
    recommendedAWG: string;
    voltageDrop: number;
    voltageDropPercent: number;
    voltageAtLoad: number;
    powerLossWatts: number;
}

export function calculateDCWireGauge(input: DCWireGaugeInput): DCWireGaugeResult {
    const { amps, lengthFeet, voltage, maxDropPercent } = input;

    if (amps <= 0) throw new Error('Current must be positive');
    if (lengthFeet <= 0) throw new Error('Length must be positive');
    if (voltage <= 0) throw new Error('Voltage must be positive');

    // Required cmil = 2 × length × resistivity × amps / max voltage drop
    const maxDropVolts = voltage * (maxDropPercent / 100);
    const requiredCmil = (2 * lengthFeet * COPPER_RESISTIVITY * amps) / maxDropVolts;

    // Find smallest AWG that meets requirement
    const match = AWG_TABLE.find(w => w.cmil >= requiredCmil && w.maxAmps >= amps);
    const wire = match ?? AWG_TABLE[0]; // Fallback to largest

    // Calculate actual voltage drop with chosen wire
    const voltageDrop = (2 * lengthFeet * COPPER_RESISTIVITY * amps) / wire.cmil;
    const voltageDropPercent = (voltageDrop / voltage) * 100;
    const powerLossWatts = voltageDrop * amps;

    return {
        recommendedAWG: wire.awg,
        voltageDrop: Math.round(voltageDrop * 100) / 100,
        voltageDropPercent: Math.round(voltageDropPercent * 100) / 100,
        voltageAtLoad: Math.round((voltage - voltageDrop) * 100) / 100,
        powerLossWatts: Math.round(powerLossWatts * 100) / 100,
    };
}
