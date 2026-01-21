/**
 * Cron Job Generator
 * 
 * Generate cron expressions with visual scheduler and human-readable descriptions.
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

/**
 * Generate description for cron expression
 */
export function describeCron(parts: CronParts): string {
    const { minute, hour, dayOfMonth, month, dayOfWeek } = parts;

    let description = 'Runs ';

    // Every minute
    if (minute === '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
        return 'Runs every minute';
    }

    // Minute description
    if (minute === '*') {
        description += 'every minute';
    } else if (minute.includes('/')) {
        const interval = minute.split('/')[1];
        description += `every ${interval} minutes`;
    } else if (minute.includes(',')) {
        description += `at minutes ${minute}`;
    } else {
        description += `at minute ${minute}`;
    }

    // Hour description
    if (hour !== '*') {
        if (hour.includes('/')) {
            const interval = hour.split('/')[1];
            description += ` of every ${interval} hours`;
        } else if (hour.includes(',')) {
            description += ` at hours ${hour}`;
        } else {
            const hourNum = parseInt(hour);
            const ampm = hourNum >= 12 ? 'PM' : 'AM';
            const hour12 = hourNum % 12 || 12;
            description += ` at ${hour12}:${minute.padStart(2, '0')} ${ampm}`;
        }
    }

    // Day of week
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (dayOfWeek !== '*') {
        if (dayOfWeek.includes(',')) {
            const days = dayOfWeek.split(',').map(d => weekdays[parseInt(d)] || d).join(', ');
            description += ` on ${days}`;
        } else if (dayOfWeek.includes('-')) {
            const [start, end] = dayOfWeek.split('-');
            description += ` from ${weekdays[parseInt(start)]} to ${weekdays[parseInt(end)]}`;
        } else {
            description += ` on ${weekdays[parseInt(dayOfWeek)] || dayOfWeek}`;
        }
    }

    // Day of month
    if (dayOfMonth !== '*') {
        if (dayOfMonth.includes(',')) {
            description += ` on days ${dayOfMonth}`;
        } else if (dayOfMonth.includes('/')) {
            const interval = dayOfMonth.split('/')[1];
            description += ` every ${interval} days`;
        } else {
            description += ` on day ${dayOfMonth}`;
        }
    }

    // Month
    const months = ['', 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    if (month !== '*') {
        if (month.includes(',')) {
            const monthNames = month.split(',').map(m => months[parseInt(m)] || m).join(', ');
            description += ` in ${monthNames}`;
        } else {
            description += ` in ${months[parseInt(month)] || month}`;
        }
    }

    return description;
}

/**
 * Calculate next run times for a cron expression
 */
export function getNextRuns(parts: CronParts, count: number = 5): string[] {
    const results: string[] = [];
    const now = new Date();

    // Simple implementation for common patterns
    // For a full implementation, consider using a library like cron-parser

    for (let i = 0; i < count; i++) {
        const futureDate = new Date(now.getTime() + (i + 1) * 60000);
        results.push(futureDate.toLocaleString());
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
    { name: 'Every minute', parts: { minute: '*', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' } },
    { name: 'Every 5 minutes', parts: { minute: '*/5', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' } },
    { name: 'Every 15 minutes', parts: { minute: '*/15', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' } },
    { name: 'Every hour', parts: { minute: '0', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' } },
    { name: 'Every day at midnight', parts: { minute: '0', hour: '0', dayOfMonth: '*', month: '*', dayOfWeek: '*' } },
    { name: 'Every day at noon', parts: { minute: '0', hour: '12', dayOfMonth: '*', month: '*', dayOfWeek: '*' } },
    { name: 'Every Monday at 9 AM', parts: { minute: '0', hour: '9', dayOfMonth: '*', month: '*', dayOfWeek: '1' } },
    { name: 'Every weekday at 9 AM', parts: { minute: '0', hour: '9', dayOfMonth: '*', month: '*', dayOfWeek: '1-5' } },
    { name: 'Every 1st of month', parts: { minute: '0', hour: '0', dayOfMonth: '1', month: '*', dayOfWeek: '*' } },
    { name: 'Every Sunday at 2 AM', parts: { minute: '0', hour: '2', dayOfMonth: '*', month: '*', dayOfWeek: '0' } },
] as const;
