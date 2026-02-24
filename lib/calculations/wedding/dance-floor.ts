/**
 * Dance Floor Size Calculator
 * Rule: ~4.5 sq ft per dancer, ~40% of guests dance at once
 */
export interface DanceFloorInput { guests: number; dancerPercent: number; }
export interface DanceFloorResult { dancers: number; sqFt: number; sizeStr: string; }
export function calculateDanceFloor(input: DanceFloorInput): DanceFloorResult {
    const { guests, dancerPercent } = input;
    if (guests <= 0) throw new Error('Guests must be positive');
    const dancers = Math.round(guests * (dancerPercent / 100));
    const sqFt = dancers * 4.5;
    const side = Math.ceil(Math.sqrt(sqFt));
    return { dancers, sqFt: Math.round(sqFt), sizeStr: `${side}' × ${side}'` };
}
