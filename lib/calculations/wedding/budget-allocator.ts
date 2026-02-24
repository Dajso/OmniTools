/**
 * Wedding Budget Allocator
 */
const DEFAULT_ALLOCATIONS: Record<string, number> = {
    'Venue & Catering': 40, 'Photography & Video': 12, 'Music & Entertainment': 8,
    'Flowers & Decor': 8, 'Attire & Beauty': 8, 'Stationery': 3,
    'Transportation': 3, 'Favors & Gifts': 3, 'Officiant': 1,
    'Miscellaneous': 5, 'Emergency Fund': 5, 'Tips': 4,
};
export interface BudgetAllocatorInput { totalBudget: number; customAllocations?: Record<string, number>; }
export interface BudgetItem { category: string; percent: number; amount: number; }
export interface BudgetAllocatorResult { items: BudgetItem[]; total: number; }
export function calculateBudgetAllocation(input: BudgetAllocatorInput): BudgetAllocatorResult {
    const { totalBudget, customAllocations } = input;
    if (totalBudget <= 0) throw new Error('Budget must be positive');
    const allocs = customAllocations ?? DEFAULT_ALLOCATIONS;
    const items = Object.entries(allocs).map(([category, percent]) => ({
        category, percent, amount: Math.round(totalBudget * (percent / 100)),
    }));
    return { items, total: items.reduce((s, i) => s + i.amount, 0) };
}
export { DEFAULT_ALLOCATIONS };
