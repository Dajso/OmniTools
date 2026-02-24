/**
 * Renovation ROI Estimator
 */
export type RenovationType = 'kitchen-minor' | 'kitchen-major' | 'bathroom' | 'deck' | 'roof' | 'siding' | 'windows' | 'basement' | 'attic' | 'landscaping';
const ROI_DATA: Record<RenovationType, { label: string; avgROI: number }> = {
    'kitchen-minor': { label: 'Minor Kitchen Remodel', avgROI: 81 },
    'kitchen-major': { label: 'Major Kitchen Remodel', avgROI: 59 },
    'bathroom': { label: 'Bathroom Remodel', avgROI: 70 },
    'deck': { label: 'Deck Addition', avgROI: 72 },
    'roof': { label: 'Roof Replacement', avgROI: 68 },
    'siding': { label: 'Siding Replacement', avgROI: 76 },
    'windows': { label: 'Window Replacement', avgROI: 73 },
    'basement': { label: 'Basement Finishing', avgROI: 70 },
    'attic': { label: 'Attic Insulation', avgROI: 117 },
    'landscaping': { label: 'Landscaping', avgROI: 100 },
};
export interface RenovationROIInput { type: RenovationType; cost: number; }
export interface RenovationROIResult { label: string; cost: number; avgROI: number; estimatedValueAdded: number; netGain: number; }
export function calculateRenovationROI(input: RenovationROIInput): RenovationROIResult {
    const { type, cost } = input;
    if (cost <= 0) throw new Error('Cost must be positive');
    const data = ROI_DATA[type];
    const estimatedValueAdded = cost * (data.avgROI / 100);
    return { label: data.label, cost, avgROI: data.avgROI, estimatedValueAdded: Math.round(estimatedValueAdded), netGain: Math.round(estimatedValueAdded - cost) };
}
export { ROI_DATA };
