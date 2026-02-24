/**
 * Sunset Time for Wedding (approximate)
 * Simplified solar calculation based on latitude and day of year.
 */
export interface SunsetInput { date: string; latitude: number; }
export interface SunsetResult { sunsetTime: string; goldenHourStart: string; goldenHourEnd: string; note: string; }
export function calculateSunsetTime(input: SunsetInput): SunsetResult {
    const { date, latitude } = input;
    const d = new Date(date);
    if (isNaN(d.getTime())) throw new Error('Invalid date');
    // Day of year
    const start = new Date(d.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((d.getTime() - start.getTime()) / 86400000);
    // Approximate sunset hour using a simplified formula
    // baseline ~18:00, adjusted by latitude & season
    const latRad = (latitude * Math.PI) / 180;
    const decl = 23.45 * Math.sin(((360 / 365) * (dayOfYear - 81)) * Math.PI / 180);
    const declRad = (decl * Math.PI) / 180;
    const hourAngle = Math.acos(-Math.tan(latRad) * Math.tan(declRad));
    const sunsetHours = 12 + (hourAngle * 180 / Math.PI) / 15;
    const sunsetH = Math.floor(sunsetHours);
    const sunsetM = Math.round((sunsetHours - sunsetH) * 60);
    const goldenStart = sunsetHours - 1;
    const gH = Math.floor(goldenStart);
    const gM = Math.round((goldenStart - gH) * 60);
    const fmt = (h: number, m: number) => {
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h > 12 ? h - 12 : h;
        return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
    };
    return {
        sunsetTime: fmt(sunsetH, sunsetM),
        goldenHourStart: fmt(gH, gM),
        goldenHourEnd: fmt(sunsetH, sunsetM),
        note: 'Times are approximate and do not account for altitude, terrain, or timezone offsets.',
    };
}
