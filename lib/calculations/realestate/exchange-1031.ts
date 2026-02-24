/**
 * 1031 Exchange Deadline Calculator
 */
export interface Exchange1031Input {
    saleDate: string; // ISO date
}
export interface Exchange1031Result {
    saleDate: string;
    identificationDeadline: string; // 45 days
    closingDeadline: string; // 180 days
    daysUntilIdentification: number;
    daysUntilClosing: number;
}
export function calculate1031Exchange(input: Exchange1031Input): Exchange1031Result {
    const sale = new Date(input.saleDate);
    if (isNaN(sale.getTime())) throw new Error('Invalid date');
    const id45 = new Date(sale); id45.setDate(id45.getDate() + 45);
    const close180 = new Date(sale); close180.setDate(close180.getDate() + 180);
    const now = new Date();
    const msPerDay = 86400000;
    const daysUntilIdentification = Math.ceil((id45.getTime() - now.getTime()) / msPerDay);
    const daysUntilClosing = Math.ceil((close180.getTime() - now.getTime()) / msPerDay);
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return {
        saleDate: fmt(sale), identificationDeadline: fmt(id45), closingDeadline: fmt(close180),
        daysUntilIdentification, daysUntilClosing,
    };
}
