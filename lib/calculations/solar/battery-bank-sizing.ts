/**
 * Battery Bank Sizing Calculator
 * @module lib/calculations/solar/battery-bank-sizing
 */

export type BatteryType = 'lead-acid' | 'agm' | 'gel' | 'lithium';

export const BATTERY_TYPES: Record<BatteryType, { name: string; maxDOD: number; voltage: number; typicalAh: number }> = {
    'lead-acid': { name: 'Blybatteri (åpent)', maxDOD: 50, voltage: 12, typicalAh: 100 },
    'agm': { name: 'AGM-batteri', maxDOD: 50, voltage: 12, typicalAh: 100 },
    'gel': { name: 'Gelbatteri', maxDOD: 50, voltage: 12, typicalAh: 100 },
    'lithium': { name: 'LiFePO4 (litium)', maxDOD: 80, voltage: 12.8, typicalAh: 100 },
};

export interface BatteryBankInput {
    /** Daglig energiforbruk i Wh */
    dailyWh: number;
    /** Antall døgn batteriet skal klare seg uten lading */
    autonomyDays: number;
    /** Batteritype */
    batteryType: BatteryType;
    /** Systemspenning (12, 24 eller 48 V) */
    systemVoltage: number;
    /** Kapasitet per batteri i Ah */
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

    if (dailyWh <= 0) throw new Error('Døgnforbruket må være større enn 0');
    if (autonomyDays < 1) throw new Error('Batteriet må klare seg minst ett døgn');
    if (batteryAh <= 0) throw new Error('Batterikapasiteten må være større enn 0');

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
