/**
 * Battery Bank Sizing Calculator
 * @module lib/calculations/solar/battery-bank-sizing
 */

export type BatteryType = 'lead-acid' | 'agm' | 'gel' | 'lithium';

export const BATTERY_TYPES: Record<BatteryType, { name: string; maxDOD: number; voltage: number; typicalAh: number }> = {
    'lead-acid': { name: 'Flooded Lead-Acid', maxDOD: 50, voltage: 12, typicalAh: 100 },
    'agm': { name: 'AGM', maxDOD: 50, voltage: 12, typicalAh: 100 },
    'gel': { name: 'Gel', maxDOD: 50, voltage: 12, typicalAh: 100 },
    'lithium': { name: 'LiFePO4 (Lithium)', maxDOD: 80, voltage: 12.8, typicalAh: 100 },
};

export interface BatteryBankInput {
    /** Daily energy consumption in Wh */
    dailyWh: number;
    /** Days of autonomy (backup days) */
    autonomyDays: number;
    /** Battery type */
    batteryType: BatteryType;
    /** System voltage (12, 24, or 48) */
    systemVoltage: number;
    /** Individual battery capacity in Ah */
    batteryAh: number;
}

export interface BatteryBankResult {
    /** Total capacity needed in Ah */
    totalAh: number;
    /** Total capacity in kWh */
    totalKWh: number;
    /** Number of batteries needed */
    batteryCount: number;
    /** Batteries in series */
    seriesCount: number;
    /** Parallel strings */
    parallelCount: number;
    /** Max DOD used */
    dodPercent: number;
}

export function calculateBatteryBank(input: BatteryBankInput): BatteryBankResult {
    const { dailyWh, autonomyDays, batteryType, systemVoltage, batteryAh } = input;

    if (dailyWh <= 0) throw new Error('Daily consumption must be positive');
    if (autonomyDays < 1) throw new Error('Must have at least 1 day of autonomy');
    if (batteryAh <= 0) throw new Error('Battery Ah must be positive');

    const bt = BATTERY_TYPES[batteryType];
    const dod = bt.maxDOD / 100;

    // Total energy needed = daily × days
    const totalEnergyWh = dailyWh * autonomyDays;
    // Account for DOD: usable = total × DOD
    const requiredAh = totalEnergyWh / (systemVoltage * dod);
    const totalKWh = (requiredAh * systemVoltage) / 1000;

    // Batteries in series to reach system voltage
    const batteryVoltage = bt.voltage;
    const seriesCount = Math.ceil(systemVoltage / batteryVoltage);

    // Parallel strings for capacity
    const parallelCount = Math.ceil(requiredAh / batteryAh);

    const batteryCount = seriesCount * parallelCount;

    return {
        totalAh: Math.round(requiredAh),
        totalKWh: Math.round(totalKWh * 100) / 100,
        batteryCount,
        seriesCount,
        parallelCount,
        dodPercent: bt.maxDOD,
    };
}
