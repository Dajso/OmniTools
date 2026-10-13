/**
 * Verdiøkning ved oppussing.
 * OBS: standardprosentene er grove anslag fra amerikanske undersøkelser, ikke norske markedsdata.
 * Brukeren kan overstyre prosenten.
 */
export type RenovationType = 'kitchen-minor' | 'kitchen-major' | 'bathroom' | 'deck' | 'roof' | 'siding' | 'windows' | 'basement' | 'attic' | 'landscaping';
const ROI_DATA: Record<RenovationType, { label: string; avgROI: number }> = {
    'kitchen-minor': { label: 'Mindre kjøkkenoppussing', avgROI: 81 },
    'kitchen-major': { label: 'Nytt kjøkken', avgROI: 59 },
    'bathroom': { label: 'Nytt bad', avgROI: 70 },
    'deck': { label: 'Ny terrasse', avgROI: 72 },
    'roof': { label: 'Nytt tak', avgROI: 68 },
    'siding': { label: 'Ny utvendig kledning', avgROI: 76 },
    'windows': { label: 'Nye vinduer', avgROI: 73 },
    'basement': { label: 'Innredning av kjeller', avgROI: 70 },
    'attic': { label: 'Etterisolering av loft', avgROI: 117 },
    'landscaping': { label: 'Hage og uteområde', avgROI: 100 },
};
export interface RenovationROIInput { type: RenovationType; cost: number; /** Overstyrer standardprosenten */ roiPercent?: number; }
export interface RenovationROIResult { label: string; cost: number; avgROI: number; estimatedValueAdded: number; netGain: number; }
export function calculateRenovationROI(input: RenovationROIInput): RenovationROIResult {
    const { type, cost, roiPercent } = input;
    if (cost <= 0) throw new Error('Kostnaden må være større enn null');
    const data = ROI_DATA[type];
    const avgROI = roiPercent ?? data.avgROI;
    if (avgROI < 0) throw new Error('Prosenten kan ikke være negativ');
    const estimatedValueAdded = cost * (avgROI / 100);
    return { label: data.label, cost, avgROI, estimatedValueAdded: Math.round(estimatedValueAdded), netGain: Math.round(estimatedValueAdded - cost) };
}
export { ROI_DATA };
