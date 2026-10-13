/**
 * Kabeltverrsnitt (DC): anbefalt tverrsnitt i mm² ut fra strøm, lengde og akseptabelt spenningsfall.
 * Spenningsfall = 2 × lengde × resistivitet × strøm ÷ tverrsnitt (strømmen går begge veier).
 * @module lib/calculations/solar/dc-wire-gauge
 */

/** Resistivitet for kobber, Ω·mm²/m (ved ca. 20–30 °C) */
export const COPPER_RESISTIVITY = 0.0175;

/** Standard tverrsnitt og veiledende maks strøm (A) ved legging i rør, 70 °C-isolasjon */
export const CABLE_TABLE: Array<{ mm2: number; maxAmps: number }> = [
    { mm2: 1.5, maxAmps: 15 },
    { mm2: 2.5, maxAmps: 21 },
    { mm2: 4, maxAmps: 28 },
    { mm2: 6, maxAmps: 36 },
    { mm2: 10, maxAmps: 50 },
    { mm2: 16, maxAmps: 68 },
    { mm2: 25, maxAmps: 89 },
    { mm2: 35, maxAmps: 111 },
    { mm2: 50, maxAmps: 134 },
    { mm2: 70, maxAmps: 171 },
    { mm2: 95, maxAmps: 207 },
    { mm2: 120, maxAmps: 239 },
];

export interface DCWireGaugeInput {
    /** Strøm i ampere */
    amps: number;
    /** Kabellengde én vei, i meter */
    lengthM: number;
    /** Systemspenning, V */
    voltage: number;
    /** Største akseptable spenningsfall (%) */
    maxDropPercent: number;
}

export interface DCWireGaugeResult {
    /** Anbefalt tverrsnitt i mm² */
    recommendedMm2: number;
    voltageDrop: number;
    voltageDropPercent: number;
    voltageAtLoad: number;
    powerLossWatts: number;
    /** Sant hvis ingen standardstørrelse oppfyller kravet */
    exceedsTable: boolean;
}

export function calculateDCWireGauge(input: DCWireGaugeInput): DCWireGaugeResult {
    const { amps, lengthM, voltage, maxDropPercent } = input;

    if (!(amps > 0)) throw new Error('Strømmen må være større enn 0');
    if (!(lengthM > 0)) throw new Error('Lengden må være større enn 0');
    if (!(voltage > 0)) throw new Error('Spenningen må være større enn 0');
    if (!(maxDropPercent > 0)) throw new Error('Spenningsfallet må være større enn 0');

    const maxDropVolts = voltage * (maxDropPercent / 100);
    const requiredMm2 = (2 * lengthM * COPPER_RESISTIVITY * amps) / maxDropVolts;

    const match = CABLE_TABLE.find((w) => w.mm2 >= requiredMm2 && w.maxAmps >= amps);
    const wire = match ?? CABLE_TABLE[CABLE_TABLE.length - 1];

    const voltageDrop = (2 * lengthM * COPPER_RESISTIVITY * amps) / wire.mm2;
    const voltageDropPercent = (voltageDrop / voltage) * 100;
    const powerLossWatts = voltageDrop * amps;

    return {
        recommendedMm2: wire.mm2,
        voltageDrop: Math.round(voltageDrop * 100) / 100,
        voltageDropPercent: Math.round(voltageDropPercent * 100) / 100,
        voltageAtLoad: Math.round((voltage - voltageDrop) * 100) / 100,
        powerLossWatts: Math.round(powerLossWatts * 100) / 100,
        exceedsTable: !match,
    };
}
