/**
 * Driftstid på batteri
 * @module lib/calculations/solar/off-grid-runtime
 */

export interface OffGridRuntimeInput {
    /** Batterikapasitet i Ah */
    batteryAh: number;
    /** Batterispenning, V */
    batteryVoltage: number;
    /** Utladningsdybde (0–100 %) */
    dodPercent: number;
    /** Virkningsgrad for vekselretter (%) */
    inverterEfficiency: number;
    /** Utstyr som skal drives */
    appliances: Array<{ name: string; watts: number; quantity: number }>;
}

export interface OffGridRuntimeResult {
    totalWatts: number;
    usableWh: number;
    runtimeHours: number;
    runtimeFormatted: string;
}

export function calculateOffGridRuntime(input: OffGridRuntimeInput): OffGridRuntimeResult {
    const { batteryAh, batteryVoltage, dodPercent, inverterEfficiency, appliances } = input;

    if (batteryAh <= 0) throw new Error('Batterikapasiteten må være større enn 0');
    if (batteryVoltage <= 0) throw new Error('Spenningen må være større enn 0');

    const totalWatts = appliances.reduce((sum, a) => sum + a.watts * a.quantity, 0);
    if (totalWatts <= 0) throw new Error('Samlet effekt må være større enn 0');

    const totalWh = batteryAh * batteryVoltage;
    const usableWh = totalWh * (dodPercent / 100) * (inverterEfficiency / 100);
    const runtimeHours = usableWh / totalWatts;

    const hours = Math.floor(runtimeHours);
    const minutes = Math.round((runtimeHours - hours) * 60);
    const runtimeFormatted = `${hours} t ${minutes} min`;

    return {
        totalWatts,
        usableWh: Math.round(usableWh),
        runtimeHours: Math.round(runtimeHours * 100) / 100,
        runtimeFormatted,
    };
}
