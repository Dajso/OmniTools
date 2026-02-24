/**
 * Off-Grid Runtime Calculator
 * @module lib/calculations/solar/off-grid-runtime
 */

export interface OffGridRuntimeInput {
    /** Battery bank capacity in Ah */
    batteryAh: number;
    /** Battery voltage */
    batteryVoltage: number;
    /** Depth of discharge (0-100%) */
    dodPercent: number;
    /** Inverter efficiency (%) */
    inverterEfficiency: number;
    /** List of appliances */
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

    if (batteryAh <= 0) throw new Error('Battery Ah must be positive');
    if (batteryVoltage <= 0) throw new Error('Voltage must be positive');

    const totalWatts = appliances.reduce((sum, a) => sum + a.watts * a.quantity, 0);
    if (totalWatts <= 0) throw new Error('Total wattage must be positive');

    const totalWh = batteryAh * batteryVoltage;
    const usableWh = totalWh * (dodPercent / 100) * (inverterEfficiency / 100);
    const runtimeHours = usableWh / totalWatts;

    const hours = Math.floor(runtimeHours);
    const minutes = Math.round((runtimeHours - hours) * 60);
    const runtimeFormatted = `${hours}h ${minutes}m`;

    return {
        totalWatts,
        usableWh: Math.round(usableWh),
        runtimeHours: Math.round(runtimeHours * 100) / 100,
        runtimeFormatted,
    };
}
