/**
 * Bordplassering
 */
export interface SeatingInput { guests: number; seatsPerTable: number; headTableGuests: number; }
export interface SeatingResult { tablesNeeded: number; totalSeats: number; emptySeats: number; }
export function calculateSeating(input: SeatingInput): SeatingResult {
    const { guests, seatsPerTable, headTableGuests } = input;
    if (!(guests > 0) || !(seatsPerTable > 0)) throw new Error('Antall gjester må være større enn 0');
    const remaining = Math.max(0, guests - headTableGuests);
    const tablesNeeded = Math.ceil(remaining / seatsPerTable) + (headTableGuests > 0 ? 1 : 0);
    const totalSeats = headTableGuests + Math.ceil(remaining / seatsPerTable) * seatsPerTable;
    return { tablesNeeded, totalSeats, emptySeats: totalSeats - guests };
}
