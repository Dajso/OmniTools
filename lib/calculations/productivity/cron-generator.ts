/**
 * Cron-generator
 * 
 * Lag cron-uttrykk visuelt, med beskrivelse på vanlig språk og neste kjøretidspunkter.
 * 
 * @module lib/calculations/productivity/cron-generator
 */

export interface CronParts {
    minute: string;
    hour: string;
    dayOfMonth: string;
    month: string;
    dayOfWeek: string;
}

export interface CronResults {
    expression: string;
    description: string;
    isValid: boolean;
    nextRuns: string[];
}

const WEEKDAYS = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
const MONTHS = ['', 'januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];

/**
 * Lag en beskrivelse av cron-uttrykket på vanlig norsk
 */
export function describeCron(parts: CronParts): string {
    const { minute, hour, dayOfMonth, month, dayOfWeek } = parts;

    // Hvert minutt
    if (minute === '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
        return 'Kjører hvert minutt';
    }

    let description = 'Kjører ';

    // Minutt
    if (minute === '*') {
        description += 'hvert minutt';
    } else if (minute.includes('/')) {
        const interval = minute.split('/')[1];
        description += `hvert ${interval}. minutt`;
    } else if (minute.includes(',')) {
        description += `ved minutt ${minute.split(',').join(', ')}`;
    } else {
        description += `ved minutt ${minute}`;
    }

    // Time
    if (hour !== '*') {
        if (hour.includes('/')) {
            const interval = hour.split('/')[1];
            description += ` hver ${interval}. time`;
        } else if (hour.includes(',')) {
            description += ` i timene ${hour.split(',').join(', ')}`;
        } else {
            const hourNum = parseInt(hour);
            const minNum = /^\d+$/.test(minute) ? minute.padStart(2, '0') : '00';
            description = /^\d+$/.test(minute)
                ? `Kjører kl. ${String(hourNum).padStart(2, '0')}:${minNum}`
                : `${description} i time ${hourNum}`;
        }
    }

    // Ukedag
    if (dayOfWeek !== '*') {
        if (dayOfWeek.includes(',')) {
            const days = dayOfWeek.split(',').map(d => WEEKDAYS[parseInt(d) % 7] || d).join(', ');
            description += ` på ${days}`;
        } else if (dayOfWeek.includes('-')) {
            const [start, end] = dayOfWeek.split('-');
            description += ` fra ${WEEKDAYS[parseInt(start) % 7]} til ${WEEKDAYS[parseInt(end) % 7]}`;
        } else {
            const d = WEEKDAYS[parseInt(dayOfWeek) % 7];
            description += d ? ` hver ${d}` : ` på ukedag ${dayOfWeek}`;
        }
    }

    // Dag i måneden
    if (dayOfMonth !== '*') {
        if (dayOfMonth.includes(',')) {
            description += ` den ${dayOfMonth.split(',').join('., ')}. i måneden`;
        } else if (dayOfMonth.includes('/')) {
            const interval = dayOfMonth.split('/')[1];
            description += ` hver ${interval}. dag`;
        } else {
            description += ` den ${dayOfMonth}. i måneden`;
        }
    }

    // Måned
    if (month !== '*') {
        if (month.includes(',')) {
            const monthNames = month.split(',').map(m => MONTHS[parseInt(m)] || m).join(', ');
            description += ` i ${monthNames}`;
        } else {
            description += ` i ${MONTHS[parseInt(month)] || month}`;
        }
    }

    return description;
}

/** Sjekker om en verdi passer et enkelt cron-felt (*, liste, intervall, trinn) */
function fieldMatches(field: string, value: number, min: number, max: number): boolean {
    return field.split(',').some((part) => {
        const [rangePart, stepPart] = part.split('/');
        const step = stepPart ? parseInt(stepPart) : 1;
        if (!(step >= 1)) return false;
        let lo = min;
        let hi = max;
        if (rangePart !== '*') {
            if (rangePart.includes('-')) {
                const [a, b] = rangePart.split('-').map((n) => parseInt(n));
                lo = a; hi = b;
            } else {
                lo = parseInt(rangePart);
                hi = stepPart ? max : lo;
            }
        }
        if (Number.isNaN(lo) || Number.isNaN(hi)) return false;
        return value >= lo && value <= hi && (value - lo) % step === 0;
    });
}

/**
 * Finn de neste tidspunktene uttrykket kjører (lokal tid).
 * Leter minutt for minutt opptil ett år frem.
 */
export function getNextRuns(parts: CronParts, count: number = 5, from: Date = new Date()): string[] {
    const results: string[] = [];
    const cursor = new Date(from.getTime());
    cursor.setSeconds(0, 0);
    cursor.setMinutes(cursor.getMinutes() + 1);

    const limit = 366 * 24 * 60;
    for (let i = 0; i < limit && results.length < count; i++) {
        const dowMatch = fieldMatches(parts.dayOfWeek.replace(/\b7\b/g, '0'), cursor.getDay(), 0, 6);
        const domMatch = fieldMatches(parts.dayOfMonth, cursor.getDate(), 1, 31);
        // Som i standard cron: når både dag i måneden og ukedag er begrenset, holder det at én passer
        const dayMatch = parts.dayOfMonth !== '*' && parts.dayOfWeek !== '*' ? (domMatch || dowMatch) : (domMatch && dowMatch);
        if (
            fieldMatches(parts.minute, cursor.getMinutes(), 0, 59) &&
            fieldMatches(parts.hour, cursor.getHours(), 0, 23) &&
            fieldMatches(parts.month, cursor.getMonth() + 1, 1, 12) &&
            dayMatch
        ) {
            results.push(cursor.toLocaleString('nb-NO', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }));
        }
        cursor.setMinutes(cursor.getMinutes() + 1);
    }

    return results;
}

/**
 * Generate cron expression
 */
export function generateCron(parts: CronParts): CronResults {
    const expression = `${parts.minute} ${parts.hour} ${parts.dayOfMonth} ${parts.month} ${parts.dayOfWeek}`;
    const description = describeCron(parts);
    const nextRuns = getNextRuns(parts);

    return {
        expression,
        description,
        isValid: true,
        nextRuns,
    };
}

/**
 * Common cron presets
 */
export const CRON_PRESETS = [
    { name: 'Hvert minutt', parts: { minute: '*', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' } },
    { name: 'Hvert 5. minutt', parts: { minute: '*/5', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' } },
    { name: 'Hvert 15. minutt', parts: { minute: '*/15', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' } },
    { name: 'Hver time', parts: { minute: '0', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' } },
    { name: 'Hver dag ved midnatt', parts: { minute: '0', hour: '0', dayOfMonth: '*', month: '*', dayOfWeek: '*' } },
    { name: 'Hver dag kl. 12', parts: { minute: '0', hour: '12', dayOfMonth: '*', month: '*', dayOfWeek: '*' } },
    { name: 'Hver mandag kl. 09', parts: { minute: '0', hour: '9', dayOfMonth: '*', month: '*', dayOfWeek: '1' } },
    { name: 'Hver ukedag kl. 09', parts: { minute: '0', hour: '9', dayOfMonth: '*', month: '*', dayOfWeek: '1-5' } },
    { name: 'Den 1. i hver måned', parts: { minute: '0', hour: '0', dayOfMonth: '1', month: '*', dayOfWeek: '*' } },
    { name: 'Hver søndag kl. 02', parts: { minute: '0', hour: '2', dayOfMonth: '*', month: '*', dayOfWeek: '0' } },
] as const;
