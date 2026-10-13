/**
 * Lønnsomhet for solceller: tilbakebetalingstid og avkastning i kroner.
 * Skiller mellom strøm du bruker selv (sparer full strømpris) og overskudd du selger (lavere pris).
 * @module lib/calculations/solar/solar-roi
 */

export interface SolarROIInput {
    /** Samlet pris for anlegget, kr (inkl. mva og montering) */
    systemCost: number;
    /** Årlig produksjon, kWh */
    annualProductionKWh: number;
    /** Verdi av strøm du bruker selv, kr/kWh (strøm + nettleie energiledd + avgifter + mva) */
    electricityRate: number;
    /** Årlig prisøkning på strøm, % */
    rateIncreasePercent: number;
    /** Levetid, år */
    lifespanYears: number;
    /** Årlige kostnader (forsikring, vedlikehold, evt. utskifting av vekselretter fordelt), kr */
    maintenanceCost: number;
    /** Støtte, kr (trekkes fra prisen) */
    incentive: number;
    /** Andel av produksjonen du bruker selv, % (standard 100) */
    selfConsumptionPercent?: number;
    /** Pris du får for overskudd som mates inn på nettet, kr/kWh (standard samme som strømprisen) */
    exportRate?: number;
    /** Årlig produksjonsfall (degradering), % (standard 0) */
    degradationPercent?: number;
}

export interface SolarROIResult {
    netCost: number;
    paybackYears: number;
    totalSavings25yr: number;
    roi: number;
    annualSavingsYear1: number;
    yearlySavings: Array<{ year: number; savings: number; cumulative: number }>;
    /** True hvis anlegget ikke har betalt seg inn i løpet av levetiden */
    neverPaysBack: boolean;
}

export function calculateSolarROI(input: SolarROIInput): SolarROIResult {
    const {
        systemCost, annualProductionKWh, electricityRate, rateIncreasePercent,
        lifespanYears, maintenanceCost, incentive,
        selfConsumptionPercent = 100,
        exportRate,
        degradationPercent = 0,
    } = input;

    if (!(systemCost > 0)) throw new Error('Prisen på anlegget må være større enn 0');
    if (!(annualProductionKWh > 0)) throw new Error('Årlig produksjon må være større enn 0');
    if (!(electricityRate > 0)) throw new Error('Strømprisen må være større enn 0');
    if (!(lifespanYears >= 1)) throw new Error('Levetiden må være minst ett år');
    if (selfConsumptionPercent < 0 || selfConsumptionPercent > 100) throw new Error('Egenbruk må være mellom 0 og 100 %');
    if (incentive < 0 || incentive > systemCost) throw new Error('Støtten kan ikke være større enn prisen på anlegget');

    const selfShare = selfConsumptionPercent / 100;
    const exportPrice = exportRate ?? electricityRate;

    const netCost = systemCost - incentive;

    const savingsForYear = (y: number) => {
        const priceFactor = Math.pow(1 + rateIncreasePercent / 100, y - 1);
        const production = annualProductionKWh * Math.pow(1 - degradationPercent / 100, y - 1);
        const value = production * (selfShare * electricityRate * priceFactor + (1 - selfShare) * exportPrice * priceFactor);
        return value - maintenanceCost;
    };

    const annualSavingsYear1 = savingsForYear(1);

    let cumulative = 0;
    let paybackYears = lifespanYears;
    let paybackFound = false;
    const yearlySavings: Array<{ year: number; savings: number; cumulative: number }> = [];

    for (let y = 1; y <= lifespanYears; y++) {
        const savings = savingsForYear(y);
        cumulative += savings;
        yearlySavings.push({ year: y, savings: Math.round(savings), cumulative: Math.round(cumulative) });

        if (!paybackFound && cumulative >= netCost) {
            const prevCum = cumulative - savings;
            const fraction = savings > 0 ? (netCost - prevCum) / savings : 0;
            paybackYears = y - 1 + fraction;
            paybackFound = true;
        }
    }

    // Navnet beholdes av kompatibilitetshensyn; summen gjelder hele levetiden
    const totalSavings25yr = cumulative;
    const roi = ((totalSavings25yr - netCost) / netCost) * 100;

    return {
        netCost: Math.round(netCost),
        paybackYears: Math.round(paybackYears * 10) / 10,
        totalSavings25yr: Math.round(totalSavings25yr),
        roi: Math.round(roi),
        annualSavingsYear1: Math.round(annualSavingsYear1),
        yearlySavings,
        neverPaysBack: !paybackFound,
    };
}
