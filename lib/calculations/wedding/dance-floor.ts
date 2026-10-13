/**
 * Størrelse på dansegulv
 * Tommelfingerregel: ca. 0,5 m² per danser, og ca. 40 % av gjestene danser samtidig.
 */
export interface DanceFloorInput { guests: number; dancerPercent: number; }
export interface DanceFloorResult { dancers: number; areaM2: number; sizeStr: string; }
export const M2_PER_DANCER = 0.5;
export function calculateDanceFloor(input: DanceFloorInput): DanceFloorResult {
    const { guests, dancerPercent } = input;
    if (!(guests > 0)) throw new Error('Antall gjester må være større enn 0');
    const dancers = Math.round(guests * (dancerPercent / 100));
    const areaM2 = dancers * M2_PER_DANCER;
    // Kvadratisk gulv, rundet opp til nærmeste halvmeter
    const side = Math.ceil(Math.sqrt(areaM2) * 2) / 2;
    const fmt = (n: number) => String(n).replace('.', ',');
    return { dancers, areaM2: Math.round(areaM2 * 10) / 10, sizeStr: `${fmt(side)} × ${fmt(side)} m` };
}
