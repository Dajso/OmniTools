/**
 * Solnedgang på bryllupsdagen (tilnærmet)
 *
 * Bruker solhøyde (-0,833° for refraksjon og solskivens radius), tidsligningen og
 * lengdegrad. Klokkeslettet er norsk tid (sommertid er tatt med).
 */
export interface SunsetInput { date: string; latitude: number; longitude?: number; }
export interface SunsetResult {
    sunsetTime: string;
    goldenHourStart: string;
    goldenHourEnd: string;
    note: string;
    /** 'midnattssol' eller 'polarnatt' når solen ikke går ned / opp den dagen */
    polar: 'midnattssol' | 'polarnatt' | null;
}

const rad = (deg: number) => (deg * Math.PI) / 180;

/** Timer foran UTC i Norge på gitt dato (1 om vinteren, 2 om sommeren) */
export function norwayUtcOffsetHours(date: Date): number {
    try {
        const part = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Oslo', timeZoneName: 'shortOffset' })
            .formatToParts(date).find(p => p.type === 'timeZoneName')?.value ?? '';
        const m = /GMT([+-]\d+)/.exec(part);
        if (m) return parseInt(m[1], 10);
    } catch { /* faller tilbake under */ }
    return 1;
}

export function formatClock(hours: number): string {
    const total = Math.round(hours * 60);
    const h = (((Math.floor(total / 60)) % 24) + 24) % 24;
    const m = ((total % 60) + 60) % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function calculateSunsetTime(input: SunsetInput): SunsetResult {
    const { date, latitude, longitude = 10 } = input;
    const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T12:00:00Z` : date);
    if (isNaN(d.getTime())) throw new Error('Ugyldig dato');
    if (!(latitude >= -90 && latitude <= 90)) throw new Error('Breddegrad må være mellom -90 og 90');
    const start = Date.UTC(d.getUTCFullYear(), 0, 0);
    const dayOfYear = Math.floor((d.getTime() - start) / 86400000);

    // Solens deklinasjon og tidsligning (minutter)
    const b = rad((360 / 365) * (dayOfYear - 81));
    const decl = rad(23.45 * Math.sin(b));
    const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);

    const latRad = rad(latitude);
    const cosH = (Math.sin(rad(-0.833)) - Math.sin(latRad) * Math.sin(decl)) / (Math.cos(latRad) * Math.cos(decl));
    const note = 'Tidene er omtrentlige og gjelder norsk tid. Terreng, høyde og lokale forhold kan flytte solnedgangen noen minutter.';
    if (cosH <= -1) {
        return { sunsetTime: '–', goldenHourStart: '–', goldenHourEnd: '–', polar: 'midnattssol', note: 'Midnattssol: solen går ikke ned denne dagen på denne breddegraden.' };
    }
    if (cosH >= 1) {
        return { sunsetTime: '–', goldenHourStart: '–', goldenHourEnd: '–', polar: 'polarnatt', note: 'Polarnatt: solen står ikke opp denne dagen på denne breddegraden.' };
    }
    const hourAngleDeg = (Math.acos(cosH) * 180) / Math.PI;
    const tz = norwayUtcOffsetHours(d);
    const solarNoon = 12 + (15 * tz - longitude) / 15 - eot / 60;
    const sunset = solarNoon + hourAngleDeg / 15;
    return {
        sunsetTime: formatClock(sunset),
        goldenHourStart: formatClock(sunset - 1),
        goldenHourEnd: formatClock(sunset),
        polar: null,
        note,
    };
}
