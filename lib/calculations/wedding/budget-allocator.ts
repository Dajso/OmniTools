/**
 * Bryllupsbudsjett
 * Fordeler et totalbudsjett (kr) på vanlige poster.
 */
const DEFAULT_ALLOCATIONS: Record<string, number> = {
    'Lokale og mat': 40, 'Foto og video': 12, 'Musikk og underholdning': 8,
    'Blomster og dekor': 8, 'Antrekk og styling': 8, 'Invitasjoner og trykksaker': 3,
    'Transport': 3, 'Gaver og små oppmerksomheter': 3, 'Vielse (kirke, seremoni, forlovere)': 1,
    'Diverse': 5, 'Buffer til uforutsett': 5, 'Overnatting og bryllupsnatt': 4,
};
export interface BudgetAllocatorInput { totalBudget: number; customAllocations?: Record<string, number>; }
export interface BudgetItem { category: string; percent: number; amount: number; }
export interface BudgetAllocatorResult { items: BudgetItem[]; total: number; }
export function calculateBudgetAllocation(input: BudgetAllocatorInput): BudgetAllocatorResult {
    const { totalBudget, customAllocations } = input;
    if (!(totalBudget > 0)) throw new Error('Budsjettet må være større enn 0');
    const allocs = customAllocations ?? DEFAULT_ALLOCATIONS;
    const items = Object.entries(allocs).map(([category, percent]) => ({
        category, percent, amount: Math.round(totalBudget * (percent / 100)),
    }));
    return { items, total: items.reduce((s, i) => s + i.amount, 0) };
}
export { DEFAULT_ALLOCATIONS };
